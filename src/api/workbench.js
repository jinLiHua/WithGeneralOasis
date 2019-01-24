/**
 * Created by hw on 2018/3/22.
 */
import request from '@/utils/request'

const workbench = {
  // 工作台
  workBenchList(params) {
    return request({
      url: '/departWorkBench/list',
      method: 'GET',
      params
    })
  },
  // 工作台文件下载列表
  workBenchFileList(params) {
    return request({
      url: '/departWorkBenchList',
      method: 'GET',
      params
    })
  },
  // 检测计划
  searchPlan(params) {
    return request({
      url: '/detectionPlan/page',
      method: 'get',
      params
    })
  },
  // 即将到期延期维修密封点
  getDelayedNum(params) {
    return request({
      url: '/departWorkBench/getDelayedNum',
      method: 'GET',
      params
    })
  },
  // 工作台密封点状态点数
  getLeakagePointNum(params) {
    return request({
      url: '/departWorkBench/getPointNumByStatus',
      method: 'GET',
      params
    })
  },
  // 工作台密封点相态点数
  getPointNumByPhase(params) {
    return request({
      url: '/departWorkBench/getPointNumByPhase',
      method: 'GET',
      params
    })
  },
  // 工作台密封点类型
  getPointNumByType(params) {
    return request({
      url: '/departWorkBench/getPointNumByType',
      method: 'GET',
      params
    })
  },
  // 密封点数量
  getPointNumByOrg(params) {
    return request({
      url: '/departWorkBench/getPointNumByOrg/' + params.orgId,
      method: 'GET'

    })
  },
  // 泄露与修复
  getLeakageAndRepair(params) {
    return request({
      url: '/departWorkBench/getLeakageAndRepair/' + params.orgId,
      method: 'GET'

    })
  },
  // 排放量
  getEmissions(params) {
    return request({
      url: '/departWorkBench/getEmissions/' + params.orgId,
      method: 'GET'

    })
  },
  // 文件管理列表
  fileList(params) {
    return request({
      url: '/file/list',
      method: 'GET',
      params
    })
  },

  // 文件批量删除
  deleteFile(params) {
    return request({
      url: '/file/delete',
      method: 'DELETE',
      params
    })
  }
}
export default workbench
