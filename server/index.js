import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? false
      : ['http://localhost:5500', 'http://127.0.0.1:5500']
  }
})

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)

  socket.on('message', data => {
    console.log(data)
    io.emit('message', `${socket.id}: ${data}`)
  })
})

const PORT = process.env.PORT ?? '3500'
httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`))
