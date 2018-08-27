<template>
    <div class="souringDetail">
        <div class="head">
            <div class="title">
                <!--<img :src='basicDate.logo'/>-->
                <span>{{basicDate.name}}</span>
            </div>
            <div class="detail">
                 <el-form  label-width="190px">
                    <el-row>
                      <el-row>
                        <el-col :span="4" class="img-box">
                          <v-image :src="basicDate.logo" style="height: 184px;"/>
                        </el-col>
                        <el-col :span="20">
                          <el-form>
                            <el-row>
                              <el-col
                                v-for='(item,index) in $db.supplier.detail'
                                :key='index'
                                :xs="24" :sm="item.fullLine?24:24" :md="item.fullLine?24:12" :lg="item.fullLine?24:12" :xl="item.fullLine?24:8"
                              >
                                <el-form-item label-width="210px" :prop="item.key" :label="item.label+' :'">
                                  {{basicDate[item.key]}}
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-form>
                        </el-col>
                      </el-row>
                </el-row>
                  </el-form>
                <div class="btns" v-if="noEdit" v-authorize="'SUPPLIER:DETAIL:READ_ONLY'">
                    <el-button v-authorize="'SUPPLIER:DETAIL:CREATE_INQUIRY'" @click='createInquiry'>{{$i.common.createInquiry}}</el-button>
                    <el-button v-authorize="'SUPPLIER:DETAIL:CREATE_ORDER'" @click='createOrder'>{{$i.common.createOrder}}</el-button>
                    <el-button v-authorize="'SUPPLIER:DETAIL:ADD_COMPARE'" @click='addCompare'>{{$i.common.addToCompare}}</el-button>
                  <router-link :to="{ name:'productSourcingOverview', params: {supplierName: basicDate.name}}">
                    <el-button v-authorize="'SUPPLIER:DETAIL:PRODUCT'" >{{$i.common.supplierProducts}}</el-button>
                  </router-link>
                    <el-button v-authorize="'SUPPLIER:DETAIL:ADD_BOOKMARK'" @click='addToBookmark'>{{$i.common.addToBookmark}}</el-button>
                  <el-button v-authorize="'SUPPLIER:DETAIL:DOWNLOAD'" @click="download">
                    {{$i.common.download}}
                  </el-button>
                </div>

                <div class="btns" v-else>
                    <el-button @click="finishEdit" type="primary">{{$i.common.finish}}</el-button>
                    <el-button @click="cancelEdit" type="info">{{$i.common.cancel}}</el-button>
                </div>
            </div>
        </div>
        <div class="body">
            <el-tabs v-model="tabName" type="card"  @tab-click="handleClick">
                <el-tab-pane :label="$i.supplier.factoryInfo" name="address">
                    <v-table  :data="address" :selection="false" style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.supplier.accountInfo"  name="accountInfo">
                    <v-table  :data="accounts" :selection="false"  style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.supplier.contactInfo" >
                    <v-table  :data="concats"  :selection="false"  style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.supplier.tradeHistory"  name="tradeHistory">
                  <v-table  :data="orderData"  :selection="false"  style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.supplier.inquiryHistory"  name="inquireHistory">
                  <v-table  :data="inquireData"  :selection="false"  style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.supplier.attachment" name="attchment">
                  <!--<div class="section-btn" style="margin-bottom:10px;">-->
                    <!--<el-button  @click="upload" type="primary" >{{$i.button.upload}}</el-button>-->
                  <!--</div>-->
                  <v-upload  :limit="20" :list="attachments" readonly/>
                  <div class="attachment" v-show="!attachments" style="margin-top:40px;">
                    <div>
                      No Attachment
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$i.supplier.remark" name="remark">
                  <div class="section-btn">
                    <el-button  @click="createRemark" type="primary">{{$i.button.add}}</el-button>
                  </div>
                 <v-table
                   :data="remarkData"
                   style='marginTop:10px'
                   :buttons="[{label: $i.common.modify, type: 2},{label: $i.common.delete, type: 3}]"
                   @action="remarkAction"
                   :selection="false"
                 />
                </el-tab-pane>
            </el-tabs>
        </div>

     <VCompareList
                v-if="showCompareList"
                :data="compareData"
                @clearData="clearData"
                @goCompare="goCompare"
                @closeTag="handleClose">

     </VCompareList>

      <el-dialog :title="$i.supplier.addRemark" :visible.sync="addRemarkFormVisible" center width="600px">
        <el-form :model="addRemarkData">
          <el-form-item :label="$i.supplier.remark" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="4"
              v-model="addRemarkData.remark">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="disableCreateRemark" type="primary" @click="createRemarkSubmit">{{$i.button.submit}}</el-button>
          <el-button @click="addRemarkFormVisible = false">{{$i.button.cancel}}</el-button>
        </div>
      </el-dialog>


    </div>
