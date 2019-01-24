<template>
  <scroll-bar>

    <div class="top_logo"><a href="#/indexall" class=""><img src="../../../../images/login_logo.png" alt=""></a></div>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="transparent" text-color="#fff" active-text-color="#fff">
      <sidebar-item :routes="routes" ></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>

import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },

  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  // methods:{
  //   get(){
  //     org.get(0).then(res => {
  //       alert(1)
  //     })
  //   }
  // },
  // created(){
  //   this.get()
  // }
}
</script>

<style  rel="stylesheet/scss" lang="scss" >
  @import '../../../../styles/variables.scss';
  @import "../../../../styles/table.scss";
  $bg_tran:transparent!important;
  .top_logo{
    box-sizing: border-box;
    padding: 30px 40px 50px 20px;
    img{
      width: 100%;
    }
  }
  .el-submenu.is-opened{
    background: -webkit-linear-gradient($transFFU); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient($transFFU); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient($transFFU); /* Firefox 3.6 - 15 */
    background: linear-gradient($transFFU); /* 标准的语法（必须放在最后） */
  }
  .el-submenu__title{
    font-size: 18px;
    i{
      color: #fff;
    }
    &:hover{
         background-color: $bg_tran;
     }
  }
  .el-menu-item{
    font-size: 18px;
  }
  .el-submenu .el-menu-item{
    height: 60px;
    line-height: 60px;
  }

  #app .el-submenu .el-menu-item{
    background-color: $bg_tran;
    padding-left: 60px!important;
  }
   #app .el-submenu .el-menu-item:hover,
  .el-menu-item:focus, .el-menu-item:hover{
    background-color: $bg_tran;
  }
  #app .hideSidebar .el-submenu .el-menu-item,
  #app .hideSidebar .el-submenu .el-menu-item:hover,
  .el-menu-item:focus{
    background: -webkit-linear-gradient($transFFU); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient($transFFU); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient($transFFU); /* Firefox 3.6 - 15 */
    background: linear-gradient($transFFU); /* 标准的语法（必须放在最后） */
  }
  #app .hideSidebar .el-submenu .el-menu-item,
  #app .hideSidebar .el-submenu .el-menu-item:hover
  {
    padding-left: 30px!important;
  }
  .el-menu-item, .el-submenu__title{
    height: 65px;
    line-height: 56px;
  }
</style>
