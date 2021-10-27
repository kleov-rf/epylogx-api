import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'

const assignAdminStatics = (adminSchema: Schema) => {
  interface adminDataQuery {
    id?: string
    isSub?: boolean
    email?: string
    name?: string
    roles?: {
      userManage?: boolean
      adminManage?: boolean
      postManage?: boolean
      categoryManage?: boolean
      storeManage?: boolean
    }
    subordinateOf?: string
  }

  adminSchema.statics.getAdmin = async function ({
    id,
    email,
    name,
    isSub,
    subordinateOf,
    roles,
  }: adminDataQuery) {
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
    if (isSub !== undefined) {
      Object.assign(query, { superAdmin: { $exists: isSub } })
    }
    if (subordinateOf && isValidObjectId(subordinateOf)) {
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
    if (areSubs !== undefined) {
      Object.assign(query, { superAdmin: { $exists: areSubs } })
    }
    if (subordinatesOf && isValidObjectId(subordinatesOf)) {
      Object.assign(query, { superAdmin: subordinatesOf })
    }
    if (roles) {
      Object.assign(query, { roles: roles })
    }

    const admins = await this.find(query)

    if (!admins) {
      throw new Error(`Couldn't find any admins results with data: ${query}`)
    }

    return admins
  }
}

export default assignAdminStatics
