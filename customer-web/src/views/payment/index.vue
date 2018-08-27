<template>
    <div class="payment">
        <div class="title">
            {{$i.payment.orderOverview}}
        </div>
        <div class="body">
            <div class="head">
                <div class="spe-div">
                    <div>
                      <span class="text">{{$i.payment.status}} : </span>
                      <el-radio-group size="mini" v-model="params.conditions.overdue" @change="getList">
                        <el-radio-button label="-1" border>{{$i.common.all}}</el-radio-button>
                        <el-radio-button label="1" >{{$i.payment.overdue}}</el-radio-button>
                        <el-radio-button label="0" >{{$i.payment.future}}</el-radio-button>
                      </el-radio-group>
                    </div>
                </div>
              <div>
                <div class="View">
                  <span class="text">{{$i.payment.view}} : </span>
                  <el-radio-group size="mini"  v-model="params.conditions.orderType"  @change="getList">
                    <el-radio-button label="" border>{{$i.common.all}}</el-radio-button>
                    <el-radio-button label="30">{{$i.common.logisticOrder}}</el-radio-button>
                    <el-radio-button label="10">{{$i.common.purchaseOrder}}</el-radio-button>
                    <el-radio-button label="20">{{$i.common.qcOrder}}</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <br>
            <!-- ref="tab" @action="action"  @page-change="pageChange" -->
            <div class="main">
                <v-table
                :data="tableDataList"
                code="ledger"
                :totalRow="totalRow"
                :loading="tabLoad"
                :buttons="setButtons"
                @action="action"
                :rowspan="1"
                :height="500"
                @filter-value="onFilterValue"
                @change-sort="sort"
                @change-checked='checked'
                >
                  <template slot="header">
                    <div style="overflow: hidden">
                      <el-button style="float: left" @click="downloadPayment" v-authorize="'PAYMENT:DOWNLOAD'">
                        {{$i.common.download}}
                        ({{selectedData.length===0?$i.common.all:selectedData.length}})
                      </el-button>
                      <div class="Date">
                        <span class="text1" >{{$i.payment.orderCreateDate}} : </span>
                        <el-date-picker
                          v-model="date"
                          type="daterange"
                          align="right"
                          unlink-panels
                          :range-separator="$i.element.to"
                          :start-placeholder="$i.element.startDate"
                          :end-placeholder="$i.element.endDate"
                          value-format="timestamp"
                          :default-time="['00:00:00','23:59:59']"
                          :picker-options="dateOptions">
                        </el-date-picker>
                      </div>
                      <div class="search">
                        <select-search
                          v-model="searchId"
                          class="search"
                          :options=options
                          @inputEnter="inputEnter"
                          :searchLoad="searchLoad">
                        </select-search>
                      </div>
                    </div>
                  </template>
                </v-table>
               <page
                :page-data="pageData"
                @change="handleSizeChange"
                :page-sizes="[50,100,200]"
                @size-change="pageSizeChange"></page>
            </div>
        </div>
    </div>
