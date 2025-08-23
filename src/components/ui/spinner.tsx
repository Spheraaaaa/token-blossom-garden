import React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        "h-5 w-5 align-middle",
        className
      )}
      aria-label="Loading"
      role="status"
    />
  );
}
