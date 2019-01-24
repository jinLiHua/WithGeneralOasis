<template>
  <div class="my-file-dialog">
    <el-dialog
      title="导出"
      :visible.sync="dialog.dialogVisible"
     :width="!showType?'400px':'40%'">
      <el-form :model="dialog"  ref="dialog" :rules="rules" label-width="140px">
        <el-form-item v-if="showType"
                      style="padding-left: 20px; width: 85%"
                      label="检测设备：">
          <label>{{dialog.deviceName}}</label>
        </el-form-item>
        <el-form-item v-if="showType"
                      style="padding-left: 20px; width: 85%"
                      label="导出文件格式：">
          <el-radio-group v-model="dialog.type">
            <el-radio :label=3 >csv</el-radio>
            <el-radio :label=2 >txt</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fileName"
                      label="导出文件名称：">
          <el-input v-model="dialog.fileName" placeholder="请输入文件名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialog.dialogVisible = false">取 消</el-button>
    <el-button type="success" @click="exportFile">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'fileDialog',
    props: ['dialog','showType'],
    data() {
      return {
        rules: {
          fileName: [
            {required: true, message: '请输入文件名字', trigger: 'blur'},
          ],
        }
      }
    },
    watch: {
      'dialog.dialogVisible' (newVal) {
        if (!newVal) {
          this.resetDialog();
        }
      }
    },
    methods: {
      resetDialog() {
        this.$refs['dialog'].resetFields();
        this.dialog.fileName = '';
      },
      exportFile() {
        var that = this;
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            that.$emit('exportFile',that.dialog.fileName);
            that.dialog.dialogVisible = false;
          } else {
            return false;
          }
        });
      }
    },
    created() {

    }
  }

</script>

<style  rel="stylesheet/scss" lang="scss">
  .my-file-dialog {
    .el-dialog__body {
      padding: 30px 20px !important;
    }
    .el-dialog__footer{
      text-align: center;
    }
  }
</style>