</template>

<script>
    import VCompareList from '../../product/compareList'
    import VAttachment from '../attachment'
    import {
        VTable,VUpload,VImage
    } from '@/components/index';

    export default {
        name: "souringDetail",
        components: {
            VTable,
            VCompareList,
            VAttachment,
            VUpload,
            VImage
        },
        data() {
            return {
              noEdit: true,
              companyId: '',
              id: this.$route.query.id,
              tabName: 'address', //默认打开的tab
              basicDate: [],
              accounts: [],
              concats: [],
              address: [],
              remarkData: [],
              inquireData:[],
              orderData:[],
              showCompareList: false, //是否显示比较列表
              code: '',
              loading: false,
              compareData: [],
              orderHistoryData:{
                supplierCompanyId: null,
                pn: 1,
                ps: 50,
              },
              inquiryHistoryData:{
                supplierCompanyId:null,
                supplierId: '',
                pn: 1,
                ps: 50,
              },
              addRemarkData:{
                supplierId: null,
                id: null,
                remark: "",
                version: null
              },
              attachments:[],
              department:[],
              countryOption:[],
              addRemarkFormVisible:false,
              disableCreateRemark:false,
              lookRemarkFormVisible:false,
              isModifyAddress:false,
              formLabelWidth:'80px',
              currency:[],
              type:[],
              exportLicense:[],
              incoterm:[],
              payment:[],
              sex:[],
              orderStatus:[],
              inquiryStatus:[],
            }
        },
        methods: {
            handleClick(tab, event) {
              switch(Number(tab.index)){
                case 3:
                  this.getTradeHistoryList();
                  break;
                case 4:
                  this.getInquiryHistoryList();
                  break;
                case 6:
                  this.getListRemark();
                  break;
              }
            },
            createInquiry() {
                this.$windowOpen({
                    url: '/negotiation/createInquiry',
                    params: {
                      supplierCompanies: this.basicDate.companyId
                    }
                });
            },
            createOrder() {
                this.$windowOpen({
                    url: '/order/create',
                    params: {
                      supplierCode: this.code
                    }
                });
            },
            //添加比较
            addCompare() {
                this.showCompareList = true;
                let compareList = this.$localStore.get('compareSupplierList');
                let hasAdd = false;
                if (!compareList) {
                    compareList = [];
                }
                compareList.forEach(v => {
                    if (v.id === this.basicDate.id) {
                        //代表该商品已经添加了
                        hasAdd = true;
                    }
                });
                if (hasAdd) {
                    this.$message({
                        message: this.$i.common.supplierAddList,
                        type: 'warning'
                    });
                } else {
                    if (this.basicDate.id && this.basicDate != '') {
                        compareList.push({
                            name: this.basicDate.name,
                            id: this.basicDate.id
                        });
                        if (compareList.length>=100){
                          this.$message({
                            message: this.$i.common.compareLength,
                            type: 'warning'
                          });
                          return false;
                        }
                        this.compareData = compareList;
                        this.$localStore.set('compareSupplierList', compareList)
                    } else {
                        this.$message({
                            message: this.$i.common.addError,
                            type: 'warning'
                        });
                    }
                }
            },
            getCompareList() {
                let data = this.$localStore.get('compareSupplierList');
                if (!data) {
                    this.compareData = [];
                } else {
                    this.compareData = data;
                }
            },
            goCompare() {
                let data = this.$localStore.get('compareSupplierList');
                let id = '';
                data.forEach((v, k) => {
                    if (k === data.length - 1) {
                        id += v.id;
                    } else {
                        id += (v.id + ',');
                    }
                });
                this.$windowOpen({
                    url: 'supplier/compareDetail/{type}',
                    params: {
                        type: 'new',
                        id: id,
                    }
                });
            },
            handleClose(e) {
                let key;
                this.compareData.forEach((v, k) => {
                    if (v.id === e.id) {
                        key = k;
                    }
                });
                this.compareData.splice(key, 1);
                this.$localStore.set('compareSupplierList', this.compareData);
            },
            clearData() {
                this.$localStore.remove('compareSupplierList');
                this.compareData = [];
            },
            supplierProducts() {
                this.$windowOpen({
                    url: '/product/sourcing',
                    params: {
                        supplierName: this.basicDate.name
                    }
                });
            },
            addToBookmark() {
                this.$ajax.post(this.$apis.post_supplier_addbookmark, [this.id])
                    .then(res => {
                        this.$message({
                            message: this.$i.common.addSuccess,
                            type: 'success',
                        });
                      this.$router.push({
                        path:'/supplier/bookmarkDetail',
                        query:{
                          id:this.$route.query.id,
                          companyId:this.$route.query.companyId
                        }
                      })
                    })
                    .catch((res) => {
                        console.log(res)
                    });
            },
            //获取币种
            getCurrency(){
              this.$ajax.get(this.$apis.get_currency_all,{},{cache:true}).then(res=>{
                this.currency = res
              }).catch(err=>{
                console.log(err)
              });
            },
          //获取字典
          getCodePart(){
            this.$ajax.post(this.$apis.POST_CODE_PART,["ITM","PMT","CUSTOMER_TYPE","SEX","ORDER_STATUS","INQUIRY_STATUS"],{cache:true}).then(res=>{
              this.payment = _.findWhere(res, {'code': 'PMT'}).codes;
              this.incoterm = _.findWhere(res, {'code': 'ITM'}).codes;
              this.type = _.findWhere(res, {'code': 'CUSTOMER_TYPE'}).codes;
              this.sex = _.findWhere(res, {'code': 'SEX'}).codes;
              this.orderStatus = _.findWhere(res, {'code': 'ORDER_STATUS'}).codes;
              this.inquiryStatus = _.findWhere(res, {'code': 'INQUIRY_STATUS'}).codes;
            }).catch(err=>{
              console.log(err)
            });
          },
            //..................获取数据
           getData() {
                this.loading = true
                this.$ajax.get(this.$apis.get_supplier_id, {
                        id: this.companyId
                    })
                    .then(res => {
                        this.code = res.code;
                        this.attachments = res.attachments;
                        this.basicDate = res;
                        let type,incoterm,payment,country;
                        country = _.findWhere(this.countryOption, {code: this.basicDate.country}) || {};
                        incoterm = _.findWhere(this.incoterm, {code: (this.basicDate.incoterm)+''}) || {};
                        type = _.findWhere(this.type, {code: (this.basicDate.type)+''}) || {};
                        payment = _.findWhere(this.payment, {code: (this.basicDate.payment)+''}) || {};
                        this.basicDate.country = country.name || '';
                        this.basicDate.incoterm = incoterm.name || '';
                        this.basicDate.type = type.name || '';
                        this.basicDate.payment = payment.name || '';
                        if (this.basicDate.exportLicense){
                          this.basicDate.exportLicense = this.$i.supplier.exportLicenseYes
                        }else{
                          this.basicDate.exportLicense = this.$i.supplier.exportLicenseNo
                        }
                        this.accounts = this.$getDB(this.$db.supplier.accountInfo, res.accounts,e => {
                          return e;
                        });
                        this.address = this.$getDB(this.$db.supplier.detailTable, res.address, e => {
                          let country,recvCountry;
                          country = _.findWhere(this.countryOption, {code: e.country.value}) || {};
                          recvCountry = _.findWhere(this.countryOption, {code: e.recvCountry.value}) || {};
                          e.country._value = country.name || '';
                          e.recvCountry._value = recvCountry.name || '';
                          const province = e.province.value || '';
                          const city = e.city.value || '';
                          const address = e.address.value || ''
                          const recvProvince = e.recvProvince.value || '';
                          const recvCity = e.recvCity.value || '';
                          const recvAddr = e.recvAddr.value || '';
                          e.factoryAddress.value = e.country._value +' '+province+' '+city+' '+address;
                          e.expressAddress.value = e.recvCountry._value +' '+recvProvince+' '+recvCity+' '+recvAddr
                          return e;
                        } );
                        let concats = res.concats
                        //获取部门列表匹配
                        if (this.basicDate.tenantId && this.basicDate.companyId){
                          this.$ajax.get(`${this.$apis.GET_DEPARTMENT}?tenantId=${this.basicDate.tenantId}&companyId=${this.basicDate.companyId}`).then(res=>{
                            this.concats = this.$getDB(this.$db.supplier.concats, concats, e => {
                              let gender,deptId;
                              gender = _.findWhere(this.sex, {code: (e.gender.value)+''}) || {};
                              e.gender._value = gender.name || '';
                              deptId = _.findWhere(res, {deptId: (e.deptId.value)}) || {};
                              e.deptId._value = deptId.deptName || '';
                              return e;
                            });

                          })
                        }
                        this.loading = false
                    })
                    .catch((res) => {
                        this.loading = false
                    });
            },
          //tradeHistory
            getTradeHistoryList(){
              this.loading = true
              this.orderHistoryData.supplierCompanyId = this.$route.query.companyId;
              this.$ajax.post(this.$apis.post_purchase_supplier_orderHistory, this.orderHistoryData)
                .then(res => {
                  this.orderData = this.$getDB(this.$db.supplier.sourcingTrade, res.datas, item =>{
                    let orderStatus;
                    orderStatus = _.findWhere(this.orderStatus, {code: item.status.value}) || {};
                    item.status._value = orderStatus.name || '';
                    _.mapObject(item, val => {
                      val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd'))
                      return val
                    })
                  } );
                  this.loading = false
                })
                .catch((res) => {
                  this.loading = false
                });
            },
          // getInquiryHistory
            getInquiryHistoryList(){
              this.loading = true
              this.inquiryHistoryData.supplierCompanyId =  this.$route.query.companyId;
              this.$ajax.post(this.$apis.post_purchase_supplier_getInquiryHistory, this.inquiryHistoryData)
                .then(res => {
                  this.inquireData = this.$getDB(this.$db.supplier.sourcingInquiry, res.datas, item => {
                    let inquiryStatus,payment,incoterm;
                    inquiryStatus = _.findWhere(this.inquiryStatus, {code: item.status.value}+'') || {};
                    payment = _.findWhere(this.payment, {code: item.paymentTerm.value}) || {};
                    incoterm = _.findWhere(this.incoterm, {code: item.incoterm.value}) || {};
                    item.status._value = inquiryStatus.name || '';
                    // item.payment._value = payment.name || '';
                    item.incoterm._value = incoterm.name || '';

                    _.mapObject(item, val => {
                      val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd'))
                      return val
                    })
                  });
                  this.loading = false
                })
                .catch((res) => {
                  this.loading = false
                });
            },
          //remark
          getListRemark(){
            const remark ={
              id:this.id,
              pn: 1,
              ps: 50,
            }
            this.$ajax.post(this.$apis.post_purchase_supplier_listRemarks,remark)
              .then(res => {
                this.remarkData = this.$getDB(this.$db.supplier.remark, res.datas, item => {
                  _.mapObject(item, val => {
                    val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd'))
                    return val
                  })
                });
              })
              .catch((res) => {
                console.log(res)
              });
          },
          modifyRemark(e){
            var result = {}
            result.remark = e.remark.value;
            result.version = e.version.value;
            result.id = e.id.value;
            this.isModifyAddress=true;      //标识正在修改地
            this.addRemarkData=Object.assign({}, result);
            this.addRemarkFormVisible=true;
          },
          createRemark(){
            this.addRemarkFormVisible=true;
            this.addRemarkData = {}
          },
          remarkAction(item,type){
            switch(type) {
              case 2:
                this.modifyRemark(item);
                break;
              case 3:
                this.deleteRemark(item);
                break;
            }
          },
          createRemarkSubmit(){
            this.disableCreateRemark = true;
            this.addRemarkData.supplierId = this.$route.query.id;
            if (this.isModifyAddress){
              this.$ajax.post(`${this.$apis.post_purchase_supplier_remark_id}/${this.addRemarkData.id}`,this.addRemarkData)
                .then(res => {
                  this.$message({
                    message: this.$i.common.modifySuccess,
                    type: 'success'
                  });
                  this.getListRemark();
                  this.disableCreateRemark = false;
                  this.addRemarkFormVisible = false;
                })
                .catch((res) => {
                  this.disableCreateRemark = false;
                  this.addRemarkFormVisible = false;
                });
            }else{
              this.$ajax.post(this.$apis.post_purchase_supplier_remark,this.addRemarkData)
                .then(res => {
                  this.$message({
                    message: this.$i.common.addSuccess,
                    type: 'success'
                  });
                  this.getListRemark();
                  this.disableCreateRemark = false;
                  this.addRemarkFormVisible = false;
                })
                .catch((res) => {
                  this.disableCreateRemark = false;
                  this.addRemarkFormVisible = false;
                });
            }
          },
          deleteRemark(e){
            this.$confirm(this.$i.common.sureToDeleteRemark, this.$i.common.prompt, {
              confirmButtonText: this.$i.common.confirm,
              cancelButtonText: this.$i.common.cancel,
              type: 'warning'
            }).then(() => {
              this.$ajax.post(this.$apis.post_purchase_supplier_deleteRemark_id,{id:e.id.value}).then(res=>{
                this.$message({
                  type: 'success',
                  message: this.$i.common.deleteTheSuccess
                });
                this.getListRemark();
              }).catch(err=>{
              });
            })
          },
          //获取国家
          getCountryAll(){
            this.$ajax.get(this.$apis.GET_COUNTRY_ALL,{},{cache:true}).then(res=>{
              this.countryOption = res
            }).catch(err=>{
              console.log(err)
            });
          },
          //download
          download(){
            let ids=_.pluck(_.pluck(this.basicDate,"id"),'value');
            this.$fetch.export_task('UDATA_PURCHASE_EXPORT_SUPPLIER_IDS',{ids:ids});
          },
        },
        created() {
            this.companyId = this.$route.query.companyId;
            this.getData();
            this.getCompareList();
            this.getCountryAll();
            this.getCurrency();
            this.getCodePart();
        },

    }

