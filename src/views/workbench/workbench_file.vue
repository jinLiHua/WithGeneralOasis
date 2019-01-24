<template>
  <div class="app-container thisFile">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item label="文件名称:">
          <el-input v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-button type="success" @click="getList()">查询</el-button>
        <el-button type="danger" id="btnDel" v-if="isShowDelBtn && isType" @click="deleteRows()" style='float:right'>批量删除</el-button>

      </el-form>
    </el-col>
    <!--列表-->
    <div class="el-col el-col-24" style='margin-top:10px'>
      <!-- <el-form :inline="false" class="table_do">
        <el-form-item>
          <el-button type="danger" id="btnDel" v-if="isShowDelBtn && isType" @click="deleteRows()">批量删除</el-button>
        </el-form-item>
      </el-form> -->
      <el-table :data="list" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="originalName" label="文件名">
        </el-table-column>
        <el-table-column label="大小" :formatter=formatSize>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{scope.row.createTime.split(' ')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人">
        </el-table-column>
        <el-table-column prop="operation" label="操作 ">
          <template slot-scope="scope">
            <i class="el-icon-download success btn" @click="download(scope.row)" title="下载"></i>
            <i class="el-icon-delete danger btn" @click="deleteRows(scope.row)" title="删除" v-if="isType"></i>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev,total,pager, next" @current-change="handleCurrentChange" :total=total :page-size="10" style="text-align:center;">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
import workbench from '@/api/workbench'
import { tip, xiaZai, baseUrl } from '@/utils/tip'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      isShowDelBtn: false,
      total: 0, //数据总数量
      page: 1,
      listQuery: {
        name: '',
        current: 1,
        size: 10
      },
      ids: [],
      isType: false
    }
  },
  created() {
    this.getList()
    this.isShowDelBtn = sessionStorage.getItem('userType') > 0
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      workbench.fileList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.records
        this.total = response.data.total
        this.page = response.data.pages
      })
    },
    //table多选
    handleSelectionChange(val) {
      this.ids = val
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    download(a) {
      let base = baseUrl()
      let url = base + a.url.split('.')[0]
      xiaZai(url)
      // window.open( base + a.url.split('.')[0]);
    },
    deleteRows(params) {
      const arr = [],
        obj = {}
      if (params) {
        arr.push(params.id)
      } else {
        if (this.ids.length == 0) {
          return tip('请选择需要删除的文件！', 'error')
          return
        }
        for (let i = 0; i < this.ids.length; i++) {
          arr.push(this.ids[i].id)
        }
      }
      obj.ids = arr.toString()
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          workbench.deleteFile(obj).then(response => {
            this.getList()
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          })
        })
        .catch(_ => {})
    },
    formatSize(row, col) {
      const value = row.size
      if (null == value || value == '') {
        return '0 Bytes'
      }
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      let srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / Math.pow(1024, index)
      size = size.toFixed(2) //保留的小数位数
      return size + unitArr[index]
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '../../styles/table.scss';

.thisFile {
  .table_do {
    text-align: right;
  }
  .el-dialog {
    width: 50%;
  }
  .add_dia {
    .el-form-item__content {
      box-sizing: border-box;
      padding-left: 20px;
      margin-left: 18px !important;
      padding-right: 35px;
    }
    .el-form-item__label {
      padding-left: 40px;
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
}
</style>
