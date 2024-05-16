import app from '@adonisjs/core/services/app'
import Ws from '#services/ws'

app.ready(() => {
  Ws.boot()
  if (Ws.io) {
    // const homeSocket = Ws.io.of('/').use(wsAuth)
    // const ticketChatIo = Ws.io.of('/ticket_chat/').use(wsAuth)
    const socket = Ws.io.of('/uploads/')
  } else {
    console.error('Socket instance not found')
  }
})
