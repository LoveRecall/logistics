<template>
  <div class="message">
    <div class="head">
      <el-button @click="manageMessage" v-authorize="'MESSAGE:MANAGEMENT'">{{$i.common.messageManagement}}</el-button>
      <el-button type="primary" @click="postRead" :disabled="isResd">{{$i.common.markAsRead}}</el-button>
      <!-- <h1 style="color:red">这个页面表格要加一列title</h1> -->
    </div>
    <div class="spe-div">
      <div class="View">
        <el-radio-group size=""  v-model="viewByStatus" @change="getDataInfo()">
          <el-radio-button label="1">{{$i.message.platformMessage}}</el-radio-button>
          <el-radio-button label="2">{{$i.message.companyMessage}}</el-radio-button>
          <el-radio-button label="3">{{$i.message.messageSetting}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="search">
        <select-search  class="search" :options="options" @inputEnter="inputEnter" v-model="message" :searchLoad="searchLoad"/>
      </div>
    </div>
    <div class="main">
      <div v-show="isHide">
        <v-table
          :data="tabData"
          @change-checked="changeChecked"
          :height="500"
          hide-filter-value
          disabled-sort
        />
        <page
          :page-data="pageData"
          @change="handleSizeChange"
          :page-sizes="[50,100,200]"
          @size-change="pageSizeChange"></page>
      </div>

      <div v-show="isShow" class="box">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" >
          <!--<el-tab-pane >-->
          <el-table
            ref="tableData"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              label="Message Type"
              align="center">
              <template slot-scope="scope">{{ scope.row.message }}</template>
            </el-table-column>
            <el-table-column
              label="Notification Method"
              align="center">
              <template slot-scope="scope">
                <!--<div @click="handleEdit(scope.$index, scope.row)" style="display: inline-block;">-->
                  <el-checkbox @change="handleCheckedCitiesChange(scope.$index, scope.row)" v-model="scope.row.subscribeEmail">Email</el-checkbox>
                <!--</div>-->
                <el-checkbox v-model="checked1" disabled>Platform</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <!--</el-tab-pane>-->
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import { selectSearch, VTable,VPagination } from '@/components/index';
  import { mapActions } from 'vuex';

  export default {
    name: "message",
    components:{
      VTable,
      selectSearch,
      page:VPagination
    },
    data(){
      return{
        searchLoad: false,
        viewByStatus:'1',
        isShow:false,
        isHide:true,
        pageData:{},
        options: [{
          id: '1',
          label: 'Tittle'
        }, {
          id: '2',
          label: 'Content'
        }],
        activeName: 'System Message',           //激活的tab页的name
        multipleSelection:[],
        tableData:[],
        params: {
          title: '',
          content: '',
          ps:50,
          pn:1,
          sorts:[{
            orderBy: 'sendTime',
            orderType: 'DESC',
          }]
        },
        checked1:true,
        message:'',
        tabData:[],
        checkedData:[],
        centerDialogVisible:false,
        updatesetting:{
          id:'',
          subscribeEmail:0,
          subscribePlatform:1,
          messageType:''
        },
        isResd:true
      }
    },
    methods:{
      ...mapActions(['setMenuLink']),
      handleClick(tab, event) {
        // this.getMessageQuery()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
          this.params.pn = val;
          this.getDataInfo();
      },
      pageSizeChange(val) {
          this.params.ps = val;
          this.getDataInfo();
      },
      changeChecked(item) { //tab 勾选
        if (item.length != 0){
          this.isResd = false;
        }else{
          this.isResd = true;
        }
        this.checkedData = item;
      },
      handleCheckedCitiesChange(index, row){
        let url = this.$apis.post_messagesetting_updatesetting
        this.updatesetting.id = row.id
        this.updatesetting.messageType = row.messageType
        // 0：不订阅，1：订阅
        if (row.subscribeEmail){
          this.updatesetting.subscribeEmail = 1
          this.$ajax.post(url, this.updatesetting)
          .then(res => {
            this.$message({
              message: this.$i.common.configuration,
              type: 'success',
            });
            this.getMessageQuery()
          })
        }else{
          this.updatesetting.subscribeEmail = 0
          this.$ajax.post(url, this.updatesetting)
          .then(res => {
            this.$message({
              message: this.$i.common.configuration,
              type: 'success',
            });
            this.getMessageQuery()
          })
        }
      },
      //管理信息
      manageMessage(){
        this.$windowOpen({
          url: '/message/messageManagement',
        });
      },
      inputEnter(val) {
        if (!val.id) return this.$message({
          message: this.$i.common.keyType,
          type: 'warning'
        });
        if (val.id === '1'){
          this.params.title = val.value;
          this.params.content = '';
        }else{
          this.params.content = val.value;
          this.params.title = '';
        }
        this.searchLoad = true;
        this.getDataInfo();
      },
      getDataInfo() {
        let url;
        this.tabLoad = true;
        if(this.viewByStatus + '' === '1') {
          url = this.$apis.post_usermessage_querySystem;
        } else {
          url = this.$apis.post_usermessage_queryCompany;
        };
        this.$ajax.post(url, this.params)
          .then(res => {
              this.tabData = this.$getDB(this.$db.message.table, res.datas, e => {
                _.mapObject(e, val => {
                  val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd HH:MM:ss'))
                  return val
                })
                if(e.read.value){
                  e.read.value = this.$i.message.read;
                }else{
                  e.read.value = this.$i.message.unread;
                }
                return e
              });
            this.pageData=res;
            this.tabLoad = false;
            this.searchLoad = false;
          })
          .catch(() => {
            this.searchLoad = false;
            this.tabLoad = false;
          })
      },
      postRead(){
        let url;
        if(this.viewByStatus + '' === '1'){
          url = this.$apis.post_usermessage_readSystem;
        } else {
          url = this.$apis.post_usermessage_readCompany;
        };
        let arr = [];
        _.map(this.checkedData, item => {
          console.log(this.checkedData)
          if(!_.isUndefined(item)) arr.push(_.findWhere(item, {'key': 'id'}).value);
        });
        this.$ajax.post(url, arr)
          .then(res => {
            this.$message({
              type: 'success',
              message: this.$i.common.read
            });
            this.getDataInfo()
          })
          .catch(() => {

          })
      },
      getMessageQuery(){
        let url = this.$apis.get_messagesetting_query
        this.$ajax.get(`${url}?type=${1}`)
          .then(res => {
            res = _.map(res,val=>{
              switch (val.messageType)
              {
                case 1:
                  val.message = this.$i.message.platformMessage
                  break;
                case 2:
                  val.message = this.$i.message.companyMessage
                  break;
                case 3:
                  val.message = this.$i.message.pendingTask
                  break;
                case 4:
                  val.message = this.$i.message.futureTask
                  break;
                case 5:
                  val.message = this.$i.message.push
                  break;
                case 6:
                  val.message = this.$i.message.FYI
                  break;
              }
              if (val.subscribeEmail == 1){
                val.subscribeEmail = true
              }else{
                val.subscribeEmail = false;
              }
                return val;
            });
            this.tableData = res
          })
          .catch(() => {

          })
      },
    },
    watch: {
      viewByStatus() {
        if(this.viewByStatus == 3){
          this.isShow = true;
          this.isHide = false;
        }else{
          this.isShow = false;
          this.isHide = true;
        }
      }
    },
    created(){
      this.getDataInfo();
      this.getMessageQuery();
      switch (Number(this.$route.query.type)){
        case 1:
          this.viewByStatus = '1'
          break;
        case 2:
          this.viewByStatus = '2'
          break;
      }
    },
    mounted(){
      this.setMenuLink({
        path: '/logs',
        query: {code: 'MESSAGE',bizCode: 'BIZ_COMPANY_MESSAGE'},
        type: 100,
        label: this.$i.common.log,
      });
    },
  }
</script>

<style>
  .head{
    padding: 10px 0;
  }
  .box{
    padding-top: 20px;
  }
  /*.speTable >>> .el-table__header-wrapper table thead tr th{*/
  /*font-weight: bold;*/
  /*}*/
  .spe-div{
    padding-top: 20px;
    overflow: hidden;
    padding-bottom: 20px;
  }
  .spe-div .View{
    float: left;
  }
  .spe-div .search{
    float: right;
    margin-left: 10px;
    margin-right: 40px;
  }
</style>
