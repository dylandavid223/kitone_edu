"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CbcLevel } from "@/components/kitone/data";

const styles: Record<CbcLevel, string> = {
  EE: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30",
  ME: "bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30",
  AE: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30",
  BE: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30",
};

const labels: Record<CbcLevel, string> = {
  EE: "Exceeding",
  ME: "Meeting",
  AE: "Approaching",
  BE: "Below",
};

export function CbcBadge({
  level,
  showLabel = false,
  className,
}: {
  level: CbcLevel;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none",
        styles[level],
        className
      )}
      title={labels[level]}
    >
      {level}
      {showLabel && (
        <span className="font-medium opacity-80">{labels[level]}</span>
      )}
    </span>
  );
}

export function CbcLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
        className
      )}
    >
      {(["EE", "ME", "AE", "BE"] as CbcLevel[]).map((l) => (
        <span key={l} className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "size-2.5 rounded-full",
              styles[l].split(" ").find((c) => c.startsWith("bg"))
            )}
          />
          {l} · {labels[l]}
        </span>
      ))}
    </div>
  );
}
