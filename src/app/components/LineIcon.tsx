import type { ReactNode } from "react";

interface LineIconProps {
  className?: string;
  "aria-hidden"?: "true" | "false";
  children?: ReactNode;
}

export function LineIcon({ className, children, "aria-hidden": ariaHidden }: LineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      {children}
    </svg>
  );
}
