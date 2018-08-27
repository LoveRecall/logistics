<template>
    <div class="souringDetail">
        <div class="head">
            <div class="title">
                <img :src='basicDate.logo'/>
                <span>{{basicDate.name}}</span>
            </div>
            <div class="detail">
                 <el-form  label-width="190px">
                    <el-row>
                        <el-row class="right">
                            <el-col class="list" :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
                                   v-for='(item,index) in $db.supplier.detail'
                                   :key='index'
                                   >
                                    <el-form-item label-width="260px" :prop="item.key" :label="item.label+' :'">
                                       {{basicDate[item.key]}}
                                    </el-form-item>
                            </el-col>
                        </el-row>

                </el-row>
                  </el-form>
                <div class="btns" v-if="noEdit">
<!--                   <el-button @click='deleted' type='danger'>{{$i.common.delete}}</el-button>-->
<!--
                    <el-button @click='createInquiry'>{{$i.common.createInquiry}}</el-button>
                    <el-button @click='createOrder'>{{$i.common.createOrder}}</el-button>
                    <el-button @click='addToCompare'>{{$i.common.addToCompare}}</el-button>
                    <el-button @click='supplierProducts'>{{$i.common.supplierProducts}}</el-button>
                    <el-button @click='addToBookmark'>{{$i.common.addToBookmark}}</el-button>
-->
                </div>
<!--
                <div class="btns" v-else>
                    <el-button @click="finishEdit" type="primary">{{$i.common.finish}}</el-button>
                    <el-button @click="cancelEdit" type="info">{{$i.common.cancel}}</el-button>
                </div>
-->
            </div>
        </div>
        <div class="body">
            <el-tabs v-model="tabName" type="card" >
                <el-tab-pane :label="$i.address" name="address">
                    <v-table  :data="address"  style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.accountInfo"  name="accountInfo">
                    <v-table  :data="accounts"  style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.contactInfo" name="contactInfo">
                    <v-table  :data="concats"   style='marginTop:10px'/>
                </el-tab-pane>
                <el-tab-pane :label="$i.tradeHistory"  name="tradeHistory">
<!--                  <v-table  :data="tabData"   style='marginTop:10px'/>-->
                </el-tab-pane>
                <el-tab-pane :label="$i.inquireHistory"  name="inquireHistory">
<!--                  <v-table  :data="tabData"   style='marginTop:10px'/> -->
                </el-tab-pane>
                <el-tab-pane :label="$i.remark" name="remark">
                    <v-remark
                     style='marginTop:10px'
                     :id=id
                     />
                </el-tab-pane>
                <el-tab-pane :label="$i.attchment" name="attchment">
                   <v-attachment></v-attachment>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>

<script>
    import VCompareList from '../product/compareList'
    import VRemark from './remark'
    import VAttachment from './attachment'
    import {
        VTable
    } from '@/components/index';

    export default {
        name: "customerDetail",
        components: {
            VTable,
            VCompareList,
            VRemark,
            VAttachment
        },
        data() {
            return {
                noEdit: true,
                id: Number(this.$route.query.id),
                tabName: 'address', //默认打开的tab
                basicDate: [],
                accounts: [],
                concats: [],
                address: [],
                remarkData: [],
                compareConfig: {
                    showCompareList: false, //是否显示比较列表
                },
                code: '',
                loading: false
            }
        },
        methods: {

            deleted(){

            },
            addToBookmark() {
                this.$ajax.post(this.$apis.post_supplier_addbookmark, [this.id])
                    .then(res => {
                        this.$message({
                            message: 'success',
                            type: 'success',
                            onClose: (() => {
                                this.$router.push({
                                    path: '/supplier/bookmark',
                                    query: {
                                        id: this.id
                                    }
                                })
                            })
                        });
                    })
                    .catch((res) => {
                        console.log(res)
                    });
            },
            //..................获取数据
            get_data() {
                this.loading = true
                this.$ajax.post(this.$apis.post_customerDetail, {
                        id: this.id
                    })
                    .then(res => {
                    console.log(res)
//                        this.code = res.code
//                        this.basicDate = res;
//                        this.accounts = this.$getDB(this.$db.supplier.detailTable, res.accounts);
//                        this.address = this.$getDB(this.$db.supplier.detailTable, res.address);
//                        this.concats = this.$getDB(this.$db.supplier.detailTable, res.concats);
//                        this.loading = false
                    })
                    .catch((res) => {
                        this.loading = false
                    });
            },
        },
        created() {
            this.get_data()
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

    /*
    .attchment {
        display: flex;
        justify-content: flex-start;
        height: 400px;
    }

    .attchment_item {
        width: 180px;
        height: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid #BEBEBE;
        border-radius: 3px;
        margin-left: 20px;
    }

    .attchment_item_content {
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: baseline;
    }

    .attchment_item p {
        font-size: 14px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .attchment_item i {
        font-size: 40px;
    }
*/

</style>
