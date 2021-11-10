interface DescriptableInterface {
  info: {
    title: string
    description: string
  }
  pictureURL?: string
  isActive?: boolean
}

interface metaUserInterface extends DescriptableInterface {
  givenName: string
  familyName: string
  email: string
  password: string
  birthDate: Date
  googleSignIn: boolean
}

interface AudiovisualInterface {
  file_length: number
  timestamps?: Array<{ time: number; title: string }>
  quality: string
}

export { DescriptableInterface, metaUserInterface, AudiovisualInterface }
