import { model, Schema } from 'mongoose'
import assignChatStatics from '../statics/chat.statics'
import { chatEntryInterface, ChatEntryModel } from './interfaces'

const ChatSchema = new Schema<chatEntryInterface>(
  {
    transmitter: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
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

const Chat = model<chatEntryInterface, ChatEntryModel>('Chat', ChatSchema, 'chats')

export default Chat
