interface adminDataQuery {
  id?: string
  adminId?: string
  isSub?: boolean
  email?: string
  name?: string
  roles?: {
    userManage?: boolean
    adminManage?: boolean
    postManage?: boolean
    categoryManage?: boolean
    storeManage?: boolean
  }
  subordinateOf?: string
}

interface categoriesDataQuery {
  id?: string
  title?: string
  isced?: string
  isSub?: boolean
  branchOf?: string
}

interface commentDataQuery {
  author?: string
  post?: string
  text?: string
  superComment?: string
  isHidden?: boolean
}

interface entriesDataQuery {
  from?: string
  to?: string
  text?: string
  recentDays?: number
  isLiked?: boolean
}

interface postDataQuery {
  id?: string
  title?: string
  type?: string
  sinceUpload?: string
  beforeUpload?: string
  sinceRelease?: string
  beforeRelease?: string
  coords?: {
    latitude: Number
    longitude: Number
    maxRadius?: Number
  }
}

interface usersDataQuery {
  id?: string
  userId?: string
  email?: string
  name?: string
  isAdmin?: boolean
}

export {
  adminDataQuery,
  categoriesDataQuery,
  commentDataQuery,
  entriesDataQuery,
  postDataQuery,
  usersDataQuery,
}
