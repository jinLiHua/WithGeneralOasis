<!--相关方程法-->
<template>
  <div class="app-container my_aecp_main" v-loading="listLoading" border fit
       highlight-current-row element-loading-text="拼命加载中" style="width: 100%;height: 500px">
    <el-container>
      <el-main>
        <div style="overflow: hidden">
          <el-radio-group text-color="#FFFFFF" fill="#03938B" v-model="tabPosition" @change="handleSelect">
            <el-radio-button :label="0" size="large">石油炼制系数</el-radio-button>
            <el-radio-button :label="1" size="large">石油化工系数</el-radio-button>
          </el-radio-group>
          <div style="float:right">
            <el-button type="text" style="color: #333333" @click="saveSettingParames()"><svg-icon icon-class="s-save" v-if="isType"/> 保存</el-button>
          </div>
        </div>
        <div style="margin-top: 10px;margin-bottom:20px;background-color: white">
          <div style="padding: 10px">
            <el-table
              :data="tableData"
              :span-method="objectSpanMethod"
              border
              style="width: 100%">
              <el-table-column
                prop="number"
                label="序号"
                width="150">
              </el-table-column>
              <el-table-column
                prop="typeName"
                label="密封点类型"
                width="150">
              </el-table-column>

              <el-table-column
                prop="phaseName"
                label="相态"
                width="150">
              </el-table-column>

              <el-table-column
                label="排放系数（kg/h/排放源）">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.emissionCoefficient" v-on:change="inputChange(scope.row, 0)" placeholder="请输入">
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>

</template>

<script>

  import system from '@/api/system'
  import { tip,xiaZai } from '@/utils/tip'
  import SvgIcon from "../../components/SvgIcon/index.vue";

  export default {
    components: {SvgIcon},
    data() {
      return {
        isType:false,
        tableData: [],  //显示的数据啊
        updateData: [], //需要更新的数据
        tabPosition:0,
        listLoading: false,
      };
    },
    methods: {
      handleSelect(e) {
        this.listLoading = true;
        this.getParamesSettingList(e)
      },
      inputChange(value, index) {
        value.emissionCoefficient = parseFloat(value.emissionCoefficient)
        var isExit = false;
        for (var item of this.updateData) {
          if (item.id == value.id) {
            item = value
            isExit = true
            break;
          }
        }
        if (!isExit) this.updateData.push(value);
      },
      getParamesSettingList(type) {
        var that = this;
        system.getParamesList(type).then(response => {
          that.listLoading = false
          var data = response.data
          data.forEach(function (element, index) {
            element.number = index + 1;
          });
          that.tableData = data;
        })
      },
      saveSettingParames() {
        var listData = [];
        this.updateData.forEach(function (element) {
          const tmpData = {
            'emissionCoefficient': element.emissionCoefficient,
            'id': element.id
          };
          listData.push(tmpData)
        })
        if (listData.length == 0) return;
        this.updateSetting(listData)
      },
      updateSetting(parames) {
//        提交参数设置
        system.updateParamesSetting(parames).then(response => {
          if (response.msg) {
            tip(response.msg);
          } else  {
            tip('保存成功', 'success');
            this.updateData.splice(0,this.updateData.length)
          }
        })
      },
      //      合并单元格方法
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if  (columnIndex === 1) {
          if (rowIndex % 3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            };
          } else  {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
    },
    watch: {
      /*
      * tableData: {
        handler(newValue, oldValue) {
        },
        deep: true
      }*/
    },
    created() {
      //获取参数设置相关借口
      this.getParamesSettingList(0)
      if(this.$route.query.type == 1){
        this.isType = false
      }else{
        this.isType = true
      }
    },
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  .my_aecp_main {
    .el-radio-button__inner {
      border: 1px solid #f5f7fa;
    }
    .el-radio-button__inner:hover {
      color: #03938B;
    }
  }
</style>
