<template>
  <div class="app-container thisUser">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;border-radius: 5px;">
      <el-form :model="form1.condition" :inline="true">
        <el-form-item label="登录账号：">
          <el-input v-model="form1.condition.like.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="querys">查询</el-button>
        </el-form-item>

        <el-button
          type="success"
          style="float: right"
          v-if="isType"
          @click="()=>{
                this.form.id = '',
                this.resetFields()
                this.idshow = true;
                this.dialogFormVisible = true
              }">新建用户
        </el-button>
      </el-form>
    </el-col>
    <!--列表-->
    <div class="el-col el-col-24" style="border-radius: 5px;">

      <el-table
        :data="list"
        v-loading="listLoading"
        border fit highlight-current-row
        element-loading-text="拼命加载中" style="width: 100%;">
        <!--<el-table-column
          type="selection"
          width="55">
        </el-table-column>-->
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="username" label="登录账号">
        </el-table-column>
        <el-table-column prop="nickname" label="姓名">
        </el-table-column>
        <el-table-column prop="userExt.phone" label="联系电话">
        </el-table-column>
        <el-table-column prop="departmentName" label="企业">
        </el-table-column>
        <!--<el-table-column prop="departmentType" label="单位类型">
          <template slot-scope="scope" >
            <span :type="scope.row.departmentType"  v-if="scope.row.departmentType == 0">管理组织</span>
            <span :type="scope.row.departmentType"  v-if="scope.row.departmentType == 1">授权企业用户</span>
            <span :type="scope.row.departmentType"  v-if="scope.row.departmentType == 2">企业用户</span>
            <span :type="scope.row.departmentType"  v-if="scope.row.departmentType == 3">监督单位</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="role.name" label="角色">
        </el-table-column>
        <el-table-column prop="operation" label="操作 " width="180">
          <template slot-scope="scope">
            <i class="el-icon-tickets success btn" title="编辑/详情" @click="dialogopen(scope.row)"></i>
            <i class="el-icon-edit primary btn" title="修改密码" @click="dialogPass(scope.row.id)" v-if="isType"></i>
            <i class="el-icon-delete danger btn"  @click="deleteRow(scope.row)" title="删除" v-if="isType"></i><!--v-if="isType"-->
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="text-align:center;margin-top:20px">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total,prev, pager, next"
          :total="totals">
        </el-pagination>
      </el-col>
    </div>


    <!--弹出框  新增用户-->
    <el-dialog title="用户" :visible.sync="dialogFormVisible" width="800px" class="system_User">
      <el-form :model="form"  ref="form" :rules="rules" :inline="true">

        <el-form-item v-if="false" label="" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role.id" clearable placeholder="请选择角色">
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业" :label-width="formLabelWidth" prop="departmentId">
          <el-input v-model="selectCompanyName"
                    v-on:click.native="companySelect"
                    placeholder="请选择企业"
                    readonly>
          </el-input>
        </el-form-item>

        <el-form-item label="姓名" :label-width="formLabelWidth"  prop="nickname">
          <el-input v-model="form.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="userExt">
          <el-input v-model="form.userExt.phone" auto-complete="off"  @change="validatePhone"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" auto-complete="off" @change="onlyUser"></el-input>
        </el-form-item>
        <el-form-item  v-if="idshow" label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off" prop="nickname"></el-input>
        </el-form-item>
        <el-form-item  v-if="idshow" label="密码确认" :label-width="formLabelWidth" prop="passwordSure">
          <el-input type="password" v-model="form.passwordSure" @change="surePWD" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" :label-width="formLabelWidth" class="text_area" style="width: 100%" prop="note">
          <el-input type="textarea" v-model="form.note" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer t_a">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click="dialogclose('form')" v-if="isType">确 定</el-button>
      </div>
    </el-dialog>


    <!--修改密码-->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="326px">
      <el-form :inline="true">
        <el-form-item label="新密码：">
          <el-input type="password" v-model="send.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item class="t_a" style="width: 100%;padding-left: 33px">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="success" @click="resetSurePwd" v-if="isType">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <companyDialog
      @selectHandle="sureSwitch"
      :dialogData="companySelectData">
    </companyDialog>
  </div>
</template>

