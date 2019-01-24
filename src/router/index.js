import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '../views/layout/Layout'
//  登录
const login = resolve => { require(['@/views/login/index'], resolve)};
// 404
const undefinds = resolve => { require(['@/views/404'], resolve) };
// const icons = resolve => { require(['@/views/svg-icon/index'], resolve) };         // icons
const indexall = resolve => { require(['@/views/workbench/workbench_work'], resolve) };    // 首页
const table = resolve => { require(['@/views/workbench/workbench_work'], resolve) };              // 表格

// 工作台
const workbench_work = resolve => { require(['@/views/workbench/workbench_work'], resolve) };         // 工作台
const workbench_file = resolve => { require(['@/views/workbench/workbench_file'], resolve) };         // 文件管理
// 台账管理
const standing_org = resolve => { require(['@/views/standing/standing_org'], resolve) };              // 组织台账管理
const standing_Pic = resolve => { require(['@/views/standing/standing_Pic'], resolve) };              // 图档管理
const standing_Point = resolve => { require(['@/views/standing/standing_Point'], resolve) };          // 密封点管理
// 检测管理
const detection_task = resolve => { require(['@/views/detection/detection_task'], resolve) };          // 检测任务管理
const detaction_plan = resolve => { require(['@/views/detection/detaction_plan'], resolve) };          // 检测任务管理
// 维修管理
const maintain_gd = resolve => { require(['@/views/maintain/maintain_gd'], resolve) };          // 工单管理
const maintain_yq = resolve => { require(['@/views/maintain/maintain_yq'], resolve) };          // 延期维修管理
// 系统管理
const system_unit = resolve => { require(['@/views/system/system_unit'], resolve) }           // 单位管理
const system_user = resolve => { require(['@/views/system/system_user'], resolve) }             // 用户管理
const system_role = resolve => { require(['@/views/system/system_role'], resolve) }             // 角色管理
const system_dic = resolve => { require(['@/views/system/system_dic'], resolve) }            // 数据字典
const system_work = resolve => { require(['@/views/system/system_work'], resolve) }            // 工作台配置
const system_screening = resolve => { require(['@/views/system/system_screening'], resolve) }  // 筛选范围法参数设置
// 综合统计查询
// 综合查询
const statistics = resolve => { require(['@/views/statistics/statistics'], resolve) }

const statistics_Xl = resolve => { require(['@/views/statistics/statistics_Xl'], resolve) }

