"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const palettes = [
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
];

export function InitialsAvatar({
  initials,
  name,
  size = "default",
  className,
}: {
  initials: string;
  name?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const idx = React.useMemo(() => {
    const sum = (name || initials)
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return sum % palettes.length;
  }, [initials, name]);

  const sizeClass =
    size === "sm" ? "size-7 text-xs" : size === "lg" ? "size-12 text-base" : "size-9 text-sm";

  return (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarFallback className={cn("font-semibold", palettes[idx])}>
        {initials.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
