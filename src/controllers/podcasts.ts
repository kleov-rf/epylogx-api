import { Request, Response } from 'express'
import { Audio, Podcast, UserPodcast } from '../models'

const getPodcasts = async (req: Request, res: Response) => {
  const { title, podcastId } = req.query

  const query = {}

  if (podcastId) {
    Object.assign(query, { podcastId })
  }
  if (title) {
    Object.assign(query, { title })
  }

  const podcasts = await Podcast.getPodcasts(query)

  return res.json(podcasts)
}

const getPodcast = async (req: Request, res: Response) => {
  const { id } = req.params

  const podcast = await Podcast.getPodcast({ id })

  return res.json(podcast)
}

const getPodcastPosts = async (req: Request, res: Response) => {
  const { id } = req.params

  const podcastPosts = await Audio.find({ podcast: <any>id })

  return res.json(podcastPosts)
}

const getPodcastOwners = async (req: Request, res: Response) => {
  const { id } = req.params

  const owners = await UserPodcast.getUsersPodcasts({ podcast: id })

  return res.json(owners)
}

const createPodcast = async (req: Request, res: Response) => {
  const {
    owners,
    info: { title, description },
    podcastId,
  } = req.body

  const data = { info: { title, description }, podcastId }

  const newPodcast = new Podcast(data)

  await newPodcast.save()

  await Promise.all(
    owners.map(async (owner: any) => {
      const podcastOwner = new UserPodcast({ owner, podcast: newPodcast._id })
      await podcastOwner.save()
    })
  )

  return res.json(newPodcast)
}

const modifyPodcast = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    info: { title, description },
    podcastId,
    owners: receivedOwners,
  } = req.body

  const data = {}

  if (podcastId) {
    Object.assign(data, { podcastId })
  }
  if (title) {
    Object.assign(data, { 'info.title': title })
  }
  if (description) {
    Object.assign(data, { 'info.description': description })
  }

  const modifiedPodcast = await Podcast.findByIdAndUpdate(id, data, {
    new: true,
  })

  if (receivedOwners) {
    const dbOwners = await UserPodcast.getUsersPodcasts({ podcast: id })

    const oldOwners = dbOwners.map(
      (userPodcast: { owner: { toString: () => any } }) =>
        userPodcast.owner.toString()
    )

    const ownersToPreserve: any[] = [],
      newOwners: any[] = []

    receivedOwners.forEach((owner: any) => {
      if (oldOwners.includes(owner)) {
        ownersToPreserve.push(owner)
        oldOwners.splice(oldOwners.indexOf(owner), 1)
      } else {
        newOwners.push(owner)
      }
    })

    console.log(oldOwners)

    await oldOwners.forEach(async (owner: any) => {
      await UserPodcast.deleteOne({ podcast: id, owner })
    })

    await newOwners.forEach(async owner => {
      await new UserPodcast({ owner, podcast: id }).save()
    })
  }

  return res.json(modifiedPodcast)
}

const deletePodcast = async (req: Request, res: Response) => {
  const { id } = req.params

  const deletedPodcast = await Podcast.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json(deletedPodcast)
}

export {
  getPodcasts,
  getPodcast,
  getPodcastPosts,
  createPodcast,
  modifyPodcast,
  deletePodcast,
  getPodcastOwners,
}
