import request from '@/utils/request'

export function GetScreeningList(query) {
  return request({
    url: '/screening/GetScreeningList',
    method: 'post',
    params: query
  })
}


export function GetScreeningItem(query) {
  return request({
    url: '/screening/GetScreeningItem',
    method: 'post',
    params: query
  })
}


export function postScreeningResult(query) {
  return request({
    url: '/screening/postScreeningResult',
    method: 'post',
    params: query
  })
}



export function ScreeningSummary(query) {
  return request({
    url: '/screening/ScreeningSummary',
    method: 'post',
    params: query
  })
}

export function GetBankList(query) {
  return request({
    url: '/screening/GetBankList',
    method: 'post',
    params: query
  })
}



