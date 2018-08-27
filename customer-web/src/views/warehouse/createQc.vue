<template>
    <div class="create-qc" v-loading="loadingData">
        <div class="title">
            <span>{{$i.warehouse.createQcOrder}}</span>
        </div>
        <div class="second-title">
            {{$i.warehouse.basicInfo}}
        </div>
        <div>
            <el-form label-width="190px">
                <el-row class="speZone">
                    <el-col v-for="v in $db.warehouse.qcOrderDetailBasicInfo" :key="v.key" class="speCol" :xs="24"
                            :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:8" :xl="v.fullLine?24:8">
                        <el-form-item :label="$i.warehouse[v.key]"
                                      :required="v.isServiceName?true:(v._rules?v._rules.required:false)">
                            <div v-if="v.type==='input'">
                                <el-input
                                        :disabled="v.disabled || v.isServiceFill"
                                        :placeholder="v.isSysGen?$i.warehouse.systemGeneration:(v.isServiceFill?$i.warehouse.serviceFill:$i.warehouse.pleaseInput)"
                                        v-model="qcOrderConfig[v.key]">
                                </el-input>
                            </div>
                            <div v-else-if="v.type==='select'">
                                <div v-if="v.isQcStatus">
                                    <el-select
                                            class="speInput"
                                            v-model="qcStatusCode"
                                            :disabled="true">
                                        <el-option
                                                v-for="item in qcStatusOption"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else-if="v.isServiceName">
                                    <el-select
                                            clearable
                                            class="speInput"
                                            size="mini"
                                            v-model="serviceId"
                                            filterable
                                            :placeholder="$i.warehouse.pleaseInputOrChoose"
                                            :remote-method="remoteMethod"
                                            :loading="loading">
                                        <el-option
                                                v-for="item in serviceList"
                                                :key="item.companyId"
                                                :label="item.name"
                                                :value="item.companyId">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    <el-select
                                            class="speInput"
                                            v-model="qcOrderConfig[v.key]"
                                            clearable
                                            @change="val => selectChange(v.key, val)"
                                            :disabled="v.isServiceFill"
                                            :placeholder="v.isServiceFill?$i.warehouse.serviceFill:$i.warehouse.pleaseChoose">
                                        <div v-if="v.isQcType">
                                            <el-option
                                                    v-for="item in qcTypeOption"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.code">
                                            </el-option>
                                        </div>
                                        <div v-else-if="v.isAddress">
                                             <el-option
                                                v-for="item in qcAddress"
                                                :key="item.id"
                                                :label="item.address"
                                                :value="item.id">
                                            </el-option>
                                        </div>
                                        <!--<div v-else-if="v.isQcStatus">-->
                                        <!--<el-option-->
                                        <!--v-for="item in qcStatusOption"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.code">-->
                                        <!--</el-option>-->
                                        <!--</div>-->
                                        <div v-else-if="v.isQcMethod">
                                            <el-option
                                                    v-for="item in qcMethodOption"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.code">
                                            </el-option>
                                        </div>
                                        <div v-else-if="v.isSurveyor">
                                            <el-option
                                                    v-for="item in surveyorOption"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.code">
                                            </el-option>
                                        </div>
                                        <div v-else-if="v.isCurrency">
                                            <el-option
                                                    v-for="item in currencyOptions"
                                                    :key="item.id"
                                                    :label="item.code"
                                                    :value="item.code">
                                            </el-option>
                                        </div>
                                    </el-select>
                                </div>
                            </div>
                            <div v-else-if="v.type==='date'">
                                <el-date-picker
                                        class="speInput"
                                        v-model="qcOrderConfig[v.key]"
                                        align="right"
                                        type="date"
                                        :disabled="v.isServiceFill"
                                        :placeholder="v.isServiceFill?$i.warehouse.serviceFill:$i.warehouse.pleaseChoose"
                                        :picker-options="pickerOptions1">
                                </el-date-picker>
                            </div>
                            <div v-else-if="v.type==='number'">
                                <el-input-number
                                        :controls="false"
                                        v-model="qcOrderConfig[v.key]"
                                        :disabled="v.isServiceFill"
                                        class="speInput speNumber"></el-input-number>
                            </div>
                            <div v-else-if="v.type==='textarea'">
                                <el-input

                                        type="textarea"
                                        :autosize="{ minRows: 2}"
                                        :placeholder="$i.warehouse.pleaseInput"
                                        v-model="qcOrderConfig[v.key]">
                                </el-input>
                            </div>
                            <div v-else-if="v.type==='attachment'" class="uploadview">
                                <v-upload :limit="20" ref="upload"></v-upload>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="second-title">
            {{$i.warehouse.productInfo}}
        </div>
        <div class="product-info">
            <div class="btns">
                <el-button
                        type="primary"
                        @click="addProduct">{{$i.warehouse.addProduct}}</el-button>
                <el-button
                        type="danger"
                        :disabled="disableRemoveProduct"
                        @click="removeProduct">{{$i.warehouse.remove}}
                </el-button>
            </div>
            <div class="gear">
                <v-filter-column
                    ref="filterColumn"
                    code="uwarehouse_qc_order_detail"
                    :table-ref="() => $refs.tableBox"
                    @change="changeColumn">
                </v-filter-column>
            </div>
            <el-table
                    v-loading="loadingProductTable"
                    class="product-table"
                    :data="productTableData"
                    border
                    show-summary
                    ref="tableBox"
                    :summary-method="getSummaries"
                    @selection-change="handleProductTableChange"
                    style="width: 100%">
                <el-table-column
                        fixed="left"
                        type="selection"
                        align="center"
                        class="table-checkbox"
                        width="55">
                </el-table-column>
                <el-table-column
                        v-for="v in columnConfig"
                        :key="v.key"
                        :prop="v.key"
                        v-if="!v._hidden && !v._hide"
                        :label="$i.warehouse[v.key]"
                        align="center"
                        :label-class-name="'location-' + v.key"
                        :class-name="v.key === 'expectQcQty' ? 'ucn-table-required' : ''"
                        width="240">
                    <template slot-scope="scope" v-if="scope.row[v.key]">
                        <div v-if="v.showType==='qc'">
                        </div>
                        <div v-else-if="v.fromService">
                            {{scope.row[v.key].value}}
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <v-input-number
                                    v-model="scope.row[v.key].value"
                                    :min="0"
                                    :controls="false"
                                    :mark="v.label"
                                    :accuracy="v.accuracy ? v.accuracy : null"
                                    label="please input"></v-input-number>
                            <!-- <el-input :min="0" style="width:150px"  @change="val => changeInput(val, scope.row[v.key], scope.$index)" v-model="scope.row[v.key].value" type="number"></el-input> -->
                        </div>
                        <div v-else-if="v.showType==='input'">
                            <el-input
                                    placeholder="please input"
                                    v-model="scope.row[v.key].value"
                                    clearable>
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='date'">
                            {{scope.row[v.key]?$dateFormat(scope.row[v.key].value,"yyyy-mm-dd"):""}}
                        </div>
                        <div v-else>
                            {{scope.row[v.key].value}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        :label="$i.warehouse.action"
                        width="80">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" v-authorize="'PRODUCT:DETAIL'" size="small">{{$i.warehouse.detail}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="footBtn">
            <el-button @click="submit" :loading="disableClickSubmit" :disabled="disableSubmit" type="primary">
                {{$i.warehouse.submit}}
            </el-button>
            <el-button @click="cancel" type="danger">{{$i.warehouse.cancel}}</el-button>
        </div>

        <el-dialog
                width="70%"
                :title="$i.warehouse.addProduct"
                :visible.sync="productDialogVisible"
                custom-class="ucn-dialog-center">
            <el-form ref="qcOrder" :model="productDialogConfig" label-width="120px">
                <el-row class="speZone">
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="orderNo" :label="$i.warehouse.orderNo">
                            <el-input
                                    class="dialogInput"
                                    size="mini"
                                    placeholder="please input"
                                    v-model="productDialogConfig.orderNo">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="inboundNo" :label="$i.warehouse.inboundNo">
                            <el-input
                                    class="dialogInput"
                                    size="mini"
                                    placeholder="please input"
                                    v-model="productDialogConfig.inboundNo">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="skuBarCode" :label="$i.warehouse.skuBarCode">
                            <el-input
                                    class="dialogInput"
                                    size="mini"
                                    placeholder="please input"
                                    v-model="productDialogConfig.skuBarCode">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="skuNameEn" :label="$i.warehouse.skuNameEn">
                            <el-input
                                    class="dialogInput"
                                    size="mini"
                                    placeholder="please input"
                                    v-model="productDialogConfig.skuNameEn">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="btn-group">
                <el-button
                        type="primary"
                        @click="search"
                        :loading="loadingProductDialogTable"
                        :disabled="loadingProductDialogTable">{{$i.warehouse.search}}
                </el-button>
                <el-button @click="clear" :disabled="loadingProductDialogTable">{{$i.warehouse.clear}}</el-button>
            </div>
            <v-table
                code="uwarehouse_inbound_sku"
                v-loading="loadingProductDialogTable"
                :data="productDialogTableData"
                :buttons="[{label: $i.warehouse.detail, type: 1}]"
                @action="btnClick"
                @change-checked="changeProductDialogChecked"
                @change-sort="val=>{getDialogProductData(val)}">
            </v-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :disabled="loadingProductDialogTable" @click="postProduct">{{ $i.warehouse.add }}</el-button>
                <el-button :disabled="loadingProductDialogTable" @click="productDialogVisible = false">{{$i.warehouse.cancel}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

    import { VTimeZone, VPagination, VUpload, VTable, VFilterColumn, VInputNumber } from "@/components/index";

    export default {
        name: "createQc",
        components: {
            VTable,
            VTimeZone,
            page: VPagination,
            VUpload,
            VFilterColumn,
            VInputNumber
        },
        data() {
            return {
                value: "",
                options: [],
                pageData: {},
                tableDataList: [],
                loadingTable: false,
                companyId:'',
                /**
                 * service provider数据处理
                 * */
                serviceId: "",
                serviceList: [],         //用于展现的数组
                serviceMainList: [],     //用于存储总数据的数组
                loading: false,
                /**
                 * 页面基本配置
                 * */
                loadingData: false,
                disableRemoveProduct: true,
                disableClickSubmit: false,
                loadingProductTable: false,
                disableSubmit: false,
                serviceDialogVisible: false,
                radio: "",
                currencyOptions: [],
                qcStatusCode: "WAITING_QC",
                qcStatusOption: [],
                selectProductTableData: [],      //页面上选中的table data
                productTableData: [],
                productConfig: {
                    ids: [],
                    pn: 1,
                    ps: 50,
                    orderNo: ""
                },
                qcOrderConfig: {
                    attachments: [],
                    exchangeCurrencyDictCode: "CNY",
                    exchangeCurrencyDictId: "33",
                    factoryAddress: "",
                    factoryContactPhone: "",
                    qcOrderDetailCreateParams: [],
                    remark: "",
                    serviceName: "",
                    serviceProviderId: 0,
                    serviceProviderNo: ""

                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() + 3600 * 1000 * 24 < Date.now();
                    }
                },

                /**
                 * 弹出框配置
                 * */
                dialogRules: {
                    orderNo: [
                        {
                            required: true
                        }
                    ]
                },
                loadingProductDialogTable: false,
                productDialogTableData: [],
                selectProductList: [],
                productDialogVisible: false,
                productDialogConfig: {
                    ids: [],
                    orderNo: "",
                    pn: 1,
                    ps: 200,
                    skuBarCode: "",
                    // skuCode: "",
                    inboundNo: "",
                    skuNameEn: ""
                },
                qcOrderBasic: {},

                /**
                 * 总计data
                 * */
                summaryData: {
                    skuQuantity: ""
                },

                /**
                 * 字典数据
                 * */
                qcTypeOption: [],
                qcMethodOption: [],
                surveyorOption: [],
                qcResultOption: [],
                barCodeResult: [],
                skuUnitOption: [],       //计量单位
                lengthOption: [],
                volumeOption: [],
                weightOption: [],
                qcAddress: [],
                columnConfig: ''
            };
        },
        methods: {
            changeColumn(val) {
                this.productTableData = this.$refs.filterColumn.getFilterData(this.productTableData, val);
                this.columnConfig = this.productTableData[0];
            },
            getQcNo(){
                this.loadingData=true;
                this.$ajax.post(this.$apis.GET_WAREHOUSE_NO,{
                    type:'qc_order_no'
                }).then(res=>{
                    this.qcOrderConfig.qcOrderNo=res.content;
                    this.getService();
                    this.getUnit();
                    if (this.$route.query.ids) {
                        this.productConfig.orderNo = this.$route.query.orderNo;
                        this.productConfig.ids = this.$route.query.ids.split(",");
                        this.loadingProductTable = true;
                        this.$ajax.post(this.$apis.get_qcProductData, this.productConfig).then(res => {
                            if (!this.companyId) {
                                this.companyId = res[0].companyId
                            }
                            this.loadingProductTable = false;
                        this.productTableData = []
                        _.map(res, v => {
                            if (v.id !== 0) {
                                // v.skuUnitDictCode = v.skuUnitDictCode ? (_.findWhere(this.skuUnitOption, { code: v.skuUnitDictCode }) || {}).name : "";
                                // v.volumeUnitDictCode = v.volumeUnitDictCode ? (_.findWhere(this.volumeOption, { code: v.volumeUnitDictCode }) || {}).name : '';
                                // v.weightUnitDictCode = v.weightUnitDictCode ? (_.findWhere(this.weightOption, { code: v.weightUnitDictCode }) || {}).name : '';
                                // v.lengthUnitDictCode =  v.lengthUnitDictCode ? (_.findWhere(this.lengthOption, { code: v.lengthUnitDictCode }) || {}).name : '';
                                // v.skuQcResultDictCode = '';
                                // v.checkOuterCartonQty = '';
                                // v.qcPic = '';
                                // v.remark = '';
                                // v.shippingMarkResultDictCode = '';
                                // v.outerCartonBarCodeResultDictCode = '';
                                // v.innerPackingBarCodeResultDictCode = '';
                                // v.skuLabelResultDictCode = '';
                                // v.skuBarCodeResultDictCode = '';
                                // v.unqualifiedSkuGrossWeight = '';
                                // v.qualifiedSkuGrossWeight = '';
                                // v.unqualifiedSkuVolume = '';
                                // v.qualifiedSkuVolume = '';
                                // v.unqualifiedSkuNetWeight = '';
                                // v.qualifiedSkuNetWeight = '';
                                // v.unqualifiedSkuQty = '';
                                // v.qualifiedSkuQty = '';
                                // v.actSkuQty = '';
                                // v.unqualifiedSkuCartonTotalQty = '';
                                // v.qualifiedSkuCartonTotalQty = '';
                                // v.actSkuCartonTotalQty = '';
                                // v.outerCartonGrossWeight = '';
                                // v.actInnerCartonSkuQty = ''; // 1
                                // v.innerCartonSkuQty = '';// 来自Order
                                // v.actOuterCartonInnerBoxQty = ''; // 1
                                // v.outerCartonInnerBoxQty = '';// 来自Order
                                // v.actOuterCartonSkuQty = ''; // 1
                                // v.unqualifiedProcessingMode = '';
                                // v.samplingRate = '';
                                // this.productTableData.push(v);
                                v.skuUnitDictCode = v.skuUnitDictCode ? (_.findWhere(this.skuUnitOption, { code: v.skuUnitDictCode }) || {}).name : "";
                                v.volumeUnitDictCode = v.volumeUnitDictCode ? (_.findWhere(this.volumeOption, { code: v.volumeUnitDictCode }) || {}).name : '';
                                v.weightUnitDictCode = v.weightUnitDictCode ? (_.findWhere(this.weightOption, { code: v.weightUnitDictCode }) || {}).name : '';
                                v.lengthUnitDictCode =  v.lengthUnitDictCode ? (_.findWhere(this.lengthOption, { code: v.lengthUnitDictCode }) || {}).name : '';
                                v.skuQcResultDictCode = '';
                                v.checkOuterCartonQty = '';
                                v.qcPic = '';
                                v.remark = '';
                                v.shippingMarkResultDictCode = '';
                                v.outerCartonBarCodeResultDictCode = '';
                                v.innerPackingBarCodeResultDictCode = '';
                                v.skuLabelResultDictCode = '';
                                v.skuBarCodeResultDictCode = '';
                                v.unqualifiedSkuGrossWeight = '';
                                v.qualifiedSkuGrossWeight = '';
                                v.unqualifiedSkuVolume = '';
                                v.qualifiedSkuVolume = '';
                                v.unqualifiedSkuNetWeight = '';
                                v.qualifiedSkuNetWeight = '';
                                v.unqualifiedSkuQty = '';
                                v.qualifiedSkuQty = '';
                                v.actSkuQty = '';
                                v.unqualifiedSkuCartonTotalQty = '';
                                v.qualifiedSkuCartonTotalQty = '';
                                v.actSkuCartonTotalQty = '';
                                v.actInnerCartonSkuQty = '';
                                v.innerCartonSkuQty = '';// 来自Order
                                v.actOuterCartonInnerBoxQty = '';
                                v.outerCartonInnerBoxQty = '';// 来自Order
                                v.actOuterCartonSkuQty = '';
                                v.unqualifiedProcessingMode = '';
                                v.samplingRate = '';
                                v.expectQcQty = 0
                                this.productTableData.push(v);
                            }
                        });
                        let arr = this.$copyArr(this.productTableData)
                        arr = this.$getDB(this.$db.warehouse.createQcProductTable, arr);
                        this.$refs.filterColumn.update(false, arr).then(data => {
                            this.productTableData = this.$refs.filterColumn.getFilterData(arr, data);
                            this.columnConfig = this.productTableData[0];
                        });
                        }).finally(err => {
                            this.loadingProductTable = false;
                        });
                    }
                }).catch(err=>{
                    this.loadingData=false;
                })
            },
            submit() {
                if (this.$validateForm(this.qcOrderConfig, this.$db.warehouse.qcOrderDetailBasicInfo)) {
                    return;
                }
                if (!this.serviceId) {
                    return this.$message({
                        message: this.$i.warehouse.pleaseChooseService,
                        type: "warning"
                    });
                }
                this.serviceMainList.forEach(v => {
                    if (v.companyId === this.serviceId) {
                        this.qcOrderConfig.serviceName = v.name;
                        this.qcOrderConfig.serviceProviderId = v.companyId;
                        this.qcOrderConfig.serviceProviderNo = v.code;
                    }
                });
                this.currencyOptions.forEach(v => {
                    if (v.id === this.qcOrderConfig.exchangeCurrencyDictId) {
                        this.qcOrderConfig.exchangeCurrencyDictCode = v.code;
                    }
                });
                this.qcOrderConfig.qcOrderDetailCreateParams = [];

                if (_.isEmpty(this.productTableData)) {
                    return this.$message.warning(this.$i.warehouse.pleaseAddProduct);
                }

                let checkExpectQcQty = false;
                _.map(this.productTableData, v => {
                    if (v.id !== 0) {
                        if (!checkExpectQcQty) {
                            checkExpectQcQty = (!v.expectQcQty.value && v.expectQcQty.value !== 0);
                        }
                        this.qcOrderConfig.qcOrderDetailCreateParams.push({
                            expectQcQty: v.expectQcQty.value ? v.expectQcQty.value : 0,
                            inboundSkuId: v.id.value,
                            samplingRate: v.samplingRate.value,
                            unqualifiedProcessingMode: v.unqualifiedProcessingMode.value
                        });
                    }
                });

                if (checkExpectQcQty) {
                    return this.$message.warning(`${this.$i.util.validateRequired} ${this.$i.warehouse.expectQcQty}`);
                }

                this.qcOrderConfig.attachments = this.$refs.upload[0].getFiles();
                let newQcOrderConfig = _.clone(this.qcOrderConfig)
                _.each(this.qcAddress, e => {
                    if (this.qcOrderConfig.factoryAddress === e.id) {
                        newQcOrderConfig.factoryAddress = e.address
                    }
                })
                // console.log(newQcOrderConfig)
                // return
                this.disableClickSubmit = true;
                this.$ajax.post(this.$apis.add_buyerQcOrder, newQcOrderConfig).then(res => {
                    this.$message({
                        message: this.$i.warehouse.createSuccess,
                        type: "success"
                    });
                    this.$router.push("/warehouse/qcOverview");
                    this.disableClickSubmit = false;
                }).catch(err => {
                    this.disableClickSubmit = false;
                });
            },
            cancel() {
                window.close();
            },

            /**
             * 选择服务商的方法
             * */
            getService(name) {
                this.serviceList = [];
                this.serviceMainList = [];
                this.disableSubmit = true;
                if (!name) {
                    name = "";
                }
                this.$ajax.get(`${this.$apis.get_supplyProviders}?name=${name}`).then(res => {
                    res.forEach(v => {
                        this.serviceList.push(v);
                    });
                    this.$ajax.get(`${this.$apis.get_serviceProviders}?name=${name}`).then(res => {
                        res.forEach(v => {
                            this.serviceList.push(v);
                        });
                        this.serviceMainList = this.$copyArr(this.serviceList);
                        this.disableSubmit = false;
                    }).catch(err => {
                        this.disableSubmit = false;
                    });
                }).catch(err => {
                    this.disableSubmit = false;
                });
            },
            remoteMethod(query) {
                if (query !== "") {
                    this.serviceList = this.serviceMainList.filter(item => {
                        return item.name.indexOf(query) > -1;
                    });
                } else {
                    this.serviceList = this.$copyArr(this.serviceMainList);
                }
            },

            /**
             * 弹出框事件
             * */
            getDialogProductData(e){
                Object.assign(this.productDialogConfig, e)
                this.loadingProductDialogTable = true;
                this.$ajax.post(this.$apis.get_qcProductData, this.productDialogConfig).then(res => {
                    this.productDialogTableData = this.$getDB(this.$db.warehouse.createQcProductDialog, res, e => {
                        if (!e.canCreateQc.value) {
                            this.$set(e, "_disabled", true);
                        }
                    });
                    this.pageData = res;
                    this.productTableData.forEach(v => {
                        this.productDialogTableData.forEach(m => {
                            if (v.id.value === m.id.value) {
                                this.$set(m, "_checked", true);
                                this.$set(m, "_disabled", true);
                            }
                        });
                    });
                    this.productDialogTableData.forEach(v => {
                        if (v.id.value === 0) {
                            this.$set(v, "_disabled", true);
                        }
                    });
                    this.selectProductList = [];
                }).finally(() => {
                    this.loadingProductDialogTable = false;
                });
            },
            search() {
                this.getDialogProductData();
            },
            clear() {
                this.productDialogConfig.orderNo = "";
                this.productDialogConfig.skuBarCode = "";
                // this.productDialogConfig.skuCode = "";
                this.productDialogConfig.inboundNo = "";
                this.productDialogConfig.skuNameEn = "";
            },
            changeProductDialogChecked(e) {
                this.selectProductList = e;
            },
            btnClick(e) {
                this.$windowOpen({
                    url: "/product/sourcingDetail",
                    params: {
                        id: e.skuId.value
                    }
                });
            },
            postProduct() {
                this.productConfig.ids = [];
                _.map(this.selectProductList, v => {
                    this.productConfig.ids.push(v.id.value);
                });
                this.productDialogVisible = false;
                if (this.productConfig.ids.length !== 0) {
                    this.productConfig.orderNo = '';
                    this.loadingProductTable = true;
                    this.$ajax.post(this.$apis.get_qcProductData, this.productConfig).then(res => {
                        if (!this.companyId) {
                            this.companyId = res[0].companyId
                        }
                        this.loadingProductTable = false;
                        let oldData = _.clone(this.productTableData)
                        this.productTableData = []
                        _.map(res, v => {
                            if (v.id !== 0) {
                                v.skuUnitDictCode = v.skuUnitDictCode ? (_.findWhere(this.skuUnitOption, { code: v.skuUnitDictCode }) || {}).name : "";
                                v.volumeUnitDictCode = v.volumeUnitDictCode ? (_.findWhere(this.volumeOption, { code: v.volumeUnitDictCode }) || {}).name : '';
                                v.weightUnitDictCode = v.weightUnitDictCode ? (_.findWhere(this.weightOption, { code: v.weightUnitDictCode }) || {}).name : '';
                                v.lengthUnitDictCode =  v.lengthUnitDictCode ? (_.findWhere(this.lengthOption, { code: v.lengthUnitDictCode }) || {}).name : '';
                                v.skuQcResultDictCode = '';
                                v.checkOuterCartonQty = '';
                                v.qcPic = '';
                                v.remark = '';
                                v.shippingMarkResultDictCode = '';
                                v.outerCartonBarCodeResultDictCode = '';
                                v.innerPackingBarCodeResultDictCode = '';
                                v.skuLabelResultDictCode = '';
                                v.skuBarCodeResultDictCode = '';
                                v.unqualifiedSkuGrossWeight = '';
                                v.qualifiedSkuGrossWeight = '';
                                v.unqualifiedSkuVolume = '';
                                v.qualifiedSkuVolume = '';
                                v.unqualifiedSkuNetWeight = '';
                                v.qualifiedSkuNetWeight = '';
                                v.unqualifiedSkuQty = '';
                                v.qualifiedSkuQty = '';
                                v.actSkuQty = '';
                                v.unqualifiedSkuCartonTotalQty = '';
                                v.qualifiedSkuCartonTotalQty = '';
                                v.actSkuCartonTotalQty = '';
                                v.actInnerCartonSkuQty = '';
                                v.innerCartonSkuQty = '';// 来自Order
                                v.actOuterCartonInnerBoxQty = '';
                                v.outerCartonInnerBoxQty = '';// 来自Order
                                v.actOuterCartonSkuQty = '';
                                v.unqualifiedProcessingMode = '';
                                v.samplingRate = '';
                                v.expectQcQty = v.expectQcQty
                                this.productTableData.push(v);
                            }
                        });
                        let arr = this.$copyArr(this.productTableData)
                        arr = this.$getDB(this.$db.warehouse.createQcProductTable, arr);
                        _.each(arr, e => {
                            let flag = true
                            _.each(oldData, v => {
                                if (e.id.value === v.id.value) {
                                    flag = false
                                }
                            })
                            if (flag) {
                                oldData.push(e)
                            }
                        })
                        this.$refs.filterColumn.update(false, oldData).then(data => {
                            this.productTableData = this.$refs.filterColumn.getFilterData(oldData, data);
                            this.columnConfig = this.productTableData[0];
                        });
                    }).catch(err => this.loadingProductTable = false);
                }
            },

            /**
             * 页面操作事件
             * */
            addProduct() {
                this.productDialogTableData = [];
                this.productDialogVisible = true;
                this.getDialogProductData();
            },
            removeProduct() {
                this.$confirm(this.$i.warehouse.sureDelete, this.$i.warehouse.prompt, {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: "warning"
                }).then(() => {
                    this.productTableData = _.difference(this.productTableData, this.selectProductTableData);
                    this.selectProductTableData = [];
                    this.$message({
                        type: "success",
                        message: this.$i.warehouse.deleteSuccess
                    });
                }).catch(() => {

                });
            },
            handleProductTableChange(e) {
                this.selectProductTableData = e;
            },
            getSummaries(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.$i.warehouse.total;
                        return;
                    }else if(index===17 || index===18 || index===41 || index===42 || index===43 || index===44 || index===45 || index===46 || index===47 || index===48 || index===49 || index===50 || index===51 || index===52 || index===65){
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                        }else{
                            sums[index]='-';
                        }
                    }
                });

                return sums;
            },
            handleClick(e) {
                this.$windowOpen({
                    url: "/product/sourcingDetail",
                    params: {
                        id: e.skuId
                    }
                });
            },

            /**
             * 分页操作
             * */
            changePage(e) {
                console.log(e);
            },
            changeSize(e) {
                // this.warehouseConfig.ps=e;
                // this.getWarehouseData();
            },

            /**
             * 获取单位
             * */
            getUnit() {
                this.loadingData = true;
                this.$ajax.post(this.$apis.get_partUnit, ["QC_TYPE", "QC_MD", "SKU_QC_RS", "PB_CODE", "QC_STATUS", "SKU_UNIT", "LH_UNIT", "VE_UNIT", "WT_UNIT"], { cache: true }).then(res => {
                    res.forEach(v => {
                        if (v.code === "QC_TYPE") {
                            this.qcTypeOption = v.codes;
                        } else if (v.code === "QC_MD") {
                            this.qcMethodOption = v.codes;
                        } else if (v.code === "SKU_QC_RS") {
                            v.codes = _.filter(v.codes, e => {
                                return e.code !== "WAIT_FOR_QC" && e.code !== "CONFIRMED";
                            });
                            this.qcResultOption = v.codes;
                        } else if (v.code === "PB_CODE") {
                            this.barCodeResult = v.codes;
                        } else if (v.code === "QC_STATUS") {
                            this.qcStatusOption = v.codes;
                        } else if (v.code === "SKU_UNIT") {
                            this.skuUnitOption = v.codes;
                        } else if (v.code === "LH_UNIT") {
                            this.lengthOption = v.codes;
                        } else if (v.code === "VE_UNIT") {
                            this.volumeOption = v.codes;
                        } else if (v.code === "WT_UNIT") {
                            this.weightOption = v.codes;
                        }
                    });
                }).finally(() => {
                    this.loadingData = false;
                });


                this.$ajax.get(this.$apis.get_currencyUnit, {}, { cache: true }).then(res => {
                    this.currencyOptions = res;
                    this.loadingData = false;
                }).catch(err => {
                    this.loadingData = false;
                });

            },
            changeInput (val, e, index) {
                e.value = this.$toFixed(Math.abs(val), 2, e.label)
            },
            selectChange (k, v) {
                if (k === 'factoryAddress') {
                    _.each(this.qcAddress, e => {
                        if (v === e.id) {
                            this.qcOrderConfig.factoryContactPhone = e.phone
                        }   
                    })
                }
            }
        },
        created() {
            this.getQcNo();
        },
        mounted() {
            this.loadingData = true;
            this.columnConfig = this.$db.warehouse.createQcProductTable;
        },
        watch: {
            selectProductTableData(n) {
                if (n.length > 0) {
                    this.disableRemoveProduct = false;
                } else {
                    this.disableRemoveProduct = true;
                }
            },
            productDialogVisible(n) {
                if (!n) {
                    this.clear();
                    setTimeout(() => {
                        this.$refs.qcOrder.clearValidate();
                    }, 0);

                }
            },
            productTableData(n) {
                if (n.length > 0) {
                    let diffData = [];
                    n.forEach(v => {
                        diffData.push(v.skuId + v.orderNo);
                    });
                    this.summaryData.skuQuantity = _.uniq(diffData).length;
                }
            },
            companyId (val) {
                this.$ajax.get(this.$apis.GTEADDRESS, {
                    companyId: val
                }).then(res => {
                    _.each(res, e => {
                        this.qcAddress.push({
                            address: e.country + e.province + e.city + e.address,
                            id: e.id,
                            phone: e.concatPhone1
                        })
                    })
                    if (this.qcAddress.length > 0) {
                        this.qcOrderConfig.factoryAddress = this.qcAddress[0].id
                        this.qcOrderConfig.factoryContactPhone = this.qcAddress[0].phone
                    }
                }).catch(err => {
                });
            }
        }
    };
