<template>
  <div class="s_o_c">
    <!--fourtab-->
    <el-dialog class="s_o_c add_dia addDia add pointFour" :title="addPointData.dia_titile" :visible.sync="addPointData.dialogFormVisible" width="1200px" style="margin-top:-12vh">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form label-width="205px" :inline="true">
            <el-form-item label="群组编码：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.groupCode" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="扩展号：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.extendCode" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="密封点类型：">
              <el-select v-model="pointData.addInfoPoint.sealingPoint.type" placeholder="请选择">
                <el-option v-for="item in optionsType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="尺寸：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.size">></el-input>
            </el-form-item>
            <el-form-item label="密封点状态：">
              <el-select v-model="pointData.addInfoPoint.sealingPoint.status" placeholder="请选择">
                <el-option v-for="item in optionsStatus" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼层：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.floor"></el-input>
            </el-form-item>
            <el-form-item label="相态：">
              <el-select v-model="pointData.addInfoPoint.sealingPoint.phaseBehavior" placeholder="请选择">
                <el-option v-for="item in optionsBe" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="延长杆：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.extension"></el-input>
            </el-form-item>
            <el-form-item label="最近一次检测时间：">
              <el-date-picker v-model="pointData.addInfoPoint.sealingPoint.lastCheckTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="管线/设备名称：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.equipName"></el-input>
            </el-form-item>
            <el-form-item label="管线号/设备位号：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.equipCode"></el-input>
            </el-form-item>
            <el-form-item label="生产厂家：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.manufacturer"></el-input>
            </el-form-item>
            <el-form-item label="物流号：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.logistics"></el-input>
            </el-form-item>
            <el-form-item label="温度：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.temperature"></el-input>
            </el-form-item>
            <el-form-item label="压力：">
              <el-input v-model="pointData.addInfoPoint.sealingPoint.pressure"></el-input>
            </el-form-item><br>
            <el-form-item label="是否可达：">
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.reach" label=0>否</el-radio>
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.reach" label=1>是</el-radio>
            </el-form-item>
            <el-form-item label="是否盲端：">
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.blind" label="0">否</el-radio>
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.blind" label="1">是</el-radio>
            </el-form-item>
            <el-form-item label="是否保温：">
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.preservation" label="0">否</el-radio>
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.preservation" label="1">是</el-radio>
            </el-form-item>
            <el-form-item label="是否腐蚀：">
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.corrosion" label="0">否</el-radio>
              <el-radio v-model="pointData.addInfoPoint.sealingPoint.corrosion" label="1">是</el-radio>
            </el-form-item>
            <el-form-item label="物料信息：" class="mark_textarea pointFourTextArea">
              <el-input type="textarea" v-model="pointData.addInfoPoint.sealingPoint.materialsInfo"></el-input>
            </el-form-item>
            <el-form-item label="备注：" class="mark_textarea pointFourTextArea">
              <el-input type="textarea" v-model="pointData.addInfoPoint.sealingPoint.notes"></el-input>
            </el-form-item>
            <el-form-item class="mark_textarea t_a">
              <el-button type="success" @click="savePoint" v-if="isType">确定</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图档信息" name="fourth">
          <el-form label-width="180px" :inline="true">
            <el-row>
              <el-col :span="24"><img :src="pointData.img.src" alt=""></el-col>
            </el-row>
            <el-form-item label="图档编码">
              <el-input placeholder="图档编码" v-model="pointData.img.code" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="所属设备">
              <el-input placeholder="所属设备" v-model="pointData.img.equipment" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item class="mark_textarea tdms" label="图档描述">
              <el-input type="textarea" placeholder="图档描述" v-model="pointData.img.details" disabled="disabled"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="检测记录" name="second">
          <el-table :data="pointData.detection.list" border fit highlight-current-row element-loading-text="拼命加载中" style="">
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="任务名称">
            </el-table-column>
            <el-table-column label="任务类型">
              <template slot-scope="scope">
                <span v-if="scope.row.checkType == 0">检测任务</span>
                <span v-if="scope.row.checkType == 1">复测任务</span>
              </template>
            </el-table-column>
            <el-table-column prop="checkMan" label="检测人">
            </el-table-column>
            <el-table-column prop="detectionValue" label="测量值">
            </el-table-column>
            <el-table-column prop="taskResult" label="检测结果">
            </el-table-column>
            <el-table-column prop="checkTime" label="检测时间">
              <template slot-scope="scope">
                <span>{{scope.row.checkTime?scope.row.checkTime.split(' ')[0]:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="equipName" label="检测设备">
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @size-change="deSizeChange" :total="pointData.detection.total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="维修记录" name="third">
          <el-table :data="pointData.maintian.list" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%;">
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <!--<el-table-column prop="cname" label="工单编号">
            </el-table-column>-->
            <el-table-column prop="name" label="检测任务">
            </el-table-column>
            <el-table-column prop="repairUser" label="维修人员">
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{scope.row.createTime.split(' ')[0]}}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="distributionTime" label="分配时间">
              <template slot-scope="scope">
                <span>{{scope.row.distributionTime.split(' ')[0]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev,total,pager, next" :page-size="10" @current-change="handleCurrentChange" :total="pointData.maintian.total" style="text-align:center;">
            </el-pagination>
          </el-col>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

  </div>

</template>

<script>
import org from '@/api/standing'
import { type } from '@/utils/setFormType'
import maintain from '@/api/maintain'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import detection from '@/api/detection'
import system from '@/api/system'

export default {
  name: 'fourPoint',
  props: ['addPointData'],
  watch: {
    'addPointData.dialogFormVisible': function(n, o) {
      if (n) {
        this.pointInfo(this.addPointData.id)
        this.pointData.maintian.query.pointId = this.addPointData.id
        this.maintainList(this.addPointData.id)
        this.pointData.detection.query.pointId = this.addPointData.id
        this.detectionList(this.addPointData.id)
        this.imageInfo(this.addPointData.imgId)
        this.activeName = 'first'
      }
    }
  },
  data() {
    return {
      optionsType: [],
      optionsStatus: [],
      optionsBe: [],
      isType: true,
      list: null,
      listLoading: false,
      isAdd: false,
      activeName: 'first',
      pointData: {
        maintian: {
          list: [],
          total: 0,
          query: {
            pointId: '',
            current: 0
          }
        },
        detection: {
          list: [],
          total: 0,
          query: {
            pointId: '',
            current: 0
          }
        },
        img: {
          src: '',
          code: '',
          details: '',
          equipment: '',
          id: '',
          orgId: '',
          fileId: ''
        },
        addInfoPoint: {
          coordinates: {
            id: ''
          },
          sealingPoint: {
            imageFileId: '',
            phaseBehavior: '',
            notes: '',
            pressure: '',
            temperature: '',
            logistics: '',
            manufacturer: '',
            corrosion: '',
            id: '',
            blind: '',
            preservation: '',
            equipCode: '',
            equipName: '',
            lastCheckTime: '',
            extension: '',
            floor: '',
            reach: '',
            status: '',
            size: '',
            type: '',
            extendCode: '',
            groupCode: '',
            coordinates: '',
            materialsInfo: ''
          }
        }
      }
    }
  },
  methods: {
    //密封点详情
    pointInfo(id) {
      org.pointInfo(id).then(res => {
        let re = res.data
        this.pointData.addInfoPoint.coordinates.content = re.coordName
        this.pointData.addInfoPoint.sealingPoint.id = re.id
        this.pointData.addInfoPoint.sealingPoint.imageFileId = re.imageFileId
        this.pointData.addInfoPoint.sealingPoint.phaseBehavior =
          re.phaseBehavior
        this.pointData.addInfoPoint.sealingPoint.notes = re.notes
        this.pointData.addInfoPoint.sealingPoint.pressure = re.pressure
        this.pointData.addInfoPoint.sealingPoint.temperature = re.temperature
        this.pointData.addInfoPoint.sealingPoint.logistics = re.logistics
        this.pointData.addInfoPoint.sealingPoint.manufacturer = re.manufacturer
        this.pointData.addInfoPoint.sealingPoint.corrosion = (re.corrosion != null ? re.corrosion: '').toString()
        this.pointData.addInfoPoint.sealingPoint.blind = (re.blind != null ? re.blind: '').toString()
        this.pointData.addInfoPoint.sealingPoint.preservation = (re.preservation != null ? re.preservation: '').toString()
        this.pointData.addInfoPoint.sealingPoint.equipCode = re.equipCode
        this.pointData.addInfoPoint.sealingPoint.equipName = re.equipName
        this.pointData.addInfoPoint.sealingPoint.lastCheckTime =
          re.lastCheckTime
        this.pointData.addInfoPoint.sealingPoint.extension = re.extension
        this.pointData.addInfoPoint.sealingPoint.floor = re.floor
        this.pointData.addInfoPoint.sealingPoint.reach = (re.reach != null ? re.reach: '').toString()
        this.pointData.addInfoPoint.sealingPoint.status = re.status
        this.pointData.addInfoPoint.sealingPoint.size = re.size
        this.pointData.addInfoPoint.sealingPoint.extendCode = re.extendCode
        this.pointData.addInfoPoint.sealingPoint.groupCode = re.groupCode
        this.pointData.addInfoPoint.sealingPoint.coordinates = re.coordinates
        this.pointData.addInfoPoint.sealingPoint.materialsInfo =
          re.materialsInfo
        this.pointData.addInfoPoint.sealingPoint.type = re.type
      })
    },
    //图档详情
    imageInfo(id) {
      org.imageInfo(id).then(res => {
        let base = baseUrl()
        this.pointData.img.src =
          base + '/fileSave/downDrawing/' + res.data.object.secFileId
        this.pointData.img.code = res.data.object.code
        this.pointData.img.details = res.data.object.details
        this.pointData.img.id = res.data.object.id
        this.pointData.img.fileId = res.data.object.fileId
        this.pointData.img.orgId = res.data.object.orgId
        this.pointData.img.equipment = res.data.object.equipment
        this.pointData.img.details = res.data.object.details
        this.pointData.imageId = id
      })
    },
    //获取字典类型
    getDict(code) {
      let dictInfo = []
      system.dictGetDict(code).then(res => {
        dictInfo = res.data
        switch (code) {
          case 'point_type':
            this.optionsType = dictInfo
            break
          case 'point_status':
            this.optionsStatus = dictInfo
            break
          case 'phase_behavior':
            this.optionsBe = dictInfo
            break
          default:
        }
      })
      return dictInfo
    },
    handleClick(tab, event) {},
    //新增编辑
    savePoint() {
      org.pointAdd(this.pointData.addInfoPoint).then(res => {
        tip(res.msg)
        //          this.getList();
        this.pointData.dialogFormVisible = false
      })
    },
    //维修工单列表
    maintainList() {
      maintain
        .getOrderPageByPointId(this.pointData.maintian.query)
        .then(res => {
          this.pointData.maintian.list = res.data.records
          this.pointData.maintian.total = res.data.total
        })
    },
    handleCurrentChange(val) {
      this.pointData.maintian.query.current = val
      this.maintainList()
    },
    //检测任务列表
    detectionList() {
      detection
        .getTaskPageByPointId(this.pointData.detection.query)
        .then(res => {
          this.pointData.detection.list = res.data.records
          this.pointData.detection.total = res.data.total
        })
    },
    deSizeChange(val) {
      this.pointData.detection.query.current = val
      this.detectionList()
    }
  },
  mounted() {},
  created() {
    this.getDict('point_status')
    this.getDict('point_type')
    this.getDict('phase_behavior')
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.pointFour {
  .el-input {
    width: 100% !important;
  }
  .pointFourTextArea .el-textarea__inner {
    max-height: 60px !important;
    min-height: 60px !important;
    max-width: 860px !important;
    min-width: 860px !important;
  }
}
//  .el-dialog{
//     margin-top: 5vh !important;
//   }
</style>



