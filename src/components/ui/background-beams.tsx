"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const numberOfBeams = 50;
  const beamVariants = {
    initial: {
      opacity: 0,
      y: "100%",
    },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      y: ["-100%", "100%"],
      transition: {
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 5,
        repeat: Infinity,
        ease: "linear",
      },
    }),
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[-1] overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
        {Array.from({ length: numberOfBeams }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={beamVariants}
            initial="initial"
            animate="animate"
            className="absolute top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
