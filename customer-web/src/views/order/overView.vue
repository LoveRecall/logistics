<template>
    <div class="orderOverview">
        <h3 class="hd">{{$i.order.orderOverview}}</h3>
        <div class="status">
            <div class="btn-wrap">
                <span>{{$i.order.status}}</span>
                <el-radio-group style="margin-left: 10px" v-model="params.status" size="mini" @change='changeStatus'>
                    <el-radio-button label="">{{($i.order.all)}}</el-radio-button>
                    <el-radio-button
                            v-for="v in orderStatusOption"
                            :key="v.id"
                            :label="v.code">
                        {{v.name}}
                    </el-radio-button>
                </el-radio-group>
            </div>
            <div class="select-wrap">
                <selectSearch
                        :options=options
                        v-model='selectSearch'
                        @inputEnter="inputEnter">
                </selectSearch>
            </div>
        </div>
        <v-table
                :code="tableCode"
                ref='vtable'
                :data="tabData"
                :buttons="[{label: $i.order.detail, type: 1,auth:'ORDER:DETAIL'}]"
                @action="onAction"
                :loading='loading'
                :pageTotal='pageTotal'
                @change-checked='checked'
                @change-sort="val=>{getData(val)}"
                :height="500"
                style='margin-top:10px'>
            <template slot="header">
                <div class="fn">
                    <div class="btn-wrap">
                        <el-button
                                @click='createOrder'
                                v-authorize="'ORDER:OVERVIEW:CREATE'">
                            {{($i.order.createOrder)}}
                        </el-button>
                        <el-button
                                v-authorize="'ORDER:OVERVIEW:DOWNLOAD'"
                                @click="downloadOrder">
                            {{$i.order.download}}({{selectedList.length===0?$i.order.all:selectedList.length}})
                        </el-button>
                        <el-button
                                type='danger'
                                :loading="disableClickDelete"
                                :disabled='disableDelete'
                                @click='deleteOrder'
                                v-authorize="'ORDER:OVERVIEW:ARCHIVE'">
                            {{($i.common.archive)}}({{archiveLength}})
                        </el-button>
                    </div>
                    <div class="viewBy">
                        <span>{{$i.order.viewBy}}</span>
                        <el-radio-group style="margin-left: 10px" v-model="view" size="mini" @change='changeView'>
                            <el-radio-button label='1'>{{($i.order.order)}}</el-radio-button>
                            <el-radio-button label='2'>{{($i.order.sku)}}</el-radio-button>
                        </el-radio-group>
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
    import { mapActions } from "vuex";
    import {
        dropDown,
        selectSearch,
        VPagination
    } from "@/components/index";
    import {
        VTable
    } from "@/components/index";

    export default {
        name: "orderOverview",
        components: {
            dropDown,
            VTable,
            selectSearch,
            page: VPagination
        },
        data() {
            return {
                /**
                 * 页面基本data
                 * */
                view: "1",
                pageData: {},
                value: "",
                keyWord: "",
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
                id: "",
                params: {
                    orderNo: "",
                    skuCode: "",
                    status: "",
                    supplierAbbr: "",
                    ps: 50,
                    pn: 1,
                    draftCustomer: false,
                    recycleCustomer: false
                },
                selectedList: [],
                selectedNumber: [],
                tableCode: "uorder_list",
                disableClickFinish: false,
                disableClickDelete: false,
                disableDelete: true,
                archiveLength: 0,

                /**
                 * 字典
                 * */
                orderStatusOption: [],
                incotermOption: [],
                paymentOption: [],
                skuStatusOption: [],
                skuUnitOption:[],
            };
        },
        methods: {
            ...mapActions(["setMenuLink"]),
            onAction(item) {
                this.$windowOpen({
                    url: "/order/detail",
                    params: {
                        orderId: item.id.value
                    }
                });
            },
            createOrder() {
                this.$windowOpen({
                    url: "/order/create"
                });
            },
            downloadOrder() {
                let params = this.$depthClone(this.params);
                params.ids = _.pluck(_.pluck(this.selectedList, "id"), "value");
                console.log(params, "params");
                this.$fetch.export_task("EXPORT_ORDER", params);
            },
            selectChange(val) {
                this.id = val;
            },
            checked(item) {
                this.selectedList = item;
            },
            changeSort(e) {
                console.log(e, "eeee");
            },
            changeStatus() {
                this.getData();
            },
            changeView() {
                this.disableFinish = true;
                if (this.view === "1") {
                    this.tableCode = "uorder_list";
                    this.getData();
                } else {
                    this.tableCode = "uorder_sku_list";
                    this.getData();
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
            finish() {
                let ids = [], orderNos = [];
                _.map(this.selectedList, v => {
                    ids.push(v.id.value);
                    orderNos.push(v.orderNo.value);
                });
                this.disableClickFinish = true;
                this.$ajax.post(this.$apis.ORDER_FINISH, {
                    draftCustomer: false,
                    draftSupplier: false,
                    ids: ids,
                    orderNos: orderNos,
                    recycleCustomer: false,
                    recycleSupplier: false
                })
                    .then((res) => {
                        this.$message({
                            message: this.$i.order.shippedSuccess,
                            type: "success"
                        });
                        this.getData();
                    })
                    .finally(() => {
                        this.disableClickFinish = false;
                    });
            },
            download() {
                this.$ajax.post(this.$apis.download_order, {
                    ids: this.selectedNumber
                })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((res) => {
                        console.log(res);
                    });
            },
            deleteOrder() {
                this.$confirm(this.$i.order.sureDelete, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: "warning"
                }).then(() => {
                    let ids = [];
                    _.map(this.selectedList, v => {
                        ids.push(v.id.value);
                    });
                    this.disableClickDelete = true;
                    this.$ajax.post(this.$apis.delete_order, {
                        ids: ids,
                        recycleCustomer: true
                    }).then(res => {
                        this.selectedList = [];
                        this.getData();
                    }).finally(() => {
                        this.disableClickDelete = false;
                    });

                    this.$message({
                        type: "success",
                        message: this.$i.order.deleteSuccess
                    });
                }).catch(() => {

                });
            },
            getData(e) {
                this.loading = true;
                let url = "", query = "";
                url = (this.view === "1" ? this.$apis.OVERVIEW_ORDERPAGE : this.$apis.OVERVIEW_SKUPAGE);
                query = (this.view === "1" ? this.$db.order.overviewByOrder : this.$db.order.overviewBysku);
                if (e && e.sorts) {
                    Object.assign(this.params, e);
                }
                this.$ajax.post(url, this.params)
                    .then((res) => {
                        this.tabData = this.$getDB(query, res.datas, e => {
                            if (e.entryDt) {
                                e.entryDt._value = this.$dateFormat(e.entryDt.value, "yyyy-mm-dd");
                            }
                            if (e.deliveryDt) {
                                e.deliveryDt._value = this.$dateFormat(e.deliveryDt.value, "yyyy-mm-dd");
                            }
                            if (e.customerAgreementDt) {
                                e.customerAgreementDt._value = this.$dateFormat(e.customerAgreementDt.value, "yyyy-mm-dd");
                            }
                            if (e.updateDt) {
                                e.updateDt._value = this.$dateFormat(e.updateDt.value, "yyyy-mm-dd");
                            }
                            if (e.status) {
                                e.status._value = (_.findWhere(this.orderStatusOption, { code: e.status.value }) || {}).name;
                            }
                            if (e.skuStatus) {
                                e.skuStatus._value = (_.findWhere(this.skuStatusOption, { code: e.skuStatus.value }) || {}).name;
                            }
                            if (e.skuIncoterm) {
                                e.skuIncoterm._value =(_.findWhere(this.incotermOption,{code:e.skuIncoterm.value}) || {}).name;
                            }
                            if (e.incoterm) {
                                e.incoterm._value = (_.findWhere(this.incotermOption, { code: e.incoterm.value }) || {}).name;
                            }
                            if (e.payment) {
                                e.payment._value = (_.findWhere(this.paymentOption, { code: e.payment.value }) || {}).name;
                            }
                            if (e.skuUnit) {
                                e.skuUnit._value = (_.findWhere(this.skuUnitOption,{code:String(e.skuUnit.value)}) || {}).name;
                            }
                        });
                        this.pageData = res;
                        this.disableFinish = true;
                    })
                    .finally(() => {
                        this.selectedList = [];
                        this.loading = false;
                    });
            },
            getUnit() {
                this.$ajax.post(this.$apis.get_partUnit, ["ORDER_STATUS", "AE_IS", "ITM", "PMT", "SKU_STATUS", "SKU_UNIT"], { cache: true }).then(res => {
                    res.forEach(v => {
                        if (v.code === "ORDER_STATUS") {
                            this.orderStatusOption = v.codes;
                        } else if (v.code === "ITM") {
                            this.incotermOption = v.codes;
                        } else if (v.code === "PMT") {
                            this.paymentOption = v.codes;
                        } else if (v.code === "SKU_STATUS") {
                            this.skuStatusOption = v.codes;
                        } else if (v.code === "SKU_UNIT") {
                            this.skuUnitOption = v.codes;
                        }
                    });
                    this.getData();
                });
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
                path: "/order/draft",
                type: 10,
                auth:'ORDER:DRAFT_OVERVIEW',
                label: this.$i.common.draft
            });
            this.setMenuLink({
                path: "/logs/index",
                query: { code: "ORDER" },
                type: 20,
                auth: "ORDER:LOG",
                label: this.$i.common.log
            });
            this.setMenuLink({
                path: "/order/archiveOrder",
                type: 30,
                auth: "ORDER:OVERVIEW_ARCHIVE",
                label: this.$i.order.archiveOrder
            });
            this.setMenuLink({
                path: "/order/archiveDraft",
                type: 40,
                auth: "ORDER:DRAFT_ARCHIVE",
                label: this.$i.order.archiveDraft
            });
        },
        mounted() {
            this.loading = false;
        },
        watch: {
            selectedList(n) {
                let archiveLength = 0;
                let disableArchive = false;
                if (n.length === 0) {
                    disableArchive = true;
                } else {
                    _.map(n, v => {
                        if (v.status.value !== "5") {
                            disableArchive = true;
                        } else {
                            archiveLength++;
                        }
                    });
                }
                this.disableDelete = disableArchive;
                if (this.view === "1") {
                    if (n.length > 0) {
                        let allow = true;
                        _.map(n, v => {
                            if (v.status.value !== "PROCESS") {
                                allow = false;
                            }
                        });
                        this.disableFinish = (allow ? false : true);
                    } else {
                        this.disableFinish = true;
                    }
                }
                else {
                    this.disableFinish = true;
                }
                this.archiveLength = archiveLength;
            }
        }
    };

</script>
<style scoped>
    >>> .el-input-group__append {
        padding: 0 !important;
    }
</style>
<style lang="less" scoped>
    .orderOverview {
        .hd {
            height: 50px;
            line-height: 50px;
            color: #666;
            border-bottom: 1px solid #ccc;
            font-size: 18px;
            color: #666666;
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
                    input {
                    }
                }
            }

        }
        .fn {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            width: 100%;
            box-sizing: border-box;
            .viewBy {
                /*display: flex;*/
                /*align-items: center;*/
                margin-right: 70px;
                span {
                    font-size: 14px;
                    color: #666;
                }

                .set {
                    cursor: pointer;
                    padding-left: 40px;
                    /*                    color: #999;*/
                    i {
                        font-size: 25px;
                    }
                    .speDropdown {
                        position: absolute;
                        right: 40px;
                        background-color: #ffffff;
                        z-index: 2000;
                        display: none
                    }
                    .speDropdownshow {
                        position: absolute;
                        right: 40px;
                        background-color: #ffffff;
                        z-index: 2000;

                    }
                }
            }
        }
    }
</style>
