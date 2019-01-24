<template>
  <div class="app-container">
    <!--列表-->
    <div class="el-col el-col-24" style="border-radius: 5px;">
      <el-table :data="list" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="name" label="功能">
        </el-table-column>
        <el-table-column prop="detail" label="描述">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope" >
            <span :type="scope.row.status"  v-if="scope.row.status == 1">停用</span>
            <span :type="scope.row.status"  v-if="scope.row.status == 0">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作 " v-if="isType">
          <template slot-scope="scope" >
            <el-button size="small" type="danger"  v-if="scope.row.status == 0" @click="updateStatus(scope.row.workBenchId,1)">停用</el-button>
            <el-button size="small" type="success" v-if="scope.row.status == 1" @click="updateStatus(scope.row.workBenchId,0)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
  import system from '@/api/system'
  import { tip,xiaZai } from '@/utils/tip'

  export default {
    data() {
      return {
        isType:false,
        list: null,
        listLoading: true,
      }
    },
    created() {
      this.getList();
      if(this.$route.query.type == 1){
        this.isType = false
      }else{
        this.isType = true
      }
    },
    methods: {
      getList() {
        this.listLoading = true
          system.departWorkBenchList().then(response => {
            this.list = response.data;
            this.listLoading = false
        })
      },
      updateStatus(workBenchId,status) {
          let params = {workBenchId:workBenchId,status:status};
          system.departWorkBenchUpdate(params).then(res => {
            tip(res.msg);
            this.getList()
        })
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
