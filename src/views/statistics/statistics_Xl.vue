<template>
  <div class="s_o_c my_chart">
    <el-container>

      <el-aside width="350px">
        <div class="tree_head">泄漏查询</div>
        <el-tree class="filter-tree"
                 @node-click="treeNodeClick"
                 :data="treeData"
                 :props="defaultProps"
                 ref="tree2">
        </el-tree>
      </el-aside>
      <el-main>

        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="bread.length>0">
          <span class="bread_text"><i class="el-icon-location"></i> 当前组织：</span>
          <el-breadcrumb-item v-for="item in bread" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form class="top-container" ref="form" :inline="true" >
          <el-form-item label="统计时间：">
            <el-date-picker
              v-model="listQuery.start"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="listQuery.end"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="相态：">
            <el-select v-model="listQuery.phase" placeholder="请选择">
              <el-option
                v-for="item in phaseOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否可达：">
            <el-select v-model="listQuery.isReach" placeholder="请选择">
              <el-option
                v-for="item in canReach"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="bread.length>0">
            <el-button type="success" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>

        <el-col style="background-color: #f5fcf5;padding: 0" class="my_tab">
          <el-tabs v-model="activeName" @tab-click="handleClick" type="card">

            <el-tab-pane label="表格数据" name="first">
              <el-row style="padding: 10px;background-color: #fff">
                <el-table :data="list"
                          v-loading="listLoading"
                          :summary-method="getSummaries"
                          show-summary
                          border fit highlight-current-row
                          element-loading-text="拼命加载中"
                          style="width: 100%;">

                  <el-table-column type="index" label="序号" width="80">
                  </el-table-column>
                  <el-table-column prop="type" label="密封点类型">
                  </el-table-column>
                  <el-table-column prop="pointNum" label="检测点数">
                  </el-table-column>
                  <el-table-column prop="leakage" label="泄漏点数">
                  </el-table-column>
                  <el-table-column prop="leakageEmissions" label="泄漏点排放量">
                  </el-table-column>
                  <el-table-column prop="recheckEmissions" label="复测排放量">
                  </el-table-column>
                </el-table>
              </el-row>

            </el-tab-pane>

            <el-tab-pane label="图表数据" name="second">
              <el-row style="padding: 0">
                <div  id="main1" class="chart_main"  style="height: 400px;background-color: #fff; padding-top: 20px"></div>
              </el-row>
            </el-tab-pane>

          </el-tabs>

        </el-col>

      </el-main>
    </el-container>



  </div>

</template>


