"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";
import { type CloudData, loadImg, noise, sample } from "./voxel-portrait";

// A loading state made of the portrait's OWN dots. While the page loads, the
// sampled dots gather into a dense CLUMP that orbits around the centred number,
// dragging a trail of scattering dots behind it like a meteor — the clump grows
// as the load % climbs. When `assemble` flips true those same dots converge into
// the halftone portrait and the camera + anchor ease to the hero's exact framing,
// so the overlay can dissolve onto an identical resting portrait. Five configs to
// pick from (see CFG below) — 1/2/3 clumps, tail length and looseness vary.
export type LoaderVariant = "meteor" | "twin" | "triad" | "comet" | "cloud";

type Placed = { x: number; y: number; z: number; present: number; scale: number };

const TAU = Math.PI * 2;
const ASSEMBLE_DUR = 1.5; // convergence length (s)
const STAGGER = 0.6; // per-dot assemble stagger (s)
const CAM_FAR = 5.8; // loader: pulled back so the formation fits the frame
const SPIN_RATE = 1.8; // orbit speed (rad/s) while loading — brisk, ~3.5s/turn

const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;
const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// ── Formation ───────────────────────────────────────────────────────────────
// One dense clump of dots orbits the centred number on a fixed circle, dragging
// a trail of scattering dots behind it (a meteor circling the %). Pure,
// deterministic, O(1) placement for ONE dot. Inputs:
//   t            dot index 0..1 — its station along the comet (0 head .. 1 tip)
//   rx, ry, rz   three stable randoms 0..1 (clump group + scatter)
//   prog         load progress 0..1
//   spin         orbit angle (rad), climbs while loading
//   reach        max radius (world units)
//   cfg          clump count, tail length/looseness, orbit direction
// Returns origin-centred world pos (xy = screen plane, z toward camera) plus
// `present` 0..1 (head shows from the start, tail fills in + fades as % climbs)
// and a per-dot `scale` (dense head reads big, trailing tail small). The clump
// rides at radius ~0.62*reach so the centred number always stays clear.
type ClumpCfg = {
  clumps: number; // how many clumps share the orbit (evenly spaced)
  tailArc: number; // tail length, in radians swept behind the head
  tailReach: number; // how far the tail disperses off the orbit line
  blob: number; // clump tightness (fraction of reach)
  dir: number; // orbit direction: +1 / -1
};

// Writes into `out` (reused per frame) to avoid per-dot allocation in the loop.
function orbitClump(
  out: Placed,
  t: number,
  rx: number,
  ry: number,
  rz: number,
  prog: number,
  spin: number,
  reach: number,
  cfg: ClumpCfg
): void {
  const R = 0.62 * reach; // orbit radius — clears the centre %
  const grow = 0.45 + 0.55 * prog; // clump + tail grow with the %
  const gf = rx * cfg.clumps;
  const g = Math.floor(gf);
  const zr = gf - g; // free extra random (fractional part) for depth
  const clumpPhase = (g / cfg.clumps) * TAU; // clumps evenly spaced around orbit
  const s = t ** 1.5; // station: dots crowd the head (small s)
  // head leads at `spin`; the tail trails behind, opposite the orbit direction
  const ang = clumpPhase + cfg.dir * (spin - s * cfg.tailArc * grow);
  const cx = Math.cos(ang) * R;
  const cy = Math.sin(ang) * R;
  // scatter: a tight ball at the head, dispersing down the tail (kept compact)
  const scatterR = cfg.blob * reach * grow * (0.5 + s * cfg.tailReach);
  const srad = Math.sqrt(rz) * scatterR;
  let x = cx + Math.cos(ry * TAU) * srad;
  let y = cy + Math.sin(ry * TAU) * srad;
  // keep the whole clump + trail inside the frame (pull strays to the rim)
  const dr = Math.sqrt(x * x + y * y);
  const capR = 1.12 * reach;
  if (dr > capR) {
    x *= capR / dr;
    y *= capR / dr;
  }
  out.x = x;
  out.y = y;
  out.z = (zr - 0.5) * Math.min(0.5, scatterR * 0.7);
  // head present from the start; the tail lengthens / fills in as the % climbs
  out.present = clamp01((prog * 1.2 + 0.25 - s) * 3) * (1 - 0.6 * s);
  out.scale = 0.4 + 0.75 * (1 - s);
}

const CFG: Record<LoaderVariant, ClumpCfg> = {
  // one clump, a tight comet tail — the canonical meteor circling the number
  meteor: { clumps: 1, tailArc: 1.7, tailReach: 0.85, blob: 0.18, dir: 1 },
  // two clumps opposite each other, each trailing
  twin: { clumps: 2, tailArc: 1.4, tailReach: 0.8, blob: 0.15, dir: 1 },
  // three smaller clumps, 120° apart, short trails (orbiting moons)
  triad: { clumps: 3, tailArc: 1.1, tailReach: 0.7, blob: 0.13, dir: -1 },
  // one clump with a long dramatic tail wrapping the number
  comet: { clumps: 1, tailArc: 3.4, tailReach: 1.1, blob: 0.16, dir: 1 },
  // one looser, larger clump with a slightly wider trail
  cloud: { clumps: 1, tailArc: 1.5, tailReach: 1.5, blob: 0.24, dir: 1 },
};

