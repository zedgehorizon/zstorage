import * as React from "react";

import { cn } from "@utils/functions";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex-1 w-full file:mr-8 file:cursor-pointer rounded-md border border-accent/50 bg-muted p-2 text-sm text-accent/50 ring-offset-background file:border-0 file:bg-accent file:p-2  file:rounded-lg file:text-sm file:font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
