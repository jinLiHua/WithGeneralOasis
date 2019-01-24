<template>
  <div v-loading="listLoading" class="s_o_c my_org_main standing_orgC">
    <el-container>

      <el-aside width="350px">
        <div class="tree_head">组织台账管理</div>
        <el-tree class="filter-tree" @node-click="treeNodeClick" :data="treeData" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
        </el-tree>
      </el-aside>

      <el-main>
        <el-breadcrumb separator="--" v-if="bread.length>0">
          <span class="bread_text">
            <i class="el-icon-location"></i> 当前组织：</span>
          <el-breadcrumb-item v-for="item in bread" style="float:none" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form ref="form" label-width="120px" style="margin-top: 20px;padding-right: 15px">
          <el-form-item label="组织名称：">
            <el-input v-model="add.name"></el-input>
          </el-form-item>
          <el-form-item label="组织描述：">
            <el-input type="textarea" v-model="add.details"></el-input>
          </el-form-item>

          <el-form-item label="组织类型：">
            <el-select v-model="add.orgType" style="width: 100%" placeholder="请选择组织类型">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.option" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="add.orgType == 4" label="装置类型：">
            <el-radio-group v-model="add.equipType">
              <el-radio label="0">石油炼制</el-radio>
              <el-radio label="1">石油化工</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="sureAdd()" style="border-color: transparent;" v-if="isType">确定</el-button>
            <el-button type="success" @click="dialogFormVisible = true" style="background-color: #00aaff; border-color: transparent;" v-if="isType && showDeleteButton">增加子组织</el-button>
            <el-button type="danger" @click="deleteOrg(add.id)" v-if="isType && showDeleteButton">删除</el-button>

          </el-form-item>

          <!--设备信息-->
          <div class="main-setting-container" v-if="add.orgType == 4 && add.id && bread.length>0">
            <div class="section-header-container">
              <label class="setting-section-label" style="color:#000">装置数据设置</label>
            </div>

            <div class="setting-tab-container">
              <el-radio-group text-color="#FFFFFF" fill="#03938B" v-model="tabPosition" @change="handleTabSelect" style="width:100%">
                <el-radio-button :label="0" size="large">阈值设置</el-radio-button>
                <!-- <el-radio-button :label="1" size="large" class="yearTime">年工作时间设置</el-radio-button> -->
                <el-button style="float:right;margin-right:20px;" v-if="tabPosition == '0' && isType" type="success" @click="addhreshold()">保存</el-button>
                <el-button style="float:right;margin-right:20px;" v-if="tabPosition == '1' && isType" type="success" @click="handleWorkTimeClick()">新增</el-button>
              </el-radio-group>
            </div>

            <!--阀值设置-->
            <div v-if="tabPosition == '0'" style="padding: 10px">
              <div>
                <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%;margin-top: 10px">
                  <el-table-column prop="number" label="序号" width="150">
                  </el-table-column>
                  <el-table-column prop="typeName" label="密封点类型">
                  </el-table-column>

                  <el-table-column prop="phaseName" label="相态">
                  </el-table-column>

                  <el-table-column label="阈值" width="150">
                    <template slot-scope="scope">
                      <el-input :disabled="!isType" v-model="scope.row.value" v-on:change="inputChange(scope.row)" placeholder="请输入阀值">

                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 年工作时间设置 -->
            <!-- <div v-if="tabPosition == '1'" style="padding: 10px">
              <el-table :data="workTimeData" border style="width: 100%;margin-top: 10px">
                <el-table-column type="index" label="序号" width="150">
                </el-table-column>
                <el-table-column prop="timeYear" label="年">
                </el-table-column>

                <el-table-column prop="timelong" label="工作时间（小时）">
                </el-table-column>

                <el-table-column prop="dayTimelong" label="每天平均工作时间（小时）">
                </el-table-column>

                <el-table-column label="操作" width="150" v-if="isType">
                  <template slot-scope="scope">
                    <i class="el-icon-tickets success btn" @click="handleWorkTimeClick(scope.row)" title="编辑/详情"></i>
                    <i class="el-icon-delete danger btn" @click="deleteWorkTime(scope.row.id)" v-if="isType" title="删除"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div> -->
          </div>

        </el-form>
      </el-main>

    </el-container>

    <!--增加设备工作时间-->
    <el-dialog title="年工作时间" width="600px" :visible.sync="dialogTimeVisible" class="yearWorkTime">
      <el-form :rules="timeRules" ref="rowTimeData" :model="rowTimeData" style="padding-top: 10px" label-width="170px">
        <el-form-item label="年份：" prop="timeYear">
          <el-input v-model="rowTimeData.timeYear"></el-input>
        </el-form-item>
        <el-form-item style="padding-top: 10px" label="工作时间（小时）：" prop="timelong">
          <el-input v-model="rowTimeData.timelong"></el-input>
        </el-form-item>
        <div class="t_a" style="padding-top: 30px">
          <el-button type="success" @click="addWormTimeValidation" v-if="isType">确定
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--增加组织dialog -->
    <el-dialog class="s_o_c breadt_a addSubtissue" width="585px" :title="dia_titile" :visible.sync="dialogFormVisible">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="t_a" style="margin-bottom: 10px">
        <el-breadcrumb-item v-for="item in bread" :key="item">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!--弹框-->
      <el-form label-width="120px">
        <el-form-item label="组织名称：">
          <el-input v-model="addC.name"></el-input>
        </el-form-item>
        <el-form-item label="组织描述：">
          <el-input type="textarea" v-model="addC.details"></el-input>
        </el-form-item>

        <el-form-item label="组织类型：">
          <el-select v-model="addC.orgType" style="width: 100%" placeholder="请选择组织类型">
            <el-option v-for="item in orgOptions" :key="item.value" :label="item.option" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="addC.orgType == 4" label="装置类型：">
          <el-radio-group v-model="addC.equipType">
            <el-radio label="0">石油炼制</el-radio>
            <el-radio label="1">石油化工</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="t_a">
          <el-button type="success" @click="sureAddC()" v-if="isType">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>

