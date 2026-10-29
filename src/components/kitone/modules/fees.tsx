'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wallet, AlertTriangle, Clock, Plus, Phone, CheckCircle2, Loader2, Smartphone, ShieldCheck } from 'lucide-react';
import { useInstitution, formatKES, fmtEAT, pickColor, initials, type Invoice } from '../institution-store';
import { StatusBadge } from '../ui/badges';
import { EmptyState } from '../empty-state';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type PayStep = 'idle' | 'confirm' | 'pending' | 'success';

export function FeesModule() {
  const { data, addPayment } = useInstitution();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [payStep, setPayStep] = useState<PayStep>('idle');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [phone, setPhone] = useState('+254 712 345 678');
  const [confirmation, setConfirmation] = useState('');

  const filtered = data.invoices.filter((i) => statusFilter === 'all' || i.status === statusFilter);
  const collected = data.payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = data.invoices.reduce((s, i) => s + (i.amount - i.paid), 0);
  const overdue = data.invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + (i.amount - i.paid), 0);
  const totalBilled = collected + outstanding;
  const rate = totalBilled > 0 ? Math.round((collected / totalBilled) * 100) : 0;

  function startPay(inv: Invoice) { setActiveInvoice(inv); setPayStep('confirm'); setPhone('+254 7xx xxx xxx'); }
  function sendStk() {
    setPayStep('pending');
    setTimeout(() => {
      const code = 'SI' + Math.random().toString(36).slice(2, 10).toUpperCase();
      setConfirmation(code); setPayStep('success');
      addPayment({ invoiceNo: activeInvoice!.invoiceNo, studentName: activeInvoice!.studentName, method: 'M-PESA', amount: activeInvoice!.amount - activeInvoice!.paid, code, phone, timestamp: new Date().toISOString() });
    }, 2800);
  }
  function closePay() { setPayStep('idle'); setActiveInvoice(null); setConfirmation(''); toast({ title: 'Payment recorded', description: 'Receipt sent via SMS + email' }); }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><Wallet className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">Collected</p><p className="text-lg font-bold">{formatKES(collected)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"><AlertTriangle className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">Outstanding</p><p className="text-lg font-bold">{formatKES(outstanding)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600"><Clock className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">Overdue</p><p className="text-lg font-bold">{formatKES(overdue)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase text-muted-foreground">Collection Rate</p><p className="text-lg font-bold">{rate}%</p></div><Progress value={rate} className="w-14 h-1.5" /></div></CardContent></Card>
      </div>

      {data.invoices.length === 0 ? (
        <EmptyState icon={Wallet} title="No invoices yet" description="Once you admit students and set fee structures, you can generate invoices and accept M-PESA payments." />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base">Invoices</CardTitle><CardDescription>{filtered.length} shown</CardDescription></div><div className="flex gap-2"><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger><SelectContent>{['all', 'paid', 'pending', 'overdue'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All status' : s}</SelectItem>)}</SelectContent></Select><Button onClick={() => toast({ title: 'New invoice' })}><Plus className="mr-1.5 h-4 w-4" /> New Invoice</Button></div></CardHeader>
          <CardContent className="p-0">
            <div className="kitone-scroll overflow-x-auto">
              <Table><TableHeader><TableRow className="bg-muted/40">
                <TableHead className="text-xs">Invoice</TableHead><TableHead className="text-xs">Student</TableHead><TableHead className="text-xs text-right">Amount</TableHead><TableHead className="text-xs text-right">Balance</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs text-right">Action</TableHead>
              </TableRow></TableHeader><TableBody>
                {filtered.map((inv) => { const bal = inv.amount - inv.paid; return (
                  <TableRow key={inv.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{inv.invoiceNo}</TableCell>
                    <TableCell className="font-medium">{inv.studentName}</TableCell>
                    <TableCell className="text-right">{formatKES(inv.amount)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatKES(bal)}</TableCell>
                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                    <TableCell className="text-right">{inv.status !== 'paid' ? <Button size="sm" onClick={() => startPay(inv)}><Smartphone className="mr-1 h-3.5 w-3.5" /> Pay</Button> : <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Receipt', description: inv.invoiceNo })}>Receipt</Button>}</TableCell>
                  </TableRow>
                ); })}
              </TableBody></Table>
            </div>
          </CardContent>
        </Card>
      )}

      {data.payments.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Payments</CardTitle><CardDescription>Auto-reconciled via M-PESA Daraja</CardDescription></CardHeader>
          <CardContent className="p-0">
            <div className="kitone-scroll max-h-[320px] overflow-y-auto">
              <Table><TableHeader className="sticky top-0 bg-card"><TableRow className="bg-muted/40">
                <TableHead className="text-xs">Student</TableHead><TableHead className="text-xs">Method</TableHead><TableHead className="text-xs">Code</TableHead><TableHead className="text-xs">Time (EAT)</TableHead><TableHead className="text-xs text-right">Amount</TableHead>
              </TableRow></TableHeader><TableBody>
                {data.payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium"><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className={`text-[10px] font-bold text-white ${pickColor(p.studentName)}`}>{initials(p.studentName)}</AvatarFallback></Avatar>{p.studentName}</div></TableCell>
                    <TableCell><Badge variant="outline" className={cn('text-[10px]', p.method === 'M-PESA' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400')}>{p.method}</Badge></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.code}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtEAT(p.timestamp)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatKES(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={payStep !== 'idle'} onOpenChange={(v) => !v && setPayStep('idle')}>
        <DialogContent className="sm:max-w-md">
          {activeInvoice && payStep === 'confirm' && (
            <>
              <DialogHeader><DialogTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-emerald-600" /> Pay via M-PESA</DialogTitle><DialogDescription>You will receive an STK push prompt</DialogDescription></DialogHeader>
              <div className="space-y-3">
                <div className="rounded-lg border p-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Invoice</span><span className="font-mono text-xs">{activeInvoice.invoiceNo}</span></div><div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">Student</span><span className="font-medium">{activeInvoice.studentName}</span></div><Separator className="my-2" /><div className="flex justify-between"><span className="text-sm">Balance due</span><span className="text-lg font-bold">{formatKES(activeInvoice.amount - activeInvoice.paid)}</span></div></div>
                <div className="space-y-1.5"><label className="text-xs font-medium">M-PESA phone number</label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" /></div></div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 p-2 text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Encrypted via Daraja API · No PIN stored</div>
              </div>
              <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setPayStep('idle')}>Cancel</Button><Button className="flex-1" onClick={sendStk}>Send STK Push</Button></div>
            </>
          )}
          {payStep === 'pending' && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <DialogHeader className="sr-only"><DialogTitle>Waiting</DialogTitle><DialogDescription>STK push sent</DialogDescription></DialogHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
              <h3 className="text-base font-semibold">Waiting for M-PESA prompt…</h3>
              <p className="mt-1 text-sm text-muted-foreground">Check your phone: <span className="font-mono font-medium">{phone}</span></p>
            </div>
          )}
          {payStep === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <DialogHeader className="sr-only"><DialogTitle>Payment successful</DialogTitle><DialogDescription>M-PESA confirmation received</DialogDescription></DialogHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"><CheckCircle2 className="h-9 w-9 text-emerald-600" /></div>
              <h3 className="text-lg font-bold text-emerald-600">Payment Successful</h3>
              <p className="mt-1 text-sm text-muted-foreground">{formatKES(activeInvoice!.amount - activeInvoice!.paid)} received</p>
              <div className="mt-4 w-full rounded-lg border p-3 text-left"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Confirmation code</span><span className="font-mono font-bold text-emerald-600">{confirmation}</span></div><Separator className="my-2" /><div className="flex justify-between text-xs"><span className="text-muted-foreground">Date</span><span>{fmtEAT(new Date().toISOString())}</span></div></div>
              <Button className="mt-4 w-full" onClick={closePay}>Done · Receipt sent via SMS</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}