const socket = new io('ws://localhost:3500')

const activity = document.querySelector('.activity')
const input = document.querySelector('input')

/**
 * @param {Event} e
 */
function sendMessage (e) {
  e.preventDefault()

  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }

  input.focus()
}

document.querySelector('form')
  .addEventListener('submit', sendMessage)

socket.on('message', data => {
  activity.textContent = ''
  const li = document.createElement('li')
  li.textContent = data

  document.querySelector('ul')
    .appendChild(li)
})

let activityTimer
socket.on('activity', id => {
  activity.textContent = `${id} is typing...`

  clearTimeout(activityTimer)
  activityTimer = setTimeout(() => {
    activity.textContent = ''
  }, 1000)
})

input.addEventListener('input', () => {
  socket.emit('activity', socket.id)
})
