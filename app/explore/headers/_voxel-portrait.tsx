"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

import { onReveal } from "@/lib/page-reveal";
import { cn } from "@/lib/utils";

// A halftone dot portrait from ONE photo + its depth map. Each dot's size
// encodes tone (dark = large → solid ink, light = small), sampled on a grid
// rotated ~30° so the lattice never reads as squares. Flat blue on white, a
// subtle depth gives parallax as it tilts, and a cursor sweep scatters the dots.
const WORK_W = 260;
const WORK_H = 325;
const GH = 150; // grid rows over the model height → dot density
const SCALE = 1.8; // model height in world units
const Z_AMP = 0.46; // relief depth — felt as parallax on tilt/sway
const DOT_MIN = 0.26; // dot radius range as a fraction of spacing
const DOT_MAX = 1.12; // dark dots overlap → solid ink (no lattice gaps)
const GRID_ANGLE = 0.52; // ~30° rotated grid → no axis-aligned squares

type CloudData = {
  count: number;
  pos: Float32Array;
  scl: Float32Array;
  col: Float32Array;
  dark: Float32Array; // 0 (light) .. 1 (dark/structural) — drives which dots move
};

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}

function rasterise(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = WORK_W;
  c.height = WORK_H;
  const o = c.getContext("2d");
  if (!o) {
    return null;
  }
  const ir = img.width / img.height;
  const br = WORK_W / WORK_H;
  let dw = WORK_W;
  let dh = WORK_H;
  if (ir > br) {
    dw = WORK_W;
    dh = dw / ir;
  } else {
    dh = WORK_H;
    dw = dh * ir;
  }
  o.drawImage(img, (WORK_W - dw) / 2, (WORK_H - dh) / 2, dw, dh);
  return o.getImageData(0, 0, WORK_W, WORK_H).data;
}

// light separable blur over the depth field so the relief isn't stepped
function blurField(src: Float32Array, r: number) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  for (let y = 0; y < WORK_H; y++) {
    for (let x = 0; x < WORK_W; x++) {
      let s = 0;
      let n = 0;
      for (let k = -r; k <= r; k++) {
        const xx = x + k;
        if (xx >= 0 && xx < WORK_W) {
          s += src[y * WORK_W + xx];
          n++;
        }
      }
      tmp[y * WORK_W + x] = s / n;
    }
  }
  for (let y = 0; y < WORK_H; y++) {
    for (let x = 0; x < WORK_W; x++) {
      let s = 0;
      let n = 0;
      for (let k = -r; k <= r; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < WORK_H) {
          s += tmp[yy * WORK_W + x];
          n++;
        }
      }
      out[y * WORK_W + x] = s / n;
    }
  }
  return out;
}

// blue ink ramp 0..1 → [r,g,b]
function tone(t: number) {
  const dark = [0.04, 0.07, 0.26];
  const light = [0.45, 0.55, 1];
  return [
    dark[0] + (light[0] - dark[0]) * t,
    dark[1] + (light[1] - dark[1]) * t,
    dark[2] + (light[2] - dark[2]) * t,
  ];
}

