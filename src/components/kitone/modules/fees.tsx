'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Wallet,
  TrendingDown,
  AlertTriangle,
  Clock,
  Plus,
  Phone,
  CheckCircle2,
  Loader2,
  Receipt,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { invoices, payments, formatKES, fmtEAT } from '../data';
import { StatusBadge } from '../ui/badges';
import { StatCard } from '../ui/stat-card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Invoice } from '../data';

type PayStep = 'idle' | 'confirm' | 'pending' | 'success';

export function FeesModule() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [payStep, setPayStep] = useState<PayStep>('idle');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [phone, setPhone] = useState('+254 712 345 678');
  const [confirmation, setConfirmation] = useState('');
  const { toast } = useToast();

  const filtered = invoices.filter((i) => statusFilter === 'all' || i.status === statusFilter);
  const collected = 8400000;
  const outstanding = 2400000;
  const overdue = 890000;
  const rate = Math.round((collected / (collected + outstanding)) * 100);

  function startPay(inv: Invoice) {
    setActiveInvoice(inv);
    const bal = inv.amount - inv.paid;
    setPayStep('confirm');
    // Pre-fill guardian phone from student lookup (mocked)
    setPhone('+254 712 *** 678');
    void bal;
  }

  function sendStk() {
    setPayStep('pending');
    // Simulate STK push + confirmation after ~3s
    setTimeout(() => {
      const code = 'SI' + Math.random().toString(36).slice(2, 10).toUpperCase();
      setConfirmation(code);
      setPayStep('success');
    }, 2800);
  }

  function closePay() {
    setPayStep('idle');
    setActiveInvoice(null);
    setConfirmation('');
    toast({ title: 'Payment recorded', description: 'Receipt sent via SMS + email' });
  }

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Collected (T2)" value={formatKES(collected)} sub="78% of billed" icon="wallet" trend="+12% vs Term 1" tone="emerald" />
        <StatCard label="Outstanding" value={formatKES(outstanding)} sub="327 students" icon="alert" trend="−4% this week" tone="amber" />
        <StatCard label="Overdue (90+)" value={formatKES(overdue)} sub="84 students" icon="clock" trend="+1.2% this week" tone="rose" />
        <StatCard label="Collection Rate" value={`${rate}%`} sub={`${formatKES(collected + outstanding)} billed`} icon="trending" trend="Target 85%" tone="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Aging + methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aging Report</CardTitle>
            <CardDescription>Outstanding by age bucket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { bucket: '0–30 days', amt: 980000, pct: 41, tone: 'bg-emerald-500' },
              { bucket: '31–60 days', amt: 620000, pct: 26, tone: 'bg-amber-500' },
              { bucket: '61–90 days', amt: 410000, pct: 17, tone: 'bg-orange-500' },
              { bucket: '90+ days', amt: 390000, pct: 16, tone: 'bg-rose-500' },
            ].map((a) => (
              <div key={a.bucket}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{a.bucket}</span>
                  <span className="text-muted-foreground">{formatKES(a.amt)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn('h-full rounded-full', a.tone)} style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Payment methods (this term)</p>
              {[
                { m: 'M-PESA', pct: 68, color: 'bg-emerald-500' },
                { m: 'Bank Transfer', pct: 18, color: 'bg-teal-500' },
                { m: 'Airtel Money', pct: 9, color: 'bg-amber-500' },
                { m: 'Cash', pct: 5, color: 'bg-muted-foreground' },
              ].map((p) => (
                <div key={p.m} className="flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0">{p.m}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', p.color)} style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className="w-8 text-right font-medium">{p.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reconciliation */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Auto-Reconciliation</CardTitle>
              <CardDescription>M-PESA Daraja · Paybill 247247</CardDescription>
            </div>
            <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Matched today</p>
                <p className="text-xl font-bold text-emerald-600">47</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Unmatched</p>
                <p className="text-xl font-bold text-amber-600">2</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Last sync</p>
                <p className="text-xl font-bold">2m</p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium">2 unmatched payments awaiting reference match</p>
                  <p className="text-[11px] text-muted-foreground">Likely wrong account number. Finance officer review needed.</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: 'Reviewing', description: 'Opening unmatched payment list' })}>Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Invoices</CardTitle>
            <CardDescription>{filtered.length} invoices · Term 2 2025</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['all', 'paid', 'pending', 'overdue'].map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All status' : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => toast({ title: 'New invoice', description: 'Opening invoice builder' })}>
              <Plus className="mr-1.5 h-4 w-4" /> New Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="kitone-scroll overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">Invoice</TableHead>
                  <TableHead className="text-xs">Student</TableHead>
                  <TableHead className="text-xs">Class</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs text-right">Paid</TableHead>
                  <TableHead className="text-xs text-right">Balance</TableHead>
                  <TableHead className="text-xs">Due</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => {
                  const bal = inv.amount - inv.paid;
                  return (
                    <TableRow key={inv.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">{inv.invoiceNo}</TableCell>
                      <TableCell className="font-medium">{inv.studentName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.className}</TableCell>
                      <TableCell className="text-right">{formatKES(inv.amount)}</TableCell>
                      <TableCell className="text-right text-emerald-600">{formatKES(inv.paid)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatKES(bal)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' })}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-right">
                        {inv.status !== 'paid' ? (
                          <Button size="sm" onClick={() => startPay(inv)}>
                            <Smartphone className="mr-1 h-3.5 w-3.5" /> Pay
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Receipt', description: `Receipt for ${inv.invoiceNo}` })}>
                            <Receipt className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Payments</CardTitle>
          <CardDescription>Auto-reconciled · last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="kitone-scroll max-h-[320px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">Student</TableHead>
                  <TableHead className="text-xs">Method</TableHead>
                  <TableHead className="text-xs">Confirmation</TableHead>
                  <TableHead className="text-xs">Phone</TableHead>
                  <TableHead className="text-xs">Time (EAT)</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{p.studentName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-[10px]', p.method === 'M-PESA' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400')}>{p.method}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.code}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.phone}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtEAT(p.timestamp)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatKES(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* M-PESA STK push flow */}
      <Dialog open={payStep !== 'idle'} onOpenChange={(v) => !v && setPayStep('idle')}>
        <DialogContent className="sm:max-w-md">
          {activeInvoice && payStep === 'confirm' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-emerald-600" /> Pay via M-PESA
                </DialogTitle>
                <DialogDescription>You will receive an STK push prompt on your phone</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Invoice</span>
                    <span className="font-mono text-xs">{activeInvoice.invoiceNo}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Student</span>
                    <span className="text-sm font-medium">{activeInvoice.studentName}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Balance due</span>
                    <span className="text-lg font-bold">{formatKES(activeInvoice.amount - activeInvoice.paid)}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">M-PESA phone number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">A prompt will appear on this phone. Enter your M-PESA PIN to confirm.</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 p-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Encrypted via Daraja API · Paybill 247247 · No PIN stored
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setPayStep('idle')}>Cancel</Button>
                <Button className="flex-1" onClick={sendStk}>Send STK Push</Button>
              </div>
            </>
          )}
          {payStep === 'pending' && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <DialogHeader className="sr-only">
                <DialogTitle>Waiting for M-PESA confirmation</DialogTitle>
                <DialogDescription>STK push sent to your phone</DialogDescription>
              </DialogHeader>
              <div className="relative mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              </div>
              <h3 className="text-base font-semibold">Waiting for M-PESA prompt…</h3>
              <p className="mt-1 text-sm text-muted-foreground">Check your phone: <span className="font-mono font-medium">{phone}</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Enter your M-PESA PIN to authorise the payment</p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Session expires in 2:00
              </div>
            </div>
          )}
          {payStep === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <DialogHeader className="sr-only">
                <DialogTitle>Payment successful</DialogTitle>
                <DialogDescription>M-PESA confirmation received</DialogDescription>
              </DialogHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-emerald-600">Payment Successful</h3>
              <p className="mt-1 text-sm text-muted-foreground">{formatKES(activeInvoice!.amount - activeInvoice!.paid)} received from {phone}</p>
              <div className="mt-4 w-full rounded-lg border p-3 text-left">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Confirmation code</span><span className="font-mono font-bold text-emerald-600">{confirmation}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Date</span><span>{fmtEAT(new Date().toISOString())}</span></div>
                <div className="mt-1 flex justify-between text-xs"><span className="text-muted-foreground">Invoice</span><span className="font-mono">{activeInvoice!.invoiceNo}</span></div>
                <div className="mt-1 flex justify-between text-xs"><span className="text-muted-foreground">Method</span><span>M-PESA Daraja</span></div>
              </div>
              <Button className="mt-4 w-full" onClick={closePay}>Done · Receipt sent via SMS</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
