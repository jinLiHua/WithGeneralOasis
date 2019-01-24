/**
 * Created by hw on 2018/3/21.
 */
import request from '@/utils/request'
const org = {
  // 新增组织
  orgAdd(params) {
    return request({
      url: '/org/add',
      method: 'post',
      params
    })
  },
  // 获取组织树
  orgGetOrgTreeOne(params) {
    return request({
      url: '/org/getOrgTree',
      method: 'get',
      params
    })
  },
  // 获取公共组织树
  orgGetOrgTree(params) {
    return request({
      url: '/getOrgTree',
      method: 'GET',
      params
    })
  },
  // 获取组织树
  orgUpdate(params) {
    return request({
      url: '/org/update',
      method: 'post',
      data: params
    })
  },
  // 删除组织
  orgDelete(params) {
    return request({
      url: '/org/delete/' + params,
      method: 'post'
    })
  },
  // 图档管理
  // 上传图片
  uploadDrawing(params) {
    return request({
      url: '/fileSave/uploadDrawing',
      method: 'post',
      data: params
    })
  },
  // 图档列表
  imageFileList(params) {
    return request({
      url: '/imageFile/list',
      method: 'GET',
      params
    })
  },
  // 图档列表
  imageFileListTask(params) {
    return request({
      url: '/detectionTask/getImageList',
      method: 'GET',
      params
    })
  },
  // 检测任务-图档关系列表
  getTaskImageList(params) {
    return request({
      url: '/detectionTask/getTaskImageList',
      method: 'GET',
      params
    })
  },
  // 新增编辑图档
  imageAddOrEdit(params) {
    return request({
      url: '/imageFile/addOrEdit',
      method: 'POST',
      data: params
    })
  },
  // 删除图档
  imageDelete(params) {
    return request({
      url: '/imageFile/deleteBatchIds',
      method: 'DELETE',
      params
    })
  },
  // 删除图档
  imageInfo(params) {
    return request({
      url: '/imageInfo/' + params,
      method: 'GET'
    })
  },
  // 密封点列表
  pointList(params) {
    return request({
      url: '/imageFile/getPointList',
      method: 'GET',
      params
    })
  },
  // 密封点新增
  pointAdd(params) {
    return request({
      url: '/sealingPoint/saveOrEdit',
      method: 'POST',
      data: params
    })
  },
  // 密封点删除
  pointDelete(params) {
    return request({
      url: '/sealingPoint/deleteBatchIds',
      method: 'DELETE',
      params
    })
  },
  // 密封点详情
  pointInfo(params) {
    return request({
      url: '/pointInfo/' + params,
      method: 'GET'
    })
  },
  // 更新节点信息
  updateCoordinates(params) {
    return request({
      url: '/imageFile/updateCoordinates',
      method: 'POST',
      data: params
    })
  },
  // 导出表格
  downloadExcel(params) {
    return request({
      url: '/exportSealingPointExcel',
      method: 'GET',
      params
    })
  },
  // 导出pDF
  exportPDF(params) {
    return request({
      url: '/fileSave/downDrawing/' + params,
      method: 'GET',
      params
    })
  },
  // 上传base64
  uploadBase64(params) {
    return request({
      url: '/fileSave/uploadBase64',
      method: 'POST',
      data: params
    })
  },
  // yunfei/
  // 获取阀值关系列表
  getTSList(params) {
    return request({
      url: '/org/getTSList/' + params,
      method: 'get'
    })
  },

  // 获取工作时长列表
  getWorkTimeList(params) {
    return request({
      url: '/workTimelong/getList/' + params,
      method: 'get'
    })
  },
  // 删除工作时长
  deleteWTime(params) {
    return request({
      url: '/workTimelong/deleteBatchIds',
      method: 'DELETE',
      params
    })
  },
  // 工作时长
  editWorkTime(params) {
    return request({
      url: '/workTimelong/addWorkTime',
      method: 'POST',
      params
    })
  },
  changeFloor(params) {
    return request({
      url: 'sealingPoint/updateBatch',
      method: 'POST',
      params
    })
  },
  changeFloorGX(params) {
    return request({
      url: 'sealingPoint/updateBatchByImage',
      method: 'POST',
      params
    })
  },
  // --------------------------------------查询管理----------------------------------------
  getOrgsByLevel(params) { // 获取装置
    return request({
      url: '/org/getOrgsByLevel',
      method: 'GET',
      params
    })
  },
  getSarchManage(params) { // 获取列表
    return request({
      url: '/statistics/searchManage',
      method: 'GET',
      params
    })
  },
  searchExport(params) { // 导出
    return request({
      url: '/statistics/searchExport',
      method: 'GET',
      params
    })
  },
  savePointDetails(params) { // 导出
    return request({
      url: '/sealingPoint/updateType',
      method: 'POST',
      data: params
    })
  },
  get(params) { // 导出
    return request({
      url: '/delayPoint/getDelayNum?orgId=' + params,
      method: 'get'
    })
  }
  // updateCoordinates(params) {
  //   return request({
  //     url: 'imageFile/updateCoordinates',
  //     method: 'post',
  //     params
  //   })
  // }
}
export default org
