import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function Logout() {
  return request({
    url: '/auth/Logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function Login(username, password) {
  const data = {
    account: username,
    password: password
  }
  return request({
    url: '/auth/Login',
    method: 'post',
    data
  })
}

export function CurrentUser(data) {
  return request({
    url: '/user/CurrentUser',
    method: 'post',
    data
  })
}

