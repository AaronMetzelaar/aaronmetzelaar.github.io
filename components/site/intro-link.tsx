"use client";

import {
  motion,
  useAnimation,
  useReducedMotion,
  type Variants,
} from "motion/react";
import type { CSSProperties, HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

// Animated icons adapted from pqoqubbw/icons (MIT, https://icons.pqoqubbw.dev).
// Each exposes an imperative start/stop so the surrounding link drives it on
// hover/focus of the whole word. Every glyph is fully visible at rest; only its
// motion is added on hover.

type IconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type IconProps = HTMLAttributes<HTMLSpanElement> & { size?: number };

// ── interfaces: the cursor bounces, then radiates a click ────────────────────
const CURSOR_VARIANTS: Variants = {
  initial: { x: 0, y: 0 },
  hover: {
    x: [0, 0, -3, 0],
    y: [0, -4, 0, 0],
    transition: { duration: 1, bounce: 0.3 },
  },
};

const CLICK_VARIANTS: Variants = {
  initial: { opacity: 1, x: 0, y: 0 },
  spread: (custom: { x: number; y: number }) => ({
    opacity: [0, 1, 0, 0, 0, 0, 1],
    x: [0, custom.x, 0, 0],
    y: [0, custom.y, 0, 0],
    transition: { type: "spring", stiffness: 70, damping: 10, mass: 0.4 },
  }),
};

const CursorIcon = forwardRef<IconHandle, IconProps>(
  ({ className, size = 16, ...props }, ref) => {
    const clickControls = useAnimation();
    const cursorControls = useAnimation();

    useImperativeHandle(ref, () => ({
      startAnimation: () => {
        cursorControls.start("hover");
        clickControls.start("spread", { delay: 1.3 });
      },
      stopAnimation: () => {
        cursorControls.start("initial");
        clickControls.start("initial");
      },
    }));

    return (
      <span className={cn(className)} {...props}>
        <svg
          aria-hidden="true"
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={cursorControls}
            d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
            variants={CURSOR_VARIANTS}
          />
          <motion.path
            animate={clickControls}
            custom={{ x: 1, y: -1 }}
            d="M14 4.1 12 6"
            variants={CLICK_VARIANTS}
          />
          <motion.path
            animate={clickControls}
            custom={{ x: -1, y: 0 }}
            d="m5.1 8-2.9-.8"
            variants={CLICK_VARIANTS}
          />
          <motion.path
            animate={clickControls}
            custom={{ x: -1, y: 1 }}
            d="m6 12-1.9 2"
            variants={CLICK_VARIANTS}
          />
          <motion.path
            animate={clickControls}
            custom={{ x: 0, y: -1 }}
            d="M7.2 2.2 8 5.1"
            variants={CLICK_VARIANTS}
          />
        </svg>
      </span>
    );
  }
);
CursorIcon.displayName = "CursorIcon";

// ── AI tooling: two workflow nodes, always visible; on hover they pulse in
//    sequence (top-left, then bottom-right) like data flowing down the pipe ────
const NODE_STYLE: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
};

const NODE_A_VARIANTS: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.35, 1],
    transition: {
      duration: 0.6,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 0.7,
      ease: "easeInOut",
    },
  },
};

const NODE_B_VARIANTS: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.35, 1],
    transition: {
      duration: 0.6,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 0.7,
      delay: 0.4,
      ease: "easeInOut",
    },
  },
};

const WorkflowIcon = forwardRef<IconHandle, IconProps>(
  ({ className, size = 16, ...props }, ref) => {
    const controls = useAnimation();

    useImperativeHandle(ref, () => ({
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }));

    return (
      <span className={cn(className)} {...props}>
        <svg
          aria-hidden="true"
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.rect
            animate={controls}
            height="8"
            initial="normal"
            rx="2"
            style={NODE_STYLE}
            variants={NODE_A_VARIANTS}
            width="8"
            x="3"
            y="3"
          />
          <path d="M7 11v4a2 2 0 0 0 2 2h4" />
          <motion.rect
            animate={controls}
            height="8"
            initial="normal"
            rx="2"
            style={NODE_STYLE}
            variants={NODE_B_VARIANTS}
            width="8"
            x="13"
            y="13"
          />
        </svg>
      </span>
    );
  }
);
WorkflowIcon.displayName = "WorkflowIcon";

const ICONS = { cursor: CursorIcon, workflow: WorkflowIcon } as const;

export function IntroLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}) {
  const ref = useRef<IconHandle>(null);
  // The workflow icon's node pulse repeats forever while hovered. Reduced motion
  // means the glyph stays at rest; the colour and weight shift still carry the
  // hover state.
  const reduced = useReducedMotion();
  const Icon = ICONS[icon];
  const start = () => {
    if (!reduced) {
      ref.current?.startAnimation();
    }
  };
  const stop = () => ref.current?.stopAnimation();

  return (
    <a
      className="intro-link pointer-events-auto whitespace-nowrap"
      href={href}
      onBlur={stop}
      onFocus={start}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <Icon className="intro-icon" ref={ref} size={16} />
      {label}
    </a>
  );
}
