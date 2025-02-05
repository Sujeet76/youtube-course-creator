import * as React from "react";

import { Slot, Slottable } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "group animate-rainbow focus-visible:ring-ring relative inline-flex h-11 transform-gpu cursor-pointer items-center justify-center gap-1 rounded-xl border-0 bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] px-6 py-2 font-medium text-white transition-all [border:calc(0.08*1rem)_solid_transparent] focus-visible:ring-1 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 md:px-8 dark:text-black",

          // before styles
          "before:animate-rainbow before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",

          // light mode colors
          "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",

          // dark mode colors
          "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
          className
        )}
        {...props}
      >
        <Slottable>{props.children}</Slottable>
      </Comp>
    );
  }
);
RainbowButton.displayName = "RainbowButton";

export { RainbowButton };
