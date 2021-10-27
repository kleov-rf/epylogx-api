import moment from 'moment'
import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'
import { minifiedISOString } from '../../helpers/adjust-input'

const assignChatStatics = (chatSchema: Schema) => {
  chatSchema.statics.getRecentChatsToId = async function (
    userId: string,
    days: Number = 0
  ) {
    const query = {}

    if (!isValidObjectId(userId)) {
      throw new Error('Not a valid userId')
    }

    if (days != 0) {
      const yesterday = moment().set('date', -days)
      const yesterdayISO = minifiedISOString(yesterday)

      Object.assign(query, { sentDate: { $gte: yesterdayISO } })
    }

    const [chatsSentToId, chatsSentFromId] = await Promise.all([
      this.distinct('transmitter', {
        receiver: userId,
        ...query,
      }),
      this.distinct('receiver', {
        transmitter: userId,
        ...query,
      }),
    ])

    const chats = new Set([...chatsSentFromId, ...chatsSentToId])

    if (chats.size == 0) {
      throw new Error(
        `Couldn't find any chats from userId ${userId}, talk with someone`
      )
    }

    return chats
  }

  interface entriesDataQuery {
    from?: string
    to?: string
    text?: string
    recentDays?: number
    isLiked?: boolean
  }

  chatSchema.statics.getEntries = async function ({
    from,
    to,
    text = '',
    recentDays = 0,
    isLiked = false,
  }: entriesDataQuery) {
    const query = { isLiked }

    if (from && isValidObjectId(from)) {
      Object.assign(query, { transmitter: from })
    }

    if (to && isValidObjectId(to)) {
      Object.assign(query, { receiver: to })
    }

    if (validator.isAlphanumeric(text)) {
      Object.assign(query, { text: text })
    }

    if (recentDays !== 0) {
      const manyDaysAgo = moment().set('date', -recentDays)
      const manyDaysAgoISO = minifiedISOString(manyDaysAgo)

      Object.assign(query, { sentDate: { $gte: manyDaysAgoISO } })
    }

    const entries = await this.find(query)

    if (entries.size == 0) {
      throw new Error(`Couldn't find any entries with parameters ${query}`)
    }

    return entries
  }
}

export default assignChatStatics
