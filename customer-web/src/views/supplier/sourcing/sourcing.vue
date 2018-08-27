<template>
    <div class="SupplierSourcing">
      <div class="title">
       {{$i.supplier.supplierSourcing}}
      </div>
<!--        搜索条件-->
      <div style='marginTop:20px;'>
        <el-form ref="params" :model="params" label-width="200px" size="mini">
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8"
                    v-for='(v,index) in $db.supplier.overview'
                    :key="index+'j'">
              <el-form-item class="speWidth" :prop="v.key"  :label="v.label + ':' ">
                <div v-if="v.type==='input'">
                  <el-input
                    size="mini"
                    :placeholder="$i.common.inputkeyWordToSearch"
                    v-model="params[v.key]">
                  </el-input>
                </div>
                <div v-if="v.type==='select'">
                  {{params[v.country]}}
                  <el-select class="speWidth" v-model="params[v.key]" :placeholder="$i.common.inputSearch">
                    <el-option
                      size="mini"
                      v-for="item in options[v.key]"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="btn-group">
        <el-button @click="search" type="primary" class="search" >{{$i.common.search}}</el-button>
        <el-button @click="clear('params')">{{$i.common.clear}}</el-button>
      </div>

<!--        表格-->
       <v-table
              code="udata_pruchase_supplier_overview"
              :height=500
              :loading='loading'
              :data="tabData"
              :buttons="[{label: $i.common.detail, type: 1}]"
              @action="detail"
              @change-checked='checked'
              @filter-value="tableFilterValue"
              @change-sort="sort">
         <template slot="header">
           <div v-show='isButton'>
             <div class="btnline" v-authorize="'SUPPLIER:OVERVIEW:READ_ONLY'">
               <el-button v-authorize="'SUPPLIER:OVERVIEW:CREATE_INQUIRY'"
                          @click='createInquiry'>
                      {{$i.common.creatInquiry}}({{selectNumber.length}})</el-button>
               <el-button v-authorize="'SUPPLIER:OVERVIEW:CREATE_ORDER'"
                          @click='createOrder' :class="(selectedData.length>1)?'disabledBtn':'' ">
                      {{$i.common.creatOrder}}({{selectNumber.length}})</el-button>
               <el-button v-authorize="'SUPPLIER:OVERVIEW:COMPARE'"
                          @click='compare' :disabled='!(selectedData.length>1) || (selectedData.length>=100)'>
                      {{$i.common.compare}}({{selectNumber.length}})</el-button>
               <el-button v-authorize="'SUPPLIER:OVERVIEW:ADD_BOOKMARK'"
                          @click='addToBookmark' :disabled='!(selectedData.length)>0'>
                      {{$i.common.addToBookmark}}({{selectNumber.length}})</el-button>
               <el-button @click="download"
                          v-authorize="'SUPPLIER:OVERVIEW:DOWNLOAD'"
                          :disabled="!(tabData.length)>0">
                      {{$i.common.download}}
                      ({{selectNumber.length===0?$i.common.all:selectNumber.length}})</el-button>
             </div>
           </div>
         </template>
       </v-table>
      <page
        :page-data="pageData"
        @change="handleSizeChange"
        @size-change="pageSizeChange"
        :page-sizes="[50,100,200,500]"></page>
      <div v-show='!isButton'  style='display:flex; justify-content: center'>
          <el-button  type="primary"  @click='emitData'>{{$i.common.ok}}</el-button>
          <el-button @click="cancelData">{{$i.common.cancel}}</el-button>
      </div>

    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import {
        dropDownSingle
    } from '@/components/index'
    import {
        VTable,
        VPagination
    } from '@/components/index';
    export default {
        name: "SupplierSourcing",
        components: {
            dropDown: dropDownSingle,
            VTable,
            page:VPagination
        },
        props: {
            isButton: {
                type: Boolean,
                default: true
            },
            disabledLine: {
                type: Array,
                default: function() {
                    return []
                }
            },
        },
        data() {
            return {
                value: 1,
                hideBody: true, //是否显示body
                btnInfo: 'Show the Advance',
                loading: false,
                pageTotal: "",
                params: {
                    // description: "",
                    name: '',
                    pn: 1,
                    ps: 50,
                    // skuCode: "",
                    skuNameEn: "",
                    type:'',
                    supplierAbbr:'',
                    supplierCode:'',
                    operatorFilters:[],
                    sorts:[],
                    recycle: false,
                },
                tabData: [],
                selectedData: [],
                selectNumber: [],
                countryOption:[],
                options:[],
                pageData:{},
                //Category下拉组件数据
                dropData: [],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
            }
        },
        methods: {
             ...mapActions([
               'setMenuLink'
            ]),
            handleSizeChange(val) {
              this.params.pn = val;
              this.getData();
            },
            pageSizeChange(val) {
              this.params.ps = val;
              this.getData();
            },
            //切换body的收缩展开状态
            switchDisplay() {
                this.hideBody = !this.hideBody;
            },

            //清除填写的表格数据
            clear(name) {
                this.$refs[name].resetFields();
            },
            //当作为主键时
            emitData() {
                this.$emit('handleOkClick', this.selectedData)
            },
            //搜查
            search() {
                this.getData();
                this.selectNumber = [];
                this.selectedData = [];
            },
            //....跳入createInquiry
            createInquiry() {
              if(this.selectedData.length===0){
                this.$windowOpen({
                  url:'/negotiation/createInquiry',
                })
              }else{
                let companyId = '';
                this.selectedData.forEach((v,k)=>{
                  let item = _.findWhere(v, {
                    key: 'companyId'
                  });
                  if (k === this.selectedData.length - 1) {
                    companyId += item.value;
                  } else {
                    companyId += (item.value + ',');
                  }
                })
                this.$windowOpen({
                  url: '/negotiation/createInquiry',
                  params: {
                    supplierCompanies: companyId
                  }
                });
              }
            },
            //....跳入createOrder
            createOrder() {
              if(this.selectedData.length===0){
                this.$windowOpen({
                  url:'/order/create',
                })
              }else if (this.selectedData.length===1){
                this.$windowOpen({
                  url: '/order/create',
                  params: {
                    supplierCode: this.selectedData[0].code.value
                  }
                });
              }else{
                this.$message({
                  message: this.$i.common.supplierSearch,
                  type: 'warning',
                });
                return false;
              }
            },
            //........compare
            compare() {
              // if(this.selectList.length>100){
              //   return this.$message({
              //     message: this.$i.product.compareRecordMustLessThan100,
              //     type: 'success'
              //   });
              // }
                let id = '';
                this.selectedData.forEach((v, k) => {
                    let item = _.findWhere(v, {
                        key: 'id'
                    });
                    if (k === this.selectedData.length - 1) {
                        id += item.value;
                    } else {
                        id += (item.value + ',');
                    }
                });
                this.$windowOpen({
                    url: '/supplier/compareDetail/new',
                    params: {
                        id: id,
                    }
                });
            },
            //...........进入detail
            detail(item) {
              if (item.bookmarkId.value){
                this.$windowOpen({
                  url: '/supplier/bookmarkDetail',
                  params: {
                    companyId: item.companyId.value,
                    id: item.id.value
                  }

                });
              }else{
                this.$windowOpen({
                  url: '/supplier/sourcingDetail',
                  params: {
                    companyId: item.companyId.value,
                    id: item.id.value
                  }
                });
              }
            },
            //.........checked
            checked(item) {
                this.selectedData = item
                let number = []
                this.selectedData.forEach(item => {
                    number.push(item.id.value);
                });
                this.selectNumber = number
            },
          //...............sort
          sort(item){
               this.params.sorts =  item.sorts;
               this.getData();
          },
          //获取字典
          getCodePart(){
            this.$ajax.post(this.$apis.POST_CODE_PART,["SR_TYPE","ITM"]).then(res=>{
              this.options.type = _.findWhere(res, {'code': 'SR_TYPE'}).codes;
              this.options.incoterm = _.findWhere(res, {'code': 'ITM'}).codes;
            }).catch(err=>{
              console.log(err)
            });
          },
          //获取国家
          getCountryAll(){
            this.$ajax.get(this.$apis.GET_COUNTRY_ALL).then(res=>{
              this.countryOption = res
              this.getData();
            }).catch(err=>{
              console.log(err)
            });
          },
          //.....拿数据
          getData() {
              this.loading = true
              this.$ajax.post(this.$apis.get_listSupplier, this.params)
                  .then(res => {
                      this.pageData=res;
                      this.loading = false;
                      this.tabData = this.$getDB(this.$db.supplier.overviewtable, res.datas,e=>{
                        e.country.value=this.$change(this.countryOption,'country',e,true).name;
                        e.type.value=this.$change(this.options.type,'type',e,true).name;
                        e.incoterm.value=this.$change(this.options.incoterm,'incoterm',e,true).name;
                        if (e.exportLicense.value){
                          e.exportLicense._value = this.$i.supplier.exportLicenseYes
                        }else{
                          e.exportLicense._value = this.$i.supplier.exportLicenseNo
                        }
                        return e;
                      })
                      if (this.disabledLine.length > 0) {
                        this.disabledLine.forEach(v => {
                          let id = _.findWhere(v, {
                            key: 'supplierId'
                          }).value;
                          this.tabData.forEach(m => {
                            let newId = _.findWhere(m, {
                              key: 'id'
                            }).value;
                            if (id === newId) {
                              m._disabled = true;
                              m._checked = true;
                            }
                          })
                        })
                      }
                      this.selectedData = this.$copyArr(this.disabledLine);
                      this.selectedData.forEach(v => {
                        v._disabled = true;
                      });
                  })
                  .catch((res) => {
                      this.loading = false
                  });
            },
            //...........addToBookmark
            addToBookmark() {
                this.$ajax.post(this.$apis.post_supplier_addbookmark, this.selectNumber)
                  .then(res => {
                    this.$message({
                      message: this.$i.common.addSuccess,
                      type: 'success',
                    });
                  })
                  .catch((res) => {
                      console.log(res)
                  });
            },
            getCategoryId() {
                // this.$ajax.get(this.$apis.getCategory, {}).then(res => {
                //     this.dropData = res;
                // }).catch(err => {
                //     console.log(err)
                // });
            },
            cancelData(){
              this.$emit('handleCancel');
            },
            tableFilterValue(val){
              let {operatorFilters,sorts}=val;
              this.params.operatorFilters=operatorFilters||[];
              this.params.sorts=sorts||[];
              this.getData();
            },
            download(){
              let ids=_.pluck(_.pluck(this.selectedData,"id"),'value');
              if(ids.length>0){
                this.$fetch.export_task('UDATA_PURCHASE_EXPORT_SUPPLIER_IDS',{ids:ids});
              }else{
                let params=this.$depthClone(this.params);
                this.$fetch.export_task('UDATA_PURCHASE_EXPORT_SUPPLIER_PARAMS',params);
              }

            },
        },
        created() {
            this.getCodePart();
            this.getCountryAll();
        },
        mounted(){
          this.setMenuLink({
            path: '',
            query: {code: 'PRUCHASE_SUPPLIER'},
            type: 100,
            label: this.$i.common.log,
            auth:'SUPPLIER:LOG'
          });
        },
        watch: {
          disabledLine(n) {
            if (n.length > 0) {
              n.forEach(v => {
                let id;
                id = _.findWhere(v, {key: 'id'}).value;
                this.tabData.forEach(m => {
                  let newId = _.findWhere(m, {key: 'id'}).value;
                  if (id === newId) {
                    this.$set(m, '_disabled', true);
                    this.$set(m, '_checked', true);
                  }
                })
              })
            }
          },

        }
    }

