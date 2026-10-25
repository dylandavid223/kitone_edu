"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "emerald" | "amber" | "rose" | "teal" | "violet" | "slate" | "sky";

const tones: Record<Tone, string> = {
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/25 hover:bg-emerald-500/20",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/25 hover:bg-amber-500/20",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/25 hover:bg-rose-500/20",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/25 hover:bg-teal-500/20",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500/25 hover:bg-violet-500/20",
  slate: "bg-slate-500/15 text-slate-700 dark:text-slate-300 ring-1 ring-slate-500/25 hover:bg-slate-500/20",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/25 hover:bg-sky-500/20",
};

export function ToneBadge({
  tone = "slate",
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        tones[tone],
        className
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </Badge>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["paid", "delivered", "active", "live", "connected", "approved", "closed", "completed"].includes(s)) return "emerald";
  if (["pending", "scheduled", "draft", "waiting", "scheduled", "in-review"].includes(s)) return "amber";
  if (["overdue", "failed", "suspended", "rejected", "absent", "late"].includes(s)) return s === "late" ? "amber" : "rose";
  return "slate";
}
