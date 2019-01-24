<template>
  <div class="menu-wrapper">
    <template v-for="item in routers" v-if="!item.hidden&&item.children">
      <el-submenu  :index="item.name||item.path"  :type="item.type">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon" ></svg-icon>
          <span  v-if="item.meta&&item.meta.title" >{{item.meta.title}}</span>
          <i v-if="item.meta.title == '维修管理' && type != 0"  style="color:red">
            <img src="../../../../images/YY_jinggao_2.png" style="width:24px;margin-left:40px" alt="">
          </i>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden" >
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]"  :type="child.type" ></sidebar-item>
          <router-link v-else :to="{path: item.path+'/'+child.path, query: {type: child.type}}"  :type="child.type">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import org from '@/api/standing'
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        routers:[],
        type:'',
        orgId:''
      }
    },
    created(){
      let userOnly = 'USERSC' + sessionStorage.getItem('userName')
       this.orgId = sessionStorage.getItem(userOnly)
      let list = sessionStorage.getItem("SET_ROUTERS");
      const asRouters = this.getansycRoutes(this.routes,JSON.parse(list));//递归过滤
      this.routers = asRouters;
      this.get()
    },
    methods:{
      getansycRoutes(tmpRoutes, perms) {//处理角色权限
        let _t = this,arr = [];
        const result = tmpRoutes.filter(route => {
          for(let i = 0;i<perms.length;i++){
            if(perms[i].path.indexOf(route.meta.role) != -1){
              let isPush = true;
              if(arr.length>0){
                for(let k = 0;k<arr.length;k++){
                  if(route.meta.role == arr[k].meta.role){
                    isPush = false;
                  }
                }
              }
              if(isPush){
                route.type  = perms[i].type;
                arr.push(route)
              }
              if (route.children != undefined) {
                route.children = _t.getansycRoutes(route.children, perms);
              }
            }
          }
        });
        return arr
      },
      get(){
      org.get(this.orgId).then(res => {
       this.type = res.data
      })
    }
    }
  }
</script>
<style>
</style>

