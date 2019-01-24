<template>
  <!--<div class="app-container thisUnit">-->
  <div class="s_o_c">
    <el-container>

      <el-aside width="350px">
        <div class="tree_head">单位管理</div>
        <el-tree class="filter-tree"
                 @node-click="treeNodeClick"
                 :data="treeData"
                 :props="defaultProps"
                 :filter-node-method="filterNode"
                 ref="tree2">
        </el-tree>
      </el-aside>

      <el-main>

        <el-breadcrumb  separator="--" v-if="bread.length>0">
          <span class="bread_text"><i class="el-icon-location"></i> 当前组织：</span>
          <el-breadcrumb-item v-for="item in bread" style="float:none">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0; border-bottom: 10px solid #f5fcf5">
          <el-form :inline="true">
            <el-form-item label="单位名称:">
              <el-input v-model="listQuery.name"></el-input>
            </el-form-item>
            <el-button type="success" @click="getList()">查询</el-button>
          </el-form>
        </el-col>


        <!--列表-->
        <div class="el-col el-col-24" style="border-radius: 5px;">
          <el-form :inline="false" class="table_do">
            <el-form-item>
              <el-button type="success" v-if="selectTree && isType" @click="dialogFormVisible = true">新增</el-button>
              <!--<el-button type="success">批量删除</el-button>-->
            </el-form-item>
          </el-form>
          <el-table :data="list" v-loading="listLoading" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="单位名称">
            </el-table-column>
            <el-table-column prop="responsibler" label="责任人">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
            <el-table-column prop="operation" label="操作 ">
              <template slot-scope="scope" >
                <i class="el-icon-tickets success btn" title="编辑/详情" @click="getInfo(scope.row.id)"></i>
                <i class="el-icon-delete danger btn"  @click="deleteUnit(scope.row.id)" title="删除" v-if="isType"></i><!--v-if="isType"-->
              </template>
            </el-table-column>

          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next"
                           :page-size="10"
                           @current-change="handleCurrentChange"
                           :total="total"
                           style="text-align:center;">
            </el-pagination>
          </el-col>
        </div>

      </el-main>
    </el-container>


    <el-dialog class="s_o_c breadt_a" :title="dia_titile" :visible.sync="dialogFormVisible" width="700px">

      <el-form :model="diaAdd" :rules="rules" ref="diaAdd" :inline="false" class="add_dia">
        <el-form-item :label-width="formLabelWidth" label="单位名称:" prop="name">
          <el-input v-model="diaAdd.name" auto-complete="off" placeholder="单位名称"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="单位地址:">
          <el-input v-model="diaAdd.address" auto-complete="off" placeholder="单位地址"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="联系电话:">
          <!--<el-input v-model="diaAdd.mobile" auto-complete="off" placeholder="联系电话" @change="validatePhone"></el-input>-->
          <el-input v-model="diaAdd.mobile" auto-complete="off" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="负责人:">
          <el-input v-model="diaAdd.responsibler" auto-complete="off" placeholder="负责人"></el-input>
        </el-form-item>
        <!--<el-form-item label="单位类型:">-->
        <!--<el-radio v-model="diaAdd.type" label="0" style="margin-left: 7px">管理组织</el-radio>-->
        <!--<el-radio v-model="diaAdd.type" label="1">授权企业用户</el-radio>-->
        <!--<el-radio v-model="diaAdd.type" label="2">企业用户</el-radio>-->
        <!--<el-radio v-model="diaAdd.type" label="3">监管单位</el-radio>-->
        <!--</el-form-item>-->
        <el-form-item :label-width="formLabelWidth" label="单位描述:">
          <el-input type="textarea" :rows="3" v-model="diaAdd.description" placeholder="单位描述"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click="addEdit" v-if="isType">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import system from '@/api/system'
  import org from '@/api/standing'
  import {tip,xiaZai} from '@/utils/tip'
  import {validatTelephone} from '@/utils/validate'

  export default {
    watch: {
      dialogFormVisible: function (n, o) {
        if (!n) {
          this.diaAdd.address = '';
          this.diaAdd.description = '';
          this.diaAdd.id = '';
          this.diaAdd.mobile = '';
          this.diaAdd.name = '';
          this.diaAdd.responsibler = '';
          // this.diaAdd.type = '';
        }
      }
    },
    data() {
      return {
        list: null,
        listLoading: false,
        selectTree: false,
        treeDataA: [],
        bread:[],
        total: 0,
        page: 1,
        listQuery: {
          // type:'',
          name:'',
          current:1,
          orgId: '',

        },
        radio: '1',
        dia_titile: '编辑单位/单位详情',
        dialogFormVisible: false,
        diaAdd: {
          address: '',
          description: '',
          id: '',
          mobile: '',
          name: '',
          orgIds: [],
          responsibler: '',
          // type    :''
        },
        rules: {
          name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' }
          ]
        },
        formLabelWidth: '150px',
        treeData: [],
        isType: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      };
    },
    created() {
      this.getTree();
      if(this.$route.query.type == 1){
        this.isType = false
      }else{
        this.isType = true
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      treeNodeClick(data) {

        this.selectTree = true;
        this.bread = [];
        this.diaAdd.orgId = data.id;
        this.listQuery.orgId = data.id;
        this.getList();
        this.getBreadA(data.id);

        this.bread.reverse()
      },

      getList() {
        this.listLoading = true;
        system.departmentList(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false
        })
      },
      //获取面包屑数组
      getBreadA(id){
        var _t = this;
        _t.treeDataA.forEach(function (e) {
          if (e.id == id) {
            _t.bread.push(e.name);
            if (e.parentId) {
              _t.getBreadA(e.parentId)
            }
          }
        })
      },
      getInfo(id) {
        system.departmentInfo(id).then(res => {
          this.dialogFormVisible = true;
          let resData = res.data;
          this.diaAdd.address = resData.address;
          this.diaAdd.description = resData.description;
          this.diaAdd.id = resData.id;
          this.diaAdd.mobile = resData.mobile;
          this.diaAdd.name = resData.name;
          this.diaAdd.orgIds = resData.orgIds;
          this.diaAdd.responsibler = resData.responsibler;
          // this.diaAdd.type = resData.type.toString();
          //this.setCheckedKeys(resData.orgIds);
        })
      },
      addEdit() {
        this.$refs['diaAdd'].validate((valid) => {
          // if (valid && this.validatePhone()) {
          if (valid) {
            this.listLoading = true;
            system.departmentAddOrEdit(this.diaAdd).then(response => {
              tip(response.msg);
              this.getList();
              this.listLoading = false;
              this.dialogFormVisible = false;
            })
          } else {
            return false;
          }
        });
//        this.getCheckedKeys();
      },
      deleteUnit(id) {
        this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
          .then(_ => {
            system.departmentDelete(id).then(response => {
              tip(response.msg);
              this.getList()
            })
          })
          .catch(_ => {
          });
      },
      getTree() {
        var that = this
        org.orgGetOrgTree().then(res => {
          that.treeData = res.data;
          that.bread = [];
          that.treeDataA = [];
          let curTree = that.getTreeA(that.treeData);
          for (let i = 0; i < curTree.length; i++) {
            for (let j = 0; j < curTree[i].length; j++) {
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
        })
      },
      //获取树无层级数组
      getTreeA(tree, path, currentPath) {
        var currentPath = currentPath || [];
        var path = path || [];

        for (let i = 0; i < tree.length; i++) {
          if (i !== 0) {
            currentPath.pop();
          }
          currentPath.push({name: tree[i].name, id: tree[i].id, parentId: tree[i].parentId});
          if (tree[i].children.length) {
            this.getTreeA(tree[i].children, path, currentPath);
          } else {
            path.push(currentPath.slice(0));
          }
        }
        currentPath.pop();
        return path;
      },
//      getCheckedKeys() {
//        this.diaAdd.orgIds = this.$refs.tree.getCheckedKeys();
//      },
//      setCheckedKeys(arr) {
//        this.$refs.tree.setCheckedKeys(arr);
//      },
      handleCurrentChange(val) {
        this.listQuery.current = val;
        this.getList()
      },
      handleCheckChange(data, checked, indeterminate) {
      },
      validatePhone() {
        let isCheck = true;
        if (!validatTelephone(this.diaAdd.mobile)) {
          this.diaAdd.mobile = '';
          tip('联系电话输入有误！', 'error');
          isCheck = false;
        }
        return isCheck
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

  .table_do{
    text-align: right;
  }
  .el-dialog{
    width: 50%;
  }
  .breadt_a{
    .el-form-item{
      margin-bottom: 20px;
    }
  }
  .el-form--inline .el-form-item__content{
    width: auto;
  }
  .add_dia{
    .el-form-item__content{
      box-sizing: border-box;
      padding-left: 20px;
      margin-left: 18px!important;
      padding-right: 35px;
    }
    .el-form-item__label{
      padding-left: 40px;

    }
    .el-input,.el-textarea{
      width: 85%;

    }
    .el-tree{
      padding-left: 115px;
    }
  }

  $mt_20:20px;
  .s_o_c{
    .breadt_a .el-breadcrumb__item{
      float: none;
    }
    box-sizing: border-box;
    padding:0 0 $mt_20 $mt_20;
    margin-top:$mt_20;
    .el-main{
      margin-left: $mt_20/2;
      background-color: #fff;
      .el-form{
        margin-top: $mt_20;
        .el-form-item{
          padding-right: 0;
        }

      }
    }
    .el-dialog__body{
      padding-top:$mt_20/4;
      .el-breadcrumb{
        margin-bottom: $mt_20;

      }
      .filter-tree {
        padding-left: 0;
        margin-left: 10px;
        margin-top: 10px;
      }
    }
  }
  .el-dialog__header, .tree_head{
    background-color: #03938B;
    color: white;
    text-align:center;
    .el-dialog__title,.el-dialog__headerbtn .el-dialog__close{
      color: #fff;
    }
  }

</style>

