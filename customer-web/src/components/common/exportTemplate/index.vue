<template>
  <div class="ucn-export">
    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               custom-class="ucn-dialog-center"
               :show-close="false">
      <div class="box">
        {{$i.exportTemplate.createTask}} <i class="el-icon-loading"></i>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  /**
   * 导出组件
   * 用例：
   * $refs.exportTemplate.start({ids:['82161595060334592','82161907640840192']})
   *
   * <v-export-template ref="exportTemplate" code="SKU_PURCHASE_EXPORT_IDS"></v-export-template>
   */
  const INTERVAL = 3000;

  export default {
    name: 'VExport',
    components: {},
    //传送的数据
    props: {
      code: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        dialogVisible: false,
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      start(params = {}) {
        this.dialogVisible = true;
        this.$ajax.post(this.$apis.EXPORTFILE_EXPORTTASKE, {
          templateCode: this.code,
          arguments: JSON.stringify(params)
        }).then(res => this.getTask(res.taskNo))
          .catch(() => this.retry(params));
      },
      getTask(taskNo) {
        let interval = setInterval(() => {
          this.$ajax.post(this.$apis.EXPORTFILE_GETEXPORTTASKE, {taskNo})
            .then(res => {
              res = res.datas[0];
              switch (res.status) {
                case 7:
                  clearInterval(interval);
                  this.dialogVisible = false;
                  window.open(res.fileUrl);
                  break;
                case 8:
                  clearInterval(interval);
                  this.dialogVisible = false;
                  this.retry(taskNo, true);
                  break;
              }
            });
        }, INTERVAL);
      },
      retry(params, type) {
        this.dialogVisible = false;
        this.$confirm(this.$i.exportTemplate.createFail, this.$i.hintMessage.systemHints, {
          confirmButtonText: this.$i.exportTemplate.tryAgain,
          cancelButtonText: this.$i.button.ccancel,
          dangerouslyUseHTMLString: true,
          center: true,
          type: 'error'
        }).then(() => {
          if (!type) {
            this.start(params);
          } else {
            this.dialogVisible = true;
            this.$ajax.get(this.$apis.EXPORTFILE_EXECUTE, {taskNo: params})
              .then(res => this.getTask(params))
              .catch(() => this.retry(params, true));
          }
        }).catch(e => e);
      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ucn-export /deep/ .el-dialog__header {
    display: none;
  }

  .ucn-export /deep/ .el-dialog__body {
    padding: 30px 10px !important;
  }

  .ucn-export .box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .ucn-export .box i {
    font-size: 24px;
    margin-left: 10px;
  }
</style>
