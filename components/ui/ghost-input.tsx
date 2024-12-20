import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const GhostInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:bg-gray-50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-900 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
GhostInput.displayName = "GhostInput";

export { GhostInput };
