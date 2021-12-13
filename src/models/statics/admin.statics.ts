import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'
import { adminDataQuery } from './interfaces'

const assignAdminStatics = (adminSchema: Schema) => {
  adminSchema.statics.getAdmin = async function ({
    id,
    adminId,
    email,
    name,
    isSub,
    subordinateOf,
    roles,
  }: adminDataQuery) {
    const query = {}

    if (id && validator.isMongoId(id)) {
      Object.assign(query, { _id: id })
    }
    if (
      adminId &&
      validator.isAlphanumeric(adminId, undefined, { ignore: '_-.' })
    ) {
      Object.assign(query, { adminId })
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
    if (isSub !== undefined) {
      Object.assign(query, { superAdmin: { $exists: isSub } })
    }
    if (subordinateOf && validator.isMongoId(subordinateOf)) {
      Object.assign(query, { superAdmin: subordinateOf })
    }
    if (roles) {
      Object.assign(query, { roles: roles })
    }

    const admin = await this.findOne(query)

    if (!admin) {
      throw new Error(`Couldn't find any admin results with data: ${query}`)
    }

    return admin
  }

  adminSchema.statics.getAdmins = async function ({
    id,
    email,
    name,
    isSub: areSubs,
    subordinateOf: subordinatesOf,
    roles,
  }: adminDataQuery) {
    const query = {}

    if (id && !validator.isMongoId(id) && validator.isAlphanumeric(id)) {
      const regexId = new RegExp(id, 'i')
      Object.assign(query, { adminId: regexId })
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
    if (name && validator.isAlpha(name, 'es-ES', { ignore: ' ' })) {
      const regexName = new RegExp(name,     'i')
      Object.assign(query, { fullName: regexName })
    }
    if (areSubs !== undefined) {
      Object.assign(query, { superAdmin: { $exists: areSubs } })
    }
    if (subordinatesOf && validator.isMongoId(subordinatesOf)) {
      Object.assign(query, { superAdmin: subordinatesOf })
    }
    if (roles) {
      Object.assign(query, { ...roles })
    }

    const admins = await this.find(query)

    if (!admins) {
      throw new Error(`Couldn't find any admins results with data: ${query}`)
    }

    return admins
  }
}

export default assignAdminStatics
