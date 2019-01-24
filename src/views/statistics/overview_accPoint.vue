<template>
  <div class="app-container acc_container">
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
            :span-method="objectSpanMethod"
            show-summary
            v-loading="listLoading"
            element-loading-text="拼命加载中"
            style="width: 100%">
            <el-table-column
              prop="orgName"
              label="装置名称"
              width="150">
            </el-table-column>

            <el-table-column
              prop="pointType"
              label="密封点类型"
              width="150">
            </el-table-column>

            <el-table-column
              prop="phaseBehavior"
              label="介质状态"
              width="150">
            </el-table-column>

            <el-table-column
              prop="reach"
              label="可达密封点数量"
              width="150">
            </el-table-column>

            <el-table-column label="泄漏点（个）">
              <el-table-column
                prop="leak"
                label="维修前">
              </el-table-column>
              <el-table-column
                prop="afterLeak"
                label="维修后">
              </el-table-column>
            </el-table-column>

            <el-table-column label="排放量（kg）">
              <el-table-column
                prop="checkValue"
                label="维修前">
              </el-table-column>
              <el-table-column
                prop="recheckValue"
                label="维修后">
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
        query.emissionOfReach(this.listQuery).then(res => {
          let data = res.data;
          let firFormat = [], secFormat = [];
          let currentList = [];
          for (let i = 0; i < data.length; i++) {
            let internalList = data[i];
            let secAll = 0;
            for (let m = 0; m < internalList.length; m++) {
              currentList.push(...internalList[m]);
              secFormat.push(internalList[m].length);
              secAll += internalList[m].length;
            }
            firFormat.push(secAll);
          }
          for (let i = 0; i < currentList.length; i++) {
            let currentData = currentList[i];
            currentData.afterLeak = currentData.leak - currentData.repaired;
          }
          that.secColumn = secFormat;
          that.firColumn = firFormat;
          that.tableData = currentList;
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
              //  debugger
              if (!isNaN(value)) {

                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
    if(index == 6 || index == 7){
     sums[index] = sums[index].toFixed(8)

        }
            sums[index] += '';

          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {


        if (columnIndex === 0) {
          let rowCount = 0;
          for (let i = 0; i < this.firColumn.length; i++) {
            rowCount += this.firColumn[i];
            if (rowIndex === rowCount - this.firColumn[i]) {
              return {
                rowspan: this.firColumn[i],
                colspan: 1
              };
            }
          }
          return {
            rowspan: 0,
            colspan: 0
          };
        }
        if (columnIndex === 1) {

          let rowCount = 0;
          for (let i = 0; i < this.secColumn.length; i++) {
            rowCount += this.secColumn[i];
            if (rowIndex === rowCount - this.secColumn[i]) {
              return {
                rowspan: this.secColumn[i],
                colspan: 1
              };
            }
          }
          return {
            rowspan: 0,
            colspan: 0
          };
        }
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
        firColumn: [],
        secColumn: [],
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
  .acc_container {
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
