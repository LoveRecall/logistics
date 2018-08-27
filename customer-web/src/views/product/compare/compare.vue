<template>
    <div class="compare-overview">
        <div class="title">
            <span>{{$i.product.compareDetail}}</span>
        </div>
        <div class="name">
            <span>{{$i.product.compareName}}</span>
            <el-input
                    :disabled="$route.params.type==='modify' && !isModify"
                    size="mini"
                    class="compare-name"
                    placeholder="please input"
                    v-model="compareName">
            </el-input>
        </div>
        <div class="btns" v-show="hasLoading">
            <span v-if="$route.params.type==='new'">
                <el-button
                        v-authorize="'PRODUCT:COMPARE_DETAIL:CREATE_INQUIRY'"
                        @click="createInquiry">{{$i.product.createInquiry}}({{selectList.length}})</el-button>
                <el-button
                        v-authorize="'PRODUCT:COMPARE_DETAIL:CREATE_ORDER'"
                        @click="createOrder">{{$i.product.createOrder}}({{selectList.length}})</el-button>
                <el-button
                        @click="addNewProduct" :disabled="tableDataList.length>=100">{{$i.product.addNew}}</el-button>
                <el-button
                        @click="deleteProduct" :disabled="disableDelete" type="danger">{{$i.product.deleteProduct}}</el-button>
            </span>
            <span v-if="$route.params.type==='modify'">
                <el-button
                        v-if="!isModify"
                        v-authorize="'PRODUCT:COMPARE_DETAIL:CREATE_INQUIRY'"
                        @click="createInquiry">{{$i.product.createInquiry}}({{selectList.length}})</el-button>
                <el-button
                        v-if="!isModify"
                        @click="createOrder"
                        v-authorize="'PRODUCT:COMPARE_DETAIL:CREATE_ORDER'">{{$i.product.createOrder}}({{selectList.length}})</el-button>
                <el-button
                        v-if="!isModify"
                        v-authorize="'PRODUCT:COMPARE_DETAIL:DOWNLOAD'"
                        @click="download">{{$i.product.download}}</el-button>
                <el-button
                        v-if="!isModify"
                        v-authorize="'PRODUCT:COMPARE_DETAIL:MODIFY'"
                        @click="modifyCompare">{{$i.product.modify}}</el-button>
                <el-button
                        v-if="isModify"
                        @click="addNewProduct"
                        :disabled="tableDataList.length>=100">{{$i.product.addNew}}</el-button>
                <el-button
                        v-if="isModify"
                        @click="deleteProduct"
                        :disabled="disableDelete" type="danger">{{$i.product.deleteProduct}}</el-button>
            </span>
            <el-checkbox @change="changeStatus" v-model="isHideTheSame">{{$i.product.hideTheSame}}</el-checkbox>
            <el-checkbox @change="changeStatus" v-model="isHighlight">{{$i.product.highlightTheDifferent}}</el-checkbox>
        </div>
        <v-table
                ref="table"
                native-sort="id"
                @change-sort="$refs.table.setSort(tableDataList)"
                code="udata_purchase_sku_compare_list_detail"
                :height="500"
                v-loading="loadingTable"
                :data="tableDataList"
                :buttons="setButton"
                @action="btnClick"
                @change-checked="changeChecked"></v-table>
        <div class="footBtn">
            <div v-if="$route.params.type==='new'">
                <el-button @click="saveCompare" :loading="disabledSaveCompare" type="primary">{{$i.product.saveTheCompare}}</el-button>
            </div>
            <div v-if="$route.params.type==='modify'">
                <div v-if="isModify">
                    <el-button
                            @click="saveModify"
                            :loading="disableClickSaveModify"
                            :disabled="allowBottomClick"
                            type="primary">{{$i.product.save}}</el-button>
                    <el-button :disabled="allowBottomClick" :loading="disableClickCancel" @click="cancelModify">{{$i.product.cancel}}</el-button>
                </div>
                <div v-else>
                    <el-button
                            v-authorize="'PRODUCT:COMPARE_DETAIL:ARCHIVE'"
                            @click="deleteCompare"
                            type="danger">{{$i.product.delete}}</el-button>
                </div>
            </div>
        </div>

        <el-dialog :title="$i.product.addProduct" :visible.sync="addProductDialogVisible" width="80%">
            <el-tabs v-model="addProductTabName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="$i.product.addFromProduct" name="product">
                    <v-product
                            ref="addProduct"
                            queryType="product"
                            :form-column="$db.product.overview"
                            :disabledLine="disableProductLine"
                            @sure="handleOkClick"
                            @cancel="handleCancel"></v-product>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.addFromBookmark" name="bookmark">
                    <v-product
                            ref="addBookmark"
                            queryType="bookmark"
                            :form-column="$db.product.overview"
                            :disabledLine="disableProductLine"
                            @sure="handleOkClick"
                            @cancel="handleCancel"></v-product>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <el-dialog :title="$i.product.followingProductCantAddOrder" :visible.sync="dialogFormVisible" width="50%">
            <el-table
                    :data="disabledOrderList"
                    border
                    style="width: 100%">
                <el-table-column
                        label="#"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$i.product.skuNameEn"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.row.nameEn.value}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$i.product.skuCode">
                    <template slot-scope="scope">
                        {{scope.row.code.value}}
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisible = false">{{$i.product.sure}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import {
        VTable,
        VProduct
    } from "@/components/index";

    import { mapActions } from 'vuex'

    let copySameData,copyLightData;


    export default {
        name: "compare",
        components:{
            VTable,
            VProduct
        },
        data(){
            return{
                forceUpdateNumber:1,
                compareName:'',         //对比的名称
                screenTableStatus:[],   //表格筛选状态
                tableDataList:[],       //表格数据展示
                addProductTitle:'哇哈哈',
                totalDataList:[],       //因为要分页，所以先取一个全部数据
                disabledLine:[],        //在弹出框中默认置灰不能操作的条目
                selectList:[],          //保存选择的数剧
                disabledOrderList:[],   //不能添加到order的数据
                isModify:false,         //是否处于编辑状态，默认为false
                hasLoading:false,       //加载完成才让按钮显示出来
                //弹出框显示状态
                addProductDialogVisible:false,
                dialogFormVisible:false,
                addProductTabName:'1',
                loadingTable:false,
                //btns状态
                disabledSaveCompare:false,
                disableDelete:true,            //是否禁止删除
                allowDeleteCompare:true,      //是否可以点击delete，在数据还没加载完的时候不能点击
                allowBottomClick:true,          //是否禁止点击底部操作按钮
                disableClickCancel:false,
                disableClickSaveModify:false,
                isChangeData:false,             //是否在最原始的基础上modify过数据
                isHideTheSame:false,
                isHighlight:true,
                initialData:[],
                categoryList:[],
                disableProductLine:[],

                /**
                 * 字典配置
                 * */
                statusOption:[],
                weightOption:[],
                dateOption:[],
                volumeOption:[],
                lengthOption:[],
                skuUnitOption:[],
            }
        },
        methods:{
            ...mapActions(['setMenuLink']),
            getList() {
                if(this.$route.params.type==='new'){
                    //表示是新建detail还未保存
                    let id=[];
                    this.$route.query.id.split(',').forEach(v=>{
                        id.push(v);
                    });
                    let time=new Date();
                    this.compareName=this.$dateFormat(time,'yyyymmdd')+Date.parse(time);
                    this.$ajax.post(this.$apis.get_skuListByIds,id).then(res=>{
                        this.tableDataList = this.$getDB(this.$db.product.indexTable, res,(e)=>{
                            e.status._value=(_.findWhere(this.statusOption,{code:String(e.status.value)}) || {}).name;
                            e.unit._value=(_.findWhere(this.skuUnitOption,{code:String(e.unit.value)}) || {}).name;
                            e.expireUnit._value = (_.findWhere(this.dateOption,{code:String(e.expireUnit.value)}) || {}).name;
                            e.unitLength._value = (_.findWhere(this.lengthOption,{code:String(e.unitLength.value)}) || {}).name;
                            e.unitVolume._value = (_.findWhere(this.volumeOption,{code:String(e.unitVolume.value)}) || {}).name;
                            e.unitWeight._value = (_.findWhere(this.weightOption,{code:String(e.unitWeight.value)}) || {}).name;
                            e.yearListed.value=e.yearListed.value?this.$dateFormat(e.yearListed.value,'yyyy-mm'):'';
                            return e;
                        });
                        this.initialData=this.$depthClone(this.tableDataList);
                        this.changeStatus();
                        this.hasLoading=true;
                        this.disabledLine=this.tableDataList;
                    }).finally(()=>{
                        this.loadingTable=false;
                    });
                }
                else if(this.$route.params.type==='modify'){
                    //表示这里已经生成对应的compare单，直接获取该单数据即可
                    this.compareName=this.$route.query.compareName;
                    if(this.$route.query.isModify){
                        this.isModify=true;
                    }
                    let params={
                        id: this.$route.query.compareId,
                        pn:1,
                        ps:100
                    };
                    this.loadingTable=true;
                    this.$ajax.post(this.$apis.get_buyerProductCompareDetail,params).then(res=>{
                        this.tableDataList = this.$getDB(this.$db.product.indexTable, res.datas,(e)=>{
                            e.status._value=(_.findWhere(this.statusOption,{code:String(e.status.value)}) || {}).name;
                            e.unit._value=(_.findWhere(this.skuUnitOption,{code:String(e.unit.value)}) || {}).name;
                            e.expireUnit._value = (_.findWhere(this.dateOption,{code:String(e.expireUnit.value)}) || {}).name;
                            e.unitLength._value = (_.findWhere(this.lengthOption,{code:String(e.unitLength.value)}) || {}).name;
                            e.unitVolume._value = (_.findWhere(this.volumeOption,{code:String(e.unitVolume.value)}) || {}).name;
                            e.unitWeight._value = (_.findWhere(this.weightOption,{code:String(e.unitWeight.value)}) || {}).name;
                            e.yearListed.value=this.$dateFormat(e.yearListed.value,'yyyy-mm');
                            return e;
                        });
                        this.initialData=this.$depthClone(this.tableDataList);
                        this.changeStatus();
                        this.hasLoading=true;
                        this.disabledLine=this.tableDataList;
                        this.allowDeleteCompare=false;
                        this.allowBottomClick=false;
                    }).finally(()=>{
                        this.loadingTable=false;
                    });
                }
            },
            setButton(e){
                let button;
                if(e.bookmarkId.value){
                    button=[{label: 'Detail', type: 1,auth:'PRODUCT:BOOKMARK_DETAIL'}];
                }else{
                    button=[{label: 'Detail', type: 1,auth:'PRODUCT:DETAIL'}];
                }
                return button;
            },
            btnClick(e){
                let id;
                if(this.$route.params.type==='new'){
                    id=e.id.value;
                }else if(this.$route.params.type==='modify'){
                    id=e.skuId.value;
                }
                if(e.bookmarkId.value){
                    //跳bookmark detail
                    this.$windowOpen({
                        url:'/product/bookmarkDetail',
                        params:{
                            id:id,
                            bookmarkId:e.bookmarkId.value
                        }
                    })
                }else{
                    //跳product detail
                    this.$windowOpen({
                        url:'/product/sourcingDetail',
                        params:{
                            id:id
                        }
                    })
                }
            },
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
            changeChecked(e){
                this.selectList=e;
            },
            modifyCompare(){
                this.isModify=true;
            },
            cancelModify(){
                this.isModify=false;
                this.getList();
            },
            createInquiry(){
                if(this.selectList.length===0){
                    this.$windowOpen({
                        url:'/negotiation/createInquiry',
                    })
                }else{
                    let skus='',codes=[],supplierCodes='';
                    console.log(this.selectList,'this.selectList')
                    _.map(this.selectList,v=>{
                        if(v.id.value){
                            if(this.$route.params.type==='modify'){
                                skus+=(v.skuId.value+',');
                            }else if(this.$route.params.type==='new'){
                                skus+=(v.id.value+',');
                            }
                        }
                        if(v.supplierCode.value){
                            codes.push(v.supplierCode.value)
                        }
                    });
                    skus=skus.slice(0,skus.length-1);
                    _.map(_.uniq(codes),v=>{
                        supplierCodes+=(v+',');
                    });
                    supplierCodes=supplierCodes.slice(0,supplierCodes.length-1);
                    this.$windowOpen({
                        url:'/negotiation/createInquiry',
                        params:{
                            skus:skus,
                            supplierCodes:supplierCodes
                        }
                    })
                }
            },
            createOrder(){
                this.disabledOrderList=[];
                _.map(this.selectList,v=>{
                    if(v.customerCreate.value){
                        this.disabledOrderList.push(v);
                    }
                });
                if(this.disabledOrderList.length>0){
                    this.dialogFormVisible=true;
                }else{
                    if(this.selectList.length===0){
                        this.$windowOpen({
                            url:'/order/create',
                        })
                    }else{
                        let supplierList=[];
                        _.map(this.selectList,v=>{
                            supplierList.push(v.supplierCode.value);
                        });
                        if(_.uniq(supplierList).length>1){
                            return this.$message({
                                message: this.$i.product.notAddDifferentSupplierProduct,
                                type: 'warning'
                            });
                        }
                        let ids='';
                        this.selectList.forEach(v=>{
                            ids+=(v.skuId.value+',');
                        });
                        this.$windowOpen({
                            url:'/order/create',
                            params:{
                                type:'product',
                                ids:ids,
                                supplierCode:this.selectList[0].supplierCode.value
                            },
                        })
                    }
                }
            },
            download(){
                this.$fetch.export_task('SKU_PURCHASE_EXPORT_COMPARE_IDS',{ids:[this.$route.query.compareId]});
            },
            addNewProduct(){
                this.disableProductLine = [];
                if (this.tableDataList.length > 0) {
                    _.map(this.tableDataList, v => {
                        this.disableProductLine.push(v.skuId.value);
                    });
                }
                this.addProductDialogVisible=true;
                this.addProductTabName = "product";
                this.$nextTick(() => {
                    if (this.$refs.addProduct) {
                        this.$refs.addProduct.getData();
                    }
                    if (this.$refs.addBookmark) {
                        this.$refs.addBookmark.getData();
                    }
                });
            },
            deleteProduct(){
                this.$confirm(this.$i.product.sureDelete, this.$i.product.prompt, {
                    confirmButtonText: this.$i.product.sure,
                    cancelButtonText: this.$i.product.cancel,
                    type: 'warning'
                }).then(() => {
                    let ids=_.uniq(_.pluck(_.pluck(this.selectList, 'id'), 'value'));
                    let arr=[],initalData=[];
                    _.map(this.tableDataList,v=>{
                        _.map(ids,m=>{
                            if(v.id.value===m){
                                arr.push(v);
                            }
                        });
                    });
                    _.map(this.initialData,v=>{
                        _.map(ids,m=>{
                            if(v.id.value===m){
                                initalData.push(v);
                            }
                        });
                    })
                    this.tableDataList=_.difference(this.tableDataList, arr);
                    this.initialData=_.difference(this.initialData, initalData);

                    this.$message({
                        type: 'success',
                        message: this.$i.product.deleteSuccess
                    });
                    this.$nextTick(()=>{
                        this.disableDelete=true;
                        this.disabledLine=[];
                        this.selectList=[];
                        this.tableDataList.forEach(v=>{
                            if(!v._disabled){
                                this.disabledLine.push(v);
                            }
                        });
                    });
                }).catch(() => {

                });
            },
            handleOkClick(e, type){
                //如果总条数>100，则进行提示
                let totalLen=0;
                this.tableDataList.forEach(v=>{
                    if(!v._disabled){
                        totalLen++;
                    }
                });
                if(totalLen+e.length>100){
                    return this.$message({
                        message: this.$i.product.compareRecordMustLessThan100,
                        type: 'warning'
                    });
                }
                else{
                    //现在跑出来的东西只是一个productId数组
                    if(this.$route.params.type==='new'){
                        //在新建状态的情况下，直接拿id重新请求获取表格数据
                        let ids = _.pluck(_.pluck(e, type === "product" ? "id" : "skuId"), "value");
                        if(!ids.length){return this.addProductDialogVisible=false}
                        this.loadingTable=true;
                        this.$ajax.post(this.$apis.get_skuListByIds,id).then(res=>{
                            this.tableDataList = this.$getDB(this.$db.product.indexTable, res,(e)=>{
                                e.status._value=_.findWhere(this.statusOption,{code:String(e.status.value)}).name;
                                e.unit._value=e.unit.value?_.findWhere(this.skuUnitOption,{code:String(e.unit.value)}).name:'';
                                e.expireUnit._value = e.expireUnit.value?_.findWhere(this.dateOption,{code:String(e.expireUnit.value)}).name:'';
                                e.unitLength._value = e.unitLength.value?_.findWhere(this.lengthOption,{code:String(e.unitLength.value)}).name:'';
                                e.unitVolume._value = e.unitVolume.value?_.findWhere(this.volumeOption,{code:String(e.unitVolume.value)}).name:'';
                                e.unitWeight._value = e.unitWeight.value?_.findWhere(this.weightOption,{code:String(e.unitWeight.value)}).name:'';
                                e.yearListed.value=this.$dateFormat(e.yearListed.value,'yyyy-mm');
                                return e;
                            });
                            this.initialData=this.$depthClone(this.tableDataList);
                            this.changeStatus();
                            this.hasLoading=true;
                            this.disabledLine=this.tableDataList;
                            this.loadingTable=false;
                        }).catch(err=>{
                            this.loadingTable=false;
                        });
                    }
                    else if(this.$route.params.type==='modify'){
                        //modify状态下，要把拿出来的数据先进行对比，对比之后没有的再请求接口塞进去
                        //如果丢出来的数据的id有table里面产品的id，则把这个id对于的商品从置灰还原

                        let ids = _.pluck(_.pluck(e, type === "product" ? "id" : "skuId"), "value");
                        if(!ids.length){return this.addProductDialogVisible=false}
                        this.loadingTable=true;
                        this.$ajax.post(this.$apis.get_skuListByIds,ids).then(res=>{
                            this.$getDB(this.$db.product.indexTable, res,(e)=>{
                                e.status._value=(_.findWhere(this.statusOption,{code:String(e.status.value)}) || {}).name;
                                e.unit._value=(_.findWhere(this.skuUnitOption,{code:String(e.unit.value)}) || {}).name;
                                e.expireUnit._value = (_.findWhere(this.dateOption,{code:String(e.expireUnit.value)}) || {}).name;
                                e.unitLength._value = (_.findWhere(this.lengthOption,{code:String(e.unitLength.value)}) || {}).name;
                                e.unitVolume._value = (_.findWhere(this.volumeOption,{code:String(e.unitVolume.value)}) || {}).name;
                                e.unitWeight._value = (_.findWhere(this.weightOption,{code:String(e.unitWeight.value)}) || {}).name;
                                e.yearListed.value=this.$dateFormat(e.yearListed.value,'yyyy-mm');
                                e.skuId.value=e.id.value;       //把id的值给skuId
                                this.tableDataList.push(e);
                            });
                            this.initialData=this.$depthClone(this.tableDataList);
                            this.changeStatus();
                            this.hasLoading=true;
                            this.isChangeData=true;
                            // this.disabledLine=this.tableDataList;
                        }).finally(()=>{
                            this.loadingTable=false;
                        });
                    }
                }
                this.addProductDialogVisible=false;
            },
            handleCancel(){
                this.addProductDialogVisible=false;
            },
            saveCompare(){
                if(!this.compareName){
                    this.$message({
                        message: this.$i.product.pleaseInputCompareName,
                        type: 'warning'
                    });
                    return;
                }
                this.disabledSaveCompare=true;
                let params={
                    compares: [],
                    name: this.compareName
                };
                this.tableDataList.forEach(v=>{
                    let id,name;
                    if(v.speProduct){
                        if(_.findWhere(v,{key:'skuId'}).value){
                            id=_.findWhere(v,{key:'skuId'}).value;
                        }else{
                            id=_.findWhere(v,{key:'id'}).value;
                        }
                    }else{
                        id=_.findWhere(v,{key:'id'}).value;
                    }
                    name=_.findWhere(v,{key:'nameEn'}).value;
                    params.compares.push({
                        id:id,
                        name:name
                    });
                });
                this.$ajax.post(this.$apis.add_buyerProductCompare,params).then(res=>{
                    let compareId=res;
                    this.$router.push({
                        name:'productCompareDetail',
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
            deleteCompare(){
                this.$confirm(this.$i.product.sureDelete, this.$i.product.prompt, {
                    confirmButtonText: this.$i.product.sure,
                    cancelButtonText: this.$i.product.cancel,
                    type: 'warning'
                }).then(() => {
                    this.disabledSaveCompare=true;
                    this.$ajax.post(this.$apis.delete_buyerProductCompare,[{
                        id:this.$route.query.compareId,
                        name:this.compareName
                    }]).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.product.deleteSuccess
                        });
                        this.$router.push('/product/compare');
                    }).finally(()=>{
                        this.disabledSaveCompare=false;
                    });
                }).catch(() => {

                });
            },
            saveModify(){
                if(!this.compareName){
                    this.$message({
                        message: this.$i.product.pleaseInputCompareName,
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
                    if(!v._disabled){
                        let id='';
                        if(!this.isChangeData){
                            id=v.skuId.value;
                        }else{
                            id=v.id.value;
                        }
                        params.compares.push({
                            id:id,
                            name:v.nameEn.value
                        });
                    }
                });
                this.$ajax.post(this.$apis.update_buyerProductCompare,params).then(res=>{
                    this.$router.push({
                        name:'productCompareDetail',
                        params:{
                            type:'modify',
                        },
                        query:{
                            compareId:this.$route.query.compareId,
                            compareName:this.compareName,
                            forceChange:Math.random().toFixed(3)
                        }
                    });
                    this.disableClickSaveModify=false;
                }).catch(err=>{
                    this.disableClickSaveModify=false;
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
            handleCategory(data){
                _.map(data,item=>{
                    if(item.children.length===0){
                        this.categoryList.push(item);
                    }else{
                        this.handleCategory(item.children);
                    }
                });
            },
        },
        created(){
            this.loadingTable=true;
            const codeAjax=this.$ajax.post(this.$apis.get_partUnit,['SKU_SALE_STATUS','WT_UNIT','ED_UNIT','VE_UNIT','LH_UNIT','SKU_UNIT'],{cache:true});
            const countryAjax=this.$ajax.get(this.$apis.get_country,{},{cache:true});
            const sysCategoryAjax=this.$ajax.get(this.$apis.get_buyer_sys_category,{});
            const myCategoryAjax=this.$ajax.get(this.$apis.get_buyer_my_category,{});
            this.$ajax.all([codeAjax,countryAjax,sysCategoryAjax,myCategoryAjax]).then(res=>{
                res[0].forEach(v=>{
                    if(v.code==='SKU_SALE_STATUS'){
                        this.statusOption=v.codes;
                    }else if(v.code==='WT_UNIT'){
                        this.weightOption=v.codes;
                    }else if(v.code==='ED_UNIT'){
                        this.dateOption=v.codes;
                    }else if(v.code==='VE_UNIT'){
                        this.volumeOption=v.codes;
                    }else if(v.code==='LH_UNIT'){
                        this.lengthOption=v.codes;
                    }else if(v.code==='SKU_UNIT'){
                        this.skuUnitOption=v.codes;
                    }
                });
                this.countryOption=res[1];
                // _.map(res[2],v=>{
                //     _.map(v.children,data=>{
                //         this.categoryList.push(data);
                //     })
                // });
                this.handleCategory(res[3]);
                this.getList();
            }).catch(()=>{

            })
        },
        mounted(){
            this.setMenuLink({
                path: '/logs/index',
                query: {code: 'PURCHASE_SKU'},
                type: 10,
                auth:'PRODUCT:LOG',
                label: this.$i.common.log
            });
            this.setMenuLink({
                path: '/product/compareArchive',
                type: 20,
                auth:'PRODUCT:COMPARE_ARCHIVE',
                label: this.$i.common.archive
            });
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
            }
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

</style>
