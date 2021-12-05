import {
  Admin,
  Category,
  Comment,
  Isced,
  Podcast,
  Post,
  PostType,
  StoreItem,
  User,
} from '../models'

const existsUserByObjectId = async (_id: string) => {
  const user = await User.findById(_id)
  if (!user) {
    throw new Error(`${_id} is not in our user database`)
  }
}

const existsAdminByObjectId = async (_id: string) => {
  const admin = await Admin.findById(_id)
  if (!admin) {
    throw new Error(`${_id} is not in our admin database`)
  }
}

const existsMetaUserId = async (metaUserId: string) => {
  const [user, admin] = await Promise.all([
    User.findOne({ userId: metaUserId }),
    Admin.findOne({ adminId: metaUserId }),
  ])

  if (user || admin) {
    throw new Error(`User with ${metaUserId} already exists. Try another one.`)
  }
}

const existsEmail = async (email: string) => {
  const [user, admin] = await Promise.all([
    User.findOne({ email }),
    Admin.findOne({ email }),
  ])

  if (user || admin) {
    throw new Error(
      `User with email ${email} already exists. Try loggin into your account`
    )
  }
}

const existsCategoryByTitle = async (title: string) => {
  const category = await Category.findOne({ 'info.title': title })
  if (category) {
    throw new Error(
      `Category with title ${title} already exists. Try another name.`
    )
  }
}

const existsCategoryByObjectId = async (id: string) => {
  const category = await Category.findOne({ _id: id })
  if (!category) {
    throw new Error(`Category with id ${id} does not exist.`)
  }
}

const existsISCEDByLevel = async (level: number) => {
  const isced = await Isced.findOne({ level })
  if (!isced) {
    throw new Error(`ISCED leveled by ${level} does not exist`)
  }
}

const existsISCEDByObjectId = async (id: string) => {
  const isced = await Isced.findById(id)
  if (!isced) {
    throw new Error(`ISCED level with id ${id} wasn't found`)
  }
}

const existsPodcastById = async (id: string) => {
  const podcast = await Podcast.getPodcast({ id })
  if (!podcast) {
    throw new Error(`Podcast with id ${id} wasn't found`)
  }
}
const existsPostByObjectId = async (id: string) => {
  const post = await Post.findById(id)
  if (!post) {
    throw new Error(`Post with id ${id} wasn't found`)
  }
}
const existsStoreItemByObjectId = async (id: string) => {
  const storeItem = await StoreItem.findById(id)
  if (!storeItem) {
    throw new Error(`StoreItem with id ${id} wasn't found`)
  }
}

const existsPostTypeByObjectId = async (id: string) => {
  const postType = await PostType.findById(id)
  if (!postType) {
    throw new Error(`PostType with id ${id} wasn't found`)
  }
}

const existsPostTypeByName = async (name: string) => {
  const postType = await PostType.findOne({ name })
  if (postType) {
    throw new Error(
      `PostType with name ${name} already exists, try another name`
    )
  }
}

const existsCommentByObjectId = async (id: string) => {
  const comment = await Comment.findById(id)

  if (!comment) {
    throw new Error(`Comment with id ${id} wasn't found`)
  }
}

export {
  existsUserByObjectId,
  existsAdminByObjectId,
  existsMetaUserId,
  existsEmail,
  existsCategoryByTitle,
  existsCategoryByObjectId,
  existsISCEDByLevel,
  existsISCEDByObjectId,
  existsPodcastById,
  existsPostByObjectId,
  existsStoreItemByObjectId,
  existsPostTypeByObjectId,
  existsPostTypeByName,
  existsCommentByObjectId,
}
