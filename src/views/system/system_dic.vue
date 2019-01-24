<template>
  <div class="app-container thisDic" style="width: 100%;height:calc(100vh - 50px);border-radius: 5px;" v-loading="loading">
    <el-col :span="16" :offset="4" class="toolbar" style="padding:50px 10px;background:#fff;border-radius:5px">

      <!-- <el-col :span="8" class="toolbar" style="padding-bottom: 0px;border-right:1px solid rgb(64, 158, 255);padding-right:20px;height:90vh"> -->
      <!-- <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input> -->
      <el-tree
        class="filter-tree"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree2"
        :data="data5"
        node-key="id"
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
      <!-- </el-col> -->
      <!-- <el-col :span="16">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
             <el-col :span="24" :offset="2"><h3>节点信息</h3></el-col>
           </el-row>
            <el-row>
             <el-col :span="8">
                <el-form-item label="名称:">
                   <el-input v-model="form.name"></el-input>
                 </el-form-item>
             </el-col>
               <el-col :span="8">
                <el-form-item label="编码:">
                   <el-input v-model="form.name"></el-input>
                 </el-form-item>
             </el-col>
               <el-col :span="8">
                <el-form-item label="排序:">
                   <el-input v-model="form.name"></el-input>
                 </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-form-item label="备注：" prop="desc">
               <el-input type="textarea" v-model="form.desc"></el-input>
             </el-form-item>
           </el-row>
            <el-form-item>
               <el-button type="primary" >修改</el-button>
               <el-button >删除</el-button>
             </el-form-item>

        </el-form>


          <el-form ref="form" :model="form" label-width="80px">
          <el-row>
             <el-col :span="24" :offset="2"><h3>添加子节点</h3></el-col>
           </el-row>
            <el-row>
             <el-col :span="8">
                <el-form-item label="名称:">
                   <el-input v-model="form.name"></el-input>
                 </el-form-item>
             </el-col>
               <el-col :span="8">
                <el-form-item label="编码:">
                   <el-input v-model="form.name"></el-input>
                 </el-form-item>
             </el-col>
               <el-col :span="8">
                <el-form-item label="排序:">
                   <el-input v-model="form.name"></el-input>
                 </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-form-item label="备注：" prop="desc">
               <el-input type="textarea" v-model="form.desc"></el-input>
             </el-form-item>
           </el-row>
            <el-form-item>
               <el-button type="primary" >确定</el-button>

             </el-form-item>

        </el-form>

      </el-col> -->
      <image src="../../images/i-add.png" alt=""/>


    </el-col>
    <!--弹出框-->
    <el-dialog title="节点信息" :visible.sync="dialogFormVisible" class="dicDia" width="762.5px">
      <el-form :model="form">
        <!-- <el-row>
           <el-col :span="24" :offset="2"><h3>节点信息</h3></el-col>
         </el-row> -->
        <el-row>
          <el-col :span="6" :offset="1" style="display:none">
            <el-form-item label="名称:">
              <el-input v-model="form.parent"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="名称:">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="值:">
              <el-input v-model="form.value"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="排序:">
              <el-input v-model="form.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item label="备注：" prop="desc" >
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success"  v-on:click ='dialogForm' v-if="isType">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { dictTree,dictAdd,dictdel,dictTree1} from '@/api/systemMan'
  import avatar from '../../images/i-add.png'


  export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {

        filterText:'',
        data5:[],
        data:[],
        treeId:"",
        add:0,
        node:"",
        count: 1,
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          sort: '',
          remark:"",
          parent:"",
          value: ''
        },
        formLabelWidth: '500px',

        loading:false,
        isType:false,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created(){

      this.fetchData();
      if(this.$route.query.type == 1){
        this.isType = false
      }else{
        this.isType = true
      }

    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data5.label.indexOf(value) !== -1;
      },
      fetchData(node, resolve,id){

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        dictTree1().then(res => {
          loading.close()
          this.data5 = res.data
        })


      },

      remove(node, data) {

        const parent = node.parent;
        const children = parent.data.children || parent.childNodes;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);

      },
      renderContent(h, { node, data, store }) {

        var self = this;
        if(this.isType){
          return (
            <span class="custom-tree-node">
            <span>{data.name}</span>
          <span style='margin-left:50px'>
            <el-button size="mini" type="text" data-id=''  on-click={ () =>{

            this.form.parent = node.data.seqNo;
            this.data = data;
            this.add=0;
            this.dialogFormVisible = true;


          } }>新增</el-button>
          <el-button size="mini" type="text" data-id=''  on-click={ () =>{
            self.form.parent = node.data.seqNo;
            this.editForm (data)
            this.add=1;
          } }>编辑</el-button>
          <el-button size="mini" type="text" on-click={ () =>{

            self.form.parent = node.data.seqNo;
            this.removeData(node, data)

          }}>删除</el-button>
          </span>
          </span>);
        }else{
          return(<span class="custom-tree-node">
            <span>{data.name}</span>
          <span style='margin-left:50px'>

          <el-button size="mini" type="text" data-id=''  on-click={ () =>{
            self.form.parent = node.data.seqNo;
            this.editForm (data)
            this.add=1;
          } }>编辑</el-button>
          </span>
          </span>)
        }

      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      dialogForm(){
        var sendForm = this.form
        var self = this

        dictAdd(sendForm).then(res => {

          self.appenddata(res.data)
          self.$message({
            message: '恭喜你，添加成功！',
            type: 'success'
          });
          self.dialogFormVisible = false;
          this.form = {
            name: '',
            sort: '',
            remark:"",
            parent:"",
            value: ''
          }

        })
      },
      appenddata(data) {
        const newChild = data;

        if (!data.children) {
          this.$set(data, 'children', []);
        }
        if( this.add==0){
          this.data.children.push(newChild);
        }else{
          this.$message({
            message: '编辑成功  ',
            type: 'success'
          });
        }

      },
      editForm(data){

        this.form = data
        this.dialogFormVisible = true;

      },
      removeData(node, data){
        this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
          .then(_ => {
            dictdel(data.id).then(res => {

              const parent = node.parent;
              const children = parent.data.children || parent.data;
              for(var i= 0;i<children.length;i++){
                if(children[i].id == data.id){
                  children.splice(i, 1);
                  this.$message({
                    message: '删除成功！  ',
                    type: 'success'
                  });
                }
              }
            })
          })
          .catch(_ => {});
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" >
  .thisDic{
    .custom-tree-node{
      width: 100%;
    }

    .el-tree-node__content{
      position: relative;

    }

    /* .el-tree-node__content:hover .custom-tree-node span:nth-child(2){
       display: inline-block;
       line-height: 10px
    } */

    .custom-tree-node span:nth-child(2){
      position: absolute;
      right: 0;
      /* display: none */
    }
    .dicDia .el-input__inner{
      width: 180px;
    }
  }


</style>
