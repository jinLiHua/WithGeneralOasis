<template>
  <div class="s_o_c cAppMain">

    <el-container>
      <el-aside width="350px">
        <div class="tree_head">图档管理</div>
        <el-tree class="filter-tree" @node-click="treeNodeClick" :data="treeData" :props="defaultProps" ref="tree2">
        </el-tree>
      </el-aside>

      <el-main>
        <el-breadcrumb separator="--" v-if="bread.length>0">
          <span class="bread_text">
            <i class="el-icon-location"></i> 当前组织：</span>
          <el-breadcrumb-item v-for="item in bread" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :inline="true" style="padding-left: 15px;border-bottom: 6px solid #F5FCF5;margin-top: 10px">
          <el-form-item label="图档编码：">
            <el-input placeholder="图档编码" v-model="listQuery.code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>
        <el-col>
          <el-form :inline="false" class="t_r" style="margin-top: 0">
            <el-form-item>
              <el-button type="success" @click="showDetail(0)" v-if="isType && listShow">新增</el-button>
              <el-button type="success" v-if="isType && listShow" class="plAdd">
                <label for="m_uploadImg" class="plPicAdd">批量新增</label><input type="file" multiple id="m_uploadImg" @change="uploadImg" style="display: none">
              </el-button>
              <el-button type="success" v-if="isType && listShow" @click="changeFloorEquipment(1)">
                <i class="floorImg2"></i>
                <span>管线设备</span>
              </el-button>
              <el-button type="success" v-if="isType && listShow" @click="changeFloorEquipment(2)">
                <i class="floorImg"></i>
                <span>楼层</span>
              </el-button>
              <el-button type="primary" @click="exportPDF" v-if="listShow">导出</el-button>
              <el-button type="danger" @click="deleteImgFile(1)" v-if="isType && listShow">批量删除</el-button>
              <el-button v-if="total > 0" type="success" @click="funAllSelectList">{{allSelected ? '取消全选' : '全选'}}</el-button>

            </el-form-item>
          </el-form>
          <el-table ref="multipleTable"
                    tooltip-effect="dark"
                    :data="list"
                    v-loading="listLoading"
                    border fit highlight-current-row
                    element-loading-text="拼命加载中"
                    @select-all="handleSelectionChange"
                    @select="handleSelectionChange"
                    style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="code" label="图档编码">
            </el-table-column>
            <el-table-column prop="equipment" label="所属设备">
            </el-table-column>
            <el-table-column prop="pointNum" label="密封点">
            </el-table-column>
            <el-table-column prop="createUser" label="标注人">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime?scope.row.createTime.split(' ')[0]:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="150">
              <template slot-scope="scope">
                <i class="el-icon-tickets success btn" @click="showDetail(scope.row.id)" title="编辑/详情"></i>
                <i class="el-icon-sort primary btn" @click="moveChange(scope.row.id)" title="转移"></i>
                <i class="el-icon-delete danger btn" @click="deleteImgFile(0,scope.row.id)" v-if="isType" title="删除"></i>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="20" @current-change="handleCurrentChange" :total="total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </el-col>
      </el-main>
    </el-container>

    <!--图档详情-->
    <addPic :pic="picData" @reloadList="getList"></addPic>
    <!-- 修改楼层 管线设备名称  管线设备号 dialog -->
    <el-dialog :title="changeTitle" class="changeFloor" :visible.sync="isCenterDialogVisible" width="500px" style="position: fixed;top: 10%;left: 10%;">
      <div style="margin-top:20px;text-align:center">
        <label for="" v-if="changeT != '管线设备'" :class="changeT=='物料信息'?'wl':''">{{changeT}}</label>
        <el-input v-if="changeT == '楼层'" type="text" placeholder="楼层" v-model="floorVal" style=" width: 60%;margin-left: 10px;padding-left: 4px;"></el-input>
        <label for="" v-if="changeT == '管线设备'" style='width:104px;display:inline-block'>管线/设备名称</label>
        <el-input v-if="changeT == '管线设备'" type="text" v-model="floorVal" style=" width: 60%;margin-left: 4px;padding-left: 4px;"></el-input><br><br>
        <label for="" style='width:104px;display:inline-block' v-if="changeT == '管线设备'">管线号/设备位号</label>
        <el-input v-if="changeT == '管线设备'" type="text" v-model="equipCode" style=" width: 60%;margin-left: 4px;padding-left: 4px;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isCenterDialogVisible = false">取 消</el-button>
        <el-button type="success" @click="chechkeChange">确 定</el-button>
      </span>
    </el-dialog>
    <!--图档转移-->
    <el-dialog title="图档转移" :visible.sync="dialogMove" width="500px;" class="mapFileTransfer">
      <el-tree class="filter-tree" :data="treeData" :props="defaultProps" @node-click="treeNodeClickMove" default-expand-all ref="tree"></el-tree>
      <div class="t_a" style="margin-top: 15px">
        <el-button @click="dialogMove = false">取 消</el-button>
        <el-button type="success" @click="sureMove" v-if="isType">确 定</el-button>
      </div>

    </el-dialog>

    <!-- 导出 -->
    <fileDialog @exportFile="downloadFile" :dialog="fileDialogData">
    </fileDialog>
  </div>

