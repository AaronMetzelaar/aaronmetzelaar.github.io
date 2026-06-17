"use client";

import { useState } from "react";

import {
  type ArchNode,
  archNodes,
  type Layer,
  layers,
  stages,
} from "@/content/architecture";
import { cn } from "@/lib/utils";

const byId = new Map(archNodes.map((n) => [n.id, n]));
const layerLabel = (id: Layer) => layers.find((l) => l.id === id)?.label ?? id;
const firstStage = (n: ArchNode) =>
  Math.min(...n.stages.map((s) => stages.indexOf(s)));
const stageRange = (n: ArchNode) =>
  n.stages.length === 1 ? n.stages[0] : `${n.stages[0]} → ${n.stages.at(-1)}`;

const edges = archNodes.flatMap((n) =>
  (n.deps ?? []).map((to) => ({ from: n.id, to }))
);

function connectionsOf(id: string | null) {
  const set = new Set<string>();
  if (!id) {
    return set;
  }
  for (const e of edges) {
    if (e.from === id) {
      set.add(e.to);
    }
    if (e.to === id) {
      set.add(e.from);
    }
  }
  return set;
}

// ── layout: lifecycle on x (stage columns), layer on y (lanes) ──
const X0 = 16;
const X1 = 89;
const stageX = (idx: number) => X0 + (idx / (stages.length - 1)) * (X1 - X0);
// lanes top→bottom; context sits at the base as the foundation
const LANE_Y: Record<Layer, number> = {
  hook: 18,
  reviewer: 40,
  skill: 60,
  context: 80,
};

type Pt = { x: number; y: number };
const pos: Record<string, Pt> = (() => {
  const out: Record<string, Pt> = {};
  const groups = new Map<string, ArchNode[]>();
  for (const n of archNodes) {
    const k = `${n.layer}:${firstStage(n)}`;
    const arr = groups.get(k) ?? [];
    arr.push(n);
    groups.set(k, arr);
  }
  for (const n of archNodes) {
    const g = groups.get(`${n.layer}:${firstStage(n)}`) ?? [n];
    const spread = g.indexOf(n) - (g.length - 1) / 2;
    out[n.id] = { x: stageX(firstStage(n)), y: LANE_Y[n.layer] + spread * 7 };
  }
  return out;
})();

