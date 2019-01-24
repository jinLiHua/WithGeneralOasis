<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px; border-radius: 5px;">
      <el-form :inline="true" class="t_r">
        <el-form-item>
          <el-button type="success" @click="dialogFormVisible = true" v-if="isType">新建角色</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->

      <el-table :data="list" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">

        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="name" label="角色名称">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime?scope.row.createTime.split(' ')[0]:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作 " width="250">
          <template slot-scope="scope">
            <i class="el-icon-tickets success btn" title="编辑/详情" @click="edit(scope.row.id)"></i>
            <i class="el-icon-delete danger btn" @click="deleteRow(scope.row)" title="删除" v-if="isType"></i>
            <!--v-if="isType"-->
            <i class="el-icon-menu primary btn" @click="handleClick(scope.row)" title="权限配置" v-if="isType"></i>
            <!--v-if="isType"-->
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="text-align:center;margin-top:20px">
        <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next" :total="totals">
        </el-pagination>
      </el-col>
    </el-col>

    <!--弹出框-->
    <el-dialog title="角色" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form">

        <el-form-item label="角色：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>

        <!--<el-form-item label="角色分类：" :label-width="formLabelWidth" prop="type">-->
        <!--<el-radio-group v-model="form.type">-->
        <!--<el-radio auto-complete="off" label="0">超级管理员</el-radio>-->
        <!--<el-radio auto-complete="off" label="1">单位管理员</el-radio>-->
        <!--<el-radio auto-complete="off" label="2">普通管理员</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer t_a">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click="dialogopen" v-if="isType">确 定</el-button>
      </div>
    </el-dialog>

    <!--弹出框2-->
    <el-dialog title="权限配置" :visible.sync="dialogFormVisible2" style="margin-top: -14vh" class="qxpz">

      <el-form :model="form2" ref="ruleForm2">
        <el-tree :data="data2" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :default-checked-keys="checkArr" :props="defaultProps" :render-content="renderContent" :expand-on-click-node="false">
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="success" @click="dialogopen1">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getRole,
  addRole,
  delRole,
  permissList,
  permissionSave
} from '@/api/systemMan'
import system from '@/api/system'
import { tip, xiaZai } from '@/utils/tip'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      page: 1,
      sizes: 0,
      totals: 0,
      current: 1,
      input: '',
      isType: false,
      checkArr: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogTableVisible2: false,
      dialogFormVisible2: false,
      form: {
        id: '',
        name: '',
        type: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
        //        type: [
        //          { required: true, message: '请选择角色分类', trigger: 'change' }
        //        ]
      },
      type: 0,
      form2: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formLabelWidth: '100px'
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    dialogFormVisible: function(n, o) {
      if (!n) {
        this.form = {
          type: '',
          name: ''
        }
      }
    }
  },
  created() {
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  },
  methods: {
    //编辑
    edit(id) {
      system.editRole(id).then(res => {
        this.form.id = res.data.id
        this.form.name = res.data.name
        this.form.type = res.data.type.toString()
        this.dialogFormVisible = true
      })
    },
    fetchData() {
      var self = this
      var page = {
        size: 10,
        current: self.current
      }
      this.listLoading = true
      getRole(page).then(res => {
        this.listLoading = false
        self.list = res.data.records
        self.totals = res.data.total
        self.sizes = res.data.current
      })
    },
    handleCurrentChange(val) {
      this.current = val
      this.fetchData()
    },
    handleClick(e) {
      var self = this
      self.openid = e.id
      var id = e.id

      this.dialogFormVisible2 = true
      var listData = []

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var parames = { roleId: id }
      permissList(parames)
        .then(Response => {
          loading.close()
          self.checkArr = []
          var res = Response.data
          console.log(res)
          for (var i = 0; i < res.length; i++) {
            var roleId = res[i].roles.split(',')
            roleId.forEach(element => {
              if (element == id) {
                self.checkArr.push(res[i].id)
              }
            })
            if (res[i].parent == 0 || !res[i].parent) {
              listData.push({
                id: res[i].id,
                label: res[i].name,
                permissions: res[i].readWritePermission,
                type: res[i].type
              })
            } else {
              for (var a = 0; a < listData.length; a++) {
                if (listData[a].id == res[i].parent) {
                  if (listData[a].children) {
                    listData[a]['children'].push({
                      id: res[i].id,
                      label: res[i].name,
                      permissions: res[i].readWritePermission,
                      type: res[i].type
                    })
                  } else {
                    listData[a].children = [
                      {
                        id: res[i].id,
                        label: res[i].name,
                        permissions: res[i].readWritePermission,
                        type: res[i].type
                      }
                    ]
                  }
                }
              }
            }
          }
          self.data2 = listData
        })
        .catch(err => loading.close())
    },
    dialogopen() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var self = this
          this.listLoading = true
          addRole({
            name: this.form.name,
            type: this.form.type,
            id: this.form.id
          }).then(res => {
            self.listLoading = false
            self.current = 1
            self.fetchData()
          })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    dialogopen1: function() {
      var per = this.$refs.tree.getCheckedKeys()
      var tmpData = []
      this.data2.forEach(function(element) {
        tmpData.push(element)
        if (element.children.length > 0) {
          tmpData.push(...element.children)
        }
      })
      var updateData = []
      per.forEach(function(e) {
        const index = tmpData.findIndex(d => d.id === e)
        var tmpStr = e + '-' + tmpData[index].permissions
        updateData.push(tmpStr)
      })
      var perames = updateData.join(',')
      permissionSave(this.openid, perames).then(res => {
        this.dialogFormVisible2 = false
        tip(res.msg)
      })
    },
    deleteRow(row) {
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          delRole(row.id).then(res => {
            this.listLoading = false
            this.fetchData()
          })
        })
        .catch(_ => {})
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{data.label}</span>
          <span v-show={data.type == 1}>
            <el-button
              v-show={data.permissions == 0}
              style="color:#666"
              size="mid"
              type="text"
              data-id=""
              on-click={() => {
                data.permissions = 1
              }}
            >
              读写
            </el-button>
            <el-button
              v-show={data.permissions == 1}
              size="mid"
              type="text"
              on-click={() => {
                data.permissions = 0
              }}
            >
              只读
            </el-button>
          </span>
        </span>
      )
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-input__inner {
  width: 350px;
}
.el-form--inline .text_area .el-form-item__content {
  width: 70.5%;
}

</style>
<style rel="stylesheet/scss" lang="scss" >
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.qxpz {
  .el-dialog__body {
    max-height: 800px;
    overflow-y: auto;
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


