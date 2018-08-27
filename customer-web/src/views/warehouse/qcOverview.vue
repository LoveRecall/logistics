<template>
    <div class="inquiry">
        <div class="title">
            <span>{{$i.warehouse.qcOverview}}</span>
        </div>
        <div class="status">
            <div class="state">
                <span>{{ $i.common.qcStatus }}</span>
                <el-radio-group class="radios" @change="changeQcStatus" v-model="params.qcStatusDictCode"
                                size="mini">
                    <el-radio-button label="">{{$i.warehouse.all}}</el-radio-button>
                    <el-radio-button v-for="v in qcStatusOption" :key="v.id" :label="v.code">{{v.name}}
                    </el-radio-button>
                </el-radio-group>
            </div>
            <div style="float: right">
                <select-search
                        :options="options"
                        v-model="searchValue"
                        @inputEnter="inputEnter"
                        :searchLoad="searchLoad">
                </select-search>
            </div>
        </div>
        <v-table
                code="uwarehouse_qc_order_overview"
                :height="500"
                :data="tabData"
                :loading='loading'
                :buttons="[{label: $i.warehouse.detail, type: 1, auth:'QC:ORDER_DETAIL'}]"
                @action="onAction"
                @change-sort="val=>{getQcOrderList(val)}"
                @change-checked='checked'>
            <template slot="header">
                <div class="fn">
                    <div class="btn-wrap">
                        <el-button
                                v-authorize="'QC:ORDER_OVERVIEW:CREATE'"
                                @click="createQcOrder">{{ $i.warehouse.create }}</el-button>
                        <el-button
                                v-authorize="'QC:ORDER_OVERVIEW:DOWNLOAD'"
                                @click='download'>
                            {{($i.warehouse.download)}}({{selectList.length?selectList.length:$i.warehouse.all}})
                        </el-button>
                    </div>
                </div>
            </template>
        </v-table>
        <page
                :page-data="pageData"
                :page-sizes="[50,100,200,500]"
                @change="handleSizeChange"
                @size-change="pageSizeChange"></page>

    </div>
</template>
<script>
    import {selectSearch, VTable, VPagination} from '@/components/index';
    import {mapActions} from 'vuex'

    export default {
        name: "qc-overview",
        components: {
            VTable,
            selectSearch,
            page: VPagination
        },
        data() {
            return {
                name: '',
                value: '',
                qcStatusOption: [],
                qcMethodsOption: [],
                options: [
                    {
                        id: 1,
                        label: this.$i.warehouse.QCOrderNo
                    }, {
                        id: 2,
                        label: this.$i.warehouse.orderNo
                    }
                ],
                pageData: {},
                searchLoad: false,
                loading: false,
                pageTotal: 0,
                params: {
                    pn: 1,
                    ps: 50,
                    orderNo: "",
                    qcOrderNo: "",
                    qcStatusDictCode: "",
                    sorts:[{orderBy:"updateDt",orderType:"desc"}]
                },
                tabData: [],
                selectList: [],
                selectedNumber: [],
                searchValue: 1
            }
        },
        methods: {
            ...mapActions(['setMenuLink']),
            getSort(val, key) {
                console.log(val, key)
            },
            handleSizeChange(val) {
                this.params.pn = val;
                this.getQcOrderList();
            },
            pageSizeChange(val) {
                this.params.ps = val;
                this.getQcOrderList();
            },
            checked(item) {
                this.selectList = item;
            },
            inputEnter(val) {
                if (!val.id) return this.$message({
                    message: this.$i.warehouse.pleaseChooseAType,
                    type: 'warning'
                });
                if (val.id === 1) {
                    this.params.qcOrderNo = val.value ? val.value : "";
                    this.params.orderNo = "";
                } else {
                    this.params.orderNo = val.value ? val.value : "";
                    this.params.qcOrderNo = "";
                }
                this.getQcOrderList();
            },
            onAction(item, type) {
                this.$windowOpen({
                    url: '/warehouse/qcDetail',
                    params: {
                        id: item.id.value
                    }
                })
            },
            download() {
                let orderNos=_.pluck(_.pluck(this.selectList, "qcOrderNo"),'value');
                let params=this.$depthClone(this.params);
                params.qcOrderNos=orderNos;
                this.$fetch.export_task('QC_ORDER',params);
            },
            changeQcStatus(){
                this.params.pn = 1;
                this.getQcOrderList();
            },
            //获取表格data
            getQcOrderList(e) {
                this.loading = true;
                if(e){
                    Object.assign(this.params,e);
                }
                this.selectList=[];
                this.$ajax.post(this.$apis.post_qc_page, this.params)
                    .then(res => {
                        this.loading = false;
                        this.tabData = this.$getDB(this.$db.warehouse.qcOrderTable, res.datas, e => {
                            e.qcMethodDictCode.value = this.$change(this.qcMethodsOption, 'qcMethodDictCode', e).name;
                            return e;
                        });
                        this.pageData = res;
                    })
                    .catch((res) => {
                        this.loading = false;
                    });
            },
            createQcOrder() {
                this.$windowOpen({
                    url: '/warehouse/createQc'
                })
            },

            /**
             * 获取单位
             * */
            getUnit() {
                this.$ajax.post(this.$apis.get_partUnit, ['QC_STATUS', 'QC_MD'], {cache: true}).then(res => {
                    res.forEach(v => {
                        if (v.code === 'QC_STATUS') {
                            this.qcStatusOption = v.codes;
                        } else if (v.code === 'QC_MD') {
                            this.qcMethodsOption = v.codes;
                        }
                    });
                    this.getQcOrderList();
                }).catch(err => {

                });
            },
        },
        created() {
            this.getUnit();
        },
        mounted() {
            this.setMenuLink({
                path: '/logs/index',
                query: {code: 'QC'},
                type: 10,
                auth:'QC:LOG',
                label: this.$i.common.log
            });
        },
    }
</script>

<style scoped>
    .title {
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color: #666666;
        margin-bottom: 5px;
    }

    .radios {
        margin-left: 10px;
    }

    .head-list {
        margin-bottom: 10px;
    }

    .head-list label {
        width: 190px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        text-align: right;
        font-size: 14px;
        color: #606266;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        float: left;
    }

    .head-list .content {
        margin-left: 190px;
        height: 32px;
    }

    .head-list .content >>> input {
        height: 32px;
    }

    .state {
        float: left;
    }

    .status {
        overflow: hidden;
    }

    .fn {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        box-sizing: border-box;

    .viewBy {
        display: flex;
        align-items: center;

    span {
        font-size: 14px;
        color: #666;
    }

    button {
        cursor: pointer;
        padding: 2px 5px;
    }

    .set {
        cursor: pointer;
        padding-left: 18px;
        color: #999;

    i {
        font-size: 25px;
    }

    }
    }
    }
    .btns {
        text-align: center;
    }

    .btn-group {
        margin-bottom: 10px;
    }
</style>
