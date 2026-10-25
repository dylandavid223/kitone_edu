'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const toneClasses: Record<string, string> = {
  EE: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  ME: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  AE: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  BE: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

export function CbcBadge({ level, className }: { level: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('font-semibold border', toneClasses[level] ?? toneClasses.BE, className)}
    >
      {level}
    </Badge>
  );
}

const statusClasses: Record<string, string> = {
  paid: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  Delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  Live: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  connected: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Scheduled: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Draft: 'bg-muted text-muted-foreground border-border',
  overdue: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  suspended: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  Failed: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  disconnected: 'bg-muted text-muted-foreground border-border',
  past: 'bg-muted text-muted-foreground border-border',
  upcoming: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Closed: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('border font-medium capitalize', statusClasses[status] ?? statusClasses.Draft, className)}
    >
      {status}
    </Badge>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
