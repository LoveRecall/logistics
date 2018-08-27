<template>
    <div class="compare-overview">
        <div class="title">
            <span>{{$i.product.compareDetail}}</span>
        </div>
        <div class="name">
            <span>{{$i.supplier.compareName}}</span>
            <el-input
              :disabled="$route.params.type==='modify' && !isModify"
              size="mini"
              class="compare-name"
              placeholder="please input"
              v-model="compareName"
              clearable>
            </el-input>
        </div>

        <v-table
          code="udata_pruchase_supplier_compare_detail_overview"
          :loading="loading"
          :data="tableDataList"
          :buttons="[{label: $i.common.detail, type: 1}]"
          @action="btnClick"
          @change-checked="changeChecked"
          @change-sort="sort"
          @filter-value="tableFilterValue"
          :height="500">
          <template slot="header">
            <div class="btns" v-authorize="'SUPPLIER:COMPARE_DETAIL:READ_ONLY'">
                <span v-if="$route.params.type==='new'">
                    <el-button
                       v-authorize="'SUPPLIER:COMPARE_DETAIL:CREATE_INQUIRY'"
                       @click='createInquiry'>{{$i.product.createInquiry}}({{selectList.length}})</el-button>
                    <el-button
                      v-authorize="'SUPPLIER:COMPARE_DETAIL:CREATE_ORDER'"
                      @click="createOrder"
                      :class="(selectedData.length>1)?'disabledBtn':'' ">
                      {{$i.product.createOrder}}({{selectList.length}})</el-button>
                    <el-button
                      @click="addNewProduct">{{$i.product.addNew}}</el-button>
                    <el-button
                      :disabled="!selectList.length>0"
                      @click="deleteCompare"  type="danger">{{$i.common.archive}}</el-button>
                </span>
              <span v-if="$route.params.type==='modify'">
                 <el-button
                   v-if="!isModify"
                   v-authorize="'SUPPLIER:COMPARE_DETAIL:CREATE_INQUIRY'"
                   @click='createInquiry'>{{$i.product.createInquiry}}({{selectList.length}})</el-button>
                  <el-button
                    v-if="!isModify"
                    v-authorize="'SUPPLIER:COMPARE_DETAIL:CREATE_ORDER'"
                    @click="createOrder"
                    :class="(selectedData.length>1)?'disabledBtn':'' ">
                    {{$i.product.createOrder}}({{selectList.length}})</el-button>
                <el-button
                  v-if="!isModify"
                  @click="modifyCompare">{{$i.button.modify}}</el-button>
                  <el-button
                    v-if="isModify"
                    @click="addNewProduct">{{$i.product.addNew}}</el-button>
                  <el-button
                    v-if="isModify"
                    :disabled="!selectList.length>0"
                    @click="deleteCompare"  type="danger">{{$i.common.archive}}</el-button>
                  <el-button
                    v-if="!isModify"
                    v-authorize="'SUPPLIER:COMPARE_DETAIL:DOWNLOAD'"
                    @click="download"> {{$i.common.download}} </el-button>
              </span>
              <el-checkbox @change="changeStatus" v-model="isHideTheSame">{{$i.product.hideTheSame}}</el-checkbox>
              <el-checkbox @change="changeStatus" v-model="isHighlight">{{$i.product.highlightTheDifferent}}</el-checkbox>
            </div>
          </template>
        </v-table>

        <div class="footBtn">
            <div v-if="$route.params.type==='new'">
                <el-button
                  @click="saveCompare"
                  :loading="disabledSaveCompare"
                  type="primary"
                  v-authorize="'SUPPLIER:COMPARE_DETAIL:SAVE'">{{$i.product.saveTheCompare}}</el-button>
            </div>
            <div v-if="$route.params.type==='modify'">
              <div v-if="isModify">
                <el-button
                  :disabled="allowBottomClick"
                  :loading="disableClickSaveModify"
                  type="primary"
                  @click='saveModifyCompare'
                  v-authorize="'SUPPLIER:COMPARE_DETAIL:SAVE'">{{$i.common.save}}</el-button>
                <el-button
                  :disabled="allowBottomClick"
                  @click="cancelModify" >{{$i.common.cancel}}</el-button>
              </div>
              <div v-else>
                <el-button @click="deleteCompare" type="danger">{{$i.common.archive}}</el-button>
              </div>

            </div>
        </div>

        <el-dialog title="Add Supplier" :visible.sync="addProductDialogVisible" width="80%">
            <VSupplier
                :isButton=false
                :hideBtn="true"
                :disabledLine="disabledLine"
                @handleOkClick='handleOkClick'
                @handleCancel="handleCancel"
                >
            </VSupplier>
        </el-dialog>

        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {VTable} from '@/components/index'
    import product from '../../product/addProduct'
    import VSupplier from '../sourcing/sourcing'

    let copy_Data = [];
    export default {
        name: "compare",
        components:{
          VTable,
          product,
          VSupplier
        },
        data(){
            return{
                pageData:[],
                options:[],
                countryOption:[],
                forceUpdateNumber:1,
                compareName:'',         //对比的名称
                screenTableStatus:[],   //表格筛选状态
                tableDataList:[],       //表格数据展示
                addProductTitle:'',
                totalDataList:[],       //因为要分页，所以先取一个全部数据
                disabledLine:[],        //在弹出框中默认置灰不能操作的条目
                selectList:[],          //保存选择的数剧
                isModify:false,         //是否处于编辑状态，默认为false

                //弹出框显示状态
                addProductDialogVisible:false,
                dialogFormVisible:false,

                //btns状态
                disabledSaveCompare:false,
                disableDelete:true,            //是否禁止删除
                allowDeleteCompare:true,      //是否可以点击delete，在数据还没加载完的时候不能点击
                allowBottomClick:true,          //是否禁止点击底部操作按钮,
                isHideTheSame:false,
                isHighlight:true,
                loading:false,
                disableClickSaveModify:false,
                isChangeData:false,
                selectedData:[],
                selectNumber: [],
                initialData:[],
                params:{
                  id: this.$route.query.compareId,
                  name:'',
                  pn: 1,
                  ps: 50,
                  recycle: false,
                  operatorFilters:[],
                  sorts:[]
                },
            }
        },
        methods:{
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
                this.getList();
              }).catch(err=>{
                console.log(err)
              });
            },
            getList() {
                if(this.$route.params.type==='new'){
                    //表示是新建detail还未保存
                    this.loading = true;
                    let id=[];
                    this.$route.query.id.split(',').forEach(v=>{
                        id.push(Number(v));
                    });
                    let time=new Date();
                    this.compareName=this.$dateFormat(time,'yyyymmdd')+Date.parse(time);
                    this.$ajax.post(this.$apis.post_listSupplierByIds,id).then(
                        res=>{
                          this.loading = false;
                        this.tableDataList = this.$getDB(this.$db.supplier.compareDetail, res, e => {
                          let country;
                          country = _.findWhere(this.countryOption, {code: e.country.value}) || {};
                          e.country._value = country.name || '';
                          e.type.value=this.$change(this.options.type,'type',e,true).name;
                          e.incoterm.value=this.$change(this.options.incoterm,'incoterm',e,true).name;
                          return e;
                        });
                        // this.changeHighlight(true);
                        this.initialData=this.$depthClone(this.tableDataList);
                        this.changeStatus();
                        this.disabledLine=this.tableDataList;
                    }).catch(err=>{
                        this.loading = false;
                    })

                }else if(this.$route.params.type==='modify'){
                    //表示这里已经生成对应的compare单，直接获取该单数据即可
                    this.compareName=this.$route.query.compareName;
                    if(this.$route.query.isModify){
                      this.isModify=true;
                    }
                    this.loading = true;
                    this.$ajax.post(this.$apis.post_supplier_listCompareDetails,this.params).then(res=>{
                        this.loading = false;
                        this.tableDataList = this.$getDB(this.$db.supplier.compareDetail, res.datas,e=>{
                          let country;
                          country = _.findWhere(this.countryOption, {code: e.country.value}) || {};
                          e.country._value = country.name || '';
                          e.type.value=this.$change(this.options.type,'type',e,true).name;
                          e.incoterm.value=this.$change(this.options.incoterm,'incoterm',e,true).name;

                          return e;
                        });
                        // this.changeHighlight(true);
                        this.initialData=this.$depthClone(this.tableDataList);
                        this.changeStatus();
                        this.isChangeData=true;
                        this.disabledLine=this.tableDataList;
                        this.allowDeleteCompare=false;
                        this.allowBottomClick=false;
                    }).catch(err=>{
                      this.loading = false;
                    })

                }
            },

            btnClick(e){
                this.$windowOpen({
                    url:'/supplier/sourcingDetail',
                    params:{
                        companyId:e.companyId.value,
                        id:e.id.value
                    }
                })
            },

            changeChecked(item){
              this.selectList=item;

            },

            //编辑单子
            modifyCompare(){
                this.isModify=true;
            },

            //取消编辑
            cancelModify(){
              this.isModify=false;
              this.getList();
            },
            createInquiry() {
              if(this.selectList.length===0){
                this.$windowOpen({
                  url:'/negotiation/createInquiry',
                })
              }else{
                let companyId = '';
                this.selectList.forEach((v,k)=>{
                  let item = _.findWhere(v, {
                    key: 'companyId'
                  });
                  if (k === this.selectList.length - 1) {
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
                })
              }

            },
            //勾选的商品创建order
            createOrder(){
              console.log(this.selectList)
              if(this.selectList.length>1){
                this.$message({
                  message: this.$i.common.supplierSearch,
                  type: 'warning',
                });
                return false;
              }else{
                if(this.selectList.length===0){
                  this.$windowOpen({
                    url:'/order/create',
                  })
                }else{
                  this.$windowOpen({
                    url:'/order/create',
                    params:{
                      type:'supplier',
                      supplierCode:this.selectList[0].code.value
                    },
                  })
                }
              }
            },

            //新增
            addNewProduct(){
                this.addProductDialogVisible=true;
                this.forceUpdateNumber=Math.random();
                let v = [];
                // this.getList.forEach(v => x[v.id] = v);

            },

            handleOkClick(e){
                //如果总条数>100，则进行提示
                let totalLen=0;
                this.tableDataList.forEach(v=>{
                    if(!v._disabled){
                        totalLen++;
                    }
                });
                if(totalLen+e.length>100){
                    this.$message({
                        message: this.$i.common.noLength,
                        type: 'warning'
                    });
                }else{
                    e.forEach(v=>{
                        let id=_.findWhere(v,{key:'id'}).value;
                        let isIn=false;
                        this.tableDataList.forEach(m=>{
                          let newId=_.findWhere(m,{key:'id'}).value;
                          if(id===newId){
                              this.$set(m,'_disabled',false);
                              isIn=true;
                          }
                        });
                        if(!isIn){
                            if (!v._disabled) {
                              this.tableDataList.push(v);
                            }
                            this.initialData=this.$depthClone(this.tableDataList);
                            this.changeStatus();

                        }
                    });
                    this.disabledLine=[];
                    this.tableDataList.forEach(v=>{
                        if(!v._disabled){
                          this.disabledLine.push(v);
                        }
                    });

                }
                this.addProductDialogVisible=false;
            },

            handleCancel(){
                this.addProductDialogVisible=false;
            },

            //保存该compare list
            saveCompare(){
                if(!this.compareName){
                    this.$message({
                        message: this.$i.supplier.inputCompareName,
                        type: 'warning'
                    });
                    return;
                }
                let params={
                    compares: [],
                    name: this.compareName,
                    id: ''
                };
                this.tableDataList.forEach(v=>{
                    let id,name;
                    id=_.findWhere(v,{key:'id'}).value;
                    name=_.findWhere(v,{key:'name'}).value;
                    params.compares.push({
                        id:id,
                        name:name
                    });
                });
                this.disabledSaveCompare=true;
                this.$ajax.post(this.$apis.post_supplier_addCompare,params).then(res=>{
                  let compareId=res;

                  this.$router.push({
                    name:'supplierCompareDetail',
                    params:{
                      type:'modify'
                    },
                    query:{
                      compareId:compareId,
                      compareName:this.compareName
                    }
                  });
                  this.disabledSaveCompare=false;
                }).catch(err=>{
                  this.disabledSaveCompare=false;
                });
            },
              //保存修改的compare
            saveModifyCompare(){
              if(!this.compareName){
                this.$message({
                  message:this.$i.supplier.inputCompareName,
                  type: 'warning'
                });
                return;
              }
              this.disableClickSaveModify=true;
              let params={
                compares: [],
                id: this.$route.query.compareId,
                name: this.compareName
              };
              this.tableDataList.forEach(v=>{
                let id,name;
                if (!v._checked){
                  id=_.findWhere(v,{key:'supplierId'}).value;
                }else{
                  id=_.findWhere(v,{key:'id'}).value;
                }
                name=_.findWhere(v,{key:'name'}).value;
                params.compares.push({
                  id:id,
                  name:name
                });
              });
              this.$ajax.post(`${this.$apis.post_supplier_addCompare}/${this.$route.query.compareId}`,params).then(res=>{
                this.$router.push({
                  name:'supplierCompareDetail',
                  params:{
                    type:'modify'
                  },
                  query:{
                    compareId:res,
                    compareName:this.compareName,
                    forceChange:Math.random().toFixed(3)
                  }
                });
                this.disableClickSaveModify=false;
              }).catch(err=>{
                this.disableClickSaveModify=false;
              });
            },
            //删除该compare
            deleteCompare(){
              this.$confirm(this.$i.common.sureDeleteToCompare, this.$i.common.prompt, {
                  confirmButtonText: this.$i.common.confirm,
                  cancelButtonText: this.$i.common.cancel,
                  type: 'warning'
                }).then(() => {
                    this.disabledSaveCompare=true;
                    let id=[];
                    _.map(this.selectList,v=>{
                      id.push(
                        v.id.value
                      )
                    });
                    this.$ajax.post(this.$apis.post_supplier_deleteCompareDetails,id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.common.deleteTheSuccess
                        });
                        this.disabledSaveCompare=false;
                        this.getList();
                        // this.$router.push({
                        //     path:'/supplier/compare'
                        // });
                    }).catch(err=>{
                        this.disabledSaveCompare=false;
                    });
                }).catch(() => {

                });
            },

            handleClick(e){
                e.isActive=!e.isActive;
                this.keylist.forEach(v=>{
                    if(v.isActive){
                      this.selectList.push(v);
                    }
                });
            },
          tableFilterValue(val){
            let {operatorFilters,sorts}=val;
            this.params.operatorFilters=operatorFilters||[];
            this.params.sorts=sorts||[];
            this.getList();
          },
          //相同项隐藏
          // changeHideTheSame(e){
          //   if(e){
          //     this.copyHideSameData = this.$depthClone(this.tableDataList);
          //     this.$table.setHideSame(this.tableDataList);
          //   }else{
          //     this.tableDataList = this.$depthClone(this.copyHideSameData)
          //   }
          // },
          //不同项高亮
          // changeHighlight(e){
          //   if(e){
          //     this.copyHighlightData = this.$depthClone(this.tableDataList);
          //     this.$table.setHighlight(this.tableDataList)
          //   }else{
          //     this.tableDataList = this.$depthClone(this.copyHighlightData)
          //   }
          // },
          changeStatus(){
            let data=this.$depthClone(this.initialData);
            if(this.isHideTheSame){
              data = this.$table.setHideSame(data);
            }
            if(this.isHighlight){
              data = this.$table.setHighlight(data);
            }
            this.tableDataList=data;
          },
          //...............sort
          sort(item){
            this.params.sorts =  item.sorts;
            this.getList();
          },
          download(){
            let ids = this.$route.query.id;
            this.$fetch.export_task('UDATA_PURCHASE_EXPORT_SUPPLIER_COMPARE_IDS',{ids:ids});
          }
        },
        created(){
            this.getCodePart();
            this.getCountryAll();
        },
        watch:{
          selectList(n){
              let len=0;
              this.tableDataList.forEach(v=>{
                  if(!v._disabled){
                      len++;
                  }
              });

              if(n.length>0 && (len-n.length)>=2){
                  this.disableDelete=false;
              }else{
                 this.disableDelete=true;
              }
          },

        },
    }
</script>

<style scoped>
    .compare-overview{
    }
    .title{
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color:#666666;
    }
    .name{
        padding: 15px 0;
    }
    .name span{
        font-size: 14px;
    }
    .compare-name{
        display: inline-block;
        width: 250px;
        margin-left: 10px;
    }
    .compare-checkbox{
        display: inline-block;
    }
    .footBtn{
        margin-top: 10px;
        border-top: 1px solid #e0e0e0;
        height: 40px;
        line-height: 40px;
        background-color: #ffffff;
        position: sticky;
        left: 0;
        bottom: 0;
        width: 100%;
    }
    .disabledBtn{
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: #ebeef5;
    }

</style>
