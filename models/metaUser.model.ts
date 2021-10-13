import { Descriptable } from './generic_interfaces'

interface metaUserInterface extends Descriptable {
  givenName: string
  familyName: string
  email: string
  password: string
  birthDate: Date
  isOnline?: boolean
}

const DEFAULT_USER_PROFILE_PIC = ''

class MetaUser implements metaUserInterface {
  givenName: string
  familyName: string
  email: string
  password: string
  birthDate: Date
  pictureURL: string
  isOnline: boolean = false
  info: { title: string; description: string } = { title: '', description: '' }
  isActive: boolean = true

  constructor(data: metaUserInterface) {
    this.givenName = data.givenName
    this.familyName = data.familyName
    this.email = data.email
    this.password = data.password
    this.birthDate = data.birthDate
    this.pictureURL = data.pictureURL ?? DEFAULT_USER_PROFILE_PIC
  }

  getFullname(): string {
    return `${this.givenName} ${this.familyName}`
  }
}

export { MetaUser, metaUserInterface }
