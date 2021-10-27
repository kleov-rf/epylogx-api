import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'

const assignCommentStatics = (commentSchema: Schema) => {
  interface commentDataQuery {
    author?: string
    post?: string
    text?: string
    superComment?: string
    isHidden?: boolean
  }
  commentSchema.statics.getComments = async function ({
    author,
    post,
    text,
    superComment,
    isHidden,
  }: commentDataQuery) {
    const query = {}
    if (author && isValidObjectId(author)) {
      Object.assign(query, { author })
    }
    if (post && isValidObjectId(post)) {
      Object.assign(query, { post })
    }
    if (
      text &&
      validator.isAlphanumeric(text, 'es-ES', { ignore: ' ;,.¿?¡!' })
    ) {
      const textRegex = new RegExp(text)
      Object.assign(query, { text: textRegex })
    }
    if (superComment && isValidObjectId(superComment)) {
      Object.assign(query, { superComment })
    }
    if (isHidden != undefined) {
      Object.assign(query, { isHidden })
    }

    const comments = this.find(query)

    if (!comments) {
      throw new Error(`Couldn't find any comments results with data: ${query}`)
    }

    return comments
  }
}

export default assignCommentStatics
