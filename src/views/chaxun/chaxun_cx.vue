<template>
  <div class="app-container thisDtask chaxun">
    <el-container>
      <el-main>
        <el-col :span="24" class="toolbar searchData" style="padding-bottom: 0px;">
          <el-form :inline="true" class="search_top this_Dtask" label-width="100px">
            <!-- <el-form-item label="开始日期:" >
              <el-date-picker v-model="listQuery.start" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
              </el-date-picker>
              <i class='bxSearch'>*</i>
            </el-form-item>
            <el-form-item label="结束日期:" >
              <el-date-picker v-model="listQuery.end" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
              </el-date-picker>
              <i class='bxSearch'>*</i>
            </el-form-item> -->
            <el-form-item label="检测计划:">
              <el-select v-model="listQuery.planId" placeholder="请选择">
                <el-option v-for="item in planList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <i class='bxSearch'>*</i>
            </el-form-item>
            <el-form-item label="装置:">
              <el-select v-model="orgCode" placeholder="请选择">
                <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="群组编码:">
              <el-input placeholder="请输入群组编码" v-model="listQuery.groupCode"></el-input>
            </el-form-item>

            <el-form-item label="扩展编码:">
              <el-input placeholder="请输入扩展编码" v-model="listQuery.extendCode"></el-input>
            </el-form-item>

            <el-form-item label="密封点类型:">
              <el-select v-model="listQuery.type" placeholder="请选择">
                <el-option v-for="item in sealType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="相态：">
              <el-select v-model="listQuery.phase" placeholder="请选择">
                <el-option v-for="item in phaseState" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否可达:">
              <el-select v-model="listQuery.isReach" placeholder="请选择">
                <el-option value="1" label="是">
                </el-option>
                <el-option value="0" label="否">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否泄漏:">
              <el-select v-model="listQuery.status" placeholder="请选择">
                <el-option value="1" label="是">
                </el-option>
                <el-option value="0" label="否">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="物料信息:">
              <el-input placeholder="请输入物料信息" v-model="listQuery.materialsInfo"></el-input>
            </el-form-item>
            <el-button style="float: right;margin:0 20px;" type="primary" @click="downloadFile">导出</el-button>
            <el-button style="float: right;" type="success" @click="searchGetList">查询</el-button>

          </el-form>
        </el-col>
        <div style="height:10px;clear:both"></div>
        <div style="padding:10px;background-color:#fff;overflow:auto">
          <el-table ref="multipleTable" height="684" tooltip-effect="dark" :data="list" @selection-change="handleSelectionChange" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中">
            <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
            <el-table-column prop="name"  fixed="left" label="装置" width="200px">
            </el-table-column>
            <el-table-column prop="area"  fixed="left" label="区域" width="200px">
            </el-table-column>
            <el-table-column prop="groupCode" fixed="left" label="群组编码" width="160px">
            </el-table-column>
            <el-table-column prop="extendCode" fixed="left" label="扩展编码" width="90px">
            </el-table-column>
            <el-table-column prop="equipment" label="设备" width="160px">
            </el-table-column>
            <el-table-column prop="floor" label="楼层">
            </el-table-column>
            <el-table-column prop="equipName" label="管线/设备名称" width="130px">
            </el-table-column>
            <el-table-column prop="equipCode" label="管线/设备位号" width="130px">
            </el-table-column>

            <el-table-column prop="type" label="密封点类型" width="160px">
            </el-table-column>
            <el-table-column prop="phaseBehavior" label="相态" width="140px">
            </el-table-column>
            <el-table-column prop="materialsInfo" label="物料信息" width="200px">
              <template slot-scope="scope">
                <div :title="scope.row.materialsInfo" class="materialsInfoC">{{scope.row.materialsInfo}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="size" label="尺寸">
            </el-table-column>
            <el-table-column prop="preservation" label="是否保温" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.preservation">是</span>
                <span v-if="!scope.row.preservation">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="reach" label="是否可达" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.reach">是</span>
                <span v-if="!scope.row.reach">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="details" label="图档描述" width="200px">
              <template slot-scope="scope">
                <div :title="scope.row.details" class="materialsInfoC">{{scope.row.details}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="notes" label="备注" width="300px">
              <template slot-scope="scope">
                <div :title="scope.row.notes" class="remarks">{{scope.row.notes}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="checkTime" label="检测时间" width="110px">
              <template slot-scope="scope">
                <span>{{scope.row.checkTime != null ? scope.row.checkTime.split(' ')[0] : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="checkMan" label="检测人">
            </el-table-column>
            <el-table-column prop="checkValue" label="净检测值" width="120px">
            </el-table-column>
            <el-table-column prop="emissonValue" label="排放量" width="120px">
            </el-table-column>
            <el-table-column prop="repairUser" label="维修人">
            </el-table-column>
            <el-table-column prop="repairWay" label="维修方式" width="90px">
            </el-table-column>
            <el-table-column prop="reCheckMan" label="复测人">
            </el-table-column>
            <el-table-column prop="reCheckTime" label="复测时间" width="90px">
              <template slot-scope="scope">
                <span>{{scope.row.reCheckTime != null ? scope.row.reCheckTime.split(' ')[0] : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reCheckValue" label="复测净检测值" width="120px">
            </el-table-column>
            <el-table-column prop="reEmissonValue" label="复测排放量" width="110px">
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager,next" :page-size="10" @current-change="handleCurrentChange" :total="total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </div>
      </el-main>

    </el-container>
  </div>

</template>

<script>
import detection from '@/api/detection'
import system from '@/api/system'
import org from '@/api/standing'
import utils from '@/utils/skDateFormat'
import { tip, xiaZai, baseUrl } from '@/utils/tip'

export default {
  watch: {},
  data() {
    return {
      sealType: [], // 密封点类型 下拉
      phaseState: [], // 相态  下拉
      planList: [], // 检测计划  下拉
      deviceList: [], // 装置  下拉
      listQuery: {
        current: 1, // 当前页
        orgId: '', // 当前组织Id
        start: new Date().format('yyyy-MM-dd'), // 开始时间
        end: new Date().format('yyyy-MM-dd'), // 结束时间
        groupCode: '', // 群组编码
        extendCode: '', // 扩展编码
        type: '', // 密封点类型
        phase: '', // 相态
        isReach: '', // 是否可达
        materialsInfo: '', // 物料信息
        status: '', // 是否泄漏
        planId: '', // 检测计划
        size: 10 // 每页显示条数
      },
      list: [], // 表格列表
      multipleSelection: [], // 选中数据
      listLoading: false, // 控制loading效果
      total: 0, //列表总条数
      tOrgsByLevel: {
        // 获取装置
        // 获取当前组织下的装置参数
        orgId: '', // 当前组织企业Id
        level: '' //组织级别
      },
      selectId: '', // 当前组织企业Id
      orgCode: '' // 装置
    }
  },
  created() {
    let userOnly = 'USERSC' + sessionStorage.getItem('userName')
    this.selectId = sessionStorage.getItem(userOnly)
    this.tOrgsByLevel.orgId = sessionStorage.getItem(userOnly) // 用于获取组织下的装置
    this.listQuery.orgId = sessionStorage.getItem(userOnly) // 用于获取当前组织的所有数据列表
    console.log(this.listQuery)
    this.getDict('point_type') // 获取密封点类型
    this.getDict('phase_behavior') // 获取相态
    this.getOrgsByLevelList() // 获取装置
    this.getDetactionPlanListData() // 获取检测计划
    this.getList() // 获取检测计划

    let that = this
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', val => {
      // 切换组织
      if (val !== '') {
        let userOnly = 'USERSC' + sessionStorage.getItem('userName')
        this.selectId = sessionStorage.getItem(userOnly)
        this.tOrgsByLevel.orgId = sessionStorage.getItem(userOnly)
        this.listQuery = {
          current: 1, // 当前页
          orgId: sessionStorage.getItem(userOnly), // 当前组织Id
          start: new Date().format('yyyy-MM-dd'), // 开始时间
          end: new Date().format('yyyy-MM-dd'), // 结束时间
          groupCode: '', // 群组编码
          extendCode: '', // 扩展编码
          type: '', // 密封点类型
          phase: '', // 相态
          isReach: '', // 是否可达
          materialsInfo: '', // 物料信息
          status: '', // 是否泄漏
          planId: '', // 检测计划
          size: 10 // 每页显示条数
        }
        console.log(this.listQuery)
        this.orgCode = '' // 装置
        this.getOrgsByLevelList() // 获取装置
        this.getDetactionPlanListData() // 获取检测计划
        this.getList() // 获取检测计划
      }
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true // loading
      org.getSarchManage(this.listQuery).then(res => {
        if (res.status == 1) {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }
      })
    },
    // 获取当前组织下的 装置 数据
    getOrgsByLevelList() {
      org.getOrgsByLevel(this.tOrgsByLevel).then(res => {
        if (res.status == 1) {
          this.deviceList = res.data
        }
      })
    },
    // 获取当前组织 下的检测计划
    getDetactionPlanListData() {
      detection.getDetactionPlanList(this.selectId).then(res => {
        if (res.status == 1) {
          this.planList = res.data
        }
      })
    },
    // 初始化获取密封点类型  获取相态
    getDict(code) {
      let dictInfo = []
      system.dictGetDict(code).then(res => {
        if (res.status == 1) {
          dictInfo = res.data
          switch (code) {
            case 'point_type': //  密封点类型
              this.sealType = dictInfo
              break
            case 'phase_behavior': // 相态
              this.phaseState = dictInfo
              break
            default:
          }
        }
      })
      return dictInfo
    },
    // table 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //分页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    // 查询按钮
    searchGetList() {
      if (this.orgCode) {
        this.listQuery.orgId = this.orgCode
      }

      this.getList()
    },
    // 导出按钮
    downloadFile(val) {
      let parames = [
        // { key: 'start', value: this.listQuery.start },
        // { key: 'end', value: this.listQuery.end },
        { key: 'planId', value: this.listQuery.planId },
        { key: 'orgId', value: this.listQuery.orgId },
        { key: 'orgCode', value: this.listQuery.orgCode },
        { key: 'groupCode', value: this.listQuery.groupCode },
        { key: 'extendCode', value: this.listQuery.extendCode },
        { key: 'type', value: this.listQuery.type },
        { key: 'phase', value: this.listQuery.phase },
        { key: 'isReach', value: this.listQuery.isReach },
        { key: 'status', value: this.listQuery.status },
        { key: 'materialsInfo', value: this.listQuery.materialsInfo }
      ]
      let base = baseUrl()
      let url = base + '/statistics/searchExport'
      xiaZai(url, parames, 1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.chaxun {
  .el-form-item__error {
    left: 0 !important;
  }
  .el-date-editor.el-input {
    width: 200px;
  }
  .el-form--inline.search_top.this_Dtask .el-form-item {
    .el-form-item__content {
      width: 200px;
    }
  }
  .searchData {
    .el-form-item__content {
      width: 200px;
      height: 40px;
    }
  }
  .bxSearch {
    position: relative;
    color: red;
    top: -46px;
    left: -90px;
  }
  .materialsInfoC {
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .remarks {
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
