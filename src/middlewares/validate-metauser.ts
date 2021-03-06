import { NextFunction, Request, Response } from 'express'
import {
  Admin,
  Authorship,
  Chat,
  Comment,
  StoreOrder,
  User,
  UserPodcast,
} from '../models'

const isMetaUserAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { metaUser, isAdmin } = <any>req

  if (!metaUser) {
    return res.status(500).json({
      error: true,
      reason: 'You first must login and get token to perform this action.',
    })
  }

  if (!isAdmin) {
    return res.status(401).json({
      error: true,
      reason: `${metaUser?.fullName}, you aren't an admin, you can't do this.`,
    })
  }

  next()
}

const isMetaUserNotAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { metaUser, isAdmin } = <any>req

  if (!metaUser) {
    return res.status(500).json({
      error: true,
      reason: 'You first must login and get token to perform this action.',
    })
  }

  if (isAdmin) {
    return res.status(401).json({
      error: true,
      reason: `${metaUser?.fullName}, you are an admin, you can't do this.`,
    })
  }

  next()
}

const isSameMetaUserModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { receiver, transmitter, from, to } = req.body

  const [user1, user2, admin1, admin2] = await Promise.all([
    User.findById(receiver ?? to),
    User.findById(transmitter ?? from),
    Admin.findById(receiver ?? to),
    Admin.findById(transmitter ?? from),
  ])

  if ((user1 && admin2) || (admin1 && user2)) {
    return res.status(401).json({
      error: true,
      reason: `Both users don't have the same model (user or admin)`,
    })
  }

  next()
}

const hasRoles = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      params: { id },
    } = <any>req

    if (!isAdmin && metaUser._id != id) {
      return res.status(401).json({
        error: true,
        reason: 'You must be an Admin to perform this action',
      })
    }

    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        isAdmin &&
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        id != metaUser.id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

const hasPostRoles = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      params: { id },
    } = <any>req

    const authorships = await Authorship.getAuthorships({ post: id })
    const authorsArray = authorships.map(
      (authorship: { author: { toString: () => any } }) =>
        authorship.author.toString()
    )

    if (!isAdmin && !authorsArray.includes(metaUser._id.toString())) {
      return res.status(401).json({
        error: true,
        reason:
          'You must be an Admin or an author of this post to perform this action',
      })
    }

    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        id != metaUser.id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

const hasPodcastRules = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      params: { id },
    } = <any>req

    const podcastOwners = await UserPodcast.getUsersPodcasts({ podcast: id })
    const ownersArray = podcastOwners.map(
      (userPodcast: { owner: { toString: () => any } }) =>
        userPodcast.owner.toString()
    )

    if (!isAdmin && !ownersArray.includes(metaUser._id.toString())) {
      return res.status(401).json({
        error: true,
        reason:
          'You must be an Admin or an owner of this podcast to perform this action',
      })
    }
    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        isAdmin &&
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        id != metaUser.id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

const hasStoreOrderRoles = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      params: { id },
    } = <any>req

    const { purchaser } = await StoreOrder.getStoreOrder({ id })

    if (!isAdmin && purchaser.toString() != metaUser._id) {
      return res.status(401).json({
        error: true,
        reason: 'You must be an Admin to perform this action',
      })
    }
    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        isAdmin &&
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        id != metaUser.id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

const hasCommentRoles = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      params: { id },
    } = <any>req

    const comment = await Comment.findById(id)

    if (!isAdmin && comment?.author.toString() != metaUser._id) {
      return res.status(401).json({
        error: true,
        reason:
          'You must be an Admin or the author of this comment to perform this action',
      })
    }
    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        isAdmin &&
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        id != metaUser.id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

const hasChatRoles = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      query: { to, from },
    } = <any>req

    if (!isAdmin && to != metaUser._id && from != metaUser._id) {
      return res.status(401).json({
        error: true,
        reason:
          'You must be an Admin or the author of this chat entry to perform this action',
      })
    }
    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        isAdmin &&
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        to != metaUser._id &&
        from != metaUser._id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

const hasChatEntryRoles = ({
  userManage = false,
  adminManage = false,
  postManage = false,
  categoryManage = false,
  storeManage = false,
  podcastManage = false,
  storeOrdersManage = false,
  iscedManage = false,
  postTypeManage = false,
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      metaUser,
      isAdmin,
      params: { id },
    } = <any>req

    const chatEntry = await Chat.findById(id)

    if (!isAdmin && chatEntry?.transmitter.toString() != metaUser._id) {
      return res.status(401).json({
        error: true,
        reason:
          'You must be an Admin or the author of this chat entry to perform this action',
      })
    }
    if (isAdmin) {
      const roles = {
        userManage,
        adminManage,
        postManage,
        categoryManage,
        storeManage,
        podcastManage,
        storeOrdersManage,
        iscedManage,
        postTypeManage,
      }

      const requiredRoles = Object.keys(roles).filter(
        role => (roles as any)[role]
      )
      const metaUserRoles = Object.keys(metaUser.roles).filter(
        role => metaUser.roles[role]
      )

      if (
        isAdmin &&
        !(<any>metaUserRoles).includes(...requiredRoles) &&
        id != metaUser.id
      ) {
        return res.status(401).json({
          error: true,
          reason: `You don't have enough roles to perform this action. Required: ${Object.keys(
            roles
          ).filter(key => (roles as any)[key])}, yours: ${Object.keys(
            roles
          ).filter(key => metaUser.roles[key])}`,
        })
      }
    }

    next()
  }
}

export {
  hasRoles,
  isMetaUserAdmin,
  isMetaUserNotAdmin,
  hasPostRoles,
  hasPodcastRules,
  hasStoreOrderRoles,
  hasCommentRoles,
  isSameMetaUserModel,
  hasChatEntryRoles,
  hasChatRoles
}
