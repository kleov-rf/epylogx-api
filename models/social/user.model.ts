import { MetaUser, metaUserInterface } from '../metaUser.model'
import Stats from './stats.model'

interface userInterface extends metaUserInterface {
  userId: string
  social?: {
    networks: Array<{ icon: string; text: string }>
    location: string
    // followers: User[] - N:M
    // following: User[] - N:M
    // toNotify: User[] - N:M
  }
  store?: {
    cart: string[] /* StoreItem[] */
    wishlist: string[] /* StoreItem[] */
    // history: storeOrder[] N:M
  }
  postsPreferences?: {
    recentRead: string[] /* Post[] */ /* Máx 5 Posts */
    mobileDataLoad: boolean
    // interests: Category[] - N:M
    // saved?: Post[] - N:M
    // liked?: Post[] - N:M
  }
  customization?: {
    themeColor: string
    bgPictureURL: string
    pictureColor: string
  }
  // posts: Post[] - N:M
  // podcasts: Podcast [] - N:M
  stats?: Stats
}

class User extends MetaUser implements userInterface {
  userId: string
  social = {
    networks: [],
    location: '',
  }
  postsPreferences: {
    recentRead: []
    mobileDataLoad: false
  }
  customization: {
    themeColor: ''
    bgPictureURL: ''
    pictureColor: ''
  }
  stats: Stats = new Stats()

  constructor(data: userInterface) {
    super(data)
    this.userId = data.userId
  }

  setRecentRead(postId: string) {
    this.postsPreferences.recentRead
  }
}

export default User
