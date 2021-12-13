import { AES, enc } from 'crypto-js'
import { Socket } from 'socket.io'
import { checkJWT } from '../helpers/validate-jwt'
import { Chat } from '../models'
import messagesChat, { MessageInterface } from '../models/social/socketChat'

const chat = new messagesChat()

const socketController = async (socket: Socket, io: any) => {
  const token = socket.handshake.headers['x-token']
  const user = await checkJWT(token)
  if (!user) {
    return socket.disconnect()
  }

  socket.join(user.id)
  socket.emit('this-user', user)
  // Add connected user
  if ((<any>user).adminId) {
    chat.connectAdmin(<any>user)
  } else {
    chat.connectUser(<any>user)
  }

  io.emit('active-admins', chat.adminsArray)
  io.emit('active-users', chat.usersArray)
  socket.on(
    'send-message',
    async ({
      message: {
        transmitter,
        receiver,
        text,
        isLiked,
        isEdited,
        isHidden,
        sentDate,
      },
    }) => {
      const encryptedText = AES.encrypt(
        text,
        <any>process.env.SECRETORPRIVATEKEY
      )
      const data = {
        transmitter,
        receiver,
        text: encryptedText,
        isLiked,
        isEdited,
        isHidden,
        sentDate,
      }
      const newMessage = new Chat(data)
      await newMessage.save()
      const decryptedText = AES.decrypt(
        newMessage.text,
        <any>process.env.SECRETORPRIVATEKEY
      ).toString(enc.Utf8)
      Object.assign(newMessage, { text: decryptedText })
      socket.to(receiver).emit('get-message', { message: newMessage })
    }
  )

  socket.on('disconnect', () => {
    if ((<any>user).adminId) {
      chat.disconnectAdmin(<any>user)
      io.emit('active-users', chat.usersArray)
    } else {
      chat.disconnectUser(<any>user)
      io.emit('active-admins', chat.adminsArray)
    }
  })
}

export default socketController
