<template>
  <!--密封点详情-->
  <el-dialog class="s_o_c add_dia add aPont pointDetail" title="密封点信息" :visible.sync="point.dialogAddVisible" width="1200px">
    <el-form label-width="180px" :rules="rules" :inline="true" :model="addInfoPoint">
      <el-form-item prop="content" label="标注点：" style="display:none">
        <!-- :disabled="!isAdd" -->
        <el-input v-model="addInfoPoint.sealingPoint.extendCode"></el-input>
        <i style="color:red;    position: relative;
    color: red;
    top: -42px;
    left: -86px;">*</i>
      </el-form-item><br>

      <el-form-item prop="createType" label="创建方式：" v-if="isAdd">
        <el-radio v-model="addInfoPoint.createType" label="1">单个创建</el-radio>
        <el-radio v-model="addInfoPoint.createType" label="2">空冷</el-radio>
        <el-radio v-model="addInfoPoint.createType" label="3">批量创建</el-radio>
      </el-form-item>

      <el-form-item prop="groupCode" label="创建数量：" v-if="addInfoPoint.createType == 3">
        <el-input v-model="addInfoPoint.totalnum" :disabled="!isAdd" placeholder=''></el-input>
        <i style="color:red;    position: relative;
    color: red;
    top: -44px;
    left: -100px;">*</i>
      </el-form-item>
      <el-form-item label="扩展编码：" v-if="addInfoPoint.createType != 2">
        <el-input v-model="addInfoPoint.sealingPoint.extendCode" placeholder='请输入一位大写字母'></el-input>
        <i style="color:red;    position: relative;
    color: red;
    top: -44px;
    left: -102px;">*</i>
      </el-form-item>

      <el-form-item prop="rows" label="行数：" v-if="isAdd && !isOnly && addInfoPoint.createType == 2">
        <el-input v-model="addInfoPoint.rows" placeholder="行数"></el-input>
      </el-form-item>
      <el-form-item prop="oddnum" label="奇数行点数：" v-if="isAdd && !isOnly && addInfoPoint.createType == 2">
        <el-input v-model="addInfoPoint.oddnum" placeholder="奇数行点数"></el-input>
      </el-form-item>
      <el-form-item prop="evennum" label="偶数行点数：" v-if="isAdd && !isOnly && addInfoPoint.createType == 2">
        <el-input v-model="addInfoPoint.evennum" placeholder="偶数行点数"></el-input>
      </el-form-item>

      <el-form-item prop="groupCode" label="群组编码：">
        <!-- :disabled="!isAdd" -->
        <el-input v-model="addInfoPoint.sealingPoint.groupCode"></el-input>
        <i style="color:red;    position: relative;
    color: red;
    top: -42px;
    left: -102px;">*</i>
      </el-form-item>

      <el-form-item prop="type" label="密封点类型：">
        <el-select v-model="addInfoPoint.sealingPoint.type" placeholder="请选择">
          <el-option v-for="item in optionsType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <i style="color:red;    position: relative;
    color: red;
    top: -3px;
    left: -397px;">*</i>
      </el-form-item>

      <el-form-item prop="size" label="尺寸：">
        <el-input v-model="addInfoPoint.sealingPoint.size"></el-input>
        <i style="color:red;    position: relative;
    color: red;
    top: -42px;
    left: -68px;">*</i>
      </el-form-item>

      <el-form-item prop="status" label="密封点状态：">
        <el-select v-model="addInfoPoint.sealingPoint.status" placeholder="请选择">
          <el-option v-for="item in optionsStatus" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <i style="color:red;    position: relative;
    color: red;
    top: -2px;
    left: -397px;">*</i>
      </el-form-item>

      <el-form-item prop="floor" label="楼层：">
        <el-input v-model="addInfoPoint.sealingPoint.floor"></el-input>

        <i style="color:red;    position: relative;
    color: red;
    top: -42px;
    left: -70px;">*</i>
      </el-form-item>

      <el-form-item prop="phaseBehavior" label="相态：">
        <el-select v-model="addInfoPoint.sealingPoint.phaseBehavior" placeholder="请选择">
          <el-option v-for="item in optionsBe" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <i style="color:red;    position: relative;
    color: red;
    top: -3px;
    left: -349px;">*</i>
      </el-form-item>
      <!-- <i style="color:red;    position: relative;
    color: red;
    top: 6px;
    left: 102px;">*</i> -->
      <el-form-item prop="extension" label="延长杆：">
        <el-input v-model="addInfoPoint.sealingPoint.extension"></el-input>
      </el-form-item>
      <el-form-item label="最近一次检测时间：">
        <el-date-picker v-model="addInfoPoint.sealingPoint.lastCheckTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="管线/设备名称：">
        <el-input v-model="addInfoPoint.sealingPoint.equipName"></el-input>
      </el-form-item>
      <el-form-item label="管线号/设备位号：">
        <el-input v-model="addInfoPoint.sealingPoint.equipCode"></el-input>
      </el-form-item>
      <el-form-item label="生产厂家：">
        <el-input v-model="addInfoPoint.sealingPoint.manufacturer"></el-input>
      </el-form-item>
      <el-form-item label="物流号：">
        <el-input v-model="addInfoPoint.sealingPoint.logistics"></el-input>
      </el-form-item>
      <el-form-item label="温度：">
        <el-input v-model="addInfoPoint.sealingPoint.temperature"></el-input>
      </el-form-item>
      <el-form-item label="压力：">
        <el-input v-model="addInfoPoint.sealingPoint.pressure"></el-input>
      </el-form-item><br>

      <el-form-item label="是否可达：">
        <el-radio v-model="addInfoPoint.sealingPoint.reach" label=0>否</el-radio>
        <el-radio v-model="addInfoPoint.sealingPoint.reach" label=1>是</el-radio>
        <i style="color:red;    position: relative;
    color: red;
    top: -2px;
    left: -216px;">*</i>
      </el-form-item>
      <el-form-item label="是否盲端：">
        <el-radio v-model="addInfoPoint.sealingPoint.blind" label="0">否</el-radio>
        <el-radio v-model="addInfoPoint.sealingPoint.blind" label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="是否保温：">
        <el-radio v-model="addInfoPoint.sealingPoint.preservation" label="0">否</el-radio>
        <el-radio v-model="addInfoPoint.sealingPoint.preservation" label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="是否腐蚀：">
        <el-radio v-model="addInfoPoint.sealingPoint.corrosion" label="0">否</el-radio>
        <el-radio v-model="addInfoPoint.sealingPoint.corrosion" label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="物料信息：" prop="materialsInfo" class="mark_textarea">
        <el-input type="textarea" v-model="addInfoPoint.sealingPoint.materialsInfo"></el-input>
      </el-form-item>
      <el-form-item label="备注：" class="mark_textarea">
        <el-input type="textarea" v-model="addInfoPoint.sealingPoint.notes"></el-input>
      </el-form-item>
      <el-form-item class="mark_textarea t_a">
        <el-button type="success" @click="pointAdd" v-if="isType">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import org from '@/api/standing'
