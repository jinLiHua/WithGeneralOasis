<template>
  <div class="app-container device_container">
    <el-container>
      <el-main>
        <el-row class='searchData' style="padding: 10px 10px;background-color: #fff;">
          <el-form ref="form" :inline="true" class="search_top this_Dtask" label-width="100px">
            <!-- <el-form-item label="开始时间：">
              <el-date-picker
                v-model="listQuery.start"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
               <i class='bxSearch'>*</i>
            </el-form-item>

            <el-form-item label="结束时间：">
              <el-date-picker
                v-model="listQuery.end"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
               <i class='bxSearch'>*</i>
            </el-form-item> -->

            <el-form-item label="检测计划：">
              <el-select v-model="listQuery.planId" placeholder="请选择">
                <el-option v-for="item in plans"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
               <i class='bxSearch'>*</i>
            </el-form-item>

            <el-form-item label="装置：">
              <el-select v-model="listQuery.orgCode" placeholder="请选择">
                <el-option
                  v-for="item in devices"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>

            </el-form-item>

            <el-button  type="success" @click="getList">查询</el-button>
          </el-form>
        </el-row>


        <el-row style="padding: 10px;margin-top: 10px;background-color: #fff">
          <el-table
            :data="tableData"
            :summary-method="getSummaries"
            show-summary
            style="width: 100%">
            <el-table-column
              prop="pointType"
              label="密封点类型"
              width="150">
            </el-table-column>

            <el-table-column label="项目建立">
              <el-table-column
                prop="checkNum"
                label="受控密封点">
              </el-table-column>
              <el-table-column
                prop="unreach"
                label="不可达点数">
              </el-table-column>
            </el-table-column>

            <el-table-column label="现场检测">
              <el-table-column
                prop="reach"
                label="检测点数">
              </el-table-column>
              <el-table-column
                prop="leak"
                label="一般泄漏点数">
              </el-table-column>
              <el-table-column
                prop="seriousLeak"
                label="严重泄漏点数">
              </el-table-column>
            </el-table-column>

            <el-table-column label="泄漏维修">
              <el-table-column
                prop="repairedIn5d"
                label="5日内首次维修修复密封点数">
              </el-table-column>
              <el-table-column
                prop="repairedIn15d"
                label="15日内实质性维修修复密封点数">
              </el-table-column>
              <el-table-column
                prop="repairedToNow"
                label="至今修复密封点数">
              </el-table-column>
              <el-table-column
                prop="name"
                label="除已修复的泄漏点，6个月内计划修复的泄漏点数">
              </el-table-column>
            </el-table-column>

          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import query from '@/api/statisticalQuery'
  import utils from '@/utils/skDateFormat'
  import detection from '@/api/detection'
  import standing from '@/api/standing'
  import { tip, } from '@/utils/tip'


  export default {
    methods: {
      //获取列表
      getList(){
        // if (!this.listQuery.start) {
        //   return tip('请选择开始日期！', 'warning')
        // }
        // if (!this.listQuery.end) {
        //   return tip('请选择结束日期！', 'warning')
        // }
        if (!this.listQuery.planId) {
          return tip('请选择检测计划！', 'warning')
        }
        let that = this;
        this.listLoading = true;
        query.surveyOfDevice(this.listQuery).then(res => {
          let data = res.data;
          that.tableData = data;
          that.listLoading = false;
        })
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      },
      getDetectionPlan() {
        detection.getDetactionPlanList(this.orgId).then(response => {
          this.plans = response.data
        })
      },
      getDevices() {
        let parames = {
          orgId: this.orgId,
          level: ''
        }
        standing.getOrgsByLevel(parames).then(response => {
          this.devices = response.data
        })
      },

    },
    data() {
      return {
        plans: [],
        devices: [],
        listLoading: false,
        listQuery: {
          planId: '',
          start: new Date().format("yyyy-MM-dd"),
          end: new Date().format("yyyy-MM-dd"),
          orgCode: '',
        },
        tableData: [],
      }
    },
    created() {
      let userOnly = 'USERSC' + sessionStorage.getItem('userName');
      let selectId = sessionStorage.getItem(userOnly);
      this.orgId = selectId
      this.getDetectionPlan();
      this.getDevices();
      this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', (val)=>{
        //选择的企业了
        this.listQuery.planId = '';
        this.listQuery.orgCode = '';
        this.orgId = val
        this.getDetectionPlan();
        this.getDevices();
      });
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .device_container {
    .el-table thead.is-group th {
      background-color: #F5FCF5;
    }
    .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
      background-color: inherit;
    }
    .el-date-editor.el-input {
      width: 200px;
    }
    .el-form--inline.search_top.this_Dtask .el-form-item {
      .el-form-item__content {
        width: 200px;
      }
    }
      .searchData{

    .el-form-item__content {
      width: 200px;
      height:40px;
    }
  }
  .bxSearch{
    color:red;
    position: relative;
    color: red;
    top: -46px;
    left: -102px;
  }
  }
</style>
