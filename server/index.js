import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server } from 'socket.io'

// Workaround needed because we use ESmodules instead of commonJS.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT ?? '3500'
const expressServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

const io = new Server(expressServer)

io.on('connection', socket => {
  // Next line emits only to the user connected.
  socket.emit('message', 'Welcome to chat app')

  // Next line emits to all others connected users.
  socket.broadcast.emit('message', `User ${socket.id} connected`)

  socket.on('message', data => {
    // Next line emits to all connected users.
    io.emit('message', `${socket.id}: ${data}`)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `User ${socket.id} disconnected`)
  })

  socket.on('activity', id => {
    socket.broadcast.emit('activity', id)
  })
})
