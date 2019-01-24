<template>

  <div class="my-company-dialog chooseDialog">
    <el-dialog title="选择企业"
               :visible.sync="dialogData.dialogVisible"
               width="500px">
      <div class="my-body-container">
        <el-form >
          <el-tree :data="treesData"
                   :props="defaultProps"
                   @node-click="handleNodeClick">
          </el-tree>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer t_a">
        <el-button @click="dialogData.dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="sureSelcet">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import { companiesList } from '@/api/login'

  export default {
    name: 'companyDialog',
    props: ['dialogData'],
    /* dialogData
    * orgId 父子树的id
    * treeName 选中树的 全部name
    * selectTreeData 选中树的对象
    * dialogVisible 视图是否显示
    * defaultSelectTreeId 默认选择的
    * level 显示的树的
    * */
    data() {
      return {
        treesData: [],
        selectTrees: [],
        treeDataA: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    watch: {

      'dialogData.defaultTreeId'(newVal) {
        if (newVal) {
//          传出新值的时候
          this.dialogData.selectTreeData.id = newVal;
          this.sureSelcet();
        }
      },
      'dialogData.dialogVisible'(newVal) {
        if (!newVal) {
          this.dialogData.selectTreeData = {};
        } else {
          this.switchCompanies(this.dialogData.orgId);
        }
      }
    },
    methods: {
      //切换企业
      switchCompanies(treeId) {
        this.treesData = [];
        //请求企业接口
        let parames = {
          orgId: treeId,
          level: this.dialogData.level,
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
        })
      },
      handleNodeClick(val) {
        this.dialogData.selectTreeData = val;
      },

      sureSelcet() {

        this.dialogData.dialogVisible = false;
        let treeId = this.dialogData.selectTreeData.id;
        if (treeId == undefined || treeId === '') return;

        this.selectTrees = [];
        this.getBreadA(treeId);
        this.selectTrees.reverse();
        let treesName = this.selectTrees.join(' / ');
        this.dialogData.treeName = treesName;
        //确认选择了
        this.$emit('selectHandle', treeId);
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
    created(){
      this.switchCompanies(this.dialogData.orgId);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .my-company-dialog {
    .el-dialog__body {
      background-color: #F5FCF5;
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .my-body-container {
      border-radius:4px;
      overflow: hidden;
    }
    .el-dialog__footer {
      background-color: #F5FCF5;
    }
    .el-tree-node:focus > .el-tree-node__content,
    .el-tree-node__content:hover {
      color: white;
      background-color: #03938b;
    }

  }
   .chooseDialog{
    .el-dialog__body{
      padding:20px !important;
      height: 500px;
      overflow-y: auto;
    }
  }
</style>