<script>
  import { getuser,getRole,dictTree,adduser,deluser,getuserDetail } from '@/api/systemMan'
  import { validatTelephone } from '@/utils/validate'
  import system from '@/api/system'
  import { tip,xiaZai } from '@/utils/tip'
  import { companiesList } from '@/api/login'
  import companyDialog from '@/components/Dialog/chooseDialog'

  var md5 = require('js-md5');
  export default {
    components:{companyDialog},
    data() {
      return {
        isType:false,
        send:{
          password:'',
          id:''
        },
        companySelectData: {
          dialogVisible:false,
          selectTreeData: {},
          treeName: '',
          orgId: '',
          level: '3',
          defaultTreeId: '',
        },
        dialogVisible:false,
        list: null,
        listLoading: true,
        total: 0,
        page: 1,
        totals:0,
        sizes:0,
        idshow:true,
        input: '',
        options3: [],
        list_unit: [],
        value: '',
        value1: '',
        value3: '',
        value4: '',
        gridData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        selectCompanyName: '',
        selectTrees: [],
        treeDataA: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        form: {
          "nickname": '',
          "id": '',
          "password": '',
          "passwordSure": '',
          role: {
            "id": ''
          },
          departmentId:'',
          note:'',
          userExt: {
            "phone": ""
          },
          "username": ""
        },
        form1:{
          "current":1,
          "size":10,
          "condition":{
            "like":
              {"username":""}
          }
        },
        formLabelWidth: '120px',
        listQuery:{
          current:1,
          size:100
        },
        only:true,
        rules: {
          role:[
            { type: 'object', required: true,
              fields: { id: [{ type: "number", required: true, message: "请选择用户角色", trigger: 'change'}] }
            }
          ],
          departmentId: [
            { required: true, message: '请选择企业', trigger: 'change' },
          ],
          nickname: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          userExt: [
            { type: 'object', required: true,
              fields:
                { phone: [
                  {required: true, message: "请输入手机号", },
                  {required: false, message: " 联系电话输入有误！", pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,}
                ]
                }
            }
          ],
          username:[
            { required: true, message: '请输入登录账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' },
            { min: 6, message: '密码最少六位数', trigger: 'blur' },
            {required: true, message: "密码必须包含数字字母", pattern: /^[0-9A-Za-z]+$/,},
            {required: true, message: "密码必须包含数字字母", pattern: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,}

          ],
          passwordSure: [
            { required: true, message: '请填写确认密码', trigger: 'blur' },
            { min: 6, message: '密码最少六位数', trigger: 'blur' },
            {required: true, message: "密码必须包含数字字母", pattern: /^[0-9A-Za-z]+$/,},
            {required: true, message: "密码必须包含数字字母", pattern: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,}
          ],
          note: [
            { required: true, message: '请输入用户描述', trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this.getList();
      this.fetchData();
      this.createdData();

      //需要传用户选中的id
      let userOnly = 'USERSC' + sessionStorage.getItem('userName');
      let selectId = sessionStorage.getItem(userOnly);
      this.companySelectData.orgId = selectId;

      if(this.$route.query.type == 1){
        this.isType = false
      }else{
        this.isType = true
      }

      let that = this;
      this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', (val)=>{
        that.companySelectData.orgId = val;

      });
    },
    methods: {
      resetSurePwd(){
        if (this.send.password.length < 6) {
          return tip('密码至少6位数', 'error');
        }
        let newPwdReg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
        if (!newPwdReg.test(this.send.password)) {
          return tip('密码必须包含字母和数字', 'error')
        }

        this.send.password = md5(this.send.password);
        system.resetPwd(this.send).then(res => {
          tip(res.msg);
          this.dialogVisible = false;
          this.send={
            password:'',
            id:''
          };
        })
      },

      //切换企业
      companySelect() {
        this.companySelectData.dialogVisible = true;
      },
      sureSwitch(val) {
        this.form.departmentId = val;
        this.selectCompanyName = this.companySelectData.treeName;
      },
      dialogPass(id){
        this.dialogVisible = true;
        this.send.id = id;
      },
      surePWD(){
        if(this.form.passwordSure!=this.form.password){
          tip('密码输入不一致！','error')
        }
      },
      //用户名唯一性彦只能怪
      onlyUser(){
        system.onlyUser({username:this.form.username}).then(res => {
          if(!res.data){
            this.only = false;
            tip('用户已存在，请更改登录账号！','error')
          }else{
            this.only = true
          }
        })
      },
      //获取单位列表
      getList() {
        system.departmentListUser(this.form.username).then(res => {
          this.list_unit = res.data;
        })
      },
      validatePhone(){
        if(!validatTelephone(this.form.userExt.phone)){
          tip('联系电话输入有误！','error');
        }
      },
      fetchData() {
        var self = this;
        this.listLoading = true;
        getuser(this.form1).then(response => {
          this.listLoading = false
          self.list = response.data.records
          self.totals = response.data.total;
          //  self.totals = 50;
          self.sizes = response.current
        })
      },
      resetFields(){
        this.form = {
          departmentId:'',
          note:'',
          "nickname": "",
          "password": "",
          "role": {
            "id": ""
          },
          "userExt": {
            "phone": ""
          },
          "username": ""
        }
      },
      createdData(){
        var page = {
          size:100,
          current:1,
        };
        system.getRoleUser().then(res => {
          this.options3 = res.data;
        })
      },
      handleCurrentChange(val) {
        this.form1.current = val;
        this.fetchData()
      },
//      创建用户
      dialogclose(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.submitFormData()
          } else {
            return false;
          }
        });
      },
      submitFormData() {
        if(this.only){
          if(this.idshow){
            this.form.password = md5(this.form.password);
          }
          adduser(this.form).then(res => {
            this.fetchData()
            this.dialogFormVisible=false;
          })
        }else{
          tip('用户已存在，请更改用户名！','error')
        }
      },
      dialogopen(e){
        this.idshow = false;
        this.form.id = e.id;
        getuserDetail(e.id).then(res => {
          this.form = res.data;
          this.companySelectData.defaultTreeId = res.data.departmentId
        })
        this.dialogFormVisible=true;
      },
      deleteRow(e){
        this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
          .then(_ => {
            deluser(e.id).then(res => {
              this.fetchData()
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              this.dialogFormVisible=false;
              this.getList()
            })
          })
          .catch(_ => {});
      },
      querys(){
        this.fetchData()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .thisUser{
    .el-input__inner{
      width: 200px !important;
    }
    .el-form--inline .text_area .el-form-item__content{
      width: 70.5%;
    }
    .el-form--inline .el-form-item__content{
      width: 200px;
    }
    .system_User{
      .el-form-item{
        margin-bottom: 16px;
      }
    }
    /*.el-form-item {*/
      /*margin-bottom: 22px;*/
    /*}*/
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
