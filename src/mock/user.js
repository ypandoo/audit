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
      roleId: 1,
      roleName: 'auditor',
      displayName: '审核员'
    }
  ]
}

export default {
  GetRoleList: config => {
    return roleList
  },

  Register: data =>{
    return {  error_code: 0,data:[] }
  },
  // getUserInfo: config => {
  //   const { token } = param2Obj(config.url)
  //   if (userMap[token]) {
  //     return userMap[token]
  //   } else {
  //     return false
  //   }
  // },
  logout: () => 'success'
}
