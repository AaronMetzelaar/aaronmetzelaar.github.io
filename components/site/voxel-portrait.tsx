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

import { cn } from "@/lib/utils";

// A halftone dot portrait from ONE photo + its depth map. Each dot's size
// encodes tone (dark = large → solid ink, light = small), sampled on a grid
// rotated ~30° so the lattice never reads as squares. Flat blue on white, a
// subtle depth gives parallax as it tilts, and a cursor sweep scatters the dots.
const WORK_W = 260;
const WORK_H = 325;
const GH = 150; // grid rows over the model height → dot density
const SCALE = 1.8; // model height in world units
const Z_AMP = 0.95; // relief depth — felt as parallax on tilt/sway
const DOT_MIN = 0.26; // dot radius range as a fraction of spacing
const DOT_MAX = 1.12; // dark dots overlap → solid ink (no lattice gaps)
const GRID_ANGLE = 0.52; // ~30° rotated grid → no axis-aligned squares

export type CloudData = {
  count: number;
  pos: Float32Array;
  scl: Float32Array;
  col: Float32Array;
  dark: Float32Array; // 0 (light) .. 1 (dark/structural) — drives which dots move
};

export function loadImg(src: string) {
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

export function sample(
  photo: HTMLImageElement,
  depth: HTMLImageElement
): CloudData {
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

  // Normalise the depth field over the cutout so the relief uses the FULL
  // Z range regardless of how flat/low-contrast the source depth map is —
  // otherwise a compressed depth map leaves the face nearly flat.
  let dMin = 1;
  let dMax = 0;
  for (let y = 0; y < WORK_H; y++) {
    for (let x = 0; x < WORK_W; x++) {
      if (pd[(y * WORK_W + x) * 4 + 3] > 128) {
        const v = dSm[y * WORK_W + x];
        if (v < dMin) {
          dMin = v;
        }
        if (v > dMax) {
          dMax = v;
        }
      }
    }
  }
  const dRange = Math.max(1e-3, dMax - dMin);

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
      // contrast-stretched depth → full relief, then a mild gamma to push the
      // nose/brow forward more than the flats so it reads as a face, not a slab
      const dn = (dv - dMin) / dRange;
      const Z = (dn ** 1.25 - 0.5) * Z_AMP;

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
  startX: number;
  startY: number;
  // touch gesture lock: undecided → turn (horizontal) or scroll (vertical)
  mode: "none" | "turn" | "scroll";
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  curX: number;
  curY: number;
};

const TAU = Math.PI * 2;

// deterministic 0..1 noise per index
export function noise(i: number) {
  const v = Math.sin(i * 127.1 + 311.7) * 43_758.545;
  return v - Math.floor(v);
}

function PortraitCloud({
  src,
  depthSrc,
  sway,
  reduced,
  anchorX,
  drag,
}: {
  src: string;
  depthSrc: string;
  sway: boolean;
  reduced: boolean;
  anchorX: number;
  drag: { current: DragState };
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [data, setData] = useState<CloudData | null>(null);
  const sim = useRef<{ disp: Float32Array; vel: Float32Array } | null>(null);
  const obj = useRef(new THREE.Object3D());
  const awake = useRef(false);
  const rnd = useRef<Float32Array | null>(null);

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
    for (let i = 0; i < data.count; i++) {
      o.position.set(data.pos[i * 3], data.pos[i * 3 + 1], data.pos[i * 3 + 2]);
      o.scale.setScalar(data.scl[i]);
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
  }, [data, anchorX]);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const d = data;
    const s = sim.current;
    const rr = rnd.current;
    // NB: don't bail on `reduced` here — the drag-to-turn rotation below must
    // still run. Reduced motion is honoured by `sway` being off and the
    // particle fling being gated, not by killing the whole loop.
    if (!(mesh && d && s && rr) || d.count === 0) {
      return;
    }
    const dt = Math.min(delta, 0.04);

    // drag-to-turn: rotation eases toward the drag target while held, then
    // springs back to front (0) on release; gentle idle sway layered on top.
    const dr = drag.current;
    const rotTargetY = dr.active ? dr.targetY : 0;
    const rotTargetX = dr.active ? dr.targetX : 0;
    dr.curY += (rotTargetY - dr.curY) * Math.min(1, dt * 9);
    dr.curX += (rotTargetX - dr.curX) * Math.min(1, dt * 9);
    // a touch more yaw so the deeper relief catches the light and reads as 3D.
    // Phase off a shared wall clock (not this canvas's elapsedTime) so the
    // preloader's portrait-loader can match this exact rotation at the hand-off
    // — otherwise the head snaps from the loader's front-facing assemble to the
    // hero's mid-sway angle when the overlay dissolves.
    const swayT = performance.now() / 1000;
    const swayY = sway ? Math.sin(swayT * 0.34) * 0.26 : 0;
    const swayX = sway ? Math.sin(swayT * 0.23) * 0.05 : 0;
    mesh.rotation.y = swayY + dr.curY;
    mesh.rotation.x = swayX + dr.curX;
    mesh.updateMatrixWorld();

    // turning flings the dots — direction carried from the drag, magnitude
    // skewed per-dot (most drift, a few fly far) so it reads organic, not a
    // uniform expansion; a faster turn throws harder. Springs pull them home.
    const throwSpeed = Math.hypot(dr.vx, dr.vy);
    const flinging =
      !reduced && dr.active && dr.mode !== "scroll" && throwSpeed > 1.2;
    const power = Math.min(throwSpeed / 52, 1.7);
    const dirX = dr.vx * 0.013;
    const dirY = -dr.vy * 0.013;
    dr.vx *= 0.55;
    dr.vy *= 0.55;
    if (flinging || Math.abs(dr.curY) > 1e-3 || Math.abs(dr.curX) > 1e-3) {
      awake.current = true;
    }

    // run the per-dot fling loop only while dots are displaced — and never
    // under reduced motion (the head still turns rigidly via mesh.rotation).
    if (reduced || !awake.current) {
      return;
    }

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
          (hx / rad) * mag * 0.55 +
          dirX * (0.5 + r1) +
          Math.cos(ang) * mag * 0.4;
        vel[i3 + 1] +=
          (hy / rad) * mag * 0.55 +
          dirY * (0.5 + r2) +
          Math.sin(ang) * mag * 0.4;
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

      o.position.set(hx + ox, hy + oy, hz + oz);
      o.scale.setScalar(Math.max(0, scl[i]));
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!flinging && maxMag < 1e-4) {
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
  src = "/portrait/cut.png",
  depthSrc = "/portrait/depth.jpg",
  anchorX = 0,
  camZ = 3.4,
}: {
  className?: string;
  src?: string;
  depthSrc?: string;
  anchorX?: number; // shift the head horizontally (full-bleed layouts)
  camZ?: number; // camera distance (zoom)
}) {
  const reduced = !!useReducedMotion();
  const drag = useRef<DragState>({
    active: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    mode: "none",
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    curX: 0,
    curY: 0,
  });

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // drag-to-turn is user-initiated, so it works even under reduced motion
    // (only the autonomous sway/fling are suppressed there).
    const d = drag.current;
    d.active = true;
    d.mode = "none";
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.vx = 0;
    d.vy = 0;
    // Mouse/pen: capture so a drag that leaves the element keeps turning.
    // Touch: do NOT capture — touch already has implicit capture, and an
    // explicit setPointerCapture here makes iOS Safari cancel the gesture on
    // the first move (which is exactly why the turn never fired on phones).
    if (e.pointerType !== "touch") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // some browsers throw if the pointer is already gone — safe to ignore
      }
    }
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

    if (e.pointerType === "touch") {
      // touch-action is none on the canvas, so the browser never scrolls or
      // cancels the gesture — we own it. Lock to an axis once it clears a small
      // threshold: horizontal turns the head, vertical scrolls the page (which
      // we drive ourselves, since the browser no longer will).
      if (d.mode === "none") {
        const tx = e.clientX - d.startX;
        const ty = e.clientY - d.startY;
        if (Math.abs(tx) > 6 || Math.abs(ty) > 6) {
          d.mode = Math.abs(tx) > Math.abs(ty) ? "turn" : "scroll";
        }
      }
      if (d.mode === "scroll") {
        d.vx = 0;
        d.vy = 0;
        window.scrollBy(0, -dy);
        return;
      }
      if (d.mode === "turn") {
        d.vx = dx;
        d.vy = dy;
        d.targetY = Math.max(-0.6, Math.min(0.6, d.targetY + dx * 0.006));
      }
      return;
    }

    // mouse / pen: free turn on both axes
    d.vx = dx;
    d.vy = dy;
    d.targetY = Math.max(-0.6, Math.min(0.6, d.targetY + dx * 0.005));
    d.targetX = Math.max(-0.32, Math.min(0.32, d.targetX - dy * 0.004));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    d.active = false;
    d.mode = "none";
    d.targetX = 0;
    d.targetY = 0;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore — capture may never have been taken (touch)
    }
  };

  return (
    <div
      aria-label="Halftone dot portrait of Aaron Metzelaar"
      className={cn(
        // touch-action:none on the canvas (the real touch target) so the
        // browser never claims the gesture — with pan-y, mobile browsers cancel
        // the touch on the first move and the turn never fires. We handle both
        // axes in JS instead: horizontal turns, vertical scrolls the page.
        "relative cursor-grab touch-none [&_canvas]:touch-none active:cursor-grabbing",
        className
      )}
      onPointerCancel={onUp}
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
        style={{ inset: 0, position: "absolute" }}
      >
        <ambientLight intensity={0.62} />
        <directionalLight intensity={1.05} position={[1.5, 1.5, 2.5]} />
        <PortraitCloud
          anchorX={anchorX}
          depthSrc={depthSrc}
          drag={drag}
          reduced={reduced}
          src={src}
          sway={!reduced}
        />
      </Canvas>
    </div>
  );
}
