<template>
    <div>
        <overview-page
                :title="$i.product.bookmark"
                :label-width="labelWidth"
                :form-column="$db.product.overview"
                :tableData="productData"
                :pageData="pageData"
                :tableButtons="[{label: $i.product.detailBig, type: 1,auth:'PRODUCT:BOOKMARK_DETAIL'}]"
                :loadingTable="loadingTable"
                tableCode="udata_purchase_sku_bookmark_overview"
                @search="getData"
                @tableBtnClick="btnClick"
                @change-sort="val=>{getData(val)}"
                @change-checked="changeChecked">
            <template slot="btns">
                <el-button
                        @click="createInquiry"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:CREATE_INQUIRY'">
                    {{$i.product.createInquiry}}({{selectList.length}})
                </el-button>
                <el-button
                        @click="createOrder"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:CREATE_ORDER'">
                    {{$i.product.createOrder}}({{selectList.length}})
                </el-button>
                <el-button
                        @click="compareProducts"
                        :disabled="selectList.length<2"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:COMPARE'">
                    {{$i.product.compare}}({{selectList.length}})
                </el-button>
                <el-button
                        @click="addProduct"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:ADD_PRODUCT'">
                    {{$i.product.addNewProductEn}}
                </el-button>
                <el-button @click="manuallyAddProduct"
                           v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:MANUALLY_ADD'">
                    {{$i.product.manuallyAdd}}
                </el-button>
                <el-button
                        @click="()=>$refs.importCategory.show()"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:UPLOAD'">
                    {{$i.button.upload}}
                </el-button>
                <el-button
                        @click="download"
                        :disabled="productData.length===0"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:DOWNLOAD'">
                    {{$i.button.download}}({{selectList.length===0?$i.product.all:selectList.length}})
                </el-button>
                <el-button
                        type="danger"
                        :disabled="selectList.length<1"
                        v-authorize="'PRODUCT:BOOKMARK_OVERVIEW:DELETE'"
                        @click="deleteBookmark">
                    {{$i.button.remove}}
                </el-button>
            </template>
            <v-pagination slot="pagination"
                          @change="val=>{getData({pn:val})}"
                          @size-change="val=>{getData({ps:val})}"
                          :page-sizes="[50,100,200,500]"
                          :page-data="pageData"></v-pagination>
        </overview-page>

        <el-dialog :title="$i.product.addProduct" :visible.sync="addProductDialogVisible" width="75%">
            <v-product
                    ref="addProduct"
                    queryType="product"
                    :form-column="$db.product.overview"
                    :disabledLine="disableProductLine"
                    @sure="handleSure"
                    @cancel="handleCancel"></v-product>
        </el-dialog>

        <el-dialog :title="$i.product.followingProductCantAddOrder" :visible.sync="dialogFormVisible" width="50%">
            <el-table
                    :data="disabledOrderList"
                    border
                    style="width: 100%">
                <el-table-column
                        label="#"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$i.product.skuNameEn"
                        width="180">
                    <template slot-scope="scope">
                        {{scope.row.nameEn.value}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$i.product.skuCode">
                    <template slot-scope="scope">
                        {{scope.row.code.value}}
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <v-import-template ref="importCategory" code="BIZ_SKU_PURCHASE_IMPORT"
                           biz-code="BIZ_SKU_PURCHASE_IMPORT"></v-import-template>
    </div>
</template>
<script>
    import { overviewPage, VPagination, VProduct, VImportTemplate } from "@/components/index";
    import { mapActions } from "vuex";

    export default {
        name: "bookmark",
        components: {
            overviewPage,
            VPagination,
            VProduct,
            VImportTemplate
        },
        data() {
            return {
                title: this.$i.product.title,
                type: "product",
                formDatabase: this.$db.product.overview,
                labelWidth: 220,
                productData: [],
                pageData: {},            //分页配置
                selectList: [],
                loadingTable: false,
                queryConfig: {
                    pn: 1,
                    ps: 50,
                    recycle: false
                },
                disabledCompare: true,
                disabledOrderList: [],
                dialogFormVisible: false,
                addProductDialogVisible: false,
                disableProductLine: [],

                /**
                 * 按钮状态
                 * */
                disabledDownload: true,
                loadingAddBookmark: false,


                /**
                 * 字典配置
                 * */
                statusOption: [],
                weightOption: [],
                dateOption: [],
                volumeOption: [],
                lengthOption: [],
                skuUnitOption: [],
                formationOption: []
            };
        },
        methods: {
            ...mapActions(["setMenuLink"]),
            /**
             * 表格事件
             * */
            getData(query) {
                if (query) {
                    if (!query.categoryId) {
                        query.categoryId = null;
                    }
                    if (query.readilyAvailable === "1") {
                        query.readilyAvailable = true;
                    } else if (query.readilyAvailable === "0") {
                        query.readilyAvailable = false;
                    }
                }
                Object.assign(this.queryConfig, query);
                let params = this.$depthClone(this.queryConfig);
                if (_.isArray(params.country)) {
                    params.country = params.country.join(",");
                }
                this.loadingTable = true;
                this.$ajax.post(this.$apis.get_buyerBookmarkList, params).then(res => {
                    this.productData = this.$getDB(this.$db.product.indexTable, res.datas, (e) => {
                        if (e.noneSellCountry.value) {
                            e.noneSellCountry._value = _.map(e.noneSellCountry.value.split(","), item => {
                                return (_.findWhere(this.countryOption, { code: item }) || {}).name;
                            }).join(",");
                        }
                        if (e.mainSaleCountry.value) {
                            e.mainSaleCountry._value = _.map(e.mainSaleCountry.value.split(","), item => {
                                return (_.findWhere(this.countryOption, { code: item }) || {}).name;
                            }).join(",");
                        }

                        e.status._value = (_.findWhere(this.statusOption, { code: String(e.status.value) }) || {}).name;
                        e.expireUnit._value = (_.findWhere(this.dateOption, { code: String(e.expireUnit.value) }) || {}).name;
                        e.unit._value = (_.findWhere(this.skuUnitOption, { code: String(e.unit.value) }) || {}).name;
                        e.unitLength._value = (_.findWhere(this.lengthOption, { code: String(e.unitLength.value) }) || {}).name;
                        e.unitVolume._value = (_.findWhere(this.volumeOption, { code: String(e.unitVolume.value) }) || {}).name;
                        e.unitWeight._value = (_.findWhere(this.weightOption, { code: String(e.unitWeight.value) }) || {}).name;
                        e.yearListed.value = this.$dateFormat(e.yearListed.value, "yyyy-mm");
                        e.formation._value=(_.findWhere(this.formationOption,{code:e.formation.value}) || {}).name;

                        if (this.disableBookmarkChoose && e.bookmarkId.value) {
                            this.$set(e, "_disabled", true);
                        }
                        return e;
                    });
                    this.pageData = res;
                    this.selectList = [];
                }).finally(err => {
                    this.loadingTable = false;
                });
            },
            btnClick(e) {
                if (!e._disabled) {
                    this.$windowOpen({
                        url: "/product/bookmarkDetail",
                        params: {
                            id: e.skuId.value,
                            bookmarkId: e.id.value
                        }
                    });
                }
            },
            changeSort(e) {
                console.log(e, "val");
            },
            changeChecked(e) {
                this.selectList = e;
            },

            /**
             * 按钮事件
             * */
            createInquiry() {
                if (this.selectList.length === 0) {
                    this.$windowOpen({
                        url: "/negotiation/createInquiry"
                    });
                } else {
                    let skus = _.pluck(_.pluck(this.selectList, "skuId"), "value").join(",");
                    let supplierCodes = _.pluck(_.pluck(this.selectList, "supplierCode"), "value").join(",");
                    this.$windowOpen({
                        url: "/negotiation/createInquiry",
                        params: {
                            skus: skus,
                            supplierCodes: supplierCodes
                        }
                    });
                }
            },
            createOrder() {
                if (this.selectList.length === 0) {
                    this.$windowOpen({
                        url: "/order/create"
                    });
                } else {
                    this.disabledOrderList = [];
                    _.map(this.selectList, v => {
                        if (v.customerCreate.value) {
                            this.disabledOrderList.push(v);
                        }
                    });
                    if (this.disabledOrderList.length > 0) {
                        return this.dialogFormVisible = true;
                    }

                    let supplierList = _.uniq(_.pluck(_.pluck(this.selectList, "supplierCode"), "value"));
                    if (supplierList.length > 1) {
                        return this.$message({
                            message: this.$i.product.notAddDifferentSupplierProduct,
                            type: "warning"
                        });
                    }
                    let ids = _.pluck(_.pluck(this.selectList, "skuId"), "value").join(",");
                    this.$windowOpen({
                        url: "/order/create",
                        params: {
                            type: "product",
                            ids: ids,
                            supplierCode: supplierList[0]
                        }
                    });
                }
            },
            compareProducts() {
                if (this.selectList.length > 100) {
                    return this.$message({
                        message: this.$i.product.compareRecordMustLessThan100,
                        type: "success"
                    });
                }
                let id = _.pluck(_.pluck(this.selectList, "skuId"), "value").join(",");
                this.$windowOpen({
                    url: "/product/compareDetail/new",
                    params: {
                        id: id
                    }
                });
            },
            addProduct() {
                this.disableProductLine = _.pluck(_.pluck(this.productData, "skuId"), "value");
                this.addProductDialogVisible = true;
                if (this.$refs.addProduct) {
                    this.$refs.addProduct.getData();
                }
            },
            manuallyAddProduct() {
                this.$windowOpen({
                    url: "/product/bookmarkManuallyAdd"
                });
            },
            download() {
                let ids = _.pluck(_.pluck(this.selectList, "skuId"), "value");
                if (ids.length > 0) {
                    this.$fetch.export_task("SKU_PURCHASE_EXPORT_IDS", { ids: ids });
                } else {
                    let params = this.$depthClone(this.queryConfig);
                    if (_.isArray(params.country)) {
                        params.country = params.country.join(",");
                    }
                    this.$fetch.export_task("SKU_PURCHASE_EXPORT_BOOKMARK_PARAMS", params);
                }
            },
            deleteBookmark() {
                this.$confirm(this.$i.product.sureDelete, this.$i.product.prompt, {
                    confirmButtonText: this.$i.product.sure,
                    cancelButtonText: this.$i.product.cancel,
                    type: "warning"
                }).then(() => {
                    let params = [];
                    _.map(this.selectList, v => {
                        params.push({
                            id: v.id.value,
                            name: v.nameEn.value
                        });
                    });
                    this.loadingTable = true;
                    this.$ajax.post(this.$apis.delete_buyerProductBookmark, params).then(res => {
                        this.selectList = [];
                        this.$message({
                            type: "success",
                            message: this.$i.product.deleteSuccess
                        });
                        this.getData();
                    }).finally(() => {
                        this.loadingTable = false;
                    });
                }).finally(() => {

                });
            },
            getUnit() {
                let unit, country;
                unit = this.$ajax.post(this.$apis.get_partUnit, ["SKU_SALE_STATUS", "WT_UNIT", "ED_UNIT", "VE_UNIT", "LH_UNIT", "SKU_UNIT","SKU_FORMATION"], { cache: true });
                country = this.$ajax.get(this.$apis.get_country, {}, { cache: true });

                this.$ajax.all([unit, country]).then(res => {
                    res[0].forEach(v => {
                        if (v.code === "SKU_SALE_STATUS") {
                            this.statusOption = v.codes;
                        } else if (v.code === "WT_UNIT") {
                            this.weightOption = v.codes;
                        } else if (v.code === "ED_UNIT") {
                            this.dateOption = v.codes;
                        } else if (v.code === "VE_UNIT") {
                            this.volumeOption = v.codes;
                        } else if (v.code === "LH_UNIT") {
                            this.lengthOption = v.codes;
                        } else if (v.code === "SKU_UNIT") {
                            this.skuUnitOption = v.codes;
                        } else if (v.code === "SKU_FORMATION") {
                            this.formationOption = v.codes;
                        }
                    });
                    if (this.$route.params.supplierName) {
                        this.productForm.supplierNameLike = this.$route.params.supplierName;
                    }
                    this.countryOption = res[1];
                    this.getData();
                }).finally(() => {
                    this.loadingTable = false;
                });
            },

            /**
             * add Product弹出框事件
             * */
            handleSure(e) {
                this.addProductDialogVisible = false;
                this.loadingTable = true;
                let id = _.pluck(_.pluck(e, "id"), "value");
                this.$ajax.post(this.$apis.add_buyerBookmark, id).then(res => {
                    this.$message({
                        message: this.$i.product.successfullyAdd,
                        type: "success"
                    });
                    this.getData();
                }).finally(() => {

                });
            },
            handleCancel() {
                this.addProductDialogVisible = false;
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

</style>
