<template>
    <div class="bookmark">
        <div class="title">
            <span>{{title}}</span>
            <el-button class="title-btn"
                       @click="switchDisplay"
                       type="text">{{btnInfo}}
            </el-button>
        </div>
        <div>
            <el-form ref="productFormTop" :model="productForm" label-width="190px">
                <el-row class="speZone">
                    <el-col v-if="v.isDefaultShow && v.belongPage==='sellerProductOverview'"
                            v-for="v in $db.product.buyerBasic" :key="v.key" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :prop="v.key" :label="v.label">
                            <drop-down v-model="productForm[v.key]"
                                       v-if="v.showType==='dropdown'"
                                       :list="categoryList"
                                       :defaultProps="defaultProps"
                                       ref="dropDown"
                                       :expandOnClickNode="false"></drop-down>
                            <el-input v-if="v.showType==='input'" size="mini" v-model="productForm[v.key]"
                                      :placeholder="$i.product.pleaseInput"></el-input>
                            <el-select class="speSelect" v-if="v.showType==='select'" size="mini"
                                       v-model="productForm[v.key]" placeholder="All">
                                <el-option
                                        v-for="item in v.options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="body" :class="{hide:hideBody}">
            <el-form ref="productForm" :model="productForm" label-width="190px">
                <el-row class="speZone">
                    <el-col v-if="!v.isDefaultShow && v.belongPage==='sellerProductOverview'"
                            v-for="v in $db.product.buyerBasic" :key="v.key" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :prop="v.key" :label="v.label">
                            <drop-down
                                    v-if="v.showType==='dropdown'"
                                    :list="dropData"
                                    :expand-on-click-node="false"
                                    ref="dropDown"></drop-down>
                            <el-input v-if="v.showType==='input'" size="mini" v-model="productForm[v.key]"
                                      :placeholder="$i.product.pleaseInput"></el-input>
                            <div v-if="v.showType==='select'">
                                <div v-if="v.isCountry">
                                    <el-select class="speSelect"
                                               size="mini"
                                               v-model="selectCountry"
                                               multiple
                                               filterable
                                               :placeholder="$i.product.pleaseChoose">
                                        <el-option
                                                v-for="item in countryOption"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    <el-select class="speSelect" size="mini" v-model="productForm[v.key]"
                                               :placeholder="$i.product.pleaseChoose">
                                        <el-option
                                                v-for="item in v.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div v-if="v.showType==='exwNumber'" class="section-number">
                                <el-input size="mini" class="section-input" v-model="productForm.minExwPrice"
                                          :placeholder="$i.product.pleaseInput"></el-input>
                                <div class="section-line">--</div>
                                <el-input size="mini" class="section-input" v-model="productForm.maxExwPrice"
                                          :placeholder="$i.product.pleaseInput"></el-input>
                            </div>
                            <div v-if="v.showType==='fobNumber'" class="section-number">
                                <el-input size="mini" class="section-input" v-model="productForm.minFobPrice"
                                          :placeholder="$i.product.pleaseInput"></el-input>
                                <div class="section-line">--</div>
                                <el-input size="mini" class="section-input" v-model="productForm.maxFobPrice"
                                          :placeholder="$i.product.pleaseInput"></el-input>
                            </div>
                            <el-input v-if="v.showType==='number'" size="mini" v-model="productForm[v.key]"
                                      :placeholder="$i.product.pleaseInput"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn-group">
            <el-button @click="search" :loading="disabledSearch" type="primary">{{$i.product.search}}</el-button>
            <el-button @click="clear" type="info" plain>{{$i.product.clear}}</el-button>
        </div>
        <div class="footer">
            <v-table
                    :code="code"
                    :height="500"
                    :loading="loadingTable"
                    :data="tableDataList"
                    :buttons="type==='recycle'?null:[{label: 'Detail', type: 1}]"
                    @change-checked="changeChecked"
                    @change-sort="val=>{getData({sorts:val})}"
                    @filter-value="tableFilterValue"
                    @action="btnClick">
                <template slot="header">
                    <div class="btns" v-if="!hideBtn">
                        <el-button @click="createInquiry">{{`${$i.product.createInquiry}(${selectList.length})`}}</el-button>
                        <el-button @click="createOrder">{{`${$i.product.createOrder}(${selectList.length})`}}</el-button>
                        <el-button @click="compareProducts" :disabled="disabledCompare">{{`${$i.product.compare}(${selectList.length})`}}
                        </el-button>
                        <el-button @click="addToBookmark" :loading="disableClickAddBookmark"
                                   :disabled="disabledAddBookmark">{{`${$i.product.addToBookmark}(${selectList.length})`}}
                        </el-button>
                        <el-button v-authorize="'PRODUCT:OVERVIEW:DOWNLOAD'"
                                   @click="download"
                                   :disabled="disabledDownload">{{$i.product.download+'('+downloadBtnInfo+')'}}</el-button>
                        <!--<el-button type="danger">{{$i.product.delete}}</el-button>-->
                    </div>
                    <div class="btns" v-if="type==='recycle'">
                        <el-button :disabled="disabledRecover" :loading="disabledClickRecover" @click="recover"
                                   type="primary">{{$i.product.recover}}
                        </el-button>
                        <el-button>{{$i.product.download+'('+downloadRecycleListInfo+')'}}</el-button>
                    </div>
                </template>
            </v-table>
            <!--分页-->
            <page
                    @change="changePage"
                    @size-change="changeSize"
                    :page-sizes="[50,100,200,500]"
                    :page-data="pageData"></page>
            <div class="footer-btn" v-if="hideBtn && type!=='recycle'">
                <el-button :loading="disabledOkBtn" type="primary" @click="postData">OK</el-button>
                <el-button @click="cancel">Cancel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import VTable from '@/components/common/table/index'
    import {dropDownSingle, VPagination} from '@/components/index'
    import sectionNumber from '../product/sectionNumber'
    import {mapActions} from 'vuex'

    export default {
        name: "overview",
        components: {
            dropDown: dropDownSingle,
            sectionNumber,
            VTable,
            page: VPagination
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'product'
            },
            hideBtn: {
                type: Boolean,
                default: false
            },
            disabledLine: {
                type: Array,
                default: function () {
                    return []
                }
            },
            disabledOkBtn: {
                type: Boolean,
                default: false
            },
            forceUpdateNumber: {
                type: Number,
                default: 0
            },
            isInModify: {        //是否处在modify状态，用来表示在compare页面add product时的不用操作
                type: Boolean,
                default: false
            },
            isInquiry: {
                type: Boolean,
                default: false
            },
            disablePostCustomerCreate: {
                type: Boolean,
                default: false
            },
            disablePostCustomerBookmark: {
                type: Boolean,
                default: false
            },
            disableBookmarkChoose:{
                type:Boolean,
                default:false
            },
            dataResource:{
                type:Function,
            },
            code:{
                type:String,
                default:'udata_purchase_sku_overview'
            },
        },
        data() {
            return {
                /**
                 * 字典配置
                 * */
                statusOption: [],
                lengthOption: [],
                weightOption: [],
                volumeOption: [],
                dateOption: [],
                skuUnitOption: [],
                countryOption: [],

                hideBody: true,            //是否显示body
                btnInfo: this.$i.product.advanced,     //按钮默认文字显示
                disabledSearch: false,
                selectList: [],
                downloadBtnInfo: '0',
                downloadRecycleListInfo: 'all',
                selectCountry: [],

                //btn禁用状态
                disabledAddBookmark: true,
                disabledCompare: true,
                disabledDownload: true,
                disabledRecover: true,
                disabledClickRecover: false,     //是否让recover按钮不能点

                //表格加载状态
                loadingTable: false,

                //btn加载状态
                disableClickAddBookmark: false,

                //表格字段绑定
                productForm: {
                    categoryId: null,
                    nameCnLike: "",
                    readilyAvailable: null,
                    customerSkuCodeLike: "",
                    minExwPrice: '',
                    maxExwPrice: '',
                    codeLike: "",
                    nameEnLike: "",
                    minFobPrice: '',
                    maxFobPrice: '',
                    materialEnLike: "",
                    country: '',
                    supplierNameLike: "",
                    outerCartonMethodEnLike: "",
                    methodPkgEnLike: "",
                    deliveryDates: null,
                    descEnLike: "",
                    descCnLike: "",

                    pn: 1,
                    ps: 50,

                    recycle: false,         //是否是在recycle bin里请求
                    operatorFilters: [],

                    sorts: [],

                },
                //表格验证参数

                /**
                 * 分页配置
                 * */
                pageData: {},

                //Category下拉组件数据
                dropData: [],
                categoryList: [
                    {
                        id: 5125125,
                        name: "自己的分类",
                        children: [],
                        _disableClick:true,
                    },
                    {
                        id: 12312512,
                        name: "系统分类",
                        children: [],
                        _disableClick:true,
                    },
                ],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },

                //底部table数据
                tableDataList: [],
                dataColumn: []
            }
        },
        methods: {
            ...mapActions(['setLog']),

            tableFilterValue(val) {
                let {operatorFilters, sorts} = val;
                this.productForm.operatorFilters = operatorFilters || [];
                this.productForm.sorts = sorts || [];
                this.getData();
            },
            //切换body的收缩展开状态
            switchDisplay() {
                this.hideBody = !this.hideBody;
            },

            //清除填写的表格数据
            clear() {
                this.$refs['productFormTop'].resetFields();
                this.$refs['productForm'].resetFields();
                this.$set(this.productForm, 'categoryId', null);
                this.$set(this.productForm, 'minExwPrice', null);
                this.$set(this.productForm, 'maxExwPrice', null);
                this.$set(this.productForm, 'minFobPrice', null);
                this.$set(this.productForm, 'maxFobPrice', null);
                this.$set(this.productForm, 'supplierNameLike', null);
                this.selectCountry = [];
            },

            //搜查
            search() {
                if (this.$validateForm(this.productForm, this.$db.product.buyerBasic)) {
                  return false;
                }
                this.disabledSearch = true;

                if (!this.productForm.maxExwPrice) {
                    this.productForm.maxExwPrice = null;
                }
                else {
                    this.productForm.maxExwPrice = Number(this.productForm.maxExwPrice);
                }
                if (!this.productForm.minExwPrice) {
                    this.productForm.minExwPrice = null;
                } else {
                    this.productForm.minExwPrice = Number(this.productForm.minExwPrice);
                }
                if (!this.productForm.maxFobPrice) {
                    this.productForm.maxFobPrice = null;
                } else {
                    this.productForm.maxFobPrice = Number(this.productForm.maxFobPrice);
                }
                if (!this.productForm.minFobPrice) {
                    this.productForm.minFobPrice = null;
                } else {
                    this.productForm.minFobPrice = Number(this.productForm.minFobPrice);
                }
                this.productForm.country='';
                if (this.selectCountry.length > 0) {
                    _.map(this.selectCountry, v => {
                        this.productForm.country += (v + ',');
                    });
                    this.productForm.country = this.productForm.country.slice(0, this.productForm.country.length - 1);
                }

                this.getData();
            },
            handleChange(value) {
                console.log(value);
            },

            //切换check状态
            changeChecked(e) {
                this.selectList = e;
            },

            //emit数据
            postData() {
                this.$refs.productFormTop.resetFields();
                let arr = this.$copyArr(this.selectList);
                //这里只把选中并且没有置灰的数据抛出去，这肯定是新增的
                let newArr = [];
                if (this.type === 'product') {
                    arr.forEach(v => {
                        if (v._checked && !v._disabled) {
                            // newArr.push(v);
                            newArr.push(v.id.value);        //只把id带出去
                        }
                    });
                } else if (this.type === 'bookmark') {
                    if (this.disablePostCustomerCreate) {
                        arr.forEach(v => {
                            if (v._checked && !v._disabled && !v.customerCreate.value) {
                                newArr.push(v.skuId.value);        //只把id带出去
                            }
                        });
                    } else {
                        arr.forEach(v => {
                            if (v._checked && !v._disabled) {
                                newArr.push(v.skuId.value);        //只把id带出去
                            }
                        });
                    }
                }
                if (this.disablePostCustomerBookmark) {
                    let allow = true;
                    _.map(arr, v => {
                        if (v.customerCreate.value) {
                            allow = false;
                        }
                    });
                    if (!allow) {
                        return this.$message({
                            message: this.$i.product.cantAddCustomerProduct,
                            type: 'warning'
                        });
                    }
                }
                this.$emit('handleOK', newArr);
            },
            cancel() {
                this.$refs.productFormTop.resetFields();
                this.$emit('handleCancel');
            },

            //获取类别数据
            getCategoryId() {
                this.$ajax.get(this.$apis.get_buyer_sys_category, {}).then(res => {
                    this.categoryList[1].children = res;
                }).catch(err => {

                });
                this.$ajax.get(this.$apis.get_buyer_my_category, {}).then(res => {
                    this.categoryList[0].children = res;
                }).catch(err => {

                });
            },

            initData(data){
                let database;
                if(this.code==='udata_purchase_sku_overview'){
                    database=this.$db.product.indexTable;
                }else{
                    database=this.$db.logistic.dbBasicInfoObj;
                }
                this.tableDataList = this.$getDB(database, data.datas, (e) => {
                    if(this.code==='udata_purchase_sku_overview'){
                        let noneSellCountry = '';
                        e.noneSellCountry.value.split(',').forEach(v => {
                            this.countryOption.forEach(m => {
                                if (m.code === v) {
                                    noneSellCountry += (m.name + ',');
                                }
                            })
                        });
                        noneSellCountry = noneSellCountry.slice(0, noneSellCountry.length - 1);
                        e.noneSellCountry.value = noneSellCountry;

                        e.status.value = this.$change(this.statusOption, 'status', e, true).name;
                        e.expireUnit.value = this.$change(this.dateOption, 'expireUnit', e, true).name;
                        e.unit.value = this.$change(this.skuUnitOption, 'unit', e, true).name;
                        e.unitLength.value = this.$change(this.lengthOption, 'unitLength', e, true).name;
                        e.unitVolume.value = this.$change(this.volumeOption, 'unitVolume', e, true).name;
                        e.unitWeight.value = this.$change(this.weightOption, 'unitWeight', e, true).name;
                        e.yearListed.value=this.$dateFormat(e.yearListed.value,'yyyy-mm');

                        if(this.disableBookmarkChoose && e.bookmarkId.value){
                            this.$set(e,'_disabled',true);
                        }
                    }
                    return e;
                });
                this.pageData = data;
                if (this.disabledLine.length > 0) {
                    this.disabledLine.forEach(v => {
                        let id;
                        if (this.isInModify) {
                            id = _.findWhere(v, {key: 'skuId'}).value;
                        } else if (this.isInquiry) {
                            id = _.findWhere(v, {key: 'skuId'}).value;
                        } else {
                            id = _.findWhere(v, {key: 'id'}).value;
                        }
                        this.tableDataList.forEach(m => {
                            let newId;
                            if (this.type === 'product') {
                                newId = _.findWhere(m, {key: 'id'}).value;
                            } else if (this.type === 'bookmark') {
                                newId = _.findWhere(m, {key: 'skuId'}).value;
                            }
                            if (id === newId) {
                                m._disabled = true;
                                m._checked = true;
                            }
                        })
                    })
                }
                this.selectList = this.$copyArr(this.disabledLine);
                this.selectList.forEach(v => {
                    v._disabled = true;
                });
                this.loadingTable = false;
            },

            //获取table数据
            getData(params) {
                this.productForm=_.extend(this.productForm,params);
                if(this.dataResource){
                    this.dataResource().then(data=>{
                        this.initData(data);
                    })
                }
                else if (this.type === 'recycle') {
                    this.loadingTable = true;
                    this.$ajax.post(this.$apis.get_buyerBookmarkList, {
                        recycle: true,
                        ps: 100,
                        pn: 1
                    }).then(res => {
                        this.tableDataList = this.$getDB(this.$db.product.indexTable, res.datas, (e) => {
                            if (e.status.value === 1) {
                                e.status.value = '上架';
                            } else if (e.status.value === 0) {
                                e.status.value = '下架';
                            }
                            return e;
                        });
                        if (this.disabledLine.length > 0) {
                            this.disabledLine.forEach(v => {
                                let id = _.findWhere(v, {key: 'id'}).value;
                                this.tableDataList.forEach(m => {
                                    let newId = _.findWhere(m, {key: 'id'}).value;
                                    if (id === newId) {
                                        m._disabled = true;
                                    }
                                })
                            })
                        }
                        this.loadingTable = false;
                        this.disabledSearch = false;
                    }).catch(err => {
                        this.loadingTable = false;
                        this.disabledSearch = false;
                    });
                }
                else {
                    let url = '';
                    if (this.type === 'product') {
                        url = this.$apis.get_buyerProductList;
                    }
                    else if (this.type === 'bookmark') {
                        url = this.$apis.get_buyerBookmarkList;
                    }
                    this.loadingTable = true;
                    this.productForm.recycle = false;
                    this.$ajax.post(url, this.productForm).then(res => {
                        this.initData(res);
                    }).finally(err => {
                        setTimeout(()=>{
                            this.loadingTable = false;
                            this.disabledSearch = false;
                        },350)
                    });
                }
            },

            /**
             * 按钮组操作
             * */
            addToBookmark() {
                let id = [];
                this.selectList.forEach(v => {
                    id.push(v.id.value);
                });
                this.disableClickAddBookmark = true;
                this.$ajax.post(this.$apis.add_buyerBookmark, id).then(res => {
                    this.$message({
                        message: this.$i.product.successfullyAdd,
                        type: 'success'
                    });
                    this.getData();
                    this.disableClickAddBookmark = false;
                }).catch(err => {
                    this.disableClickAddBookmark = false;
                });
            },
            download(){

                this.$fetch.export_taske('SKU_PURCHASE_EXPORT_IDS',_.pluck(_.pluck(this.selectList,"id"),'value'));
            },

            //表格按钮点击
            btnClick(item) {
                if (this.type === 'recycle') {
                    this.$windowOpen({
                        url: '/product/bookmarkDetail',
                        params: {
                            id: item.skuId.value,
                            bookmarkId: item.id.value
                        }
                    })
                }
                else if (this.type === 'product') {
                    if (item.bookmarkId.value) {
                        this.$windowOpen({
                            url: '/product/bookmarkDetail',
                            params: {
                                id: item.id.value,
                                bookmarkId: item.bookmarkId.value
                            }
                        })
                    } else {
                        this.$windowOpen({
                            url: '/product/sourcingDetail',
                            params: {
                                id: item.id.value
                            }
                        })
                    }
                }
            },

            createInquiry() {
                if (this.selectList.length === 0) {
                    this.$windowOpen({
                        url: '/negotiation/createInquiry',
                    })
                } else {
                    let skus = '', codes = [], supplierCodes = '';
                    _.map(this.selectList, v => {
                        if (v.id.value) {
                            skus += (v.id.value + ',');
                        }
                        if (v.supplierCode.value) {
                            codes.push(v.supplierCode.value)
                        }
                    });
                    skus = skus.slice(0, skus.length - 1);
                    _.map(_.uniq(codes), v => {
                        supplierCodes += (v + ',');
                    });
                    supplierCodes = supplierCodes.slice(0, supplierCodes.length - 1);
                    this.$windowOpen({
                        url: '/negotiation/createInquiry',
                        params: {
                            skus: skus,
                            supplierCodes: supplierCodes
                        }
                    })
                }
            },
            createOrder() {
                let supplierList = [];
                _.map(this.selectList, v => {
                    supplierList.push(v.supplierCode.value);
                });
                if (_.uniq(supplierList).length > 1) {
                    return this.$message({
                        message: this.$i.product.notAddDifferentSupplierProduct,
                        type: 'warning'
                    });
                }
                if (this.selectList.length === 0) {
                    this.$windowOpen({
                        url: '/order/create',
                    })
                } else {
                    let supplierCode = this.selectList[0].supplierCode.value;
                    let ids = '';
                    this.selectList.forEach(v => {
                        ids += (v.id.value + ',');
                    });
                    this.$windowOpen({
                        url: '/order/create',
                        params: {
                            type: 'product',
                            ids: ids,
                            supplierCode: supplierCode
                        },
                    })
                }
            },

            //对比product
            compareProducts() {
                if(this.selectList.length>100){
                    return this.$message({
                        message: this.$i.product.compareRecordMustLessThan100,
                        type: 'success'
                    });
                }
                let id = '';
                this.selectList.forEach((v, k) => {
                    let item = _.findWhere(v, {key: 'id'});
                    if (k === this.selectList.length - 1) {
                        id += item.value;
                    } else {
                        id += (item.value + ',');
                    }
                });

                this.$windowOpen({
                    url: 'product/compareDetail/new',
                    params: {
                        id: id,
                    }
                });
            },

            recover() {
                let id = [];
                this.selectList.forEach(v => {
                    id.push(v.id.value);
                });
                this.disabledClickRecover = true;
                this.$ajax.post(this.$apis.recover_buyerProductBookmark, id).then(res => {
                    this.selectList = [];
                    this.loadingTable = true;
                    this.$ajax.post(this.$apis.get_buyerBookmarkList, {
                        recycle: true
                    }).then(res => {
                        this.tableDataList = this.$getDB(this.$db.product.indexTable, res.datas, (e) => {
                            if (e.status.value === 1) {
                                e.status.value = '上架';
                            } else if (e.status.value === 0) {
                                e.status.value = '下架';
                            }
                            return e;
                        });
                        if (this.disabledLine.length > 0) {
                            this.disabledLine.forEach(v => {
                                let id = _.findWhere(v, {key: 'id'}).value;
                                this.tableDataList.forEach(m => {
                                    let newId = _.findWhere(m, {key: 'id'}).value;
                                    if (id === newId) {
                                        m._disabled = true;
                                    }
                                })
                            })
                        }
                        this.$message({
                            message: 'successfully recovery!',
                            type: 'success'
                        });
                        this.disabledClickRecover = false;
                        this.loadingTable = false;
                    }).catch(err => {
                        this.disabledClickRecover = false;
                        this.loadingTable = false;
                    });
                }).catch(err => {
                    this.disabledClickRecover = false;
                });
            },

            /**
             * 分页操作
             * */
            changePage(e) {
                this.productForm.pn = e;
                this.getData({pn:e});
            },
            changeSize(e) {
                this.productForm.ps = e;
                this.getData({ps:e});
            },
        },
        created() {
            this.loadingTable = true;
            this.$ajax.post(this.$apis.get_partUnit, ['SKU_SALE_STATUS', 'WT_UNIT', 'ED_UNIT', 'VE_UNIT', 'LH_UNIT', 'SKU_UNIT'], {cache: true}).then(res => {
                res.forEach(v => {
                    if (v.code === 'SKU_SALE_STATUS') {
                        this.statusOption = v.codes;
                    } else if (v.code === 'WT_UNIT') {
                        this.weightOption = v.codes;
                    } else if (v.code === 'ED_UNIT') {
                        this.dateOption = v.codes;
                    } else if (v.code === 'VE_UNIT') {
                        this.volumeOption = v.codes;
                    } else if (v.code === 'LH_UNIT') {
                        this.lengthOption = v.codes;
                    } else if (v.code === 'SKU_UNIT') {
                        this.skuUnitOption = v.codes;
                    }
                });
                if (this.$route.params.supplierName) {
                    this.productForm.supplierNameLike = this.$route.params.supplierName;
                }
                //国家
                this.$ajax.get(this.$apis.get_country, {}, {cache: true}).then(res => {
                    this.countryOption = res;
                    this.getData();
                    this.getCategoryId();
                }).catch(err => {

                });
            }).catch(err => {
                this.loadingTable = false;
            });

        },
        mounted() {

        },

        watch: {
            hideBody(n) {
                if (n) {
                    this.btnInfo = this.$i.product.advanced;
                } else {
                    this.btnInfo = this.$i.product.hideTheAdvanced;
                }
            },
            selectList(n) {
                if (n.length === 0) {
                    this.downloadBtnInfo = 0;
                    this.downloadRecycleListInfo = 'all';
                    this.disabledAddBookmark = true;
                    this.disabledDownload = true;
                    this.disabledRecover = true;
                } else {
                    this.downloadBtnInfo = n.length;
                    this.downloadRecycleListInfo = n.length;
                    this.disabledAddBookmark = false;
                    this.disabledDownload = false;
                    this.disabledRecover = false;
                }

                if (n.length >= 2) {
                    this.disabledCompare = false;
                } else {
                    this.disabledCompare = true;
                }
            },
            disabledLine(n) {
                if (n.length > 0) {
                    n.forEach(v => {
                        let id;
                        if (v.id) {
                            id = _.findWhere(v, {key: 'id'}).value;
                        } else {
                            id = _.findWhere(v, {key: 'skuId'}).value;
                        }
                        this.tableDataList.forEach(m => {
                            let newId = _.findWhere(m, {key: 'id'}).value;
                            if (id === newId) {
                                this.$set(m, '_disabled', true);
                            }
                        })
                    })
                }
            },
            forceUpdateNumber() {
                this.getData();
            },
        }
    }