</script>
<style scoped>
    .title {
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color: #666666;
    }

    .second-title {
        font-size: 16px;
        color: #999999;
        padding: 10px 0;
    }

    .speCol {
        min-height: 51px;
    }

    .speInput {
        width: 80%;
    }

    .radios {
        margin-bottom: 10px;
    }

    .btn-group {
        text-align: center;
    }

    .dialogInput {
        width: 100%;
    }

    .dialog-footer {
        text-align: center;
    }

    .footBtn {
        border-top: 1px solid #e0e0e0;
        height: 40px;
        line-height: 40px;
        background-color: #ffffff;
        position: sticky;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: left;
        z-index: 5;
    }

    .speInput {
        width: 100%;
    }

    .speTimezone {
        max-width: 1000px !important;
        width: 80%;
    }

    .speTimezone /deep/ .el-select {
        display: block;
    }

    .product-table {
        margin-top: 10px;
    }

    .product-table /deep/ .el-checkbox {
        margin: 0;
    }

    .summary {
        margin-top: 50px;
    }

    .summaryInput {
        width: 80%;
    }

    .summaryInput /deep/ input {
        text-align: center;
    }
    .gear{
        float: right;
        margin-right: 5px;
        margin-bottom: 5px;
    }
    .uploadview /deep/ .upload-files /deep/ li{
        padding-right: 20px;
    }
</style>
