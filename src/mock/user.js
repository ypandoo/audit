import { param2Obj } from '@/utils'

const roleList = {
  error_code: 0,
  data:
  [
    {
      roleId: 1,
      roleName: 'admin',
      displayName: '管理员'
    },
    {
      roleId: 2,
      roleName: 'auditor',
      displayName: '审核员'
    }
  ]
}

const userList = {
  error_code: 0,
  data:
  [
    {
      account: 'yanglei',
      userName: '杨雷',
      roleDisplayName: '管理员',
      mobile: '18615707055',
      state: 'active',
      email: 'lei.yang@gi-de.com',
      createDate: '2018-01-01',
      updateDate: '2018-01-01'
    },
    {
      account: 'sunguang',
      userName: '孙光',
      roleDisplayName: '审核员',
      mobile: '18615707056',
      state: 'inactive',
      email: 'lei.yang@gi-de.com',
      createDate: '2018-01-01',
      updateDate: '2018-01-01'
    }
  ]
}

const userProfile ={
  error_code : 0,
  data:{
    account: 'sunguang',
    username: '孙光',
    roleDisplayName: '审核员',
    mobile: '18615707056',
    state: 'inactive',
    password: '123456',
    email: 'lei.yang@gi-de.com',
    createDate: '2018-01-01',
    updateDate: '2018-01-01',
    roleId: 1
  }
}

export default {
  GetRoleList: config => {
    return roleList
  },

  Register: data =>{
    return {  error_code: 0,data:[] }
  },

  GetUserList: data => {
    return userList
  },
  // getUserInfo: config => {
  //   const { token } = param2Obj(config.url)
  //   if (userMap[token]) {
  //     return userMap[token]
  //   } else {
  //     return false
  //   }
  // },

  ResetPassword: data =>{
    return {  error_code: 0,data:[] } 
  },

  UpdateUserState: data =>{
    return {  error_code: 0,data:[] } 
  },

  GetUserProfile: data => {
    return userProfile
  },

  ModifyUserInfo: data => {
    return {  error_code: 0,data:[] } 
  },

  logout: () => 'success'
}
