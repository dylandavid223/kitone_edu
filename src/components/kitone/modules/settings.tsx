'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, ShieldCheck, BookOpen, Plug, CreditCard, Palette, Upload, Check, Plus, RotateCcw } from 'lucide-react';
import { useInstitution, institutionTypeMeta } from '../institution-store';
import { roles_permissions, integrations } from '../data';
import { AppearanceSettings } from '../appearance-settings';
import { StatusBadge } from '../ui/badges';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function SettingsModule() {
  const { data, resetInstitution } = useInstitution();
  const { toast } = useToast();
  const [tab, setTab] = useState('institution');
  const info = data.info!;

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="institution"><Building2 className="mr-1.5 h-4 w-4" /> Institution</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1.5 h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="roles"><ShieldCheck className="mr-1.5 h-4 w-4" /> Roles</TabsTrigger>
          <TabsTrigger value="curriculum"><BookOpen className="mr-1.5 h-4 w-4" /> Curriculum</TabsTrigger>
          <TabsTrigger value="integrations"><Plug className="mr-1.5 h-4 w-4" /> Integrations</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="mr-1.5 h-4 w-4" /> Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="institution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Institution Profile</CardTitle>
              <CardDescription>Edit your institution details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20"><AvatarFallback className="bg-emerald-500 text-white text-xl font-bold">{info.logoText}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Logo</p>
                  <p className="text-xs text-muted-foreground">PNG/SVG · max 512px</p>
                </div>
                <Button variant="outline"><Upload className="mr-1.5 h-4 w-4" /> Upload</Button>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Institution name</Label><Input defaultValue={info.name} /></div>
                <div className="space-y-1.5"><Label>Slug</Label><Input defaultValue={info.slug} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Type</Label><Input defaultValue={institutionTypeMeta[info.type].label} disabled /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input defaultValue={info.location} /></div>
                <div className="space-y-1.5"><Label>Motto</Label><Input defaultValue={info.motto} /></div>
                <div className="space-y-1.5"><Label>Term</Label><Input defaultValue={info.term} /></div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="text-rose-600 hover:bg-rose-500/10" onClick={() => { resetInstitution(); toast({ title: 'Institution reset', description: 'Run setup again from scratch' }); }}>
                  <RotateCcw className="mr-1.5 h-4 w-4" /> Reset & re-run setup
                </Button>
                <Button onClick={() => toast({ title: 'Saved', description: 'Institution profile updated' })}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4"><AppearanceSettings /></TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Roles & Permissions</CardTitle><CardDescription>RBAC + ABAC matrix</CardDescription></CardHeader>
            <CardContent className="p-0">
              <div className="kitone-scroll overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                      <th className="px-4 py-3 text-left font-medium">Permission scope</th>
                      {roles_permissions.map((r) => <th key={r.role} className="px-4 py-3 text-center font-medium">{r.role}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(roles_permissions[0].perms).map((perm) => (
                      <tr key={perm} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">{perm}</td>
                        {roles_permissions.map((r) => <td key={r.role} className="px-4 py-3 text-center"><Switch defaultChecked={r.perms[perm as keyof typeof r.perms]} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Curriculum & Structure</CardTitle><CardDescription>Active: {info.curriculum}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-primary bg-primary/5 p-3"><p className="text-sm font-medium">{info.curriculum}</p><Badge variant="secondary" className="mt-1 text-[10px]">Active</Badge></div>
                {['CBC', '8-4-4 (Legacy)', 'University', 'TVET'].filter((c) => c !== info.curriculum).map((c) => (
                  <div key={c} className="rounded-lg border p-3 opacity-60"><p className="text-sm font-medium">{c}</p></div>
                ))}
              </div>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium">Subjects offered ({data.subjects.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.subjects.map((s) => <Badge key={s.id} variant="secondary" className="text-[11px]">{s.name}</Badge>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Classes ({data.classes.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.classes.map((c) => <Badge key={c.id} variant="outline" className="text-[11px]">{c.name}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((int) => (
              <Card key={int.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Plug className="h-5 w-5 text-muted-foreground" /></div>
                    <StatusBadge status={int.status} />
                  </div>
                  <p className="mt-3 font-semibold text-sm">{int.name}</p>
                  <p className="text-[11px] text-muted-foreground">{int.detail}</p>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Last sync: {int.lastSync}</span>
                    <Badge variant="outline" className="text-[10px]">{int.category}</Badge>
                  </div>
                  <Button variant={int.status === 'connected' ? 'outline' : 'default'} size="sm" className="mt-3 w-full" onClick={() => toast({ title: int.status === 'connected' ? 'Configure' : 'Connecting…', description: int.name })}>
                    {int.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Usage</CardTitle><CardDescription>Current term</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Students', used: data.students.length, cap: 2000 },
                { label: 'Classes', used: data.classes.length, cap: 100 },
                { label: 'Staff', used: data.staff.length, cap: 200 },
              ].map((u) => {
                const pct = u.cap > 0 ? Math.round((u.used / u.cap) * 100) : 0;
                return (
                  <div key={u.label}>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium">{u.label}</span><span className="text-muted-foreground">{u.used} / {u.cap} · {pct}%</span></div>
                    <Progress value={pct} className={cn('h-2', pct >= 90 && '[&>div]:bg-rose-500', pct >= 75 && pct < 90 && '[&>div]:bg-amber-500')} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}