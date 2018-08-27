<template>
    <div class="track">
        <div class="title">
          {{$i.track.trackBySKU}}
        </div>
        <div class="body">
          <div class="status">
            <div class="btn-wrap">
              <span class="text">{{$i.payment.status}} : </span>
              <el-radio-group size="mini" @change="getList" v-model="params.status">
                <el-radio-button label="" border>{{$i.common.all}}</el-radio-button>
                <el-radio-button label="2" >{{$i.track.tbcC}}</el-radio-button>
                <el-radio-button label="1" >{{$i.track.tbcS}}</el-radio-button>
                <el-radio-button label="3" >{{$i.track.process}}</el-radio-button>
                <el-radio-button label="4" >{{$i.track.shipped}}</el-radio-button>
                <el-radio-button label="5" >{{$i.track.canceled}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="select-wrap">
              <select-search
                v-model="searchId"
                class="search"
                :options=options
                @inputEnter="inputEnter"
                :searchLoad="searchLoad">
              </select-search>
            </div>
          </div>
        </div>
            <v-table
              code="track"
              :data="dataList"
              :height="500"
              @change-sort="sort"
              @change-checked='checked'
              :loading='loading'>
              <template slot="header">
               <div class="box">
                 <div class="btn">
                   <el-button @click="download" :disabled='!(dataList.length)>0'>
                     {{$i.common.download}}
                     ({{selectedData.length===0?$i.common.all:selectedData.length}})
                   </el-button>
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
</template>

<script>
  import { VTable,selectSearch,VPagination } from '@/components/index'

    export default {
        name: "track-track",
        components:{
          selectSearch,
          VTable,
          page:VPagination
        },
        data(){
            return{
                dataList: [],
                selectedData: [],
                searchLoad: false,
                loading: false,
                searchId:'',
                pageData:{},
                params:{
                    pn: 1,
                    ps: 50,
                    skuCodeLike:'',
                    orderNoLike:'',
                    status: '',
                    sorts:[]
                },
              options: [{
                id: '1',
                label: 'skuCode'
              },{
                id: '2',
                label: 'orderNo'
              }],
              country:[],
              skuStatus:[]
            }
        },
        methods:{
            pageChange(page) {
                console.log(page)
            },
            getSort(val, key) {
                console.log(val, key)
            },
            handleSizeChange(val) {
                this.params.pn = val;
                this.getList();
            },
            pageSizeChange(val) {
                this.params.ps = val;
                this.getList();
            },
            inputEnter(val) {
              if (!val.label) return this.$message({
                message: 'please choose a type',
                type: 'warning'
              });
              if (val.id == '1') {
                this.params.orderNoLike = ''
                this.params.skuCodeLike= val.value
              }else{
                this.params.skuCodeLike = ''
                this.params.orderNoLike= val.value
              }
              this.getList()
            },
            //获取国家
            getCountryAll(){
              this.$ajax.get(this.$apis.GET_COUNTRY_ALL).then(res=>{
                this.country = res
              }).catch(err=>{
                console.log(err)
              });
            },
            //获取字典
            getCodePart(){
              this.$ajax.post(this.$apis.POST_CODE_PART,['SKU_STATUS'],{cache:true}).then(res=>{
                    this.skuStatus = _.findWhere(res, {'code': 'SKU_STATUS'}).codes;
              }).catch(err=>{
                console.log(err)
              });
            },
            getList() {
                this.loading = true;
                this.$ajax.post(this.$apis.get_track_getTrackInfoByPage,this.params).then(res=>{
                    this.loading = false;
                    this.dataList = this.$getDB(this.$db.track.track, res.datas,item=>{
                      let customerCountry,supplierCountry,skuStatus;
                      customerCountry = _.findWhere(this.country, {code: (item.customerCountry.value)}) || {};
                      // supplierCountry = _.findWhere(this.country, {code: (item.supplierCountry.value)}) || {};
                      skuStatus = _.findWhere(this.skuStatus, {code: (item.skuStatus.value)}) || {};
                      item.skuStatus._value = skuStatus.name || '';
                      item.customerCountry._value = customerCountry.name || '';
                      // item.supplierCountry._value = supplierCountry.name || '';
                      _.mapObject(item, val => {
                        val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd HH:MM:ss'))
                        return val
                      })
                    });
                  this.pageData=res;
              }).catch(err=>{
                this.loading = false;
              });
            },
          //...............sort
          sort(item){
            this.params.sorts =  item.sorts;
            this.getList();
          },
          //.........checked
          checked(item) {
            this.selectedData = item;
          },
          //.........download
          download(){
            if(this.selectedData.length>0){
              let params={
                checkBoxParams:[]
              };
              _.map(this.selectedData,v=> {
                params.checkBoxParams.push({
                  orderId: v.orderId.value,
                  logisticsId: v.logisticsId.value,
                  qcId: v.qcId.value
                })
              })
              this.$fetch.export_task('TRACK_TRACK_INFO',params);
            }else{
              let params=this.$depthClone(this.params);
              this.$fetch.export_task('TRACK_TRACK_INFO',params);
            }
          },
        },
        created(){
          this.getCountryAll();
          this.getCodePart();
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
        padding-bottom: 10px;
    }
    .head>div{
      margin-bottom: 10px;
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
          }
            button {
              padding: 2px 5px;
              cursor: pointer;
              border: 1px solid #108ee9;
              background-color: #fff;
              margin-left: 10px;
              border-radius: 5px;
              transition: all .5s ease;
                &:hover,
                &.active {
                   background-color: #108ee9;
                   color: #fff;
                 }
              }
          }
        .select-wrap {
          display: flex;
          align-items: center;
        .select {
          width: 110px;
          margin-right: 5px;

        }
     }
  }
</style>
