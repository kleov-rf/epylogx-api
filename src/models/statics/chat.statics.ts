import moment from 'moment'
import { Schema } from 'mongoose'
import validator from 'validator'
import { minifiedISOString } from '../../helpers/adjust-input'
import { entriesDataQuery } from './interfaces'

const assignChatStatics = (chatSchema: Schema) => {
  chatSchema.statics.getRecentChatsToId = async function (
    metaUserId: string,
    days: number = 2
  ) {
    const query = {}

    if (!validator.isMongoId(metaUserId)) {
      throw new Error('Not a valid userId')
    }

    if (days != 0) {
      const yesterday = moment().set('day', 2 - days)
      Object.assign(query, { sentDate: { $gte: yesterday.toISOString() } })
    }

    const [chatsSentToId, chatsSentFromId] = await Promise.all([
      this.distinct('transmitter', {
        receiver: metaUserId,
        ...query,
      }),
      this.distinct('receiver', {
        transmitter: metaUserId,
        ...query,
      }),
    ])

    const chats = Array.from(
      new Set([
        ...chatsSentFromId.map((user: any) => user.toString()),
        ...chatsSentToId.map((user: any) => user.toString()),
      ])
    )

    return chats
  }

  chatSchema.statics.getEntries = async function ({
    from,
    to,
    text = '',
    recentDays = 0,
    isLiked = false,
  }: entriesDataQuery) {
    const query = { isLiked }

    if (from && validator.isMongoId(from)) {
      Object.assign(query, { transmitter: from })
    }

    if (to && validator.isMongoId(to)) {
      Object.assign(query, { receiver: to })
    }

    if (text && validator.isAlphanumeric(text, 'es-ES')) {
      const regexText = new RegExp(text, 'i')
      Object.assign(query, { text: regexText })
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
