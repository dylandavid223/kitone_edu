import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  path: '/',
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000,
})

interface Participant {
  id: string
  name: string
  role: 'host' | 'student'
  avatarColor: string
  micOn: boolean
  camOn: boolean
  handRaised: boolean
  joinedAt: number
}

interface ChatMessage {
  id: string
  roomId: string
  name: string
  role: 'host' | 'student' | 'system'
  text: string
  timestamp: number
}

interface WhiteboardStroke {
  id: string
  author: string
  color: string
  points: { x: number; y: number }[]
}

interface RoomState {
  id: string
  host: string | null
  participants: Map<string, Participant>
  messages: ChatMessage[]
  whiteboard: WhiteboardStroke[]
  startedAt: number
  recording: boolean
}

const rooms = new Map<string, RoomState>()
const genId = () => Math.random().toString(36).slice(2, 11)

function ensureRoom(roomId: string): RoomState {
  let r = rooms.get(roomId)
  if (!r) {
    r = { id: roomId, host: null, participants: new Map(), messages: [], whiteboard: [], startedAt: Date.now(), recording: false }
    rooms.set(roomId, r)
  }
  return r
}

function systemMessage(roomId: string, text: string): ChatMessage {
  return { id: genId(), roomId, name: 'System', role: 'system', text, timestamp: Date.now() }
}

function roomSummary(r: RoomState) {
  return {
    id: r.id,
    host: r.host,
    participants: Array.from(r.participants.values()),
    participantCount: r.participants.size,
    startedAt: r.startedAt,
    recording: r.recording,
  }
}

function leaveRoom(socket: any, roomId: string, participant: Participant) {
  const room = rooms.get(roomId)
  if (!room) return
  room.participants.delete(participant.id)
  if (room.host === participant.id) {
    const next = room.participants.values().next().value
    room.host = next?.id ?? null
    if (next) {
      next.role = 'host'
      room.participants.set(next.id, next)
      io.to(roomId).emit('participant:updated', next)
    }
  }
  socket.leave(roomId)
  const leaveMsg = systemMessage(roomId, `${participant.name} left the classroom`)
  room.messages.push(leaveMsg)
  socket.to(roomId).emit('participant:left', { participant, message: leaveMsg })
  io.to(roomId).emit('room:summary', roomSummary(room))
  if (room.participants.size === 0) {
    setTimeout(() => {
      const r = rooms.get(roomId)
      if (r && r.participants.size === 0) rooms.delete(roomId)
    }, 60_000)
  }
}

io.on('connection', (socket) => {
  let currentRoomId: string | null = null
  let currentParticipant: Participant | null = null

  console.log(`[socket] connected: ${socket.id}`)

  socket.on('room:join', (data: { roomId: string; name: string; role: 'host' | 'student'; avatarColor: string }) => {
    const { roomId, name, role, avatarColor } = data
    const room = ensureRoom(roomId)

    if (currentRoomId && currentParticipant) {
      leaveRoom(socket, currentRoomId, currentParticipant)
    }

    if (role === 'host' && !room.host) {
      room.host = socket.id
    }

    currentRoomId = roomId
    currentParticipant = {
      id: socket.id,
      name,
      role: room.host === socket.id ? 'host' : 'student',
      avatarColor,
      micOn: false,
      camOn: false,
      handRaised: false,
      joinedAt: Date.now(),
    }

    room.participants.set(socket.id, currentParticipant)
    socket.join(roomId)

    socket.emit('room:state', {
      ...roomSummary(room),
      messages: room.messages.slice(-100),
      whiteboard: room.whiteboard.slice(-50),
    })

    const joinMsg = systemMessage(roomId, `${name} joined the classroom`)
    room.messages.push(joinMsg)
    socket.to(roomId).emit('participant:joined', { participant: currentParticipant, message: joinMsg })
    io.to(roomId).emit('room:summary', roomSummary(room))
  })

  socket.on('chat:send', (data: { text: string }) => {
    if (!currentRoomId || !currentParticipant) return
    const room = rooms.get(currentRoomId)
    if (!room) return
    const text = (data.text ?? '').slice(0, 500).trim()
    if (!text) return
    const msg: ChatMessage = {
      id: genId(), roomId: currentRoomId, name: currentParticipant.name,
      role: currentParticipant.role, text, timestamp: Date.now(),
    }
    room.messages.push(msg)
    io.to(currentRoomId).emit('chat:message', msg)
  })

  socket.on('media:update', (data: { micOn?: boolean; camOn?: boolean }) => {
    if (!currentRoomId || !currentParticipant) return
    const room = rooms.get(currentRoomId)
    if (!room) return
    const p = room.participants.get(socket.id)
    if (!p) return
    if (typeof data.micOn === 'boolean') p.micOn = data.micOn
    if (typeof data.camOn === 'boolean') p.camOn = data.camOn
    room.participants.set(socket.id, p)
    io.to(currentRoomId).emit('participant:updated', p)
  })

  socket.on('hand:toggle', () => {
    if (!currentRoomId || !currentParticipant) return
    const room = rooms.get(currentRoomId)
    if (!room) return
    const p = room.participants.get(socket.id)
    if (!p) return
    p.handRaised = !p.handRaised
    room.participants.set(socket.id, p)
    io.to(currentRoomId).emit('participant:updated', p)
    const note = systemMessage(currentRoomId, `${p.name} ${p.handRaised ? 'raised' : 'lowered'} their hand`)
    room.messages.push(note)
    io.to(currentRoomId).emit('chat:message', note)
  })

  socket.on('whiteboard:stroke', (data: WhiteboardStroke) => {
    if (!currentRoomId || !currentParticipant) return
    const room = rooms.get(currentRoomId)
    if (!room) return
    room.whiteboard.push(data)
    if (room.whiteboard.length > 200) room.whiteboard.shift()
    socket.to(currentRoomId).emit('whiteboard:stroke', data)
  })

  socket.on('whiteboard:clear', () => {
    if (!currentRoomId || !currentParticipant) return
    const room = rooms.get(currentRoomId)
    if (!room || room.host !== socket.id) return
    room.whiteboard = []
    io.to(currentRoomId).emit('whiteboard:cleared')
  })

  socket.on('recording:toggle', () => {
    if (!currentRoomId || !currentParticipant) return
    const room = rooms.get(currentRoomId)
    if (!room || room.host !== socket.id) return
    room.recording = !room.recording
    io.to(currentRoomId).emit('recording:changed', room.recording)
    const note = systemMessage(currentRoomId, `Recording ${room.recording ? 'started' : 'stopped'}`)
    room.messages.push(note)
    io.to(currentRoomId).emit('chat:message', note)
  })

  socket.on('room:leave', () => {
    if (currentRoomId && currentParticipant) {
      leaveRoom(socket, currentRoomId, currentParticipant)
      currentRoomId = null
      currentParticipant = null
    }
  })

  socket.on('ping', () => socket.emit('pong', { t: Date.now() }))

  socket.on('disconnect', () => {
    if (currentRoomId && currentParticipant) {
      leaveRoom(socket, currentRoomId, currentParticipant)
    }
    console.log(`[socket] disconnected: ${socket.id}`)
  })

  socket.on('error', (err) => console.error(`[socket] error (${socket.id}):`, err))
})

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`[kitone-classroom] WebSocket server running on port ${PORT}`)
})

process.on('SIGTERM', () => httpServer.close(() => process.exit(0)))
process.on('SIGINT', () => httpServer.close(() => process.exit(0)))