</script>

<style scoped>
    .SupplierSourcing {
        padding-right: 20px;
    }

    .title {
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color: #666666;

    }

    .title-btn {
        float: right;item
        margin-right: 5px;
    }

    .title-btn>>>span {
        color: #118ee9;
    }

    .body {
        /*        margin-top: 10px;*/
        overflow: hidden;
        max-height: 1400px;
        display: block;
        transition: max-height .5s cubic-bezier(.445, .05, .55, .95);
    }

    .hide {
        max-height: 0;

    }

    /*.show{*/

    /*height: auto;*/

    /*}*/

    .form-list {
        margin-bottom: 10px;
    }

    .el-input {
        /*        width:200px;*/
    }

    .btn-group {
        text-align: center;
        margin-top: 10px;
    }

    .btn-group .search {
        margin-right: 30px;
    }

    .btnline {
        margin-top: 20px;
        width: 100%;
    }

    .btnline .el-button {
        /*margin-right: 8px;*/
        /*margin-top: 20px;*/
    }

    .el-select {
        max-width: 200px
    }

    .el-input {
        max-width: 200px;
    }

    .speDropdown {
        max-width: 200px;
        height: 30px;
    }

    /*
    .vtable {
        margin-top: 20px;
    }
*/
  .disabledBtn{
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
  }

</style>
