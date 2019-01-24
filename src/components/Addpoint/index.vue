<template>
  <!--增加密封点-->
  <div class="maintenanceWork">
    <el-dialog class="s_o_c add_dia add_point" :title="addPointData.title" :visible.sync="addPointData.dialogAddVisible" width="97%" :style="addPointData.title == '新增密封点'?'margin-top:0vh':'margin-top:-13vh'" >
      <el-form v-if="addPointData.isShowSearch" :inline="true" label-width="105px">
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
      <el-container style="padding-top: 20px">
        <el-aside width="350px">
          <div class="pic_title">
            <div class="pic_title_ti">组织结构</div>
            <el-tree class="filter-tree " :data="treeData" :props="defaultProps" @node-click="treeNodeClick" default-expand-all ref="tree"></el-tree>
          </div>
        </el-aside>
        <el-main>
          <el-table height="760" :data="list" class="maintenanceWorkDialog" v-loading="listLoading" border fit highlight-current-row @select="handleSingleRow" @select-all="handleAllRow" ref="multipleTable" element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="groupCode" label="群组编码" width="160px">
              <template slot-scope="scope">
                <div @click="detailFour(scope.row.id,scope.row.imageFileId)" style="cursor: pointer;" class="isClick">{{scope.row.groupCode}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="extendCode" label="扩展号" width='80px'>
            </el-table-column>
            <el-table-column prop="typeName" label="密封点类型" width="160px">
            </el-table-column>
            <el-table-column prop="equipCode" label="管线号/设备位号" width="138px">
            </el-table-column>
            <el-table-column prop="equipName" label="线管/设备名称" width="124px">
            </el-table-column>
            <el-table-column prop="size" label="尺寸" width='55'>
            </el-table-column>
            <el-table-column prop="pointStatus" label="密封点状态" width='105px'>
            </el-table-column>
            <el-table-column prop="floor" label="楼层" width='55'>
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
            <el-table-column prop="manufacturer" label="生产厂家" width='110px'>
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
            <el-table-column prop="lastCheckTime" label="最近一次检测日期" width="125px">
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
            <el-table-column prop="operation" label="操作 " width="100">
              <template slot-scope="scope">
                <i class="el-icon-tickets success btn" @click="detailFour(scope.row.id,scope.row.imageFileId)" title="详情"></i>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleCurrentChange" :total="total" style="text-align:center;">
            </el-pagination>
          </el-col>
          <el-form :inline="true" label-width="105px" class="t_r trSure">
            <el-form-item>
              <!--<el-button type="" @click="addPointData.dialogAddVisible = false">取消</el-button>-->
              <el-button type="success" @click="sendIds" v-if="isType">确定</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
    <!--密封点详情-->
    <fourPoint @reloadList="getList" :addPointData="pointData"></fourPoint>
  </div>

</template>

<script>
import fourPoint from '@/components/Addpoint/pointFour'
import org from '@/api/standing'
import system from '@/api/system'
import detection from '@/api/detection'
import maintain from '@/api/maintain'
import { tip, xiaZai } from '@/utils/tip'
import { type } from '@/utils/setFormType'
export default {
  name: 'addPoint',
  props: ['addPointData'],
  /*treeId
    * */
  components: { fourPoint },
  watch: {
    'addPointData.dialogAddVisible': function(n, o) {
      if (!n) {
        this.total = 0
        this.list = []
      }
    },
    'addPointData.treeId': function(newVal) {
      if (newVal !== '') {
        this.getTree(newVal)
      }
    }
  },
  data() {
    return {
      treeDataA: [],
      selectPoints: [],
      bread: [],
      isType: true,
      multipleSelection: [],
      treeData: [],
      total: 0,
      listQuery: {
        orgId: '',
        orderOrTask: '',
        imageCode: '',
        groupCode: '',
        type: '',
        current: 1
      },
      listQueryPoint: {
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
  methods: {
    //传ids
    sendIds() {
      //判断是否选择了
      if (this.selectPoints.length == 0) return tip('请选择密封点', 'warning')
      let pointIds = []
      this.selectPoints.forEach(point => {
        pointIds.push(point.id)
      })
      let sendIds = {
        from: 'point',
        data: {
          pointIds: pointIds
        }
      }
      this.$emit('sendIds', sendIds)
      this.addPointData.dialogAddVisible = false
    },
    //获取列表
    getList() {
      this.listShow = true
      this.listLoading = true
      if (this.addPointData.isMaintain) {
        delete this.listQuery.orderOrTask
        maintain.getPointPage(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.selectedHandler()
        })
      } else {
        this.listQuery.orderOrTask = this.addPointData.orderOrTask
        detection.getPointPage(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.selectedHandler()
        })
      }
    },
    //拿tree
    getTree(id) {
      let parame = { selectedOrgId: id }
      org.orgGetOrgTree(parame).then(res => {
        this.treeData = res.data
      })
    },
    //点击树
    treeNodeClick(data) {
      this.tableShow = true
      this.listQuery.orgId = data.id
      this.listQueryPoint.orgId = data.id
      this.getList()
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
            break
          case 'point_status':
            this.optionsStatus = dictInfo
            break
          case 'phase_behavior':
            this.optionsBe = dictInfo
            break
          default:
        }
      })
      return dictInfo
    },

    handleAllRow(val) {
      if (val.length > 0) {
        //          有数据的为全选
        for (let i = 0; i < val.length; i++) {
          let index = this.selectPoints.findIndex(item => item.id === val[i].id)
          if (index < 0) {
            this.selectPoints.push(val[i])
          }
        }
      } else {
        //          没数据的则为取消全选
        for (let i = 0; i < this.list.length; i++) {
          let index = this.selectPoints.findIndex(
            item => item.id === this.list[i].id
          )
          if (index > -1) {
            this.selectPoints.splice(index, 1)
          }
        }
      }
    },
    handleSingleRow(val, row) {
      this.multipleSelection = val
      let index = this.selectPoints.findIndex(item => item.id === row.id)
      if (index > -1) {
        this.selectPoints.splice(index, 1)
      } else {
        this.selectPoints.push(row)
      }
    },
    selectedHandler() {
      let currentPoints = []
      this.list.forEach(listRow => {
        this.selectPoints.forEach(selectRow => {
          if (listRow.id === selectRow.id) currentPoints.push(listRow)
        })
      })
      let that = this
      this.$nextTick(function() {
        that.toggleSelection(currentPoints)
      })
    },
    toggleSelection(rows) {
      let that = this
      if (rows) {
        rows.forEach(row => {
          that.$refs.multipleTable.toggleRowSelection(row, true)
        })
      }
    },
    //删除密封点
    pointDelete(type, id) {
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
          obj.pointIds = arr.toString()
          org.pointDelete(obj).then(res => {
            if (!res.data) {
              tip('删除成功！')
            } else {
              tip(res.data, 'error')
            }
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
  created() {
    this.getTree(this.addPointData.treeId)
    this.getDict('point_status')
    this.getDict('point_type')
    this.getDict('phase_behavior')
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
@import '../../styles/table.scss';
.maintenanceWork {
  .trSure {
    position: absolute;
    right: 20px;
    bottom: 4px;
  }
  .el-tree {
    height: 774px;
    overflow-y: auto;
  }
  .maintenanceWorkDialog {
    .el-dialog {
      // margin-top: 0vh !important;
    }
  }

  .remarks {
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .isClick:hover {
    color: #7bd0cb;
    text-decoration: underline;
  }
  .table_do {
    text-align: right;
  }
  .pic_title {
    border: 1px solid #ebeef5;
    width: 100%;
    .pic_title_ti {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #0db29f;
      font-size: 16px;
      background-color: #f5fcf5;
      margin-bottom: 0;
    }
  }
  .el-form--inline.search_top .el-form-item {
    width: 25%;
  }
  .el-dialog {
    width: 50%;
  }
  $mt_20: 20px;
  .s_o_c {
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
      // padding-top: $mt_20/4;
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
      // .el-dialog{
      //   margin-top: 1vh!important;
      // }
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
}
</style>
