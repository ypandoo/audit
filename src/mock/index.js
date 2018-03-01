import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import userAPI from './user'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import screeningAPI from './screening'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

Mock.mock(/\/auth\/Login/, 'post', loginAPI.Login)
Mock.mock(/\/auth\/CurrentUser/, 'post', loginAPI.CurrentUser)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

//user
Mock.mock(/\/user\/GetRoleList/, 'post', userAPI.GetRoleList)
Mock.mock(/\/user\/Register/, 'post', userAPI.Register)
Mock.mock(/\/user\/GetUserList/, 'post', userAPI.GetUserList)
Mock.mock(/\/user\/ResetPassword/, 'post', userAPI.ResetPassword)
Mock.mock(/\/user\/UpdateUserState/, 'post', userAPI.UpdateUserState)

//screening
Mock.mock(/\/screening\/GetScreeningList/, 'post', screeningAPI.GetScreeningList)
Mock.mock(/\/screening\/GetScreeningItem/, 'post', screeningAPI.GetScreeningItem)
Mock.mock(/\/screening\/postScreeningResult/, 'post', screeningAPI.postScreeningResult)
Mock.mock(/\/screening\/ScreeningSummary/, 'post', screeningAPI.ScreeningSummary)



export default Mock
