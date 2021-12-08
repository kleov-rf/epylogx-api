import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import validator from 'validator'
import {
  Authorship,
  Chat,
  Follow,
  StoreOrder,
  User,
  UserLikedPost,
  UserPodcast,
  UserSavedPost,
} from '../models'
import { UserInterest } from '../models/social'

const userGet = async (req: Request, res: Response) => {
  const { id } = req.params
  let user
  try {
    if (validator.isMongoId(id)) {
      user = await User.getUser({ id: id })
    } else {
      user = await User.getUser({ userId: id })
    }
  } catch (error) {
    res.status(400).json({
      msg: `Couldn't find any user with id: ${id}`,
    })
  }

  return res.json(user)
}

const usersGet = async (req: Request, res: Response) => {
  const { userId, email, name, isActive } = req.query

  const query = {}

  if (userId) {
    Object.assign(query, { userId })
  }
  if (email) {
    Object.assign(query, { email })
  }
  if (name) {
    Object.assign(query, { name })
  }
  if (isActive != undefined) {
    Object.assign(query, { isActive: !!isActive })
  }

  const users = await User.getUsers(query)

  return res.json(users)
}

const getUserInterests = async (req: Request, res: Response) => {
  const { id } = req.params
  const userInterests = await UserInterest.getUserInterests({ interested: id })
  return res.json(userInterests)
}

const createUserInterest = async (req: Request, res: Response) => {
  const { id } = req.params
  const { category } = req.body
  const newUserInterest = new UserInterest({ category, interested: id })
  await newUserInterest.save()
  return res.json(newUserInterest)
}

const getUserPosts = async (req: Request, res: Response) => {
  const { id } = req.params
  const userPosts = await Authorship.getAuthorships({ author: id })
  return res.json(userPosts)
}

const getUserLikedPosts = async (req: Request, res: Response) => {
  const { id } = req.params
  const userLikedPosts = await UserLikedPost.getUserLikedPosts({ user: id })
  return res.json(userLikedPosts)
}

const createUserLikedPost = async (req: Request, res: Response) => {
  const { id } = req.params
  const { post } = req.body
  const newUserLikedPost = new UserLikedPost({ post, user: id })
  await newUserLikedPost.save()
  return res.json(newUserLikedPost)
}

const getUserSavedPosts = async (req: Request, res: Response) => {
  const { id } = req.params
  const userSavedPosts = await UserSavedPost.getUsersSavedPosts({ user: id })
  return res.json(userSavedPosts)
}

const createUserSavedPost = async (req: Request, res: Response) => {
  const { id } = req.params
  const { post } = req.body
  const newUserSavedPost = new UserSavedPost({ post, user: id })
  await newUserSavedPost.save()
  return res.json(newUserSavedPost)
}

const getUserPodcasts = async (req: Request, res: Response) => {
  const { id } = req.params
  const userPodcasts = await UserPodcast.getUsersPodcasts({ owner: id })
  return res.json(userPodcasts)
}

const getUserRecentChats = async (req: Request, res: Response) => {
  const { id } = req.params
  const { days = 3 } = req.query
  const userRecentChats = await Chat.getRecentChatsToId(id, Number(days))

  const recentChattedUsers = await Promise.all(
    userRecentChats.map((id: any) => User.findById(id))
  )

  return res.json(recentChattedUsers)
}

const getUserFollowers = async (req: Request, res: Response) => {
  const { id } = req.params
  const userFollowers = await Follow.getFollows({ followed: id })
  return res.json(userFollowers)
}

const getUserFollowings = async (req: Request, res: Response) => {
  const { id } = req.params
  const userFollowings = await Follow.getFollows({ follower: id })
  return res.json(userFollowings)
}

const createUserFollowing = async (req: Request, res: Response) => {
  const { id } = req.params
  const { followed } = req.body
  const newUserFollowing = new Follow({ followed, follower: id })
  await newUserFollowing.save()
  return res.json(newUserFollowing)
}

const notifyUserFollowing = async (req: Request, res: Response) => {
  const { id } = req.params
  const { followed, notify } = req.body
  const userFollowing = await Follow.findOne({ follower: id, followed })
  const modifiedUserFollowing = await Follow.findByIdAndUpdate(
    (<any>userFollowing)._id,
    {
      notify: !!notify,
    }
  )
  return res.json(modifiedUserFollowing)
}

const getUserStoreOrders = async (req: Request, res: Response) => {
  const { id } = req.params
  const userStoreOrders = await StoreOrder.getStoreOrders({ purchaser: id })
  return res.json(userStoreOrders)
}

const usersPost = async (req: Request, res: Response) => {
  const { userId, givenName, familyName, email, password, birthDate } = req.body
  const user = new User({
    userId,
    givenName,
    familyName,
    email,
    password,
    birthDate,
  })

  // Encrypt password
  const salt = bcrypt.genSaltSync()
  user.password = bcrypt.hashSync(password, salt)

  // Save on BD
  await user.save()

  return res.json(user)
}

const usersPut = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    userPayload: { password, ...userPayload },
  } = req.body

  if (password) {
    // Encrypt password
    const salt = bcrypt.genSaltSync()
    userPayload.password = bcrypt.hashSync(password, salt)
  }

  const newUser = await User.findByIdAndUpdate(id, userPayload, { new: true })

  return res.json(newUser)
}

const usersDelete = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json({
    user,
  })
}

export {
  userGet,
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  getUserInterests,
  getUserPosts,
  getUserLikedPosts,
  getUserSavedPosts,
  getUserPodcasts,
  getUserRecentChats,
  getUserFollowers,
  getUserFollowings,
  getUserStoreOrders,
  createUserFollowing,
  createUserInterest,
  createUserLikedPost,
  createUserSavedPost,
  notifyUserFollowing,
}
