"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";
import { type CloudData, loadImg, noise, sample } from "./_voxel-portrait";

// A loading state made of the portrait's OWN dots. While the page loads, the
// sampled dots hover in a loose cloud (variant decides how); when `assemble`
// flips true, those same dots converge into the halftone portrait. So the
// loader and the hero are literally the same dots — no hand-off, no double
// system. Three hover/assemble personalities: field, orbit, swarm.
export type LoaderVariant = "field" | "orbit" | "swarm";

const ASSEMBLE_DUR = 1.7; // convergence length (s)
const STAGGER = 0.7; // per-dot assemble stagger (s)
const CAM_FAR = 5.8; // hover: pulled back so the loose cloud fits the frame
const CAM_NEAR = 4.4; // assembled: zoomed in so the portrait fills it

const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;
const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
const easeOutBack = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const q = p - 1;
  return 1 + c3 * q ** 3 + c1 * q ** 2;
};

function LoaderCloud({
  src,
  depthSrc,
  variant,
  assemble,
  anchorX,
  reduced,
  progress,
}: {
  src: string;
  depthSrc: string;
  variant: LoaderVariant;
  assemble: boolean;
  anchorX: number;
  reduced: boolean;
  progress: number; // 0..1 — how many dots have arrived (the loaded fraction)
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [data, setData] = useState<CloudData | null>(null);
  const obj = useRef(new THREE.Object3D());
  const rnd = useRef<Float32Array | null>(null);
  const assembleStart = useRef<number | null>(null);
  const spin = useRef(0);
  // the visible world extent at CAM_FAR — captured once so the hover scatter
  // fills the whole screen rather than clustering in the middle
  const farVP = useRef<{ w: number; h: number } | null>(null);

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

  // seed per-dot randomness + paint the first frame at the hover scatter (so
  // there's never a flash of the assembled portrait or a single big dot)
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!(mesh && data) || data.count === 0) {
      return;
    }
    mesh.position.x = anchorX;
    const r = new Float32Array(data.count * 3);
    for (let i = 0; i < r.length; i++) {
      r[i] = noise(i);
    }
    rnd.current = r;
    const o = obj.current;
    const c = new THREE.Color();
    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      // a wide screen-spanning estimate for the first paint; the first frame
      // refines it to the exact viewport (avoids a flash of the assembled face)
      o.position.set(
        (r[i3] - 0.5) * 6.5,
        (r[i3 + 1] - 0.5) * 4,
        (r[i3 + 2] - 0.5) * 2.4
      );
      // start empty: no dot is present until the loaded % passes its threshold
      const arrive = Math.max(
        0,
        Math.min(1, (progress - noise(i + 7) * 0.92) / 0.16)
      );
      o.scale.setScalar(data.scl[i] * 0.6 * easeOutCubic(arrive));
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
    spin.current = 0;
  }, [data, anchorX]);

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
    const te = assembleStart.current === null ? 0 : clock - assembleStart.current;

    // pull the camera in as the dots resolve: a loose screen-filling cloud at
    // load, zooming to a framed portrait once assembled
    const camP = assembling ? easeInOut(Math.min(1, te / ASSEMBLE_DUR)) : 0;
    state.camera.position.z = CAM_FAR + (CAM_NEAR - CAM_FAR) * camP;

    // capture the far viewport once → scatter spans the entire screen
    if (!farVP.current) {
      farVP.current = {
        w: state.viewport.width,
        h: state.viewport.height,
      };
    }
    const fillW = farVP.current.w * 1.08;
    const fillH = farVP.current.h * 1.08;

    // orbit: the whole cloud rotates while hovering, then untwists to front
    if (variant === "orbit") {
      if (assembling) {
        spin.current += (0 - spin.current) * Math.min(1, dt * 2.2);
      } else {
        spin.current += dt * 0.25;
      }
      mesh.rotation.y = spin.current;
    }

    const o = obj.current;
    for (let i = 0; i < d.count; i++) {
      const i3 = i * 3;
      const hx = d.pos[i3];
      const hy = d.pos[i3 + 1];
      const hz = d.pos[i3 + 2];
      const r0 = rr[i3];
      const r1 = rr[i3 + 1];
      const r2 = rr[i3 + 2];

      // scatter anchor: an absolute position spread across the WHOLE screen
      // (not relative to the head), so the loading cloud fills the viewport
      let ox = (r0 - 0.5) * fillW;
      let oy = (r1 - 0.5) * fillH;
      let oz = (r2 - 0.5) * 2.4;

      // per-variant hover life
      let dx = 0;
      let dy = 0;
      let dz = 0;
      if (variant === "field") {
        dx = Math.sin(clock * 0.6 + r0 * 6.28) * 0.13;
        dy = Math.cos(clock * 0.5 + r1 * 6.28) * 0.13;
        dz = Math.sin(clock * 0.4 + r2 * 6.28) * 0.1;
      } else if (variant === "orbit") {
        dx = Math.sin(clock * 0.5 + r0 * 6.28) * 0.07;
        dy = Math.cos(clock * 0.45 + r1 * 6.28) * 0.07;
      } else {
        // swarm: the whole field breathes in/out + a fine jitter
        const breathe = 1 + Math.sin(clock * 0.8) * 0.1;
        ox *= breathe;
        oy *= breathe;
        oz *= breathe;
        dx = Math.sin(clock * 1.5 + r0 * 20) * 0.06;
        dy = Math.cos(clock * 1.7 + r1 * 20) * 0.06;
        dz = Math.sin(clock * 1.3 + r2 * 20) * 0.05;
      }

      // absolute scatter position (fills screen), converging to the head (home)
      const ax = ox + dx;
      const ay = oy + dy;
      const az = oz + dz;

      // arrival: each dot spawns as the loaded % passes its own threshold,
      // flying in from a random direction to its swarm spot and popping to size.
      // 0% → no dots; 100% → the full set, ready to assemble.
      const arrive = Math.max(
        0,
        Math.min(1, (progress - noise(i + 7) * 0.92) / 0.16)
      );
      // dots simply fade up in place as the % passes them — no flying around;
      // once assembling, all are present
      const grow = assembling ? 1 : easeOutCubic(arrive);

      let scale = d.scl[i] * 0.6;
      if (assembling) {
        const stag = r0 * STAGGER;
        const p = Math.max(0, Math.min(1, (te - stag) / ASSEMBLE_DUR));
        const e = variant === "swarm" ? easeOutBack(p) : easeOutCubic(p);
        o.position.set(
          ax + (hx - ax) * e,
          ay + (hy - ay) * e,
          az + (hz - az) * e
        );
        scale = d.scl[i] * (0.6 + 0.4 * Math.max(0, Math.min(1, e)));
      } else {
        // materialise right at the swarm spot — it just drifts, never shoots
        o.position.set(ax, ay, az);
      }
      o.scale.setScalar(Math.max(0, scale * grow));
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
 * The portrait, as a loading state. Renders the sampled dots hovering, then
 * (when `assemble` is set) converging into the halftone portrait.
 */
export function PortraitLoader({
  className,
  src = "/portrait-cut.png",
  depthSrc = "/portrait-depth.jpg",
  variant = "field",
  assemble = false,
  anchorX = 0,
  progress = 1,
}: {
  className?: string;
  src?: string;
  depthSrc?: string;
  variant?: LoaderVariant;
  assemble?: boolean;
  anchorX?: number;
  /** 0..1 — fraction of dots present (drives the "dots arrive" loading fill). */
  progress?: number;
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
          anchorX={anchorX}
          assemble={assemble}
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