</script>

<style scoped>
    .title img {
        max-width: 100px;
        max-height: 100px;
        margin-left: 30px;
    }

    .title {
        display: flex;
        align-items: center;
        margin-top: 20px;
    }

    .title span {
        margin-left: 10px;
    }

    .detail {
        padding-top: 20px;
    }

    .souringDetail {
        background-color: #f4f4f4;
    }

    .souringDetail .head {
        background-color: #FFFFFF;
        padding: 0 20px;

    }

    .souringDetail .head .title {
        position: relative;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        font-size: 18px;
        color: #666666;
    }

    .souringDetail .head .title .title-btn {
        float: right;
    }

    .souringDetail .head .detail {
        margin-top: 8px;
    }

    .souringDetail .head .detail .carousel-img {
        height: 170px;
    }

    .souringDetail .head .detail .carousel-img img {
        width: 100%;
        height: 100%;
    }

    .souringDetail .head .detail .right {
        /*padding-top: 10px;*/
    }

    .souringDetail .head .detail .list {
        padding-left: 30px;
        font-size: 14px;
        line-height: 2.5;
        /*        border-bottom: 1px dotted #e0e0e0;*/
    }

    .souringDetail .head .detail .btns {
        text-align: center;
        padding: 15px 0;
    }

    .souringDetail .head .detail .btns>Button {
        margin-right: 10px;
    }

    .souringDetail .body {
        margin-top: 10px;
        margin-bottom: 20px;
        background-color: #FFFFFF;
    }

    .souringDetail .body .list {
        line-height: 30px;
        font-size: 13px;
    }

    .speForm .el-form-item--small.el-form-item {
        margin-bottom: 0;
    }

    .speForm .el-row .list .el-input {
        width: 80%;
    }

    .attachment{
      max-height: 300px;
      max-width: 100%;
      overflow-y: scroll;
      overflow-x: auto;
      border: 1px solid #ebeef5;
    }
    .attachment div{
      text-align: center;
      color: #999999;
      height: 200px;
      line-height: 200px;
    }
    .img-box{
      height: 184px;background-color: #f9f9f9;
    }

</style>
