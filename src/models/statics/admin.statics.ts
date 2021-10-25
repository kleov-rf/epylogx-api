import { Schema } from 'mongoose'
import { DEFAULT_RESULTS_LIMIT } from '../../database/config'
import { isMongoId, isSafeString } from '../../helpers/input-validators'

const assignAdminStatics = (adminSchema: Schema) => {
  // Retrieve admin by ObjectId
  adminSchema.statics.getOneAdminByObjectId = async function (objectId) {
    // First we check if our parameter is a valid ObjectId
    const { isValid, reason } = isMongoId(objectId)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we execute our query by Id
    const admin = await this.findById(objectId)

    // Before returning our data we must check if we're returning any results
    if (!admin) {
      throw new Error(
        `Couldn't find any admin results with objectId ${objectId}`
      )
    }

    return admin
  }

  // Retreive an admin by its entire adminId
  adminSchema.statics.getOneAdminByAdminId = async function (adminId) {
    // First we test our String
    const { isValid, reason } = isSafeString(adminId)
    if (!isValid) {
      throw new Error(reason)
    }

    // And then we use our literal for our query
    const admin = await this.findOne({ adminId })

    // Before returning our data we must check if we're returning any user results
    if (!admin) {
      throw new Error(`Couldn't find any admin results with userId ${adminId}`)
    }

    return admin
  }

  // Retrieve admins list by adminId
  adminSchema.statics.geManytAdminsByAdminId = async function (adminId) {
    // First we test our String
    const { isValid, reason } = isSafeString(adminId)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we create our regex
    const adminIdRegex = new RegExp(`${adminId}`, 'i')

    // And then we use our previous regex for our query
    const admins = await this.find({
      adminId: adminIdRegex,
      isActive: true,
    }).limit(DEFAULT_RESULTS_LIMIT)

    // Before returning our data we must check if we're returning any user results
    if (admins.length == 0) {
      throw new Error(`Couldn't find any admin results with userId ${adminId}`)
    }

    return admins
  }

  // Retrieve subAdmins who have ceratin admin as superAdmin
  adminSchema.statics.getManySubAdminsByObjectId = async function (objectId) {
    // First we check if our parameter is a valid ObjectId
    const { isValid, reason } = isMongoId(objectId)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we consult those admins who have our parameter as superAdmin
    const subAdmins = await this.find({ superAdmin: objectId, isActive: true })

    // Before returning our data we must check if we're returning any results
    if (!subAdmins) {
      throw new Error(
        `Couldn't find any admin results with objectId ${objectId}`
      )
    }

    return subAdmins
  }

  adminSchema.statics.getReportsByAdmin = async function () {}
  adminSchema.statics.getManageRecordsByAdmin = async function () {}
}

export default assignAdminStatics
