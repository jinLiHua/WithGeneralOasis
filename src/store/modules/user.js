import { login, logout, getInfo ,permissionMenu} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRouterMap } from '@/router/index'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    routers: [],
    perms:false//判断是否刷新过页面
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTERS: (state, asRouters) => {
      state.routers = asRouters;
      state.perms = false;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data;
          setToken(data);
          commit('SET_TOKEN', data);
          permissionMenu().then(res => {
            /*let  arrs = "/login,/404,/";
            res.data.forEach(function(item) {
              arrs+=","+item.router
            });
            sessionStorage.setItem("SET_ROUTERS", arrs);*/
            let  arrs = [
              {path:'/login',type:0},
              {path:'/404',type:0},
              {path:'/',type:0},
            ];
            res.data.forEach(function(item) {
              arrs.push({path:item.router,type:item.readWritePermission})
            });
            sessionStorage.setItem("SET_ROUTERS", JSON.stringify(arrs));
            resolve()

          }).catch(error => {
            removeToken('token');
            removeToken('name');
            removeToken('SET_ROUTERS');
            removeToken('niceName');
            removeToken('userType');
            removeToken('userName');
          })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data;
          commit('SET_ROLES', data.roles);
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.avatar);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    setRouters({ commit, state }) {
      return new Promise((resolve, reject)=>{ //动态加载路由权限

        // const arrs = "/login,/404,/,/systenMa,/userma,/userma,/role,icon,/RoleManagement,/dataDictionary,/systemLog,/resourceMa,/spareParts,/statisticalAnalysis"

        resolve()
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken('token');
        removeToken('name');
        removeToken('SET_ROUTERS');
        resolve()
        //logout(state.token).then(() => {
        //
        //  resolve()
        //}).catch(error => {
        //  reject(error)
        //})
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve()
      })
    }
  }
}

export default user
