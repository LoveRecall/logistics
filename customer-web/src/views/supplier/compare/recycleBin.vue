<template>
    <div class="compare-overview">
        <h3 class="hd"> {{$i.supplier.compareRecycleBin}}</h3>
        <div class="status">
            <div class="btn-wrap">
<!--
                <el-button :disabled='!selectedData.length>0'
                 @click='downloadSelected'
                >{{$i.common.downloadSelected}}({{selectedNumber.length}})</el-button>
-->
                <el-button type="danger" v-authorize="'SUPPLIER:COMPARE_OVERVIEW:DELETE'" :disabled='!selectedData.length>0'
               
                >{{$i.common.recover}}({{selectedNumber.length}})</el-button>
            </div>

       <div class="select-wrap">       
                   <selectSearch :options='options' @inputEnter='inputEnter' 
                   v-model='selectSearch'
                     ></selectSearch>
                <div>

                </div>
            </div>
        </div>
        <!--from-->
          <!--        表格-->
           <v-table 
                :height=360
                :data="tabData" 
                :buttons="[{label:'Modify',type:1},{label: 'Detail', type: 2}]"
                @action="detail" 
                @change-checked='checked'
                style='marginTop:10px'/>
           <v-pagination
                :page-data.sync="params"
                 @change="handleSizeChange"
                @size-change="pageSizeChange"
            /> 
    </div>
</template>
<script>
    import {
        dropDown,
        selectSearch,
        VPagination
    } from '@/components/index'
    import {
        VTable
    } from '@/components/index';
    export default {
        name: '',
        data() {
            return {
                selectSearch: '1',
                options: [{
                    id: '1',
                    label: 'compareName'
                }, {
                    id: '2',
                    label: "compareItem"
                }],
                params: {
                    id: '',
                    name: "",
                    compareName: '',
                    //                      "operatorFilters": [
                    //                        {
                    //                          "columnName": "string",
                    //                          "operator": "string",
                    //                          "property": "string",
                    //                          "resultMapId": "string",
                    //                          "value": {}
                    //                        }
                    //                      ],
                    pn: 1,
                    ps: 50,
                    tc: 0,
                   "recycle": true,
                    //                      "sorts": [
                    //                        {
                    //                          "nativeSql": true,
                    //                          "orderBy": "string",
                    //                          "orderType": "string",
                    //                          "resultMapId": "string"
                    //                        }
                    //                      ]
                },
                tabData: [],
                selectedData: [],
                selectedNumber: []
            }
        },
        components: {
            dropDown,
            VTable,
            selectSearch,
            VPagination
        },
        methods: {
            inputEnter(keyWord) {
                console.log(keyWord.key)
                if (keyWord.keyType == 1) {
                    params.compareName = keyWord.key

                    this.get_data()
                } else {
                    params.compareName = keyWord.key
                    this.get_data()

                }
            },
            checked(item) {
                this.selectedData = item
                let number = []
                this.selectedData.forEach(item => {
                    number.push(item.id.value);
                });
                this.selectedNumber = number
            },
            detail(e, type) {
                if (type === 1) {
                    //modify
                    this.$windowOpen({
                        url: '/supplier/compareDetail/{type}',
                        params: {
                            type: 'modify',
                            isModify: true,
                            compareId: e.id.value,
                            compareName: e.name.value
                        },
                    });
                } else if (type === 2) {
                    //Detail
                    this.$windowOpen({
                        url: '/supplier/compareDetail/{type}',
                        params: {
                            type: 'modify',
                            compareId: e.id.value,
                            compareName: e.name.value
                        },

                    });
                }

            },
            get_data() {
                this.$ajax.post(this.$apis.post_supplier_listCompare, this.params)
                    .then(res => {
                        res.tc ? this.params.tc = res.tc : this.params.tc = this.params.tc;
                        this.tabData = this.$getDB(this.$db.supplier.compareView, res.datas);
                    })
                    .catch((res) => {

                    });
            },
            downloadSelected() {
                this.$ajax.post(this.$apis.post_supplier_listCompareDetails)
                    .then(res => {
                        console.log(res.datas)
                    })
                    .catch((res) => {

                    });
            },
            remove() {
                this.$ajax.post(this.$apis.post_supplier_deleteCompare, this.selectedNumber)
                    .then(res => {
                        console.log(res)
                    })
                    .catch((res) => {

                    });
            },
            handleSizeChange(val) {
                this.params.pn = val;
                this.get_data()
            },
            pageSizeChange(val) {
                this.params.ps = val;
                this.get_data()
            },
        },
        created() {
            this.get_data()
        },
    }

</script>
<style lang="less" scoped>
    .compare-overview {
        .hd {
            font-size: 18px;
            height: 50px;
            line-height: 50px;
            color: #666;
        }
        .status {
            display: flex;
            height: 60px;
            box-sizing: border-box;
            padding-left: 25px;
            padding-right: 25px;
            align-items: center;
            justify-content: space-between;
            .btn-wrap {
                display: flex;
                align-items: center;
                span {
                    font-size: 14px;
                }
            }
        }
        .select-wrap {
            display: flex;
            align-items: center;
            .select {
                width: 110px;
                margin-right: 5px;
            }
            .el-icon-setting {
                padding-left: 30px;
                font-size: 26px;
                /*                line-height: 60px;*/
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

</style>
