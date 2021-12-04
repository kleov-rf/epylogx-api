import { Schema } from 'mongoose'

const assignPostVirtuals = (PostSchema: Schema) => {
  // -------- AUTHORSHIP --------
  // _id | author | post
  PostSchema.virtual('authors', {
    ref: 'Authorship',
    localField: '_id',
    foreignField: 'post',
  })

  // -------- POST CATEGORIES --------
  // _id | post | category
  PostSchema.virtual('categories', {
    ref: 'PostCategory',
    localField: '_id',
    foreignField: 'post',
  })

  // PostSchema.virtual('categories.subs', {
  //   ref: 'PostCategory',
  //   localField: '_id',
  //   foreignField: 'post',
  //   match: { 'superCategory': { $exists: true } },
  // })

  // -------- COMMENTS --------
  // _id | author | post | text | likes | replies | superComment | isHidden
  PostSchema.virtual('social.comments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'post',
    match: { superComment: { $exists: false } },
  })
}

export default assignPostVirtuals
