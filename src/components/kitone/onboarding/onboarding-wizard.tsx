'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Building2, Users, BookOpen, Wallet, Check, ChevronRight, ChevronLeft, Plus, X, Sparkles, RotateCcw, PartyPopper, ArrowRight } from 'lucide-react';
import { useInstitution, institutionTypeMeta, streamSuggestions, staffRoleSuggestions, pickColor, type InstitutionType, type Curriculum, type InstitutionInfo, type FeeItem } from '../institution-store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 'info', label: 'Institution', icon: Building2 },
  { id: 'classes', label: 'Classes', icon: Users },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'fees', label: 'Fees', icon: Wallet },
  { id: 'review', label: 'Review', icon: Check },
] as const;

const defaultInfo: InstitutionInfo = {
  name: '', shortName: '', slug: '', motto: '', type: 'jss', curriculum: 'CBC',
  location: '', established: '', timezone: 'Africa/Nairobi', currency: 'KES',
  languages: ['English', 'Kiswahili'], logoText: '', term: 'Term 1', academicYear: String(new Date().getFullYear()),
};

export function OnboardingWizard() {
  const store = useInstitution();
  const { toast } = useToast();
  const [step, setStep] = useState(store.data.setupStep || 0);
  const [showCelebration, setShowCelebration] = useState(false);

  // 🔒 GUARD: seed info on mount so it's NEVER null inside the wizard
  useEffect(() => {
    if (!store.data.info) {
      store.setInfo(defaultInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safe accessor — always returns a real object, never null
  const info: InstitutionInfo = store.data.info ?? defaultInfo;

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {
    if (!info.name.trim()) {
      toast({
        title: 'Institution name required',
        description: 'Go to Step 1 and enter your institution name.',
        variant: 'destructive',
      });
      setStep(0);
      return;
    }

    try {
      await store.syncToServer();
    } catch (e) {
      console.error('Sync failed, continuing anyway:', e);
    }
    store.completeSetup();
    setShowCelebration(true);
    toast({ title: 'Setup complete! 🎉', description: 'Your institution is saved and ready.' });
  };

  // Auto-redirect after celebration
  useEffect(() => {
    if (!showCelebration) return;
    const t = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(t);
  }, [showCelebration]);

  if (store.data.setupComplete && !showCelebration) return null;

  // ---- Celebration screen ----
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg animate-in zoom-in duration-500">
                <PartyPopper className="h-10 w-10" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center animate-bounce">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            Setup Complete! 🎉
          </h1>
          <p className="text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <strong className="text-foreground">{info.name || 'Your institution'}</strong> is now ready. You can start managing students, classes, fees, and more.
          </p>

          <Card className="text-left mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{store.data.classes.length}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Classes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{store.data.staff.length}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Staff</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{store.data.subjects.length}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>Taking you to your dashboard…</span>
          </div>

          <Button size="lg" className="w-full" onClick={() => setShowCelebration(false)}>
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ---- Wizard ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">Kitone Edu</p>
            <p className="text-xs text-muted-foreground leading-tight">Institution setup</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-1">
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <button
                  onClick={() => i <= step && setStep(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                    active ? 'bg-primary text-primary-foreground' : done ? 'text-foreground hover:bg-muted' : 'text-muted-foreground'
                  )}
                  disabled={i > step}
                >
                  <span className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                    active ? 'bg-primary-foreground/20' : done ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted'
                  )}>
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < steps.length - 1 && <div className={cn('mx-1 h-0.5 flex-1 rounded', i < step ? 'bg-emerald-500' : 'bg-muted')} />}
              </div>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => { const Icon = steps[step].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
              {steps[step].label}
            </CardTitle>
            <CardDescription>
              {step === 0 && 'Tell us about your institution. This appears on invoices, report cards & announcements.'}
              {step === 1 && 'Create your classes. Streams and rooms are optional.'}
              {step === 2 && 'Add staff members — teachers, principal, finance officer, etc.'}
              {step === 3 && 'Define the subjects taught. Defaults are suggested based on your institution type.'}
              {step === 4 && 'Set up fee structures per grade. Students will be billed against these.'}
              {step === 5 && 'Review your setup. You can change everything later in Settings.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && <StepInfo />}
            {step === 1 && <StepClasses />}
            {step === 2 && <StepStaff />}
            {step === 3 && <StepSubjects />}
            {step === 4 && <StepFees />}
            {step === 5 && <StepReview />}

            <Separator />
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => { store.resetInstitution(); setStep(0); toast({ title: 'Reset', description: 'All setup progress cleared' }); }}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> Start over
              </Button>
              <div className="flex gap-2">
                {step > 0 && (
                  <Button variant="outline" onClick={goBack}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button onClick={() => { store.setSetupStep(step + 1); goNext(); }}>
                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={finish} className="bg-emerald-600 hover:bg-emerald-700">
                    <Sparkles className="mr-1.5 h-4 w-4" /> Finish setup
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Step 1: Institution info -------------------------------------------
function StepInfo() {
  const { data, setInfo } = useInstitution();
  const [form, setForm] = useState<InstitutionInfo>(data.info ?? defaultInfo);

  // Seed on mount
  useEffect(() => {
    if (!data.info) setInfo(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<InstitutionInfo>) => {
    const next = { ...form, ...patch };
    if (patch.name) {
      next.shortName = next.shortName || patch.name.split(' ').slice(0, 2).join(' ');
      next.slug = next.slug || patch.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      next.logoText = next.logoText || patch.name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
    }
    setForm(next);
    setInfo(next);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2"><Label>Institution name *</Label><Input value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. Alliance High School" /></div>
      <div className="space-y-1.5"><Label>Short name</Label><Input value={form.shortName} onChange={(e) => update({ shortName: e.target.value })} placeholder="Alliance High" /></div>
      <div className="space-y-1.5"><Label>Slug</Label><Input value={form.slug} onChange={(e) => update({ slug: e.target.value })} className="font-mono" placeholder="alliance-high" /></div>
      <div className="space-y-1.5">
        <Label>Institution type *</Label>
        <Select value={form.type} onValueChange={(v) => update({ type: v as InstitutionType })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.entries(institutionTypeMeta).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Curriculum</Label>
        <Select value={form.curriculum} onValueChange={(v) => update({ curriculum: v as Curriculum })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{['CBC', '8-4-4 (Legacy)', 'University', 'TVET'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => update({ location: e.target.value })} placeholder="e.g. Kikuyu, Kiambu" /></div>
      <div className="space-y-1.5"><Label>Established</Label><Input value={form.established} onChange={(e) => update({ established: e.target.value })} placeholder="e.g. 1926" /></div>
      <div className="space-y-1.5 sm:col-span-2"><Label>Motto</Label><Input value={form.motto} onChange={(e) => update({ motto: e.target.value })} placeholder="e.g. Strong to Serve" /></div>
      <div className="space-y-1.5"><Label>Term</Label><Input value={form.term} onChange={(e) => update({ term: e.target.value })} placeholder="Term 1 · 2025" /></div>
      <div className="space-y-1.5"><Label>Academic year</Label><Input value={form.academicYear} onChange={(e) => update({ academicYear: e.target.value })} /></div>
      <div className="space-y-1.5">
        <Label>Timezone</Label>
        <Select value={form.timezone} onValueChange={(v) => update({ timezone: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem><SelectItem value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam</SelectItem><SelectItem value="Africa/Kampala">Africa/Kampala</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Currency</Label>
        <Select value={form.currency} onValueChange={(v) => update({ currency: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="KES">KES · Kenyan Shilling</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="TZS">TZS</SelectItem><SelectItem value="UGX">UGX</SelectItem></SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ---- Step 2: Classes ----------------------------------------------------
function StepClasses() {
  const { data, addClass, removeClass, updateClass } = useInstitution();
  const info = data.info ?? defaultInfo;
  const suggestedGrades = institutionTypeMeta[info.type].grades;
  const [grade, setGrade] = useState(suggestedGrades[0] ?? '');
  const [stream, setStream] = useState('East');
  const [room, setRoom] = useState('');

  const add = () => {
    if (!grade) return;
    const name = stream ? `${grade} ${stream}` : grade;
    if (data.classes.some((c) => c.name === name)) return;
    addClass({ name, grade, stream, teacherId: null, room: room || 'TBD' });
    setRoom('');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Grade</Label>
          <Select value={grade} onValueChange={setGrade}><SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger><SelectContent>{suggestedGrades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="space-y-1.5">
          <Label>Stream</Label>
          <Select value={stream} onValueChange={setStream}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{streamSuggestions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="space-y-1.5"><Label>Room</Label><Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Block A · Rm 12" /></div>
        <div className="flex items-end"><Button onClick={add} className="w-full"><Plus className="mr-1 h-4 w-4" /> Add</Button></div>
      </div>

      <div className="space-y-2">
        {data.classes.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No classes yet. Add your first class above.</p>
        ) : data.classes.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Users className="h-4 w-4" /></div>
            <div className="flex-1"><p className="text-sm font-medium">{c.name}</p><p className="text-[11px] text-muted-foreground">{c.room}</p></div>
            <Input value={c.room} onChange={(e) => updateClass(c.id, { room: e.target.value })} className="hidden h-7 w-40 sm:block" />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => removeClass(c.id)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>

      {data.classes.length === 0 && suggestedGrades.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Quick-add all grades for {info.type}:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedGrades.map((g) => <Button key={g} variant="outline" size="sm" onClick={() => addClass({ name: g, grade: g, stream: '', teacherId: null, room: 'TBD' })}><Plus className="mr-1 h-3 w-3" /> {g}</Button>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Step 3: Staff ------------------------------------------------------
function StepStaff() {
  const { data, addStaff, removeStaff } = useInstitution();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Teacher');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const add = () => {
    if (!name.trim()) return;
    addStaff({ name: name.trim(), role, email: email.trim(), phone: phone.trim(), subjects: [], avatarColor: pickColor(name) });
    setName(''); setEmail(''); setPhone('');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-5">
        <div className="space-y-1.5 sm:col-span-2"><Label>Full name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grace Wambui" /></div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{staffRoleSuggestions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="space-y-1.5"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@school.ac.ke" /></div>
        <div className="space-y-1.5"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7xx xxx xxx" /></div>
      </div>
      <Button onClick={add}><Plus className="mr-1 h-4 w-4" /> Add staff member</Button>

      <div className="space-y-2">
        {data.staff.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No staff added yet.</p>
        ) : data.staff.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white', s.avatarColor)}>{s.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}</div>
            <div className="flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-[11px] text-muted-foreground">{s.email || '—'} · {s.phone || '—'}</p></div>
            <Badge variant="outline">{s.role}</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => removeStaff(s.id)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Step 4: Subjects ---------------------------------------------------
function StepSubjects() {
  const { data, addSubject, removeSubject } = useInstitution();
  const info = data.info ?? defaultInfo;
  const suggested = institutionTypeMeta[info.type].defaultSubjects;
  const [name, setName] = useState('');
  const colorCycle = ['emerald', 'teal', 'amber', 'rose', 'violet', 'cyan', 'lime', 'orange'];

  const add = (n?: string) => {
    const finalName = (n ?? name).trim();
    if (!finalName || data.subjects.some((s) => s.name === finalName)) return;
    const code = finalName.split(' ').slice(0, 2).map((w) => w.slice(0, 3).toUpperCase()).join('');
    addSubject({ name: finalName, code, color: colorCycle[data.subjects.length % colorCycle.length] });
    setName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Subject name" onKeyDown={(e) => e.key === 'Enter' && add()} />
        <Button onClick={() => add()}><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>
      {suggested.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Suggested for {info.type} ({info.curriculum}):</p>
          <div className="flex flex-wrap gap-1.5">
            {suggested.filter((s) => !data.subjects.some((x) => x.name === s)).map((s) => <Button key={s} variant="outline" size="sm" onClick={() => add(s)}><Plus className="mr-1 h-3 w-3" /> {s}</Button>)}
          </div>
        </div>
      )}
      <div className="space-y-2">
        {data.subjects.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No subjects yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {data.subjects.map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-lg border p-2.5">
                <span className={cn('h-3 w-3 rounded-full', `bg-${s.color}-500`)} />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{s.name}</p><p className="font-mono text-[10px] text-muted-foreground">{s.code}</p></div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600" onClick={() => removeSubject(s.id)}><X className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Step 5: Fees -------------------------------------------------------
function StepFees() {
  const { data, addFeeStructure } = useInstitution();
  const grades = Array.from(new Set(data.classes.map((c) => c.grade)));
  const [grade, setGrade] = useState(grades[0] ?? '');
  const [items, setItems] = useState<FeeItem[]>([{ label: 'Tuition', amount: 0 }]);

  const add = () => {
    if (!grade) return;
    addFeeStructure({ grade, items: items.filter((i) => i.label && i.amount > 0) });
    setItems([{ label: 'Tuition', amount: 0 }]);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Define fee items per grade. You can skip this and set up later in Settings.</p>
      {grades.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Add classes first (step 2) to define fee structures.</p>
      ) : (
        <>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Select value={grade} onValueChange={setGrade}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <Input className="col-span-7" value={it.label} onChange={(e) => setItems((arr) => arr.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="Item (e.g. Tuition)" />
                <Input className="col-span-4" type="number" value={it.amount || ''} onChange={(e) => setItems((arr) => arr.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) } : x))} placeholder="Amount (KES)" />
                <Button variant="ghost" size="icon" className="col-span-1 text-rose-600" onClick={() => setItems((arr) => arr.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setItems((arr) => [...arr, { label: '', amount: 0 }])}><Plus className="mr-1 h-3.5 w-3.5" /> Add fee item</Button>
          <Button onClick={add}><Plus className="mr-1 h-4 w-4" /> Save fee structure</Button>
        </>
      )}
      {data.feeStructures.length > 0 && (
        <div className="space-y-2">
          <Separator />
          <p className="text-xs font-medium text-muted-foreground">Saved structures</p>
          {data.feeStructures.map((f) => {
            const total = f.items.reduce((s, i) => s + i.amount, 0);
            return <div key={f.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-medium">{f.grade}</p><p className="text-[11px] text-muted-foreground">{f.items.map((i) => i.label).join(' · ')}</p></div><span className="font-semibold">KES {total.toLocaleString()}</span></div>;
          })}
        </div>
      )}
    </div>
  );
}

// ---- Step 6: Review -----------------------------------------------------
function StepReview() {
  const { data } = useInstitution();
  const info = data.info ?? defaultInfo;
  const totalFeeFor = (grade: string) => data.feeStructures.find((f) => f.grade === grade)?.items.reduce((s, i) => s + i.amount, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3"><p className="text-[10px] uppercase text-muted-foreground">Institution</p><p className="text-sm font-semibold">{info.name || '—'}</p><p className="text-[11px] text-muted-foreground">{info.type} · {info.curriculum}</p></div>
        <div className="rounded-lg border p-3"><p className="text-[10px] uppercase text-muted-foreground">Location</p><p className="text-sm font-semibold">{info.location || '—'}</p><p className="text-[11px] text-muted-foreground">{info.timezone} · {info.currency}</p></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border p-3 text-center"><p className="text-2xl font-bold">{data.classes.length}</p><p className="text-[10px] uppercase text-muted-foreground">Classes</p></div>
        <div className="rounded-lg border p-3 text-center"><p className="text-2xl font-bold">{data.staff.length}</p><p className="text-[10px] uppercase text-muted-foreground">Staff</p></div>
        <div className="rounded-lg border p-3 text-center"><p className="text-2xl font-bold">{data.subjects.length}</p><p className="text-[10px] uppercase text-muted-foreground">Subjects</p></div>
      </div>
      {data.feeStructures.length > 0 && (
        <div className="rounded-lg border p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Fee structures</p>
          <div className="space-y-1">{data.feeStructures.map((f) => <div key={f.id} className="flex justify-between text-sm"><span>{f.grade}</span><span className="font-semibold">KES {totalFeeFor(f.grade).toLocaleString()}</span></div>)}</div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">You can add students, invoices, assessments and more from each module after setup. Everything is saved to your MySQL database.</p>
    </div>
  );
}