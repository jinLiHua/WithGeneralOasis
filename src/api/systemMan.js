import request from '@/utils/request'
import { getToken } from '@/utils/auth'
var token = getToken()

export function getUserList(params) {  //获取管理员列表
  return request({
    url: '/admin/user/page',
    method: 'get',
    // headers:{'Authorization': token},
    data:params
  })
}

export function dictTree(params) {  //获取数据字典
  return request({
    url: '/dict/getChild/'+params,
    method: 'post'
  })
}

export function dictTree1() {  //获取数据字典
  return request({
    url: '/dict/tree',
    method: 'get'
  })
}

export function dictAdd(params) {  //新增数据字典
  return request({
    url: '/dict/add',
    method: 'post',
    data:params
  })
}

export function dictdel(params) {  //删除数据字典
  return request({
    url: '/dict/delete/'+params,
    method: 'delete'
  })
}

export function getlog(params) {  //日志
  return request({
    url: '/log/page',
    method: 'post',
    data:params
  })
}

export function getRole(params) {  //获取角色
  return request({
    url: '/role/page',
    method: 'post',
    data:params
  })
}

export function addRole(params) {  //新增角色
  return request({
    url: '/role/save',
    method: 'post',
    headers:{'Authorization': token},
    data:params
  })
}

export function delRole(params) {  //删除角色
  return request({
    url: '/role/delete/'+params,
    method: 'delete'
  })
}

export function permissList(params) {  //角色权限查询
  return request({
    url: '/user/permission/list',
    method: 'post',
    params
  })
}

export function permissionSave(role, perssion) {  //角色权限查询
  return request({
    url: '/user/permission/save/'+role+'/'+perssion,
    method: 'post',
    headers:{'Authorization': token},
  })
}

export function getuser(role) {  //获取用户列表
  return request({
    url: '/user/page',
    method: 'post',
    data :role
  })
}

export function adduser(role) {  //新建用户
  return request({
    url: '/user/save',
    method: 'post',
    data :role
  })
}

export function deluser(role) {  //删除用户
  return request({
    url: '/user/delete/'+role,
    method: 'DELETE'
  })
}

export function  getuserDetail(role) {  //获取用户详情
  return request({
    url: '/user/'+role,
    method: 'get'
  })
}



