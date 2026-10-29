'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sun, Moon, Monitor, Check, RotateCcw, type LucideIcon } from 'lucide-react';
import { useTheme, colorPresets, type ThemeMode } from './theme-provider';
import { cn } from '@/lib/utils';

const modes: { id: ThemeMode; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'light',  label: 'Light',  icon: Sun,     desc: 'Bright background' },
  { id: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Low-light friendly' },
  { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
];

export function AppearanceSettings() {
  const { appearance, resolvedDark, setMode, setColor, setRadius, setFontScale, reset } = useTheme();

  return (
    <div className="space-y-4">
      {/* Theme mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Choose how Kitone Edu looks. System follows your device setting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {modes.map((m) => {
              const Icon = m.icon;
              const active = appearance.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:shadow-sm',
                    active ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border'
                  )}
                >
                  <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')} />
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground">{m.desc}</p>
                  </div>
                  {active && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Currently resolved: <span className="font-medium text-foreground">{resolvedDark ? 'Dark' : 'Light'}</span>
          </p>
        </CardContent>
      </Card>

      {/* Accent color */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accent Color</CardTitle>
          <CardDescription>Applies to buttons, active nav, badges, rings &amp; links.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {colorPresets.map((p) => {
              const active = appearance.colorId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setColor(p.id)}
                  title={p.name}
                  className={cn(
                    'group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all hover:shadow-sm',
                    active ? 'border-primary ring-1 ring-primary' : 'border-border'
                  )}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: p.swatch }}
                  >
                    {active && <Check className="h-4 w-4 text-white" />}
                  </span>
                  <span className="text-[10px] font-medium">{p.name}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Radius + font scale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Layout</CardTitle>
          <CardDescription>Adjust corner roundness and base font size.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Border radius</Label>
              <span className="font-mono text-xs text-muted-foreground">{appearance.radius.toFixed(3)} rem</span>
            </div>
            <Slider
              value={[appearance.radius]}
              onValueChange={(v) => setRadius(v[0])}
              min={0.3}
              max={1}
              step={0.025}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Sharp</span>
              <span>Rounded</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Font size</Label>
              <span className="font-mono text-xs text-muted-foreground">{Math.round(appearance.fontScale * 100)}%</span>
            </div>
            <Slider
              value={[appearance.fontScale]}
              onValueChange={(v) => setFontScale(v[0])}
              min={0.9}
              max={1.1}
              step={0.025}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Compact</span>
              <span>Large</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live Preview</CardTitle>
          <CardDescription>See your choices applied instantly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Primary action</Button>
              <Button size="sm" variant="outline">Secondary</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
              <Badge>Default</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="mt-3 space-y-2">
              <Input placeholder="Sample input field" />
              <Progress value={68} className="h-2" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              The quick brown fox jumps over the lazy dog — Habari ya asubuhi.
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}