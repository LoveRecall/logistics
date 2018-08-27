<template>
  <div class="logs-import">
    <br>
    <h3 class="ucn-content-title inline" v-text="$i.logs.taskList"></h3>&nbsp;&nbsp;&nbsp;&nbsp;
    <el-button icon="el-icon-refresh" type="primary" :loading="importParams.loading || exportParams.loading"
               @click="changeTab()">{{$i.logs.refreshTask}}
    </el-button>
    <br>
    <br>
    <el-tabs type="card" v-model="tabActive" @tab-click="changeTab()">
      <!--导入任务-->
      <el-tab-pane :label="$i.logs.importTask" name="import">
        <el-table
          :data="importParams.data.datas"
          :max-height="500"
          border
          v-loading="importParams.loading"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="uploadFileName"
            :label="$i.logs.uploadFileName"
            min-width="200">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$i.logs.uploadFileSize"
            width="100">
            <template slot-scope="scope">
              {{$bytesConvert(scope.row.uploadFileSize)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            prop="_status"
            :label="$i.logs.uploadStatus">
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            :label="$i.logs.uploadEndTime">
            <template slot-scope="scope">
              {{$dateFormat(scope.row.endTime,'yyyy-mm-dd HH:MM:ss')}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="entryName"
            :label="$i.logs.uploadEntryName">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$i.logs.uploadEntryDt">
            <template slot-scope="scope">
              {{scope.row.entryDt ? $dateFormat(scope.row.entryDt,'yyyy-mm-dd HH:MM:ss') : ''}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="successRows"
            :label="$i.logs.uploadSuccessRows">
          </el-table-column>
          <el-table-column
            align="center"
            prop="errorRows"
            :label="$i.logs.uploadErrorRows">
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            :label="$i.logs.uploadAction">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.errorMsgFileUrl"
                         @click="$download(scope.row.successMsgFileUrl)">
                {{$i.logs.downSuccess}}
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.errorMsgFileUrl"
                         @click="$download(scope.row.errorMsgFileUrl)">
                {{$i.logs.downError}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <v-pagination :page-data="importParams.data" @size-change="val => {changeTab({ps:val})}"
                      @change="val => {changeTab({pn:val})}"></v-pagination>
      </el-tab-pane>

      <!--导出任务-->
      <el-tab-pane :label="$i.logs.exportTask" name="export">
        <el-table
          :data="exportParams.data.datas"
          :max-height="500"
          border
          v-loading="exportParams.loading"
          style="width: 100%">
          <el-table-column
            align="center"
            :label="$i.logs.uploadFileName"
            min-width="200">
            <template slot-scope="scope">
              {{scope.row.fileName || $i.logs.inOperating}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$i.logs.uploadFileSize"
            width="100">
            <template slot-scope="scope">
              {{scope.row.fileSize ? $bytesConvert(scope.row.fileSize) : $i.logs.inOperating}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            prop="_status"
            :label="$i.logs.uploadStatus">
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            :label="$i.logs.uploadEndTime">
            <template slot-scope="scope">
              {{$dateFormat(scope.row.endTime,'yyyy-mm-dd HH:MM:ss')}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="entryName"
            :label="$i.logs.uploadEntryName">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$i.logs.creationTime">
            <template slot-scope="scope">
              {{scope.row.startTime ? $dateFormat(scope.row.startTime,'yyyy-mm-dd HH:MM:ss') : ''}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            :label="$i.logs.exportAction">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.status !== 1 && scope.row.status !== 7"
                         @click="retryExport(scope.row.taskNo)">
                {{$i.logs.retry}}
              </el-button>
              <el-button type="text" size="small" v-else-if="scope.row.fileUrl"
                         @click="$download(scope.row.fileUrl)">
                {{$i.logs.exportDownload}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <v-pagination :page-data="exportParams.data" @size-change="val => {changeTab({ps:val})}"
                      @change="val => {changeTab({pn:val})}"></v-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  import {VPagination} from '@/components/index';

  export default {
    name: 'import',
    components: {VPagination},
    data() {
      return {
        importParams: {
          data: {},
          loading: false,
          paging: {pn: 0, ps: 10}
        },
        exportParams: {
          data: {},
          loading: false,
          paging: {pn: 0, ps: 10}
        },
        tabActive: 'import',
      }
    },
    watch: {},
    created() {
      this.changeTab(null, this.$route.query.type);
    },
    methods: {
      getImportData() {
        this.importParams.loading = true;
        this.$ajax.all([
          this.getPart('IMPORT_TASK_STATUS'),
          this.$ajax.post(this.$apis.IMPORTFILE_GETIMPORTTASK, this.importParams.paging)
        ]).then(res => {
          this.importParams.data = res[1];
          this.importParams.data.datas = _.map(res[1].datas, val => {
            let item = _.findWhere(res[0], {code: val.status.toString()});
            val._status = item ? item.name : '';
            return val;
          });
        })
          .finally(() => this.importParams.loading = false);
      },
      getExportData() {
        this.exportParams.loading = true;
        this.$ajax.all([
          this.getPart('EXPORT_TASK_STATUS'),
          this.$ajax.post(this.$apis.EXPORTFILE_GETEXPORTTASKE, this.exportParams.paging)
        ]).then(res => {
          this.exportParams.data = res[1];
          this.exportParams.data.datas = _.map(res[1].datas, val => {
            let item = _.findWhere(res[0], {code: val.status.toString()});
            val._status = item ? item.name : '';
            return val;
          });
        })
          .finally(() => this.exportParams.loading = false);
      },
      getPart(code) {
        return this.$ajax.post(this.$apis.CODE_PART, [code], {cache: true})
          .then(res => res && res[0] ? res[0].codes : []);
      },
      retryExport(id) {
        this.$ajax.get(this.$apis.EXPORTFILE_EXECUTE, {taskNo: id})
          .then(() => this.getExportData());
      },
      changeTab(paging, type) {
        this.tabActive = type ? type : this.tabActive;
        switch (this.tabActive) {
          case 'import':
            if (paging) {
              this.importParams.paging = _.extend(this.importParams.paging, paging);
            }
            return this.getImportData();
          case 'export':
            if (paging) {
              this.exportParams.paging = _.extend(this.exportParams.paging, paging);
            }
            return this.getExportData();
        }
      }
    }
  }
</script>

<style scoped>
</style>
