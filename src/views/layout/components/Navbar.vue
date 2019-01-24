<template>
  <div class="mian-navbar-container">
    <el-menu class="navbar" mode="horizontal">

      <div style="display: inline-block;">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <breadcrumb></breadcrumb>
      </div>
      <div class="switchover">
        <span class="statusbar-mid-container">{{navigationTitle}}
      </span>
      </div>

      <div class="avatar-container" style="right: 10px;">
        <!--切换企业-->
        <span @click="switchCompanies" style="cursor: pointer;">切换企业</span> &nbsp;&nbsp; |&nbsp;&nbsp;
        <svg-icon icon-class="user" style="
         color: #fff;
          margin-right: 5px;
          font-size: 18px;
          display: inline-block;
          border-radius: 50%;
          background-color: #16938B;
          height: 25px;
          width: 25px;
          position: relative;
          top: 4px;"></svg-icon>
        <span style="font-size: 16px">{{name}}</span>&nbsp;&nbsp; |&nbsp;&nbsp;
        <span @click="changePwd" style="cursor: pointer;">修改密码</span>&nbsp;&nbsp; |&nbsp;&nbsp;
        <span @click="logout" style="cursor: pointer;">退出系统</span>
      </div>
    </el-menu>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="320px">
      <el-form :inline="true">
        <el-form-item label="原密码：">
          <el-input type="password" v-model="send.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input type="password" v-model="send.newPass"></el-input>
        </el-form-item>
        <el-form-item class="t_a" style="width: 100%;padding-left: 35px">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="success" @click="surePwd">确 定</el-button>
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
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { getToken, setToken, removeToken } from '@/utils/auth'
  import { resetPwd, companiesList } from '@/api/login'
  import { tip, xiaZai } from '@/utils/tip'
  import companyDialog from '@/components/Dialog/chooseDialog'


  var md5 = require('js-md5')

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      companyDialog,
    },
    computed: {
      ...mapGetters(['sidebar', 'avatar'])
    },
    data() {
      return {
        dialogVisible: false,
        treesData: [],
        selectTrees: [],
        treeDataA: [],
        companySelectData: {
          dialogVisible:false,
          selectTreeData: {},
          defaultTreeId: '',
          treeName: '',
          level: '3',
        },
        navigationTitle: '企业',
        name: '',
        send: {
          newPass: '',
          oldPass: ''
        },
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          removeToken('token')
          removeToken('name')
          removeToken('SET_ROUTERS')
          removeToken('niceName')
          removeToken('userType')
          removeToken('userName')
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      changePwd() {
        this.dialogVisible = true
      },
      //切换企业
      switchCompanies() {
        this.companySelectData.dialogVisible = true;
      },
      sureSwitch() {
        this.navigationTitle = this.companySelectData.treeName;
        //save
        let treeId = this.companySelectData.selectTreeData.id;
        //设置全局的用户选择企业
        let selectCompanyKey = 'USERSCNAME' + sessionStorage.getItem('userName');
        //设置全局的用户选择企业
        sessionStorage.setItem(selectCompanyKey, this.companySelectData.treeName);
//设置全局的用户企业
        let userOnly = 'USERSC' + sessionStorage.getItem('userName')
        sessionStorage.setItem(userOnly, this.companySelectData.selectTreeData.id)
        //        选择企业用户
        this.$root.eventHub.$emit('EVENT_SWITCH_COMPANY', treeId);
      },

      surePwd() {
        if (!this.send.oldPass || !this.send.newPass) {
          return tip('输入不完整', 'error')
        }
        if (this.send.oldPass == this.send.newPass) {
          return tip('新密码不能与原密码想同', 'error')
        }
        if (this.send.newPass.length < 6) {
          return tip('密码至少6位数', 'error')
        }
        let newPwdReg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/
        if (!newPwdReg.test(this.send.newPass)) {
          return tip('密码必须包含字母和数字', 'error')
        }

        var obj = {
          newPass: md5(this.send.newPass),
          oldPass: md5(this.send.oldPass)
        }
        resetPwd(obj).then(response => {
          tip(response.msg)
          this.dialogVisible = false
          removeToken('token')
          removeToken('name')
          removeToken('SET_ROUTERS')
          removeToken('niceName')
          removeToken('userType')
          removeToken('userName')
          location.reload()
        })
      },

      //第一次进入的时候可能没有选择则自动选择用户默认的
      //切换企业
      getCompanyList(treeId) {
        this.treesData = [];
        //请求企业接口
        let parames = {
          orgId: treeId,
          level: '3',
        };
        let that = this
        companiesList(parames).then(res => {
          that.treesData = res.data
          that.treeDataA = [];
          let curTree = that.getTreeA(that.treesData);
          for(let i = 0;i<curTree.length;i++){
            for(let j = 0;j<curTree[i].length;j++){
              that.treeDataA.push(curTree[i][j])
            }
          }
          var r = [];
          for(var i = 0, l = that.treeDataA.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
              if (that.treeDataA[i].id == that.treeDataA[j].id) j = ++i;
            r.push(that.treeDataA[i]);
          }
          that.treeDataA = r;
          //选择默认的
          that.selectTrees = [];
          that.getBreadA(treeId);
          that.selectTrees.reverse();
          that.companySelectData.treeName = this.selectTrees.join(' / ');
          that.sureSwitch();
        })
      },
      getTreeA(tree, path, currentPath) {

        var currentPath = currentPath || [];
        var path = path || [];

        for(let i = 0; i < tree.length; i++) {
          var tmpTree = tree[i];
          if(i !== 0) currentPath.pop();
          currentPath.push({name:tmpTree.name,id:tmpTree.id,parentId:tmpTree.parentId});
          if(tmpTree.children.length) {
            this.getTreeA(tmpTree.children, path, currentPath);
          }else {
            path.push(currentPath.slice(0));
          }
        }
        currentPath.pop();
        return path;
      },
      getBreadA(id){
        var _t = this;
        _t.treeDataA.forEach(function(e){
          if(e.id == id){
            _t.selectTrees.push(e.name);
            if(e.parentId){
              _t.getBreadA(e.parentId)
            }
          }
        })
      },

    },
    created() {

      this.name = sessionStorage.getItem('niceName')
      //设置全局的用户选择企业
      let selectCompanyKey = 'USERSCNAME' + sessionStorage.getItem('userName');
      this.navigationTitle = sessionStorage.getItem(selectCompanyKey);

      if (!this.navigationTitle) {
        let userOnly = 'USERSC' + sessionStorage.getItem('userName');
        let orgId = sessionStorage.getItem(userOnly);
        this.companySelectData.selectTreeData.id = orgId;
        this.getCompanyList(orgId);
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .statusbar-mid-container {
      /*display:block;*/
      /*widht:120px;*/
      /*text-align:center;*/
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .el-menu--horizontal {
    border-bottom: none;
    box-shadow: 0 5px 10px 0 #def3e0;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .mian-navbar-container {

  }
  .switchover{
    width: 100%;
    position: absolute;
    top: 0;
    text-align: center;
    color: rgb(3, 147, 139);
    font-size: 22px;
  }
</style>

