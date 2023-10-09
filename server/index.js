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
  console.log(`User ${socket.id} connected`)

  socket.on('message', data => {
    console.log(data)
    io.emit('message', `${socket.id}: ${data}`)
  })
})
