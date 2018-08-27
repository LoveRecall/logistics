<template>
  <div class="tableData">
    <div class="top-box">
      <h3 class="ucn-content-title" v-text="typeLabel[type - 1]"></h3>

      <div>
        <el-select v-model="search.type">
          <el-option v-for="item in searchOptions" :key="item.id"
                     :label="item.label" :value="item.id"></el-option>
        </el-select>

        <el-input :placeholder="$i.hintMessage.pleaseEnter" class="input-with-select" clearable
                  v-show="search.type !== 'submittedTimeStart'"
                  style="width: 200px;vertical-align: middle"
                  v-model="search.value">
          <el-button slot="append" icon="el-icon-search"
                     @click="submitSearch"></el-button>
        </el-input>

        <el-date-picker
          v-show="search.type === 'submittedTimeStart'"
          v-model="search.value"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          style="width: 150px;vertical-align: middle">
        </el-date-picker>
        <el-button icon="el-icon-search" @click="submitSearch"
                   style="vertical-align: middle"
                   v-show="search.type === 'submittedTimeStart'"></el-button>
      </div>
    </div>
    <br/>

    <el-tabs type="border-card" @tab-click="changeTab">
      <el-tab-pane style="height: 300px" v-for="item in dataList" :key="item.label"
                   v-loading="item.loading"
                   :label="item.label">
        <v-table ref="taskTable"
                 :data="item.data"
                 :selection="false"
                 :buttons="['detail']"
                 hideFilterColumn
                 hideFilterValue
                 disabled-sort
                 @action="goDetail"
                 :height="250">
        </v-table>
        <v-pagination :page-data="item.page" @size-change="pageSizeChange"
                      @change="pageChange"></v-pagination>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
  import {VTable, VViewPicture, VPagination} from '@/components/index';
  import $i from '../../language/index';
  import config from 'service/config'

  export default {
    name: 'VTableData',
    components: {
      VTable,
      VViewPicture,
      VPagination,
    },
    props: {
      type: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        pictureVisible: true,
        searchOptions: [
          {label: $i.workbench.bizNo, id: 'bizNo'},
          {label: $i.workbench.description, id: 'content'},
          {label: $i.workbench.time, id: 'submittedTimeStart'},
          {label: $i.workbench.submitter, id: 'submittedByUserName'}
        ],
        typeLabel: [
          this.$i.workbench.pendingTask,
          this.$i.workbench.futureTask,
          this.$i.workbench.pushTask,
          this.$i.workbench.fyiTask
        ],
        dataList: [
          {
            page: {pn: 1, ps: 10},
            data: [],
            label: this.$i.workbench.inquiry,
            loading: false,
            search: {},
            type: 'INQUIRY',
            url: '/negotiation/inquiryDetail'
          },
          {
            page: {pn: 1, ps: 10},
            data: [],
            label: this.$i.workbench.order,
            loading: false,
            search: {},
            type: 'ORDER',
            url: '/order/detail'
          },
          {
            page: {pn: 1, ps: 10},
            data: [],
            label: this.$i.workbench.logistic,
            loading: false,
            search: {},
            type: 'LOGISTIC',
            url: '/logistic/planDetail'
          },
          {
            page: {pn: 1, ps: 10},
            data: [],
            label: this.$i.workbench.qc,
            loading: false,
            search: {},
            type: 'QC',
            url: '/warehouse/qcDetail'
          },
          {
            page: {pn: 1, ps: 10},
            data: [],
            label: this.$i.workbench.payment,
            loading: false,
            search: {},
            type: 'PAYMENT',
            url: {
              PURCHASE_ORDER: '/order/detail',
              QC_ORDER: '/warehouse/qcDetail',
              LOGISTICS_PLAN: '/logistic/logisticPlanDetail',
              LOGISTICS_LIST: '/logistic/loadingListDetail'
            }
          }
        ],
        search: {type: 'bizNo', value: ''},
        tabIndex: 0,
      }
    },
    mounted() {
      if (this.type === 2) {
        this.dataList[0] = null;
        this.dataList[3] = null;
        this.dataList = _.compact(this.dataList);
      }
      this.getData();
    },
    watch: {
      'search.type'() {
        this.search.value = '';
      }
    },
    methods: {
      pageChange(val) {
        let item = this.dataList[this.tabIndex];
        item.page.pn = val;
        this.getData();
      },
      pageSizeChange(val) {
        let item = this.dataList[this.tabIndex];
        item.page.ps = val;
        this.getData();
      },
      submitSearch() {
        let item = this.dataList[this.tabIndex];
        item.search = _.clone(this.search);
        this.getData();
      },
      changeTab(tab) {
        this.tabIndex = tab.index;
        let item = this.dataList[this.tabIndex];
        this.search = _.isEmpty(item.search) ? {type: 'bizNo', value: ''} : item.search;
        this.getData();
      },
      getData() {
        let item = this.dataList[this.tabIndex], params
          , {pn, ps} = item.page;

        item.loading = true;

        params = {pn, ps, type: this.type, moduleCode: item.type}

        if (item.search.value) {
          params[item.search.type] = item.search.value;
        }
        this.$ajax.post(this.$apis.UTASK_GETBYTYPEANDMODULE, params).then(data => {
          item.page = data;
          item.data = this.$getDB(this.$db.workbench.taskTable, data.datas, item => {
            item.submittedTime.value = this.$dateFormat(item.submittedTime.value, 'yyyy-mm-dd');
            return item;
          });
        }).finally(() => item.loading = false);
      },
      getDataNumber() {
        this.$ajax.get(this.$apis.UTASK_COUNTBYTYPEANDMODULE).then(res => {
          console.log(res, 1)
        });
      },
      goDetail(item) {
        let tab = this.dataList[this.tabIndex]
          , params = {code: item.bizNo.value}
          , {url} = tab;

        switch (tab.type) {
          case 'LOGISTIC':
            if (item.bizCode === 'BIZ_LOGISTIC_ORDER') {
              params.loadingList = 'loadingList';
            }
            break;
          case 'WAREHOUSE':
            if (config.CLIENT_TYPE === 2) {
              return this.$ajax.post(this.$apis.get_qcOrderData, {qcOrderNo: item.bizNo.value})
                .then(res => {
                  let data = res.datas[0];
                  delete  params.code;
                  url = data.serviceProviderIsLoginUser ? (data.qcStatusDictCode === 'COMPLETED_QC'
                    ? '/warehouse/qcOrderDetail'
                    : '/warehouse/qcOrderService') : '/warehouse/qcOrder';
                  params.id = data.id
                  this.$windowOpen({url, params});
                });
            }
            break;
          case 'PAYMENT':
            return this.$ajax.post(this.$apis.PAYMENT_GETORDERBYPAYMENTNOS, [item.bizNo.value])
              .then(res => {
                res = res[0] || {};
                let type = res.orderType;
                params.code = res.orderNo;
                switch (type) {
                  case 10:
                    url = url.PURCHASE_ORDER;
                    break;
                  case 20:
                    url = url.QC_ORDER;
                    break;
                  case 30:
                    url = url.LOGISTICS_PLAN;
                    break;
                  case 37:
                    url = url.LOGISTICS_LIST;
                    break;
                  default:
                    return false;
                }
                this.$windowOpen({url, params});
              });
        }
        this.$windowOpen({url, params});
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tableData {
    position: relative;
  }

  .top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
<style>
  .tableData .el-tabs__item {
    font-size: 12px;
    padding: 0 10px;
  }

  .tableData .el-input-group__append {
    padding: 0;
  }

  .tableData .el-input-group__append button {
    margin-right: 0 !important;
  }

</style>
