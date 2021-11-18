import { NextFunction, Request, Response } from 'express'
import { Authorship, UserPodcast, UserStoreOrder } from '../models'

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

    const authors = await Authorship.getAuthorships({ post: id })

    if (!isAdmin && !authors.includes(metaUser._id)) {
      return res.status(401).json({
        error: true,
        reason: 'You must be an Admin to perform this action',
      })
    }

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

    if (!isAdmin && !podcastOwners.includes(metaUser._id)) {
      return res.status(401).json({
        error: true,
        reason: 'You must be an Admin to perform this action',
      })
    }

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

    const purchaser = await UserStoreOrder.getUserStoreOrders({ order: id })

    if (!isAdmin && !purchaser.includes(metaUser._id)) {
      return res.status(401).json({
        error: true,
        reason: 'You must be an Admin to perform this action',
      })
    }

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

    next()
  }
}

export {
  hasRoles,
  isMetaUserAdmin,
  hasPostRoles,
  hasPodcastRules,
  hasStoreOrderRoles,
}
