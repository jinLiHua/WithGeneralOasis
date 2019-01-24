<template>
  <div class="s_o_c standingPoint">
    <el-container>
      <el-aside width="350px">
        <div class="tree_head">密封点管理</div>
        <el-tree class="filter-tree" :data="treeData" :props="defaultProps" @node-click="treeNodeClick" ref="tree"></el-tree>
      </el-aside>
      <el-main>
        <el-breadcrumb separator="--" v-if="bread.length>0">
          <span class="bread_text">
            <i class="el-icon-location"></i> 当前组织：</span>
          <el-breadcrumb-item v-for="item in bread" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :inline="true" style="padding: 10px 0 0 15px;border-bottom: 6px solid #F5FCF5">
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
            <el-button type="success" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>
        <el-col>

          <el-form :inline="false" style="margin-top: 0">
            <el-form-item class="t_r">
              <el-button type="primary" v-if="tableShow" @click="fileDialogData.dialogVisible = true">导出</el-button>
              <el-button @click="pointDelete('all')" type="danger" v-if="isType && tableShow">批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="list" height="614" class="mfdTable" v-loading="listLoading" border fit highlight-current-row @selection-change="handleSelectionChange" element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="groupCode" label="群组编码" width="160px">
              <template slot-scope="scope">
                <div @click="detailFour(scope.row.id,scope.row.imageFileId)" style="cursor: pointer;" class="isClick">{{scope.row.groupCode}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="extendCode" label="扩展号" width="80px">
            </el-table-column>
            <el-table-column prop="typeName" label="密封点类型" width="160px">
            </el-table-column>
            <el-table-column prop="equipCode" label="管线号/设备位号" width="138px">
            </el-table-column>
            <el-table-column prop="equipName" label="线管/设备名称" width="124px">
            </el-table-column>
            <el-table-column prop="size" label="尺寸" width="55">
            </el-table-column>
            <el-table-column prop="pointStatus" label="密封点状态" width="105px">
            </el-table-column>
            <el-table-column prop="floor" label="楼层" width="55">
            </el-table-column>
            <el-table-column prop="logistics" label="物流号" width="80px">
            </el-table-column>
            <el-table-column prop="phaseBehaviorName" label="相态" width="138px">
            </el-table-column>
            <el-table-column prop="blind" label="是否盲端" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.blind == 1">是</span>
                <span v-if="scope.row.blind == 0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家" width="110px">
            </el-table-column>
            <el-table-column prop="preservation" label="是否保温" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.preservation == 1">是</span>
                <span v-if="scope.row.preservation == 0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="corrosion" label="是否腐蚀" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.corrosion == 1">是</span>
                <span v-if="scope.row.corrosion == 0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="temperature" label="温度" width="60">
            </el-table-column>
            <el-table-column prop="pressure" label="压力" width="65">
            </el-table-column>
            <el-table-column prop="lastCheckTime" label="最近一次检测日期" width="152px">
              <template slot-scope="scope">
                <span>{{scope.row.lastCheckTime?scope.row.lastCheckTime.split(' ')[0]:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reach" label="是否可达" width="90px">
              <template slot-scope="scope">
                <span v-if="scope.row.reach == 1">是</span>
                <span v-if="scope.row.reach == 0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="extension" label="延长杆" width="70">
            </el-table-column>
            <el-table-column prop="notes" label="备注" width="300px">
              <template slot-scope="scope">
                <div :title="scope.row.notes" class="remarks">{{scope.row.notes}}</div>
              </template>
            </el-table-column>
            <!--<el-table-column prop="date" label="图档编码">-->
            <!--</el-table-column>-->
            <el-table-column prop="operation" label="操作 " width="150">
              <template slot-scope="scope">
                <i class="el-icon-tickets success btn" @click="detailFour(scope.row.id,scope.row.imageFileId)" title="编辑/详情"></i>
                <i class="el-icon-delete danger btn" @click="pointDelete(0,scope.row.id)" v-if="isType" title="删除"></i>
              </template>

            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleCurrentChange" :total="total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </el-col>
      </el-main>
    </el-container>
    <!--密封点详情-->
    <fourPoint @reloadList="getList" :addPointData="pointData">
    </fourPoint>

    <fileDialog @exportFile="downloadFile" :dialog="fileDialogData">
    </fileDialog>

  </div>
</template>

<script>
import fourPoint from '@/components/Addpoint/pointFour'
import org from '@/api/standing'
import system from '@/api/system'
import maintain from '@/api/maintain'
import detection from '@/api/detection'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import { type } from '@/utils/setFormType'
import fileDialog from '@/components/Dialog/index'

export default {
  components: { fourPoint, fileDialog },
  methods: {
    //导出
    downloadFile(val) {
      let arr = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.map(item => {
          arr.push(item.id)
        })
      }
      var obj = this.listQuery
      delete obj.current
      let base = baseUrl()
      let url =
        base +
        '/exportSealingPointExcel?orgId=' +
        this.listQuery.orgId +
        '&imageCode=' +
        this.listQuery.imageCode +
        '&groupCode=' +
        this.listQuery.groupCode +
        '&type=' +
        this.listQuery.type +
        '&ids=' +
        arr.join(',')
      xiaZai(url, [
        { key: 'fileName', value: val },
        { key: 'orgId', value: this.listQuery.orgId },
        { key: 'imageCode', value: this.listQuery.imageCode },
        { key: 'groupCode', value: this.listQuery.groupCode },
        { key: 'type', value: this.listQuery.type },
        { key: 'ids', value: arr.join(',') }
      ])
    },
    //获取列表
    getList() {
      this.listShow = true
      this.listLoading = true
      org.pointList(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    //拿tree
    getTree() {
      let userOnly = 'USERSC' + sessionStorage.getItem('userName')
      let selectId = sessionStorage.getItem(userOnly)
      let parame = { selectedOrgId: selectId }
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
    //点击树
    treeNodeClick(data) {
      this.tableShow = true
      this.bread = []
      this.listQuery.orgId = data.id
      this.getList()
      this.getBreadA(data.id)
      this.bread.reverse()
    },
    clearTreeNodeClick() {
      this.tableShow = false
      this.bread = []
      this.listQuery.orgId = ''
      this.list = []
      this.total = 0
    },
    //分页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    //获取字典类型
    getDict(code) {
      let dictInfo = []
      system.dictGetDict(code).then(res => {
        dictInfo = res.data
        switch (code) {
          case 'point_type':
            this.optionsType = dictInfo
            this.pointData.optionsType = dictInfo
            break
          case 'point_status':
            this.optionsStatus = dictInfo
            this.pointData.optionsStatus = dictInfo
            break
          case 'phase_behavior':
            this.optionsBe = dictInfo
            this.pointData.optionsBe = dictInfo
            break
          default:
        }
      })
      return dictInfo
    },
    //table多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //删除密封点
    pointDelete(type, id) {
      if (type != 0 && this.multipleSelection.length <= 0) {
        this.$message.error('请选择需要删除的数据！')
        return
      }
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          var arr = [],
            obj = {}
          if (type == 0) {
            arr.push(id)
          } else {
            this.multipleSelection.map(item => {
              if (item) {
                arr.push(item.id)
              }
            })
          }
          obj.pointIds = arr.toString()
          org.pointDelete(obj).then(res => {
            if (!res.data) {
              tip('删除成功！')
            } else {
              tip(res.data, 'error')
            }
            this.checkedVal = []
            this.getList()
          })
        })
        .catch(_ => {})
    },
    //公共弹窗
    detailFour(id, imgId) {
      this.pointData.dialogFormVisible = true
      this.pointData.imgId = imgId
      this.pointData.id = id
    }
  },
  data() {
    return {
      checkedVal: [],
      fileDialogData: {
        dialogVisible: false,
        fileName: ''
      },
      treeDataA: [],
      bread: [],
      isType: true,
      multipleSelection: [],
      treeData: [],
      total: 0,
      listQuery: {
        orgId: '',
        imageCode: '',
        groupCode: '',
        type: '',
        current: 1
      },
      tableShow: false,
      optionsType: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      activeName: 'first',
      list: null,
      listLoading: false,
      radio: '1',
      pointData: {
        dialogFormVisible: false,
        dia_titile: '密封点',
        id: '',
        imgId: ''
      }
    }
  },
  created() {
    this.getTree()
    this.getDict('point_status')
    this.getDict('point_type')
    this.getDict('phase_behavior')
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', () => {
      //选择的企业了
      this.clearTreeNodeClick()
      this.getTree()
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$mt_20: 20px;
.standingPoint {
  .el-main{
    padding: 0 !important;
  }
  .mfdTable{
    .el-pagination{
      padding: 0 !important;
    }

  }
  margin-top: 20px;
  .isClick:hover {
    color: #7bd0cb;
    text-decoration: underline;
  }
  .remarks {
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  box-sizing: border-box;
  padding: 0 0 $mt_20 $mt_20;
  margin-top: $mt_20;
  .t_r {
    text-align: right;
  }
  .t_a {
    text-align: center;
  }
  .el-tree {
    padding: $mt_20;
  }
  .el-main {
    margin-left: $mt_20/2;
    background-color: #fff;
    .el-form {
      .el-form-item {
        padding-right: 0;
      }
    }
  }
  .el-dialog__body {
    overflow: hidden;
    padding-top: $mt_20/4;
    .el-tabs__item:hover,
    .el-tabs__item.is-active,
    .el-tabs__active-bar {
      color: #42b983;
    }
    .el-tabs__active-bar {
      background-color: #42b983;
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
  .my-file-dialog .el-dialog__body {
    padding-top: 30px;
  }
}
</style>
