<template>
  <div class="picAdd">
    <!--图档详情-->
    <el-dialog class="s_o_c" :class="pic.picId?'add_dia':''" title="图档信息" :visible.sync="pic.dialogFormVisible" :before-close="handleClose" width='1500px'>
      <div class="t_l">
        <div class="cutLine" :class="!bzType?'detailsT':'addT'">
          <span>图档</span>
          <el-button type="" @click="addOrEdit" v-if="isType">
            <i class="floorImg6"></i>
            <span>保存</span>
          </el-button>
          <el-button type="" v-if="!bzType" @click="exportPDF">
            <i class="floorImg4"></i>
            <span>下载图档</span>
          </el-button>
          <el-button type="" v-if="isType">
            <label for="uploadImg">
              <i class="floorImg5"></i>
              <span style="line-height: 30px; float: right;">上传图档</span>
            </label><input type="file" id="uploadImg" @change="uploadImg" style="display: none">
          </el-button>
           <el-button type="" @click="addPointFunc">
            <i class="floorImg6"></i>
            <span>新增密封点</span>
          </el-button>
        </div>
      </div>
      <el-form :inline="true" class="form2 form6">
        <div :class="pic.picId!=0?'basc_data':''">
          <div>
            <div style="width:17%;float:left">
              <el-form-item label="图片编码：" class="changeS">
                <el-input type="text" placeholder="图片编码" v-model="addInfo.code"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="所属设备：" class="changeS">
                <el-input type="text" placeholder="所属设备" v-model="addInfo.equipment"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="图档描述：" class="form2Ta changeTd tdms">
                <el-input type="textarea" placeholder="图档描述" v-model="addInfo.details"></el-input>
              </el-form-item>
            </div>
            <div style="float:left;width:800px;margin:0 15px">


              <el-form-item label="图档：" class="form2Ta imgDown">
                <div style="background-color: #F5FBF6;height: 330px">
                  <canvas id="canvas" width="820" height="310"></canvas>
                </div>
              </el-form-item>
            </div>
          </div>
          <div style="width:25%;float:right" class="kz_code">
            <h3>标注点信息：</h3>

            <el-form-item label="密封点类型:">
              <el-select placeholder="请选择" v-model="addInfoPoint.sealingPoint.type" :disabled='!isChangesPonintData' @change='changesealingPointType'>
                <el-option v-for="item in optionsType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="相态：">
              <el-select placeholder="请选择" v-model="addInfoPoint.sealingPoint.phaseBehavior" :disabled='!isChangesPonintData'>
                <el-option v-for="item in optionsBe" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="尺寸：">
              <el-input v-model="addInfoPoint.sealingPoint.size" :disabled='!isChangesPonintData'></el-input>
            </el-form-item>
            <el-form-item label="楼层：">
              <el-input v-model="addInfoPoint.sealingPoint.floor" :disabled='!isChangesPonintData'></el-input>
            </el-form-item>

            <el-form-item label="是否可达：">
              <el-select placeholder="请选择" v-model="addInfoPoint.sealingPoint.reach" :disabled='!isChangesPonintData'>
                <el-option v-for="item in canReach" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物料信息">
              <el-input type="text" placeholder="物料信息" v-model="addInfoPoint.sealingPoint.materialsInfo" :disabled='!isChangesPonintData'></el-input>
            </el-form-item>
            <el-button type="success" @click="chechkeChangePointData" style="float:right">确 定</el-button>
            <br>
          </div>
        </div>
        <br>
        <div class="cutLine" v-if="!bzType">
          <span>密封点：</span>
          <el-button type="" v-if="isType" @click="pointDelete(checkedVal)">
            <i class="floorImg7"></i>
            <span>批量删除</span>
          </el-button>
          <el-button type="" v-if="isType" @click="changeFloor(4)">
            <i class="floorImg3"></i>
            <span>物料信息</span>
          </el-button>
          <el-button type="" v-if="isType" @click="changeFloor(3)">
            <i class="floorImg2"></i>
            <span>管线设备</span>
          </el-button>
          <el-button type="" v-if="isType" @click="changeFloor(2)">
            <i class="floorImg1"></i>
            <span>相态</span>
          </el-button>
          <el-button type="" v-if="isType" @click="changeFloor(1)">
            <i class="floorImg"></i>
            <span>楼层</span>
          </el-button>
        </div>
        <div :class="pic.picId!=0?'basc_data':''">
          <el-form-item label=" " class="form2Ta cw" v-if="!bzType">
            <el-table :data="listAdd" height="364" @selection-change="handleSelectionChange" v-loading="listLoadingAdd" border fit highlight-current-row element-loading-text="拼命加载中" style="width: 100%; height:364px;overflow-y:auto">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="groupCode" label="群组编码" width="160px">
              </el-table-column>
              <el-table-column prop="extendCode" label="扩展编码">
              </el-table-column>
              <el-table-column prop="typeName" label="密封点类型">
                <template slot-scope="scope">
                  <el-select @change="funSelectPointInfo(scope.row)" v-model="scope.row.type" placeholder="请选择">
                    <el-option v-for="item in optionsType" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="pointStatus" label="密封点状态">
              </el-table-column>
              <el-table-column prop="floor" label="楼层">
              </el-table-column>
              <el-table-column prop="reach" label="是否可达">
                <template slot-scope="scope">
                  <span v-if="scope.row.reach == 1">是</span>
                  <span v-if="scope.row.reach == 0">否</span>
                </template>
              </el-table-column>
              <el-table-column prop="coordName" label="标注点">
              </el-table-column>
              <el-table-column prop="operation" label="操作 " width="150">
                <template slot-scope="scope">
                  <i class="el-icon-tickets success btn" @click="pointInfoEdit($event,scope.row.id)" title="编辑/详情"></i>
                  <i class="el-icon-delete danger btn" @click="pointDelete(scope.row.id)" v-if="isType" title="删除"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <!--密封点详情-->
    <pointDetail :point="pointData" @reloadList="reloadList" @disOpen="okOpen = false" @hidePic="pointData.dialogAddVisible = false"></pointDetail>
    <el-dialog class="s_o_c add_dia" title="标注信息" :visible.sync="picUpload">
      <el-form :inline="true" class="form2 form6">
        <el-form-item label="标注内容:" class="small">
          <el-input type="text" placeholder="标注内容" v-model="uploadPic.content"></el-input>
        </el-form-item>
        <el-form-item label="X轴:" class="small">
          <el-input type="text" placeholder="X轴" v-model="uploadPic.nodeLeft" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="Y轴:" class="small">
          <el-input type="text" placeholder="Y轴" v-model="uploadPic.nodeTop" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item class="small t_a">
          <el-button type="success" @click="updateCoordinates" v-if="isType">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="changeTitle" class="changeFloor" :visible.sync="centerDialogVisible" width="500px" style="position: fixed;
    top: 20%;
    left: 15%;">
      <div style="margin-top:20px;text-align:center">
        <label for="" v-if="changeT != '管线设备'" :class="changeT=='物料信息'?'wl':''">{{changeT}}</label>
        <!-- 修改相态 ============================-->
        <el-select v-if="changeT == '相态'" v-model="floorVal" placeholder="请选择" style="margin-left:10px ;width: 60%; ">
          <el-option v-for="item in optionsBe" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- 楼层 ==============================-->
        <el-input v-if="changeT == '楼层'" type="text" placeholder="楼层" v-model="floorVal" style=" width: 60%;  margin-left: 10px;
    padding-left: 4px;"></el-input>

        <!-- 物料======================== -->
        <el-input v-if="changeT == '物料信息'" type="textarea" v-model="floorVal" style=" width: 80%;  margin-left: 4px;
    padding-left: 4px;"></el-input>
        <!-- 管线设备 =======================-->
        <label for="" v-if="changeT == '管线设备'" style='width:104px;display:inline-block'>管线/设备名称</label>
        <el-input v-if="changeT == '管线设备'" type="text" v-model="floorVal" style=" width: 60%;  margin-left: 4px;
    padding-left: 4px;"></el-input><br><br>
        <label for="" style='width:104px;display:inline-block' v-if="changeT == '管线设备'">管线号/设备位号</label>
        <el-input v-if="changeT == '管线设备'" type="text" v-model="equipCode" style=" width: 60%;  margin-left: 4px;
    padding-left: 4px;"></el-input>
        <!-- ======================================= -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="success" @click="chechkeChange">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class=" updatePointName" title="标注点" :visible.sync="updatePointT" width="400px">
      <el-form :inline="true" class="form2 form6">
        <el-form-item label="标注点：" class="small">
          <el-input type="text" placeholder="名称" v-model="pointName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatePointT = false">取 消</el-button>
        <el-button type="success" @click="updatePointName">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import org from '@/api/standing'
