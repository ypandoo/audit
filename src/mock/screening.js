import { param2Obj } from '@/utils'

const screenList = {
  error_code: 0,
  data:
  [
    {
      imageId: '93eeakjdfjal-ea032898',
      imageState: 'OPENED',
      screeningUserName2: '田鑫',
      screeningUserName1: '杨雷',
      uploadDate: 1519720007,
      screeningDate: 1519720007,
      customerName: '深圳市工行',
      imageData: 'http://img1.3lian.com/img013/v4/96/d/41.jpg'
     },
    {
      imageId: '93eeakjdfjal-ea0111898',
      imageState: 'ACCEPTED',
      screeningUserName2: '田鑫',
      screeningUserName1: '杨雷',
      uploadDate: 1519720007,
      screeningDate: 1519720007,
      customerName: '四川工行',
      imageData: 'http://img1.3lian.com/img013/v4/96/d/41.jpg'
    }
  ]
}

const screeningItem = {
  error_code: 0,
  data:
    {
      imageId: '93eeakjdfjal-ea032898',
      imageState: 'OPENED',
      screeningRecord:[
        {
          userName: '杨雷',
          screeningDate: 1519720007,
          screeningDesc: '审核未通过-因为暴力',
          screeningResult: 'REJECTED'
        },
        {
          userName: '杨雷',
          screeningDate: 1519720007,
          screeningDesc: '审核未通过-因为暴力',
          screeningResult: 'REJECTED'
        },
      ],

      uploadDate: 1519720007,
      screeningDate: 1519720007,
      text: '文字贴纸',
      customerName: '深圳市工行',
      imageData: 'http://img1.3lian.com/img013/v4/96/d/41.jpg'
     }
}

const screeningSummary = {
  error_code: 0,
  data:
  [
    {
      acceptedCount: 15,
      rejectedCount: 20,
      averageScreeningPeriod: 15.5,
      userName : '田鑫'
     },
    {
      acceptedCount: 25,
      rejectedCount: 20,
      averageScreeningPeriod: 35.5,
      userName : '杨雷'
    }
  ]
}


export default {

  GetScreeningList: data => {
    return screenList
  },

  GetScreeningItem: data => {
    return screeningItem
  },

  postScreeningResult: data =>{
    return {
      error_code: 0,
      data:
      []
    }
  },
  ScreeningSummary: data => {
    return screeningSummary
  },
}
