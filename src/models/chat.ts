import { model, Schema } from 'mongoose'
import assignChatStatics from './statics/chat.statics'

interface chatEntryInterface {
  transmitter: Schema.Types.ObjectId /* User */
  text: string
  receiver: Schema.Types.ObjectId /* User */
  sentDate: Date
  isLiked?: boolean
}

const ChatSchema = new Schema<chatEntryInterface>(
  {
    transmitter: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sentDate: Date,
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

ChatSchema.index({
  author: 1,
  receiver: 1,
  sentDate: -1,
})

assignChatStatics(ChatSchema)

const Chat = model('Chat', ChatSchema, 'chats')

export default Chat
