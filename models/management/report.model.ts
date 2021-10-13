
interface reportInterface {
  mainCause: string
  description: string
  author: string /* User */
  post: string /* Post */
  isResolved?: boolean
}

class Report implements reportInterface {
  constructor(data: reportInterface) {
    this.mainCause = data.mainCause
    this.description = data.description
    this.author = data.author
    this.post = data.post
  }
  mainCause: string
  description: string
  author: string
  post: string
  isResolved: boolean = false
}

export default Report
