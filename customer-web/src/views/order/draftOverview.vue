<template>
    <div class="orderOverview">
        <div class="title">
            {{$i.order.draftOverview}}
        </div>
        <div style="height: 28px;">
            <selectSearch
                    style="width: auto;float: right;"
                    :options=options
                    v-model='selectSearch'
                    @inputEnter="inputEnter">
            </selectSearch>
        </div>

        <!--form-->
        <v-table
                :code="tableCode"
                ref='vtable'
                :data="tabData"
                :buttons="[{label: 'Detail', type: 1,auth:'ORDER:OVERVIEW:CREATE'}]"
                @action="onAction"
                :loading='loading'
                :pageTotal='pageTotal'
                @change-checked='checked'
                @change-sort="val=>{getData(val)}"
                :height="500"
                style='marginTop:10px'>
            <template slot="header">
                <div>
                    <el-button
                            :loading="disableClickDelete"
                            type='danger'
                            :disabled='selectedList.length===0'
                            @click='deleteOrder'
                            v-authorize="'ORDER:DRAFT_OVERVIEW:ARCHIVE'">{{($i.order.archive)}}</el-button>
                    <div class="speHead">
                        <div class="viewBy">
                            <span>{{$i.order.viewBy}}</span>
                            <el-radio-group style="margin-left: 10px" v-model="view" size="mini" @change='changeView'>
                                <el-radio-button label='1'>{{($i.order.order)}}</el-radio-button>
                                <el-radio-button label='2'>{{($i.order.sku)}}</el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </template>
        </v-table>
        <page
                @size-change="changeSize"
                @change="changePage"
                :page-sizes="[50,100,200]"
                :page-data="pageData"></page>
    </div>