function LoaderCloud({
  src,
  depthSrc,
  variant,
  assemble,
  reduced,
  progress,
  assembleCamZ,
  assembleAnchorX,
}: {
  src: string;
  depthSrc: string;
  variant: LoaderVariant;
  assemble: boolean;
  reduced: boolean;
  progress: number; // 0..1 — load fraction (drives growth + dot reveal)
  assembleCamZ: number; // camera z once assembled (matches the hero)
  assembleAnchorX: number; // head x-shift once assembled (matches the hero)
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [data, setData] = useState<CloudData | null>(null);
  const obj = useRef(new THREE.Object3D());
  const rnd = useRef<Float32Array | null>(null);
  const assembleStart = useRef<number | null>(null);
  const formSpin = useRef(0);
  const farVP = useRef<{ w: number; h: number } | null>(null);
  const scratch = useRef<Placed>({ x: 0, y: 0, z: 0, present: 0, scale: 1 });

  useEffect(() => {
    let alive = true;
    Promise.all([loadImg(src), loadImg(depthSrc)])
      .then(([p, d]) => {
        if (alive) {
          setData(sample(p, d));
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [src, depthSrc]);

  // seed per-dot randomness + paint the first frame hidden (scale 0) so there's
  // never a flash of the assembled portrait or a single big dot
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!(mesh && data) || data.count === 0) {
      return;
    }
    const r = new Float32Array(data.count * 3);
    for (let i = 0; i < r.length; i++) {
      r[i] = noise(i);
    }
    rnd.current = r;
    const o = obj.current;
    const c = new THREE.Color();
    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      o.position.set(0, 0, 0);
      o.scale.setScalar(0); // start empty; the % fills them in
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      c.setRGB(data.col[i3], data.col[i3 + 1], data.col[i3 + 2]);
      mesh.setColorAt(i, c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    assembleStart.current = null;
    formSpin.current = 0;
  }, [data]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const d = data;
    const rr = rnd.current;
    if (!(mesh && d && rr) || d.count === 0) {
      return;
    }
    const dt = Math.min(delta, 0.04);
    const clock = state.clock.elapsedTime;
    const assembling = assemble || reduced;
    if (assembling && assembleStart.current === null) {
      assembleStart.current = clock;
    }
    const te =
      assembleStart.current === null ? 0 : clock - assembleStart.current;

    // pull the camera + anchor to the hero's framing as the dots resolve
    const camP = assembling ? easeInOut(Math.min(1, te / ASSEMBLE_DUR)) : 0;
    state.camera.position.z = CAM_FAR + (assembleCamZ - CAM_FAR) * camP;
    mesh.position.x = assembleAnchorX * camP;

    // gentle idle sway, phase-locked to the hero's (shared wall clock) so the
    // assembled head sits at the hero's exact rotation when the overlay
    // dissolves — no rotate-on-reveal jump
    const swayT = performance.now() / 1000;
    mesh.rotation.y = reduced ? 0 : Math.sin(swayT * 0.34) * 0.26;
    mesh.rotation.x = reduced ? 0 : Math.sin(swayT * 0.23) * 0.05;

    if (!farVP.current) {
      farVP.current = { w: state.viewport.width, h: state.viewport.height };
    }
    const reach = Math.min(farVP.current.w, farVP.current.h) * 0.42;

    if (!assembling) {
      formSpin.current += dt * SPIN_RATE; // the formation turns while loading
    }
    const spin = formSpin.current;
    const prog = clamp01(progress);
    const cfg = CFG[variant];
    const f = scratch.current;

    const o = obj.current;
    for (let i = 0; i < d.count; i++) {
      const i3 = i * 3;
      orbitClump(f, i / d.count, rr[i3], rr[i3 + 1], rr[i3 + 2], prog, spin, reach, cfg);
      const loadScale = d.scl[i] * f.scale * easeOutCubic(clamp01(f.present));
      if (assembling) {
        const hx = d.pos[i3];
        const hy = d.pos[i3 + 1];
        const hz = d.pos[i3 + 2];
        const stag = rr[i3] * STAGGER;
        const e = easeOutCubic(Math.max(0, Math.min(1, (te - stag) / ASSEMBLE_DUR)));
        o.position.set(
          f.x + (hx - f.x) * e,
          f.y + (hy - f.y) * e,
          f.z + (hz - f.z) * e
        );
        // ease the loading scale up to the portrait's resting scale (no pop)
        o.scale.setScalar(Math.max(0, loadScale + (d.scl[i] - loadScale) * e));
      } else {
        o.position.set(f.x, f.y, f.z);
        o.scale.setScalar(Math.max(0, loadScale));
      }
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
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
 * The portrait, as a loading state. Renders the sampled dots in a spinning,
 * growing formation, then (when `assemble` is set) converging into the halftone
 * portrait at the hero's framing so the preloader can dissolve onto an identical
 * resting head.
 */
export function PortraitLoader({
  className,
  src = "/portrait/cut.png",
  depthSrc = "/portrait/depth.jpg",
  variant = "meteor",
  assemble = false,
  progress = 1,
  assembleCamZ = 4.4,
  assembleAnchorX = 0,
}: {
  className?: string;
  src?: string;
  depthSrc?: string;
  variant?: LoaderVariant;
  assemble?: boolean;
  /** 0..1 — load fraction; grows the formation and reveals dots as it climbs. */
  progress?: number;
  /** camera z once assembled — match the hero so the hand-off is seamless. */
  assembleCamZ?: number;
  /** head x-shift once assembled — match the hero. */
  assembleAnchorX?: number;
}) {
  const reduced = !!useReducedMotion();
  return (
    <div className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 0, CAM_FAR], fov: 32 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.62} />
        <directionalLight intensity={1.05} position={[1.5, 1.5, 2.5]} />
        <LoaderCloud
          assemble={assemble}
          assembleAnchorX={assembleAnchorX}
          assembleCamZ={assembleCamZ}
          depthSrc={depthSrc}
          progress={reduced ? 1 : progress}
          reduced={reduced}
          src={src}
          variant={variant}
        />
      </Canvas>
    </div>
  );
}
