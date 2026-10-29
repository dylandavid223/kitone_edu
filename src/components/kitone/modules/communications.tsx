'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Megaphone, Plus, Send, CheckCircle2, Eye } from 'lucide-react';
import { useInstitution, pickColor, initials, fmtEAT, type Announcement } from '../institution-store';
import { EmptyState } from '../empty-state';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const audienceColor: Record<string, string> = { All: 'bg-primary/10 text-primary', Parents: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', Staff: 'bg-teal-500/10 text-teal-700 dark:text-teal-400' };

export function CommunicationsModule() {
  const { data, addAnnouncement } = useInstitution();
  const { toast } = useToast();
  const [annOpen, setAnnOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="announcements">
        <div className="flex items-center justify-between"><TabsList><TabsTrigger value="announcements">Announcements</TabsTrigger><TabsTrigger value="messages">Messages</TabsTrigger><TabsTrigger value="sms">SMS Log</TabsTrigger></TabsList><Button onClick={() => setAnnOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> New Announcement</Button></div>

        <TabsContent value="announcements" className="mt-4">
          {data.announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements yet" description="Send announcements to all parents, staff, or specific grades. Delivered in-app and via SMS." action={{ label: 'Create first announcement', onClick: () => setAnnOpen(true) }} />
          ) : (
            <div className="space-y-3">{data.announcements.map((a) => (
              <Card key={a.id} className="hover:shadow-md transition-shadow"><CardContent className="p-4"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Megaphone className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{a.title}</p><Badge variant="outline" className={cn('text-[10px]', audienceColor[a.audience] ?? audienceColor.All)}>{a.audience}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{a.body}</p><div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{initials(a.author)}</AvatarFallback></Avatar>{a.author}</span><span>{new Date(a.date).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' })}</span><span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {a.views} views</span></div></div></div></CardContent></Card>
            ))}</div>
          )}
        </TabsContent>

        <TabsContent value="messages" className="mt-4"><Card><CardHeader><CardTitle className="text-base">Parent ↔ Teacher Inbox</CardTitle><CardDescription>Moderated threads</CardDescription></CardHeader><CardContent className="p-0"><div className="kitone-scroll max-h-[420px] overflow-y-auto"><p className="py-8 text-center text-sm text-muted-foreground">No messages yet. Parents will reach out via this inbox once admitted.</p></div></CardContent></Card></TabsContent>

        <TabsContent value="sms" className="mt-4"><Card><CardHeader><CardTitle className="text-base">SMS Log</CardTitle><CardDescription>Via Africa's Talking · sender ID: SCHOOL</CardDescription></CardHeader><CardContent>{data.payments.length === 0 && data.announcements.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No SMS sent yet. Payment confirmations and absence alerts will appear here.</p> : <div className="space-y-2">{data.payments.slice(0, 5).map((p) => (<div key={p.id} className="flex items-center gap-2 rounded-lg border p-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs">Payment confirmation · {p.studentName}</p><p className="text-[10px] text-muted-foreground">{fmtEAT(p.timestamp)} · Delivered</p></div><Badge variant="outline" className="text-[10px] text-emerald-600">Delivered</Badge></div>))}</div>}</CardContent></Card></TabsContent>
      </Tabs>
      <AnnDialog open={annOpen} onOpenChange={setAnnOpen} onCreate={addAnnouncement} />
    </div>
  );
}

function AnnDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (v: boolean) => void; onCreate: (a: Omit<Announcement, 'id'>) => void }) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('All');
  const [body, setBody] = useState('');

  const send = () => { if (!title.trim()) return; onCreate({ title: title.trim(), body: body.trim(), audience, author: 'Institution Admin', date: new Date().toISOString(), views: 0 }); setTitle(''); setBody(''); onOpenChange(false); toast({ title: 'Announcement sent', description: `Delivered to ${audience}` }); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>New Announcement</DialogTitle><DialogDescription>Sent via in-app + SMS based on audience</DialogDescription></DialogHeader><div className="space-y-3 py-1"><div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Term break notice" /></div><div className="space-y-1.5"><Label>Audience</Label><Select value={audience} onValueChange={setAudience}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['All', 'Parents', 'Staff'].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Message</Label><Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Announcement body…" /></div></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Save draft</Button><Button onClick={send}><Send className="mr-1.5 h-4 w-4" /> Send</Button></DialogFooter></DialogContent></Dialog>
  );
}