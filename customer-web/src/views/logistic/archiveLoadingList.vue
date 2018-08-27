<template>
  <div class="logistic-plan-overview">
    <div class="hd-top">{{ $i.logistic.archive }}/{{ $i.logistic.loadingListOverview }}</div>
    <div class="status">
      <div class="btn-wrap"></div>
      <div class="select-search-wrap">
        <select-search :options="options" @inputEnter="searchFn" v-model="selectSearch" />
      </div>
    </div>
    <v-table :code="urlObj[pageType][viewBy].setTheField" 
    :data="tabData" @change-checked="changeChecked" 
    :loading="tableLoading" :height="height" ref="tab" 
    @change-sort="changeSort">
      <div slot="header">
        <div class="btn-wrap">
          <div class="fn btn">
            <el-button @click="sendRecover" v-authorize="'LOADING_LIST:ARCHIVE:RECOVER'" :disabled="selectCount.length<=0">{{ $i.logistic.recover }}</el-button>
          </div>
          <div class="view-by-btn">
            <span>{{ $i.logistic.viewBy }}&nbsp;</span>
            <el-radio-group v-model="viewBy" size="mini">
              <el-radio-button v-for="a in urlObj[pageType]" :key="a.key" :label="a.label">{{ a.text }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </v-table>
    <v-pagination :pageSizes="[50,100,200]" :page-data.sync="pageParams" @size-change="sizeChange" @change="pageChange" />
  </div>
</template>
<script>
  import {
    selectSearch,
    VTable,
    VPagination
  } from '@/components/index';
  import {
    mapActions,
    mapState
  } from 'vuex';
  export default {
    data() {
      return {
        selectSearch: '',
        height: 500,
        tableLoading: false,
        pageParams: null,
        selectCount: [],
        fillterVal: 'all',
        tabData: [],
        viewBy: 'plan',
        options: [{
            id: 'logisticsNo',
            label: this.$i.logistic.logisticNo
          },
          {
            id: 'skuCode',
            label: this.$i.logistic.skuCode
          },
          {
            id: 'orderNo',
            label: this.$i.logistic.orderNo
          }
        ],
        jumpPage: {
          plan: 'planDetail',
          loadingList: 'planDetail',
          draft: 'planDraftDetail',
          archive: '',
        },
        urlObj: {
          archiveLoadingList: {
            plan: {
              key: 3,
              setTheField:'ulogistics_OrderOverviewPlanNo',
              label: 'plan',
              text: this.$i.logistic.loadingList,
              url: this.$apis.get_loading_list_plan,
              db: this.$db.logistic.planList
            },
            transportation: {
              key: 4,
              setTheField:'ulogistics_OrderOverviewByUnit',
              label: 'transportation',
              text: this.$i.logistic.transportationUnit,
              url: this.$apis.get_loading_list_unit,
              db: this.$db.logistic.transportationList
            },
            sku: {
              key: 5,
              setTheField:'ulogistics_OrderOverviewSkuCode',
              label: 'sku',
              text: this.$i.logistic.sku,
              url: this.$apis.get_loading_list_sku,
              db: this.$db.logistic.sku
            }
          }
        },
        downloadIds:[]
      }
    },
    components: {
      selectSearch,
      VTable,
      VPagination
    },
    watch: {
      viewBy(newVal) {
        this.selectCount = []
        this.initPage();
        this.fetchDataList()
      },
      pageType() {
        this.fetchData()
      }
    },
    computed: {
      pageType() {
        return this.$route.name
      }
    },
    mounted() {
      // let menuList = [{
      //   path: '',
      //   query: {code: this.pageType&&this.pageType=="loadingList" ? 'BIZ_LOGISTIC_ORDER' : 'BIZ_LOGISTIC_PLAN'},
      //   type: 100,
      //   label: this.$i.common.log
      // },{
      //   path: '/logistic/draft',
      //   label: this.$i.common.draft
      // },{
      //   path: '/logistic/archivePlan',
      //   label: this.$i.logistic.archivePlan
      // },{
      //   path: '/logistic/archiveDraft',
      //   auth: 'LOGISTICS:DRAFT_ARCHIVE',
      //   label: this.$i.logistic.archiveDraft
      // },
      // {
      //   path: '/logistic/archiveLoadingList',
      //   label: this.$i.logistic.archiveLoadingList
      // }];
      // this.setMenuLink(menuList);
      this.fetchData()
      // this.getContainerType() 接手注释
    },
    methods: {
      ...mapActions(['setMenuLink']),
      initPage() {
        this.pageParams = {
          pn: 1,
          ps: 50,
          //默认排序
          sorts:[
            {orderBy:'updateDt',orderType:'desc'},
            {orderBy:'entryDt',orderType:'desc'}
          ]
        };
      },
      changeSort(arr){
        this.pageParams.sorts = arr.sorts;
        this.fetchDataList();
      },
      fetchData() {
        this.initPage();
        this.fetchDataList()
      },
      deleteData() {
        this.$confirm(this.$i.logistic.isConfirmPeration, this.$i.logistic.tips, {
          confirmButtonText: this.$i.logistic.confirm,
          cancelButtonText: this.$i.logistic.cancel,
          type: 'warning'
        }).then(() => {
          this.$ajax.post(this.$apis.delete_by_ids, {
            ids: this.selectCount.map(a => a.id.value)
          }).then(res => {
            this.initPage();
            this.fetchDataList()
            this.selectCount = []
            this.$message({
              type: 'success',
              message: this.$i.logistic.operationSuccess
            })
          })
        })
      },
      changeChecked(arr) {
        this.selectCount = arr;
        this.downloadIds = arr.map(el => {
          return el.id.value
        })
      },
      searchFn(obj) {
        this.pageParams[obj.id+'Like'] = obj.value;
        this.fetchDataList()
      },
      sizeChange(e) {
        this.pageParams.ps = e
        this.fetchDataList()
      },
      pageChange(e) {
        this.pageParams.pn = e
        this.fetchDataList()
      },
      sendRecover(){
        this.$ajax.post(this.$apis.logistics_order_recover,{ids:this.downloadIds}).then(res => {
          this.fetchDataList();
        })
      },
      fetchDataList(arg) {
        if (arg) {
          this.initPage();
        }
        const url = this.urlObj[this.pageType][this.viewBy].url
        const db = this.urlObj[this.pageType][this.viewBy].db
        this.tableLoading = true
        const lgStatus = this.fillterVal === 'all' ? [] : [this.fillterVal]
        this.$ajax.post(url, {
          lgStatus,
          ...this.pageParams,
          archive:1
        }).then(res => {
          if (!res) return (this.tableLoading = false)
          this.tabData = this.$getDB(db, res.datas, item => {
            _.mapObject(item, val => {
              // if (val.type === 'select' && val.value) {
              //   let obj = this.containerType.find(a => a.code === val.value)
              //   val.value = obj ? obj.name : null
              // } 接手注释
              val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd'))
              return val
            })
          })
          this.selectCount = [];
          this.pageParams = {
            pn: res.pn,
            ps: res.ps,
            tc: res.tc
          }
          this.tableLoading = false
        })
      },
      getContainerType() {
        this.$ajax.get(this.$apis.get_container_type).then(res => {
          this.containerType = res
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  .logistic-plan-overview {

    .hd-top {
      font-size: 18px;
      color: #666;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      padding: 0 15px;
    }

    .btn-wrap {
      padding: 0 25px 5px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .view-by-btn {
        display: flex;
        align-items: center;

        span {
          font-size: 14px;
          color: #999;
        }

        button {
          padding: 3px 5px;
        }

      }
    }
    .status {
      display: flex;
      height: 60px;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      box-sizing: border-box;

      .btn-wrap {
        display: flex;
        align-items: center;

        span {
          font-size: 14px;
          margin-right: 10px;
        }

        button {
          padding: 2px 5px;
          cursor: pointer;
          transition: all .5s ease;
        }

      }
      .select-wrap {
        display: flex;
        align-items: center;

        .select {
          width: 110px;
          margin-right: 5px;

          input {}

        }
      }
    }
  }

</style>
