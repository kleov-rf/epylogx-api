import { Post, postInterface } from '../post.model'

interface pdfInterface extends postInterface {
  pages: number
}

class PdfFile extends Post implements pdfInterface {
  pages: number
  constructor(data: pdfInterface) {
    super(data)
    this.pages = data.pages
  }
}

export default PdfFile
