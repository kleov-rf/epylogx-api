import { adminInterface } from '../management/interfaces'
import { userInterface } from './interfaces'

export interface MessageInterface {
  transmitter: string /* User */
  text: string
  receiver?: string /* User */
  sentDate?: Date
  isLiked?: boolean
}

class Message implements MessageInterface {
  transmitter: string
  text: string
  receiver: string
  sentDate: Date
  isLiked?: boolean = false

  constructor(data: MessageInterface) {
    this.transmitter = data.transmitter
    this.text = data.text
    this.receiver = data.receiver ?? ''
    this.sentDate = new Date()
  }
}

class messagesChat {
  messagesArray: any[]
  users: { [key: string]: userInterface }
  admins: { [key: string]: adminInterface }
  constructor() {
    this.messagesArray = []
    this.users = {}
    this.admins = {}
  }

  get lasts() {
    this.messagesArray = this.messagesArray.splice(0, 10)
    return this.messagesArray
  }

  get usersArray() {
    return Object.values(this.users)
  }
  
  get adminsArray() {
    return Object.values(this.admins)
  }

  sendMessage(data: MessageInterface) {
    this.messagesArray.unshift(<any>new Message(data))
  }

  connectUser(user: userInterface) {
    const id = `${(<any>user)._id}`
    this.users[id] = user
  }

  disconnectUser(user: userInterface) {
    delete this.users[(<any>user)._id]
  }

  connectAdmin(admin: adminInterface) {
    const id = `${(<any>admin)._id}`
    this.admins[id] = admin
  }

  disconnectAdmin(admin: adminInterface) {
    delete this.admins[(<any>admin)._id]
  }
}

export default messagesChat
