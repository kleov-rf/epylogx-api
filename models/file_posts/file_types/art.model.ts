import { Post, postInterface } from "../post.model";

interface artInterface extends postInterface {
  techInfo?: Object
}

class Art extends Post implements artInterface{
  constructor(data: artInterface) {
    super(data)
  }
  techInfo: Object = {}
}

export default Art