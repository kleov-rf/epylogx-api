
interface commentInterface {
  author: string/* User.id */
  text: string
  likes?: number
  replies?: string[] /* Comment[] */
  superComment?: string /* Comment */
  isHidden?: boolean
}

class Comment implements commentInterface {
  author: string;
  text: string;
  likes: number = 0
  replies: string[] = []
  superComment: string
  isHidden: boolean = false
  constructor(data:commentInterface) {
    this.author = data.author
    this.text = data.text
  }
}

export default Comment