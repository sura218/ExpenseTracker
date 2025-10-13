import * as React from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50";

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
