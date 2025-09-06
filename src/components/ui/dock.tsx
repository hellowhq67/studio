
"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { PropsWithChildren, useRef } from "react";
import { LucideIcon } from "lucide-react";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  children: React.ReactNode;
  direction?: "top" | "bottom" | "left" | "right";
}

const dockVariants = cva(
  "flex h-16 items-end gap-2 rounded-2xl border bg-card/60 p-2 backdrop-blur-md"
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, children, direction = "bottom", ...props }, ref) => {
    const mouseX = useMotionValue(Infinity);

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(dockVariants({ className }), {
          "items-center": direction === "left" || direction === "right",
          "flex-col": direction === "left" || direction === "right",
          "bottom-4": direction === "bottom",
        })}
        {...props}
      >
        {React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement, {
              mouseX: mouseX,
            });
          })}
      </motion.div>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps {
  mouseX?: any;
  className?: string;
  children?: React.ReactNode;
  icon: LucideIcon;
  onClick?: () => void;
}

const DockIcon = ({ mouseX, className, children, ...props }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 80, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "flex aspect-square items-center justify-center rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
        {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