</script>

<style scoped>
    .bookmark {
        padding-right: 20px;
    }

    .title {
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color: #666666;
        margin-bottom: 5px;
    }

    .title-btn {
        float: right;
        margin-right: 5px;
    }

    .head-list {

    }

    .head-list label {
        width: 190px;
        display: inline-block;
        height: 42px;
        line-height: 42px;
        text-align: right;
        font-size: 14px;
        color: #606266;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        float: left;
    }

    .head-list .content {
        margin-left: 190px;
        height: 42px;
    }

    .head-list .content >>> input {
        height: 42px;
    }

    .speZone >>> label {

    }

    .speZone >>> input {

    }

    .section-number {

    }

    .section-number .section-input {
        float: left;
        width: 40%;
    }

    .section-number .section-line {
        float: left;
    }

    .outGroup {

    }

    .outGroup .label {
        width: 190px;
        float: left;
    }

    .body {
        overflow: hidden;
        max-height: 320px;
        display: block;
        transition: max-height .5s cubic-bezier(.445, .05, .55, .95);
    }

    .body .numberInput {
        width: 80px;
        text-align: left;
    }

    .body .numberInput >>> input {
        padding: 0;
    }

    .hide {
        max-height: 0;
    }

    .form-spelist {
        margin-bottom: 10px !important;
    }

    .form-spelist >>> .ivu-form-item-content {
        line-height: normal;
    }

    .form-list {
        margin-bottom: 10px;
    }

    .speSelect {
        width: 100%;
    }

    .btn-group {
        text-align: center;
        margin-top: 10px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
    }

    .btn-group .search {
        margin-right: 30px;
    }

    .footer {

    }

    .footer .btns {
        padding: 10px 0;
    }

    .footer-btn {
        text-align: center;
    }
</style>