const statistics_Wx = resolve => { require(['@/views/statistics/statistics_Wx'], resolve) }
// 无组织排放概览
const overview_noOrg = resolve => { require(['@/views/statistics/overview_noOrg'], resolve) }
// 可达点排放概览
const overview_accPoint = resolve => { require(['@/views/statistics/overview_accPoint'], resolve) }
// 不可达点排放概览
const overview_noAccPoint = resolve => { require(['@/views/statistics/overview_noAccPoint'], resolve) }
// 首轮普查表-装置统计
const deviceStatistics = resolve => { require(['@/views/statistics/deviceStatistics'], resolve) }
// 相关方程法参数设置
const system_setrep = resolve => { require(['@/views/system/system_setrep'], resolve) }
// 平均排放系数法参数设置
const system_setaecp = resolve => { require(['@/views/system/system_setaecp'], resolve) }
// 查询管理
// 文件管理
const chaxun_cx = resolve => { require(['@/views/chaxun/chaxun_cx'], resolve) }
// 网站管理
export const constantRouterMap = [
  // { path: '/', component: Layout, hidden: true },
  { path: '/login', component: login, meta: { role: '/login' }, hidden: true },
  { path: '/404', component: undefinds, meta: { role: '/404' }, hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/indexall',
    name: 'indexall',
    meta: { role: '/indexall' },
    hidden: true,
    type: 0,
    children: [{
      path: 'indexall',
      meta: { role: '/indexall' },
      component: indexall
    }]
  },
  {
    path: '/workbench',
    component: Layout,
    type: 0,
    meta: { title: '工作台', role: '/workbench', icon: 'Computer_menu' },
    children: [
      {
        path: 'workbench_work',
        name: '工作台',
        type: 0,
        component: workbench_work,
        meta: { title: '工作台', role: '/workbench_work', icon: '' }
      },
      {
        path: 'workbench_file',
        name: '文件管理',
        type: 0,
        component: workbench_file,
        meta: { title: '文件管理', role: '/workbench_file', icon: '' }
      }
    ]
  },
  {
    path: '/standing-book',
    component: Layout,
    type: 0,
    meta: { title: '台账管理', role: '/standing', icon: 'file_menu' },
    children: [
      {
        path: 'standing_org',
        name: '组织台账管理',
        type: 0,
        component: standing_org,
        meta: { title: '组织台账管理', role: '/standing_org', icon: '' }
      },
      {
        path: 'standing_Pic',
        name: '图档管理',
        type: 0,
        component: standing_Pic,
        meta: { title: '图档管理', role: '/standing_Pic', icon: '' }
      },
      {
        path: 'standing_Point',
        name: '密封点管理',
        type: 0,
        component: standing_Point,
        meta: { title: '密封点管理', role: '/standing_Point', icon: '' }
      }
    ]
  },
  {
    path: '/detection',
    component: Layout,
    type: 0,
    meta: { title: '检测管理', role: '/detection', icon: 'find_replace_menu' },
    children: [
      {
        path: 'detaction_plan',
        name: '检测计划管理',
        type: 0,
        component: detaction_plan,
        meta: { title: '检测计划管理', role: '/detaction_plan', icon: '' }
      },
      {
        path: 'detection_task',
        name: '检测任务管理',
        type: 0,
        component: detection_task,
        meta: { title: '检测任务管理', role: '/detection_task', icon: '' }
      }
    ]
  },
  {
    path: '/maintain',
    component: Layout,
    type: 0,
    meta: { title: '维修管理', role: '/maintain', icon: 'settings_menu' },
    children: [
      {
        path: 'maintain_gd',
        name: '工单管理',
        component: maintain_gd,
        type: 0,
        meta: { title: '工单管理', role: '/maintain_gd', icon: '' }
      },
      {
        path: 'maintain_yq',
        name: '延期维修管理',
        component: maintain_yq,
        type: 0,
        meta: { title: '延期维修管理', role: '/maintain_yq', icon: '' }
      }
    ]
  },
  {
    path: '/chaxun',
    component: Layout,
    type: 0,
    meta: { title: '查询管理', role: '/chaxun', icon: 'chaxunGl' },
    children: [
      {
        path: 'chaxun_cx',
        name: '查询管理',
        component: chaxun_cx,
        type: 0,
        meta: { title: '查询管理', role: '/chaxun_cx', icon: '' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    type: 0,
    meta: { title: '综合分析', role: '/statistics', icon: 'chart_menu' },
    children: [
      // {
      //   path: 'statistics',
      //   name: '排放查询',
      //   component: statistics,
      //   type: 0,
      //   meta: { title: '排放查询', role: '/statistics_Pf', icon: '' }
      // },
      // {
      //   path: 'statistics_Xl',
      //   name: '泄漏查询',
      //   component: statistics_Xl,
      //   type: 0,
      //   meta: { title: '泄漏查询', role: '/statistics_Xl', icon: '' }
      // },
      // {
      //   path: 'statistics_Wx',
      //   name: '维修查询',
      //   component: statistics_Wx,
      //   type: 0,
      //   meta: { title: '维修查询', role: '/statistics_Wx', icon: '' }
      // },
      {
        path: 'overview_noOrg',
        name: '无组织排放概览',
        component: overview_noOrg,
        type: 0,
        meta: { title: '无组织排放概览', role: '/overview_noOrg', icon: '' }
      },
      {
        path: 'overview_accPoint',
        name: '可达点排放概览',
        component: overview_accPoint,
        type: 0,
        meta: { title: '可达点排放概览', role: '/overview_accPoint', icon: '' }
      },
      {
        path: 'overview_noAccPoint',
        name: '不可达点排放概览',
        component: overview_noAccPoint,
        type: 0,
        meta: { title: '不可达点排放概览', role: '/overview_noAccPoint', icon: '' }
      },
      {
        path: 'deviceStatistics',
        name: '首轮普查表-装置统计',
        component: deviceStatistics,
        type: 0,
        meta: { title: '首轮普查表-装置统计', role: '/deviceStatistics', icon: '' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    type: 0,
    meta: { title: '系统管理', role: '/system', icon: 'setting_menu' },
    children: [
      {
        path: 'system_unit',
        name: '单位管理',
        component: system_unit,
        type: 0,
        meta: { title: '单位管理', role: '/system_unit', icon: '' }
      },
      {
        path: 'system_user',
        name: '用户管理',
        component: system_user,
        type: 0,
        meta: { title: '用户管理', role: '/system_user', icon: '' }
      },
      {
        path: 'system_role',
        name: '角色管理',
        component: system_role,
        type: 0,
        meta: { title: '角色管理', role: '/system_role', icon: '' }
      },
      {
        path: 'system_dic',
        name: '数据字典',
        component: system_dic,
        type: 0,
        meta: { title: '数据字典', role: '/system_dic', icon: '' }
      },
      {
        path: 'system_work',
        name: '工作台配置',
        component: system_work,
        type: 0,
        meta: { title: '工作台配置', role: '/system_work', icon: '' }
      },
      {
        path: 'system_setrep',
        name: '相关方程法参数设置',
        component: system_setrep,
        type: 0,
        meta: { title: '相关方程法参数设置', role: '/system_setrep', icon: '' }
      },
      {
        path: 'system_screening',
        name: '筛选范围法参数设置',
        component: system_screening,
        type: 0,
        meta: { title: '筛选范围法参数设置', role: '/system_screening', icon: '' }
      },
      {
        path: 'system_setaecp',
        name: '平均排放系数法参数设置',
        component: system_setaecp,
        type: 0,
        meta: { title: '平均排放系数法参数设置', role: '/system_setaecp', icon: '' }
      }
    ]
  },

  // /*{
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: '系统管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: '系统管理',
  //       component: table,
  //       meta: { title: '用户管理', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: '角色管理',
  //       component: trees,
  //       meta: { title: '角色管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'tree',
  //       name: '数据字典',
  //       component: trees,
  //       meta: { title: '数据字典', icon: 'tree' }
  //     },
  //     {
  //       path: 'tree',
  //       name: '系统日志',
  //       component: trees,
  //       meta: { title: '系统日志', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   meta: { title: '图标', icon: 'form' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: '图标',
  //       component: icons,
  //       meta: { title: '图标', icon: 'form' }
  //     },
  //     {
  //       path: 'tree',
  //       name: '角色管理',
  //       component: trees,
  //       meta: { title: '角色管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'tree',
  //       name: '数据字典',
  //       component: trees,
  //       meta: { title: '数据字典', icon: 'tree' }
  //     },
  //     {
  //       path: 'tree',
  //       name: '系统日志',
  //       component: trees,
  //       meta: { title: '系统日志', icon: 'tree' }
  //     }
  //   ]
  // },*/
  { path: '*', redirect: '/404', meta: { role: '/404' }, hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

