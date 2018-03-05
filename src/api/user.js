import request from '@/utils/request'

export function GetRoleList(query) {
  return request({
    url: '/user/GetRoleList',
    method: 'post',
    data: query,
  })
}

export function Register(query) {
  return request({
    url: '/user/Register',
    method: 'post',
    data: query
  })
}

export function GetUserList(query) {
  return request({
    url: '/user/GetUserList',
    method: 'post',
    data: query
  })
}

export function ResetPassword(query) {
  return request({
    url: '/user/ResetPassword',
    method: 'post',
    data: query
  })
}

export function UpdateUserState(query) {
  return request({
    url: '/user/UpdateUserState',
    method: 'post',
    data: query
  })
}

export function ModifyUserInfo(query) {
  return request({
    url: '/user/ModifyUserInfo',
    method: 'post',
    data: query
  })
}

export function GetUserProfile(query) {
  return request({
    url: '/user/GetUserProfile',
    method: 'post',
    data: query
  })
}



