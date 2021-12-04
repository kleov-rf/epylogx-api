import { v2 as cloudinary } from 'cloudinary'
import { Request, Response } from 'express'
import { Admin, Category, Podcast, Post, StoreItem, User } from '../models'
cloudinary.config(<any>process.env.CLOUDINARY_URL)

const defaultPhotos = {
  podcast: 'defaultPodcast_vbwjee',
  storeItem: 'defaultStoreItem_vs07iy',
  category: 'defaultCategory_wn36xr',
  postPreview: 'defaultPost_yjpolu',
  admin: 'defaultAdmin_u4a3i2',
  userProfile: 'defaultUser_dofhfg',
}

const updateAdminPhoto = async (req: Request, res: Response) => {
  const { id } = req.params
  const { tempFilePath } = (<any>req.files).profile

  const admin = await Admin.getAdmin({ id })

  if (admin.pictureURL) {
    const nombreArray = admin.pictureURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  try {
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    admin.pictureURL = secure_url
    await admin.save()

    res.json(admin)
  } catch (error) {
    res.status(500).json({
      errors: true,
      reason: error,
    })
  }
}

const updateCategoryPhoto = async (req: Request, res: Response) => {
  const { id } = req.params
  const { tempFilePath } = (<any>req.files).profile

  const category = await Category.getCategory({ id })

  if (category.pictureURL) {
    const nombreArray = category.pictureURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  try {
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    category.pictureURL = secure_url
    await category.save()

    res.json(category)
  } catch (error) {
    res.status(500).json({
      errors: true,
      reason: error,
    })
  }
}

const updatePodcastPhoto = async (req: Request, res: Response) => {
  const { id } = req.params
  const { tempFilePath } = (<any>req.files).profile

  const podcast = await Podcast.getPodcast({ id })

  if (podcast.pictureURL) {
    const nombreArray = podcast.pictureURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  try {
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    podcast.pictureURL = secure_url
    await podcast.save()

    res.json(podcast)
  } catch (error) {
    res.status(500).json({
      errors: true,
      reason: error,
    })
  }
}

const updatePostFiles = async (req: Request, res: Response) => {
  const { id } = req.params
  const { file, preview } = <any>req.files

  const post = await Post.getPost({ id })

  if (file && post.fileURL) {
    const nombreArray = post.fileURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    // TODO: get file and preview from file if not sent
    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  if (preview && post.previewImgURL) {
    const nombreArray = post.previewImgURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  try {
    if (file) {
      const { secure_url } = await cloudinary.uploader.upload(file.tempFilePath)
      post.fileURL = secure_url
    }

    if (preview) {
      const { secure_url } = await cloudinary.uploader.upload(
        preview.tempFilePath
      )
      post.previewImgURL = secure_url
    }

    if (file && !preview) {
      const nombreArray = post.previewImgURL.split('/')
      const nombreExt = nombreArray[nombreArray.length - 1]
      const [public_id] = nombreExt.split('.')

      if (!Object.values(defaultPhotos).includes(public_id))
        cloudinary.uploader.destroy(public_id)

      const fileURLwithoutPage = post.fileURL.split('upload/')
      const fileURLPaged = fileURLwithoutPage.join('upload/pg_1/')
      const fileURLPagedWithoutExtension = fileURLPaged.split('.').slice(0, 3)
      const fileURLPagedPng = fileURLPagedWithoutExtension
        .concat('png')
        .join('.')

      post.previewImgURL = fileURLPagedPng
    }

    await post.save()

    res.json(post)
  } catch (error) {
    res.status(500).json({
      errors: true,
      reason: error,
    })
  }
}

const updateStoreItemPhoto = async (req: Request, res: Response) => {
  const { id } = req.params
  const { tempFilePath } = (<any>req.files).profile

  const storeItem = await StoreItem.getStoreItem({ id })

  if (storeItem.pictureURL) {
    const nombreArray = storeItem.pictureURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  try {
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    storeItem.pictureURL = secure_url
    await storeItem.save()

    res.json(storeItem)
  } catch (error) {
    res.status(500).json({
      errors: true,
      reason: error,
    })
  }
}

const updateUserPhotos = async (req: Request, res: Response) => {
  const { id } = req.params
  const { profile, background } = <any>req.files

  const user = await User.getUser({ id })

  if (profile && user.pictureURL) {
    const nombreArray = user.pictureURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  if (background && user.customization.bgPictureURL) {
    const nombreArray = user.customization.bgPictureURL.split('/')
    const nombreExt = nombreArray[nombreArray.length - 1]
    const [public_id] = nombreExt.split('.')

    if (!Object.values(defaultPhotos).includes(public_id))
      cloudinary.uploader.destroy(public_id)
  }

  try {
    if (profile) {
      const { secure_url } = await cloudinary.uploader.upload(
        profile.tempFilePath
      )
      user.pictureURL = secure_url
    }

    if (background) {
      const { secure_url } = await cloudinary.uploader.upload(
        background.tempFilePath
      )
      user.customization.bgPictureURL = secure_url
    }

    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).json({
      errors: true,
      reason: error,
    })
  }
}

export {
  updateAdminPhoto,
  updateCategoryPhoto,
  updatePodcastPhoto,
  updatePostFiles,
  updateStoreItemPhoto,
  updateUserPhotos,
}
