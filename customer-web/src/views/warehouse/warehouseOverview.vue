<template>
    <div class="inbound-overview">
        <div class="title">
            <span>{{$i.warehouse.warehouseOverview}}</span>
            <select-search
                    :width="200"
                    style="float: right"
                    class="search"
                    @inputEnter="searchInbound"
                    v-model="searchId"
                    :options="searchOptions"></select-search>
        </div>
        <div class="body">
            <div class="head">
                <span>{{$i.warehouse.status}}</span>
                <el-radio-group class="radioGroup" @change="changeStatus" v-model="warehouseConfig.skuInventoryStatusDictCode" size="mini">
                    <el-radio-button label="">{{$i.warehouse.all}}</el-radio-button>
                    <el-radio-button v-for="v in warehouseStatusOption" :key="v.id" :label="v.code">{{v.name}}</el-radio-button>
                </el-radio-group>

            </div>
            <div class="section">
                <v-table
                        code="uwarehouse_overview"
                        :height="500"
                        :loading="loadingTable"
                        :data="tableDataList"
                        :buttons="[{label: $i.warehouse.detail, type: 1, auth: 'PRODUCT:DETAIL'}]"
                        @change-sort="val=>{getWarehouseData(val)}"
                        @change-checked="changeChecked"
                        @action="btnClick">
                    <template slot="header">
                        <div class="btns">
                            <el-button
                                    v-authorize="'WAREHOUSE:DOWNLOAD'"
                                    @click="download">{{$i.warehouse.download}}({{selectList.length?selectList.length:$i.warehouse.all}})</el-button>
                        </div>
                    </template>
                </v-table>
                <page
                        @size-change="changeSize"
                        @change="changePage"
                        :page-sizes="[50,100,200,500]"
                        :page-data="pageData"></page>
            </div>
        </div>
    </div>
</template>

<script>
    import VTable from '@/components/common/table/index'
    import selectSearch from '@/components/common/fnCompon/selectSearch'
    import {VPagination} from '@/components/index'
    import { mapActions } from 'vuex'

    export default {
        name: "warehouseOverview",
        components:{
            selectSearch,
            VTable,
            page:VPagination
        },
        data(){
            return{
                /**
                 * 分页配置
                 * */
                pageData:{},
                /**
                 * 页面基本配置
                 * */
                loadingTable:false,
                qcOrderStatus:'0',
                tableDataList:[],
                downloadBtnInfo:'All',
                selectList:[],
                warehouseStatusOption:[],
                skuUnitOption:[],
                warehouseConfig:{
                    inboundNo: "",
                    orderNo: "",
                    pn: 1,
                    ps: 50,
                    skuCode: "",
                    skuInventoryStatusDictCode: "",
                    sorts:[{orderBy:"updateDt",orderType:"desc"}]
                },
                searchId:1,
                searchOptions:[
                    {
                        label:this.$i.warehouse.orderNo,
                        id:1
                    },
                    {
                        label:this.$i.warehouse.skuCode,
                        id:2
                    },
                    {
                        label:this.$i.warehouse.inboundNo,
                        id:3
                    },
                ]
            }
        },
        methods:{
            ...mapActions(['setMenuLink']),
            changeStatus(){
                this.warehouseConfig.pn=1;
                this.getWarehouseData();
            },

            //获取表格数据
            getWarehouseData(e){
                this.loadingTable=true;
                if(e){
                    Object.assign(this.warehouseConfig,e);
                }
                this.selectList=[];
                this.$ajax.post(this.$apis.get_buyerWarehouseOverview,this.warehouseConfig).then(res=>{
                    this.tableDataList = this.$getDB(this.$db.warehouse.warehouseOverview, res.datas,e=>{
                        e.inboundDate.value=this.$dateFormat(e.inboundDate.value,'yyyy-mm-dd');
                        e.skuUnitDictCode._value=e.skuUnitDictCode.value?_.findWhere(this.skuUnitOption,{code:e.skuUnitDictCode.value}).name:'';
                    });
                    this.pageData=res;
                }).finally(err=>{
                    this.loadingTable=false;
                });
            },
            searchInbound(e){
                if(!e.id){
                    return this.$message({
                        message: this.$i.warehouse.pleaseChooseAType,
                        type: 'warning'
                    });
                }else{
                    if(e.id===1){
                        this.warehouseConfig.inboundNo='';
                        this.warehouseConfig.orderNo=e.value;
                        this.warehouseConfig.skuCode='';
                    }else if(e.id===2){
                        this.warehouseConfig.inboundNo='';
                        this.warehouseConfig.orderNo='';
                        this.warehouseConfig.skuCode=e.value;
                    }else if(e.id===3){
                        this.warehouseConfig.inboundNo=e.value;
                        this.warehouseConfig.orderNo='';
                        this.warehouseConfig.skuCode='';
                    }
                    this.getWarehouseData();
                }
            },
            btnClick(e){
                this.$windowOpen({
                    url:'/product/sourcingDetail',
                    params:{
                        id:e.skuId.value
                    }
                })
            },
            changeChecked(e){
                this.selectList=e;
            },
            download(){
                let ids=_.pluck(_.pluck(this.selectList,'id'),'value');
                let params=this.$depthClone(this.warehouseConfig);
                params.inboundSkuIds=ids;
                this.$fetch.export_task('WAREHOUES',params);
            },

            /**
             * 字典获取
             * */
            getUnit(){
                this.loadingTable=true;
                this.$ajax.post(this.$apis.get_partUnit,['SKU_INVENTORY_STATUS','SKU_UNIT'],{cache:true}).then(res=>{
                    res.forEach(v=>{
                        if(v.code==='SKU_INVENTORY_STATUS'){
                            this.warehouseStatusOption=v.codes;
                        }else if(v.code==='SKU_UNIT'){
                            this.skuUnitOption=v.codes;
                        }
                    });
                    this.getWarehouseData();

                }).catch(err=>{
                    this.loadingTable=false;
                });
            },

            /**
             * 分页操作
             * */
            changePage(e){
                this.warehouseConfig.pn=e;
                this.getWarehouseData();
            },
            changeSize(e){
                this.warehouseConfig.ps=e;
                this.getWarehouseData();
            }
        },
        created(){
            this.getUnit();
        },
        mounted(){
            this.setMenuLink({
                path: '/logs/index',
                query: {code: 'WAREHOUSE'},
                type: 10,
                auth:'WAREHOUSE:LOG',
                label: this.$i.common.log
            });
        },
        watch:{

        }
    }
</script>

<style scoped>
    .body{
        margin-top: 5px;
    }
    .title{
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color:#666666;
        margin-bottom: 5px;
    }

    .radioGroup{
        margin-left: 10px;
    }

    .head .search{
        float: right;
    }
    .section{
        margin-top: 10px;
    }
</style>
