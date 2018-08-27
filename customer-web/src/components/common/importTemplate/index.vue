<template>
  <div class="ucn-import">
    <el-dialog
      class="ucn-import-dialog"
      :close-on-click-modal="false"
      :title="$i.importTemplate.import"
      :close-on-press-escape="uploadStep === 0"
      :show-close="uploadStep !== 1"
      @closed="closedDialog"
      :visible.sync="dialogVisible">
      <el-form label-width="80px" v-if="uploadStep === 0">
        <el-form-item :label="$i.importTemplate.upload">
          <el-upload
            :action="$apis.IMPORTFILE_IMPORTTASKE"
            :headers="{'U-Session-Token':$localStore.get('token')}"
            :limit="10"
            :data="{templateCode:code,bizCode:bizCode}"
            name="importFile"
            :on-exceed="handleExceed"
            :on-success="uploadSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <el-button type="primary">{{$i.importTemplate.selectFile}}
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$i.importTemplate.note" class="remark-box">
          <h5>1.{{$i.importTemplate.remark1}}
            <a :href="downTemplate" v-if="downTemplate" target="_blank" v-text="$i.importTemplate.template"></a></h5>
          <h5>2.{{$ic($i.importTemplate.tips2,{name:tipsName,key:tipsKey})}}</h5>
        </el-form-item>
      </el-form>

      <div class="uploading-box" v-else>
        <h3>{{$i.importTemplate.inUploading}}...</h3>
        <label>
          1&nbsp;&nbsp;{{$i.importTemplate.uploadingTheFile}}
          <i class="el-icon-check"></i>
        </label>
        <label style="margin-bottom: 20px">
          2&nbsp;&nbsp;{{$i.importTemplate.processingTheFile}}
          <i class="el-icon-loading" v-if="uploadStep === 1"></i>
          <i class="el-icon-check" v-else></i>
        </label>
        <div class="success-info" v-if="uploadStep === 2">
          <h4>{{$i.payment.detail}}:</h4>
          <div class="item">
            <label>{{$i.importTemplate.SuccessRows}}
              <span v-text="completeData.successExcelRows"></span>
            </label>
          </div>
          <div class="item">
            <label>{{$i.importTemplate.failedRows}}
              <span v-text="completeData.errorExcelRows">10</span>
            </label>
            <a v-if="completeData.errorMsgFileUrl" :href="completeData.errorMsgFileUrl">
              {{$i.importTemplate.downloadFailedOnes}}
            </a>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 导入组件
   * 用例：
   * $refs.importFile.show()
   *
   * <v-import-template ref="importFile" code="PRODUCT_SUPPLIER" biz-code="PRODUCT_SUPPLIER" tips-name="tipsKey"
   *   tips-key="">
   * </v-import-template>
   */
  const INTERVAL = 3000;

  export default {
    name: 'VImport',
    components: {},
    //传送的数据
    props: {
      code: {
        type: String,
        default: '',
      },
      bizCode: {
        type: String,
        default: '',
      },
      tipsName: {
        type: String,
        default: '?',
      },
      tipsKey: {
        type: String,
        default: '?',
      },
    },
    data() {
      return {
        dialogVisible: false,
        fileList: [],
        downTemplate: '',
        uploadStep: 0,
        completeData: {}
      }
    },
    watch: {},
    created() {
    },
    mounted() {
      // this.getTemplate();
    },
    methods: {
      show() {
        this.dialogVisible = true;
        this.getTemplate();
      },
      closedDialog() {
        this.completeData = {};
        this.uploadStep = 0;
      },
      beforeAvatarUpload(file) {
        if (file.name.indexOf('.zip') < 0 && file.name.indexOf('.xls') < 0) {
          this.$message.warning(this.$i.importTemplate.fileTypePrompt);
          return false;
        }
      },
      getTemplate() {
        this.$ajax.post(this.$apis.IMPORTTEMPLATE_DOWNLOADURL, [this.code], {cache: true})
          .then(res => {
            this.downTemplate = res[0] ? res[0].fileUrl : '';
          });
      },
      getTask(taskNo) {
        let interval = setInterval(() => {
          this.$ajax.post(this.$apis.IMPORTFILE_GETIMPORTTASK, {taskNo})
            .then(res => {
              res = res.datas[0];
              if (res.status === 7 || res.status === 8) {
                clearInterval(interval);
                this.uploadStep = 2;
                this.completeData = res;
              }
            });
        }, INTERVAL);
      },
      handleExceed(files, fileList) {
        this.$message.warning(this.$i.importTemplate.fileNumberPrompt);
      },
      uploadSuccess({content}) {
        this.uploadStep = 1;
        this.getTask(content.taskNo);
      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .remark-box h5 {
    font-weight: 100;
  }

  .remark-box h5 a {
    color: #3a8ee6;
    text-decoration: underline;
  }

  .remark-box.important /deep/ .el-form-item__label,
  .remark-box.important {
    color: red;
    margin-bottom: 5px;
  }

  .uploading-box {
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
  }

  .uploading-box > h3 {
    font-size: 18px;
  }

  .uploading-box > label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 60%;
    margin: 10px auto;
  }

  .uploading-box > label i {
    font-size: 18px;
  }

  .success-info {
    border-top: 1px #eeeeee solid;
    width: 100%;
    text-align: center;
    padding-top: 10px;
  }

  .success-info .item {
    width: 60%;
    margin: 5px auto;
    text-align: left;
    display: flex;
    justify-content: space-between;
  }

  .success-info .item label {
    width: 170px;
    display: flex;
    justify-content: space-between;
  }

  .success-info .item a {
    color: #409eff;
    text-decoration: underline;
  }
</style>
<style>
</style>