<script>
  import org from '@/api/standing'
  import system from '@/api/system'
  import query from '@/api/statisticalQuery'
  import { tip,xiaZai } from '@/utils/tip'
  import { type } from '@/utils/setFormType'
  import echart from 'echarts'
  import utils from '@/utils/skDateFormat'

  export default {


    methods: {
      handleClick(tab, event) {
        if(tab.name=='second') this.drawingChart();
      },
      drawingChart() {
        this.$nextTick(function() {
          this.drawChart('main1', this.chartData);
        })
      },
      drawChart(id, chartData){

        this.charts = echart.init(document.getElementById(id));
        this.charts.setOption({
          color: ['#003366', '#006699'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: chartData.titles,
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: chartData.options,
              axisLabel:{
                //X轴刻度配置
                interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: chartData.titles[0],
              type: 'bar',
              barGap: 0,
              label: this.labelOption,
              data: chartData.compares[0],
            },
            {
              name: chartData.titles[1],
              type: 'bar',
              label: this.labelOption,
              data: chartData.compares[1],
            },
          ]
        })
      },

      //获取字典类型
      getPhaseBehaviorDict(){
        system.dictGetDict('phase_behavior').then(res => {
          this.phaseOptions = res.data;
        });
      },
      //获取列表
      getList(){
        let that = this;
        this.listShow = true;
        this.listLoading = true;
        query.statisticsLeakage(this.listQuery).then(res => {
          let data = res.data;
          //获取到对应的检测点信息
          let  options = [];
          let emissionsData = [];
          let detectionData = [];
          data.forEach(function (e, index) {
            options.push(e.type);
            emissionsData.push(e.leakageEmissions);
            detectionData.push(e.recheckEmissions);
          })
          that.chartData.options = options;
          that.chartData.compares = [emissionsData,detectionData];
          that.list = data;
          if (that.activeName == 'second') that.drawingChart();
          that.listLoading = false;
        })
      },

      //拿tree
      getTree(id) {
        let parame = {selectedOrgId:id};
        org.orgGetOrgTree(parame).then(res => {
          this.treeData = res.data;
          this.bread = [];
          this.treeDataA = [];
          let curTree = this.getTreeA(this.treeData);
          for (let i = 0; i < curTree.length; i++) {
            for (let j = 0; j < curTree[i].length; j++) {
              this.treeDataA.push(curTree[i][j])
            }
          }
          var r = [];
          for(var i = 0, l = this.treeDataA.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
              if (this.treeDataA[i].id == this.treeDataA[j].id) j = ++i;
            r.push(this.treeDataA[i]);
          }
          this.treeDataA = r;
        })
      },
      //点击树
      treeNodeClick(data) {
        this.bread = [];
        this.listQuery.orgId = data.id;
        this.getList();
        this.getBreadA(data.id);
        this.bread.reverse()
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
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
//            sums[index] += ' ';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      },
    },

    data() {
      return {

        colors:['#0069F6','#00B100','#EA1D24','#ED5A24','#FF1F9C','#FFAD01','#88D93E','#A7329D'],
        charts: '',
        labelOption: {
          normal: {
            show: false,
            position: 'insideBottom',
            distance: 15,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
              name: {
                textBorderColor: '#fff'
              }
            }
          }
        },

        activeName:'first',
        isType:true,


        isAdd: true,
        bread: [],
        treeData: [],
        treeDataA: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        list: null,
        listLoading: false,
        listShow: false,
        listQuery: {
          orgId: '',
          start: new Date().format("yyyy-MM-dd"),
          end: new Date().format("yyyy-MM-dd"),
          phase: '',
          isReach: '',
        },
        radio: '1',
        chartData: {
          titles: ['泄漏量','修复后泄漏量'],
          options:[],
          compares: [],
        },
        //是否可达
        canReach: [
          {value:'1', label: '是'},
          {value:'0', label: '否'},
        ],
        phaseOptions: [],


      }
    },
    created(){

      //需要传用户选中的id
      let userOnly = 'USERSC' + sessionStorage.getItem('userName');
      let selectId = sessionStorage.getItem(userOnly);
      this.getTree(selectId);

      this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', (val)=>{
        //选择的企业了
        this.getTree(val);
      });

      if(type() == 2 || type() == 3){
        this.isType = false
      }
      this.getPhaseBehaviorDict();
    },
    mounted(){


    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  $mt_20:20px;
  .s_o_c.my_chart{
    .my_tab{
      .el-tabs--card>.el-tabs__header{
        border-bottom: none;
        margin-bottom: 10px;
        .el-tabs__nav{
          border: none;
          border-radius: 0;
        }
        .el-tabs__item{
          background-color: white;
          color: #333;
          width: 140px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          &.is-active{
            color: white;
            background-color: #03938B;
          }
        }
      }
    }
    color: black;
    box-sizing: border-box;
    padding:0 0 $mt_20 $mt_20;
    margin-top:$mt_20;
    .t_r{
      text-align: right;
    }
    .t_a{
      text-align: center;
    }
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
      overflow: hidden;
      padding-top:$mt_20/4;
      .el-breadcrumb{
        margin-bottom: $mt_20;
      }
      .el-form.form2{
        .el-form-item{
          width: 48%;
          .el-form-item__content{
            width: 87%;
          }
          &.form2Ta{
            width: 100%;
            .el-form-item__content{
              width: 91%;
            }
          }
        }
      }
    }
    .el-menu-item{
      font-size: 14px;
      height: 35px;
      line-height: 35px;
    }
    .el-col-24{
      img{
        width: 100%;
      }
    }
    .el-col-12{
      padding: 10px;
    }
    .add_dia{
      // .el-dialog{
      //   margin-top: 1vh!important;
      // }
      &.add{
        .el-form--inline .el-form-item{
          width: 48%;
          input{
            width: 275px;
            box-sizing: border-box;
          }
          textarea{
            width: 847px;
          }
          .el-form-item__label {
            width: 100px;
          }
          &.mark_textarea{
            display: block;
            width: 100%;
          }
          &.spe_item{
            width: 100%;
            .el-form-item__content{
              width: 80%;
              .el-input{
                width: 24%;
                input{
                  width: 195px;
                }
              }
            }
          }
        }
      }
    }
    .search_dia{
      .t_a{
        margin-top: $mt_20;
      }
    }
    .top-container {
      padding-left: 15px;
      border-bottom: 20px solid #F5FCF5;
      margin-top: 20px;
      .el-form-item__label {
        width: 100px;
      }
      .el-select {
        width: 220px;
      }
    }
  }

</style>