</template>
<script>
    /**
     * @param selectChange 下拉框 值发生变更触发
     * @param keyWord search框 值
     * @param options 下拉框 原始数据
     * @param value 下拉框 选中值
     */
    import {mapActions} from 'vuex'
    import {
        dropDown,
        selectSearch,
        VPagination
    } from '@/components/index'
    import {
        VTable
    } from '@/components/index';

    export default {
        name: 'orderOverview',
        components: {
            dropDown,
            VTable,
            selectSearch,
            page: VPagination,
        },
        data() {
            return {
                /**
                 * 页面基本data
                 * */
                view:'1',
                pageData: {},
                value: '',
                keyWord: '',
                disabled: false, //delete的状态
                disableFinish: true, // finish的状态
                tabData: [],
                loading: false,
                selectSearch: 1,
                pageTotal: 1,
                rowspan: 1,
                options: [
                    {
                        id: 1,
                        label: this.$i.order.orderNo
                    },
                    {
                        id: 2,
                        label: this.$i.order.skuCode
                    },
                    {
                        id: 3,
                        label: this.$i.order.supplierAbbr
                    }
                ],
                keyType: '',
                params: {
                    orderNo: '',
                    skuCode: '',
                    status: '',
                    ps: 50,
                    pn: 1,
                    draftCustomer:true
                },
                selectedList: [],
                selectedNumber: [],
                disableClickSend:false,
                tableCode:'uorder_list',
                disableClickDelete:false,

                /**
                 * 字典
                 * */
                orderStatusOption: [],
                incotermOption:[],
                paymentOption:[],
            }
        },
        methods: {
            ...mapActions([
                'setMenuLink'
            ]),
            send(){
                let ids=[];
                _.map(this.selectedList,v=>{
                    ids.push(v.id.value);
                });
                this.disableClickSend=true;
                this.$ajax.post(this.$apis.ORDER_SEND,{
                    draftCustomer:false,
                    ids:ids
                }).then(res=>{
                    this.getData();
                    this.$message({
                        message: this.$i.order.sendSuccess,
                        type: 'success'
                    });
                }).finally(()=>{
                    this.disableClickSend=false;
                })
            },
            deleteOrder(){
                this.$confirm(this.$i.order.sureDelete, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: 'warning'
                }).then(() => {
                    let ids=[];
                    _.map(this.selectedList,v=>{
                        ids.push(v.id.value);
                    });
                    this.disableClickDelete=true;
                    this.$ajax.post(this.$apis.delete_order,{
                        ids:ids,
                        recycleCustomer:true,
                        draftCustomer:true
                    }).then(res=>{
                        this.selectedList=[];
                        this.getData();
                    }).finally(()=>{
                        this.disableClickDelete=false;
                    });

                    this.$message({
                        type: 'success',
                        message: this.$i.order.deleteSuccess
                    });
                }).catch(() => {

                });
            },
            onAction(item) {
                this.$ajax.post(this.$apis.ORDER_DETAIL,{
                    orderId:item.id.value
                }).then(res=>{
                    if(res.draftCustomer){
                        this.$windowOpen({
                            url: '/order/create',
                            params: {
                                orderId: item.id.value
                            }
                        });
                    }else{
                        this.$alert(this.$i.order.orderHasBeenSent, this.$i.order.prompt, {
                            confirmButtonText: this.$i.order.sure,
                            callback: action => {
                                this.getData();
                            }
                        });
                    }
                })

            },
            selectChange(val) {
                this.keyType = val;
            },
            checked(item) {
                this.selectedList = item;
            },
            changeView() {
                this.disableFinish=true;
                if (this.view === '1') {
                    this.tableCode='uorder_list';
                    this.getData()
                } else {
                    this.tableCode='uorder_sku_list';
                    this.getData()
                }
            },
            inputEnter(val) {
                if (!val.id) return this.$message(this.$i.order.pleaseChooseType);
                if (val.id === 1) {
                    this.params.orderNo = val.value;
                    this.params.skuCode = "";
                    this.params.supplierAbbr = "";
                    this.view = "1";
                }
                else if (val.id === 2) {
                    this.params.orderNo = "";
                    this.params.skuCode = val.value;
                    this.params.supplierAbbr = "";
                    this.view = "2";
                }
                else if (val.id === 3) {
                    this.params.orderNo = "";
                    this.params.skuCode = "";
                    this.params.supplierAbbr = val.value;
                    this.view = "1";
                }
                this.getData();
            },
            getData(e) {
                this.loading = true;
                let url='',query='';
                url=(this.view==='1'?this.$apis.ORDER_DRAFT_ORDERPAGE:this.$apis.ORDER_DRAFT_SKUPAGE);
                query=(this.view==='1'?this.$db.order.overviewByOrder:this.$db.order.overviewBysku);
                if(e && e.sorts){
                    Object.assign(this.params,e);
                }
                this.$ajax.post(url, this.params)
                    .then((res) => {
                        this.loading = false;
                        this.tabData = this.$getDB(query, res.datas,e=>{
                            if(e.entryDt){
                                e.entryDt.value=this.$dateFormat(e.entryDt.value,'yyyy-mm-dd');
                            }
                            if(e.deliveryDt){
                                e.deliveryDt.value=this.$dateFormat(e.deliveryDt.value,'yyyy-mm-dd');
                            }
                            if(e.customerAgreementDt){
                                e.customerAgreementDt.value=this.$dateFormat(e.customerAgreementDt.value,'yyyy-mm-dd');
                            }
                            if(e.updateDt){
                                e.updateDt.value=this.$dateFormat(e.updateDt.value,'yyyy-mm-dd');
                            }
                            if(e.status){
                                e.status.value=this.$change(this.orderStatusOption,'status',e).name;
                            }
                            if(e.skuStatus){
                                e.skuStatus.value=this.$change(this.orderStatusOption,'skuStatus',e).name;
                            }
                            if(e.incoterm){
                                e.incoterm.value=this.$change(this.incotermOption,'incoterm',e).name;
                            }
                            if(e.skuIncoterm){
                                e.skuIncoterm.value=this.$change(this.incotermOption,'skuIncoterm',e).name;
                            }
                            if(e.payment){
                                e.payment.value=this.$change(this.paymentOption,'payment',e).name;
                            }
                            if(e.importantCustomer){
                                e.importantCustomer.value=(e.importantCustomer.value?'YES':'NO')
                            }
                            if(e.attachment){
                                e.attachment.value=(e.attachment.value?'YES':'NO')
                            }
                            if(e.remind){
                                e.remind.value=(e.remind.value?'YES':'NO')
                            }
                            if(e.archive){
                                e.archive.value=(e.archive.value?'YES':'NO')
                            }
                        });
                        this.pageData = res;
                    })
                    .catch((res) => {
                        this.loading = false
                    });
            },

            //获取字典
            getUnit() {
                this.$ajax.post(this.$apis.get_partUnit, ['ORDER_STATUS', 'AE_IS','ITM'], {cache: true}).then(res => {
                    res.forEach(v => {
                        if (v.code === 'ORDER_STATUS') {
                            this.orderStatusOption = v.codes;
                        }else if(v.code === 'ITM'){
                            this.incotermOption=v.codes;
                        }else if(v.code === 'PMT'){
                            this.paymentOption=v.codes;
                        }
                    });
                    this.getData(this.$db.order.overviewByOrder);
                })
            },

            /**
             * 分页操作
             * */
            changePage(e) {
                this.params.pn = e;
                this.getData();
            },
            changeSize(e) {
                this.params.ps = e;
                this.getData();
            }
        },
        created() {
            this.getUnit();
            this.setMenuLink({
                path: '/logs/index',
                query: {code: 'ORDER'},
                type: 10,
                auth:'ORDER:LOG',
                label: this.$i.common.log
            });
            this.setMenuLink({
                path: '/order/archiveOrder',
                type: 20,
                auth:'ORDER:OVERVIEW_ARCHIVE',
                label: this.$i.order.archiveOrder
            });
            this.setMenuLink({
                path: '/order/archiveDraft',
                type: 30,
                auth:'ORDER:DRAFT_ARCHIVE',
                label: this.$i.order.archiveDraft
            });
        },
        mounted() {
            this.loading = false;
        },
        watch: {
            selectedList(n){
                if(this.params.view==='1'){
                    if(n.length>0){
                        console.log(n)
                        let allow=true;
                        _.map(n,v=>{
                            if(v.status.value!=='3'){
                                allow=false;
                            }
                        });
                        this.disableFinish=(allow?false:true);
                    }else{
                        this.disableFinish=true;
                    }
                }else{
                    this.disableFinish=true;
                }
            },
        }
    }

</script>
<style scoped>
    >>> .el-input-group__append {
        padding: 0 !important;
    }

</style>
<style lang="less" scoped>
    .title{
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color:#666666;
        margin-top: 10px;
    }
    .viewBy{
        float: right;
        margin-right: 40px;
    }
    .speHead{
        float: right;
    }
    .speHead:after{
        content: '';
        clear: both;
        display: table;
    }

</style>
