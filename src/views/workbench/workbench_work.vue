<template>
  <div class="s_o_c my_chart_work workbenchWork">
    <!-- 检测计划 -->
    <div class="allData" v-if="taskplan.status === 0">
      <div class="green_title">检测计划</div>
      <div style="background-color: white; padding: 20px">
        <el-table :data="detactionList" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="endTime" label="年份">
          </el-table-column>
          <el-table-column prop="name" label="计划名称">
          </el-table-column>
          <el-table-column prop="planStatus" label="状态">
          </el-table-column>
          <el-table-column prop="notes" label="备注">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 密封点数量 -->
    <div class="allData" v-if="pointnum.status === 0">
      <div class="green_title">密封点数量</div>
      <div style="background-color: white; padding: 20px">
        <el-table :data="pointNumByOrgList" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="name" label="装置">
          </el-table-column>
          <el-table-column prop="pointnum" label="密封点数量">
          </el-table-column>
          <el-table-column prop="reachnum" label="可达点数量">
          </el-table-column>
          <el-table-column prop="unreachnum" label="不可达点数量">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 密封点类型 -->
    <div class="allData" v-if="pointtype.status === 0">
      <div class="green_title">密封点类型</div>
      <el-row style="padding: 0;margin-top: 20px;background-color:#fff">
        <!-- 类型 -->
        <el-col :span="12" style="padding-left: 0;">
          <div id="main1" class="chart_main" style="height: 400px;background-color: #fff;width:750px"></div>
        </el-col>
      </el-row>
    </div>

    <!-- 泄露与修复 -->
    <div class="allData" v-if="leakage.status === 0">
      <div class="green_title">泄漏与修复</div>
      <div style="background-color: white; padding: 20px">
        <el-table :data="leakageAndRepairList" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="name" label="装置">
          </el-table-column>
          <el-table-column prop="pointnum" label="密封点数量">
          </el-table-column>
          <el-table-column prop="leakage" label="泄漏点数">
          </el-table-column>
          <el-table-column prop="repaired" label="修复成功点数">
          </el-table-column>
          <el-table-column prop="yanchi" label="延迟修复点数">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 排放量 -->
    <div class="allData" v-if="emissions.status === 0">
      <div class="green_title">排放量</div>
      <el-row style="padding: 0;margin-top: 20px;background-color:#fff">
        <el-col :span="12" style="padding-left: 0;">
          <div id="main2" class="chart_main" style="height: 400px;background-color: #fff;width:750px"></div>
        </el-col>
      </el-row>
    </div>
    <!-- 文件下载 -->
    <div class="allData" v-if="fileDownload.status === 0">
      <div class="green_title">文件下载</div>
      <div style="background-color: white; padding: 20px">
        <el-table :data="list" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="originalName" label="文件名" width="174px">
            <template slot-scope="scope">
              <span class="downloadC" @click="download(scope.row)">{{scope.row.originalName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipment" label="大小" :formatter=formatSize>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime.split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人">
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleCurrentChange" :total="total" style="text-align:center;">
          </el-pagination>
        </el-col>
      </div>
    </div>
  </div>

</template>


<script>
import org from '@/api/standing'
import addPic from '@/components/Addpoint/picAdd'
import system from '@/api/system'
import { type } from '@/utils/setFormType'
import echart from 'echarts'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import workbench from '@/api/workbench'

export default {
  components: { addPic },

  data() {
    return {
      colors: [
        '#0069F6',
        '#00B100',
        '#EA1D24',
        '#ED5A24',
        '#FF1F9C',
        '#FFAD01',
        '#88D93E',
        '#A7329D',
        '#9DC3E6',
        '#0070C0'
      ],
      detactionPlanData: {
        startTime: '', //开始时间
        endTime: '', //结束时间
        orgId: '' //企业Id
      }, //检测计划参数

      activeName: 'first',
      isType: true,
      picData: {
        picId: 0,
        orgId: '',
        dialogFormVisible: false
      },
      optionBar: '',
      detactionList: null, //检测计划列表
      pointNumByOrgList: null, //密封点数量列表
      charts: '', //密封点类型数据
      chartsBar: null, //排放量数据
      leakageAndRepairList: null, //泄露与修复数据
      emissionsList: null, //排放量
      isAdd: true,
      list: null,
      listLoading: false,
      listShow: false,
      total: 0,
      listQuery: {
        size: 10,
        current: 1
      },
      taskplan: {}, //检测计划
      pointnum: {}, //密封点数量
      pointtype: {}, //密封点类型
      emissions: {}, //排放量
      delayedPoint: {},
      delayedPointCount: {}, //密封点
      sealPoint: {},
      leakage: {}, //泄露与修复

      leakageStatical: {
        seriousLeakage: 0,
        generalLeakage: 0,
        leakPointCount: 0
      },
      //        状态数据
      fileDownload: {}
    }
  },
  methods: {
    download(a) {
      let base = baseUrl()
      let url = base + a.url.split('.')[0]
      xiaZai(url)
      // window.open( base + a.url.split('.')[0]);
    },
    formatSize(row, col) {
      const value = row.size
      if (null == value || value == '') {
        return '0 Bytes'
      }
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      let srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / Math.pow(1024, index)
      size = size.toFixed(2) //保留的小数位数
      return size + unitArr[index]
    },
    //------------------------------------------------------------------------获取列表
    getList() {
      this.listLoading = true
      let that = this
      workbench.workBenchList().then(response => {
        that.listLoading = false
        let workData = response.data
        workData.forEach(function(e) {
          switch (e.code) {
            //检测计划
            case 'taskplan':
              that.taskplan = e
              if (e.status === 0) that.getDetactionList()
              break
            //密封点数量
            case 'pointnum':
              that.pointnum = e
              if (e.status === 0) that.getPointNumByOrgList()
              break
            //密封点类型
            case 'pointtype':
              that.pointtype = e
              if (e.status === 0) that.getSealPointStatistical()
              break
            //泄露与修复
            case 'leakage':
              that.leakage = e
              if (e.status === 0) that.getLeakageAndRepairList()
              break
            //排放量
            case 'emissions':
              that.emissions = e
              if (e.status === 0) that.getDischarge()
              break
            default:
              //文件下载的
              that.fileDownload = e
              //请求下载列表
              if (e.status === 0) that.fileDownloadList()
              break
          }
        })
      })
    },
    //------------------------------------------------------------------获取检测计划列表
    getDetactionList() {
      this.listLoading = true
      workbench.searchPlan(this.detactionPlanData).then(res => {
        this.detactionList = res.data.records
        for (var i = 0; i < res.data.records.length; i++) {
          if (this.detactionList[i].endTime) {
            this.detactionList[i].endTime = this.detactionList[
              i
            ].endTime.substring(0, 4)
          }
        }
        this.listLoading = false
      })
    },
    //---------------------------------------------------------------------获取密封点数量列表
    getPointNumByOrgList() {
      this.listLoading = true
      workbench
        .getPointNumByOrg({ orgId: this.detactionPlanData.orgId })
        .then(res => {
          this.pointNumByOrgList = res.data
          this.listLoading = false
        })
    },
    //---------------------------------------------------------------------泄露与修复
    getLeakageAndRepairList() {
      this.listLoading = true
      workbench
        .getLeakageAndRepair({ orgId: this.detactionPlanData.orgId })
        .then(res => {
          this.leakageAndRepairList = res.data
          this.listLoading = false
        })
    },
    // Bar ----------------------------------------------------------------------------- 排放量
    getDischarge() {
      this.listLoading = true
      workbench
        .getEmissions({ orgId: this.detactionPlanData.orgId })
        .then(res => {
          this.emissionsList = res.data
          var optionName = [] //name
          var unreachemission = [] //不可达
          var reachemission = [] //可达
          var repairmission = [] //修复
          res.data.forEach(e => {
            optionName.push(e.name)
            unreachemission.push(e.unreachemission)
            reachemission.push(e.reachemission)
            repairmission.push(e.repairmission)
          })
          this.$nextTick(function() {
            this.drawBar(
              'main2',
              optionName,
              unreachemission,
              reachemission,
              repairmission
            )
          })
          this.listLoading = false
        })
    },
    // Bar  排放量
    drawBar(id, optionName, unreachemission, reachemission, repairmission) {
      this.chartsBar = echart.init(document.getElementById(id))
      this.chartsBar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['可达点修复前排放量', '可达点修复后排放量', '不可达点排放量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
              axisTick: {show: false},
            data: optionName,
             axisLabel : {
                show:true,
                interval: 0 ,//,    // {number}
                rotate: 10,
               // margin: 8

            }
          }
        ],
        yAxis: [
          {
            title: '排放量（kg）',
            type: 'value'
          }
        ],
        series: [
          {
            name: '不可达点排放量',
            type: 'bar',
            stack: 'notReachable',
            color: '#FFFF00',
            data: unreachemission
          },

          {
            name: '可达点修复前排放量',
            type: 'bar',
            stack: 'notReachable',
            color: '#9DC3E6',
            data: reachemission
          },
          {
            name: '不可达点排放量',
            type: 'bar',
            stack: 'reachable',
            color: '#FFFF00',
            data: unreachemission
          },
             {
            name: '可达点修复后排放量',
            type: 'bar',
            stack: 'reachable',
            color: '#0070C0',
            data: repairmission
          },

        ]
      })
    },
    //--------------------------------------------------------------------------------获取密封点类型
    getSealPointStatistical() {
      let that = this
      workbench
        .getPointNumByType({ orgId: this.detactionPlanData.orgId })
        .then(response => {
          let data = response.data
          let options = []
          data.forEach(e => options.push(e.name))
          that.$nextTick(function() {
            that.drawPie('main1', '类型', options, data)
          })
        })
    },
    // pie
    drawPie(id, titile, opinions, optionData) {
      this.charts = echart.init(document.getElementById(id))

      this.charts.setOption({
        color: this.colors,
        title: {
          text: titile,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          // left: 'left',
          // top: '30',
          bottom: '0',
          data: opinions
        },
        series: [
          {
            name: '数据统计',
            type: 'pie',
            radius: '45%',
            center: ['50%', '60%'],
            data: optionData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
            //  label: {
            //   normal: {
            //     show: false
            //   },
            //   emphasis: {
            //     show: true,
            //     textStyle: {
            //       fontSize: '30',
            //       fontWeight: 'blod'
            //     }
            //   }
            // },
            //  labelLine: {
            //   normal: {
            //     show: false
            //   }
            // },
          }
        ]
      })
    },
    //---------------------------------------------------------------------------------------请求文件下载列表
    fileDownloadList() {
      let that = this
      workbench.workBenchFileList(this.listQuery).then(response => {
        that.list = response.data.records
        that.total = response.data.total
      })
    },
    //获取即将到期延期维修密封点
    getDelayedPointNum() {
      let that = this
      workbench.getDelayedNum().then(response => {
        that.delayedPointCount = response.data
      })
    },

    // 获取泄漏情况统计
    getLeakageStatus() {
      let that = this
      workbench.getLeakagePointNum().then(response => {
        let data = response.data
        let options = []
        let seriousLeakage = 0
        let generalLeakage = 0
        data.forEach(function(e) {
          options.push(e.name)
          switch (e.name) {
            case '一般泄漏':
              generalLeakage = e.value
              break
            case '严重泄漏':
              seriousLeakage = e.value
              break
            default:
              break
          }
        })
        that.leakageStatical.seriousLeakage = seriousLeakage
        that.leakageStatical.generalLeakage = generalLeakage
        that.leakageStatical.leakPointCount = seriousLeakage + generalLeakage
        that.$nextTick(function() {
          that.drawPie('main3', '状态', options, data)
        })
      })
    },

    //分页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.fileDownloadList()
    }
  },

  created() {
    if (type() == 2 || type() == 3) {
      this.isType = false
    }
    let userOnly = 'USERSC' + sessionStorage.getItem('userName')
    let selectId = sessionStorage.getItem(userOnly)
    var myDate = new Date()
    var date =
      myDate.getFullYear() +
      '-' +
      (myDate.getMonth() + 1) +
      '-' +
      myDate.getDate()
    this.detactionPlanData = {
      startTime: myDate.getFullYear() + '-01-01',
      endTime: date,
      orgId: selectId
    }

    let that = this
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', val => {
      if (val !== '') {
        that.detactionPlanData.orgId = val
      }
      if (val != 0) {
        this.getPointNumByOrgList() //密封点数量
      }
      this.getDetactionList() //检测计划
      this.getSealPointStatistical() //密封点类型
      this.getLeakageAndRepairList() //泄露与修复
      this.fileDownloadList() //文件下载
      this.getDischarge() //排放量
    })

    this.getList()
  },
  watch: {
    leakage: function(newVal) {},
    sealPoint: function(newVal) {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$mt_20: 20px;
$mt_10: 10px;
.workbenchWork {
  margin-bottom: 20px !important;
  overflow-y: auto;
}
.s_o_c.my_chart_work {
  div.allData {
    width: 48%;
    display: inline-block;
    float: left;
    margin-bottom: 30px;
    margin-right: 2%;
  }
  div.allData > div:nth-child(2) {
    height: 440px;
    overflow-y: auto;
  }
  .green_title {
    font-size: 18px;
    color: #333;
    padding-left: 5px;
    border-left: 4px solid #30b444;
    margin: $mt_20 0;
  }
  .el-table td {
    padding: 5px 0;
  }
  .div_k {
    height: 150px;
    color: white;
    font-size: 20px;
    padding-left: 20px;
    .t_r {
      line-height: 150px;
      padding-right: 10px;
      div {
        display: inline-block;
        height: 75px;
        width: 75px;
        box-sizing: border-box;
        text-align: center;
        position: relative;
        top: 30px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .f_b {
      font-size: 40px;
      margin-top: 40px;
    }
  }
  color: black;
  box-sizing: border-box;
  padding: 0 0 $mt_20 $mt_20;
  margin-top: $mt_20;
  .t_r {
    text-align: right;
  }
  .t_a {
    text-align: center;
  }
  .el-main {
    margin-left: $mt_20/2;
    background-color: #fff;
    .el-form {
      margin-top: $mt_20;
      .el-form-item {
        padding-right: 0;
      }
    }
  }
  .el-dialog__body {
    overflow: hidden;
    padding-top: $mt_20/4;
    .el-breadcrumb {
      margin-bottom: $mt_20;
    }
    .el-form.form2 {
      .el-form-item {
        width: 48%;
        .el-form-item__content {
          width: 87%;
        }
        &.form2Ta {
          width: 100%;
          .el-form-item__content {
            width: 91%;
          }
        }
      }
    }
  }
  .el-menu-item {
    font-size: 14px;
    height: 35px;
    line-height: 35px;
  }
  .el-col-24 {
    img {
      width: 100%;
    }
  }
  .el-col-12 {
    padding: 10px;
  }
  .add_dia {
    &.add {
      .el-form--inline .el-form-item {
        width: 48%;
        input {
          width: 275px;
          box-sizing: border-box;
        }
        textarea {
          width: 847px;
        }
        &.mark_textarea {
          display: block;
          width: 100%;
        }
        &.spe_item {
          width: 100%;
          .el-form-item__content {
            width: 80%;
            .el-input {
              width: 24%;
              input {
                width: 195px;
              }
            }
          }
        }
      }
    }
  }
  .search_dia {
    .t_a {
      margin-top: $mt_20;
    }
  }
  .downloadC:hover {
    cursor: pointer;
    color: #7bd0cb;
    text-decoration: underline;
  }
}
</style>
