<template>
  <div class="logistic-plan-overview">
    <div class="hd-top">{{ headerText[pageType] }}</div>
    <div class="status">
      <div class="btn-wrap">
        <div>
          <div class="ls_plan" v-if="pageType === 'plan' || pageType === 'loadingList'">
            <span v-if="pageType === 'loadingList'">{{ $i.logistic.shipmentStatus}}:</span>
            <span v-if="pageType === 'plan'">{{ $i.logistic.status}}:</span>
            <el-radio-group v-model="fillterVal" size="mini" @change="fetchDataList('elRadioGroup')">
              <el-radio-button label="all">{{ $i.logistic.all }}</el-radio-button>
              <el-radio-button v-if="pageType == 'plan'" :label="+a.code" v-for="a of ls_plan.LS_PLAN" :key="'status-' + a.code">{{a.name}} </el-radio-button>
              <el-radio-button v-if="pageType === 'loadingList'" :label="+a.code" v-for="a of ls_plan.LS_STATUS" :key="'status-' + a.code">{{a.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="select-search-wrap">
        <select-search :options="options" @inputEnter="searchFn" v-model="selectSearch"/>
      </div>
    </div>
    <div class="status" v-if="pageType === 'plan'">
      <div class="btn-wrap">
        <div>
          <div class="ls_plan">
            <span>{{ $i.logistic.shipmentStatus}}:</span>
            <el-radio-group v-model="shipmentStatus" size="mini" @change="fetchDataList('elRadioGroup')">
              <el-radio-button label="all">{{ $i.logistic.all }}</el-radio-button>
              <el-radio-button :label="+a.code" v-for="a of ls_plan.LOGISTICS_SHIP_STATUS" :key="'status-' + a.code">{{a.name}}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <v-table
      :code="urlObj[pageType][viewBy].setTheField"
      :data="tabData"
      :buttons="[{label: $i.logistic.detail, type: 'detail'}]"
      @action="action"
      @change-checked="changeChecked"
      :loading="tableLoading"
      :height="height"
      ref="tab"
      @change-sort="changeSort"
    >
      <div slot="header">
        <div class="btn-wrap">
          <div class="fn btn">
            <div v-if="pageType === 'plan'">
              <el-button v-authorize="auth[pageType]&&auth[pageType].DOWNLOAD||''" @click="download">{{ $i.logistic.download }}({{selectCount.length||$i.logistic.all}})</el-button>
              <el-button v-authorize="auth[pageType]&&auth[pageType].ARCHIVE||''" @click="sendArchive" :disabled="!(isArchive&&viewBy=='plan')">{{ $i.logistic.archive }}</el-button>
              <el-button v-authorize="auth[pageType]&&auth[pageType].CREATE||''" @click.stop="addNew">{{ $i.logistic.placeLogisticPlan }}</el-button>
            </div>
            <div v-if="pageType === 'loadingList'">
              <el-button v-authorize="auth[pageType]&&auth[pageType].DOWNLOAD||''" @click="download">{{ $i.logistic.download }}({{selectCount.length||$i.logistic.all}})</el-button>
              <el-button v-authorize="auth[pageType]&&auth[pageType].ARCHIVE||''" @click="sendArchive" :disabled="!(isArchive&&viewBy=='plan')">{{ $i.logistic.archive }}</el-button>
            </div>
            <div v-if="pageType === 'draft'">
              <el-button v-authorize="auth[pageType]&&auth[pageType].ARCHIVE||''" @click="sendArchive" :disabled="!(isArchive&&viewBy=='plan')">{{ $i.logistic.archive }}</el-button>
              <el-button v-authorize="auth[pageType]&&auth[pageType].SEND||''" @click="batchSendDraft" :disabled="selectCount.length<=0">{{ $i.logistic.send }}</el-button>
            </div>
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
    <v-pagination :pageSizes="[50,100,200]" :page-data="pageParams" @size-change="sizeChange" @change="pageChange"/>
  </div>
</template>
<script>
  import {selectSearch, VTable, VPagination} from '@/components/index';
  import {mapActions, mapState} from 'vuex';
  export default {
    name: 'logisticPlanOverview',
    data() {
      return {
        isArchive:false,
        selectSearch:'',
        height:500,
        tableLoading: false,
        ls_plan: {},
        pageParams: null,
        selectCount: [],
        fillterVal: 'all',
        shipmentStatus: 'all',
        tabData: [],
        viewBy: 'plan',
        options: [
          {
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
        auth:{
          plan: {
            DOWNLOAD :['LOGISTICS:PLAN_OVERVIEW:DOWNLOAD','LOGISTICS:PLAN_OVERVIEW:READ_ONLY'],
            ARCHIVE  : ['LOGISTICS:PLAN_OVERVIEW:ARCHIVE','LOGISTICS:PLAN_OVERVIEW:READ_ONLY'],
            CREATE  : ['LOGISTICS:PLAN_OVERVIEW:CREATE','LOGISTICS:PLAN_OVERVIEW:READ_ONLY']
          },
          loadingList: {
            DOWNLOAD:['LOADING_LIST:OVERVIEW:DOWNLOAD'],
            ARCHIVE:['LOADING_LIST:OVERVIEW:ARCHIVE']
          },
          draft: {
            ARCHIVE:['LOGISTICS:PLAN_DRAFT_OVERVIEW:ARCHIVE','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            SEND:['LOGISTICS:PLAN_DRAFT_OVERVIEW:SEND','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY']
          }
        },
        headerText: {
          plan: this.$i.logistic.logisticsPlanOverview,
          loadingList: this.$i.logistic.loadingListOverview,
          draft: this.$i.logistic.draftOverview,
          archive: this.$i.logistic.archiveOverview
        },
        jumpPage: {
          plan: 'planDetail',
          loadingList: 'planDetail',
          draft: 'planDraftDetail',
          archive: '',
        },
        urlObj: {
          plan: {
            plan: {
              key: 0,
              setTheField:'ulogistics_PlanOverviewPlanNo',
              label: 'plan',
              text: this.$i.logistic.plan,
              url: this.$apis.gei_plan_list,
              db: this.$db.logistic.planList
            },
            transportation: {
              key: 1,
              setTheField:'ulogistics_PlanOverviewByUnit',
              label: 'transportation',
              text: this.$i.logistic.transportationUnit,
              url: this.$apis.get_transportation_list,
              db: this.$db.logistic.transportationList
            },
            sku: {
              key: 2,
              setTheField:'ulogistics_PlanOverviewSkuCode',
              label: 'sku',
              text: this.$i.logistic.sku,
              url: this.$apis.get_sku_list,
              db: this.$db.logistic.sku
            }
          },
          loadingList: {
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
          },
          draft: {
            plan: {
              key: 0,
              setTheField:'ulogistics_PlanOverviewPlanNo',
              label: 'plan',
              text: this.$i.logistic.plan,
              url: this.$apis.gei_plan_list,
              db: this.$db.logistic.planList
            },
            transportation: {
              key: 1,
              setTheField:'ulogistics_PlanOverviewByUnit',
              label: 'transportation',
              text: this.$i.logistic.transportationUnit,
              url: this.$apis.get_transportation_list,
              db: this.$db.logistic.transportationList
            },
            sku: {
              key: 2,
              setTheField:'ulogistics_PlanOverviewSkuCode',
              label: 'sku',
              text: this.$i.logistic.sku,
              url: this.$apis.get_sku_list,
              db: this.$db.logistic.sku
            }
          },
          downloadIds:[],
        }
      }
    },
    components: {
      selectSearch,
      VTable,
      VPagination
    },
    watch: {
      viewBy(newVal) {
        this.initPage();
        this.fetchDataList()
      },
      pageType() {
        this.fetchData()
      }
    },
    computed: {
      pageType() {
        const arr = this.$route.fullPath.split('/')
        return arr[arr.length - 1]
      }
    },
    mounted() {
      let menuList = [{
        path: '',
        query: {
          bizCode: this.pageType && this.pageType == "loadingList" ? 'BIZ_LOGISTIC_ORDER' : 'BIZ_LOGISTIC_PLAN',
          code : 'LOGISTIC'
        },
        type: 100,
        auth: (()=>{ 
          let code = null;
          if(this.pageType=="plan"){
            code = 'LOGISTICS:LOG';
          }else if(this.pageType=="loadingList"){
            code = 'LOADING_LIST:LOG';
          }else if(this.pageType=="draft"){
            code = 'LOGISTICS:LOG';
          }
          return code
        })(),
        label: this.$i.common.log
      },{
        path: '/logistic/draft',
        auth: 'LOGISTICS:PLAN_DETAIL:ARCHIVE',
        label: this.$i.common.draft
      }];
      if(this.pageType=="plan"){
        menuList.push(
          {
            path: '/logistic/archivePlan',
            auth: 'LOGISTICS:PLAN_DETAIL:ARCHIVE',
            label: this.$i.logistic.archivePlan
          }
        )
      }else if(this.pageType=="loadingList"){
        menuList.push(
          {
            path: '/logistic/archiveLoadingList',
            auth: 'LOADING_LIST:DETAIL:ARCHIVE',
            label: this.$i.logistic.archiveLoadingList
          }
        )
      }else if(this.pageType=="draft"){
        menuList.push(
          {
            path: '/logistic/archiveDraft',
            auth: 'LOGISTICS:PLAN_DETAIL:ARCHIVE',
            label: this.$i.logistic.archiveDraft
          }
        )
      }
      this.setMenuLink(menuList);
      this.fetchData();
      // this.getContainerType() 接手注释
    },
    methods: {
      ...mapActions(['setMenuLink']),
      initPage(){
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
      download(){
        const url = this.urlObj[this.pageType][this.viewBy].url
        const db = this.urlObj[this.pageType][this.viewBy].db
        const lgStatus = this.fillterVal === 'all' ? [] : [this.fillterVal]
        this.pageType === 'draft' && (this.pageParams.planStatus = 1)
        this.pageType === 'plan' && (this.pageParams.planStatus = 2)
        let code = this.pageType=="loadingList" ? 'LOADING_LIST_CI_PL' : 'LOGISTICS_PLAN'
        this.$fetch.export_task(code,{lgStatus, ...this.pageParams,ids:this.downloadIds,archive:0})
      },
      changeSort(arr){
        this.pageParams.sorts = arr.sorts;
        this.fetchDataList();
      },
      fetchData() {
        this.getDictionary(['LS_PLAN','LS_STATUS','LOGISTICS_SHIP_STATUS']);
        this.initPage();
        this.fetchDataList()
      },
      deleteData() {
        this.$confirm(this.$i.logistic.isConfirmPeration, this.$i.logistic.tips, {
          confirmButtonText: this.$i.logistic.confirm,
          cancelButtonText: this.$i.logistic.cancel,
          type: 'warning'
        }).then(() => {
          this.$ajax.post(this.$apis.delete_by_ids, {ids: this.selectCount.map(a => a.id.value)}).then(res => {
            this.initPage();
            this.selectCount = []
            this.fetchDataList()
            this.$message({
              type: 'success',
              message: this.$i.logistic.operationSuccess
            })
          })
        })
      },
      changeChecked(arr) {
        this.selectCount = arr;
        this.isArchive = arr.length&&arr.map(el=>{
          if( this.pageType === 'loadingList'){
            return el.logisticsStatus.value == 4;
          }else if(this.pageType === 'plan'){
            return (el.logisticsStatus.value == 4 || el.logisticsStatus.value == 5)
          }else if(this.pageType === 'draft'){
            return true;
          }
        }).every(el=> el);
        this.downloadIds = arr.map(el => {
          return el.id.value
        })
      },
      action(e) {
        if(this.pageType == 'loadingList'){
          this.$windowOpen({url:`/logistic/loadingListDetail`,params:{id: e.id.value}});
        }else{
          this.$windowOpen({url:`/logistic/${this.jumpPage[this.pageType]}`,params:{id: e.id.value}});
        }
      },
      searchFn(obj) {
        // const {pn, ps} = this.pageParams
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
      addNew() {
        this.$windowOpen({url:`/logistic/placeLogisticPlan`});
      },
      sendArchive(){
        let url = this.pageType=="loadingList" ? this.$apis.logistics_order_archive : this.$apis.logistics_plan_archive;
        this.$ajax.post(url,{ids:this.downloadIds}).then(res => {
          this.selectCount = [];
          this.fetchDataList();
        })
      },
      //获取国家信息
      countryAll() {
        return this.$ajax.get(`${this.$apis.country_all}`);
      },
      fetchDataList(arg) {
        // if(arg){
        //  this.initPage();
        // }
        this.isArchive = false;
        const url = this.urlObj[this.pageType][this.viewBy].url
        const db = this.urlObj[this.pageType][this.viewBy].db
        this.tableLoading = true
        const lgStatus = this.fillterVal === 'all' ? [] : [this.fillterVal]
        const lsStatus = this.shipmentStatus === 'all' ? [] : [this.shipmentStatus]

        this.pageType === 'draft' && (this.pageParams.planStatus = 1)
        this.pageType === 'plan' && (this.pageParams.planStatus = 2)
        this.$ajax.post(url, {lgStatus,lsStatus, ...this.pageParams}).then(res => {
          if (!res) return (this.tableLoading = false)
          this.getContainerType().then(ContainerType=>{
            this.countryAll().then(countryAll=>{
              this.tabData = this.$getDB(db, res.datas, item => {
                _.mapObject(item, val => {
                  if (val.type === 'country' && val.value) {
                    let obj = countryAll.find(a => a.code === val.value)
                    val.value = obj ? obj.name : null
                  } 
                  if (val.type === 'container' && val.value) {
                    let obj = ContainerType.find(a => a.code === val.value)
                    val.value = obj ? obj.name : null
                  } 
                  val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd'))
                  return val
                })
              })
            });
          })
          this.selectCount = [];
          this.$set(this.pageParams,'pn',res.pn);
          this.$set(this.pageParams,'ps',res.ps);
          this.$set(this.pageParams,'tc',res.tc);
          this.tableLoading = false
        })
      },
      getDictionary(keyCode) {
        this.$ajax.post(this.$apis.get_dictionary, keyCode).then(res => {
          res.forEach(el=>{
            this.$set(this.ls_plan,el.code,el.codes);
          })
        })
      },
      getContainerType() {
        return this.$ajax.get(this.$apis.get_container_type);
      },
      batchSendDraft(){
        this.$ajax.post(this.$apis.logistics_plan_batchSendDraft,{ids:this.downloadIds}).then(res => {
          this.selectCount = [];
          this.fetchData();
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
    height: 50px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  .ls_plan{
    margin: 10px 0;
  }
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

  input {
  }

  }
  }
  }
  }
</style>