function sample(photo: HTMLImageElement, depth: HTMLImageElement): CloudData {
  const empty = {
    count: 0,
    pos: new Float32Array(0),
    scl: new Float32Array(0),
    col: new Float32Array(0),
    dark: new Float32Array(0),
  };
  const pd = rasterise(photo);
  const dd = rasterise(depth);
  if (!(pd && dd)) {
    return empty;
  }

  // bbox of the cutout (alpha) so the portrait is centred and scaled
  let l = WORK_W;
  let r = 0;
  let t = WORK_H;
  let b = 0;
  for (let y = 0; y < WORK_H; y++) {
    for (let x = 0; x < WORK_W; x++) {
      if (pd[(y * WORK_W + x) * 4 + 3] > 128) {
        l = Math.min(l, x);
        r = Math.max(r, x);
        t = Math.min(t, y);
        b = Math.max(b, y);
      }
    }
  }
  if (r < l) {
    return empty;
  }
  const bh = Math.max(1, b - t);
  const cx = (l + r) / 2;
  const cyMid = t + bh / 2;

  const dLum = new Float32Array(WORK_W * WORK_H);
  for (let i = 0; i < dLum.length; i++) {
    dLum[i] =
      (0.299 * dd[i * 4] + 0.587 * dd[i * 4 + 1] + 0.114 * dd[i * 4 + 2]) / 255;
  }
  const dSm = blurField(dLum, 2);

  const step = WORK_H / GH;
  const spacing = (step / bh) * SCALE; // real world spacing → solid coverage
  const ca = Math.cos(GRID_ANGLE);
  const sa = Math.sin(GRID_ANGLE);
  const reach = Math.ceil((r - l + bh) / step) + 2;

  const P: number[] = [];
  const S: number[] = [];
  const C: number[] = [];
  const D: number[] = [];

  for (let gy = -reach; gy <= reach; gy++) {
    for (let gx = -reach; gx <= reach; gx++) {
      const u = gx * step;
      const v = gy * step;
      const sx = Math.round(cx + u * ca - v * sa);
      const sy = Math.round(cyMid + u * sa + v * ca);
      if (sx < 0 || sx >= WORK_W || sy < 0 || sy >= WORK_H) {
        continue;
      }
      const i = sy * WORK_W + sx;
      if (pd[i * 4 + 3] <= 128) {
        continue;
      }
      const lum =
        (0.299 * pd[i * 4] + 0.587 * pd[i * 4 + 1] + 0.114 * pd[i * 4 + 2]) /
        255;
      const dv = dSm[i];
      const dark = Math.max(0, Math.min(1, 1 - lum / 0.92));

      const X = ((sx - cx) / bh) * SCALE;
      const Y = ((cyMid - sy) / bh) * SCALE;
      const Z = (dv - 0.5) * Z_AMP;

      P.push(X, Y, Z);
      S.push(spacing * (DOT_MIN + (DOT_MAX - DOT_MIN) * dark));
      const [cr, cg, cb] = tone(0.18 + 0.82 * lum);
      C.push(cr, cg, cb);
      D.push(dark);
    }
  }

  return {
    count: S.length,
    pos: new Float32Array(P),
    scl: new Float32Array(S),
    col: new Float32Array(C),
    dark: new Float32Array(D),
  };
}

const STIFFNESS = 26;
const DAMPING = 0.9;

type DragState = {
  active: boolean;
  lastX: number;
  lastY: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  curX: number;
  curY: number;
};

// motion modes — entrances build the portrait on load, then it rests
export type Motion =
  | "none"
  | "assemble"
  | "rise"
  | "scan"
  | "develop"
  | "depth";

const ENTRANCES = new Set<Motion>([
  "assemble",
  "rise",
  "scan",
  "develop",
  "depth",
]);
const DUR = 1.9; // entrance duration (s)
const STAG = 0.9; // entrance per-dot stagger (s)
const ENTR_END = DUR + STAG + 0.4;

// ambient modes — continuous, *partial* motion layered on top of the resting
// portrait. A sparse subset of dots peels off and floats/falls away, fading to
// white (the page colour) so it truly dissolves, then silently respawns home.
// The whole head also turns gently left↔right so the depth reads as 3D.
// Only a small fraction is ever in flight at once, so the picture stays clear.
export type Ambient =
  | "none"
  | "shed" // dots peel off the sides and drift outward
  | "fall" // dots detach and fall, fading toward the bottom
  | "rise" // light dots lift away like embers
  | "evaporate" // rim dots dissolve radially outward
  | "drift" // light dots wander off in random directions
  | "stream" // a steady trickle sheds from the lower edge
  | "breeze" // the head leans on a breeze; trailing dots peel off
  | "lift" // dots near the base rise up and fade
  | "sparkle" // dots wink out in place and return
  | "sway"; // no shedding — just the left↔right depth turn

const TAU = Math.PI * 2;

// per-dot lifecycle: rest at home for `dwell` of the cycle (no gap in the
// portrait), then travel + fade over the remainder. Returns 0..1 (0 = home).
function lifecycle(phase: number, ct: number, rate: number, dwell: number) {
  const cyc = (ct * rate + phase) % 1;
  const c = cyc < 0 ? cyc + 1 : cyc;
  return c < dwell ? 0 : (c - dwell) / (1 - dwell);
}

