<template>
  <div class="s_o_c maintainYq">
    <div>
      <el-container>
        <el-aside width="350px">
          <div class="tree_head">延期维修管理</div>
          <el-tree class="filter-tree" :data="treeData" :props="defaultProps" @node-click="treeNodeClick"  ref="tree2"></el-tree>
        </el-aside>
        <el-main>
          <el-breadcrumb separator="--" v-if="bread.length>0">
            <span class="bread_text">
              <i class="el-icon-location"></i> 当前组织：</span>
            <el-breadcrumb-item v-for="item in bread" :key="item.id">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-form ref="form" :inline="true" style="padding-left: 10px;border-bottom: 10px solid #F5FCF5;">
            <el-form-item label="群组编码：">
              <el-input placeholder="群组编码" v-model="listQuery.groupCode"></el-input>
            </el-form-item>
            <el-form-item label="密封点类型：">
              <el-select v-model="listQuery.type" placeholder="请选择">
                <el-option v-for="item in optionsType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图档编码：">
              <el-input placeholder="图档编码" v-model="listQuery.imageCode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="getlist">查询</el-button>
            </el-form-item>
          </el-form>
          <el-col>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
              <el-table-column type="index" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="groupCode" label="群组编号">
              </el-table-column>
              <el-table-column prop="extendCode" label="扩展号">
              </el-table-column>
              <el-table-column prop="typeName" label="类型">
              </el-table-column>
              <el-table-column prop="phaseBehaviorName" label="相态">
              </el-table-column>
              <el-table-column prop="pointStatus" label="状态">
              </el-table-column>
              <el-table-column prop="delayTime" label="延期时间">
                <template slot-scope="scope">
                  <span>{{scope.row.delayTime?scope.row.delayTime.split(' ')[0]:''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="lastCheckTime" label="维修完成时间">
                <template slot-scope="scope">
                  <span>{{scope.row.lastCheckTime?scope.row.lastCheckTime.split(' ')[0]:''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作 ">
                <template slot-scope="scope">
                  <i class="el-icon-tickets success btn" title="编辑/详情" @click="detailFour(scope.row.id,scope.row.imageFileId)"></i>
                  <i class="el-icon-time warning btn" title="延期维修" @click="delDelay(scope.row.id)" v-if="isType"></i>
                  <i class="el-icon-check primary btn" title="维修完成" @click="dispose(0,scope.row.id)" v-if="isType"></i>
                </template>
              </el-table-column>
            </el-table>
            <!--工具条-->

            <el-col :span="24" class="toolbar">
              <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleSizeChange" :total="total" style="text-align:center;">
              </el-pagination>

            </el-col>
          </el-col>
        </el-main>
      </el-container>
      <!--密封点-->
      <fourPoint :addPointData="pointData"></fourPoint>

      <!--延期工单-->
      <el-dialog class="s_o_c add_dia add date postponement" title="延期工单" :visible.sync="dialogTimeVisible" width="400px">
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
  </div>

</template>


<script>
import fourPoint from '@/components/Addpoint/pointFour'
import org from '@/api/standing'
import system from '@/api/system'
import maintain from '@/api/maintain'
import { type } from '@/utils/setFormType'
import { tip } from '@/utils/tip'

export default {
  components: { fourPoint },
  methods: {
    //点击树
    treeNodeClick(data) {
      this.bread = []
      this.listQuery.orgId = data.id
      this.listQuery.current = 1
      this.getlist()
      this.getBreadA(data.id)
      this.bread.reverse()
    },
    //获取树无层级数组
    getTreeA(tree, path, currentPath) {
      var currentPath = currentPath || []
      var path = path || []

      for (let i = 0; i < tree.length; i++) {
        if (i !== 0) {
          currentPath.pop()
        }
        currentPath.push({
          name: tree[i].name,
          id: tree[i].id,
          parentId: tree[i].parentId
        })
        if (tree[i].children.length) {
          this.getTreeA(tree[i].children, path, currentPath)
        } else {
          path.push(currentPath.slice(0))
        }
      }
      currentPath.pop()
      return path
    },
    //获取面包屑数组
    getBreadA(id) {
      var _t = this
      _t.treeDataA.forEach(function(e) {
        if (e.id == id) {
          _t.bread.push(e.name)
          if (e.parentId) {
            _t.getBreadA(e.parentId)
          }
        }
      })
    },
    //处理工单
    dispose(type, id) {
      this.disposeDel.type = type
      if (id) {
        this.disposeDel.pointId = id
        this.disposeDel.date = ''
      }
      if (type == 1) {
        if (!this.disposeDel.date) {
          tip('请选择延期时间', 'warning')
          return
        }
      }
      this.disposeDel.orderId = ''
      maintain.delayPointDispose(this.disposeDel).then(res => {
        tip(res.msg)
        this.getlist()
        if (type == 1) {
          this.dialogTimeVisible = false
        }
      })
      //        maintain.dispose(this.disposeDel).then(res => {
      //          tip(res.msg);
      //          this.getlist()
      //          if(type == 1){
      //            this.dialogTimeVisible = false
      //          }
      //        })
    },
    //延期工单弹窗
    delDelay(id) {
      this.disposeDel.date = ''
      this.disposeDel.pointId = id
      this.dialogTimeVisible = true
    },

    //拿树
    getTree(id) {
      let parame = { selectedOrgId: id }
      org.orgGetOrgTree(parame).then(res => {
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
    //获取字典类型
    getDict(code) {
      let dictInfo = []
      system.dictGetDict(code).then(res => {
        dictInfo = res.data
        switch (code) {
          case 'point_type':
            this.optionsType = dictInfo
            break
          default:
        }
      })
      return dictInfo
    },
    //列表
    getlist() {
      this.listLoading = true
      maintain.getPointPageYq(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.current = val
      this.getlist()
    },
    //密封点详情弹窗
    detailFour(id, imgId) {
      this.pointData.dialogFormVisible = true
      this.pointData.imgId = imgId
      this.pointData.id = id
    }
  },

  data() {
    return {
      dialogTimeVisible: false,
      isType: false,
      disposeDel: {
        pointId: '',
        type: '',
        date: '',
        orderId: ''
      },
      pointData: {
        dialogFormVisible: false,
        dia_titile: '密封点',
        id: '',
        imgId: ''
      },
      optionsType: [],
      bread: [],
      treeData: [],
      treeDataA: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        current: 1,
        groupCode: '',
        imageCode: '',
        orgId: '',
        type: ''
      }
    }
  },
  created() {
    this.getDict('point_type')
    //需要传用户选中的id
    let userOnly = 'USERSC' + sessionStorage.getItem('userName')
    let selectId = sessionStorage.getItem(userOnly)
    this.getTree(selectId)

    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', val => {
      //选择的企业了
      this.getTree(val)
    })
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$mt_20: 20px;
.maintainYq {
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

  box-sizing: border-box;
  padding: 0 0 $mt_20 $mt_20;
  margin-top: $mt_20;
  .filter-tree {
    height: 810px !important;
    overflow-y: auto;
  }
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
      margin-top: $mt_20 * 0.5;
      .el-form-item {
        padding-right: $mt_20 * 1.5;
      }
    }
  }
  .el-dialog__body {
    overflow: hidden;
    padding-top: $mt_20/4;
    .el-breadcrumb {
      margin-bottom: $mt_20;
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
      }
    }
  }
  .search_dia {
    .t_a {
      margin-top: $mt_20;
    }
  }
}
</style>

