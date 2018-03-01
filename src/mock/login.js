import { param2Obj } from '@/utils'

const success = {
  error_code: 0 
}


const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    return success
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },

  Login: config =>{
    return success
  },

  CurrentUser: config =>{
    // const name  = param2Obj(config.body)
    if(config.body == 'yanglei'){
      return {
        error_code: 0,
        data:{
          roleName: 'admin',
          account: 'yanglei',
          username: '杨雷',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        }
      }
    }else{
      return {
        error_code: 0,
        data:{
          roleName: 'auditor',
          account: 'tianxin',
          username: '田鑫',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        }
      }
    }
  },

  logout: () => 'success'
}