// deterministic 0..1 noise per index
function noise(i: number) {
  const v = Math.sin(i * 127.1 + 311.7) * 43_758.545;
  return v - Math.floor(v);
}

function PortraitCloud({
  src,
  depthSrc,
  sway,
  motion,
  ambient,
  reduced,
  anchorX,
  spread,
  drag,
  waitForReveal,
}: {
  src: string;
  depthSrc: string;
  sway: boolean;
  motion: Motion;
  ambient: Ambient;
  reduced: boolean;
  anchorX: number;
  spread: number;
  drag: { current: DragState };
  waitForReveal: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [data, setData] = useState<CloudData | null>(null);
  const sim = useRef<{ disp: Float32Array; vel: Float32Array } | null>(null);
  const obj = useRef(new THREE.Object3D());
  const awake = useRef(false);
  const rnd = useRef<Float32Array | null>(null);
  const t0 = useRef<number | null>(null);
  const colScratch = useRef(new THREE.Color());
  // gated entrances stay hidden (scale 0) until the preloader hands off
  const started = useRef(!waitForReveal);

  const isEntrance = ENTRANCES.has(motion) && !reduced;
  const ambientOn = ambient !== "none" && !reduced;

  useEffect(() => {
    if (!waitForReveal) {
      return;
    }
    return onReveal(() => {
      started.current = true;
    });
  }, [waitForReveal]);

  useEffect(() => {
    let alive = true;
    Promise.all([loadImg(src), loadImg(depthSrc)])
      .then(([p, d]) => {
        if (alive) {
          setData(sample(p, d));
        }
      })
      .catch(() => {
        // ignore load failure
      });
    return () => {
      alive = false;
    };
  }, [src, depthSrc]);

  // useLayoutEffect → matrices are set before the first paint (no flash of a
  // single big dot from the default identity matrices)
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!(mesh && data) || data.count === 0) {
      return;
    }
    mesh.position.x = anchorX; // shift the head within a full-bleed canvas
    const o = obj.current;
    const c = new THREE.Color();
    // entrances start hidden (scale 0) so there's no flash of the full portrait
    const startScale = isEntrance ? 0 : 1;
    for (let i = 0; i < data.count; i++) {
      o.position.set(data.pos[i * 3], data.pos[i * 3 + 1], data.pos[i * 3 + 2]);
      o.scale.setScalar(data.scl[i] * startScale);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      c.setRGB(data.col[i * 3], data.col[i * 3 + 1], data.col[i * 3 + 2]);
      mesh.setColorAt(i, c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    const r = new Float32Array(data.count * 3);
    for (let i = 0; i < r.length; i++) {
      r[i] = noise(i);
    }
    rnd.current = r;
    sim.current = {
      disp: new Float32Array(data.count * 3),
      vel: new Float32Array(data.count * 3),
    };
  }, [data, isEntrance, anchorX]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const d = data;
    const s = sim.current;
    const rr = rnd.current;
    if (!(mesh && d && s && rr) || d.count === 0 || reduced) {
      return;
    }
    // hold a gated entrance hidden until the preloader's reveal hand-off
    if (isEntrance && !started.current) {
      return;
    }
    const dt = Math.min(delta, 0.04);
    const clock = state.clock.elapsedTime;
    if (t0.current === null) {
      t0.current = clock;
    }
    const te = clock - t0.current; // seconds since this motion started

    // drag-to-turn: rotation eases toward the drag target while held, then
    // springs back to front (0) on release; gentle idle sway layered on top.
    const dr = drag.current;
    const rotTargetY = dr.active ? dr.targetY : 0;
    const rotTargetX = dr.active ? dr.targetX : 0;
    dr.curY += (rotTargetY - dr.curY) * Math.min(1, dt * 9);
    dr.curX += (rotTargetX - dr.curX) * Math.min(1, dt * 9);
    const swayY = sway ? Math.sin(clock * 0.34) * 0.2 : 0;
    const swayX = sway ? Math.sin(clock * 0.23) * 0.04 : 0;
    mesh.rotation.y = swayY + dr.curY;
    mesh.rotation.x = swayX + dr.curX;
    mesh.updateMatrixWorld();

    // turning flings the dots — direction carried from the drag, magnitude
    // skewed per-dot (most drift, a few fly far) so it reads organic, not a
    // uniform expansion; a faster turn throws harder. Springs pull them home.
    const throwSpeed = Math.hypot(dr.vx, dr.vy);
    const flinging = dr.active && throwSpeed > 1.2;
    const power = Math.min(throwSpeed / 52, 1.7);
    const dirX = dr.vx * 0.013;
    const dirY = -dr.vy * 0.013;
    dr.vx *= 0.55;
    dr.vy *= 0.55;
    if (flinging || Math.abs(dr.curY) > 1e-3 || Math.abs(dr.curX) > 1e-3) {
      awake.current = true;
    }

    const entrancePlaying = isEntrance && te < ENTR_END;
    // run the per-dot loop only when something is animating
    if (!(entrancePlaying || awake.current || ambientOn)) {
      return;
    }

    const ct = clock; // continuous clock for ambient loops
    // every ambient except the pure depth-turn fades dots toward the page white
    const fadeColor = ambientOn && ambient !== "sway";
    const cs = colScratch.current;
    const pos = d.pos;
    const scl = d.scl;
    const disp = s.disp;
    const vel = s.vel;
    const o = obj.current;
    let maxMag = 0;

    for (let i = 0; i < d.count; i++) {
      const i3 = i * 3;
      const hx = pos[i3];
      const hy = pos[i3 + 1];
      const hz = pos[i3 + 2];
      let ox = disp[i3];
      let oy = disp[i3 + 1];
      let oz = disp[i3 + 2];

      // --- fling: radial burst + directional throw + per-dot turbulence,
      //     with a wide per-dot magnitude (cubic) so a few dots fly far ---
      if (flinging) {
        const r0 = rr[i3];
        const r1 = rr[i3 + 1];
        const r2 = rr[i3 + 2];
        const rad = Math.sqrt(hx * hx + hy * hy + hz * hz) + 1e-3;
        const mag = power * (0.12 + 1.7 * r0 * r0 * r0);
        const ang = (r1 + r2) * TAU;
        vel[i3] +=
          (hx / rad) * mag * 0.55 + dirX * (0.5 + r1) + Math.cos(ang) * mag * 0.4;
        vel[i3 + 1] +=
          (hy / rad) * mag * 0.55 + dirY * (0.5 + r2) + Math.sin(ang) * mag * 0.4;
        vel[i3 + 2] += (hz / rad) * mag * 0.5 + (r0 - 0.5) * mag * 0.9;
      }
      vel[i3] += -ox * STIFFNESS * dt;
      vel[i3 + 1] += -oy * STIFFNESS * dt;
      vel[i3 + 2] += -oz * STIFFNESS * dt;
      vel[i3] *= DAMPING;
      vel[i3 + 1] *= DAMPING;
      vel[i3 + 2] *= DAMPING;
      ox += vel[i3] * dt;
      oy += vel[i3 + 1] * dt;
      oz += vel[i3 + 2] * dt;
      disp[i3] = ox;
      disp[i3 + 1] = oy;
      disp[i3 + 2] = oz;
      maxMag = Math.max(
        maxMag,
        Math.abs(ox) + Math.abs(oy) + Math.abs(oz) + Math.abs(vel[i3])
      );

      // --- motion mode: extra offset (mx,my,mz) + scale multiplier (sm) ---
      let mx = 0;
      let my = 0;
      let mz = 0;
      let sm = 1;
      const r0 = rr[i3];
      const r1 = rr[i3 + 1];
      const r2 = rr[i3 + 2];

      if (isEntrance) {
        const delay =
          motion === "rise" ? ((hy + 0.95) / 1.9) * STAG : r0 * STAG;
        const p = Math.max(0, Math.min(1, (te - delay) / DUR));
        const e = 1 - (1 - p) * (1 - p) * (1 - p); // easeOutCubic
        if (motion === "assemble") {
          // start spread across the whole canvas (the page), converging home
          const k = 1 - e;
          mx = (r0 - 0.5) * 2.4 * spread * k;
          my = (r1 - 0.5) * 1.7 * spread * k;
          mz = (r2 - 0.5) * 1.2 * spread * k;
          sm = 0.4 + 0.6 * e;
        } else if (motion === "rise") {
          my = -1.9 * (1 - e);
          sm = 0.3 + 0.7 * e;
        } else if (motion === "depth") {
          mz = -2.8 * (1 - e);
          sm = 0.1 + 0.9 * e;
        } else if (motion === "develop") {
          sm = e;
        } else if (motion === "scan") {
          const lineY = 0.98 - (te / (DUR + 0.4)) * 2.1; // sweep top → bottom
          const below = hy - lineY;
          const rev = Math.max(0, Math.min(1, (below + 0.05) / 0.14));
          const edge = Math.exp(-(below * 11 * (below * 11)));
          sm = rev * (1 + edge);
        }
      }

      // --- ambient mode: a sparse subset peels away + fades; picture stays ---
      // fade 0 = solid home colour, 1 = fully dissolved into the page (white)
      let fade = 0;
      if (ambientOn) {
        const dk = d.dark[i]; // 0 light/background .. 1 dark/structural
        switch (ambient) {
          case "shed": {
            // side dots peel outward and float away
            if (Math.abs(hx) > 0.26 && r1 > 0.62) {
              const life = lifecycle(r0, ct, 0.16, 0.55);
              const e = life * life;
              mx += Math.sign(hx) * e * 0.9;
              my += (r2 - 0.4) * e * 0.4;
              fade = life;
            }
            break;
          }
          case "fall": {
            // dots detach and fall, fading toward the bottom (gravity-eased)
            if (r1 > 0.8 && hy < 0.45) {
              const life = lifecycle(r0, ct, 0.2, 0.5);
              my -= life * life * 1.7;
              mx += (r2 - 0.5) * life * 0.35;
              fade = life;
            }
            break;
          }
          case "rise": {
            // light dots lift away like embers
            if (dk < 0.32 && r1 > 0.55) {
              const life = lifecycle(r0, ct, 0.16, 0.5);
              my += life * 1.4;
              mx += Math.sin(life * 6 + r0 * TAU) * 0.12;
              fade = life;
            }
            break;
          }
          case "evaporate": {
            // rim dots dissolve straight outward from the centre
            const rad = Math.sqrt(hx * hx + hy * hy * 0.85) + 1e-3;
            if (rad > 0.48 && r1 > 0.55) {
              const life = lifecycle(r0, ct, 0.18, 0.5);
              const e = life * life;
              mx += (hx / rad) * e * 0.9;
              my += (hy / rad) * e * 0.9;
              fade = life;
            }
            break;
          }
          case "drift": {
            // light dots wander off in their own random direction
            if (dk < 0.3 && r1 > 0.5) {
              const life = lifecycle(r0, ct, 0.13, 0.45);
              const a = r2 * TAU;
              mx += Math.cos(a) * life * 0.8;
              my += Math.sin(a) * life * 0.8;
              fade = life;
            }
            break;
          }
          case "stream": {
            // a steady trickle sheds from the lower edge
            if (hy < -0.15 && r1 > 0.45) {
              const life = lifecycle(r0, ct, 0.34, 0.25);
              my -= life * life * 1.6;
              mx += Math.sin(life * 5 + r0 * TAU) * 0.18;
              fade = life;
            }
            break;
          }
          case "breeze": {
            // the whole head leans on a breeze; trailing-edge dots peel off
            const gust = Math.sin(ct * 0.5);
            mx += gust * 0.05 * (0.4 + 0.6 * (hy + 1) * 0.5);
            if (hx * gust > 0.2 && r1 > 0.7) {
              const life = lifecycle(r0, ct, 0.18, 0.5);
              mx += Math.sign(hx) * life * life * 0.7;
              my += (r2 - 0.3) * life * 0.4;
              fade = life;
            }
            break;
          }
          case "lift": {
            // dots near the base rise up and fade
            if (hy < -0.05 && r1 > 0.72) {
              const life = lifecycle(r0, ct, 0.15, 0.5);
              my += life * 1.2;
              mx += (r2 - 0.5) * life * 0.3;
              fade = life;
            }
            break;
          }
          case "sparkle": {
            // a few dots wink out in place and return
            if (r1 > 0.88) {
              const cyc = (ct * 0.5 + r0) % 1;
              const c = cyc < 0 ? cyc + 1 : cyc;
              fade = c < 0.5 ? 0 : Math.sin((c - 0.5) * TAU * 0.5) ** 2 * 0.5;
            }
            break;
          }
          default:
            break; // "sway" — depth turn only, handled by the sway block
        }
      }

      sm *= 1 - fade;
      o.position.set(hx + ox + mx, hy + oy + my, hz + oz + mz);
      o.scale.setScalar(scl[i] * Math.max(0, sm));
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);

      if (fadeColor) {
        // lerp toward page-white so a departing dot dissolves, not just shrinks
        const cr = d.col[i3];
        const cg = d.col[i3 + 1];
        const cb = d.col[i3 + 2];
        cs.setRGB(
          cr + (1 - cr) * fade,
          cg + (1 - cg) * fade,
          cb + (1 - cb) * fade
        );
        mesh.setColorAt(i, cs);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (fadeColor && mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    if (!(entrancePlaying || flinging) && maxMag < 1e-4) {
      awake.current = false;
    }
  });

  if (!data || data.count === 0) {
    return null;
  }

  return (
    <instancedMesh
      args={[undefined, undefined, data.count]}
      key={data.count}
      ref={meshRef}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial flatShading metalness={0} roughness={0.9} />
    </instancedMesh>
  );
}

/**
 * Halftone dot portrait — one photo + depth map, sampled on a rotated grid so
 * dot size encodes tone. Flat blue on white, subtle depth for parallax; tilt
 * it and sweep the cursor to scatter the dots.
 */
export function VoxelPortrait({
  className,
  src = "/portrait-cut.png",
  depthSrc = "/portrait-depth.jpg",
  motion = "none",
  ambient = "none",
  anchorX = 0,
  camZ = 3.4,
  spread = 2.6,
  waitForReveal = false,
}: {
  className?: string;
  src?: string;
  depthSrc?: string;
  motion?: Motion; // one-shot entrance on load
  ambient?: Ambient; // continuous motion layered on the resting portrait
  anchorX?: number; // shift the head horizontally (full-bleed layouts)
  camZ?: number; // camera distance (zoom)
  spread?: number; // assemble fly-in reach
  waitForReveal?: boolean; // hold the entrance until the page-reveal hand-off
}) {
  const reduced = !!useReducedMotion();
  const drag = useRef<DragState>({
    active: false,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    curX: 0,
    curY: 0,
  });

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced) {
      return;
    }
    const d = drag.current;
    d.active = true;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.vx = 0;
    d.vy = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) {
      return;
    }
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.vx = dx;
    d.vy = dy;
    d.targetY = Math.max(-0.6, Math.min(0.6, d.targetY + dx * 0.005));
    d.targetX = Math.max(-0.32, Math.min(0.32, d.targetX - dy * 0.004));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    d.active = false;
    d.targetX = 0;
    d.targetY = 0;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      aria-label="Halftone dot portrait of Aaron Metzelaar"
      className={cn(
        "relative cursor-grab touch-none active:cursor-grabbing",
        className
      )}
      onPointerDown={onDown}
      onPointerLeave={onUp}
      onPointerMove={onMove}
      onPointerUp={onUp}
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, camZ], fov: 32 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.62} />
        <directionalLight intensity={1.05} position={[1.5, 1.5, 2.5]} />
        <PortraitCloud
          ambient={ambient}
          anchorX={anchorX}
          depthSrc={depthSrc}
          drag={drag}
          motion={motion}
          reduced={reduced}
          spread={spread}
          src={src}
          sway={!reduced}
          waitForReveal={waitForReveal}
        />
      </Canvas>
    </div>
  );
}
