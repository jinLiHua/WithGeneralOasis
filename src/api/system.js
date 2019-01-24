/**
 * Created by hw on 2018/3/21.
 */
import request from '@/utils/request'

const system = {
  // 单位管理
  // 单位管理列表
  departmentList(params) {
    return request({
      url: '/department/list',
      method: 'GET',
      params
    })
  },
  // 删除单位
  departmentDelete(params) {
    return request({
      url: '/department/delete/' + params,
      method: 'DELETE'
    })
  },
  // 新增或编辑
  departmentAddOrEdit(params) {
    return request({
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/department/addOrEdit',
      method: 'POST',
      data: params
    })
  },
  // 获取详情
  departmentInfo(params) {
    return request({
      url: '/department/info/' + params,
      method: 'GET'
    })
  },
  // 工作台配置
  // 单位管理列表
  departWorkBenchList(params) {
    return request({
      url: '/departWorkBench/list',
      method: 'GET',
      params
    })
  },
  // 单位管理列表
  departWorkBenchUpdate(params) {
    return request({
      url: '/departWorkBench/update',
      method: 'POST',
      params
    })
  },
  // 获取字典
  dictGetDict(params) {
    return request({
      url: '/getDict/' + params,
      method: 'get',
      params
    })
  },
  // 用户名唯一性验证
  onlyUser(params) {
    return request({
      url: '/user/isOnly',
      method: 'POST',
      params
    })
  },
  // 角色编辑
  editRole(params) {
    return request({
      url: '/role/info/' + params,
      method: 'GET'
    })
  },
  // 用户管理单位管理列表
  departmentListUser(params) {
    return request({
      url: '/user/getDepartmentList',
      method: 'GET',
      params
    })
  },
  // 用户管理获取角色
  getRoleUser(params) {
    return request({
      url: '/user/getRole',
      method: 'GET'
    })
  },
  // 修改密码
  resetPwd(params) {
    return request({
      url: '/user/resetPwd',
      method: 'POST',
      data: params
    })
  },
  // 获取筛选范围法参数
  getScreenSettingList(params) {
    return request({
      url: '/screenSetting/getList/' + params,
      method: 'GET'
    })
  },
  // 获取筛选范围法参数
  updateScreenSetting(params) {
    return request({
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/screenSetting/update',
      method: 'POST',
      data: params
    })
  },
  /*
   * 参数设值接口
   * */
  // 参数设值查询接口
  getParamesList(params) {
    return request({
      url: '/paramsSetting/getList/' + params,
      method: 'get'
    })
  },
  // 参数设值查询接口
  updateParamesSetting(parames) {
    return request({
      url: '/paramsSetting/update/',
      method: 'post',
      data: parames
    })
  }
}
export default system
