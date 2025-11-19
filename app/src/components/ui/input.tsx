import * as React from "react";
import { cn } from "@/utils/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-300 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 placeholder:text-muted-foreground/80",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
