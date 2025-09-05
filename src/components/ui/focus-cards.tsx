
"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

const DURATION = 0.5;
const STAGGER = 0.025;

export const FocusCards = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;

    x.set(x);
    y.set(y);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-10deg) rotateX(25deg)",
      }}
      className="group relative grid h-full w-full grid-cols-2"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid grid-cols-2 place-content-center rounded-xl bg-background/50 p-2 shadow-lg"
      >
        {children}
      </div>
    </motion.div>
  );
};

export const Card = ({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
}) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0,
          y: 25,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        duration: DURATION,
        ease: "backInOut",
      }}
      className={cn("bg-background p-4 text-primary", colSpan, className)}
    >
      {children}
    </motion.div>
  );
};
