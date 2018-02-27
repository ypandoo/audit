import request from '@/utils/request'

export function GetRoleList(query) {
  return request({
    url: '/user/GetRoleList',
    method: 'post',
    params: query
  })
}

export function Register(query) {
  return request({
    url: '/user/Register',
    method: 'post',
    params: query
  })
}

