'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  Hand,
  PhoneOff,
  Users,
  Circle,
  PlayCircle,
  Download,
  MessageSquare,
  LayoutGrid,
  PenTool,
  Settings as SettingsIcon,
} from 'lucide-react';
import { classroomSessions, chatMessages, avatarColor, initials } from '../data';
import { StatusBadge } from '../ui/badges';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ClassroomsModule() {
  const { toast } = useToast();
  const live = classroomSessions.find((s) => s.status === 'live');

  return (
    <div className="space-y-4">
      {/* Live classroom preview */}
      {live && (
        <Card className="overflow-hidden border-rose-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-rose-500/5">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                </span>
                Live now · {live.class}
              </CardTitle>
              <CardDescription>{live.subject} · {live.teacher} · {live.participants} participants</CardDescription>
            </div>
            <Button onClick={() => toast({ title: 'Joining classroom…', description: 'Opening Jitsi session' })}>
              <Video className="mr-1.5 h-4 w-4" /> Join
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Video grid */}
              <div className="lg:col-span-2 space-y-3 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {classroomSessions.slice(0, 4).map((_, i) => (
                    <div key={i} className="relative aspect-video overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 via-card to-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className={cn('text-sm font-bold text-white', avatarColor(`p${i}`))}>
                            {['GW', 'BO', 'AW', 'WK'][i]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                        {i === 0 ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3 text-rose-400" />}
                        {['Mrs. Wambui', 'Brian Otieno', 'Achieng W.', 'Wanjiru K.'][i]}
                      </div>
                      {i === 0 && <span className="absolute top-1.5 right-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">Host</span>}
                    </div>
                  ))}
                </div>
                {/* Whiteboard placeholder */}
                <div className="flex aspect-[16/6] items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                  <div className="text-center">
                    <PenTool className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-1 text-xs text-muted-foreground">Shared whiteboard · 2x − 4x + 7 = 0</p>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-center gap-2 rounded-lg border p-2">
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><Mic className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><Video className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><ScreenShare className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><Hand className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><LayoutGrid className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full"><SettingsIcon className="h-4 w-4" /></Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button size="icon" className="h-9 w-9 rounded-full bg-rose-600 hover:bg-rose-700"><PhoneOff className="h-4 w-4" /></Button>
                </div>
              </div>
              {/* Chat */}
              <div className="border-t lg:border-t-0 lg:border-l">
                <div className="flex items-center justify-between border-b p-3">
                  <p className="text-xs font-semibold flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Live chat</p>
                  <Badge variant="secondary" className="text-[10px]">{live.participants} online</Badge>
                </div>
                <div className="kitone-scroll max-h-[280px] space-y-2 overflow-y-auto p-3">
                  {chatMessages.map((m) => (
                    <div key={m.id} className={cn('flex gap-2', m.role === 'teacher' && 'flex-row-reverse text-right')}>
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className={cn('text-[10px] font-bold text-white', avatarColor(m.from))}>
                          {initials(m.from)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[75%]">
                        <p className="text-[10px] text-muted-foreground">{m.from} · {m.time}</p>
                        <div className={cn('mt-0.5 inline-block rounded-lg px-2.5 py-1.5 text-xs', m.role === 'teacher' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-2">
                  <div className="flex gap-2">
                    <input placeholder="Type a message…" className="flex-1 rounded-md border bg-transparent px-2 py-1.5 text-xs outline-none" />
                    <Button size="sm" className="h-8 px-2">Send</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions</CardTitle>
          <CardDescription>Upcoming, live, and past classroom sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {classroomSessions.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  s.status === 'live' ? 'bg-rose-500/10 text-rose-600' : s.status === 'upcoming' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'
                )}>
                  {s.status === 'live' ? <Circle className="h-4 w-4 fill-current" /> : s.status === 'upcoming' ? <Video className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{s.class} · {s.subject}</p>
                    <StatusBadge status={s.status} />
                    {s.recording && <Badge variant="outline" className="text-[10px] gap-1"><Circle className="h-2 w-2 fill-rose-500 text-rose-500" /> Recorded</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.teacher} · {s.time}{s.duration ? ` · ${s.duration}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.status === 'live' && <Button size="sm">Join</Button>}
                {s.status === 'upcoming' && <Button size="sm" variant="outline">Edit</Button>}
                {s.status === 'past' && (
                  <Button size="sm" variant="outline" onClick={() => toast({ title: 'Opening recording', description: `${s.duration} · ${s.class}` })}>
                    <PlayCircle className="mr-1 h-3.5 w-3.5" /> Watch
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recording library */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recording Library</CardTitle>
          <CardDescription>Encrypted at rest · auto-expiry 90 days</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classroomSessions.filter((s) => s.recording).map((s) => (
            <div key={s.id} className="overflow-hidden rounded-lg border">
              <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                <PlayCircle className="h-9 w-9 text-primary" />
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">{s.duration}</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{s.subject} · {s.class}</p>
                <p className="text-[11px] text-muted-foreground">{s.teacher}</p>
                <div className="mt-2 flex gap-1.5">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-7">Play</Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast({ title: 'Downloading…', description: `${s.duration} recording` })}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
