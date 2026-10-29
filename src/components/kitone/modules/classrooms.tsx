'use client';

import { useEffect, useState, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, VideoOff, Mic, MicOff, ScreenShare, Hand, PhoneOff, Users, Circle, PlayCircle, Eraser, Send, Radio, Wifi, WifiOff, Plus, PenTool } from 'lucide-react';
import { useInstitution, initials, pickColor, type ClassroomSession } from '../institution-store';
import { EmptyState } from '../empty-state';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Participant { id: string; name: string; role: 'host' | 'student'; avatarColor: string; micOn: boolean; camOn: boolean; handRaised: boolean; joinedAt: number; }
interface ChatMessage { id: string; roomId: string; name: string; role: 'host' | 'student' | 'system'; text: string; timestamp: number; }
interface WhiteboardStroke { id: string; author: string; color: string; points: { x: number; y: number }[]; }
interface RoomState { id: string; host: string | null; participants: Participant[]; participantCount: number; startedAt: number; recording: boolean; messages?: ChatMessage[]; whiteboard?: WhiteboardStroke[]; }

const CLASSROOM_PORT = 3003;

export function ClassroomsModule() {
  const { data, addSession } = useInstitution();
  const { toast } = useToast();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<ClassroomSession | null>(null);
  const sessions = data.sessions;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{sessions.length === 0 ? 'Schedule your first live classroom session.' : `${sessions.length} session${sessions.length === 1 ? '' : 's'} · real-time via WebSocket`}</p>
        <Button onClick={() => setScheduleOpen(true)} disabled={data.classes.length === 0}><Plus className="mr-1.5 h-4 w-4" /> Schedule session</Button>
      </div>
      {data.classes.length === 0 ? (
        <EmptyState icon={Video} title="No classes to schedule sessions for" description="Add classes in Settings or via the setup wizard, then schedule live classroom sessions here." />
      ) : sessions.length === 0 ? (
        <EmptyState icon={Video} title="No classroom sessions yet" description="Schedule a live session. Students join in real time with chat, hand-raise, and a shared whiteboard." action={{ label: 'Schedule first session', onClick: () => setScheduleOpen(true) }} />
      ) : (
        <div className="grid gap-3">
          {sessions.map((s) => {
            const isLive = s.status === 'live';
            return (
              <Card key={s.id} className={cn('transition-shadow hover:shadow-md', isLive && 'border-rose-500/40')}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', isLive ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600')}>
                      {isLive ? <Circle className="h-4 w-4 fill-current" /> : <Video className="h-5 w-5" />}
                    </div>
                    <div><p className="font-semibold">{s.className} · {s.subject}</p><p className="text-xs text-muted-foreground">{s.teacher} · {s.scheduledAt}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{s.status}</Badge>
                    <Button size="sm" onClick={() => setActiveSession(s)}>{isLive ? <><Radio className="mr-1 h-3.5 w-3.5" /> Join live</> : <><PlayCircle className="mr-1 h-3.5 w-3.5" /> Start & join</>}</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <ScheduleDialog open={scheduleOpen} onOpenChange={setScheduleOpen} onSchedule={addSession} />
      {activeSession && <LiveClassroom session={activeSession} onClose={() => setActiveSession(null)} onEnded={() => toast({ title: 'Session ended', description: `${activeSession.className} · ${activeSession.subject}` })} />}
    </div>
  );
}

function ScheduleDialog({ open, onOpenChange, onSchedule }: { open: boolean; onOpenChange: (v: boolean) => void; onSchedule: (s: Omit<ClassroomSession, 'id'>) => void }) {
  const { data } = useInstitution();
  const { toast } = useToast();
  const [classId, setClassId] = useState(data.classes[0]?.id ?? '');
  const [subject, setSubject] = useState(data.subjects[0]?.name ?? '');
  const [when, setWhen] = useState('');
  const [duration, setDuration] = useState('60');

  const schedule = () => {
    const cls = data.classes.find((c) => c.id === classId);
    if (!cls) return;
    const teacher = data.staff.find((s) => s.id === cls.teacherId)?.name ?? 'Unassigned';
    onSchedule({ classId: cls.id, className: cls.name, subject: subject || 'General', teacher, scheduledAt: when || 'Now', duration: Number(duration) || 60, status: 'scheduled' });
    onOpenChange(false);
    toast({ title: 'Session scheduled', description: `${cls.name} · ${subject}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Schedule classroom session</DialogTitle><DialogDescription>Students join via a real-time WebSocket room</DialogDescription></DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5"><Label>Class</Label><Select value={classId} onValueChange={setClassId}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{data.classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Subject</Label><Select value={subject} onValueChange={setSubject}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{data.subjects.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>When</Label><Input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. Today 14:00" /></div>
            <div className="space-y-1.5"><Label>Duration (min)</Label><Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
          </div>
        </div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={schedule} disabled={!classId}>Schedule</Button></div>
      </DialogContent>
    </Dialog>
  );
}

function LiveClassroom({ session, onClose, onEnded }: { session: ClassroomSession; onClose: () => void; onEnded: () => void }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [recording, setRecording] = useState(false);
  const [myId, setMyId] = useState('');
  const [isHost, setIsHost] = useState(true);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<WhiteboardStroke | null>(null);

  const myName = 'Institution Admin';
  const myColor = pickColor(myName);
  const roomId = `kitone-${session.id}`;

  useEffect(() => {
    const sock = io(`/?XTransformPort=${CLASSROOM_PORT}`, { transports: ['websocket', 'polling'], forceNew: true, reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000, timeout: 10000 });
    setSocket(sock);
   sock.on('connect', () => { setConnected(true); setMyId(sock.id ?? ''); sock.emit('room:join', { roomId, name: myName, role: 'host', avatarColor: myColor }); });
    sock.on('disconnect', () => setConnected(false));
    sock.on('room:state', (state: RoomState) => { setParticipants(state.participants); setMessages(state.messages ?? []); setStrokes(state.whiteboard ?? []); setRecording(state.recording); setIsHost(state.host === sock.id); renderStrokes(state.whiteboard ?? []); });
    sock.on('room:summary', (state: RoomState) => setParticipants(state.participants));
    sock.on('chat:message', (m: ChatMessage) => setMessages((arr) => [...arr, m]));
    sock.on('participant:joined', ({ participant, message }: { participant: Participant; message: ChatMessage }) => { setParticipants((arr) => arr.some((p) => p.id === participant.id) ? arr : [...arr, participant]); setMessages((arr) => [...arr, message]); });
    sock.on('participant:left', ({ participant, message }: { participant: Participant; message: ChatMessage }) => { setParticipants((arr) => arr.filter((p) => p.id !== participant.id)); setMessages((arr) => [...arr, message]); });
    sock.on('participant:updated', (p: Participant) => { setParticipants((arr) => arr.map((x) => x.id === p.id ? p : x)); if (p.id === myId) { setMicOn(p.micOn); setCamOn(p.camOn); setHandRaised(p.handRaised); } });
    sock.on('whiteboard:stroke', (s: WhiteboardStroke) => { setStrokes((arr) => [...arr, s]); drawStroke(s); });
    sock.on('whiteboard:cleared', () => { setStrokes([]); clearCanvas(); });
    sock.on('recording:changed', (rec: boolean) => setRecording(rec));
    return () => { sock.disconnect(); };
  }, [roomId]);

  useEffect(() => { chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const sendChat = () => { const text = chatInput.trim(); if (!text || !socket) return; socket.emit('chat:send', { text }); setChatInput(''); };
  const toggleMic = () => { const n = !micOn; setMicOn(n); socket?.emit('media:update', { micOn: n }); };
  const toggleCam = () => { const n = !camOn; setCamOn(n); socket?.emit('media:update', { camOn: n }); };
  const toggleHand = () => socket?.emit('hand:toggle');
  const toggleRecording = () => socket?.emit('recording:toggle');

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => { drawingRef.current = true; currentStrokeRef.current = { id: Math.random().toString(36).slice(2, 9), author: myName, color: '#10b981', points: [getPos(e)] }; };
  const moveDraw = (e: React.MouseEvent<HTMLCanvasElement>) => { if (!drawingRef.current || !currentStrokeRef.current) return; currentStrokeRef.current.points.push(getPos(e)); drawStroke(currentStrokeRef.current); };
  const endDraw = () => { if (!drawingRef.current || !currentStrokeRef.current) return; drawingRef.current = false; const s = currentStrokeRef.current; currentStrokeRef.current = null; setStrokes((arr) => [...arr, s]); socket?.emit('whiteboard:stroke', s); };

  function drawStroke(s: WhiteboardStroke) { const c = canvasRef.current; if (!c || s.points.length === 0) return; const ctx = c.getContext('2d'); if (!ctx) return; ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(s.points[0].x * c.width, s.points[0].y * c.height); for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x * c.width, s.points[i].y * c.height); ctx.stroke(); }
  function renderStrokes(all: WhiteboardStroke[]) { clearCanvas(); all.forEach(drawStroke); }
  function clearCanvas() { const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, c.width, c.height); }
  const leave = () => { socket?.emit('room:leave'); onEnded(); onClose(); };

  const me = participants.find((p) => p.id === myId);
  const others = participants.filter((p) => p.id !== myId);
  const tiles: Participant[] = [me, ...others].filter((p): p is Participant => p !== undefined);
  const padded: (Participant | null)[] = [...tiles, ...Array.from({ length: Math.max(0, 4 - tiles.length) }, () => null)].slice(0, 4);

  return (
    <Dialog open onOpenChange={(v) => !v && leave()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden p-0">
        <DialogHeader className="sr-only"><DialogTitle>Live classroom — {session.className}</DialogTitle><DialogDescription>Real-time session</DialogDescription></DialogHeader>
        <div className="flex h-[88vh] flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <span className={cn('flex h-2 w-2 rounded-full', connected ? 'bg-emerald-500 kitone-live-dot' : 'bg-rose-500')} />
              <span className="text-sm font-semibold">{session.className} · {session.subject}</span>
              <Badge variant="outline" className="text-[10px]">{participants.length} online</Badge>
              {recording && <Badge variant="outline" className="text-[10px] gap-1 text-rose-600 border-rose-500/30"><Circle className="h-2 w-2 fill-rose-500 text-rose-500" /> REC</Badge>}
            </div>
            <div>{connected ? <Badge variant="outline" className="gap-1 text-[10px] text-emerald-600 border-emerald-500/30"><Wifi className="h-3 w-3" /> Connected</Badge> : <Badge variant="outline" className="gap-1 text-[10px] text-rose-600 border-rose-500/30"><WifiOff className="h-3 w-3" /> Reconnecting…</Badge>}</div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col">
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/20">
                {padded.map((p, i) => (
                  <div key={p?.id ?? `empty-${i}`} className="relative aspect-video overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 via-card to-muted">
                    {p ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white', p.avatarColor)}>{initials(p.name)}</div>
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                          {!p.micOn && <MicOff className="h-2.5 w-2.5 text-rose-400" />}
                          {p.handRaised && <Hand className="h-2.5 w-2.5 text-amber-400" />}
                          {p.name}{p.id === myId ? ' (you)' : ''}
                        </div>
                        {p.role === 'host' && <span className="absolute top-1.5 right-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">Host</span>}
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">Empty seat</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-3 pb-3">
                <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-card px-3 py-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-medium"><PenTool className="h-3.5 w-3.5" /> Shared whiteboard</span>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => socket?.emit('whiteboard:clear')} disabled={!isHost}><Eraser className="mr-1 h-3 w-3" /> Clear</Button>
                </div>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={300}
                  onMouseDown={startDraw}
                  onMouseMove={moveDraw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  className="h-[220px] w-full rounded-b-lg border bg-white cursor-crosshair"
                />
              </div>
              <div className="flex items-center justify-center gap-2 border-t bg-card p-2">
                <Button size="icon" variant={micOn ? 'default' : 'outline'} className="h-9 w-9 rounded-full" onClick={toggleMic}>{micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}</Button>
                <Button size="icon" variant={camOn ? 'default' : 'outline'} className="h-9 w-9 rounded-full" onClick={toggleCam}>{camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}</Button>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={toggleHand}><Hand className={cn('h-4 w-4', handRaised && 'text-amber-500')} /></Button>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><ScreenShare className="h-4 w-4" /></Button>
                {isHost && <Button size="icon" variant={recording ? 'default' : 'outline'} className="h-9 w-9 rounded-full" onClick={toggleRecording}><Circle className={cn('h-4 w-4', recording && 'fill-current')} /></Button>}
                <div className="mx-2 h-6 w-px bg-border" />
                <Button size="icon" className="h-9 w-9 rounded-full bg-rose-600 hover:bg-rose-700" onClick={leave}><PhoneOff className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex w-72 flex-col border-l lg:w-80">
              <div className="flex items-center justify-between border-b p-3"><span className="text-xs font-semibold flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Live chat</span><Badge variant="secondary" className="text-[10px]">{participants.length} online</Badge></div>
              <div ref={chatScrollRef} className="kitone-scroll flex-1 space-y-2 overflow-y-auto p-3">
                {messages.length === 0 && <p className="py-4 text-center text-[11px] text-muted-foreground">No messages yet. Say hello!</p>}
                {messages.map((m) => (
                  <div key={m.id} className={cn('flex gap-2', m.role === 'system' ? 'justify-center' : m.name === myName ? 'flex-row-reverse' : '')}>
                    {m.role !== 'system' && <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', pickColor(m.name))}>{initials(m.name)}</div>}
                    <div className={cn('max-w-[78%]')}>
                      {m.role !== 'system' && <p className="text-[10px] text-muted-foreground">{m.name} · {new Date(m.timestamp).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</p>}
                      <div className={cn('inline-block rounded-lg px-2.5 py-1.5 text-xs', m.role === 'system' ? 'bg-muted text-muted-foreground italic' : m.name === myName ? 'bg-primary text-primary-foreground' : 'bg-muted')}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-2"><div className="flex gap-1.5"><Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} placeholder="Type a message…" className="h-8 text-xs" /><Button size="sm" className="h-8 w-8 p-0" onClick={sendChat} disabled={!chatInput.trim()}><Send className="h-3.5 w-3.5" /></Button></div></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}