import system from '@/api/system'
import { tip } from '@/utils/tip'
import { type } from '@/utils/setFormType'
export default {
  name: 'pointDetail',
  props: ['point'],
  watch: {
    'point.dialogAddVisible': function(n, o) {
      if (!n) {
        if (this.isAdd) {
          this.tmpAddInfoPoint = JSON.stringify(this.addInfoPoint)
        }
        this.addInfoPoint.coordinates.content = ''
        this.addInfoPoint.coordinates.id = ''
        this.addInfoPoint.sealingPoint.id = ''
        this.addInfoPoint.sealingPoint.phaseBehavior = ''
        this.addInfoPoint.sealingPoint.materialsInfo = ''
        this.addInfoPoint.sealingPoint.notes = ''
        this.addInfoPoint.sealingPoint.pressure = ''
        this.addInfoPoint.sealingPoint.temperature = ''
        this.addInfoPoint.sealingPoint.logistics = ''
        this.addInfoPoint.sealingPoint.manufacturer = ''
        this.addInfoPoint.sealingPoint.corrosion = ''
        this.addInfoPoint.sealingPoint.blind = ''
        this.addInfoPoint.sealingPoint.preservation = ''
        this.addInfoPoint.sealingPoint.equipCode = ''
        this.addInfoPoint.sealingPoint.equipName = ''
        this.addInfoPoint.sealingPoint.lastCheckTime = ''
        this.addInfoPoint.sealingPoint.extension = ''
        this.addInfoPoint.sealingPoint.floor = ''
        this.addInfoPoint.sealingPoint.reach = ''
        this.addInfoPoint.sealingPoint.status = ''
        this.addInfoPoint.sealingPoint.size = ''
        this.addInfoPoint.sealingPoint.extendCode = ''
        this.addInfoPoint.sealingPoint.groupCode = ''
        this.addInfoPoint.sealingPoint.coordinates = ''
        this.addInfoPoint.sealingPoint.type = ''
        this.addInfoPoint.createType = '1'
        this.addInfoPoint.rows = ''
        this.addInfoPoint.evennum = ''
        this.addInfoPoint.oddnum = ''
        this.addInfoPoint.totalnum = ''
        this.$emit('disOpen')
      } else {
        if (this.point.id != 0) {
          this.isAdd = false
          this.pointInfo(this.point.id)
        } else {
          this.addInfoPoint = JSON.parse(this.tmpAddInfoPoint)
          this.addInfoPoint.sealingPoint.groupCode = this.point.addInfoCode
          this.isAdd = true;
        }
      }
    },
    'addInfoPoint.createType': function(newVal, o) {
      if (newVal == 1) {
        this.isOnly = true
      } else {
        this.isOnly = false
      }
      if (newVal == '1') {
        this.addInfoPoint.rows = ''
        this.addInfoPoint.evennum = ''
        this.addInfoPoint.oddnum = ''
        this.addInfoPoint.totalnum = ''
      } else if (newVal == '2') {
        this.addInfoPoint.totalnum = ''
      } else if (newVal == '3') {
        this.addInfoPoint.rows = ''
        this.addInfoPoint.evennum = ''
        this.addInfoPoint.oddnum = ''
      }
    },
    'addInfoPoint.sealingPoint.type': function() {
      this.optionsType.map(item => {
        if (item.id == this.addInfoPoint.sealingPoint.type) {
          this.addInfoPoint.sealingPoint.extendCode = item.remark
        }
      })
    }
  },
  data() {
    return {
      checkedImgId: 0,
      groupCode: '',
      content: '',
      isOnly: true,
      isType: true,
      tmpAddInfoPoint: {},
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
          phaseBehavior: '',
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
          floor: '',
          reach: '',
          status: '',
          size: '',
          type: '',
          extendCode: '',
          groupCode: '',
          materialsInfo: '',
          coordinates: ''
        },
        createType: '1',
        rows: '',
        evennum: '',
        oddnum: '',
        totalnum: ''
      },
      isAdd: true,
      optionsType: [],
      optionsStatus: [],
      optionsBe: [],
      rules: {}
    }
  },
  methods: {
    selectChange() {
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
                // case 'content':
                //   tip('请输入标注点名字', 'warning')
                //   return false
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
    //密封点新增
    pointAdd() {
      if (!this.point.id) {
        this.addInfoPoint.coordinates.top = this.point.oy
        this.addInfoPoint.sealingPoint.imageFileId = this.point.imageFileId
        this.addInfoPoint.coordinates.nodeTop = Number(this.point.oy) + 20
        this.addInfoPoint.coordinates.left = this.point.ox
        this.addInfoPoint.coordinates.nodeLeft = Number(this.point.ox) + 20
        if (
          this.checkedImgId != 0 &&
          this.checkedImgId != this.point.imageFileId
        ) {
          // 切换图档
          // if (this.content == this.addInfoPoint.coordinates.content) {
          //   this.$message({
          //     message: '标注点重复，请重新输入！',
          //     type: 'warning'
          //   })
          //   return false
          // }
          if (this.groupCode == this.addInfoPoint.sealingPoint.groupCode) {
            this.$message({
              message: '群组编码重复，请重新输入！',
              type: 'warning'
            })
            return false
          }
        }
      }else{
        if(this.point.isChangesPonintData == 'type'){
          this.addInfoPoint.coordinates.id = '';
          this.addInfoPoint.sealingPoint.id = '';
          this.addInfoPoint.coordinates.top = this.point.oy;
          this.addInfoPoint.coordinates.left = this.point.ox;
            this.addInfoPoint.coordinates.nodeTop = Number(this.point.oy) + 20;
              this.addInfoPoint.coordinates.nodeLeft = Number(this.point.ox) + 20;
        }
      }
       if(!this.addInfoPoint.coordinates.top && !this.addInfoPoint.coordinates.left){
          this.addInfoPoint.coordinates.top = 160;
          this.addInfoPoint.coordinates.left = 400;
          this.addInfoPoint.coordinates.nodeTop = Number(this.addInfoPoint.coordinates.top) + 20;
          this.addInfoPoint.coordinates.nodeLeft = Number(this.addInfoPoint.coordinates.left) + 20;
        }
      if (this.checkPointinfo(this.addInfoPoint) == false) return;
    var loading = this.$loading({
          lock: true,
          text: '拼命加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })

      this.addInfoPoint.sealingPoint.imageFileId = this.point.imageFileId;
      org.pointAdd(this.addInfoPoint).then(res => {
        if(res.data.createType == 1 ){
          sessionStorage.setItem('pointing',JSON.stringify(res.data));
          sessionStorage.setItem('type','TYPE');
          sessionStorage.setItem('pointId',res.data.sealingPoint.coordinatesId)
        }
        this.checkedImgId = this.point.imageFileId
        this.content = this.addInfoPoint.coordinates.content
        this.groupCode = this.addInfoPoint.sealingPoint.groupCode
        tip(res.msg)
        this.$emit('reloadList')
        this.$emit('hidePic');
        loading.close()
      })
    },
    //密封点详情
    pointInfo(id) {

      org.pointInfo(id).then(res => {
        this.dialogAddVisible = true
        this.isAdd = false
        let re = res.data
        this.addInfoPoint.coordinates.content = re.coordName;
          this.addInfoPoint.coordinates.id = re.coordinatesId
          this.addInfoPoint.sealingPoint.id = re.id


        this.addInfoPoint.sealingPoint.imageFileId = re.imageFileId
        this.addInfoPoint.sealingPoint.phaseBehavior = re.phaseBehavior
        this.addInfoPoint.sealingPoint.notes = re.notes
        this.addInfoPoint.sealingPoint.materialsInfo = re.materialsInfo
        this.addInfoPoint.sealingPoint.pressure = re.pressure || ''
        this.addInfoPoint.sealingPoint.temperature = re.temperature || ''
        this.addInfoPoint.sealingPoint.logistics = re.logistics
        this.addInfoPoint.sealingPoint.manufacturer = re.manufacturer
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
        ).toString()
        this.addInfoPoint.sealingPoint.status = re.status
        this.addInfoPoint.sealingPoint.size = re.size
        this.addInfoPoint.sealingPoint.extendCode = re.extendCode
        this.addInfoPoint.sealingPoint.groupCode = re.groupCode
        this.addInfoPoint.sealingPoint.coordinates = re.coordinates
        this.addInfoPoint.sealingPoint.type = re.type
        this.addInfoPoint.totalnum = re.totalnum
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
    }
  },
  mounted() {},
  created() {
    this.getDict('point_type')
    this.getDict('point_status')
    this.getDict('phase_behavior')
    this.tmpAddInfoPoint = JSON.stringify(this.addInfoPoint)
    if (this.$route.query.type == 1) {
      this.isType = false
    } else {
      this.isType = true
    }
  }
}
</script>
<style scoped>
.aPont .el-form--inline .el-form-item {
  height: 40px;
}
.aPont .el-form--inline .el-form-item.mark_textarea {
  height: 62px;
}
</style>

