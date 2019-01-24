<template>
  <div class="app-container maintainGd">
    <div>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item label="工单名称:">
            <el-input v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="维修人员:">
            <el-input v-model="listQuery.user"></el-input>
          </el-form-item>
          <el-form-item label="企业:">
            <el-input v-model="selectCompanyName" v-on:click.native="companySelect" placeholder="请选择企业" readonly width='200px'>
            </el-input>
          </el-form-item>
          <el-button type="success" @click="getList">查询</el-button>
          <el-button type="danger" @click="deleteList(0)" v-if="isType" class="buttonRight">批量删除</el-button>
          <el-button type="primary" @click="exportPdf(0)" class="buttonRight">导出工单</el-button>
          <el-button type="success" class="buttonRight" @click="dialogFormVisible = true;maintainGdTitle = false;" v-if="isType">新建工单</el-button>
        </el-form>
      </el-col>
      <!--列表-->
      <div class="el-col el-col-24" style='margin-top:10px'>
        <!-- <el-form :inline="false" class="table_do">
          <el-form-item>
            <el-button type="success" @click="dialogFormVisible = true" v-if="isType">新建工单</el-button>
            <el-button type="primary" @click="exportPdf(0)">导出工单</el-button>
            <el-button type="danger" @click="deleteList(0)" v-if="isType">批量删除</el-button>
          </el-form-item>
        </el-form> -->
        <el-table :data="list" v-loading="listLoading" @selection-change="handleSelectionChange" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="name" label="工单名称">
          </el-table-column>
          <el-table-column prop="repairUser" label="维修人员">
          </el-table-column>
          <!-- <el-table-column prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime.split(' ')[0]}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="distributionTime" label="分配日期">
            <template slot-scope="scope">
              <span>{{scope.row.distributionTime.split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pointNum" label="密封点数">
          </el-table-column>
          <el-table-column prop="depayNum" label="延期维修点数">
          </el-table-column>
          <el-table-column prop="operation" label="操作 ">
            <template slot-scope="scope">
              <i class="el-icon-tickets success btn" title="编辑/详情" @click="getInfo(scope.row.id)"></i>
              <i class="el-icon-download primary btn" title="导出工单" @click="exportPdf(1,scope.row.id)"></i>
              <i class="el-icon-delete danger btn" @click="deleteList(1,scope.row.id)" title="删除" v-if="isType"></i>
              <!--v-if="isType"-->
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleSizeChange" :total="total" style="text-align:center;">
          </el-pagination>
        </el-col>
      </div>

      <!--新增维修工单-->
      <el-dialog class="s_o_c add_dia add wxgd" title="维修工单" :visible.sync="dialogFormVisible" :class="maintainGdTitle?'maintainGdDetail':'maintainGdadd'">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="first">

            <el-form :model="addInfo" ref="addInfo" :rules="rules" class="dialog-add" label-width="120px" :inline="true">
              <el-form-item prop="name" label="工单名称：">
                <el-input v-model="addInfo.name"></el-input>
              </el-form-item>
              <el-form-item prop="repairUser" label="维修人员：">
                <el-input v-model="addInfo.repairUser"></el-input>
              </el-form-item>
              <el-form-item prop="repairUser" label="维修方式">
                <el-input v-model="addInfo.repairWay"></el-input>
              </el-form-item>
              <el-form-item prop="distributionTime" label="分配时间：">
                <el-date-picker v-model="addInfo.distributionTime" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="contact" label="联系方式：">
                <el-input v-model="addInfo.contact"></el-input>
              </el-form-item>
              <el-form-item prop="notes" label="备注：" class="mark_textarea">
                <el-input type="textarea" v-model="addInfo.notes"></el-input>
              </el-form-item>
            </el-form>
            <el-form class="mb_20 t_a">
              <el-button type="success" @click="checkAddTask('addInfo')" v-if="isType">确定</el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="密封点信息" :disabled="isClick" name="second">
            <el-form class="mb_20">
              <el-button @click="addPointData.dialogAddVisible = true" icon="el-icon-plus" v-if="isType">新增密封点</el-button>
              <el-button icon="el-icon-check" @click="disposeBatch" v-if="isType">维修完成</el-button>
            </el-form>
            <el-table class="mb_20 relationPointsHeight" height="700" :data="relationPoints" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
              <el-table-column type="index" label="序号" width="70"></el-table-column>
              <el-table-column prop="typeName" label="类型" width="159px"></el-table-column>
              <el-table-column prop="groupCode" label="群组编号" width="160px"></el-table-column>
              <el-table-column prop="extendCode" label="扩展号" width="80px"></el-table-column>
              <el-table-column prop="phaseBehaviorName" label="相态" width="110px"></el-table-column>
              <el-table-column prop="pointStatus" label="状态" width="90px"></el-table-column>
              <el-table-column prop="reach" label="是否可达" width="80px">
                <template slot-scope="scope">
                  <span v-if="scope.row.reach == 1">是</span>
                  <span v-if="scope.row.reach == 0">否</span>
                </template>
              </el-table-column>
              <el-table-column prop="detectionValue" label="PPM" width="80px"></el-table-column>
              <el-table-column prop="orderStatus" label="工单状态" width="120px"></el-table-column>
              <el-table-column prop="operation" label="操作 " width="200">
                <template slot-scope="scope">
                  <i class="el-icon-tickets success btn" title="编辑/详情" @click="detailFour(scope.row.id,scope.row.imageFileId)"></i>
                  <i class="el-icon-time warning btn" title="延期维修" @click="delDelay(scope.row.id)" v-if="isType"></i>
                  <i class="el-icon-check primary btn" title="维修完成" @click="dispose(0,scope.row.id)" v-if="isType"></i>
                  <i class="el-icon-delete danger btn" @click="deleteRelation(scope.row.id)" title="删除" v-if="isType"></i>
                  <!--v-if="isType"-->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>

      <!--增加密封点-->
      <addPoint :addPointData="addPointData" class='wxgd' @sendIds="addPoint">
      </addPoint>
      <!--密封点详情-->
      <fourPoint :addPointData="pointData"></fourPoint>

      <!--延期工单-->
      <el-dialog class="s_o_c add_dia add date postponement " title="延期工单" :visible.sync="dialogTimeVisible" width="400px">
        <el-form label-width="120px" class="mb_20">
          <el-form-item label="延期时间：">
            <el-date-picker type="date" v-model="disposeDel.date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form class="mb_20 t_a">
          <el-button type="success" @click="dispose(1)" v-if="isType">确定</el-button>
        </el-form>
      </el-dialog>
    </div>
    <fileDialog @exportFile="downloadFile" :dialog="fileDialogData">
    </fileDialog>

    <companyDialog @selectHandle="sureSwitch" :dialogData="companySelectData">
    </companyDialog>
  </div>

</template>

<script>
import addPoint from '@/components/Addpoint/index'
import fourPoint from '@/components/Addpoint/pointFour'
import maintain from '@/api/maintain'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import { type } from '@/utils/setFormType'
import { validatTelephone } from '@/utils/validate'
import fileDialog from '@/components/Dialog/index'
import companyDialog from '@/components/Dialog/chooseDialog'

export default {
  components: { addPoint, fourPoint, fileDialog, companyDialog },
  watch: {
    dialogFormVisible: function(n, o) {
      if (!n) {
        this.isClick = true
        this.activeName = 'first'
        this.addInfo = {
          contact: '',
          id: '',
          name: '',
          notes: '',
          repairUser: '',
          distributionTime: '',
          repairWay: '' // 维修方式
        }
        this.getRelationPoint = {
          orderId: ''
        }
        this.relationPoints = []
        this.resetForm('addInfo')
      }
    }
  },
  data() {
    return {
      maintainGdTitle: false,
      downParames: [],
      fileDialogData: {
        dialogVisible: false,
        fileName: ''
      },
      pointData: {
        dialogFormVisible: false,
        dia_titile: '密封点',
        id: '',
        imgId: ''
      },
      isType: false,
      list: null,
      total: 0,
      listLoading: true,
      selectCompanyName: '',
      companySelectData: {
        dialogVisible: false,
        selectTreeData: {},
        orgId: '',
        treeName: '',
        level: '3'
      },
      listQuery: {
        current: 1,
        user: '',
        name: '',
        orgId: ''
      },
      multipleSelection: [],
      addInfo: {
        contact: '',
        id: '',
        name: '',
        notes: '',
        repairUser: '', // 维修人员
        repairWay: '', // 维修方式
        distributionTime: ''
      },
      addRule: {},
      activeName: 'first',
      getRelationPoint: {
        orderId: ''
      },
      relationPoints: [],
      isClick: true,
      addPointData: {
        title: '维修工单--新增密封点',
        dialogAddVisible: false,
        isMaintain: true,
        treeId: ''
      },
      dialogFormVisible: false,
      dialogTimeVisible: false,
      disposeDel: {
        pointId: '',
        type: '',
        date: '',
        orderId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入工单名称', trigger: 'blur' }],
        repairUser: [
          { required: false, message: '请输入维修人员', trigger: 'blur' }
        ],
        distributionTime: [
          { required: true, message: '请选择分配时间', trigger: 'change' }
        ],
        contact: [
          { required: false, message: '请填写联系方式', trigger: 'change' },
          {
            required: false,
            message: ' 联系电话输入有误！',
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
          }
        ],
        notes: [{ required: false, message: '请输入备注', trigger: 'blur' }]
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

    this.switchCompanyFinish(selectId)

    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }

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
      }
    })
  },
  methods: {
    switchCompanyFinish(val) {
      this.listQuery.orgId = val
      this.companySelectData.orgId = val
      this.addPointData.treeId = val
      this.getList()
    },
    sureSwitch(val) {
      this.selectCompanyName = this.companySelectData.treeName
      this.switchCompanyFinish(val)
    },
    //企业选择
    companySelect() {
      this.companySelectData.dialogVisible = true
    },
    //导出工单
    exportPdf(type, id) {
      let arr = [],
        ids = ''
      if (type == 0) {
        if (this.multipleSelection.length == 0) {
          return tip('请先选择需要导出的数据！', 'error')
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          arr.push(this.multipleSelection[i].id)
        }
      } else {
        arr.push(id)
      }
      this.downParames = arr
      this.fileDialogData.dialogVisible = true
    },
    downloadFile(val) {
      let parames = [
        { key: 'ids', value: this.downParames },
        { key: 'fileName', value: val }
      ]
      let base = baseUrl()
      let url = base + '/exportOrderPDF'
      xiaZai(url, parames)
    },
    //获取列表
    getList() {
      this.listLoading = true
      maintain.repairOrderList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    //table多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //删除列表
    deleteList(type, id) {
      let arr = [],
        obj = {}
      if (type == 0) {
        if (this.multipleSelection.length == 0) {
          return tip('请先选择需要删除的数据！', 'error')
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          arr.push(this.multipleSelection[i].id)
        }
        obj.ids = arr.join(',')
      } else {
        obj.ids = id
      }
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          maintain.deleteBatchId(obj).then(res => {
            tip(res.msg)
            this.getList()
          })
        })
        .catch(_ => {})
    },
    //批量处理工单
    disposeBatch() {
      maintain.disposeBatch(this.getRelationPoint.orderId).then(res => {
        tip(res.msg)
        this.getPoints()
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
    //维修工单列表新增或编辑
    addOrEdit() {
      this.addInfo.departmentId = this.listQuery.orgId
      maintain.addOrEdit(this.addInfo).then(res => {
        tip(res.msg)
        this.dialogFormVisible = false
        this.isClick = false
        this.getRelationPoint.orderId = res.data
        this.disposeDel.orderId = res.data
        this.getPoints()
        this.getList()
      })
    },
    //获取工单关联密封点
    getPoints() {
      maintain.getPoints(this.getRelationPoint).then(res => {
        this.relationPoints = res.data
      })
    },
    //新增密封点关系
    addPoint(val) {
      let obj = {
        pointIds: val.data.pointIds,
        orderId: this.getRelationPoint.orderId
      }
      maintain.addPoint(obj).then(res => {
        this.getList()
        this.getPoints()
      })
    },
    //延期工单弹窗
    delDelay(id) {
      this.disposeDel.date = ''
      this.disposeDel.pointId = id
      this.dialogTimeVisible = true
    },
    //处理工单
    dispose(type, id) {
      var that = this
      this.disposeDel.type = type
      if (id) {
        this.disposeDel.pointId = id
        this.disposeDel.date = ''
      }
      if (type == 1 && (!this.disposeDel.date || this.disposeDel.date == '')) {
        return tip('请选择延期时间', 'warning')
      }
      maintain.dispose(this.disposeDel).then(res => {
        tip(res.msg)
        that.getPoints()
        if (type == 1) {
          that.dialogTimeVisible = false
          // 刷新页面
          // that
        }
        that.getList()
      })
    },
    //密封点详情弹窗
    detailFour(id, imgId) {
      this.pointData.dialogFormVisible = true
      this.pointData.imgId = imgId
      this.pointData.id = id
    },
    //工单详情
    getInfo(id) {
      this.maintainGdTitle = true
      maintain.info(id).then(res => {
        this.addInfo = res.data
        this.dialogFormVisible = true
        this.getRelationPoint.orderId = id
        this.disposeDel.orderId = id
        this.isClick = false
        this.getPoints()
      })
    },
    //删除关系密封点
    deleteRelation(id) {
      let obj = {
        pointIds: id,
        orderId: this.getRelationPoint.orderId
      }
      maintain.deleteRelation(obj).then(res => {
        if (res.data) {
          tip(res.data, 'error')
        } else {
          tip(res.msg)
        }
        this.getPoints()
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.maintainGd {
  .buttonRight {
    float: right;
  }
  padding: 0 20px;
  .relationPointsHeight {
    .el-table__body-wrapper {
      height: 644px !important;
    }
  }
  .postponement {
    .el-dialog {
      .el-dialog__body {
        padding: 20px 0 !important;
      }
    }
    .my-file-dialog .el-dialog__body {
      padding: 30px 20px !important;
    }
    .mb_20 {
      margin-bottom: 0;
    }
    .el-form-item {
      margin-bottom: 40px;
      margin-top: 20px;
    }
  }
  .maintainGdadd .el-dialog {
    width: 484px;
    .el-form-item {
      width: 90% !important;
    }
    .el-textarea {
      min-width: 275px !important;
    }
  }
  .maintainGdDetail .el-dialog {
    margin-top: 3vh !important;
    width: 1200px;
    .el-textarea {
      min-width: 750px !important;
    }
  }

  .wxgd .el-dialog__body {
    padding: 0 20px !important;
  }
  .table_do {
    text-align: right;
  }
  .el-dialog {
    width: 50%;
  }
  .add_dia {
    .el-form-item__content {
      box-sizing: border-box;
      > div {
        margin-left: 0;
      }
    }
    .el-input,
    .el-textarea {
      width: 85%;
    }
    .el-textarea {
      margin-left: 8px;
    }
    .el-tree {
      padding-left: 60px;
    }
    &.date {
      .el-input,
      .el-textarea {
        width: 88%;
      }
    }
    &.add_point {
      .el-form-item__content {
        padding: 0 !important;
        margin: 0;
      }
      .el-form-item__label {
        padding: 0 !important;
      }
      .el-tree {
        padding-left: 0;
      }
    }
    .dialog-add {
      .el-form-item {
        margin-bottom: 18px;
      }
    }
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
