import { isValidObjectId, model, Schema } from 'mongoose'

interface userInterestsInterface {
  interested?: Schema.Types.ObjectId
  category?: Schema.Types.ObjectId
}

const UserInterestSchema = new Schema<userInterestsInterface>(
  {
    interested: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  }
)

UserInterestSchema.statics.getUserInterests = async function ({
  interested,
  category,
}: userInterestsInterface) {
  const query = {}
  if (interested && isValidObjectId(interested)) {
    Object.assign(query, { interested })
  }
  if (category && isValidObjectId(category)) {
    Object.assign(query, { category })
  }

  const userInterests = this.find(query)

  if (!userInterests) {
    throw new Error(
      `Couldn't find any userInterests results with data: ${query}`
    )
  }

  return userInterests
}

const UserInterest = model(
  'UserInterest',
  UserInterestSchema,
  'users_interest_categories'
)

export default UserInterest
