import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'

const assignUserStatics = (userSchema: Schema) => {
  interface usersDataQuery {
    id?: string
    email?: string
    name?: string
  }

  userSchema.statics.getUser = async function ({
    id,
    email,
    name,
  }: usersDataQuery) {
    const query = {}

    if (id && isValidObjectId(id)) {
      Object.assign(query, { _id: id })
    } else if (id && validator.isAlphanumeric(id)) {
      Object.assign(query, { userId: id })
    }

    if (
      email &&
      validator.isEmail(email, { domain_specific_validation: true })
    ) {
      Object.assign(query, { email: email })
    }

    if (name && validator.isAlpha(name, 'es-ES', { ignore: ' ' })) {
      Object.assign(query, { fullName: name })
    }

    const user = await this.findOne(query)

    if (!user) {
      throw new Error(`Couldn't find any user results with data: ${query}`)
    }

    return user
  }

  userSchema.statics.getUsers = async function ({
    id,
    email,
    name,
  }: usersDataQuery) {
    const query = {}

    if (id && !isValidObjectId(id) && validator.isAlphanumeric(id)) {
      const regexId = new RegExp(id)
      Object.assign(query, { userId: regexId })
    }

    if (
      email &&
      validator.isAlphanumeric(email, undefined, { ignore: '@._-' })
    ) {
      const regexEmail = new RegExp(email)
      Object.assign(query, { email: regexEmail })
    }

    if (name && validator.isAlpha(name, 'es-ES', { ignore: ' ' })) {
      const regexName = new RegExp(name)
      Object.assign(query, { fullName: regexName })
    }

    const users = await this.find(query)

    if (!users) {
      throw new Error(`Couldn't find any users results with data: ${query}`)
    }

    return users
  }
}

export default assignUserStatics
