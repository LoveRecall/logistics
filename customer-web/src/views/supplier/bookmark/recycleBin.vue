<template>
    <div class="SupplierSourcing">
            <div class="title">
             {{$i.supplier.recycleBin}}            
<!--            <el-button @click="switchDisplay" class="title-btn" type="text">{{btnInfo}}</el-button>-->
        </div>
<!--        搜索条件-->
            <div style='marginTop:20px;'>
                <el-form ref="parms" :model="parms" label-width="200px" size="mini">
                    <el-row>
                          <el-col :xs="24" :sm="12" :md="8" :lg="8" 
                           v-for='(item,index) in $db.supplier.overview'
                           :key="index"                   
                           >
                            <el-form-item class="form-list" 
                             v-if="item.showType==='text'"
                            :label="item.label" 
                            :prop="item.key"                    
                            >
                                <el-input v-model="parms[item.key]" placeholder="Enter something..."></el-input>
                            </el-form-item>
                            <el-form-item class="form-list"  v-if="item.showType==='select'"
                            :label="item.label" 
                            :prop="item.key" >
                                <el-select v-model="parms[item.key]"></el-select>
                               </el-form-item>
                               <el-form-item class="form-list"  v-if="item.showType==='dropdown'"
                                :label="item.label" 
                                :prop="item.key">
                                 <div class="speDropdown">
                                     <drop-down ref="dropDown"  v-model="parms[item.key]" :list="dropData"
                                     :defaultProps="defaultProps"
                                     ></drop-down>
                                </div>
                            </el-form-item>
                         </el-col>

                        </el-row>
    </el-form>
            </div>
           
            <div class="btn-group">
            <el-button @click="search" type="primary" class="search" >{{$i.common.search}}</el-button>
            <el-button @click="clear('parms')">{{$i.common.clear}}</el-button>
        </div>
<!--      搜索结果  -->
            <div>
             <div class="btnline">
                   <el-button  :disabled='!selectedData.length>0' @click='recycle'>{{$i.common.recover}}({{selectedNumber.length}})</el-button>
<!--                  <el-button  :disabled='!selectedData.length>0' >{{$i.common.downloadSelected}}({{selectedNumber.length}})</el-button>-->
              </div>  
              <div>
                 
              </div>          
        </div>
<!--        表格-->
             <v-table 
                   :height=360
                    :data="tabData" 
                    :buttons="[{label: 'detail', type: 1}]"
                    @action="detail" 
                    @change-checked='checked'
                    :loading='loading'
                    style='marginTop:10px'/>
    </div>
</template>

<script>
    import {
        dropDown
    } from '@/components/index'
    import {
        VTable
    } from '@/components/index';
    export default {
        name: "SupplierSourcing",
        components: {
            dropDown,
            VTable
        },
        props: {

        },
        data() {
            return {
                value: 1,
                hideBody: true, //是否显示body
                btnInfo: 'Show the Advance',
                parms: {
                    conditions: {},
                    description: "",
//                    mainBusiness: [],
                    name: '',
                    pn: 1,
                    ps: 50,
                    skuCode: "",
                    skuNameEn: "",
                    type: '',
                    recycle: true,
                },
                tabData: [],
                selectedData: [],
                selectedNumber: [],
                loading: false,
                dropData: [],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
            }
        },
        methods: {
            //切换body的收缩展开状态
            switchDisplay() {
                this.hideBody = !this.hideBody;
            },

            //清除填写的表格数据
            clear(name) {
                this.$refs[name].resetFields();
            },

            //搜查
            search() {
                this.get_data()
            },

            //...........进入detail
            detail(item) {
                this.$windowOpen({
                    url: '/supplier/bookmarkDetail',
                    params: {
                        id: item.id.value
                    }
                });
            },
            //.........checked
            checked(item) {
                this.selectedData = item
                let number = []
                this.selectedData.forEach(item => {
                    number.push(item.id.value);
                });
                this.selectedNumber = number
            },
            get_data() {
                this.loading = true;
                this.$ajax.post(this.$apis.post_supplier_listbookmark, this.parms)
                    .then(res => {
                        this.tabData = this.$getDB(this.$db.supplier.overviewtable, res.datas);
                        this.loading = false

                    })
                    .catch((res) => {
                        this.loading = true
                    });
            },
            recycle(){
                this.$ajax.post(this.$apis.post_recoverBookmarks, this.selectedNumber).then(res => {
                     this.get_data()
                }).catch(err => {
                    console.log(err)
                });
            },
            getCategoryId() {
                this.$ajax.get(this.$apis.getCategory, {}).then(res => {
                    this.dropData = res;
                }).catch(err => {
                    console.log(err)
                });
            },
        },
        created() {
            this.get_data()
        },
        watch: {
            hideBody(n) {
                if (n) {
                    this.btnInfo = 'Show the Advance';
                } else {
                    this.btnInfo = 'Hide the Advance';
                }
            }
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
        float: right;
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
        border-top: 1px solid black;
    }

    .btnline .el-button {
        margin-right: 8px;
        margin-top: 20px;
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

</style>