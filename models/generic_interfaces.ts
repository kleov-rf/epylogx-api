interface Descriptable {
  info: {
    title: string
    description: string
  }
  pictureURL?: string
  isActive?: boolean
}

interface Audiovisual {
  file_length: number
  timestamps?: Array<{ time: number; title: string }>
  quality: string
}

export { Descriptable, Audiovisual }
