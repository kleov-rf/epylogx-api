import { Socket } from 'socket.io'
import { checkJWT } from '../helpers/validate-jwt'
import messagesChat, { MessageInterface } from '../models/social/socketChat'

const chat = new messagesChat()

const socketController = async (socket: Socket, io: any) => {
  const token = socket.handshake.headers['x-token']
  const user = await checkJWT(token)
  if (!user) {
    return socket.disconnect()
  }
  // Add connected user
  chat.connectUser(<any>user)
  io.emit('active-users', chat.usersArray)
  // socket.emit('get-messages', chat.lasts)
  // // Connect to another user
  // socket.join(user._id)
  // // Clean when somebody disconnects
  // socket.on('disconnect', () => {
  //   chat.disconnectUser(user._id)
  //   io.emit('active-users', chat.usersArray)
  // })
  // // Send message
  // socket.on(
  //   'send-message',
  //   ({ transmitter, receiver, text }: MessageInterface) => {
  //     if (receiver) {
  //       socket.to(receiver).emit('mensaje-privado', { transmitter, text })
  //     } else {
  //       io.emit('recibir-mensajes', chat.lasts)
  //     }
  //   }
  // )
}

export default socketController
