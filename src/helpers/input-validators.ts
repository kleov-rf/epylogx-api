import validator from 'validator'

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

export { isValidMongoLatLong }
