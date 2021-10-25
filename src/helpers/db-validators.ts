import User from '../models/user'

const isActiveDocument = () => {}

const metauserExistsByEmail = () => {}

const userExistsById = async (_id: string) => {
  const userExists = await User.findById(_id)
  if (!userExists) {
    throw new Error(`User Objectid (${_id}) doesn't exist in out database.`)
  }
}
const userExistsByUserId = async (userId: string) => {
  const userExists = await User.findOne({ userId, isActive: true })
  if (!userExists) {
    throw new Error(`userId (${userId}) doesn't exist in out database.`)
  }
}

const adminExistsById = () => {}
const adminExistsByAminId = () => {}

const categoryExistsById = () => {}
const categoryExistsByName = () => {}

const postExistsById = () => {}
const isValidPostType = () => {}
const isValidISCED = () => {}

export { userExistsById }
