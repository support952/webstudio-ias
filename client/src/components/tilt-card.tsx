"use client";

import { useRef, useCallback, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Default 8. */
  maxTilt?: number;
  /** Perspective in px. Default 800. */
  perspective?: number;
  /** Spring stiffness. Default 200. */
  stiffness?: number;
  /** Spring damping. Default 20. */
  damping?: number;
};

/**
 * Card wrapper that applies a subtle 3D tilt on mouse move. Uses GPU-friendly
 * transform only; will-change is applied only while hovered to limit memory use.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  perspective = 800,
  stiffness = 200,
  damping = 20,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness, damping });
  const springY = useSpring(rotateY, { stiffness, damping });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * maxTilt);
      rotateX.set(-y * maxTilt);
    },
    [maxTilt, rotateX, rotateY]
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  }, [rotateX, rotateY]);

  const onMouseEnter = useCallback(() => setHovered(true), []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{
        perspective,
        transformStyle: "preserve-3d",
        rotateX: springX,
        rotateY: springY,
        transform: "translateZ(0)",
        willChange: hovered ? "transform" : "auto",
      }}
      initial={false}
    >
      <motion.div style={{ transform: "translateZ(0)" }} className="h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  );
}
