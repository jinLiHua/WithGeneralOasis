<template>
  <div class="app-container" v-loading="listLoading" border fit
       highlight-current-row element-loading-text="拼命加载中" style="width: 100%;height: 500px">
    <el-radio-group text-color="#FFFFFF" fill="#03938B" v-model="tabPosition" @change="handleClick"
                    style="margin-bottom: 10px">
      <el-radio-button :label="0" size="large">石油炼制系数</el-radio-button>
      <el-radio-button :label="1" size="large">石油化工系数</el-radio-button>
    </el-radio-group>
    <el-row>
      <el-col :span="24">
        <el-col :span="12" class="content-container">
          <div style="font-weight: bold;font-size: 18px ;padding: 15px 0">只针对法兰和连接件</div>
          <el-form v-if="tabPosition==0" :inline="true">
            <el-form-item label=" >10000umol/mol排放系数（kg/h/排放源）：" style="font-size: 16px">
              <el-input v-model="tab0GreaterThan" placeholder="浮点输入"
                        v-on:change="checkInput(tab0GreaterThan,0)"></el-input>
            </el-form-item><!-- :oninput="checkInput(this)"-->
          </el-form>
          <el-form v-if="tabPosition==0" :inline="true" style="margin-top: 10px">
            <el-form-item label=" <10000umol/mol排放系数（kg/h/排放源）：">
              <el-input v-model="tab0LessThan" placeholder="浮点输入" v-on:change="checkInput(tab0LessThan,1)"></el-input>
            </el-form-item>
          </el-form>
          <el-form v-if="tabPosition==1" :inline="true">
            <el-form-item label=" >10000umol/mol排放系数（kg/h/排放源）：">
              <el-input v-model="tab1GreaterThan" placeholder="浮点输入"
                        v-on:change="checkInput(tab1GreaterThan,2)"></el-input>
            </el-form-item>
          </el-form>
          <el-form v-if="tabPosition==1" :inline="true" style="margin-top: 10px">
            <el-form-item label=" <10000umol/mol排放系数（kg/h/排放源）：">
              <el-input v-model="tab1LessThan" placeholder="浮点输入" :oninput="checkInput(tab1LessThan,3)"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="success" @click="submitData()" style="width: 150px;margin: 30px auto 20px 150px" v-if="isType">确定
          </el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import system from '@/api/system'
  import {tip,xiaZai} from '@/utils/tip'

  export default {
    // name: "system_screening.vue",
    data() {
      return {
        tabPosition: 0,
        listLoading: false,
        tab0LessThan: "0",
        tab0GreaterThan: "0",
        tab1LessThan: "0",
        tab1GreaterThan: "0",
        result: {
          createTime: null,
          equipType: 0,
          greaterThanValue: 0,
          id: 0,
          lessThanValue: 0,
          updateTime: null,
          isType:false
        },
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
      handleClick(label) {
        this.tabPosition = label;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        system.getScreenSettingList(this.tabPosition).then(response => {
          this.listLoading = false;
          this.result = response.data[0];
          if (this.tabPosition == 0) {
            this.tab0LessThan = this.result.lessThanValue;
            this.tab0GreaterThan = this.result.greaterThanValue;
          } else {
            this.tab1LessThan = this.result.lessThanValue;
            this.tab1GreaterThan = this.result.greaterThanValue;
          }
        })
      },
      submitData() {
        if (this.tabPosition == 0) {
          if (null == this.tab0LessThan || this.tab0LessThan == '' ||
            null == this.tab0GreaterThan || this.tab0GreaterThan == '') {
            this.$alert("请输入参数！");
            return;
          }
          this.result.lessThanValue = this.tab0LessThan;
          this.result.greaterThanValue = this.tab0GreaterThan;
        } else {
          if (null == this.tab1LessThan || this.tab1LessThan == '' ||
            null == this.tab1GreaterThan || this.tab1GreaterThan == '') {
            this.$alert("请输入参数！");
            return;
          }
          this.result.lessThanValue = this.tab1LessThan;
          this.result.greaterThanValue = this.tab1GreaterThan;
        }
        this.result.updateTime = null;
        const param = {};
        param.equipType = this.result.equipType;
        param.id = this.result.id;
        param.greaterThanValue = this.result.greaterThanValue;
        param.lessThanValue = this.result.lessThanValue;
        system.updateScreenSetting(param).then(response => {
          this.$message({
            message: '更新成功！',
            type: 'success'
          });
        })
      },
      checkInput(obj, index) {
        let temp = obj.toString();
        //先把非数字的都替换掉，除了数字和.
        temp = temp.replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是.
        temp = temp.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        temp = temp.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        temp = temp.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (100000000 <= parseFloat(obj)) {
          temp = "";
        }
        switch (index) {
          case 0:
            this.tab0GreaterThan = temp;
            break;
          case 1:
            this.tab0LessThan = temp;
            break;
          case 2:
            this.tab1GreaterThan = temp;
            break;
          case 3:
            this.tab1LessThan = temp;
            break;
        }
      },
    }
  }
</script>

<style type="text/css" scoped>
  .content-container {
    width: 50%;
    padding-left: 30px;
    padding-right: 30px;
  }

  .el-input__inner {
    font-size: 16px;
  }
</style>
