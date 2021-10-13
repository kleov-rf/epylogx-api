import { MetaUser, metaUserInterface } from '../metaUser.model'

interface adminInterface extends metaUserInterface {
  adminId: string
  roles: {
    userManage?: boolean
    adminManage?: boolean
    postManage?: boolean
    categoryManage?: boolean
    storeManage?: boolean
  }
  superAdmin: string
}

class Admin extends MetaUser implements adminInterface {
  constructor(data: adminInterface) {
    super(data)
    this.adminId = data.adminId
    this.roles = data.roles
    this.superAdmin = data.superAdmin ?? this.adminId
  }
  adminId: string
  roles = {}
  superAdmin: string
}

export default Admin