</template>
<script>

    import {VTable,VPagination,selectSearch} from '@/components/index';
    import { mapActions } from 'vuex';
    export default {
        name:'payment',
        components:{
            selectSearch,
            VTable,
            page:VPagination
        },
        data(){
            return{
                // flag:true,
                timestamp:0,
                pageTotal:0,
                searchLoad: false,
                viewByStatus:'',
                date:'',
                tabLoad:false,
                searchId:'1',
                pageData:{},
                options: [{
                  id: '1',
                  label: 'Order No'
                }],
                params:{
                  conditions: {
                    orderEntryEndDt: "",
                    orderEntryStartDt: "",
                    orderNoLike: "",
                    orderType: "",
                    overdue: -1
                  },
                  pn: 1,
                  ps: 50
                },
                dateOptions:{
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                //底部table数据
                tableDataList:[],
                totalRow: [],
                currency:[],
                selectedData:[],
                moduleCode:''
            }
        },
        watch: {
            date(){
              if (this.date){
                this.params.conditions.orderEntryStartDt = this.date[0]
                this.params.conditions.orderEntryEndDt = this.date[1]
              }else{
                this.params.conditions.orderEntryStartDt ='';
                this.params.conditions.orderEntryEndDt = '';
              }
              this.getList()
            },
        },
        methods:{
            ...mapActions(['setMenuLink']),
            onFilterValue(val) {
                console.log(val);
            },
            inputEnter(val) {
              if (!val.id) return this.$message({
                message: this.$i.common.keyType,
                type: 'warning'
              });
              if (val.id == '1') {
                this.params.conditions.orderNoLike = val.value
              }
              this.getList()
            },
            handleSizeChange(val) {
                this.params.pn = val;
                this.getList();
            },
            pageSizeChange(val) {
                this.params.ps = val;
                this.getList();
            },
            //.........checked
            checked(item) {
              this.selectedData = item
            },
            getList(){
              this.tabLoad = true;
              this.$ajax.post(this.$apis.post_ledgerPage, this.params)
                .then(res => {
                  this.tabLoad = false;
                  this.searchLoad = false;
                  this.tableDataList = this.$getDB(this.$db.payment.table, res.datas,item=>{
                    const statusType = {
                      10: this.$i.payment.purchaseOrder,
                      20: this.$i.payment.qcOrder,
                      30: this.$i.payment.logistticOrder,
                    }
                    const statusGroupA = {
                      1: this.$i.payment.TBCBYSUPPLIER,
                      2: this.$i.payment.TBCBYCUSTOMER,
                      3: this.$i.payment.PROCESS,
                      4: this.$i.payment.FINISHED,
                      5: this.$i.payment.CANCLED,
                    }
                    const statusGroupB = {
                      0: this.$i.payment.draft,
                      1: this.$i.payment.lsPlan,
                      2: this.$i.payment.lsPlan,
                      3: this.$i.payment.lsPlan,
                      4: this.$i.payment.lsPlan,
                      5: this.$i.payment.lsPlan,
                    }

                    if(Number(item.orderType.value) === 10){
                      if (Number(item.orderStatus.value) >= 1 && Number(item.orderStatus.value)<= 5) {
                        item.orderStatus._value = statusGroupA[Number(item.orderStatus.value)]
                      }
                    }
                    if(Number(item.orderType.value) === 30){
                      if (Number(item.orderStatus.value) >= 1 && Number(item.orderStatus.value)<= 5) {
                        item.orderStatus._value = statusGroupB[Number(item.orderStatus.value)]
                      }
                    }
                    if(Number(item.orderType.value) === 20){
                      switch(item.orderStatus.value) {
                        case 'WAITING_QC':
                          item.orderStatus._value = this.$i.payment.waitingQc;
                          break;
                        case 'COMPLETED_QC':
                          item.orderStatus._value = this.$i.payment.completedQc;
                          break;
                      }
                    }
                    if (Number(item.orderType.value) >= 10 && Number(item.orderType.value)<= 30) {
                      item.orderType._value = statusType[Number(item.orderType.value)]
                    }
                    _.mapObject(item, val => {
                      val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd'))
                      return val
                    })
                    return item;
                  });


                  this.totalRow = this.$getDB(this.$db.payment.table, res.statisticalDatas)
                  this.pageData=res;
                })
                .catch((res) => {
                  this.tabLoad = false;
                  this.searchLoad = false;
              });

            },
            action(item, type) {
                switch(type) {
                  case '1':
                      this.urgingPayment(item);
                      break;
                    case '2':
                        this.detail(item);
                        break;
                }
            },
            detail(item) {
                //点击进入对应po detail 10、lo detail 30、QC order detail 20页面
                if(item.orderType.value == 10){
                  this.$windowOpen({
                    url: '/order/detail',
                    params: {
                      code:item.orderNo.value
                    }
                  });
              }else if(item.orderType.value == 20){
                  // this.$router.push({
                  //   path: '/warehouse/qcDetail',
                  //   query: {
                  //     code:item.orderNo.value
                  //   }
                  // })
                  this.$windowOpen({
                    url: '/warehouse/qcDetail',
                    params: {
                      code:item.orderNo.value
                    }
                  });
              }else{
                  this.$windowOpen({
                    url: '/logisticPlanDetail',
                    params: {
                      code:item.orderNo.value
                    }
                  });
              }
            },
            urgingPayment(item) {
              // (this.timestamp) || (this.timestamp = new Date().getTime())
              // ① 催款，此操作会给对应付款人发一条提示付款的信息，在对方的workbench显示；
              // ④ 催款限制：每天能点三次，超过次数后禁用；每次点击间隔一分钟才能再次点击，其间按钮为禁用
              switch(item.orderType.value) {
                case 10:
                  this.moduleCode = 'ORDER';
                  break;
                case 20:
                  this.moduleCode = 'WAREHOUSE';
                  break;
                case 30:
                  this.moduleCode = 'LOGISTIC';
                  break;
              }
              if(item.timestamp.value === ''){
                item.paymentNumber.value = true;
                item.timestamp.value = new Date().getTime();
              }else if (((new Date().getTime()-item.timestamp.value)/1000)<=60 && item.paymentNumber.value){
                this.$message({
                  type: 'warning',
                  message: this.$i.payment.urgingPaymentTime
                });
                return false
              }
              this.$ajax.post(`${this.$apis.post_payment_dunning}/${item.paymentId.value}?version=${item.version.value}&moduleCode
=${this.moduleCode}`)
                .then(res => {
                  this.$message({
                    type: 'success',
                    message: this.$i.payment.urgedSuccess
                  });
                }).catch((res) => {
                item.paymentNumber.value = false;
              });
            },
            setButtons(item){
              // disabled:true/false   10 付款 20 退款
                if(_.findWhere(item, {'key': 'type'}).value === 20 && _.findWhere(item, {'key': 'planReceiveAmount'}).value !== _.findWhere(item, {'key': 'actualReceiveAmount'}).value) return [{label: this.$i.payment.urgingPayment, type: '1',auth:'PAYMENT:URGING'},{label: this.$i.payment.detail, type: '2'}];
                 return [{label: this.$i.payment.detail, type: '2'}];
            },
            handleSizeChange(val) {
                this.params.ps = val;
            },
          //...............sort
          sort(item){
            this.params.sorts =  item.sorts;
            this.getList();
          },
          downloadPayment(){
              let conditions = {
                conditions:{
                  ids: _.pluck(_.pluck(this.selectedData,"paymentId"),'value')
                }
              }
              if(this.selectedData.length>0){
                this.$fetch.export_task('EXPORT_LEDGER',conditions);
              }else{
                let params=this.$depthClone(this.params);
                this.$fetch.export_task('EXPORT_LEDGER',params);
              }

          },

        },
        mounted(){
          this.setMenuLink({
              path: '/logs',
              query: {code: 'PAYMENT',bizCode:'PAYMENT'},
              type: 100,
              label: this.$i.common.log,
              auth: 'PAYMENT:LOG'
            });
        },
        created(){
           this.viewByStatus = '1';
           this.getList();
        },
    }
</script>
<style scoped>
    .title{
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color:#666666;
        padding: 10px 0;
    }
    .head>div{
        margin-bottom: 10px;
    }
    .head{
      overflow: hidden;
    }
    .head .text{
        display: inline-block;
        width: 60px;
        font-size: 14px;
        /*font-weight: bold;*/
        color:#999999;
    }
    .head .text1{
      display: inline-block;
      width: 100px;
      font-size: 14px;
      /*font-weight: bold;*/
      color:#999999;
    }
    .spe-div:after{
        content: '';
        display: table;
        clear: both;
        overflow: hidden;
    }
    .Date{
      float: left;
      margin-left: 20%;
    }

    .search{
      float: right;
      margin-right: 10px;
    }

</style>