</template>


<script>
import org from '@/api/standing'
import addPic from '@/components/Addpoint/picAdd'
import system from '@/api/system'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import { type } from '@/utils/setFormType'
import fileDialog from '@/components/Dialog/index'

export default {
  components: { addPic, fileDialog },

  data() {
    return {

      allSelected: false,
      imageFilepages: 0,
      allImageFileList: [],
      lastPicOrgId: '', //记录上个选中的
      chooseList: [], //图档多选id
      allPlanList: [],

      isCenterDialogVisible: false, // 控制图档详情 dialog
      addImg: [],
      addInfo: {
        id: '',
        orgId: '1',
        code: '',
        details: '',
        equipment: '',
        fileId: ''
      },
      fileDialogData: {
        dialogVisible: false,
        fileName: ''
      },
      imgArry: [],
      moveInfo: {
        id: '',
        orgId: ''
      },
      dialogMove: false,
      isType: true,
      picData: {
        picId: 0,
        orgId: '',
        dialogFormVisible: false
      },
      isAdd: true,
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
      listShow: false,
      total: 0,
      listQuery: {
        orgId: '', // 组织Id
        code: '',
        size:20,
        current: 1 // 当前页,
      },
      itemArry: [],
      changeTitle: '修改楼层',
      changeT: '楼层',
      formData: [],
      dia_titile: '图档信息',
      radio: '1',
      options: [],
      value: '',
      checkedVal: [],
      floorVal: '',
      equipCode: '',
      hXData: []
    }
  },
  created() {
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', () => {
      //选择的企业了
      this.clearTreeNodeClick()
      this.getTree()
    })
    this.getTree()
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  },
  methods: {
    //数组去重
    unique(a) {
      var ret = []
      var hash = {}
      for (var i = 0, len = a.length; i < len; i++) {
        var item = a[i]
        var key = typeof item + item
        if (hash[key] !== 1) {
          ret.push(item)
          hash[key] = 1
        }
      }
      return ret
    },
    //全选功能
    funAllSelectList() {
      if (this.allSelected) {
        for (var index = 0; index < this.imageFilepages; index++) {
          this.chooseList[index] = [];
        }
        this.toggleSelection();

      } else {
        let parames = {
          size: 100000,
          current: 1,
          orgId: this.listQuery.orgId,
        }
        let that = this;
        org.imageFileList(parames).then(res => {
          that.allPlanList = res.data.records;
          for (var index = 0; index < that.imageFilepages; index++) {
            let pageList = [];
            for (var row = 0; row < 20; row++) {
              let listIndex = index * 20 + row;
              if (that.allPlanList[listIndex]){
                pageList.push(that.allPlanList[listIndex].id);
              }
            }
            that.chooseList[index] = pageList;
          }
          //先清楚全选的再选择当前的
          that.toggleSelection();
          that.toggleSelection(that.list);
        })
      }
      this.allSelected = !this.allSelected;
    },
    funJudgeSelect() {
      //只用判断选中的数量是否相等即可
      let selectIds = [];
      for (var index = 0; index < this.chooseList.length; index++) {
        if (this.chooseList[index].length > 0) {
          let indexList = this.chooseList[index];
          for (var i = 0; i < indexList.length; i++) {
            selectIds.push(indexList[i]);
          }
        }
      }
      let selected = selectIds.length > 0 && selectIds.length === this.total;
      this.allSelected = selected;
      return selectIds;
    },
    funClearSelectData() {
      for (var index = 0; index < this.imageFilepages; index++) {
        this.chooseList.push([]);
      }
    },
    //分页多选回显
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 修改楼层确定按钮
    chechkeChange: function() {
      let val = {}
      var isNum = false
      val.ids = this.funJudgeSelect().join(',')
      if (this.changeTitle == '修改楼层') {
        //验证数据的有效性
        const floorReg = /^\d+(\.\d+)?$/
        if (!floorReg.test(this.floorVal)) {
          return tip('楼层只能输入整数', 'warning')
        }
        if (this.floorVal.length > 2) {
          return tip('楼层不能大于2位数字', 'warning')
        }
        val.floor = this.floorVal
      } else if (this.changeTitle == '修改管线设备') {
        val.equipName = this.floorVal
        val.equipCode = this.equipCode
      }
      if (!isNum) {
        org.changeFloorGX(val).then(res => {
          if (res.status) {
            tip(res.msg)
          }
          this.isCenterDialogVisible = false
          this.floorVal = ''
          this.equipCode = ''
          this.getList()
          this.funClearSelectData();
        })
      }
    },
    // 修改楼层或管线设备 dialog title
    changeFloorEquipment: function(type) {
      if (this.funJudgeSelect().length > 0) {
        this.isCenterDialogVisible = true
      } else {
        this.open5()
      }
      if (type == 2) {
        this.changeTitle = '修改楼层'
        this.changeT = '楼层'
        return false
      } else if (type == 1) {
        this.changeTitle = '修改管线设备'
        this.changeT = '管线设备'
        return false
      }
    },
    open5() {
      this.$message.error('请选择需要修改的数据')
    },
    //上传图片  or 批量新增
    uploadImg(e) {
      let files = e.target.files || e.dataTransfer.files
      this.formData = new FormData()
      let originalNameArry = []
      if (files.length > 0) {
        const loading = this.$loading({
          lock: true,
          text: '正在努力上传图档...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        for (let item of files) {
          originalNameArry.push(item.name.replace('.png' || '.jpg', ''))
          this.formData.append('image', item)
        }
        let isRepet = this.isRepeat(originalNameArry)
        if (isRepet) {
          loading.close()
          this.open4()
        } else {
          org.uploadDrawing(this.formData).then(res => {
            loading.close()
            tip('上传成功！')
            for (let itemId of res.data) {
              this.addInfo = {
                id: '',
                orgId: this.listQuery.orgId,
                code: itemId.originalName,
                details: '',
                equipment: '',
                fileId: itemId.id
              }
              this.addOrEdit(this.addInfo)
            }
          })
        }
      }
    },
    open4() {
      this.$message.error('文件名有重复，请重新上传')
    },
    //判断上传图片文件名是否有重复
    isRepeat: function(arr) {
      var hash = {}
      for (var i in arr) {
        if (hash[arr[i]]) return true
        hash[arr[i]] = true
      }
      return false
    },
    //新增编辑
    addOrEdit(addInfo) {
      //验证是否填写图档
      org.imageAddOrEdit(addInfo).then(res => {
        this.getList()
      })
    },
    //点击树
    treeNodeClickMove(data) {
      this.moveInfo.orgId = data.id
    },
    //确定转移
    sureMove() {
      org.imageAddOrEdit(this.moveInfo).then(res => {
        this.dialogMove = false
        tip(res.msg)
        this.getList()
      })
    },
    //列表转移
    moveChange(id) {
      this.dialogMove = true
      this.moveInfo.id = id
    },
    //导出
    downloadFile(val) {
      let arr = this.funJudgeSelect();
      if (arr.length === 0) return tip('请选择图档', 'warning');

      let base = baseUrl()
      let url =
        base +
        '/exportPDF?orgId=' +
        this.listQuery.orgId +
        '&code=' +
        this.listQuery.code +
        '&ids=' +
        arr.join(',')
      xiaZai(url, [
        { key: 'fileName', value: val },
        { key: 'orgId', value: this.listQuery.orgId },
        { key: 'code', value: this.listQuery.code },
        { key: 'ids', value: arr.join(',') }
      ])
//      this.funClearSelectData();
      this.getList()
    },
    //导出pdf
    exportPDF() {
      if (this.funJudgeSelect().length == 0) {
        return tip('请选择要导出的密封点', 'error')
      }
      this.fileDialogData.dialogVisible = true
    },
    //批量新增
    m_showDetail(id) {
      this.picData.dialogFormVisible = true
      this.picData.picId = id
    },
    //详情弹窗
    showDetail(id) {
      this.picData.dialogFormVisible = true
      this.picData.picId = id
    },
    //获取列表
    getList() {
      let that = this;
      this.listShow = true
      this.listLoading = true
      org.imageFileList(this.listQuery).then(res => {
        that.list = res.data.records
        that.total = res.data.total
        that.listLoading = false;
        if (that.lastPicOrgId !== that.listQuery.orgId) {
          that.lastPicOrgId = that.listQuery.orgId;
          that.chooseList = [];
          that.imageFilepages = res.data.pages;
          for (var index = 0; index < that.imageFilepages; index++) {
            that.chooseList.push([]);
          }
        } else {
          that.funPicSelectStatus();
        }
      })
    },
    funPicSelectStatus(){
      let currentSelectList = [],
      page = this.listQuery.current;
      let that = this;
      if (!this.chooseList[page - 1]) return;
      this.chooseList[page - 1].map(index => {
        that.list.map(item => {
          if (item.id === index) {
            currentSelectList.push(item);
          }
        })
      })
      setTimeout(function () {
        that.toggleSelection(currentSelectList);
      }, 0);
    },
    //分页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    //拿tree
    getTree() {
      //需要传用户选中的id
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
    //点击树
    treeNodeClick(data) {
      this.allSelected = false;

      this.bread = []
      this.listQuery.orgId = data.id;
      this.picData.orgId = data.id
      this.getList()
      this.getBreadA(data.id)
      this.bread.reverse()
    },
    clearTreeNodeClick() {

      this.bread = []
      this.listQuery.orgId = ''
      this.listQuery.current = '1'
      this.picData.orgId = ''
      this.listShow = false
      this.list = []
      this.total = 0
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
    //删除图档
    deleteImgFile(type, ids) {
      if (type == 1 && this.funJudgeSelect().length <= 0) {
        this.$message.error('请选择需要删除的数据！')
        return
      }
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          var arr = [],
            obj = {}
          if (type == 0) {
            arr.push(ids)
          } else {
            arr = this.funJudgeSelect();
          }
          obj.ids = arr.toString()
          org.imageDelete(obj).then(res => {
            tip(res.msg)
            this.getList()
            this.funClearSelectData();
          })
        })
        .catch(_ => {})
    },
    // table 多选上传文档
    handleSelectionChange(selection, row) {
      let page  = this.listQuery.current;
      let list = [];
      if (selection) {
        selection.forEach(item => {
          list.push(item.id)
        })
      }
      this.chooseList[page - 1] = list;
      this.funJudgeSelect();
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$mt_20: 20px;
.s_o_c {
  .plPicAdd {
    width: 98px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    cursor: pointer;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .plAdd {
    padding: 0 !important;
  }
  color: red;
  box-sizing: border-box;
  padding: 0 0 $mt_20 $mt_20;
  .t_r {
    text-align: left;
  }
  .t_a {
    text-align: center;
  }
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
    overflow: hidden;
    padding-top: $mt_20/4;
    padding-bottom: 10px;
    .el-breadcrumb {
      margin-bottom: $mt_20;
    }
    .el-form.form2 {
      .el-form-item {
        width: 100%;
        .el-form-item__content {
          width: 97%;
        }
        &.form2Ta {
          width: 100%;
          .el-form-item__content {
            width: 97%;
          }
        }
      }
    }
  }
  .s_o_c
    .el-dialog__body
    .el-form.form2
    .el-form-item.form2Ta
    .el-form-item__content {
    width: 100%;
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
        &.spe_item {
          width: 100%;
          .el-form-item__content {
            width: 80%;
            .el-input {
              width: 24%;
              input {
                width: 195px;
              }
            }
          }
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
.el-message-box__btns {
  text-align: center;
  .el-button {
    padding: 12px 20px;
  }
  .el-button:nth-child(2) {
    background-color: #03aaa2;
    border-color: #03aaa2;
  }
}
.form2Ta .el-textarea__inner {
  min-height: 140px !important;
  max-height: 140px;
}
.mark_textarea .el-textarea__inner {
  // min-height: 62px !important;
  // max-height: 62px !important;
}

.picAdd .add_dia .el-dialog {
  // height: 98% !important;
  margin-top: 1vh !important;
}
.picAdd .pointDetail {
  height: 95% !important;
}

.cAppMain {
  padding-top: 20px;
}
.mapFileTransfer {
  .el-dialog {
    margin-top: 5vh !important;
  }
  .el-tree {
    max-height: 715px;
    overflow-y: auto;
  }
}
</style>
