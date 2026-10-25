'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardList,
  Plus,
  Search,
  Clock,
  Users,
  Lock,
  Camera,
  MousePointerClick,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
} from 'lucide-react';
import { assessmentData, questionBank } from '../data';
import { StatusBadge } from '../ui/badges';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const difficultyColor: Record<string, string> = {
  Easy: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  Hard: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

export function AssessmentsModule() {
  const [createOpen, setCreateOpen] = useState(false);
  const [player, setPlayer] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="tests">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="tests">Live Tests</TabsTrigger>
            <TabsTrigger value="bank">Question Bank</TabsTrigger>
          </TabsList>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Create Test
          </Button>
        </div>

        <TabsContent value="tests" className="mt-4 space-y-3">
          {assessmentData.map((a) => (
            <Card key={a.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                      a.status === 'Live' ? 'bg-rose-500/10 text-rose-600' : a.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-600' : a.status === 'Closed' ? 'bg-muted text-muted-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{a.title}</p>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{a.className} · {a.subject}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.window}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.attempts}/{a.questions} attempts</span>
                        <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" /> {a.duration} min · {a.questions} Qs</span>
                        {a.avgScore > 0 && <span className="font-medium text-foreground">Avg {a.avgScore}%</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {a.status === 'Live' && (
                      <Button size="sm" onClick={() => setPlayer({ id: a.id })}>
                        <Play className="mr-1 h-3.5 w-3.5" /> Take test
                      </Button>
                    )}
                    {a.status === 'Scheduled' && (
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Preview', description: a.title })}>Preview</Button>
                    )}
                    {a.status === 'Closed' && (
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Results', description: `${a.attempts} submissions · avg ${a.avgScore}%` })}>View results</Button>
                    )}
                    {a.status === 'Draft' && (
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Continue drafting', description: a.title })}>Edit draft</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bank" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Question Bank</CardTitle>
                <CardDescription>{questionBank.length} questions · reusable across tests</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search questions…" className="pl-9 w-[200px]" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="kitone-scroll overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs">Question</TableHead>
                      <TableHead className="text-xs">Subject</TableHead>
                      <TableHead className="text-xs">Topic</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionBank.map((q) => (
                      <TableRow key={q.id} className="hover:bg-muted/30">
                        <TableCell className="max-w-xs text-sm">{q.stem}</TableCell>
                        <TableCell className="text-xs">{q.subject}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{q.topic}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{q.type}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={cn('text-[10px]', difficultyColor[q.difficulty])}>{q.difficulty}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateTestDialog open={createOpen} onOpenChange={setCreateOpen} />
      <TestPlayer open={!!player} onOpenChange={(v) => !v && setPlayer(null)} />
    </div>
  );
}

function CreateTestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const steps = ['Details', 'Questions', 'Settings'];

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep(0); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Online Test</DialogTitle>
          <DialogDescription>Step {step + 1} of {steps.length} · {steps[step]}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-1 mb-2">
          {steps.map((s, i) => (
            <div key={s} className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-muted')} />
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-3 py-1">
            <div className="space-y-1.5">
              <Label>Test title</Label>
              <Input placeholder="e.g. Mathematics · Algebra CAT" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select defaultValue="Mathematics">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Class</Label>
                <Select defaultValue="Grade 9 East">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Grade 9 East', 'Grade 9 West', 'Form 3 North'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start</Label>
                <Input type="datetime-local" defaultValue="2025-06-10T09:00" />
              </div>
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input type="number" defaultValue={60} />
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Add from question bank</p>
                <p className="text-xs text-muted-foreground">Pick existing questions by subject & topic</p>
              </div>
              <Button variant="outline" size="sm">Browse</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Author new question</p>
                <p className="text-xs text-muted-foreground">MCQ, True/False, Short answer, Essay, Fill-in-blank</p>
              </div>
              <Button variant="outline" size="sm">Add</Button>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">3 questions selected · 20 marks</p>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3 py-1">
            <div className="rounded-lg border p-3 space-y-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Anti-cheat & integrity</p>
              <Toggle icon={MousePointerClick} label="Randomize question order" desc="Each student gets a unique sequence" defaultChecked />
              <Toggle icon={Users} label="Pool from larger set" desc="Pull N from M questions per attempt" />
              <Toggle icon={Lock} label="Browser lockdown (kiosk)" desc="Prevent tab switching on PWA" defaultChecked />
              <Toggle icon={MousePointerClick} label="Copy-paste detection" desc="Log clipboard events" defaultChecked />
              <Toggle icon={Camera} label="Webcam snapshots (consent)" desc="Optional · requires student consent" />
              <Toggle icon={ShieldAlert} label="Tab-switch monitoring" desc="Warn & log focus loss events" defaultChecked />
            </div>
            <div className="rounded-lg border p-3 space-y-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Attempts & feedback</p>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Max attempts</Label>
                <Input type="number" defaultValue={1} className="w-20 h-8" />
              </div>
              <Toggle icon={CheckCircle2} label="Immediate feedback" desc="Show score after submit" defaultChecked />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>}
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
          ) : (
            <Button onClick={() => { onOpenChange(false); setStep(0); toast({ title: 'Test published', description: 'Students notified via SMS + in-app' }); }}>Publish test</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Toggle({ icon: Icon, label, desc, defaultChecked }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-[11px] text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

const testQuestions = [
  { id: 'q1', stem: 'Solve for x: 3x + 7 = 22', options: ['x = 3', 'x = 5', 'x = 7', 'x = 15'], answer: 1 },
  { id: 'q2', stem: 'Simplify: 2(x + 3) − 4', options: ['2x − 1', '2x + 2', '2x + 6', '2x + 10'], answer: 1 },
  { id: 'q3', stem: 'What is the slope of y = 2x + 5?', options: ['2', '5', '−5', '−2'], answer: 0 },
  { id: 'q4', stem: 'Factor: x² − 9', options: ['(x−3)(x−3)', '(x+3)(x−3)', '(x+9)(x−1)', '(x−9)(x+1)'], answer: 1 },
  { id: 'q5', stem: 'If f(x) = 2x + 3, find f(4).', options: ['7', '11', '8', '12'], answer: 1 },
];

function TestPlayer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Online test player</DialogTitle>
          <DialogDescription>Take the assessment with timer and anti-cheat monitoring</DialogDescription>
        </DialogHeader>
        {open && <TestPlayerInner onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

function TestPlayerInner({ onOpenChange }: { onOpenChange: (v: boolean) => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 45); // 45 min

  // Countdown timer (external interval) — only sets state inside the interval callback.
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const answered = Object.keys(answers).length;
  const score = testQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);

  function submit() {
    setSubmitted(true);
  }

  return (
    <>
      {!submitted ? (
        <div className="flex flex-col h-[80vh]">
            {/* Anti-cheat strip */}
            <div className="flex items-center justify-between border-b bg-rose-500/5 px-4 py-2">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-600" /> Browser locked</span>
                <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3 text-emerald-600" /> Copy-paste blocked</span>
                <span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3 text-emerald-600" /> Tab monitoring ON</span>
                <span className="flex items-center gap-1"><Camera className="h-3 w-3 text-muted-foreground" /> Webcam off</span>
              </div>
              <div className={cn('flex items-center gap-1.5 font-mono font-bold', timeLeft < 300 ? 'text-rose-600' : 'text-foreground')}>
                <Clock className="h-4 w-4" />
                {mm}:{ss}
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Question */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">Question {current + 1} of {testQuestions.length}</Badge>
                  <Badge variant="outline" className="text-[10px]">2 marks</Badge>
                </div>
                <p className="text-base font-medium leading-relaxed">{testQuestions[current].stem}</p>
                <div className="mt-4 space-y-2">
                  {testQuestions[current].options.map((opt, i) => {
                    const selected = answers[current] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-muted/50',
                          selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                        )}
                      >
                        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold', selected ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex justify-between">
                  <Button variant="outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>
                  {current < testQuestions.length - 1 ? (
                    <Button onClick={() => setCurrent(current + 1)}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
                  ) : (
                    <Button onClick={submit} className="bg-emerald-600 hover:bg-emerald-700">Submit test</Button>
                  )}
                </div>
              </div>

              {/* Navigator */}
              <div className="w-48 shrink-0 border-l p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Navigator</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {testQuestions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={cn(
                        'flex h-8 items-center justify-center rounded-md text-xs font-medium transition-colors',
                        i === current ? 'bg-primary text-primary-foreground' : answers[i] !== undefined ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Answered</span><span className="font-medium">{answered}/{testQuestions.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Remaining</span><span className="font-medium">{testQuestions.length - answered}</span></div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
                  <Flag className="mr-1 h-3 w-3" /> Flag for review
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className={cn('mb-4 flex h-16 w-16 items-center justify-center rounded-full', score >= testQuestions.length * 0.6 ? 'bg-emerald-500/15' : 'bg-amber-500/15')}>
              {score >= testQuestions.length * 0.6 ? <CheckCircle2 className="h-9 w-9 text-emerald-600" /> : <AlertTriangle className="h-9 w-9 text-amber-600" />}
            </div>
            <h3 className="text-lg font-bold">Test Submitted</h3>
            <p className="mt-1 text-sm text-muted-foreground">Auto-graded · objective questions</p>
            <div className="mt-4 rounded-lg border p-4">
              <p className="text-xs uppercase text-muted-foreground">Your score</p>
              <p className="text-3xl font-bold">{score}/{testQuestions.length}</p>
              <p className="text-sm font-medium text-emerald-600">{Math.round((score / testQuestions.length) * 100)}% · {score >= 4 ? 'EE · Exceeding' : score >= 3 ? 'ME · Meeting' : score >= 2 ? 'AE · Approaching' : 'BE · Below'}</p>
            </div>
            <div className="mt-4 w-full max-w-md space-y-1.5">
              {testQuestions.map((q, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border px-3 py-1.5 text-xs">
                  <span className="truncate">Q{i + 1}: {q.stem.slice(0, 40)}…</span>
                  {answers[i] === q.answer ? (
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Correct</span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600"><XCircle className="h-3.5 w-3.5" /> Wrong</span>
                  )}
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}
    </>
  );
}
