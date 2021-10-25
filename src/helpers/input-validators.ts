import validator from 'validator'

const isSafeString = (input: string): { isValid: boolean; reason?: string } => {
  if (!validator.isLength(input, { min: 3, max: 50 })) {
    return {
      isValid: false,
      reason: `Input size (${input.length}) must be between 3 and 50`,
    }
  }

  if (!validator.isAlphanumeric(input, 'es-ES')) {
    return {
      isValid: false,
      reason: `Input (${input}) is not a safe query for our database`,
    }
  }

  return { isValid: true }
}

const isValidEmail = (input: string): { isValid: boolean; reason?: string } => {
  if (!validator.isEmail(input)) {
    return {
      isValid: false,
      reason: `Input (${input}) is not a valid email`,
    }
  }

  return { isValid: true }
}

const isMongoId = (input: string): { isValid: boolean; reason?: string } => {
  if (!validator.isMongoId(input)) {
    return {
      isValid: false,
      reason: `Input (${input}) is not a valid MongoDB ObjectId`,
    }
  }

  return { isValid: true }
}

const isValidMongoLatLong = (
  longitude: Number,
  latitude: Number
): { isValid: boolean; reason?: string } => {
  if (longitude < -180 || longitude > 180) {
    return {
      isValid: false,
      reason: `Longitude ${longitude} is not between -180 and 180 as MongoDB requires`,
    }
  }

  if (latitude < -90 || latitude > 90) {
    return {
      isValid: false,
      reason: `Latitude ${latitude} is not between -90 and 90 as MongoDB requires`,
    }
  }

  return { isValid: true }
}

export { isSafeString, isValidEmail, isMongoId, isValidMongoLatLong }
