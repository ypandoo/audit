import request from '@/utils/request'

export function GetScreeningList(query) {
  return request({
    url: '/screening/GetScreeningList',
    method: 'post',
    data: query
  })
}


export function GetScreeningItem(query) {
  return request({
    url: '/screening/GetScreeningItem',
    method: 'post',
    data: query
  })
}


export function PostScreeningResult(query) {
  return request({
    url: '/screening/PostScreeningResult',
    method: 'post',
    data: query
  })
}



export function ScreeningSummary(query) {
  return request({
    url: '/screening/ScreeningSummary',
    method: 'post',
    data: query
  })
}

export function GetBankList(query) {
  return request({
    url: '/screening/GetBankList',
    method: 'post',
    data: query
  })
}



