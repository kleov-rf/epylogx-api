const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION ?? '')
    console.log('Connected to database')
  } catch (error) {
    console.log(error)
    throw new Error('Error on connecting to database')
  }
}

const DEFAULT_RESULTS_LIMIT = 5

export { dbConnection, DEFAULT_RESULTS_LIMIT }
