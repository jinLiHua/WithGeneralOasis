/**
 * Created by hw on 2018/3/23.
 */
import request from '@/utils/request'

const maintain = {
  // 新增组织
  list(params) {
    return request({
      url: '/repairOrder/list',
      method: 'GET',
      params
    })
  },
  // 密封点列表
  getListOfPoint(params) {
    return request({
      url: '/repairOrder/getListOfPoint',
      method: 'GET',
      params
    })
  },
  // 密封点维修工单列表
  getOrderPageByPointId(params) {
    return request({
      url: '/getOrderPageByPointId',
      method: 'GET',
      params
    })
  },
  // 维修工单列表
  repairOrderList(params) {
    return request({
      url: '/repairOrder/list',
      method: 'GET',
      params
    })
  },
  // 维修工单列表新增或编辑
  addOrEdit(params) {
    return request({
      url: '/repairOrder/addOrEdit',
      method: 'POST',
      data: params
    })
  },
  // 获取工单关联密封点
  getPoints(params) {
    return request({
      url: '/repairOrder/getPoints',
      method: 'POST',
      params
    })
  },
  // 密封点列表
  getPointPage(params) {
    return request({
      url: '/repairOrder/getPointPage',
      method: 'GET',
      params
    })
  },
  // 新增密封点关系
  addPoint(params) {
    return request({
      url: '/repairOrder/addPoint',
      method: 'POST',
      params
    })
  },
  // 处理工单
  dispose(params) {
    return request({
      url: '/repairOrder/dispose',
      method: 'POST',
      params
    })
  },
  // 处理延期密封点-维修完成或延期维修 POST /delayPoint/dispose
  delayPointDispose(params) {
    return request({
      url: '/delayPoint/dispose',
      method: 'POST',
      params
    })
  },
  // 工单详情
  info(params) {
    return request({
      url: '/repairOrder/info/'+params,
      method: 'GET'
    })
  },
  // 删除工单
  deleteBatchId(params) {
    return request({
      url: '/repairOrder/deleteBatchIds',
      method: 'DELETE',
      params
    })
  },
  // 批量处理工单
  disposeBatch(params) {
    return request({
      url: '/repairOrder/disposeBatch/'+params,
      method: 'POST',
      params
    })
  },
  // 删除关系密封点
  deleteRelation(params) {
    return request({
      url: '/repairOrder/deletePoints',
      method: 'DELETE',
      params
    })
  },
  // 延期列表
  getPointPageYq(params) {
    return request({
      url: '/delayPoint/getPointPage',
      method: 'GET',
      params
    })
  }
}
export default maintain