</template>



<script>
import org from '@/api/standing'
import { tip } from '@/utils/tip'
import { type } from '@/utils/setFormType'
import data from '../svg-icon/generateIconsView'
import { deleteTip } from '@/utils/tip'

export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    },
    dialogTimeVisible(val) {
      if (!val) {
        this.rowTimeData.timeYear = ''
        this.rowTimeData.timelong = ''
        this.rowTimeData.id = ''
        this.$refs['rowTimeData'].resetFields()
      }
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    sureAdd() {
      if (!this.add.name || !this.add.details || this.add.orgType === '')
        return tip('填写不完整！', 'error')
      //判断是否已经存在本id 已经存在的则直接更新
      if (this.add.id) {
        this.updateOrgData(this.add)
      } else {
        this.addOrg(this.add)
      }
    },
    addhreshold() {
      if (!this.add.name || !this.add.details || this.add.orgType === '')
        return tip('填写不完整！', 'error')
      //更新的时候需要添加对应的阀值哦
      var thresholdList = []
      this.tableData.forEach(function(element) {
        thresholdList.push({ id: element.id, value: parseInt(element.value) })
      })
      this.add.thresholdList = thresholdList
      this.listLoading = true
      let that = this
      org.orgUpdate(this.add).then(response => {
        tip(response.msg)
        that.listLoading = false
      })
    },
    sureAddC() {
      if (!this.addC.name || !this.addC.details || this.addC.orgType === '') {
        return tip('填写不完整！', 'error')
      }
      this.addC.parentId = this.add.id
      this.addOrg(this.addC)
      this.dialogFormVisible = false
    },

    addOrg(addData) {
      org.orgAdd(addData).then(response => {
        tip(response.msg)
        addData.name = ''
        addData.details = ''
        addData.orgType = ''
        addData.equipType = '0'
        this.getTree()
      })
    },
    updateOrg: function(addData) {
      org.orgUpdate(addData).then(response => {
        tip(response.msg)
        this.initDefaultObject(this.add)
        this.add.equipType = '0'
        this.getTree()
      })
    },
    deleteOrg(id) {
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          org.orgDelete(id).then(response => {
            tip(response.msg)
            this.initDefaultObject(this.add)
            this.add.equipType = '0'
            this.getTree()
          })
        })
        .catch(_ => {})
    },
    getTree(type) {
      //需要传用户选中的id
      let userOnly = 'USERSC' + sessionStorage.getItem('userName')
      let selectId = sessionStorage.getItem(userOnly)
      let parame = { selectedOrgId: selectId } // 当前切换企业的最上级Id
      org.orgGetOrgTree(parame).then(res => {
        if (type == 'first' && selectId != 0) {
          if (res.data.length > 0) {
            res.data.map(item => {
              if (selectId == item.id) {
                this.add = {
                  name: item.name, //本级企业名称
                  id: item.id, // 本级企业id
                  details: item.details,
                  parentId: item.parentId, //父级的id
                  orgType: item.orgType, //* 组织类型（ 0园区 1企业 2工厂 3车间  4装置  5区域等）
                  equipType: item.equipType, //* 装置类型（  0是有炼制 1是有化工）
                  thresholdList: item.thresholdList //阀值数组[{id: value:}]
                }
              }
            })
          }
        }
        this.treeData = res.data
        this.bread = []
        this.treeDataA = []
        let curTree = this.getTreeA(this.treeData)
        for (let i = 0; i < curTree.length; i++) {
          for (let j = 0; j < curTree[i].length; j++) {
            this.treeDataA.push(curTree[i][j])
          }
        }
        var r = []
        for (var i = 0, l = this.treeDataA.length; i < l; i++) {
          for (var j = i + 1; j < l; j++)
            if (this.treeDataA[i].id == this.treeDataA[j].id) j = ++i
          r.push(this.treeDataA[i])
        }
        this.treeDataA = r
      })
    },
    treeNodeClick(data) {
      this.add.name = data.name
      this.add.details = data.details
      this.add.parentId = data.parentId
      this.add.id = data.id
      this.add.orgType = data.orgType
      this.showDeleteButton = data.id !== 0
      this.rowTimeData.orgId = data.id
      if (data.equipType !== null) {
        this.add.equipType = data.equipType.toString()
      } else {
        this.add.equipType = '0'
      }
      this.bread = []
      this.getBreadA(data.id)
      this.bread.reverse()
      this.getThresholdData(data.id)
      this.getWorkTimeData(data.id)
    },
    clearTreeNodeClick() {
      this.add = {}
      this.bread = []
      this.rowTimeData.orgId = ''
    },
    getTreeA(tree, path, currentPath) {
      var currentPath = currentPath || []
      var path = path || []

      for (let i = 0; i < tree.length; i++) {
        var tmpTree = tree[i]
        if (i !== 0) currentPath.pop()

        currentPath.push({
          name: tmpTree.name,
          id: tmpTree.id,
          parentId: tmpTree.parentId
        })
        if (tmpTree.children.length) {
          this.getTreeA(tmpTree.children, path, currentPath)
        } else {
          path.push(currentPath.slice(0))
        }
      }
      currentPath.pop()
      return path
    },
    getBreadA(id) {
      var _t = this
      _t.treeDataA.forEach(function(e) {
        if (e.orgType != 4) e.equipType = 0
        if (e.id == id) {
          _t.bread.push(e.name)
          if (e.parentId) {
            _t.getBreadA(e.parentId)
          }
        }
      })
    },
    inputChange(item) {
      item.value = isNaN(parseInt(item.value)) ? '' : parseInt(item.value)
    },
    updateOrgData(data) {
      //更新的时候需要添加对应的阀值哦
      var thresholdList = []
      this.tableData.forEach(function(element) {
        thresholdList.push({ id: element.id, value: parseInt(element.value) })
      })
      data.thresholdList = thresholdList
      this.updateOrg(data)
    },

    //请求阀值的数据哦
    getThresholdData(orgId) {
      org.getTSList(orgId).then(response => {
        var data = response.data
        data.forEach(function(element, index) {
          element.number = index + 1
        })
        this.tableData = data
      })
    },
    getWorkTimeData(val) {
      org.getWorkTimeList(val).then(response => {
        this.workTimeData = response.data
      })
    },

    //      合并单元格方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    //初始化数据
    initDefaultObject: function(obj) {
      for (let [k, v] of Object.entries(obj)) {
        if (v != null && v.constructor == Array) {
          this.add[k] = []
        } else {
          this.add[k] = ''
        }
      }
    },
    //detail click
    handleWorkTimeClick(ele) {
      //add
      this.dialogTimeVisible = true
      //detail
      if (ele != undefined) {
        this.rowTimeData.timeYear = ele.timeYear
        this.rowTimeData.timelong = ele.timelong
        this.rowTimeData.id = ele.id
        this.btnType = ''
      }else{
        this.btnType = 'add'
      }
    },
    handleTabSelect(key) {
      if (key === 0) {
        this.getThresholdData(this.add.id)
      } else {
        this.getWorkTimeData(this.add.id)
      }
    },

    //年工作时间
    ///添加
    addWormTimeValidation() {
      this.$refs['rowTimeData'].validate(valid => {
        if (valid) {
          this.sureAddWorkTime()
        } else {
          return false
        }
      })
    },

    sureAddWorkTime(type) {
      let addTime = this.rowTimeData
      var timelong = true
      var timeNum = 1
      if (this.workTimeData.length > 0 && this.btnType == 'add') {
        if (addTime.timelong > 8784) {
          timelong = false
          return tip('工作时长不能超过一年总时长！', 'error')
        }
        if (this.workTimeData.length > 0) {
          this.workTimeData.map(item => {
            if (item.timeYear == addTime.timeYear) {
              timeNum = 0
              return tip('同年份不能重复添加！', 'error')
            }
          })
        } else {
          timeYear = true
        }
      }

      if (timelong && timeNum != 0) {
        let that = this
        this.listLoading = true
        org
          .editWorkTime(addTime)
          .then(_ => {
            that.listLoading = false
            that.dialogTimeVisible = false
            that.getWorkTimeData(this.add.id)
          })
          .catch(err => {
            that.listLoading = false
          })
      }
    },

    ///删除
    deleteWorkTime(value) {
      let deleteIds = { ids: value }
      let that = this

      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          org.deleteWTime(deleteIds).then(_ => {
            that.getWorkTimeData(this.add.id)
            // func()
          })
        })
        .catch(_ => {})
    }
  },

  data() {
    return {
      isType: true,
      showDeleteButton: false,
      filterText: '',
      listLoading: false,
      dialogFormVisible: false,
      dialogTimeVisible: false,
      workTimeData: [],
      rowTimeData: {
        timeYear: '',
        timelong: '',
        orgId: '',
        id: ''
      },
      //时间限制
      timeRules: {
        timeYear: [
          { required: true, message: '请输入年份', trigger: 'blur' },
          { required: true, message: '只能输入4位数字', pattern: /^\d{4}$/ }
          //            { min: 1, max: 4, message: '只能 1 到 4 位数字', trigger: 'blur',}
        ],
        timelong: [
          { required: true, message: '请输入工作时间', trigger: 'blur' },
          { required: true, message: '只能输入数字', pattern: /^[0-9]*$/ }
        ]
      },
      tabPosition: '0',
      dia_titile: '新增子组织',
      orgOptions: [
        {
          option: '园区',
          value: 0
        },
        {
          option: '企业',
          value: 1
        },
        {
          option: '工厂',
          value: 2
        },
        // {
        //   option: '车间',
        //   value: 3
        // },
        {
          option: '装置',
          value: 4
        },
        {
          option: '区域',
          value: 5
        }
      ],
      tableData: [],
      add: {
        name: '',
        id: '', //本级的id
        details: '',
        parentId: '', //父级的id
        orgType: '', //* 组织类型（ 0园区 1企业 2工厂 3车间  4装置  5区域等）
        equipType: '0', //* 装置类型（  0是有炼制 1是有化工）
        thresholdList: [] //阀值数组[{id: value:}]
      },
      addC: {
        name: '',
        details: '',
        parentId: '',
        orgType: '', //* 组织类型（ 0园区 1企业 2工厂 3车间  4装置  5设备等）
        equipType: '0' //* 装置类型（  0是有炼制 1是有化工）
      },
      bread: [],
      treeData: [],
      treeDataA: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      btnType:''  // 新增年工作时长
    }
  },
  created() {
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', () => {
      //选择的企业了
      this.clearTreeNodeClick()
      this.getTree()
    })
    this.getTree('first')
    this.isType = this.$route.query.type != 1
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
$mt_20: 20px;
.s_o_c {
  color: inherit;
  .breadt_a .el-breadcrumb__item {
    float: none;
  }
  box-sizing: border-box;
  padding: 0 0 $mt_20 $mt_20;
  margin-top: $mt_20;
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
    padding-top: $mt_20/4;
    .el-breadcrumb {
      margin-bottom: $mt_20;
    }
  }
  .el-save_button {
    float: right;
    margin: 15px 15px 15px 0;
  }
  .main-setting-container {
    .section-header-container {
      overflow: hidden;
      background-color: #f5fcf5;
      padding-top: 10px;
      height: 40px;
      .setting-section-label {
        float: left;
        border-left: 3px solid #03aaa2;
        padding-left: 5px;
        height: 15px;
        line-height: 15px;
        position: relative;
        top: 10px;
        color: inherit;
      }
    }
  }
}

.el-dialog__header,
.tree_head {
  background-color: #03938b;
  color: white;
  text-align: center;
  .el-dialog__title,
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.my_org_main {
  .setting-tab-container {
    padding-top: 10px;
    padding-left: 10px;
    overflow: hidden;
    .el-radio-button__inner {
      border: 1px solid #f5f7fa;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #03938b;
    }
    .el-radio-button__inner:hover {
      color: #03938b;
    }
  }
}
.yearWorkTime .el-dialog,
.addSubtissue .el-dialog {
  margin-top: 24vh !important;
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
