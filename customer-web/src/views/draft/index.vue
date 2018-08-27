<template>
    <div class="compare-overview">
        <h3 class="hd">{{ $i.common.compareOverview }}</h3>
        <div class="status">
            <div class="state"></div>
            <select-search :options="options" @inputChange="searchEnter" />
        </div>
        <div class="fn">
            <div class="btn-wrap">
                <el-button type="primary" :disabled="checkedArg.length <= 0">{{ `${$i.common.submit}(${checkedArg.length})`}}</el-button>
                <el-button type="danger" @click="inquiryDelete" :disabled="checkedArg.length <= 0">{{ `${$i.common.delete}(${checkedArg.length})`}}</el-button>
            </div>
            <div class="viewBy">
                <span>{{ $i.common.viewBy }}&nbsp;</span>
                <el-radio-group v-model="viewByStatus"  size="mini">
                    <el-radio-button label="0">{{$i.common.inquiry}}</el-radio-button>
                    <el-radio-button label="1" >{{$i.common.SKU}}</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <v-table 
            :data="tabData" 
            :loading="tabLoad"
            :buttons="[{label: 'Modify', type: 'modify'}, {label: 'Detail', type: 'detail'}]" 
            @action="action"
            @change-checked="changeChecked"
            :page-total="pageTotal"
        />
    </div>
</template>
<script>
    import { VTable, selectSearch } from '@/components/index';
    export default {
        name:'',
        data() {
            return {
                viewByStatus: 0,
                pageTotal:0,
                checkedArg: [],
                tabData: [],
                options:[{
                    id:'1',
                    label:'Compare Name'
                }, {
                    id: '2',
                    label: 'Compare Item'
                }],
                bodyData: {
                    key: '',
                    keyType: '',
                    // operatorFilters: { //筛选条件
                    //     columnName: '',
                    //     operator: '',
                    //     property: '',
                    //     resultMapId: '',
                    //     value: {}
                    // },
                    ps: 10,
                    pn: 1,
                    recycle: 1,
                    // sorts: [
                    //     {
                    //         nativeSql: true,
                    //         orderBy: "string",
                    //         orderType: "string",
                    //         resultMapId: "string"
                    //     }
                    // ]
                },
                tabLoad: false
            }
        },
        components: {
            'select-search':selectSearch,
            'v-table': VTable
        },
        methods: {
            getList() { //获取Compare 列表
                this.tabLoad = true;
                this.$ajax.post(this.$apis.POST_INQIIRY_COMPARE_LIST, this.bodyData)
                .then(res => {
                    let data = res.datas;
                    this.tabLoad = false;
                    data.forEach(item => {
                        item.updateDt ? item.updateDt = this.$dateFormat(data.updateDt, 'yyyy-mm-dd') : '';
                    });
                    this.pageTotal = res.tc;
                    this.tabData = this.$getDB(this.$db.inquiry.compare, data);
                });
            },
            searchEnter(item) { // 搜索框
                this.bodyData.key = item.key;
                this.bodyData.keyType = item.keyType;
            },
            action(item, type) { //操作表单 action
                let types = '';
                if(type === 'detail') {
                    types = 'only';
                } else {
                    types = 'modify';
                }
                this.$router.push({
                    name: 'inquiryCompareDetail',
                    params: {
                        type: types
                    },
                    query: {
                        id: _.findWhere(item, { 'key': 'id' }).value
                    }
                });
            },
            changeChecked(item) { //选中的data
                let arr = [];
                item.forEach(item => {
                    arr.push(item.id.value);
                });
                this.checkedArg = arr;
            },
            inquiryDelete() { //删除
                
            }
        },
        watch: {
            bodyData: {
                handler(val) {
                    this.getList();
                },
                deep: true
            },
            viewByStatus(val) {
                this.getList();
            }
        },
        created() {
            this.getList();
        }
    }
</script>
<style lang="less" scoped>
    .compare-overview{
        .hd {
            padding-left:15px;
            height: 50px;
            line-height:50px;
            color:#666;
        }
         .status {
            display:flex;
            height: 60px;
            box-sizing: border-box;
            padding-left:25px;
            padding-right:25px;
            align-items: center;
            justify-content:space-between;
            .btn-wrap {
                display:flex;
                align-items: center;
                span {
                    font-size:14px;
                }
            }
        }
        .fn {
            display:flex;
            justify-content:space-between;
            padding:10px 15px;
            box-sizing: border-box;
            .viewBy {
                display:flex;
                align-items: center;
                span {
                    font-size:14px;
                    color:#666;
                }
                button {
                    cursor: pointer;
                    padding:2px 5px;
                }
                .set {
                    cursor: pointer;
                    padding-left:18px;
                    color:#999;
                    i {
                        font-size:25px;
                    }
                }
            }
        }
    }
</style>