/**
 * Created by hw on 2018/3/23.
 */
import request from '@/utils/request'

const detection = {
  // 密封点检测任务列表
  list(params) {
    return request({
      url: '/detectionTask/getTaskListByPointId',
      method: 'GET',
      params
    })
  },
  // 密封点检测任务列表
  getTaskPageByPointId(params) {
    return request({
      url: '/getTaskPageByPointId',
      method: 'GET',
      params
    })
  },
  // 检测任务管理列表
  getList(params) {
    return request({
      url: '/detectionTask/list',
      method: 'GET',
      params
    })
  },
  // 检测任务新增编辑
  addOrEdit(params) {
    return request({
      url: '/detectionTask/addOrEdit',
      method: 'POST',
      data: params
    })
  },
  // 检测删除
  deleteIds(params) {
    return request({
      url: '/detectionTask/deleteBatchIds',
      method: 'DELETE',
      params
    })
  },
  // 检测详情
  info(params) {
    return request({
      url: '/detectionTask/info/' + params,
      method: 'GET'
    })
  },
  // 获取新增密封点弹窗列表
  getPointPage(params) {
    return request({
      url: '/detectionTask/getPointPage',
      method: 'GET',
      params
    })
  },
  // 获取新增密封点弹窗列表
  getPointList(params) {
    return request({
      url: '/detectionTask/getPointList',
      method: 'GET',
      params
    })
  },
  // 图档多选确定
  addImage(params) {
    return request({
      url: '/detectionTask/addImage',
      method: 'POST',
      params
    })
  },
  // 检测任务下的密封点分页列表
  getTaskPointPage(params) {
    return request({
      url: '/detectionTask/getTaskPointPage',
      method: 'GET',
      params
    })
  },
  // 检测任务下的密封点分页列表
  addPoint(params) {
    return request({
      url: '/detectionTask/addPoint',
      method: 'POST',
      params
    })
  },
  // 删除检测任务中图档
  deleteImages(params) {
    return request({
      url: '/detectionTask/deleteImages',
      method: 'DELETE',
      params
    })
  },
  // 删除检测任务中密封点
  deletePoints(params) {
    return request({
      url: '/detectionTask/deletePoints',
      method: 'DELETE',
      params
    })
  },
  // 图档导入POST /importTXT
  importCSV(params) {
    return request({
      url: '/importCSV/',
      method: 'POST',
      data: params
    })
  },
  // 图档导入
  importTXT(params) {
    return request({
      url: '/importTXT/',
      method: 'POST',
      data: params
    })
  },
  // 图档导出
  exportTaskCSV(params) {
    return request({
      url: '/exportTaskCSV',
      method: 'GET',
      params
    })
  },
  getTaskPlanList(params) { // 获取计划列表
    return request({
      url: '/detectionPlan/getListWithParent/' + params,
      method: 'get'
    })
  },
  // ----------------------------------------------检测计划------------------------------------------
  // 获取列表
  getDetactionPlanList(params) {
    return request({
      url: '/detectionPlan/getList/' + params,
      method: 'get'
    })
  },
  addORupdateDetactionPlanList(params) { // 新增
    return request({
      url: '/detectionPlan/addDetectionPlan',
      method: 'post',
      data: params
    })
  },
  getDetails(params) { // 新增
    return request({
      url: '/detectionPlan/info/' + params,
      method: 'get'
    })
  },
  deleteId(params) {
    return request({
      url: '/detectionPlan/deleteBatchIds',
      method: 'DELETE',
      params
    })
  },
  searchPlan(params) {
    return request({
      url: '/detectionPlan/page',
      method: 'get',
      params
    })
  }
}
export default detection
