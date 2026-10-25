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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  ShieldCheck,
  BookOpen,
  Plug,
  CreditCard,
  Upload,
  Check,
  Plus,
} from 'lucide-react';
import { institution, roles_permissions, integrations } from '../data';
import { StatusBadge } from '../ui/badges';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function SettingsModule() {
  const [tab, setTab] = useState('institution');
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="institution"><Building2 className="mr-1.5 h-4 w-4" /> Institution</TabsTrigger>
          <TabsTrigger value="roles"><ShieldCheck className="mr-1.5 h-4 w-4" /> Roles</TabsTrigger>
          <TabsTrigger value="curriculum"><BookOpen className="mr-1.5 h-4 w-4" /> Curriculum</TabsTrigger>
          <TabsTrigger value="integrations"><Plug className="mr-1.5 h-4 w-4" /> Integrations</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="mr-1.5 h-4 w-4" /> Billing</TabsTrigger>
        </TabsList>

        {/* Institution */}
        <TabsContent value="institution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Institution Profile</CardTitle>
              <CardDescription>Public-facing details & branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-emerald-500 text-white text-xl font-bold">AH</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Logo</p>
                  <p className="text-xs text-muted-foreground">PNG/SVG · max 512px · used on invoices & report cards</p>
                </div>
                <Button variant="outline"><Upload className="mr-1.5 h-4 w-4" /> Upload</Button>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Institution name</Label><Input defaultValue={institution.name} /></div>
                <div className="space-y-1.5"><Label>Slug</Label><Input defaultValue={institution.slug} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Type</Label><Input defaultValue={institution.type} disabled /></div>
                <div className="space-y-1.5"><Label>Established</Label><Input defaultValue={String(institution.established)} /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input defaultValue={institution.location} /></div>
                <div className="space-y-1.5"><Label>Motto</Label><Input defaultValue={institution.motto} /></div>
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select defaultValue="Africa/Nairobi">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam</SelectItem>
                      <SelectItem value="Africa/Kampala">Africa/Kampala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select defaultValue="KES">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES · Kenyan Shilling</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="TZS">TZS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Languages</Label>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="gap-1"><Check className="h-3 w-3" /> English</Badge>
                  <Badge variant="secondary" className="gap-1"><Check className="h-3 w-3" /> Kiswahili</Badge>
                  <Button variant="outline" size="sm" className="h-7"><Plus className="mr-1 h-3 w-3" /> Add language</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: 'Settings saved', description: 'Institution profile updated' })}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & permissions */}
        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Roles & Permissions</CardTitle>
              <CardDescription>RBAC + ABAC matrix · per-tenant customizable</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="kitone-scroll overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                      <th className="px-4 py-3 text-left font-medium">Permission scope</th>
                      {roles_permissions.map((r) => (
                        <th key={r.role} className="px-4 py-3 text-center font-medium">{r.role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(roles_permissions[0].perms).map((perm) => (
                      <tr key={perm} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">{perm}</td>
                        {roles_permissions.map((r) => (
                          <td key={r.role} className="px-4 py-3 text-center">
                            <Switch defaultChecked={r.perms[perm as keyof typeof r.perms]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="inline h-3.5 w-3.5 text-amber-600" /> Attribute rules enforce row-level scoping (e.g. &quot;Teachers see only their classes&quot;). MFA required for Admin & Finance roles.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Curriculum */}
        <TabsContent value="curriculum" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Curriculum & Structure</CardTitle>
              <CardDescription>CBC · 8-4-4 legacy · university credit systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Active curriculum</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {['CBC', '8-4-4 (Legacy)', 'University'].map((c, i) => (
                    <div key={c} className={cn('rounded-lg border p-3', i === 0 ? 'border-primary bg-primary/5' : 'opacity-60')}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{c}</p>
                        {i === 0 && <Badge variant="secondary" className="text-[10px]">Active</Badge>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {c === 'CBC' && 'PP1–Grade 12 · strands & competencies'}
                        {c === '8-4-4 (Legacy)' && 'Form 1–4 · KCSE grading'}
                        {c === 'University' && 'Credit hours · GPA'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Senior Secondary Pathways (Grade 10–12)</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { p: 'STEM', on: true },
                    { p: 'Arts & Sports Science', on: true },
                    { p: 'Social Sciences', on: true },
                  ].map((x) => (
                    <div key={x.p} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{x.p}</span>
                      <Switch defaultChecked={x.on} />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Term Structure · 2025</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { t: 'Term 1', dates: '06 Jan – 04 Apr' },
                    { t: 'Term 2', dates: '28 Apr – 25 Jul' },
                    { t: 'Term 3', dates: '18 Aug – 14 Nov' },
                  ].map((x) => (
                    <div key={x.t} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{x.t}</p>
                      <p className="text-[11px] text-muted-foreground">{x.dates}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: 'Curriculum saved', description: 'Changes apply to all new assessments' })}>Save curriculum</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((int) => (
              <Card key={int.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Plug className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <StatusBadge status={int.status} />
                  </div>
                  <p className="mt-3 font-semibold text-sm">{int.name}</p>
                  <p className="text-[11px] text-muted-foreground">{int.detail}</p>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Last sync: {int.lastSync}</span>
                    <Badge variant="outline" className="text-[10px]">{int.category}</Badge>
                  </div>
                  <Button
                    variant={int.status === 'connected' ? 'outline' : 'default'}
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => toast({
                      title: int.status === 'connected' ? 'Configure integration' : 'Connecting…',
                      description: int.name,
                    })}
                  >
                    {int.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/15 text-primary hover:bg-primary/15 border-0">{institution.plan} plan</Badge>
                  <span className="text-xs text-muted-foreground">Renews 01 Jan 2026</span>
                </div>
                <p className="mt-3 text-3xl font-bold">KES 42,000<span className="text-sm font-normal text-muted-foreground">/term</span></p>
                <p className="text-xs text-muted-foreground">Billed quarterly · M-PESA auto-pay</p>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Core SIS + Attendance</div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Fees & M-PESA reconciliation</div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Online classrooms & tests</div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Analytics & report cards</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Plus className="h-4 w-4" /> SSO & API (Enterprise)</div>
                </div>
                <Button className="mt-4 w-full" variant="outline" onClick={() => toast({ title: 'Compare plans', description: 'Free · Standard · Pro · Enterprise' })}>Upgrade</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Usage This Term</CardTitle>
                <CardDescription>Pro plan limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Students', used: institution.totalStudents, cap: institution.enrollmentCap, unit: '' },
                  { label: 'Storage', used: institution.storageUsedGb, cap: institution.storageCapGb, unit: ' GB' },
                  { label: 'SMS sent', used: institution.smsUsed, cap: institution.smsCap, unit: '' },
                ].map((u) => {
                  const pct = Math.round((u.used / u.cap) * 100);
                  return (
                    <div key={u.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{u.label}</span>
                        <span className="text-muted-foreground">{u.used.toLocaleString()}{u.unit} / {u.cap.toLocaleString()}{u.unit} · {pct}%</span>
                      </div>
                      <Progress value={pct} className={cn('h-2', pct >= 90 && '[&>div]:bg-rose-500', pct >= 75 && pct < 90 && '[&>div]:bg-amber-500')} />
                    </div>
                  );
                })}
                <Separator />
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium">Recent invoices</p>
                  <div className="mt-2 space-y-1.5 text-xs">
                    {[
                      { i: 'BILL-2025-Q2', a: 42000, s: 'paid', d: '01 Apr 2025' },
                      { i: 'BILL-2025-Q1', a: 42000, s: 'paid', d: '01 Jan 2025' },
                      { i: 'BILL-2024-Q4', a: 36000, s: 'paid', d: '01 Oct 2024' },
                    ].map((b) => (
                      <div key={b.i} className="flex items-center justify-between">
                        <span className="font-mono text-muted-foreground">{b.i}</span>
                        <span className="text-muted-foreground">{b.d}</span>
                        <span className="font-semibold">KES {b.a.toLocaleString()}</span>
                        <StatusBadge status={b.s} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