import pointDetail from '@/components/Addpoint/pointDetail'
import { tip, xiaZai, baseUrl } from '@/utils/tip'
import { type } from '@/utils/setFormType'
import system from '@/api/system'
export default {
  name: 'addPic',
  props: ['pic'],
  components: { pointDetail },
  watch: {

    'pic.dialogFormVisible': function(n, o) {
        this.picIdSession = sessionStorage.getItem('PICID')
      if (!this.pic.dialogFormVisible) {
        sessionStorage.setItem('equipment', this.addInfo.equipment)
        sessionStorage.setItem('details', this.addInfo.details)
        this.isChangesPonintData = false
        this.addInfoPoint = {
          coordinates: {
            content: '',
            top: 0,
            left: 0,
            id: '',
            nodeLeft: 0,
            nodeTop: 0
          },
          sealingPoint: {
            id: '',
            imageFileId: '',
            phaseBehavior: '', // 相态
            notes: '',
            pressure: '',
            temperature: '',
            logistics: '',
            manufacturer: '',
            corrosion: '',
            blind: '',
            preservation: '',
            equipCode: '',
            equipName: '',
            lastCheckTime: '',
            extension: '',
            floor: '', // 楼层
            reach: '',
            status: '',
            size: '', // 尺寸
            type: '', // 密封点类型
            extendCode: '', // 标注点  扩展编码
            groupCode: '',
            materialsInfo: '',
            coordinates: ''
          },
          createType: '1',
          rows: '',
          evennum: '',
          oddnum: '',
          totalnum: ''
        }
      } else {
        var point = JSON.parse(sessionStorage.getItem('pointing'))
        if (point) {
          this.type = 'TYPE'
          let re = point
          this.isChangesPonintData = false
          if (re.coordinatesId) {
            this.pointDataId = point.id
             this.upPoinCode = point.groupCode
            this.addInfoPoint.coordinates.content = re.coordName
            this.addInfoPoint.coordinates.id = re.coordinatesId
            this.addInfoPoint.sealingPoint.id = re.id
            this.addInfoPoint.sealingPoint.imageFileId = re.imageFileId
            this.addInfoPoint.sealingPoint.phaseBehavior = re.phaseBehavior
            this.addInfoPoint.sealingPoint.notes = re.notes
            this.addInfoPoint.sealingPoint.materialsInfo = re.materialsInfo
            this.addInfoPoint.sealingPoint.pressure = re.pressure
            this.addInfoPoint.sealingPoint.temperature = re.temperature
            this.addInfoPoint.sealingPoint.logistics = re.logistics
            this.addInfoPoint.sealingPoint.manufacturer = re.manufacturer
            this.addInfoPoint.sealingPoint.groupCode = re.groupCode
            this.addInfoPoint.sealingPoint.corrosion = (re.corrosion != null
              ? re.corrosion
              : ''
            ).toString()
            this.addInfoPoint.sealingPoint.blind = (re.blind != null
              ? re.blind
              : ''
            ).toString()
            this.addInfoPoint.sealingPoint.preservation = (re.preservation !=
            null
              ? re.preservation
              : ''
            ).toString()
            this.addInfoPoint.sealingPoint.equipCode = re.equipCode
            this.addInfoPoint.sealingPoint.equipName = re.equipName
            this.addInfoPoint.sealingPoint.lastCheckTime = re.lastCheckTime
            this.addInfoPoint.sealingPoint.extension = re.extension
            this.addInfoPoint.sealingPoint.floor = re.floor
            this.addInfoPoint.sealingPoint.reach = (re.reach != null
              ? re.reach
              : ''
            )
            this.addInfoPoint.sealingPoint.status = re.status
            this.addInfoPoint.sealingPoint.size = re.size
            this.addInfoPoint.sealingPoint.extendCode = re.extendCode

            this.addInfoPoint.sealingPoint.coordinates = re.coordinates
            this.addInfoPoint.sealingPoint.type = re.type
            this.addInfoPoint.totalnum = re.totalnum
          } else {
            this.addInfoPoint = point
            this.pointDataId = point.sealingPoint.coordinatesId
             this.upPoinCode = point.sealingPoint.groupCode
          }
        }
      }
      if (n) {
        this.addInfo.orgId = this.pic.orgId
        this.baseData = {
          base64Data: '',
          imageId: ''
        }
        if (this.pic.picId != 0) {
          this.listQueryAdd.imageId = this.pic.picId
          this.pointList()
          sessionStorage.setItem('PICID', this.pic.picId)
          this.bzType = false
          this.bzTitle = ''
        } else {
          this.bzType = true
          this.bzTitle = '标注前请先保存图档'
        }
      } else {
        this.img.src = ''
        this.img.show = false
        this.addInfo.id = ''
        this.addInfo.code = ''
        this.addInfo.details = ''
        this.addInfo.equipment = ''
        this.addInfo.fileId = ''
        this.listAdd = []
        this.totalAdd = 0
        this.listQueryAdd.current = 1
        let canvas = document.getElementById('canvas')
        canvas.setAttribute('height', '0')
        this.isRePaint = false
      }
    },
    okOpen: function(n, o) {
      if (n) {
        document.getElementById('canvas').style.border = '1px solid red'
        // tip('请在图片上点击您想标注的点进行标注！', 'warning')
      } else {
        document.getElementById('canvas').style.border = 'none'
      }
    }
  },
  created() {
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
    this.getDict('point_status')
    this.getDict('point_type')
    this.getDict('phase_behavior')
  },
  data() {
    return {
      type: '',
      isSubmit:'',
      upPoinCode: '',
      picIdSession: '',
      savePointSession: '',
      pointing: 0,
      clientWidth: document.documentElement.clientWidth * 0.8 * 0.54,
      pointDataId: 0,
      checkedVal: [],
      titleName: '', // 标注点信息
      updatePointT: false, // 双击修改密封点名称
      equipCode: '',
      value: '',
      optionsType: [],
      optionsStatus: [],
      optionsBe: [],
      floorVal: '',
      stage: '',
      centerDialogVisible: false,
      isRePaint: false,
      pdf: {
        ids: '',
        code: '',
        orgId: ''
      },
      //是否可达
      canReach: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
      baseData: {
        base64Data: '',
        imageId: ''
      },
      isType: true,
      bzType: true,
      bzTitle: '标注前请先保存图档',
      picUpload: false,
      uploadPic: {
        content: '',
        left: '',
        top: '',
        nodeLeft: '',
        nodeTop: '',
        id: ''
      },
      okOpen: false,
      listAdd: [],
      totalAdd: 0,
      listLoadingAdd: false,
      addInfo: {
        id: '',
        orgId: '',
        code: '',
        details: '',
        equipment: '',
        fileId: ''
      },
      img: {
        src: '',
        show: false
      },
      listQueryAdd: {
        imageId: '',
        current: 1,
        size: 1000
      },
      pointData: {
        imageFileId: '',
        dialogAddVisible: false,
        id: 0,
        ox: 0,
        oy: 0,
        addInfoCode: '',
        isChangesPonintData: 0
      },
      changeFloorType: 0,
      changeTitle: '修改楼层',
      changeT: '楼层',
      pData: [],
      updatePointNameId: '',
      pointName: '',
      isChangesPonintData: false,
      addInfoPoint: {
        coordinates: {
          content: '',
          top: 0,
          left: 0,
          id: '',
          nodeLeft: 0,
          nodeTop: 0
        },
        sealingPoint: {
          id: '',
          imageFileId: '',
          phaseBehavior: '', // 相态
          notes: '',
          pressure: '',
          temperature: '',
          logistics: '',
          manufacturer: '',
          corrosion: '',
          blind: '',
          preservation: '',
          equipCode: '',
          equipName: '',
          lastCheckTime: '',
          extension: '',
          floor: '', // 楼层
          reach: '',
          status: '',
          size: '', // 尺寸
          type: '', // 密封点类型
          extendCode: '', // 标注点  扩展编码
          groupCode: '',
          materialsInfo: '',
          coordinates: ''
        },
        createType: '1',
        rows: '',
        evennum: '',
        oddnum: '',
        totalnum: ''
      }
    }
  },
  methods: {
    addPointFunc(){
      this.pointData.addInfoCode = this.addInfo.code;
      this.pointData.id = '';
      this.pointData.dialogAddVisible = true;
    },
    //密封点新增
    pointAdd() {
        if(sessionStorage.getItem('type') == 'TYPE'){
          var point = JSON.parse(sessionStorage.getItem('pointing'))
        // this.picIdSession = sessionStorage.getItem('PICID')
        if (point) {
          if(point.sealingPoint){
            this.isSubmit = point.sealingPoint.imageFileId
          }

          let re = point
          if (re.coordinatesId) {
            this.pointDataId = point.id
             this.upPoinCode = point.groupCode
            this.addInfoPoint.coordinates.content = re.coordName
            this.addInfoPoint.coordinates.id = re.coordinatesId
            this.addInfoPoint.sealingPoint.id = re.id
            this.addInfoPoint.sealingPoint.imageFileId = re.imageFileId
            this.addInfoPoint.sealingPoint.phaseBehavior = re.phaseBehavior
            this.addInfoPoint.sealingPoint.notes = re.notes
            this.addInfoPoint.sealingPoint.materialsInfo = re.materialsInfo
            this.addInfoPoint.sealingPoint.pressure = re.pressure
            this.addInfoPoint.sealingPoint.temperature = re.temperature
            this.addInfoPoint.sealingPoint.logistics = re.logistics
            this.addInfoPoint.sealingPoint.manufacturer = re.manufacturer
            this.addInfoPoint.sealingPoint.groupCode = re.groupCode
            this.addInfoPoint.sealingPoint.corrosion = (re.corrosion != null
              ? re.corrosion
              : ''
            ).toString()
            this.addInfoPoint.sealingPoint.blind = (re.blind != null
              ? re.blind
              : ''
            ).toString()
            this.addInfoPoint.sealingPoint.preservation = (re.preservation !=
            null
              ? re.preservation
              : ''
            ).toString()
            this.addInfoPoint.sealingPoint.equipCode = re.equipCode
            this.addInfoPoint.sealingPoint.equipName = re.equipName
            this.addInfoPoint.sealingPoint.lastCheckTime = re.lastCheckTime
            this.addInfoPoint.sealingPoint.extension = re.extension
            this.addInfoPoint.sealingPoint.floor = re.floor
            this.addInfoPoint.sealingPoint.reach = (re.reach != null
              ? re.reach
              : ''
            )
            this.addInfoPoint.sealingPoint.status = re.status
            this.addInfoPoint.sealingPoint.size = re.size
            this.addInfoPoint.sealingPoint.extendCode = re.extendCode

            this.addInfoPoint.sealingPoint.coordinates = re.coordinates
            this.addInfoPoint.sealingPoint.type = re.type
            this.addInfoPoint.totalnum = re.totalnum
          } else {
            this.addInfoPoint = point
            this.pointDataId = point.sealingPoint.coordinatesId
             this.upPoinCode = point.sealingPoint.groupCode
          }
        }

        }

      if (this.pointData.isChangesPonintData == 1) {
        this.addInfoPoint.coordinates.top = this.pointData.oy
        this.addInfoPoint.sealingPoint.imageFileId = this.pointData.imageFileId
        this.addInfoPoint.coordinates.nodeTop = Number(this.pointData.oy) + 20
        this.addInfoPoint.coordinates.left = this.pointData.ox
        this.addInfoPoint.coordinates.id = ''
        this.addInfoPoint.sealingPoint.id = ''
        if (this.type == 'TYPE' || sessionStorage.getItem('type')== 'TYPE' ) {
          this.addInfoPoint.sealingPoint.groupCode = this.addInfo.code;
//
          if (this.picIdSession == this.pic.picId  && this.isSubmit == this.pic.picId) {
            this.addInfoPoint.sealingPoint.imageFileId = this.picIdSession
            if(this.upPoinCode){
              this.addInfoPoint.sealingPoint.groupCode = this.upPoinCode
            }else{
                this.addInfoPoint.sealingPoint.groupCode = this.addInfo.code
            }

          } else {
            this.addInfoPoint.sealingPoint.imageFileId = this.pic.picId
            this.addInfoPoint.sealingPoint.groupCode = this.addInfo.code
          }
        }
        this.addInfoPoint.coordinates.nodeLeft = Number(this.pointData.ox) + 20
        if (
          this.checkedImgId != 0 &&
          this.checkedImgId != this.pointData.imageFileId
        ) {
          if (
            this.groupCode == this.addInfoPoint.sealingPoint.groupCode &&
            this.pic.picId != this.picIdSession
          ) {
            this.$message({
              message: '群组编码重复，请重新输入！',
              type: 'warning'
            })
            return false
          }
        }
      } else {
        this.addInfoPoint.coordinates.id = ''
        this.addInfoPoint.sealingPoint.id = ''
        this.addInfoPoint.coordinates.top = this.pointData.oy
        this.addInfoPoint.coordinates.left = this.pointData.ox
        this.addInfoPoint.coordinates.nodeTop = Number(this.pointData.oy) + 20
        this.addInfoPoint.coordinates.nodeLeft = Number(this.pointData.ox) + 20
      }
      if (this.checkPointinfo(this.addInfoPoint) == false) return
      //      if(this.addInfoPoint.sealingPoint.reach == '否'){
      //  this.addInfoPoint.sealingPoint.reach = 0
      // }else if(this.addInfoPoint.sealingPoint.reach == '是'){
      //   this.addInfoPoint.sealingPoint.reach = 1
      // }
      this.changesealingPointType()
      console.log(this.addInfoPoint)
      org.pointAdd(this.addInfoPoint).then(res => {
        // if(res.data.sealingPoint.reach == 0){
        //   res.data.sealingPoint.reach = '否'
        // }else if(res.data.sealingPoint.reach == 1){
        //   res.data.sealingPoint.reach = '是'
        // }
        tip(res.msg)
        //  sessionStorage.setItem('pointing',res.data.sealingPoint.id);
        sessionStorage.setItem('pointing', JSON.stringify(res.data))
        this.pointList()
        this.addInfoPoint = res.data
        this.picIdSession = this.pic.picId;
        this.upPoinCode =  this.addInfoPoint.sealingPoint.groupCode;
        this.isChangesPonintData = true
        this.addInfoPoint.coordinates.id = res.data.sealingPoint.coordinatesId
      })
    },

    checkPointinfo(element) {
      //监测点字段验证
      for (let key in element) {
        let eleValue = element[key]
        //属性是否被定义
        if (eleValue != undefined) {
          if (element[key].constructor == String) {
            //  先根据是增加还是修改过滤字段
            if (!this.isAdd) {
              //  修改的时候不需要处理的字段
              if (key == 'createType' || key == 'extendCode') {
                continue
              }
            } else {
              //创建的时候不需要的
              if (key == 'id' || key == 'coordinates') {
                continue
              }
            }

            //        先判断不能为空的字段  在判断数据格式
            if (eleValue != '') {
              switch (key) {
                case 'groupCode':
                  //       群组编码
                  if (eleValue.length != 14) {
                    tip('请输入14位群组编码', 'warning')
                    return false
                  }
                  break
                case 'extendCode':
                  if (this.addInfoPoint.createType != '2') {
                    //                  扩展号
                    if (!/^[A-Z]+$/.test(eleValue)) {
                      tip('扩展号只能输入一位大写字母', 'warning')
                      return false
                    }
                  }
                  break
                case 'totalnum':
                  //                  扩展号
                  const numReg = /^[0-9]*$/
                  if (!numReg.test(eleValue)) {
                    tip('创建数量只能输入整数', 'warning')
                    return false
                  }
                  if (eleValue.length > 3) {
                    tip('创建数量最多只能输入3位数', 'warning')
                    return false
                  }
                  break
                //空冷的时候需要判断
                case 'rows':
                  if (this.addInfoPoint.createType == '2') {
                    const numReg = /^[0-9]*$/
                    if (!numReg.test(eleValue)) {
                      tip('行数只能输入整数', 'warning')
                      return false
                    }
                    if (eleValue.length > 3) {
                      tip('行数最多只能输入3位数', 'warning')
                      return false
                    }
                  }
                  break
                case 'evennum':
                  if (this.addInfoPoint.createType == '2') {
                    const numReg = /^[0-9]*$/
                    if (!numReg.test(eleValue)) {
                      tip('双行数量只能输入整数', 'warning')
                      return false
                    }
                    if (eleValue.length > 3) {
                      tip('行数最多只能输入3位数', 'warning')
                      return false
                    }
                  }
                  break
                case 'oddnum':
                  if (this.addInfoPoint.createType == '2') {
                    const numReg = /^[0-9]*$/
                    if (!numReg.test(eleValue)) {
                      tip('单行数量只能输入整数', 'warning')
                      return false
                    }
                    if (eleValue.length > 3) {
                      tip('行数最多只能输入3位数', 'warning')
                      return false
                    }
                  }
                  break
                case 'size':
                  //                  尺寸
                  const sizeReg = /^[0-9]*$/
                  if (!sizeReg.test(eleValue)) {
                    tip('尺寸只能输入整数', 'warning')
                    return false
                  }
                  if (eleValue.length > 3) {
                    tip('尺寸不能大于3位', 'warning')
                    return false
                  }
                  break
                case 'floor':
                  //                  楼层
                  const floorReg = /^\d+(\.\d+)?$/
                  if (!floorReg.test(eleValue)) {
                    tip('楼层只能输入整数', 'warning')
                    return false
                  }
                  if (eleValue.length > 2) {
                    tip('楼层不能大于2位数字', 'warning')
                    return false
                  }
                  break
                case 'equipName':
                  //                  管线/设备名称
                  if (eleValue.length > 50) {
                    tip('管线/设备名称不能大于50个字', 'warning')
                    return false
                  }
                  break
                case 'equipCode':
                  //                  管线号/设备位号
                  if (eleValue.length > 20) {
                    tip('管线/设备名称不能大于20位', 'warning')
                    return false
                  }
                  break
                case 'manufacturer':
                  //                  生产厂家
                  if (eleValue.length > 20) {
                    tip('管线/设备名称不能大于20个字', 'warning')
                    return false
                  }
                  break
                case 'logistics':
                  //                  物流号
                  const logisticsReg = /^[A-Za-z0-9]+$/
                  if (!logisticsReg.test(eleValue)) {
                    tip('物流号只能输入字母和数字', 'warning')
                    return false
                  }
                  if (eleValue.length > 8) {
                    tip('物流号不能超过8位', 'warning')
                    return false
                  }
                  break
                case 'notes':
                  //                  备注
                  if (eleValue.length > 100) {
                    tip('备注不能大于100个字', 'warning')
                    return false
                  }
                  break
                case 'temperature':
                  //                  温度
                  const temReg = /^\d+(\.\d+)?$/
                  if (!temReg.test(eleValue)) {
                    tip('温度只能输入数字', 'warning')
                    return false
                  }
                  break
                case 'pressure':
                  //                  压力
                  const pressureReg = /^\d+(\.\d+)?$/
                  if (!pressureReg.test(eleValue)) {
                    tip('压力只能输入数字', 'warning')
                    return false
                  }
                  break
                default:
                  break
              }
            } else {
              switch (key) {
                case 'createType':
                  tip('请选择创建方式', 'warning')
                  return false
                case 'groupCode':
                  tip('请输入群组编码', 'warning')
                  return false
                case 'type':
                  tip('请选择密封点类型', 'warning')
                  return false
                case 'size':
                  tip('请输入尺寸', 'warning')
                  return false
                case 'status':
                  tip('请选择密封点状态', 'warning')
                  return false
                case 'floor':
                  tip('请输入楼层', 'warning')
                  return false
                case 'phaseBehavior':
                  tip('请选择相态', 'warning')
                  return false
                case 'extendCode':
                  if (this.addInfoPoint.createType != '2') {
                    tip('请输入扩展编码', 'warning')
                    return false
                  }
                  break
                case 'totalnum':
                  if (this.addInfoPoint.createType == '3') {
                    tip('请输入创建数量', 'warning')
                    return false
                  }
                  break
                case 'reach':
                  tip('请选择是否可达', 'warning')
                  return false
                default:
                  break
              }
            }
          } else if (element[key].constructor == Object) {
            if (this.checkPointinfo(element[key]) == false) {
              return false
            }
          }
        }
      }
      return true
    },
    chechkeChangePointData() {

      if (!this.pointDataId) {
        return tip('还未选择任何标注点！', 'error')
      }
      if (this.checkPointinfo(this.addInfoPoint) == false) return
      this.addInfoPoint.sealingPoint.coordinatesId = this.addInfoPoint.coordinates.id
      org.pointAdd(this.addInfoPoint).then(res => {
        tip('修改成功')
        sessionStorage.setItem('pointing',JSON.stringify(res.data))
        this.pointList()
      })
    },
    changesealingPointType() {
      this.optionsType.map(item => {
        if (item.id == this.addInfoPoint.sealingPoint.type) {
          this.addInfoPoint.sealingPoint.extendCode = item.remark
        }
      })
    },
    // 密封点详情
    getpointInfo(id, type) {
      org.pointInfo(id).then(res => {
          sessionStorage.setItem('pointing',JSON.stringify(res.data) )
          sessionStorage.setItem('PICID',this.pic.picId)
        if (type == 'TYPE') {
          this.isChangesPonintData = false
        } else {
          this.isChangesPonintData = true
        }
        this.dialogAddVisible = true
        this.isAdd = false
        let re = res.data
        // this.isChangesPonintData = false
        this.addInfoPoint.coordinates.content = re.coordName
        this.addInfoPoint.coordinates.id = re.coordinatesId
        this.addInfoPoint.sealingPoint.id = re.id
        this.addInfoPoint.sealingPoint.imageFileId = re.imageFileId
        this.addInfoPoint.sealingPoint.phaseBehavior = re.phaseBehavior
        this.addInfoPoint.sealingPoint.notes = re.notes
        this.addInfoPoint.sealingPoint.materialsInfo = re.materialsInfo
        this.addInfoPoint.sealingPoint.pressure = re.pressure
        this.addInfoPoint.sealingPoint.temperature = re.temperature
        this.addInfoPoint.sealingPoint.logistics = re.logistics
        this.addInfoPoint.sealingPoint.manufacturer = re.manufacturer
        this.addInfoPoint.sealingPoint.groupCode = re.groupCode
        this.upPoinCode = re.groupCode
        this.addInfoPoint.sealingPoint.corrosion = (re.corrosion != null
          ? re.corrosion
          : ''
        ).toString()
        this.addInfoPoint.sealingPoint.blind = (re.blind != null
          ? re.blind
          : ''
        ).toString()
        this.addInfoPoint.sealingPoint.preservation = (re.preservation != null
          ? re.preservation
          : ''
        ).toString()
        this.addInfoPoint.sealingPoint.equipCode = re.equipCode
        this.addInfoPoint.sealingPoint.equipName = re.equipName
        this.addInfoPoint.sealingPoint.lastCheckTime = re.lastCheckTime
        this.addInfoPoint.sealingPoint.extension = re.extension
        this.addInfoPoint.sealingPoint.floor = re.floor
        this.addInfoPoint.sealingPoint.reach = (re.reach != null
          ? re.reach
          : ''
        )
        this.addInfoPoint.sealingPoint.status = re.status
        this.addInfoPoint.sealingPoint.size = re.size
        this.addInfoPoint.sealingPoint.extendCode = re.extendCode

        this.addInfoPoint.sealingPoint.coordinates = re.coordinates
        this.addInfoPoint.sealingPoint.type = re.type
        this.addInfoPoint.totalnum = re.totalnum
      })
    },
    //获取相态
    getPhaseBehaviorDict() {
      system.dictGetDict('phase_behavior').then(res => {
        this.phaseOptions = res.data
      })
    },
    funSelectPointInfo(value) {
      var dataD = {
        id: value.id,
        type: value.type,
        extendCode: ''
      }
      this.optionsType.map(item => {
        if (item.id == value.type) {
          dataD.extendCode = item.remark
        }
      })
      org.savePointDetails(dataD).then(res => {
        this.addInfoPoint.sealingPoint.type = value.type
        this.pointList()
        // this.imageInfo(this.pic.picId)
      })
    },
    //  双击修改密封点名称
    updatePointName() {
      this.uploadPic.content = this.pointName
      var _t = this
      org.updateCoordinates(this.uploadPic).then(res => {
        if (res.status == 1) {
          _t.imageInfo(this.pic.picId) //标注点位置变化后 不重新渲染
          _t.updatePointT = false
          tip('修改成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //获取字典类型
    getDict(code) {
      let dictInfo = []
      system.dictGetDict(code).then(res => {
        dictInfo = res.data
        switch (code) {
          case 'point_type': // 密封点类型
            this.optionsType = dictInfo
            break
          case 'point_status': //
            this.optionsStatus = dictInfo
            break
          case 'phase_behavior': // 相态
            this.optionsBe = dictInfo
            break
          default:
        }
      })
      return dictInfo
    },
    //判断是否有选中数据
    handleSelectionChange: function(val) {
      this.checkedVal = []
      val.map(item => {
        this.checkedVal.push(item.id)
      })
    },
    //未选中 弹出提示框
    changeFloor: function(type) {
      if (type == 1) {
        this.changeTitle = '修改楼层'
        this.changeT = '楼层'
      } else if (type == 2) {
        this.changeTitle = '修改相态'
        this.changeT = '相态'
      } else if (type == 3) {
        this.changeTitle = '修改管线设备'
        this.changeT = '管线设备'
      } else if (type == 4) {
        this.changeTitle = '修改物料信息'
        this.changeT = '物料信息'
      }
      if (this.checkedVal.length > 0) {
        this.centerDialogVisible = true
      } else {
        this.open4()
      }
    },
    open4() {
      this.$message.error('请选择需要修改的数据')
    },
    chechkeChange: function() {
      let val = {}
      var isNum = false
      val.ids = this.checkedVal.join(',')
      if (this.changeTitle == '修改楼层') {
        //验证数据的有效性
        const floorReg = /^\d+(\.\d+)?$/
        if (!floorReg.test(this.floorVal)) {
          return tip('楼层只能输入整数', 'warning')
        }
        if (this.floorVal.length > 2) {
          return tip('楼层不能大于2位数字', 'warning')
        }
        val.floor = this.floorVal
      } else if (this.changeTitle == '修改相态') {
        val.phaseBehavior = this.floorVal
      } else if (this.changeTitle == '修改管线设备') {
        val.equipName = this.floorVal
        val.equipCode = this.equipCode
      } else if (this.changeTitle == '修改物料信息') {
        val.materialsInfo = this.floorVal
      }
      if (!isNum) {
        org.changeFloor(val).then(res => {
          if (res.status) {
            tip(res.msg)
          }
          this.centerDialogVisible = false
          this.floorVal = ''
          this.equipCode = ''
          this.pointList()
        })
      }
    },
    //上传base64
    handleClose(done) {
      let canvas = document.getElementById('canvas')
      this.baseData.base64Data = canvas.toDataURL();
       this.isRePaint = true
      if (this.baseData.base64Data && this.baseData.imageId && this.isRePaint) {
        const loading = this.$loading({
          lock: true,
          text: '正在努力上传图档...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        org.uploadBase64(this.baseData).then(res => {
          loading.close()
          if (done) {
            done()
          } else {
            // this.pic.dialogFormVisible = false
          }
        })
      } else {
        if (done) {
          done()
        } else {
          // this.pic.dialogFormVisible = false
        }
      }
    },
    //导出pdf
    exportPDF() {
      this.handleClose()
      this.handleClose(res => {
        let base = baseUrl()
        let url =
          base +
          '/exportPDF?orgId=' +
          this.addInfo.orgId +
          '&code=' +
          this.addInfo.code +
          '&ids=' +
          this.pdf.ids +
          '&current=1&size=10'
        xiaZai(url, [
          { key: 'orgId', value: this.addInfo.orgId },
          { key: 'code', value: this.addInfo.code },
          { key: 'ids', value: this.pdf.ids },
          { key: 'current', value: 1 },
          { key: 'size', value: 10 }
        ])
      })
    },
    //上传图片
    uploadImg(e) {
      let files = e.target.files || e.dataTransfer.files
      let formData = new FormData()
      formData.append('image', files[0])
      if (files.length > 0) {
        org.uploadDrawing(formData).then(res => {
          tip('上传成功！')
          let canvas = document.getElementById('canvas')
          canvas.setAttribute('height', '320')
          let base = baseUrl()
          this.img.src = base + '/fileSave/downDrawing/' + res.data[0].id
          this.img.show = true
          this.addInfo.fileId = res.data[0].id
          this.jTopDo()
        })
      }
    },
    //新增编辑
    addOrEdit() {
      this.handleClose()
      //验证是否填写图档
      if (this.addInfo.code === '') {
        tip('请填写图片编码', 'warning')
        return
      }
      org.imageAddOrEdit(this.addInfo).then(res => {
        this.pic.dialogFormVisible = false
        this.pointData.imageFileId = res.data
        this.listQueryAdd.imageId = res.data
        this.baseData.imageId = res.data
        this.pic.picId = res.data
        this.bzTitle = ''
        this.isRePaint = true
        tip(res.msg)
        this.$emit('reloadList')
      })
    },
    //删除密封点
    pointDelete(id) {
      if(id.length <= 0){
          tip('还未选择任何数据','error')
          return false
      }
      this.$confirm('您确认要删除此数据吗？删除数据后将不可恢复，请谨慎操作!')
        .then(_ => {
          const loading = this.$loading({
            lock: true,
            text: '正在删除...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
          })
          let arr = [id],
            obj = {}
          obj.pointIds = arr.toString()
          org.pointDelete(obj).then(res => {
            loading.close()
            if (!res.data) {
              tip('删除成功！')
              // this.imageInfo(this.pic.picId)
              this.pointList()
            } else {
              tip(res.data, 'error')
              // this.imageInfo(this.pic.picId)
              this.pointList()
            }
          })
        })
        .catch(_ => {})
    },
    //获取列表
    pointList() {
      this.listLoadingAdd = true
      org.pointList(this.listQueryAdd).then(res => {
        this.listAdd = res.data.records
        this.imageInfo(this.pic.picId)
        this.totalAdd = res.data.total
        this.listLoadingAdd = false
      })
    },
    //更新节点信息
    updateCoordinates(type) {
      org.updateCoordinates(this.uploadPic).then(res => {
        this.picUpload = false
        if (type == 1) {
          this.imageInfo(this.pic.picId, 111) //标注点位置变化后 不重新渲染
        }
        this.isRePaint = true
      })
    },
    //图档详情
    imageInfo(id, type) {
      let pData = []
      org.imageInfo(id).then(res => {
        if (type == 111) {
          this.pData = res.data.coordinates
        } else {
          this.pData = res.data.coordinates
          pData = res.data.coordinates
          this.baseData.imageId = id
          this.bzType = false
          this.bzTitle = ''
          this.pic.dialogFormVisible = true
          let base = baseUrl()
          this.img.src =
            base + '/fileSave/downDrawing/' + res.data.object.fileId
          this.img.show = true
          if (type == true) {
          } else {
            this.addInfo.id = res.data.object.id
            this.addInfo.orgId = res.data.object.orgId

            if (!this.addInfo.code) {
              this.addInfo.code = res.data.object.code || ''
            }
            if (res.data.object.equipment) {
              this.addInfo.equipment = res.data.object.equipment || ''
            } else {
              this.addInfo.equipment = sessionStorage.getItem('equipment') || ''
            }
            if (res.data.object.details) {
              this.addInfo.details = res.data.object.details || ''
            } else {
              this.addInfo.details = sessionStorage.getItem('details') || ''
            }
            this.addInfo.fileId = res.data.object.fileId
          }
          this.pdf.ids = res.data.object.id
          this.pdf.orgId = res.data.object.orgId
          this.pdf.code = res.data.object.code
          this.listQueryAdd.imageId = id
          this.pointData.imageFileId = id
          // this.pointList()
          let canvas = document.getElementById('canvas')
          canvas.height = 320
          this.jTopDo(pData)
        }
      })
    },
    //分页
    handleCurrentChangeAdd(val) {
      this.listQueryAdd.current = val
      this.pointList()
    },
    //打开密封点弹窗
    pointInfo(e, id, type) {
      if (type == 0) {
        this.pointData.dialogAddVisible = true
      } else {
        if (this.isChangesPonintData || this.type == 'TYPE' || sessionStorage.getItem('type') == 'TYPE') {
          this.pointData.dialogAddVisible = false
        } else {
          this.pointData.dialogAddVisible = true
        }
      }

      // if (this.okOpen) {
      this.pointData.ox = e.offsetX
      this.pointData.oy = e.offsetY
      this.pointData.id = id
      // }
    },
    //点击编辑打开密封点弹窗
    pointInfoEdit(e, id) {
      this.pointData.dialogAddVisible = true
      this.pointData.id = id
    },
    //密封点保存成功
    reloadList() {
      // this.imageInfo(this.pic.picId)
      this.pointList()
      this.pointData.dialogAddVisible = false
      this.isRePaint = true
      this.$emit('reloadList')
    },
    //jtop渲染
    jTopDo(pData) {
      let _t = this
      // _t.$nextTick(() => {
      let canvas = document.getElementById('canvas')
      if (_t.stage) {
        _t.stage.clear()
      } else {
        _t.stage = new JTopo.Stage(canvas)
      }
      //显示工具栏
      //  showJTopoToobar(stage);
      let base = ''
      let img = new Image()
      img.onload = function() {
        let canvas1 = document.createElement('canvas')
        ;(canvas1.width = img.width), (canvas1.height = img.height)
        let g = canvas1.getContext('2d')
        g.drawImage(img, 0, 0, img.width, img.height)
        base = canvas1.toDataURL()
        let scene = new JTopo.Scene(_t.stage)
        scene.background = base
        scene.addEventListener('dbclick', function(event) {
          if (!event.target) {
            if (_t.picUpload) {
            } else {
              _t.pointData.addInfoCode = _t.addInfo.code
              _t.okOpen = true
              if (_t.isChangesPonintData || _t.type == 'TYPE' || sessionStorage.getItem('type') == 'TYPE') {
                if(sessionStorage.getItem('type') == 'TYPE'){
                    _t.pointDataId = sessionStorage.getItem('pointId')
                }
                _t.pointData.isChangesPonintData = 1
                _t.pointInfo(event, _t.pointDataId)
                _t.pointAdd()
              } else {
                _t.pointData.isChangesPonintData = 0
                if (_t.pointing) {
                  _t.pointData.isChangesPonintData = 'type'
                  _t.pointInfo(event, _t.pointing)
                } else {
                  _t.pointInfo(event, 0)
                }
              }
            }
          } else {
            _t.okOpen = true
            _t.listAdd.map(item => {
              if (event.target.id == item.coordinatesId) {
                _t.pointInfo(event, item.id, 0)
              }
            })
          }
        })
        scene.mode = 'select'
        scene.areaSelect = false
        if (pData) {
          for (let i = 0; i < pData.length; i++) {
            let isDrag = false
            //原型节点
            let circleNode = new JTopo.CircleNode()
            circleNode.radius = 5 // 半径
            circleNode.alpha = 1
            circleNode.setLocation(pData[i].left, pData[i].top)
            circleNode.fillColor = '255, 0, 0' // 填充颜色
            circleNode.fontColor = '255, 0, 0, 0' // 填充颜色
            circleNode.id = pData[i].id // id
            scene.add(circleNode)
            //文字节点
            let node = new JTopo.Node(pData[i].content)
            if (pData[i].content.length > 2) {
              var setSizeWidth = pData[i].content.length * 14
              node.setSize(setSizeWidth, 20) // 尺寸]
            } else {
              node.setSize(34, 20) // 尺寸]
            }
            node.font = '12px 微软雅黑' // 字体
            node.textPosition = 'Middle_Center' // 文字居中
            node.textOffsetY = -7 // 文字向下偏移8个像素
            node.borderRadius = 5 // 圆角
            node.setLocation(pData[i].nodeLeft, pData[i].nodeTop)

            node.borderWidth = 2 // 边框的宽度
            node.borderColor = '255,255,255' //边框颜色
            node.fillColor = '0, 0, 0' // 填充颜色
            node.id = pData[i].id // id
            scene.add(node)

            node.addEventListener('mouseup', function(event) {
              _t.uploadPic.nodeLeft = event.offsetX - 16
              _t.uploadPic.nodeTop = event.offsetY - 10
              _t.uploadPic.id = event.target.id
              for (let item of _t.pData) {
                if (item.id == _t.uploadPic.id) {
                  _t.uploadPic.left = item.left
                  _t.uploadPic.top = item.top
                }
              }
              _t.updateCoordinates(1)
              isDrag = false
            })
            node.addEventListener('mousedrag', function(event) {
              isDrag = false
            })
            node.addEventListener('click', function(event) {
              if (event.target) {
                for (var i = 0; i < _t.listAdd.length; i++) {
                  if (event.target.id == _t.listAdd[i].coordinatesId) {
                    _t.pointDataId = _t.listAdd[i].id
                    _t.getpointInfo(_t.listAdd[i].id)
                    console.log(_t.listAdd[i], '---------------------------')
                    _t.picIdSession = sessionStorage.getItem('PICID')
                    // sessionStorage.setItem('pointing', _t.listAdd[i].id)
                    // sessionStorage.setItem(
                    //   'pointing',
                    //   JSON.stringify(_t.listAdd[i])
                    // )

                    break
                  }
                }
                _t.listAdd.map(item => {})
              } else {
              }
            })
            // --------------------------------------------------------------------------------------------------------
            circleNode.addEventListener('mouseup', function(event) {
              let canvas = document.getElementById('canvas')
              let url = canvas.toDataURL('image/png')
              _t.uploadPic.left = event.offsetX - 5
              _t.uploadPic.top = event.offsetY - 5
              _t.uploadPic.id = event.target.id
              for (let item of _t.pData) {
                if (item.id == _t.uploadPic.id) {
                  _t.uploadPic.nodeLeft = item.nodeLeft
                  _t.uploadPic.nodeTop = item.nodeTop
                }
              }
              _t.updateCoordinates(1)
            })

            //连线
            let link = new JTopo.CurveLink(node, circleNode)
            for (var j = 0; j < _t.listAdd.length; j++) {
              if (pData[i].id == _t.listAdd[j].coordinatesId) {
                if (_t.listAdd[j].airCool == '1') {
                  link.strokeColor = '0,0,255'
                } else {
                  if (_t.listAdd[j].reach == 1) {
                    link.strokeColor = '0,0,255'
                  } else {
                    link.strokeColor = '255,0,0 '
                  }
                }
              }
            }
            //  link.strokeColor = '255,0,0'

            link.lineWidth = 3 // 线宽

            scene.add(link)
          }
        }
      }
      img.crossOrigin = 'anonymous' //关键
      img.src = this.img.src
      // })
    }
  },
  mounted() {
    if (type() == 2 || type() == 3) {
      this.isType = false
    }
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.updatePointName .el-dialog {
  .small {
    margin-bottom: 20px;
    margin-top: 40px;
    .el-form-item__content {
      width: 76% !important;
    }
  }
  .el-button {
    padding: 12px 20px !important;
  }
}

.imgDown {
  .el-form-item__label {
    width: 100% !important;
    text-align: left !important;
  }

  .el-form-item__content {
    width: auto !important;
  }
}
.kz_code {
  .el-form-item__label {
    width: 100px;
  }
  //  .el-input__inner,
  .el-form-item__content {
    width: 72% !important;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 8px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.s_o_c .el-dialog__body .el-form.form2 .el-form-item.form2Ta {
  // width: 100%;
}
.picAdd {
  .cw {
    width: 100%;
  }
  .cutLine {
    background-color: #f3f9f9;
    height: 45px;
    clear: both;
    span {
      display: inline-block;
      border-left: 4px solid #0db29f;
      padding-left: 10px;
      line-height: 15px;
      position: relative;
      top: 10px;
      font-size: 16px;
    }
  }
  .el-form-item__label {
    text-align: left;
  }
  .s_o_c .el-dialog__body {
    padding-top: 15px;
    padding-right: 0;
  }
  .s_o_c .el-dialog__body .el-form.form2 .el-form-item .el-form-item__content {
    width: 95%;
  }
  .s_o_c
    .el-dialog__body
    .el-form.form2
    .el-form-item.form2Ta
    .el-form-item__content {
    width: 102%;
  }
  .s_o_c .el-dialog__body .el-form.form2 .el-form-item.small {
    // width: 98%;
    .el-form-item__label {
      width: 90px;
    }
    .el-form-item__content {
      width: 78%;
    }
  }
}
// ==========================================================
.el-textarea {
  display: inline-block;
}
.basc_data .cutLine {
  width: 98%;
}
.s_o_c .el-dialog__body .el-form.form2 .el-form-item.form2Ta {
  // width: 98%;
}
.basc_data .el-dialog__body {
  height: 874px;
}
.changeFloor .el-dialog--center .el-dialog__header {
  padding-top: 0;
}
.wl {
  line-height: 56px;
}
.picAdd
  .s_o_c
  .el-dialog__body
  .el-form.form2
  .el-form-item.changeS
  .el-form-item__content {
  width: 94%;
}
.picAdd
  .s_o_c
  .el-dialog__body
  .el-form.form2
  .el-form-item.changeTd
  .el-form-item__content {
  width: 97% !important ;
}
.picAdd .cutLine .el-button {
  border: none;
  background-color: transparent;
  float: right;
}
.picAdd .cutLine .el-button span {
  border-left: none;
  top: 0;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}
.picAdd .cutLine .el-button span > span {
  display: inline-block;
  line-height: 30px;
  float: right;
}
.floorImg {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/f5.png);
  background-size: 100% 100%;
}
.floorImg1 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/f2.png);
  background-size: 100% 100%;
}
.floorImg2 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/f6.png);
  background-size: 100% 100%;
}
.floorImg3 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/f1.png);
  background-size: 100% 100%;
}
.floorImg4 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/f4.png);
  background-size: 100% 100%;
}
.floorImg5 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/f3.png);
  background-size: 100% 100%;
}
.floorImg6 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(../../images/2_03.png);
  background-size: 100% 100%;
}
.floorImg7 {
  display: inline-block;
  width: 26px;
  height: 26px;
  background: url(../../images/sc.png);
  background-size: 100% 100%;
}
.el-button {
  padding: 6px 20px;
}

.addT {
  width: 100%;
}
.s_o_c
  .el-dialog__body
  .el-form.form2
  .el-form-item.form2Ta.cw
  .el-form-item__content {
  width: 102%;
}
.s_o_c .el-dialog__body .el-form.form2 .el-form-item.form2Ta.tdms {
  width: 97% !important;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  z-index: 0;
}
.s_o_c .el-dialog__body .el-form.form2 .changeS .el-form-item__content {
  width: 96%;
}
.s_o_c
  .s_o_c
  .el-dialog__body
  .el-form.form2
  .el-form-item.form2Ta
  .el-form-item__content {
  width: 100%;
}
.picAdd .cutLine .el-button--danger {
  padding: 12px 20px;
  background-color: #f56c6c;
  margin-top: 4px;
}
.changeFloor .el-button {
  padding: 12px 20px;
}

// ==============================================================
</style>
