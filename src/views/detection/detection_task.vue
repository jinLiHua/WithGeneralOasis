<template>
  <div class="app-container thisDtask detectionData_task">

    <el-container>
      <el-main>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" class="search_top this_Dtask" label-width="82px">
            <el-form-item label="任务名称:">
              <el-input placeholder="任务名称" v-model="listQuery.name"></el-input>
            </el-form-item>

            <el-form-item label="检测人员:">
              <el-input placeholder="检测人员" v-model="listQuery.checkMan"></el-input>
            </el-form-item>

            <el-form-item label="检测设备:">
              <el-select v-model="listQuery.equipId" placeholder="请选择">
                <el-option v-for="item in equipOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型:" class="detaction_type">
              <el-radio v-model="listQuery.taskType" label="0">常规</el-radio>
              <el-radio v-model="listQuery.taskType" label="1">临时</el-radio>
            </el-form-item>
            <el-form-item label="企业:">
              <el-input v-model="selectCompanyName" v-on:click.native="companySelect" placeholder="请选择企业" readonly>
              </el-input>
            </el-form-item>
            <!-- <div style="display:inline-block;overflow: hidden; width: 47.8%"> -->
            <el-button type="success" @click="addTaskAction" v-if="isType">新增任务</el-button>
            <el-button type="success" @click="getList">查询</el-button>
            <!-- </div> -->

          </el-form>
        </el-col>
        <!--列表-->
        <div class="el-col el-col-24" style='margin-top:10px;'>
          <el-table :data="list" v-loading="listLoading" @selection-change="handleSelectionChange" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="任务名称">
            </el-table-column>

            <el-table-column prop="pointNum" label="密封点数">
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{scope.row.createTime.split(' ')[0]}}</span>
              </template>
            </el-table-column> -->

            <el-table-column prop="createTime" label="分配时间">
              <template slot-scope="scope">
                <span>{{scope.row.distributionTime != null ? scope.row.distributionTime.split(' ')[0] : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskType" label="任务类型">
              <template slot-scope="scope">
                <span v-if="scope.row.taskType == 0">常规</span>
                <span v-if="scope.row.taskType == 1">临时</span>
              </template>
            </el-table-column>

            <!--<el-table-column prop="result" label="检测结果">-->
            <!--</el-table-column>-->

            <el-table-column prop="normalPointNum" label="正常点数">
            </el-table-column>
            <el-table-column prop="exceptionPointNum" label="泄漏点数">
            </el-table-column>
            <el-table-column prop="equipName" label="检测设备">
            </el-table-column>
            <el-table-column prop="checkMan" label="检测人员">
            </el-table-column>
            <el-table-column prop="operation" label="操作 " width="150">
              <template slot-scope="scope">
                <i class="el-icon-tickets success btn" @click="info(scope.row.id)" title="编辑/详情"></i>
                <i class="el-icon-delete danger btn" @click="deleteIds(0,scope.row.id)" v-if="isType" title="删除"></i>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleSizeChange" :total="total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </div>
      </el-main>
    </el-container>

    <!--检测任务详情-->
    <el-dialog class="s_o_c add_dia detailDia add" title="检测任务" :class="detactionType == 'detail'?'detactionDetail':''" :visible.sync="dialogFormVisible" width="90%">

      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane label="基本信息" name="first">

          <el-form :model="addEdit" ref="addEdit" :rules="rules" class="dialog-add" label-width="180px" :inline="true">
            <el-form-item prop="name" label="任务名称：">
              <el-input v-model="addEdit.name"></el-input>
            </el-form-item>
            <el-form-item prop="checkMan" label="检测人员：">
              <el-input v-model="addEdit.checkMan"></el-input>
            </el-form-item>
            <el-form-item prop="distributionTime" label="分配时间：">
              <el-date-picker v-model="addEdit.distributionTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="equipId" label="检测设备：">
              <el-select v-model="addEdit.equipId" placeholder="请选择">
                <el-option v-for="item in equipOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="taskType" label="任务类型：">
              <el-select v-model="addEdit.taskType" placeholder="请选择">
                <el-option v-for="item in taskTypeOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="checkType" label="类型：">
              <el-radio-group v-model="addEdit.checkType">
                <el-radio label="0">检测任务</el-radio>
                <el-radio label="1">复测任务</el-radio>
              </el-radio-group>
            </el-form-item>

            <!--检测计划-->
            <el-form-item prop="planId" label="检测计划：">
              <el-select v-model="addEdit.planId" placeholder="请选择">
                <el-option v-for="item in planList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="notes" label="备注：" class="mark_textarea">
              <el-input type="textarea" v-model="addEdit.notes"></el-input>
            </el-form-item>

            <el-form-item class="mark_textarea t_a">
              <el-button @click="dialogFormVisible=false">取消</el-button>
              <el-button type="success" @click="checkAddTask('addEdit')" v-if="isType">确定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图档" :disabled="isClick" name="second">
          <el-form class="mb_20">
            <el-button type="success" @click="dialogPicVisible = true" icon="el-icon-plus" v-if="isType">新增图档</el-button>
            <el-button type="success" class="spe_success" icon="el-icon-download" @click="daochu">导出</el-button>
            <el-button type="primary" icon="el-icon-upload2" v-if="isType" class="drPic">
              <label class="drPicLable">导入
                <input v-bind:accept="acceptType" type="file" @change="daoru" style="display: none">
              </label>
            </el-button>
            <el-button type="danger" @click="deletePic" icon="el-icon-delete" v-if="isType">删除</el-button>
          </el-form>
          <el-table :data="pointListByOrtPic" height="740" class="pointListByOrtPicHeight" @selection-change="selectionChangePic" border fit highlight-current-row element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="imageCode" label="图档编码" width="310px">
            </el-table-column>
            <el-table-column prop="equipment" label="所属设备" width="310px">
            </el-table-column>
            <!-- <el-table-column prop="imageCreateTime" label="上传时间" width='230px'>
              <template slot-scope="scope">
                <span>{{scope.row.imageCreateTime.split(' ')[0]}}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="totalPointNum" label="密封点数" width="310px">
            </el-table-column>
            <el-table-column prop="taskPointNum" label="检测点数" width="310px">
            </el-table-column>
            <el-table-column prop="leakagePointNum" label="泄漏点数" >
            </el-table-column>
          </el-table>
          <!--<div class="t_a" style="margin-top: 15px">
            <el-button type="success" @click="dialogFormVisible = false">确定</el-button>
          </div>-->
        </el-tab-pane>
        <el-tab-pane label="密封点" :disabled="isClick" name="third">

          <el-form class="mb_20" v-if="isType">
            <el-button type="success" icon="el-icon-plus" @click="addPointData.dialogAddVisible = true">新增</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deletePicPoint">删除</el-button>
          </el-form>
          <el-container>
            <el-aside width="230px" class="picCss">
              <div class="pic_title">
                <div class="pic_title_ti">图档</div>
                <div class="leftPic" v-for="(item,index) in pointListByOrtPic" @click="selectedPic(index,item.imageId)" :class="{active: acName == index}" :key="index">{{item.imageCode}}</div>
              </div>
            </el-aside>
            <el-main>
              <el-table :data="pointListByOrt" height='660' class="pointListByOrtHeight" @selection-change="handleSelectionChangePoint" border fit highlight-current-row element-loading-text="拼命加载中">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="groupCode" label="群组编码" width="160px">
                  <template slot-scope="scope">
                    <div @click="detailFour(scope.row.id,scope.row.imageFileId)" style="cursor: pointer;" class="isClick">{{scope.row.groupCode}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="extendCode" label="扩展号" width="80px">
                </el-table-column>
                <el-table-column prop="typeName" label="密封点类型" width="160px">
                </el-table-column>
                <el-table-column prop="equipCode" label="管线号/设备位号" width="138px">
                </el-table-column>
                <el-table-column prop="equipName" label="线管/设备名称" width="124px">
                </el-table-column>
                <el-table-column prop="size" label="尺寸" width='55'>
                </el-table-column>
                <el-table-column prop="pointStatus" label="密封点状态" width="105px">
                </el-table-column>
                <el-table-column prop="floor" label="楼层" width='55'>
                </el-table-column>
                <el-table-column prop="logistics" label="物流号" width="80px">
                </el-table-column>
                <el-table-column prop="phaseBehaviorName" label="相态" width="138px">
                </el-table-column>
                <el-table-column prop="blind" label="是否盲端" width="90px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.blind == 1">是</span>
                    <span v-if="scope.row.blind == 0">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="manufacturer" label="生产厂家" width="110px">
                </el-table-column>
                <el-table-column prop="preservation" label="是否保温" width="90px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.preservation == 1">是</span>
                    <span v-if="scope.row.preservation == 0">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="corrosion" label="是否腐蚀" width="90px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.corrosion == 1">是</span>
                    <span v-if="scope.row.corrosion == 0">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="temperature" label="温度" width="60">
                </el-table-column>
                <el-table-column prop="pressure" label="压力" width="65">
                </el-table-column>
                <el-table-column prop="lastCheckTime" label="最近一次检测日期" width="125px">
                  <template slot-scope="scope">
                    <span>{{scope.row.lastCheckTime?scope.row.lastCheckTime.split(' ')[0]:''}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="reach" label="是否可达" width="90px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.reach == 1">是</span>
                    <span v-if="scope.row.reach == 0">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="extension" label="延长杆" width="70">
                </el-table-column>
                <el-table-column prop="notes" label="备注" width="300px">
                  <template slot-scope="scope">
                    <div :title="scope.row.notes" class="remarks">{{scope.row.notes}}</div>
                  </template>
                </el-table-column>
                <!--<el-table-column prop="date" label="图档编码">-->
                <!--</el-table-column>-->
                <el-table-column prop="operation" label="操作 " width="100">
                  <template slot-scope="scope">
                    <i class="el-icon-tickets success btn" @click="detailFour(scope.row.id,scope.row.imageFileId)" title="编辑/详情"></i>
                  </template>
                </el-table-column>
              </el-table>
              <!--工具条-->
              <el-col :span="24" class="toolbar">
                <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleCurrentChange" :total="totalPoint" style="text-align:center;">
                </el-pagination>
              </el-col>
            </el-main>
          </el-container>
          <!--<div class="t_a" style="margin-top: 15px">
            <el-button type="success" @click="dialogFormVisible = false">确定</el-button>
          </div>-->
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--增加密封点-->
    <addPoint :addPointData="addPointData" @sendIds="getArrByIds"></addPoint>
    <!--增加图档-->
    <el-dialog class="s_o_c add_dia add_point addDetactionPicTask" title="检测任务--增加图档" :visible.sync="dialogPicVisible" width="1200px">
      <el-container>
        <el-aside width="300px" class="detactionPicTask" style="margin-top: 20px">
          <div class="pic_title">
            <div class="pic_title_ti" style="margin-bottom: 0">组织组织结构</div>
            <el-tree class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all @node-click="treeNodeClickPic" :filter-node-method="filterNode" ref="tree"></el-tree>
          </div>
        </el-aside>
        <el-main>
          <el-form :inline="true" label-width="94px">
            <el-form-item label="图档编码：">
              <el-input v-model="listQueryPic.code"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="getListPic">查询</el-button>
              <el-button v-if="totalPic > 0" type="success" @click="funAllSelectList">{{allSelected ? '取消全选' : '全选'}}</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="listPic" @selection-change="handleSelectionChangePic" v-loading="listLoadingPic" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="selection" width="55">

            </el-table-column>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="code" label="图档编码">
            </el-table-column>
            <el-table-column prop="equipment" label="所属设备">
            </el-table-column>
            <el-table-column prop="pointNum" label="密封点">
            </el-table-column>
            <el-table-column prop="createUser" label="标注人">
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime.split(' ')[0]}}</span>
              </template>
            </el-table-column> -->
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleSizeChangePic" :total="totalPic" style="text-align:center;">
            </el-pagination>
            <el-form :inline="true" label-width="85px" class="t_r" style="text-align:right">
              <el-form-item>
                <el-button type="" @click="dialogPicVisible = false">取消</el-button>
                <el-button type="success" @click="surePicChoose" v-if="isType">确定</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <!-- <el-form :inline="true" label-width="85px" class="t_r" style="text-align:center">
            <el-form-item>
              <el-button type="" @click="dialogPicVisible = false">取消</el-button>
              <el-button type="success" @click="surePicChoose" v-if="isType">确定</el-button>
            </el-form-item>
          </el-form> -->
        </el-main>
      </el-container>
    </el-dialog>

    <!--密封点详情-->
    <fourPoint :addPointData="pointData">
    </fourPoint>

    <fileDialog @exportFile="downloadFile" :dialog="fileDialogData" :showType=true>
    </fileDialog>
    <companyDialog @selectHandle="sureSwitch" :dialogData="companySelectData">
    </companyDialog>
  </div>

</template>

<script>
import detection from '@/api/detection'
import system from '@/api/system'
import org from '@/api/standing'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import addPoint from '@/components/Addpoint/index'
import fourPoint from '@/components/Addpoint/pointFour'
import maintain from '@/api/maintain'
import { type } from '@/utils/setFormType'
import fileDialog from '@/components/Dialog/index'
import companyDialog from '@/components/Dialog/chooseDialog'
import index from '../../router/index'

export default {
  components: { addPoint, fourPoint, fileDialog, companyDialog },

  watch: {
    dialogFormVisible: function(n, o) {
      if (!n) {
        this.addEdit.checkMan = ''
        this.addEdit.checkStatus = ''
        this.addEdit.checkType = ''
        this.addEdit.distributionTime = ''
        this.addEdit.equipId = ''
        this.addEdit.exceptionPointNum = ''
        this.addEdit.id = ''
        this.addEdit.planId = ''
        this.addEdit.planDataId = ''
        this.addEdit.name = ''
        this.addEdit.normalPointNum = ''
        this.addEdit.notes = ''
        this.addEdit.result = ''
        this.addEdit.taskStatus = ''
        this.addEdit.taskType = ''
        this.isClick = true
        this.activeName = 'first'
        //重置表单
        this.resetForm('addEdit')
      }
    },
    dialogPicVisible: function(n, o) {
      if (!n) {
        this.totalPic = 0
        this.listPic = []
      }
    },
    // watch vm.e.f's value: {g: 5}
    'addEdit.equipId': function(newVal) {
      if (newVal == 2) {
        this.acceptType = 'text/plain'
      } else {
        this.acceptType = 'text/csv'
      }
    }
  },
  data() {
    return {
      palnWid: '',
      gHeight: 740,
      detactionType: 'detail',
      acceptType: 'text/csv',
      planList: [],
      allSelected: false,
      imageFilepages: 0,
      allImageFileList: [],
      lastPicOrgId: '', //记录上个选中的
      fileDialogData: {
        dialogVisible: false,
        deviceName: '',
        fileName: '',
        type: 3
      },
      selectCompanyName: '',
      companySelectData: {
        dialogVisible: false,
        selectTreeData: {},
        orgId: '',
        treeName: '',
        level: '3'
      },
      totalPoint: 0,
      sendPics: {
        imageIds: '',
        taskId: ''
      },
      chooseList: [], //图档多选id

      picArr: [],
      acName: '0',
      isClick: true,
      list: null,
      listLoading: true,
      listQuery: {
        current: 1,
        name: '',
        checkStatus: '',
        checkMan: '',
        equipId: '',
        taskType: '',
        orgId: ''
      },
      listQueryPlan: {
        current: 1,
        name: '',
        size: 10000,
        orgId: '0',
        endTime: '',
        startTime: ''
      },
      total: 0,
      listQueryPic: {
        orgId: '',
        code: '',
        current: 1
      },
      listPic: null,
      listLoadingPic: false,
      totalPic: 0,
      taskStatusOptions: [{ name: '正常', id: '0' }, { name: '删除', id: '1' }],
      taskTypeOptions: [{ name: '常规', id: '0' }, { name: '临时', id: '1' }],
      equipOptions: [],
      addEdit: {
        checkMan: '',
        planData: '',
        checkStatus: '',
        checkType: '',
        equipId: '',
        exceptionPointNum: '',
        departmentId: '',
        id: '',
        name: '',
        normalPointNum: '',
        notes: '',
        result: '',
        taskStatus: '',
        planId: '',
        planDataId: '',
        taskType: '',
        distributionTime: ''
      },
      multipleSelection: [],
      activeName: 'first',
      addPointData: {
        title: '新增密封点',
        dialogAddVisible: false,
        orderOrTask: '',
        isShowSearch: false,
        treeId: ''
      },
      dialogFormVisible: false,
      dialogPicVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      radio: '1',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      value: '',
      existIds: [],
      pointListByOrt: [],
      pointListByOrtPic: [],
      pointData: {
        dialogFormVisible: false,
        dia_titile: '密封点',
        id: '',
        imgId: ''
      },
      isType: false,
      listQueryPicLink: {
        taskId: ''
      },
      taskPointPage: {
        imageId: '', //图档id
        oId: '', //检测任务id
        type: 0,
        current: 1
      },
      picDeletes: [],
      pointDeletes: [],
      rules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        checkMan: [
          { required: false, message: '请输入检测人员', trigger: 'blur' }
        ],
        distributionTime: [
          { required: true, message: '请选择分配时间', trigger: 'change' }
        ],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        planId: [
          { required: true, message: '请选择检测计划', trigger: 'change' }
        ],
        checkType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        notes: [{ required: false, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    //需要传用户选中的id
    let userOnly = 'USERSC' + sessionStorage.getItem('userName')
    let selectId = sessionStorage.getItem(userOnly)
    let selectCompanyKey = 'USERSCNAME' + sessionStorage.getItem('userName')
    var selectCompanyNameArry = sessionStorage
      .getItem(selectCompanyKey)
      .split('/')
    var selectCompanyNameLength = selectCompanyNameArry.length - 1
    this.selectCompanyName = selectCompanyNameArry[selectCompanyNameLength]

    this.switchCompanyFinish(selectId)
    this.companySelectData.orgId = selectId

    this.getDict('equipment')
    this.isType = this.$route.query.type != 1

    let that = this
    this.$root.eventHub.$on('EVENT_SWITCH_COMPANY', val => {
      if (val !== '') {
        let selectCompanyKey = 'USERSCNAME' + sessionStorage.getItem('userName')
        var selectCompanyNameArry = sessionStorage
          .getItem(selectCompanyKey)
          .split('/')
        var selectCompanyNameLength = selectCompanyNameArry.length - 1
        this.selectCompanyName = selectCompanyNameArry[selectCompanyNameLength]
        that.switchCompanyFinish(val)
        that.companySelectData.orgId = val
      }
    })
  },
  methods: {
    //导入图档
    daoru(e) {
      //根据检测设备类型判断
      if (this.addEdit.equipId == 2) {
        //2是txt
        let files = e.target.files || e.dataTransfer.files

        //          if (files[0].type == "text/plain") {
        const loading = this.$loading({
          lock: true,
          text: '正在努力导入...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        let formData = new FormData()
        formData.append('txt', files[0])
        formData.append('taskId', this.sendPics.taskId)
        detection
          .importTXT(formData)
          .then(res => {
            loading.close()
            tip('上传成功！')
          })
          .catch(_ => {
            loading.close()
          })
        //          } else {
        //            tip('请选择.txt文件格式', 'warning');
        //          }
      } else {
        let files = e.target.files || e.dataTransfer.files
        //          if (files[0].type == "text/csv") {
        let formData = new FormData()
        formData.append('csv', files[0])
        formData.append('taskId', this.sendPics.taskId)
        const loading2 = this.$loading({
          lock: true,
          text: '正在努力导入...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        detection
          .importCSV(formData)
          .then(res => {
            loading2.close()
            tip('上传成功！')
          })
          .catch(_ => {
            loading2.close()
          })
      }
    },
    funAllSelectList() {
      if (this.allSelected) {
        for (var index = 0; index < this.imageFilepages; index++) {
          this.chooseList[index] = []
        }
        this.toggleSelection()
      } else {
        let parames = {
          size: 100000,
          current: 1,
          orgId: this.listQueryPic.orgId
        }
        let that = this
        org.imageFileListTask(parames).then(res => {
          that.allPlanList = res.data.records
          for (var index = 0; index < that.imageFilepages; index++) {
            let pageList = []
            for (var row = 0; row < 10; row++) {
              let listIndex = index * 10 + row
              if (that.allPlanList[listIndex]) {
                pageList.push(that.allPlanList[listIndex].id)
              }
            }
            that.chooseList[index] = pageList
          }
          //先清楚全选的再选择当前的
          that.toggleSelection()
          that.toggleSelection(that.listPic)
        })
      }
    },
    funJudgeAllSelect() {
      //只用判断选中的数量是否相等即可
      let selectCount = 0
      for (var index = 0; index < this.chooseList.length; index++) {
        if (this.chooseList[index].length > 0) {
          let indexList = this.chooseList[index]
          for (var i = 0; i < indexList.length; i++) {
            selectCount += 1
          }
        }
      }
      let selected = selectCount > 0 && selectCount === this.totalPic
      this.allSelected = selected
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    switchCompanyFinish(val) {
      this.listQuery.orgId = val
      this.addPointData.treeId = val
      //获取计划列表
      this.getList()
      this.getTree(val)
      //获取检测计划列表
      this.getDetectionPlan()
    },
    //导出图档
    daochu() {
      this.fileDialogData.dialogVisible = true
    },
    downloadFile(val) {
      let base = baseUrl()
      let parames = [
        { key: 'fileName', value: val },
        { key: 'taskId', value: this.sendPics.taskId },
        { key: 'imageIds', value: this.picDeletes.join(',') }
      ]
      let url =
        base +
        (this.fileDialogData.type == 2 ? '/exportTaskTXT' : '/exportTaskCSV')
      xiaZai(url, parames)
    },
    //企业选择
    companySelect() {
      this.companySelectData.dialogVisible = true
    },
    sureSwitch(val) {
      this.selectCompanyName = this.companySelectData.treeName
      this.switchCompanyFinish(val)
    },
    //检测任务下的密封点分页列表
    getTaskPointPage() {
      detection.getTaskPointPage(this.taskPointPage).then(res => {
        this.pointListByOrt = res.data.records
        this.totalPoint = res.data.total
      })
    },
    //密封点分页
    handleCurrentChange(val) {
      this.taskPointPage.current = val
      this.getTaskPointPage()
    },
    //图档密封点table多选
    handleSelectionChangePoint(val) {
      this.pointDeletes = []
      for (let i = 0; i < val.length; i++) {
        this.pointDeletes.push(val[i].id)
      }
    },
    //图档table多选
    selectionChangePic(val) {
      this.picDeletes = []
      for (let i = 0; i < val.length; i++) {
        this.picDeletes.push(val[i].imageId)
      }
    },
    //删除图档密封点
    deletePicPoint() {
      if (this.pointDeletes.length < 1) {
        return tip('请选择需要删除的密封点', 'error')
      }
      let sDelete = {
        pointIds: this.pointDeletes.join(','),
        taskId: this.sendPics.taskId
      }
      detection.deletePoints(sDelete).then(res => {
        tip(res.msg)
        this.getTaskImageList()
      })
    },
    //删除图档
    deletePic() {
      if (this.picDeletes.length < 1) {
        return tip('请选择需要删除的图档', 'error')
      }
      let sDelete = {
        imageIds: this.picDeletes.join(','),
        taskId: this.sendPics.taskId
      }
      detection.deleteImages(sDelete).then(res => {
        tip(res.msg)
        this.getTaskImageList()
      })
    },
    //确认选中图档
    surePicChoose() {
      let listIds = []
      for (var index = 0; index < this.chooseList.length; index++) {
        if (this.chooseList[index].length > 0) {
          let indexList = this.chooseList[index]
          for (var i = 0; i < indexList.length; i++) {
            listIds.push(indexList[i])
          }
        }
      }
      //        判断是否选择图档啊
      if (listIds.length == 0) return tip('请选择图档', 'warning')
      this.sendPics.imageIds = listIds
      const loading = this.$loading({
        lock: true,
        text: '正在努力新增图档...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      detection.addImage(this.sendPics).then(res => {
        tip(res.msg)
        loading.close()
        this.getTaskImageList()
        this.getList()
        this.dialogPicVisible = false
      })
    },
    //图档table多选
    handleSelectionChangePic(val) {
      this.picArr = val
      let currentList = []
      for (let i = 0; i < this.picArr.length; i++) {
        currentList.push(this.picArr[i].id)
      }
      this.chooseList[this.listQueryPic.current - 1] = currentList
      this.funJudgeAllSelect()
    },
    //activeClass
    selectedPic(ac, id) {
      this.acName = ac.toString()
      this.taskPointPage.imageId = id
      this.getTaskPointPage()
    },
    //公共弹窗
    detailFour(id, imgId) {
      this.pointData.dialogFormVisible = true
      this.pointData.imgId = imgId
      this.pointData.id = id
    },
    //获取push上去的临时密封点数组
    getArrByIds(obj) {
      let sendData = obj.data
      sendData.taskId = this.sendPics.taskId
      detection.addPoint(sendData).then(res => {
        tip(res.msg)
        this.getTaskImageList()
      })
    },
    //获取列表
    getList() {
      this.listLoading = true
      detection.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //获取检测计划列表
    getDetectionPlan() {
      //  detection.searchPlan(this.listQueryPlan).then(response => {
      //    console.log(response,'----------------------')
      detection.getTaskPlanList(this.listQuery.orgId).then(response => {
        this.planList = response.data
      })
    },
    //获取列表
    getTaskImageList() {
      org.getTaskImageList(this.listQueryPicLink).then(response => {
        this.pointListByOrtPic = response.data
        if (response.data.length > 0) {
          this.taskPointPage.imageId = this.pointListByOrtPic[0].imageId
          this.acName = '0'
          this.getTaskPointPage()
        } else {
          this.pointListByOrt = []
          this.totalPoint = 0
        }
      })
    },
    //获取字典---检测设备
    getDict(id) {
      system.dictGetDict(id).then(res => {
        //          检测设备  添加一个无路径检测
        let equipData = [
          {
            name: '无路径检测',
            id: 0
          }
        ]
        equipData.push(...res.data)
        this.equipOptions = equipData
      })
    },
    checkAddTask(formName) {
      var that = this

      this.$refs[formName].validate(valid => {
        if (valid) {
          that.addOrEdit()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addTaskAction() {
      this.detactionType = 'add'
      if (!this.listQuery.orgId) return tip('请选择企业', 'warning')
      this.dialogFormVisible = true
    },
    //新增编辑
    addOrEdit() {
      if (parseInt(this.addEdit.planId) % 1 != 0) {
        this.addEdit.planId = this.palnWid
      }
      this.addEdit.departmentId = this.listQuery.orgId
      detection.addOrEdit(this.addEdit).then(res => {
        this.isClick = false
        this.addPointData.orderOrTask = this.addEdit.checkType
        this.taskPointPage.type = this.addEdit.checkType
        this.taskPointPage.oId = res.data
        this.sendPics.taskId = res.data
        this.listQueryPicLink.taskId = res.data
        tip(res.msg)
        this.getList()
        this.getTaskImageList()
        this.dialogFormVisible = false
      })
    },
    //详情
    info(id) {
      this.gHeight = 740
      this.detactionType = 'detail'
      this.dialogFormVisible = true
      //查询详情
      detection.info(id).then(res => {
        var re = res.data.task
        this.sendPics.taskId = id
        this.listQueryPicLink.taskId = id
        this.getTaskImageList()
        this.isClick = false
        this.addEdit.checkMan = re.checkMan
        this.addEdit.checkStatus = re.checkStatus
        this.addEdit.checkType = re.checkType.toString()
        this.addEdit.distributionTime = re.distributionTime
        this.addEdit.equipId = re.equipId
        this.addEdit.exceptionPointNum = re.exceptionPointNum
        this.addEdit.id = re.id
        for (var i = 0; i < this.planList.length; i++) {
          if (
            i == this.planList.length - 1 &&
            this.planList[i].id != re.planId
          ) {
            this.palnWid = re.planId
            re.planId = re.planName
          }
        }
        this.addEdit.planId = re.planId
        this.addEdit.name = re.name
        this.addEdit.normalPointNum = re.normalPointNum
        this.addEdit.notes = re.notes
        this.addEdit.result = re.result
        this.addEdit.taskStatus = re.taskStatus
        this.addEdit.taskType = re.taskType.toString()
        this.taskPointPage.type = re.checkType
        this.addPointData.orderOrTask = re.checkType.toString()
        this.taskPointPage.oId = id
        //设备名字
        this.equipOptions.forEach(devRes => {
          if (devRes.id == re.equipId) {
            this.fileDialogData.deviceName = devRes.name
          }
          if (re.equipId == 0) {
            this.fileDialogData.deviceName = '无路径检测'
          }
        })
      })
    },
    //检测删除
    deleteIds(type, id) {
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          var arr = [],
            obj = {}
          if (type == 0) {
            arr.push(id)
          } else {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              arr.push(this.multipleSelection[i].id)
            }
          }
          obj.ids = arr.toString()
          detection.deleteIds(obj).then(res => {
            tip(res.msg)
            this.getList()
          })
        })
        .catch(_ => {})
    },
    //点击树
    treeNodeClickPic(data) {
      this.listQueryPic.orgId = data.id
      this.allSelected = false
      this.totalPic = 0
      this.chooseList = []
      this.getListPic()
    },
    //table多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    //分页
    handleSizeChangePic(val) {
      this.listQueryPic.current = val
      this.getListPic()
    },
    //拿树
    getTree(levelId) {
      let parame = { selectedOrgId: levelId }
      org.orgGetOrgTree(parame).then(res => {
        this.treeData = res.data
      })
    },
    //获取图档列表列表
    getListPic() {
      let that = this
      this.listLoadingPic = true
      org.imageFileListTask(this.listQueryPic).then(res => {
        that.listPic = res.data.records
        that.totalPic = res.data.total
        that.listLoadingPic = false

        if (that.lastPicOrgId !== that.listQueryPic.orgId) {
          that.lastPicOrgId = that.listQueryPic.orgId
          that.chooseList = []
          for (var index = 0; index < res.data.pages; index++) {
            that.chooseList.push([])
          }
          that.imageFilepages = res.data.pages
        } else {
          that.funPicSelectStatus()
        }
      })
    },
    funPicSelectStatus() {
      let currentSelectList = []
      let that = this
      if (!this.chooseList[this.listQueryPic.current - 1]) return
      this.chooseList[this.listQueryPic.current - 1].map(index => {
        that.listPic.map(item => {
          if (item.id === index) {
            currentSelectList.push(item)
          }
        })
      })
      setTimeout(function() {
        that.toggleSelection(currentSelectList)
      }, 0)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange(data, checked, indeterminate) {},
    handleClick(tab, event) {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.detectionData_task {
  .drPicLable {
    display: inline-block;
    width: 80px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    cursor: pointer;
  }
  .drPic {
    padding: 0 !important;
    position: relative;
    i {
      position: absolute;
      top: 13px;
      left: 16px;
    }
  }
  .detaction_type {
    .el-radio__label {
      font-size: 16px;
    }
  }
  .pointListByOrtPicHeight {
    .el-table__body-wrapper {
      height: 684px !important;
    }
  }
  .pointListByOrtHeight {
    .el-table__body-wrapper {
      height: 586px !important;
    }
  }
  .el-table__header-wrapper {
    background-color: #f5fcf5 !important;
  }
  .el-table::before {
    height: 0px !important;
  }
  .el-form-item__error {
    left: 20px;
  }
  .add_dia .el-textarea {
    min-width: 800px;
  }
  .add_point .el-main {
    padding: 20px 20px 0;
  }
  .remarks {
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .isClick:hover {
    color: #7bd0cb;
    text-decoration: underline;
  }
  .el-dialog__body {
    padding: 0 20px 10px 20px;
  }
  .detactionDetail .el-dialog {
    // max-height: 98%;
    margin-top: 1vh !important;
  }
  .picCss,
  .detactionPicTask {
    .pic_title {
      height: 710px;
      overflow-y: auto;
    }
  }
  .pic_title {
    border: 1px solid #ebeef5;
    width: 90%;

    .pic_title_ti {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #0db29f;
      font-size: 16px;
      background-color: #f5fcf5;
      margin-bottom: 20px;
    }
  }
  .spe_success {
    background-color: #5daf34;
  }
  .table_do {
    text-align: right;
  }
  .el-form--inline.search_top.this_Dtask .el-form-item {
    .el-form-item__content {
      width: 174px;
    }
  }
  .el-dialog {
    width: 50%;
  }
  .leftPic {
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #0db29f;
    cursor: pointer;
    box-sizing: border-box;
    padding-left: 10px;
    &.active {
      background-color: #f5fcf5;
    }
  }
  .add_dia {
    .el-form-item__content {
      box-sizing: border-box;
      padding-left: 20px;
      margin-left: 18px !important;
      padding-right: 35px;
    }
    .el-form-item__label {
      padding-left: 40px;
    }
    .el-input,
    .el-textarea {
      width: 95%;
    }
    .el-textarea {
      margin-left: 0;
    }
    .el-tree {
      padding-left: 60px;
    }
    &.add_point {
      .el-form-item__content {
        padding: 0 !important;
        margin: 0;
      }
      .el-form-item__label {
        padding-left: 0 !important;
      }
      .el-tree {
        padding-left: 0;
      }
      .el-dialog {
        margin-top: 1vh !important;
      }
    }
  }
  .dialog-add {
    .el-form-item {
      margin-bottom: 22px;
    }
  }
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
