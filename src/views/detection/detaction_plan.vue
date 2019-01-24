<template>
  <div class="app-container thisDtask detactionDtataPlan">
    <el-container>
      <el-main>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" class="search_top this_Dtask">
            <el-form-item label="检测计划名称:">
              <el-input placeholder="计划名称" v-model="listQuery.name"></el-input>
            </el-form-item>

            <el-form-item label="开始日期:">
              <el-date-picker v-model="listQuery.startTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期:">
              <el-date-picker v-model="listQuery.endTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="企业:">
              <el-input v-model="selectCompanyName" v-on:click.native="companySelect" placeholder="请选择企业" readonly>
              </el-input>
            </el-form-item>
            <el-button style="float: right; margin-left: 30px" type="success" @click="dialogFormVisible = true" v-if="isType && listQuery.orgId">新增检测计划</el-button>
            <el-button style="float: right" type="success" @click="searchPlan">查询</el-button>
            <!-- </div> -->
          </el-form>
        </el-col>
        <!--列表-->
        <div class="el-col el-col-24" style="margin-top:10px;">
          <el-form :inline="false" class="table_do">
            <el-form-item>
              <el-button type="success" @click="dialogFormVisible = true" v-if="isAdd">新增任务</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="list" v-loading="listLoading" @selection-change="handleSelectionChange" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="计划名称">
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间">
              <template slot-scope="scope">
                <span>{{scope.row.startTime?scope.row.startTime.split(' ')[0]:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间">
              <template slot-scope="scope">
                <span>{{scope.row.endTime.split(' ')[0]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="notes" label="计划说明">
            </el-table-column>

            <el-table-column prop="taskNum" label="检测任务数量">
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime.split(' ')[0]}}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="creator" label="创建人">
            </el-table-column>
            <el-table-column prop="planStatus" label="检测状态">
            </el-table-column>
            <el-table-column prop="operation" label="操作 " width="150">
              <template slot-scope="scope">
                <i class="el-icon-tickets success btn" @click="info(scope.row.id)" title="编辑/详情"></i>
                <i class="el-icon-delete danger btn" @click="deleteIds(0,scope.row.id)" v-if="isType" title="删除"></i>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleSizeChange" :total="total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </div>
      </el-main>
    </el-container>

    <!--检测计划详情-->
    <el-dialog class="s_o_c add_dia add my_plan_container" title="检测计划" :visible.sync="dialogFormVisible" width="500px">
      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-form :model="addEdit" ref="addEdit" :rules="rules" class="dialog-add" label-width="150px" :inline="true">
          <el-form-item prop="name" label="检测计划名称：">
            <el-input v-model="addEdit.name"></el-input>
          </el-form-item>
          <el-form-item prop="startTime" label="开始检测时间：">
            <el-date-picker v-model="addEdit.startTime" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="结束检测时间：">
            <el-date-picker v-model="addEdit.endTime" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
           <!-- <el-form-item prop="endTime" label="功能">
            <el-date-picker v-model="addEdit.endTime" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="检测状态：">
            <el-select v-model="addEdit.planStatus" placeholder="请选择">
              <el-option label="新建" value="新建">
              </el-option>
              <el-option label="开始" value="开始">
              </el-option>
              <el-option label="完成" value="完成">
              </el-option>
            </el-select>
          </el-form-item>
             <el-form-item prop="timelong" label="工作时长：">
            <el-input v-model="addEdit.timelong" type="number"></el-input>
          </el-form-item>
          <el-form-item prop="notes" label="说明：">
            <el-input type="textarea" v-model="addEdit.notes"></el-input>
          </el-form-item>

          <el-form-item class="t_a">
            <el-button type="success" @click="checkAddTask('addEdit')" v-if="isType">确定</el-button>
          </el-form-item>
        </el-form>
      </el-tabs>
    </el-dialog>

    <companyDialog @selectHandle="sureSwitch" :dialogData="companySelectData">
    </companyDialog>
  </div>

</template>

<script>
import detection from '@/api/detection'
import system from '@/api/system'
import org from '@/api/standing'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import addPoint from '@/components/Addpoint/index'
import fourPoint from '@/components/Addpoint/pointFour'
import maintain from '@/api/maintain'
import { type } from '@/utils/setFormType'
import companyDialog from '@/components/Dialog/chooseDialog'

export default {
  components: { addPoint, fourPoint, companyDialog },

  watch: {
    dialogFormVisible: function(n, o) {
      if (!n) {
        this.addEdit = {
          createTime: '', //创建时间
          creator: '', //创建人
          endTime: '', //结束时间
          id: '',
          modifiedTime: '',
          name: '', //计划名称
          orgId: '', //所属组织
          startTime: '', //开始时间
          notes: '', //说明
          taskNum: '',
          timelong:'',
          planStatus: '新建'
        }
        this.isClick = true
        this.activeName = 'first'
        //重置表单
        this.resetForm('addEdit')
      }
    },
    dialogPicVisible: function(n, o) {
      if (!n) {
        this.totalPic = 0
        this.listPic = []
      }
    },
    // watch vm.e.f's value: {g: 5}
    'addEdit.equipId': function(newVal) {
      if (newVal == 2) {
        this.acceptType = 'text/plain'
      } else {
        this.acceptType = 'text/csv'
      }
    }
  },
  data() {
    return {
      acceptType: 'text/csv',
      totalPoint: 0,
      sendPics: {
        imageIds: '',
        taskId: ''
      },
      selectCompanyName: '',
      companySelectData: {
        dialogVisible: false,
        selectTreeData: {},
        orgId: '',
        treeName: '',
        level: '3'
      },
      chooseList: [], //图档多选id
      picArr: [],
      acName: '0',
      isClick: true,
      list: null,
      listLoading: false,
      listQuery: {
        current: 1,
        name: '',
        orgId: '',
        startTime: '',
        endTime: '',
        current: 1,
        size: 10
      },
      total: 0,
      listQueryPic: {
        orgId: '',
        code: '',
        current: 1
      },
      listPic: null,
      listLoadingPic: false,
      totalPic: 0,
      equipOptions: [],
      addEdit: {
        createTime: '', //创建时间
        creator: '', //创建人
        endTime: '', //结束时间
        id: '',
        modifiedTime: '',
        name: '', //计划名称
        orgId: '', //所属组织
        startTime: '', //开始时间
        notes: '', //说明
        timelong: '', //说明
        taskNum: '',
        planStatus: '新建'
      },
      multipleSelection: [],
      activeName: 'first',
      dialogFormVisible: false,
      dialogPicVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      radio: '1',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      value: '',
      value6: '',
      existIds: [],
      pointListByOrt: [],
      pointListByOrtPic: [],
      isType: false,
      listQueryPicLink: {
        taskId: ''
      },
      taskPointPage: {
        imageId: '', //图档id
        oId: '', //检测任务id
        type: 0,
        current: 1
      },
      isAdd: false,
      picDeletes: [],
      pointDeletes: [],
      rules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        checkMan: [
          { required: false, message: '请输入检测人员', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择检测开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择检测结束时间', trigger: 'change' }
        ],
        notes: [{ required: false, message: '请输入备注', trigger: 'blur' }],
      }
    }
  },
  created() {
    //需要传用户选中的id
    let userOnly = 'USERSC' + sessionStorage.getItem('userName')
    let selectId = sessionStorage.getItem(userOnly)
    let selectCompanyKey = 'USERSCNAME' + sessionStorage.getItem('userName')
    var selectCompanyNameArry = sessionStorage
      .getItem(selectCompanyKey)
      .split('/')
    var selectCompanyNameLength = selectCompanyNameArry.length - 1
    this.selectCompanyName = selectCompanyNameArry[selectCompanyNameLength]
    this.companySelectData.orgId = selectId

    this.switchCompanyFinish(selectId)
    this.getDict('equipment')
    this.isType = this.$route.query.type != 1

    let that = this
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', val => {
      if (val !== '') {
        let selectCompanyKey = 'USERSCNAME' + sessionStorage.getItem('userName')
        var selectCompanyNameArry = sessionStorage
          .getItem(selectCompanyKey)
          .split('/')
        var selectCompanyNameLength = selectCompanyNameArry.length - 1
        this.selectCompanyName = selectCompanyNameArry[selectCompanyNameLength]
        that.switchCompanyFinish(val)
        that.companySelectData.orgId = val
      }
    })
  },
  methods: {
    //时间判断
    check(startTime, endTime) {
      var startTime = new Date(startTime).getTime()
      var endTime = new Date(endTime).getTime()
      if (startTime && endTime) {
        if (startTime > endTime) {
          this.$message.error('检测开始时间不能大于检测结束时间')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    //企业选择
    companySelect() {
      this.companySelectData.dialogVisible = true
    },
    sureSwitch(val) {
      this.selectCompanyName = this.companySelectData.treeName
      this.switchCompanyFinish(val)
    },
    switchCompanyFinish(val) {
      this.listQuery.orgId = val
      this.getList()
      this.getTree(val)
    },
    //获取列表
    getList() {
      this.listLoading = true
      console.log(this.listQuery,'listQuerylistQuerylistQuerylistQuery')
      detection.searchPlan(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    //查询数据
    searchPlan() {
      var isT = this.check(this.listQuery.startTime, this.listQuery.endTime)
      if (isT) {
        detection.searchPlan(this.listQuery).then(res => {
          this.list = res.data.records
        })
      }
    },
    //获取字典---检测设备
    getDict(id) {
      system.dictGetDict(id).then(res => {
        this.equipOptions = res.data
      })
    },
    checkAddTask(formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.addOrEdit()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //新增编辑
    addOrEdit() {
      this.addEdit.orgId = this.listQuery.orgId
      var isA = this.check(this.addEdit.startTime, this.addEdit.endTime)
      if (isA) {
        detection.addORupdateDetactionPlanList(this.addEdit).then(res => {
          this.isClick = false
          this.taskPointPage.type = this.addEdit.checkType
          this.taskPointPage.oId = res.data
          this.sendPics.taskId = res.data
          this.listQueryPicLink.taskId = res.data
          tip(res.msg)
          this.getList()
          this.dialogFormVisible = false
        })
      }
    },
    //详情
    info(id) {
      this.dialogFormVisible = true
      detection.getDetails(id).then(res => {
        this.addEdit = res.data
      })
    },
    //检测删除
    deleteIds(type, id) {
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          var arr = [],
            obj = {}
          if (type == 0) {
            arr.push(id)
          } else {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              arr.push(this.multipleSelection[i].id)
            }
          }
          obj.ids = arr.toString()
          detection.deleteId(obj).then(res => {
            tip(res.msg)
            this.getList()
          })
        })
        .catch(_ => {})
    },
    //点击树
    treeNodeClickPic(data) {
      this.listQueryPic.orgId = data.id
    },
    //table多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    //分页
    handleSizeChangePic(val) {
      this.listQueryPic.current = val
      this.getListPic()
    },
    //拿树
    getTree(levelId) {
      org.orgGetOrgTree(levelId).then(res => {
        this.treeData = res.data
      })
    },
    handleClick(tab, event) {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.detactionDtataPlan {
  .el-input__suffix {
    right: -35px;
  }
  .el-form-item__error {
    left: 0 !important;
  }
  .dialog-add .el-form-item__label {
    padding: 0 !important;
  }
  .my_plan_container .el-dialog__body {
    padding: 0 !important;
  }
  .pic_title {
    border: 1px solid #ebeef5;
    width: 90%;
    .pic_title_ti {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #0db29f;
      font-size: 16px;
      background-color: #f5fcf5;
      margin-bottom: 20px;
    }
  }
  .spe_success {
    background-color: #5daf34;
  }
  .table_do {
    text-align: right;
  }
  .el-form--inline.search_top.this_Dtask .el-form-item {
    .el-form-item__content {
      width: 200px;
    }
  }
  .el-dialog {
    width: 50%;
  }
  .add_dia {
    .el-form-item__content {
      box-sizing: border-box;
      margin-left: 18px !important;
    }
    .el-form-item__label {
      padding-left: 40px;
    }
    .el-input,
    .el-textarea {
      width: 85%;
    }
    .el-textarea {
      margin-left: 0;
    }
    .el-tree {
      padding-left: 60px;
    }
    &.add_point {
      .el-form-item__content {
        padding: 0 !important;
        margin: 0;
      }
      .el-form-item__label {
        padding-left: 0 !important;
      }
      .el-tree {
        padding-left: 0;
      }
    }
  }
  .dialog-add {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .filter-tree {
    height: calc(100% - 50px);
    padding: 20px;
    font-size: 14px;
  }
  .block {
    display: inline-block;
  }
  .block .el-range-separator {
    padding: 0;
  }
  .el-date-editor {
    width: 180px;
  }
  .el-form-item__content .jcTime {
    width: 400px;
  }
  .add_dia.add .el-form--inline .el-form-item .jcTime input {
    width: 168px;
  }
  .el-form-item textarea {
    width: 275px !important;
  }
  .add_dia.add .el-form--inline .el-form-item {
    width: 100%;
    margin-bottom: 16px;
  }
  .el-form-item__error {
    left: 22px;
  }
  .el-container {
    height: 96%;
  }
  .el-tree {
    height: 87%;
  }
  .el-aside {
    height: 100%;
  }
  .app-container {
    height: 100%;
  }

}
.el-message-box__btns {
  text-align: center;
}
.el-message-box__btns .el-button {
  padding: 12px 20px;
}
.el-message-box__btns .el-button:nth-child(2) {
  background-color: #03aaa2;
  border-color: #03aaa2;
}
</style>
