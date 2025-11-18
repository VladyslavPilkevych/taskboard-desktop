import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors duration-300",
          "placeholder:text-muted-foreground/80",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
