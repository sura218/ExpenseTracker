import * as React from "react";
import { cn } from "../lib/utils";

function createCardComponent<T extends keyof JSX.IntrinsicElements>(
  tag: T,
  baseClass: string,
  displayName: string
) {
  const Comp = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) =>
      React.createElement(tag, {
        ref,
        className: cn(baseClass, className),
        ...props,
      })
  );
  Comp.displayName = displayName;
  return Comp;
}

export const Card = createCardComponent(
  "div",
  "rounded-lg border bg-white shadow-sm",
  "Card"
);
export const CardHeader = createCardComponent("div", "p-6 pb-4", "CardHeader");
export const CardTitle = createCardComponent(
  "h3",
  "text-xl font-semibold",
  "CardTitle"
);
export const CardDescription = createCardComponent(
  "p",
  "text-sm text-gray-600",
  "CardDescription"
);
export const CardContent = createCardComponent(
  "div",
  "p-6 pt-0",
  "CardContent"
);
export const CardFooter = createCardComponent(
  "div",
  "flex items-center p-6 pt-0",
  "CardFooter"
);
