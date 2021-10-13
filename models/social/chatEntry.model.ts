
interface chatEntryInterface {
  author: string /* User */
  text: string
  receiver: string /* User */
  sentDate: Date
  hasLike?: boolean
}

class ChatEntry implements chatEntryInterface {
  author: string
  text: string
  receiver: string
  sentDate: Date
  hasLike: boolean = false

  constructor(data: chatEntryInterface) {
    this.author = data.author
    this.text = data.text
    this.receiver = data.receiver
    this.sentDate = data.sentDate
  }
}

export default ChatEntry
