<template>
    <div class="Details" v-loading="notLoadingDone">
        <div class="head">
            <div class="title">
                {{productForm.nameEn}}
            </div>
            <div class="detail head-detail">
                <el-row>
                    <el-col :span="6">
                        <el-carousel class="banner" :autoplay="false" indicator-position="none" arrow="always"
                                     trigger="click" height="300px">
                            <el-carousel-item v-for="item in productForm.pictures" :key="item">
                                <v-image :src="item"></v-image>
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                    <el-col :span="18">
                        <el-form :modal="productForm" ref="sourcingDetail" label-width="190px">
                            <el-row>
                                <el-col v-for="v in $db.product.buyerDetailTop" :key="v.key" class="list" :xs="24"
                                        :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:12"
                                        :xl="v.fullLine?24:12">
                                    <el-form-item :prop="v.key" :label="v.label +' :'">
                                        <span v-if="v.key==='incoterm'">
                                            FOB
                                        </span>
                                        <span v-else>
                                            <span v-if="v.key==='incotermArea'">
                                                {{productForm.fobPort}}
                                            </span>
                                            <span v-if="v.key==='incotermPrice'">
                                                {{productForm.fobPrice}}
                                            </span>
                                            <span v-if="v.key==='status'">
                                                {{productForm[v.key]}}
                                            </span>
                                            <span v-else>
                                                {{productForm[v.key]}}
                                            </span>
                                        </span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
                </el-row>
                <div class="btns" v-show="hideBtns" v-if="notEdit">
                    <el-button
                            :disabled="productForm.recycle"
                            @click="createInquiry"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:CREATE_INQUIRY'">
                        {{$i.product.createInquiry}}
                    </el-button>
                    <el-button
                            :disabled="productForm.customerCreate || productForm.recycle"
                            @click="createOrder"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:CREATE_ORDER'">{{$i.product.createOrder}}
                    </el-button>
                    <el-button
                            :disabled="productForm.recycle"
                            @click="addCompare"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:ADD_COMPARE'">
                        {{$i.product.addToCompare}}
                    </el-button>
                    <el-button
                            :disabled="productForm.recycle"
                            @click="editProduct"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:MODIFY'">
                        {{$i.product.editEn}}
                    </el-button>
                    <el-button
                            :disabled="productForm.recycle"
                            @click="addProduct"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:ADD_PRODUCT'">
                        {{$i.product.addNewProductEn}}
                    </el-button>
                    <el-button
                            :disabled="productForm.recycle"
                            @click="manuallyAddProduct"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:MANUALLY_ADD'">
                        {{$i.product.manuallyAdd}}
                    </el-button>
                    <el-button
                            :disabled="productForm.recycle"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:DOWNLOAD'">{{$i.product.downloadTheProduct}}
                    </el-button>
                    <el-button
                            :disabled="productForm.recycle"
                            @click="upload"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:UPLOAD'">{{$i.product.uploadProduct}}
                    </el-button>
                    <el-button
                            type="danger"
                            :disabled="productForm.recycle"
                            :loading="disableClickDelete"
                            @click="deleteBookmark"
                            v-authorize="'PRODUCT:BOOKMARK_DETAIL:DELETE'">{{$i.product.deleteProduct}}
                    </el-button>
                </div>
                <div class="btns" v-else>
                    <el-button @click="saveEdit" :loading="disabledClickSaveEdit" type="primary">{{$i.product.ok}}
                    </el-button>
                    <el-button @click="cancelEdit">{{$i.product.cancel}}</el-button>
                </div>
            </div>
        </div>
        <div class="body">
            <el-tabs v-model="tabName" type="border-card" @tab-click="handleClick">
                <el-tab-pane :label="$i.product.basicInformation" name="Basic Info">
                    <el-form class="speForm" label-width="310px" :label-position="labelPosition">
                        <el-row>
                            <el-row>
                                <el-col
                                        v-if="v.belongTab==='basicInfo' && !v.isCustomerCreate"
                                        v-for="v in $db.product.detailTab"
                                        :key="v.key"
                                        class="list"
                                        :xs="24"
                                        :sm="24"
                                        :md="v.fullLine?24:12"
                                        :lg="v.fullLine?24:12"
                                        :xl="v.fullLine?24:12">
                                    <el-form-item :prop="v.key" :label="v.label+' :'">
                                        <div v-if="v.key==='status'">
                                            {{productForm[v.key]}}
                                        </div>
                                        <div v-else-if="v.showType==='attachment'">
                                            <v-upload
                                                    readonly
                                                    :list="productForm[v.key]"
                                                    :limit="20"></v-upload>
                                        </div>
                                        <div v-else>
                                            <div v-if="productForm.customerCreate">
                                                {{productForm[v.key]}}
                                            </div>
                                            <div v-else>
                                                <div v-if="v.key==='descCustomer' || v.key==='nameCustomer'">
                                                    <el-input
                                                            :disabled="notEdit"
                                                            type="textarea"
                                                            autosize
                                                            :placeholder="$i.product.pleaseInput"
                                                            v-model="productForm[v.key]">
                                                    </el-input>
                                                </div>
                                                <div v-else-if="v.key==='customerSkuCode'">
                                                    <el-input
                                                            :disabled="notEdit"
                                                            v-model="productForm[v.key]"
                                                            :placeholder="$i.product.pleaseInput"></el-input>
                                                </div>
                                                <div v-else>
                                                    {{productForm[v.key]}}
                                                </div>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.customerInfo" name="Customer Info">
                    <el-form class="speForm" label-width="290px" :label-position="labelPosition">
                        <el-row>
                            <el-col v-if="v.belongTab==='customerInfo'" v-for="v in $db.product.detailTab" :key="v.key"
                                    class="list" :xs="24" :sm="24" :md="v.fullLine?24:12" :lg="v.fullLine?24:12"
                                    :xl="v.fullLine?24:12">
                                <el-form-item :label="v.label+':'">
                                    {{productForm[v.key]}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.priceInfo" name="Price Info">
                    <v-table
                            class="tabVtable"
                            :selection="false"
                            :data="priceTable"></v-table>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.packingInfo" name="Packing Info">
                    <el-form class="speForm" label-width="300px" :label-position="labelPosition">
                        <el-row>
                            <el-col v-if="v.belongTab==='packingInfo'" v-for="v in $db.product.detailTab" :key="v.key"
                                    class="list" :xs="24" :sm="24" :md="v.fullLine?24:12" :lg="v.fullLine?24:12"
                                    :xl="v.fullLine?24:12">
                                <el-form-item :label="v.label+':'">
                                    {{productForm[v.key]}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.logisticInfo" name="Logistic">
                    <el-form class="speForm" label-width="280px" :label-position="labelPosition">
                        <el-row>
                            <el-col v-if="v.belongTab==='logisticInfo'" v-for="v in $db.product.detailTab" :key="v.key"
                                    class="list" :xs="24" :sm="24" :md="v.fullLine?24:12" :lg="v.fullLine?24:12"
                                    :xl="v.fullLine?24:12">
                                <el-form-item :label="v.label+':'">
                                    {{productForm[v.key]}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.otherInfo" name="Other Info">
                    <el-form class="speForm" label-width="310px" :label-position="labelPosition">
                        <el-row>
                            <el-col v-if="v.belongTab==='otherInfo'" v-for="v in $db.product.detailTab" :key="v.key"
                                    class="list" :xs="24" :sm="24" :md="v.fullLine?24:12" :lg="v.fullLine?24:12"
                                    :xl="v.fullLine?24:12">
                                <el-form-item :label="v.label+':'">
                                    {{productForm[v.key]}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <!--<el-tab-pane :label="$i.product.tradeHistory" name="History">-->
                    <!--<v-table-->
                            <!--:height="500"-->
                            <!--:loading="loadingTable"-->
                            <!--:data="historyData">-->
                    <!--</v-table>-->
                <!--</el-tab-pane>-->
                <el-tab-pane :label="$i.product.attachment" name="Attachment">
                    <div class="bigFont" v-if="!productForm.attachments || productForm.attachments.length===0">
                        {{$i.product.noAttachments}}
                    </div>
                    <v-upload v-else readonly :list="productForm.attachments" :limit="20" ref="upload"></v-upload>
                </el-tab-pane>
                <el-tab-pane :label="$i.product.remark" name="Remark">
                    <div>
                        <el-button @click="createRemark" type="primary" size="mini">{{$i.product.add}}</el-button>
                    </div>
                    <br>
                    <el-table
                            v-loading="loadingRemark"
                            :data="remarkTableData"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="remark"
                                :label="$i.product.remark"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="operatorName"
                                :label="$i.product.operator"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="operatorDate"
                                :label="$i.product.time"
                                align="center">
                            <template slot-scope="scope">
                                {{$dateFormat(scope.row.operatorDate,"yyyy-mm-dd hh:mm:ss")}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                :label="$i.product.action"
                                align="center">
                            <template slot-scope="scope">
                                <el-button @click="editRemark(scope.$index, scope.row)" type="text" size="small">
                                    {{$i.product.modify}}
                                </el-button>
                                <el-button @click="deleteRemark(scope.$index, scope.row)" type="text" size="small">
                                    {{$i.product.delete}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <page
                            @size-change="changeSize"
                            @change="changePage"
                            :page-data="pageData"></page>

                    <el-dialog :title="$i.product.addRemark" :visible.sync="addRemarkFormVisible" center width="600px">
                        <el-form :model="addRemarkData">
                            <el-form-item :label="$i.product.remark" :label-width="formLabelWidth">
                                <el-input
                                        type="textarea"
                                        :rows="4"
                                        :placeholder="$i.product.pleaseInput"
                                        v-model="addRemarkData.remark">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button :loading="disableCreateRemark" type="primary" @click="createRemarkSubmit">
                                {{$i.product.submit}}
                            </el-button>
                            <el-button @click="addRemarkFormVisible = false">{{$i.product.cancel}}</el-button>
                        </div>
                    </el-dialog>
                </el-tab-pane>
            </el-tabs>
        </div>
        <compare-list
                v-if="showCompareList"
                :data="compareData"
                @clearData="clearData"
                @goCompare="goCompare"
                @closeTag="handleClose"></compare-list>

        <el-dialog :title="$i.product.changeRemark" :visible.sync="editRemarkFormVisible" center width="500px">
            <el-form :model="editRemarkData">
                <el-form-item :label="$i.product.remark" :label-width="formLabelWidth">
                    <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$i.product.pleaseInput"
                            v-model="editRemarkData.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="disableModifyRemark" type="primary" @click="editRemarkSubmit">
                    {{$i.product.submit}}
                </el-button>
                <el-button @click="editRemarkFormVisible = false">{{$i.product.cancel}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="$i.product.addProduct" :visible.sync="addProductDialogVisible" width="80%">
            <product
                    :disableBookmarkChoose="true"
                    :forceUpdateNumber="forceNumber"
                    :title="addProductTitle"
                    :type="addProductType"
                    :disabledOkBtn="disabledOkBtn"
                    :hideBtn="true"
                    @handleCancel="handleCancel"
                    @handleOK="handleOkClick"></product>
        </el-dialog>
    </div>
</template>

<script>
    import compareList from "../compareList";
    import product from "../addProduct";
    import { VTable, VUpload, VPagination, VImage } from "@/components/index";
    import { mapActions } from "vuex";

    export default {
        name: "detail",
        components: {
            compareList,
            VTable,
            product,
            VUpload,
            page: VPagination,
            VImage
        },
        data() {
            return {
                /**
                 * 页面配置
                 * */
                pageData: {},
                notEdit: true,          //是否不在编辑状态,默认为true
                hideBtns: false,
                value1: 0,
                tabName: "Basic Info",
                labelPosition: "left",               //文字靠边参数，left或者right
                notLoadingDone: true,
                addProductDialogVisible: false,      //新增产品弹出框显示隐藏
                addProductTitle: "",
                addProductType: "product",
                disabledOkBtn: false,
                disabledClickSaveEdit: false,
                disableClickDelete: false,
                forceNumber: 0,
                editRemarkFormVisible: false,
                disableModifyRemark: false,

                editRemarkData: {
                    id: null,
                    remark: "",
                    skuId: 0
                },

                productForm: {
                    id: null,                         //新增传空
                    pic: "thisIsAPicture",
                    status: null,                      //0下架 1上架
                    nameEn: "",
                    barcode: "",                    //产品条码
                    descEn: "",
                    descCustomer: "",
                    nameCustomer: "",
                    customerSkuCode: "",
                    supplierCode: "",
                    supplierName: "",
                    code: "",                       //新增时系统生成，传空
                    unit: "2",
                    formation: "",
                    materialEn: "",
                    colourEn: "",
                    minOrderQty: 1,
                    deliveryDates: 1,               //交期(做完需要多少天)
                    noneSellCountry: 1,             //禁售国家，暂时传1
                    applicableAge: 1,
                    expireDates: 1,
                    expireUnit: 1,                  //保质期单位，暂时传1
                    readilyAvailable: 1,
                    availableQty: 1,
                    mainSaleCountry: 1,
                    mainSaleArea: "",
                    productionDates: 1,             //开发时间
                    qualityStander: "",
                    yearListed: "2018-02-23",
                    useDisplayBox: 1,
                    displayBoxQty: 0,
                    otherPackInfoEn: "",
                    adjustPackage: 2,
                    lengthWidthHeight: "",
                    recycle: false,
                    categoryId: "",                      //类型id
                    taxRefundRate: 1,
                    customsCode: "",
                    customsNameEn: "",
                    tradeMarkEn: "",
                    commodityInspectionEn: "",
                    origin: "",
                    brand: "",
                    brandRemark: "",
                    brandRelated: "",
                    certificat: "",
                    gp20SkuQty: 0,
                    gp40SkuQty: 0,
                    hq40SkuQty: 0,
                    tryDimension: "",                    //托盘尺寸？？？
                    skuQtyPerTray: 0,
                    specialTransportRequire: "",
                    inventoryCostMethod: "",
                    warehourceDefault: "",
                    inventory: 0,
                    safeInventory: 0,
                    minInventory: 0,
                    unitWeight: 1,                      //重量单位,暂时传1
                    unitLength: 1,                      //长度单位,暂时传1
                    unitVolume: 1,                      //提及单位，暂时传1
                    length: 0,
                    width: 0,
                    height: 0,
                    netWeight: 0,
                    volume: 0,
                    methodPkgEn: "",
                    innerCartonUnit: "",                //中包单位
                    innerCartonQty: 0,
                    innerCartonLength: 0,
                    innerCartonWidth: 0,
                    innerCartonHeight: 0,
                    innerCartonWeightNet: 0,
                    innerCartonRoughWeight: 0,
                    innerCartonVolume: 0,
                    innerCartonDesc: "",
                    innerCartonMethodEn: "",
                    outerCartonUnit: "",                //外箱单位
                    outerCartonDesc: "",
                    innerCartonOuterNum: 0,
                    outerCartonQty: 0,
                    outerCartonLength: 0,
                    outerCartonWidth: 0,
                    outerCartonHeight: 0,
                    outerCartonNetWeight: 0,
                    outerCartonRoughWeight: 0,
                    outerCartonVolume: 0,
                    outerCartonMethodEn: "",
                    oem: 1,
                    logisticId: 1,
                    version: 1,
                    pkgId: 1,
                    price: [
                        {
                            fobCurrency: 1,
                            fobPrice: 1,                    //价格起始是多少
                            fobPort: "",
                            exwPrice: 1,                    //价格起始是多少
                            exwCurrency: 1,
                            otherIncoterm: 1,
                            otherIncotermPrice: 1,
                            otherIncotermArea: "",
                            otherIncotermCurrency: 1,
                            status: 1                       //1成本价，2基础报价
                        },
                        {
                            fobCurrency: 1,
                            fobPrice: 1,
                            fobPort: "",
                            exwPrice: 1,
                            exwCurrency: 1,
                            otherIncoterm: 1,
                            otherIncotermPrice: 1,
                            otherIncotermArea: "",
                            otherIncotermCurrency: 1,
                            status: 2
                        }
                    ]
                },
                //三个copy字段
                copyDescCustomer: "",
                copyNameCustomer: "",
                copyCustomerSkuCode: "",

                //特别取出来显示的几个变量
                fobPort: "",
                fobPrice: "",
                //用于展示的table数据
                priceTable: [],

                /**
                 * compareList配置
                 * */
                showCompareList: false,      //是否显示比较列表
                compareData: [],

                /**
                 * remark data
                 * */
                loadingRemark: false,
                remarkConfig: {
                    pn: 1,
                    ps: 10,
                    sorts: [],
                    id: this.$route.query.id
                },
                formLabelWidth: "80px",
                remarkTableData: [],
                addRemarkData: {
                    id: null,
                    remark: "",
                    skuId: 0
                },
                currentPage1: 1,
                addRemarkFormVisible: false,
                disableCreateRemark: false,      //是否禁用提交按钮

                tradeHistory: {
                    pn: 1,
                    ps: 100,
                    skuCode: "",
                    sorts: []
                },
                historyData: [],
                loadingTable: false,

                /**
                 * 字典配置
                 * */
                incotermOption: [],
                skuSaleStatusOption: [],
                skuUnitOption: [],       //计量单位
                expirationOption: [],    //保质期单位
                quarantineTypeOption: [],//检疫类别
                weightOption: [],
                volumeOption: [],
                lengthOption: [],
                oemOption: [],
                udbOption: [],
                skuPkgOption: [],
                countryOption: [],
                formationOption: []

            };
        },
        methods: {
            ...mapActions(["setMenuLink"]),
            /**
             * 中间按钮组事件
             * */
            editProduct() {
                if (this.productForm.customerCreate) {
                    this.$windowOpen({
                        url: "/product/bookmarkManuallyAdd",
                        params: {
                            id: this.productForm.id
                        }
                    });
                } else {
                    this.tabName = "Basic Info";
                    this.notEdit = false;
                    this.copyCustomerSkuCode = this.productForm.customerSkuCode;
                    this.copyDescCustomer = this.productForm.descCustomer;
                    this.copyNameCustomer = this.productForm.nameCustomer;
                }
            },
            saveEdit() {
                let params = {
                    customerCode: "",
                    descCustomer: "",
                    id: null,
                    nameCustomer: ""
                };
                params.nameCustomer = this.productForm.nameCustomer;
                params.id = this.$route.query.bookmarkId;
                params.descCustomer = this.productForm.descCustomer;
                params.customerCode = this.productForm.customerSkuCode;
                this.disabledClickSaveEdit = true;
                this.$ajax.post(this.$apis.edit_buyerProductBookmark, params).then(res => {
                    this.notEdit = true;
                    this.disabledClickSaveEdit = false;
                    this.$message({
                        message: "Edit Successfully!",
                        type: "success"
                    });
                }).catch(err => {
                    this.disabledClickSaveEdit = false;
                });
            },
            cancelEdit() {
                this.notEdit = true;
                this.productForm.customerSkuCode = this.copyCustomerSkuCode;
                this.productForm.descCustomer = this.copyDescCustomer;
                this.productForm.nameCustomer = this.copyNameCustomer;
            },
            deleteBookmark() {
                this.$confirm(this.$i.product.sureDelete, this.$i.product.prompt, {
                    confirmButtonText: this.$i.product.sure,
                    cancelButtonText: this.$i.product.cancel,
                    type: "warning"
                }).then(() => {
                    this.disableClickDelete = true;
                    this.$ajax.post(this.$apis.delete_buyerProductBookmark, [
                        {
                            id: this.$route.query.bookmarkId,
                            name: this.productForm.nameEn
                        }
                    ]).then(res => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.disableClickDelete = false;
                        this.$router.push("/product/bookmark");
                    }).catch(err => {
                        this.disableClickDelete = false;
                        this.$message.error("delete failed!");
                    });

                }).catch(() => {

                });

            },
            upload() {

            },
            addProduct() {
                this.forceNumber = Math.random();
                this.addProductDialogVisible = true;
            },
            manuallyAddProduct() {
                this.$windowOpen({
                    url: "/product/bookmarkManuallyAdd"
                });
            },
            handleCancel() {
                this.addProductDialogVisible = false;
            },
            handleOkClick(e) {
                if (e.length === 0) {
                    //表示一个都没选
                    this.$message({
                        message: this.$i.product.pleaseChoose,
                        type: "warning"
                    });
                } else {
                    this.disabledOkBtn = true;
                    this.$ajax.post(this.$apis.add_buyerBookmark, e).then(res => {
                        this.$message({
                            message: this.$i.product.successfullyAdd,
                            type: "success"
                        });
                        this.disabledOkBtn = false;
                        this.addProductDialogVisible = false;
                    }).catch(err => {
                        console.log(err);
                        this.disabledOkBtn = false;
                        this.addProductDialogVisible = false;
                    });
                }
            },
            handleClick() {
                //切换tab页
            },
            getTableData() {
                this.$ajax.get(this.$apis.get_buyerProductDetail, {
                    id: this.$route.query.id
                }).then(res => {
                    this.productForm = res;
                    this.$db.product.detailTab.supplierAbbr.isCustomerCreate=this.productForm.customerCreate;


                    //处理国家显示
                    //处理国家显示
                    if (this.productForm.noneSellCountry) {
                        this.productForm.noneSellCountry = _.map(this.productForm.noneSellCountry.split(","), item => {
                            return (_.findWhere(this.countryOption, { code: item }) || {}).name;
                        }).join(",");
                    }
                    if (this.productForm.mainSaleCountry) {
                        this.productForm.mainSaleCountry = _.map(this.productForm.mainSaleCountry.split(","), item => {
                            return (_.findWhere(this.countryOption, { code: item }) || {}).name;
                        }).join(",");
                    }

                    /**
                     * 字典转换
                     * */
                    this.productForm.status = (_.findWhere(this.skuSaleStatusOption, { code: String(this.productForm.status) }) || {}).name;
                    this.productForm.unit = (_.findWhere(this.skuUnitOption, { code: String(this.productForm.unit) }) || {}).name;
                    this.productForm.expireUnit = (_.findWhere(this.expirationOption, { code: String(this.productForm.expireUnit) }) || {}).name;
                    this.productForm.unitLength = (_.findWhere(this.lengthOption, { code: String(this.productForm.unitLength) }) || {}).name;
                    this.productForm.unitVolume = (_.findWhere(this.volumeOption, { code: String(this.productForm.unitVolume) }) || {}).name;
                    this.productForm.unitWeight = (_.findWhere(this.weightOption, { code: String(this.productForm.unitWeight) }) || {}).name;
                    this.productForm.oem = (_.findWhere(this.oemOption, { code: String(Number(this.productForm.oem)) }) || {}).name;
                    this.productForm.yearListed = this.$dateFormat(this.productForm.yearListed, "yyyy-mm");
                    this.productForm.useDisplayBox = (_.findWhere(this.udbOption, { code: String(Number(this.productForm.useDisplayBox)) }) || {}).name;
                    this.productForm.adjustPackage = (_.findWhere(this.skuPkgOption, { code: String(Number(this.productForm.adjustPackage)) }) || {}).name;
                    this.productForm.formation=(_.findWhere(this.formationOption, { code: String(this.productForm.formation) }) || {}).name;

                    this.notLoadingDone = false;
                    this.hideBtns = true;
                    let priceData = [{
                        fobCurrency: this.productForm.fobCurrency,
                        fobPrice: this.productForm.fobPrice,
                        refFobPrice: this.productForm.refFobPrice,
                        fobPort: this.productForm.fobPort,
                        exwPrice: this.productForm.exwPrice,
                        exwCurrency: this.productForm.exwCurrency,
                        cifPrice: this.productForm.cifPrice,
                        refCifPrice: this.productForm.refCifPrice,
                        cifCurrency: this.productForm.cifCurrency,
                        cifArea: this.productForm.cifArea,
                        dduPrice: this.productForm.dduPrice,
                        refDduPrice: this.productForm.refDduPrice,
                        dduCurrency: this.productForm.dduCurrency,
                        dduArea: this.productForm.dduArea
                    }];
                    this.priceTable = this.$getDB(this.$db.product.detailPriceTable, priceData, item => {
                        item.refFobPrice._note = this.$i.product.fobFormula;
                        item.refCifPrice._note = this.$i.product.cifFormula;
                        item.refDduPrice._note = this.$i.product.dduFormula;
                    });
                }).finally(() => {
                    this.notLoadingDone = false;
                });
            },

            /**
             *  remark操作
             * */
            getRemarkData() {
                this.loadingRemark = true;
                this.$ajax.post(this.$apis.get_buyerRemarkList, this.remarkConfig).then(res => {
                    this.loadingRemark = false;
                    this.remarkTableData = res.datas;
                    this.pageData = res;
                }).catch(err => {
                    this.loadingRemark = false;
                });
            },
            editRemark(index, row) {
                this.editRemarkData.id = row.id;
                this.editRemarkData.skuId = this.productForm.id;
                this.editRemarkData.remark = row.remark;
                this.editRemarkFormVisible = true;
            },

            //确定编辑remark
            editRemarkSubmit() {
                this.disableModifyRemark = true;
                this.$ajax.post(this.$apis.update_buyerProductRemark, this.editRemarkData)
                    .then(res => {
                        this.getRemarkData();
                        this.$message({
                            message: "修改成功",
                            type: "success"
                        });

                        this.disableModifyRemark = false;
                        this.editRemarkFormVisible = false;
                    }).catch(err => {
                        this.disableModifyRemark = false;
                        this.editRemarkFormVisible = false;
                    }
                );
            },

            /**
             * 分页操作
             * */
            changePage(e) {
                this.remarkConfig.pn = e;
                this.getRemarkData();
            },
            changeSize(e) {
                this.remarkConfig.ps = e;
                this.getRemarkData();
            },
            createRemark() {
                this.addRemarkFormVisible = true;
                this.addRemarkData.id = null;     //新增的时候要置为null
                this.addRemarkData.skuId = this.productForm.id;
                this.addRemarkData.remark = "";

            },
            createRemarkSubmit() {
                this.disableCreateRemark = true;
                this.$ajax.post(this.$apis.add_buyerProductRemark, this.addRemarkData).then(res => {
                    this.disableCreateRemark = false;
                    this.addRemarkFormVisible = false;
                    this.$message({
                        message: "新增成功",
                        type: "success"
                    });
                    this.getRemarkData();
                }).catch(err => {
                    this.disableCreateRemark = false;
                    this.addRemarkFormVisible = false;
                });
            },
            deleteRemark(index, row) {
                this.$confirm(this.$i.product.sureDelete, this.$i.product.prompt, {
                    confirmButtonText: this.$i.product.sure,
                    cancelButtonText: this.$i.product.cancel,
                    type: "warning"
                }).then(() => {
                    this.$ajax.post(this.$apis.delete_buyerProductRemark, {
                        id: row.id
                    }).then(res => {
                        if (this.remarkTableData.length === 1 && this.remarkConfig.pn > 1) {
                            //代表删的是最后一个了
                            this.remarkConfig.pn -= 1;
                        }
                        this.$message({
                            message: this.$i.product.deleteSuccess,
                            type: "success"
                        });
                        this.getRemarkData();
                    }).catch(err => {

                    });
                }).catch(() => {

                });
            },
            createInquiry() {
                this.$windowOpen({
                    url: "/negotiation/createInquiry",
                    params: {
                        skus: this.$route.query.id,
                        supplierCodes: this.productForm.supplierCode
                    }
                });
            },
            createOrder() {
                this.$windowOpen({
                    url: "/order/create",
                    params: {
                        type: "product",
                        ids: this.productForm.id + ",",
                        supplierCode: this.productForm.supplierCode
                    }
                });
            },

            //添加比较
            addCompare() {
                this.showCompareList = true;
                let compareList = this.$localStore.get("compareProductList");
                let hasAdd = false;
                if (!compareList) {
                    compareList = [];
                }
                compareList.forEach(v => {
                    if (v.id === this.productForm.id) {
                        //代表该商品已经添加了
                        hasAdd = true;
                    }
                });
                if (hasAdd) {
                    this.$message({
                        message: "该商品已经添加到列表了",
                        type: "warning"
                    });
                } else {
                    compareList.push({
                        name: this.productForm.nameEn,
                        id: this.productForm.id
                    });
                    this.compareData = compareList;
                    this.$localStore.set("compareProductList", compareList);
                }
            },

            /**
             * compare-list操作
             * */
            getCompareList() {
                let data = this.$localStore.get("compareProductList");
                if (!data) {
                    this.compareData = [];
                } else {
                    this.compareData = data;
                }
            },
            handleClose(e) {
                let key;
                this.compareData.forEach((v, k) => {
                    if (v.id === e.id) {
                        key = k;
                    }
                });
                this.compareData.splice(key, 1);
                this.$localStore.set("compareProductList", this.compareData);
            },

            //去比较
            goCompare() {
                let data = this.$localStore.get("compareProductList");
                let id = "";
                data.forEach((v, k) => {
                    if (k === data.length - 1) {
                        id += v.id;
                    } else {
                        id += (v.id + ",");
                    }
                });
                this.$windowOpen({
                    url: "/product/compareDetail/new",
                    params: {
                        id: id
                    }
                });
            },

            //清空数据
            clearData() {
                this.$localStore.remove("compareProductList");
                this.compareData = [];
            },

            //获取字典
            getUnit() {
                this.notLoadingDone = true;
                const unit = this.$ajax.post(this.$apis.get_partUnit, ["ITM", "SKU_SALE_STATUS", "SKU_UNIT", "ED_UNIT", "QUARANTINE_TYPE", "WT_UNIT", "VE_UNIT", "LH_UNIT", "OEM_IS", "UDB_IS", "SKU_PG_IS","SKU_FORMATION"], { cache: true });
                const country = this.$ajax.get(this.$apis.get_country, {}, { cache: true });
                this.$ajax.all([unit, country]).then(res => {
                    res[0].forEach(v => {
                        if (v.code === "ITM") {
                            this.incotermOption = v.codes;
                        } else if (v.code === "SKU_SALE_STATUS") {
                            this.skuSaleStatusOption = v.codes;
                        } else if (v.code === "SKU_UNIT") {
                            this.skuUnitOption = v.codes;
                        } else if (v.code === "ED_UNIT") {
                            this.expirationOption = v.codes;
                        } else if (v.code === "QUARANTINE_TYPE") {
                            this.quarantineTypeOption = v.codes;
                        } else if (v.code === "WT_UNIT") {
                            this.weightOption = v.codes;
                        } else if (v.code === "VE_UNIT") {
                            this.volumeOption = v.codes;
                        } else if (v.code === "LH_UNIT") {
                            this.lengthOption = v.codes;
                        } else if (v.code === "OEM_IS") {
                            this.oemOption = v.codes;
                        } else if (v.code === "UDB_IS") {
                            this.udbOption = v.codes;
                        } else if (v.code === "SKU_PG_IS") {
                            this.skuPkgOption = v.codes;
                        } else if (v.code === "SKU_FORMATION") {
                            this.formationOption = v.codes;
                        }
                    });
                    this.countryOption = res[1];
                    this.getTableData();
                    this.getRemarkData();
                    this.getCompareList();
                }).finally(() => {
                    this.notLoadingDone = true;
                });
            }
        },
        created() {
            this.getUnit();
        },
        mounted() {
            this.setMenuLink({
                path: "/logs/index",
                query: { code: "PRODUCT" },
                type: 10,
                auth: "PRODUCT:LOG",
                label: this.$i.common.log
            });
            this.setMenuLink({
                path: "/product/bookmarkArchive",
                type: 20,
                auth: "PRODUCT:ARCHIVE",
                label: this.$i.common.archive
            });
        }
    };
</script>

<style scoped>
    .Details {
        background-color: #f4f4f4;
    }

    .Details .head {
        background-color: #FFFFFF;
        padding: 0 20px;

    }

    .Details .head .title {
        position: relative;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        font-size: 18px;
        color: #666666;
    }

    .Details .head .title .btn {
        position: absolute;
        right: 10px;
        top: 4px;
    }

    .Details .head .detail {
        margin-top: 8px;
    }

    .Details .head .detail .carousel-img {
        height: 170px;
    }

    .Details .head .detail .carousel-img img {
        width: 100%;
        height: 100%;
    }

    .Details .head .detail .right {
        /*padding-top: 10px;*/
    }

    .Details .head .detail .list {
        /*padding-left: 30px;*/
        /*font-size: 14px;*/
        /*line-height: 2.5;*/
        /*border-bottom: 1px dotted #e0e0e0;*/
    }

    .Details .head .detail .list >>> .el-form-item.el-form-item--small {
        margin-bottom: 6px;
    }

    .Details .head .detail .btns {
        text-align: center;
        padding: 15px 0;
    }

    .Details .head .detail .btns > Button {
        margin-right: 10px;
    }

    .Details .body {
        margin-top: 10px;
        margin-bottom: 35px;
        background-color: #FFFFFF;
    }

    .Details .body .list {
        line-height: 35px;
        font-size: 13px;
        min-height: 35px;
    }

    .Details .body .list >>> label {
        /*text-align: right;*/
    }

    .bigFont {
        font-weight: 600;
        font-size: 14px;
        color: #777777;
    }

    .speForm .el-form-item--small.el-form-item {
        margin-bottom: 0;
    }

    .speForm .el-row .list .el-input {
        width: 80%;
    }
</style>
