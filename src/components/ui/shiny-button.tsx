"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, disabled, ...props }, ref) => {
  return (
    <button
      type="button"
      disabled={disabled}
      ref={ref}
      className={cn(
        "relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
        className
      )}
      {...props}
    >
      <span
        className="relative block size-full text-sm uppercase tracking-wide text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]"
      >
        {children}
      </span>

      <span
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_20%,hsl(var(--primary)/50%)_25%,hsl(var(--primary)/10%)_100%)] p-px"
      ></span>
    </button>
  );
});

ShinyButton.displayName = "ShinyButton";
