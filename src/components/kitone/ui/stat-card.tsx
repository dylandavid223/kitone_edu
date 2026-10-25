'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Users,
  Check,
  Wallet,
  Book,
  AlertTriangle,
  Clock,
  ClipboardList,
  TrendingUp,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  check: Check,
  wallet: Wallet,
  book: Book,
  alert: AlertTriangle,
  clock: Clock,
  clipboard: ClipboardList,
  trending: TrendingUp,
  rotate: RotateCcw,
};

const toneClasses: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
};

export interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  trend?: string;
  tone?: keyof typeof toneClasses;
}

export function StatCard({ label, value, sub, icon, trend, tone = 'emerald' }: StatCardProps) {
  const Icon = iconMap[icon] ?? Users;
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground truncate">{sub}</p>}
            {trend && (
              <p className="mt-2 text-xs font-medium text-foreground/70">{trend}</p>
            )}
          </div>
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              toneClasses[tone]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
