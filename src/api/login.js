import request from '@/utils/request'
var md5 = require('js-md5')

export function login(username, password) {
  password = md5(password)
  return request({
    url: '/index/login/back/132',
    method: 'post',
    data: {
      "username": username,
      "password": password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/index/userInfo',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function permissionMenu() { //菜单列表
  return request({
    url: '/getUserMenu',
    method: 'POST'
    // headers:{'Authorization': token},
    // data:params
  })
}

export function resetPwd(params) { //重置密码
  return request({
    url: '/updatePwd',
    method: 'POST',
    params
  })
}

export function companiesList(params) { //获取企业切换列表
  return request({
    url: '/org/getOrgTreeByLevel',
    method: 'get',
    params
  })
}
