import { Request, Response } from 'express'
import { Chat } from '../models'
import { AES, enc } from 'crypto-js'

const getChatsEntries = async (req: Request, res: Response) => {
  const { from, to, text, recentDays, isLiked } = req.query

  const query = {}
  if (from) {
    Object.assign(query, { from })
  }
  if (to) {
    Object.assign(query, { to })
  }
  if (text) {
    Object.assign(query, { text })
  }
  if (recentDays) {
    Object.assign(query, { recentDays })
  }
  if (isLiked) {
    Object.assign(query, { isLiked })
  }

  const chats = await Chat.getEntries(query)

  return res.json(
    chats.map((entry: { text: string | CryptoJS.lib.CipherParams }) => {
      Object.assign(entry, {
        text: AES.decrypt(
          entry.text,
          <any>process.env.SECRETORPRIVATEKEY
        ).toString(enc.Utf8),
      })
      return entry
    })
  )
}

const getChatEntry = async (req: Request, res: Response) => {
  const { id } = req.params

  const chat = await Chat.findById(id)

  return res.json(
    Object.assign(chat, {
      text: AES.decrypt(
        (<any>chat).text,
        <any>process.env.SECRETORPRIVATEKEY
      ).toString(enc.Utf8),
    })
  )
}

const createChatEntry = async (req: Request, res: Response) => {
  const { transmitter, text, receiver, sentDate } = req.body

  const encryptedText = AES.encrypt(text, <any>process.env.SECRETORPRIVATEKEY)

  const data = {
    transmitter,
    text: encryptedText,
    receiver,
    sentDate,
  }

  const newChat = new Chat(data)

  await newChat.save()

  return res.json(newChat)
}

const modifyChatEntry = async (req: Request, res: Response) => {
  const { id } = req.params
  const { text, isLiked, isHidden } = req.body

  const data = {}

  if (text) {
    Object.assign(data, { text, isEdited: true })
  }
  if (isLiked != undefined) {
    Object.assign(data, { isLiked })
  }
  if (isHidden != undefined) {
    Object.assign(data, { isHidden })
  }

  const newChatEntry = await Chat.findByIdAndUpdate(id, data, { new: true })

  return res.json(newChatEntry)
}

const deleteChatEntry = async (req: Request, res: Response) => {
  const { id } = req.params

  const oldChatEntry = await Chat.findByIdAndUpdate(
    id,
    { isHidden: true },
    { new: true }
  )

  return res.json(oldChatEntry)
}

export {
  getChatsEntries,
  getChatEntry,
  createChatEntry,
  modifyChatEntry,
  deleteChatEntry,
}