function curve(a: Pt, b: Pt) {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export function ArchitectureMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const activeId = hovered ?? selected;
  const active = activeId ? (byId.get(activeId) ?? null) : null;
  const connected = connectionsOf(activeId);
  const onSelect = (id: string) => setSelected((c) => (c === id ? null : id));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_minmax(260px,300px)] lg:gap-12">
      <div className="min-w-0 overflow-x-auto">
        <div
          className="relative min-w-[640px] font-terminal"
          style={{ height: "clamp(380px, 44vw, 540px)" }}
        >
          {/* stage guides + curves */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <title>lifecycle</title>
            {stages.map((s, i) => (
              <line
                key={s}
                stroke="var(--border)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                x1={stageX(i)}
                x2={stageX(i)}
                y1={8}
                y2={90}
              />
            ))}
            {edges.map((e) => {
              const a = pos[e.from];
              const b = pos[e.to];
              if (!(a && b)) {
                return null;
              }
              const lit = activeId === e.from || activeId === e.to;
              return (
                <path
                  d={curve(a, b)}
                  fill="none"
                  key={`${e.from}-${e.to}`}
                  stroke="var(--accent)"
                  strokeOpacity={lit ? 0.85 : activeId ? 0.04 : 0.13}
                  strokeWidth={lit ? 1.5 : 1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* stage labels (top) */}
          {stages.map((s, i) => (
            <span
              className="-translate-x-1/2 absolute text-[0.56rem] text-muted-fg uppercase tracking-[0.16em]"
              key={s}
              style={{ left: `${stageX(i)}%`, top: "1%" }}
            >
              {s}
            </span>
          ))}

          {/* lane labels (left) */}
          {layers.map((l) => (
            <span
              className="absolute left-0 text-[0.56rem] text-muted-fg/70 uppercase tracking-[0.18em]"
              key={l.id}
              style={{ top: `${LANE_Y[l.id]}%`, transform: "translateY(-50%)" }}
            >
              {l.label}
            </span>
          ))}

          {/* nodes */}
          {archNodes.map((n) => {
            const p = pos[n.id];
            const state = activeId
              ? activeId === n.id
                ? "active"
                : connected.has(n.id)
                  ? "conn"
                  : "dim"
              : "idle";
            return (
              <Node
                key={n.id}
                node={n}
                onHover={setHovered}
                onSelect={onSelect}
                pt={p}
                state={state}
              />
            );
          })}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-max">
        <DetailPanel node={active} onSelect={onSelect} />
      </aside>
    </div>
  );
}

type NState = "idle" | "active" | "conn" | "dim";

function Node({
  node,
  pt,
  state,
  onSelect,
  onHover,
}: {
  node: ArchNode;
  pt: Pt;
  state: NState;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const lit = state === "active" || state === "conn";
  const isHook = node.layer === "hook";
  return (
    <button
      className={cn(
        "-translate-x-1/2 -translate-y-1/2 absolute flex w-[88px] flex-col items-center gap-1.5 text-center transition-opacity duration-200",
        state === "dim" && "opacity-25"
      )}
      onClick={() => onSelect(node.id)}
      onFocus={() => onHover(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 rounded-full border transition-all",
          isHook ? "border-accent bg-bg" : "border-accent bg-accent",
          state === "active"
            ? "h-3 w-3 ring-4 ring-accent/15"
            : state === "conn"
              ? "h-2.5 w-2.5"
              : "h-2 w-2",
          state === "idle" && !isHook && "border-accent/55 bg-accent/55",
          state === "idle" && isHook && "border-accent/55"
        )}
      />
      <span
        className={cn(
          "text-[0.64rem] leading-tight tracking-tight transition-colors",
          lit ? "text-accent" : "text-fg/70"
        )}
      >
        {node.name}
      </span>
    </button>
  );
}

function DetailPanel({
  node,
  onSelect,
}: {
  node: ArchNode | null;
  onSelect: (id: string) => void;
}) {
  if (!node) {
    return (
      <div className="border-border border-t pt-6 font-terminal text-muted-fg text-sm leading-relaxed">
        <p className="text-[0.7rem] uppercase tracking-[0.2em]">The system</p>
        <p className="mt-4">
          Hover or tap any node — it lights its links to everything it connects
          to across the lifecycle.
        </p>
      </div>
    );
  }

  const conns = [...connectionsOf(node.id)]
    .map((id) => byId.get(id))
    .filter(Boolean) as ArchNode[];

  return (
    <div className="border-accent border-t pt-6 font-terminal">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.7rem] text-accent uppercase tracking-[0.2em]">
          {layerLabel(node.layer)}
        </p>
        <p className="text-[0.62rem] text-muted-fg uppercase tracking-[0.16em]">
          {stageRange(node)}
        </p>
      </div>

      {node.role ? (
        <p className="mt-4 text-xl tracking-tight">{node.role}</p>
      ) : null}
      <p
        className={cn(
          "tracking-tight",
          node.role ? "mt-0.5 text-muted-fg text-sm" : "mt-4 text-xl"
        )}
      >
        {node.name}
      </p>

      <p className="mt-5 text-muted-fg text-sm leading-relaxed">
        {node.detail}
      </p>

      {node.source ? (
        <p className="mt-6 break-words text-[0.7rem] text-muted-fg tracking-[0.04em]">
          <span className="text-fg/45 uppercase tracking-[0.16em]">
            Lives in{" "}
          </span>
          {node.source}
        </p>
      ) : null}

      {conns.length > 0 ? (
        <div className="mt-5 border-border border-t pt-4">
          <p className="text-[0.62rem] text-fg/45 uppercase tracking-[0.16em]">
            Connects to
          </p>
          <ul className="mt-2 space-y-1.5">
            {conns.map((c) => (
              <li key={c.id}>
                <button
                  className="group inline-flex items-center gap-2 text-left text-accent text-sm"
                  onClick={() => onSelect(c.id)}
                  type="button"
                >
                  <span className="relative">
                    {c.name}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
