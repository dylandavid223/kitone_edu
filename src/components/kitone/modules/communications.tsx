'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Megaphone,
  Plus,
  Mail,
  MessageSquare,
  Phone,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone,
} from 'lucide-react';
import { announcements, smsLog, avatarColor, initials, fmtEAT, formatKES } from '../data';
import { StatusBadge } from '../ui/badges';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const audienceColor: Record<string, string> = {
  All: 'bg-primary/10 text-primary',
  Parents: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Grade: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  Staff: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
};

export function CommunicationsModule() {
  const [annOpen, setAnnOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsType, setSmsType] = useState('all');
  const { toast } = useToast();

  const filteredSms = smsType === 'all' ? smsLog : smsLog.filter((s) => s.type === smsType);
  const sentToday = smsLog.length;
  const delivered = smsLog.filter((s) => s.status === 'Delivered').length;
  const cost = smsLog.reduce((s, x) => s + x.cost, 0);

  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Send className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">SMS today</p><p className="text-lg font-bold">{sentToday}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">Delivery rate</p><p className="text-lg font-bold">{Math.round((delivered / sentToday) * 100)}%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"><Smartphone className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">Cost today</p><p className="text-lg font-bold">{formatKES(cost)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Smartphone className="h-4 w-4" /></span><div><p className="text-[10px] uppercase text-muted-foreground">SMS balance</p><p className="text-lg font-bold">6,600</p></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="sms">SMS Log</TabsTrigger>
        </TabsList>

        {/* Announcements */}
        <TabsContent value="announcements" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setAnnOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> New Announcement</Button>
          </div>
          {announcements.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{a.title}</p>
                      <Badge variant="outline" className={cn('text-[10px]', audienceColor[a.audience] ?? audienceColor.All)}>{a.audience}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{initials(a.author)}</AvatarFallback></Avatar>{a.author}</span>
                      <span>{new Date(a.date).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {a.views} views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Messages */}
        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parent ↔ Teacher Inbox</CardTitle>
              <CardDescription>3 unread threads · moderated</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="kitone-scroll max-h-[420px] overflow-y-auto">
                {[
                  { id: 'm1', from: 'Peter Kamau (Parent)', subject: 'Wanjiru performance enquiry', preview: 'Good evening Mrs. Wambui, I wanted to discuss Wanjiru’s recent…', time: '2h ago', unread: true },
                  { id: 'm2', from: 'Jane Mwangi (Parent)', subject: 'Fee installment request', preview: 'Can I pay the balance in two installments before end of…', time: '5h ago', unread: true },
                  { id: 'm3', from: 'Grace Otieno (Parent)', subject: 'Brian absent tomorrow', preview: 'Brian will be attending a family event tomorrow. Kindly…', time: '1d ago', unread: true },
                  { id: 'm4', from: 'Daniel Kiprop (Parent)', subject: 'Cherono transport', preview: 'Thank you for the update on the transport routes.', time: '2d ago', unread: false },
                  { id: 'm5', from: 'Samuel Wanjala (Parent)', subject: 'Achieng health', preview: 'Achieng has a doctor’s appointment Thursday afternoon.', time: '3d ago', unread: false },
                ].map((m) => (
                  <div key={m.id} className={cn('flex items-start gap-3 border-b p-3 hover:bg-muted/40 cursor-pointer', m.unread && 'bg-primary/5')}>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={cn('text-xs font-bold text-white', avatarColor(m.from))}>
                        {initials(m.from)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn('text-sm truncate', m.unread && 'font-bold')}>{m.from}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                      </div>
                      <p className={cn('text-xs truncate', m.unread ? 'font-medium' : 'text-muted-foreground')}>{m.subject}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{m.preview}</p>
                    </div>
                    {m.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Log */}
        <TabsContent value="sms" className="mt-4 space-y-3">
          <div className="flex justify-end gap-2">
            <Select value={smsType} onValueChange={setSmsType}>
              <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['all', 'Absence Alert', 'Fee Reminder', 'Exam Notice', 'General'].map((s) => (
                  <SelectItem key={s} value={s}>{s === 'all' ? 'All types' : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setSmsOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> Compose SMS</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="kitone-scroll max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Recipient</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Message</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Cost</th>
                      <th className="px-4 py-3 font-medium">Time (EAT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSms.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7"><AvatarFallback className={cn('text-[10px] font-bold text-white', avatarColor(s.recipient))}>{initials(s.recipient)}</AvatarFallback></Avatar>
                            <div>
                              <p className="text-xs font-medium">{s.recipient}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">{s.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{s.type}</Badge></td>
                        <td className="px-4 py-3 max-w-[260px] text-xs text-muted-foreground truncate">{s.preview}</td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium',
                            s.status === 'Delivered' ? 'text-emerald-600' : s.status === 'Pending' ? 'text-amber-600' : 'text-rose-600')}>
                            {s.status === 'Delivered' ? <CheckCircle2 className="h-3 w-3" /> : s.status === 'Pending' ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs">{formatKES(s.cost)}</td>
                        <td className="px-4 py-3 text-[11px] text-muted-foreground">{fmtEAT(s.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New announcement dialog */}
      <Dialog open={annOpen} onOpenChange={setAnnOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogDescription>Sent via in-app + SMS/email based on audience</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5"><Label>Title</Label><Input placeholder="e.g. Term 2 Mid-term Break" /></div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select defaultValue="All">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['All', 'Parents', 'Staff', 'Grade 9', 'Form 4'].map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Message</Label><Textarea rows={4} placeholder="Announcement body…" /></div>
            <div className="flex items-center gap-2 rounded-lg border p-2 text-[11px] text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> Estimated cost: <strong className="text-foreground">KES 780</strong> (780 SMS · Africa’s Talking)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnOpen(false)}>Save draft</Button>
            <Button onClick={() => { setAnnOpen(false); toast({ title: 'Announcement sent', description: '780 recipients notified · in-app + SMS' }); }}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compose SMS */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compose SMS</DialogTitle>
            <DialogDescription>Africa’s Talking · sender ID ALLIANCE</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label>Recipients</Label>
              <Select defaultValue="all-parents">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-parents">All parents (842)</SelectItem>
                  <SelectItem value="grade-9">Grade 9 parents (167)</SelectItem>
                  <SelectItem value="arrears">Fee arrears parents (84)</SelectItem>
                  <SelectItem value="custom">Custom list</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Message (160 chars per SMS)</Label>
              <Textarea rows={3} placeholder="Dear parent, …" maxLength={320} />
              <p className="text-[11px] text-muted-foreground">2 SMS per recipient · KES 2.00 each</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSmsOpen(false); toast({ title: 'SMS queued', description: '842 messages · KES 1,684 estimated' }); }}><Send className="mr-1.5 h-4 w-4" /> Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
