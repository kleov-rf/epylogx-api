import { Schema } from 'mongoose'
import validator from 'validator'
import { usersDataQuery } from './interfaces'

const assignUserStatics = (userSchema: Schema) => {
  userSchema.statics.getUser = async function ({
    id,
    userId,
    email,
    name,
    isActive,
  }: usersDataQuery) {
    const query = {}

    if (isActive != undefined) {
      Object.assign(query, { isActive: !!isActive })
    }

    if (id && validator.isMongoId(id)) {
      Object.assign(query, { _id: id })
    }

    if (
      userId &&
      validator.isAlphanumeric(userId, undefined, { ignore: '_-.' })
    ) {
      Object.assign(query, { userId })
    }

    if (
      email &&
      validator.isEmail(email, { domain_specific_validation: true })
    ) {
      Object.assign(query, { email })
    }

    if (name && validator.isAlpha(name, 'es-ES', { ignore: ' ' })) {
      Object.assign(query, { fullName: name })
    }

    const user = await this.findOne(query)

    if (!user) {
      throw new Error(
        `Couldn't find any user results with data: ${query.toString()}`
      )
    }

    return user
  }

  userSchema.statics.getUsers = async function ({
    userId,
    email,
    name,
    isActive,
  }: usersDataQuery) {
    const query = {}

    if (isActive != undefined) {
      Object.assign(query, { isActive: !!isActive })
    }

    if (
      userId &&
      !validator.isMongoId(userId) &&
      validator.isAlphanumeric(userId)
    ) {
      const regexId = new RegExp(userId, 'i')
      Object.assign(query, { userId: regexId })
    }

    if (
      email &&
      validator.isAlphanumeric(email, undefined, { ignore: '._-' })
    ) {
      const regexEmail = new RegExp(`${email}@`, 'i')
      Object.assign(query, { email: regexEmail })
    }

    if (
      email &&
      validator.isEmail(email, { domain_specific_validation: true })
    ) {
      Object.assign(query, { email })
    }


    if (name && validator.isAlpha(name, 'es-ES')) {
      const regexName = new RegExp(name, 'i')
      Object.assign(query, {
        $or: [{ givenName: regexName }, { familyName: regexName }],
      })
    }

    const users = await this.find(query)

    if (!users) {
      throw new Error(`Couldn't find any users results with data: ${query}`)
    }

    return users
  }
}

export default assignUserStatics
