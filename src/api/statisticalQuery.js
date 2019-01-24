
import request from '@/utils/request'

const statisticalQuery = {

  // 排放量查询
  statisticsEmissions(params) {
    return request({
      url: '/statistics/emissions',
      method: 'GET',
      params
    })
  },
  // 泄露查询GET /statistics/leakage
  statisticsLeakage(params) {
    return request({
      url: '/statistics/leakage',
      method: 'GET',
      params
    })
  },
  // 维修查询GET /statistics/repair
  statisticsRepair(params) {
    return request({
      url: '/statistics/repair',
      method: 'GET',
      params
    })
  },
  // 无组织排放概览GET /statistics/emissionOverview
  emissionOverview(params) {
    return request({
      url: '/statistics/emissionOverview',
      method: 'GET',
      params
    })
  },
  // 可达点排放概览GET /statistics/emissionOfReach
  emissionOfReach(params) {
    return request({
      url: '/statistics/emissionOfReach',
      method: 'GET',
      params
    })
  },
  // 不可达点排放概览 GET /statistics/emissionOfUnReach
  emissionOfUnReach(params) {
    return request({
      url: '/statistics/emissionOfUnReach',
      method: 'GET',
      params
    })
  },
  // 装置统计 GET /statistics/surveyOfDevice
  surveyOfDevice(params) {
    return request({
      url: '/statistics/surveyOfDevice',
      method: 'GET',
      params
    })
  },

};
export default statisticalQuery
