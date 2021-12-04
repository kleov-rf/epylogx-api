import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { UserInterestModel, userInterestsInterface } from './interfaces'

const UserInterestSchema = new Schema<userInterestsInterface>(
  {
    interested: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category'
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserInterestSchema.statics.getUserInterests = async function ({
  interested,
  category,
}: userInterestsInterface) {
  const query = {}
  if (interested && validator.isMongoId(interested)) {
    Object.assign(query, { interested })
  }
  if (category && validator.isMongoId(category)) {
    Object.assign(query, { category })
  }

  const userInterests = await this.find(query)

  if (!userInterests) {
    throw new Error(
      `Couldn't find any userInterests results with data: ${query}`
    )
  }

  return userInterests
}

const UserInterest = model<userInterestsInterface, UserInterestModel>(
  'UserInterest',
  UserInterestSchema,
  'users_interest_categories'
)

export default UserInterest
