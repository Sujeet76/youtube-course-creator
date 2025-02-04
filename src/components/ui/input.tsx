"use client";

import * as React from "react";

import { EyeClosedIcon, EyeIcon, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type InputProps = React.ComponentProps<"input"> & {
  icon?: LucideIcon;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: Icon, type, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const handleToggle = React.useCallback(() => setIsVisible((v) => !v), []);
    if (type === "password") {
      return (
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              strokeWidth={2}
              className="absolute inset-y-0 start-1.5 top-1/2 -translate-y-1/2 opacity-50"
            />
          )}
          <input
            type={isVisible ? "text" : "password"}
            className={cn(
              "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 pe-9 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              Icon && "ps-6",
              className
            )}
            ref={ref}
            {...props}
          />
          <div>
            <Button
              variant={"ghost"}
              className="absolute inset-y-0 end-0 top-1/2 size-9 -translate-y-1/2 rounded-e-lg p-0 focus:z-10"
              type="button"
              onClick={handleToggle}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeClosedIcon
                  size={16}
                  strokeWidth={2}
                  className="size-full"
                  aria-hidden="true"
                />
              ) : (
                <EyeIcon
                  size={16}
                  strokeWidth={2}
                  className="size-full"
                  aria-hidden="true"
                />
              )}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={2}
            className="absolute inset-y-0 start-1.5 top-1/2 -translate-y-1/2 opacity-50"
          />
        )}
        <input
          type={type}
          className={cn(
            "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            Icon && "ps-6",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
