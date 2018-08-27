<template>
    <div class="create-order" v-loading="loadingPage">
        <div class="title">
            {{$i.order.basicInfo}}
        </div>
        <el-form ref="basicInfo" class="speForm" label-width="250px" :label-position="labelPosition">
            <el-row>
                <el-col
                        :class="{speCol:v.type!=='textarea' && v.type!=='attachment'}"
                        v-for="v in $db.order.orderDetail"
                        v-if="v.belong==='basicInfo' && !v.createHide"
                        :key="v.key"
                        :xs="24"
                        :sm="v.fullLine?24:12"
                        :md="v.fullLine?24:12"
                        :lg="v.fullLine?24:8"
                        :xl="v.fullLine?24:8">
                    <el-form-item :label="v.label" :required="v._rules?v._rules.required:false">
                        <div v-if="v.type==='input'">
                            <div v-if="v.key==='lcNo'">
                                <el-input
                                        :placeholder="v.isQuotationNo?$i.order.pleaseCreate:$i.order.pleaseInput"
                                        class="speInput"
                                        :disabled="v.disabled || disabledLcNo"
                                        v-model="orderForm[v.key]"></el-input>
                            </div>
                            <div v-else>
                                <el-input
                                        :placeholder="v.isQuotationNo?$i.order.pleaseCreate:$i.order.pleaseInput"
                                        class="speInput"
                                        :disabled="v.disabled"
                                        v-model="orderForm[v.key]"></el-input>
                            </div>
                        </div>
                        <div v-else-if="v.type==='date'">
                            <el-date-picker
                                    :disabled="v.disabled"
                                    v-model="orderForm[v.key]"
                                    :editable="false"
                                    :placeholder="$i.order.pleaseChoose"
                                    class="speInput"
                                    align="right"
                                    type="date">
                            </el-date-picker>
                        </div>
                        <div v-else-if="v.type==='select'">
                            <div v-if="v.isSupplier">
                                <el-select
                                        class="speInput"
                                        filterable
                                        v-model="orderForm[v.key]"
                                        @change="handleChangeSupplier(orderForm[v.key])"
                                        :placeholder="$i.order.pleaseChoose">
                                    <el-option
                                            v-for="item in supplierOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isIncoterm">
                                <el-select
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        @change="handleChangeIncoterm(v.key)"
                                        filterable
                                        :placeholder="$i.order.pleaseChoose">
                                    <el-option
                                            v-for="item in incotermOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCurrency">
                                <el-select
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :placeholder="$i.order.pleaseChoose">
                                    <el-option
                                            v-for="item in currencyOption"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isPayment">
                                <el-select
                                        class="speInput"
                                        @change="changePayment"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :placeholder="$i.order.pleaseChoose">
                                    <el-option
                                            v-for="item in paymentOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCountry">
                                <el-select
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :placeholder="$i.order.pleaseChoose">
                                    <el-option
                                            v-for="item in countryOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isTransport">
                                <el-select
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="v.disabled"
                                        :placeholder="$i.order.pleaseChoose">
                                    <el-option
                                            v-for="item in transportOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select
                                        :placeholder="$i.order.pleaseChoose"
                                        :disabled="v.disabled"
                                        class="speInput"
                                        v-model="orderForm[v.key]">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.type==='number'">
                            <v-input-number
                                    :placeholder="$i.order.pleaseInput"
                                    :disabled="v.disabled"
                                    class="speInput speNumber"
                                    v-model="orderForm[v.key]"
                                    :controls="false">

                            </v-input-number>
                        </div>
                        <div v-else-if="v.type==='textarea'">
                            <el-input
                                    :disabled="v.disabled"
                                    class="speInput"
                                    type="textarea"
                                    :autosize="{ minRows: 2}"
                                    :placeholder="$i.order.pleaseInput"
                                    v-model="orderForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.type==='attachment'">
                            <v-upload
                                    ref="upload"
                                    :list="orderForm.attachments"
                                    :limit="20"></v-upload>
                        </div>
                        <div v-else-if="v.type==='supplierNo'">
                            <el-input
                                    :placeholder="$i.order.baseSupplierName"
                                    class="speInput"
                                    :disabled="true"
                                    v-model="supplierNo"></el-input>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="title">
            {{$i.order.productInfoBig}}
        </div>
        <v-table
                ref="table"
                native-sort="skuSysCode"
                @change-sort="$refs.table.setSort(productTableData)"
                :totalRow="totalRow"
                code="uorder_sku_list"
                :height="500"
                :data.sync="productTableData"
                :buttons="productInfoBtn"
                @action="productInfoAction"
                :loading='loadingProductTable'
                @change-checked="changeProductChecked"
                :rowspan="2"
                :total-row="tableTotal">
            <template slot="header">
                <div class="btns">
                    <el-button
                            @click="addProduct">{{$i.order.addProduct}}
                    </el-button>
                    <el-button
                            @click="removeProduct"
                            :disabled="selectProductInfoTable.length===0"
                            type="danger">{{$i.order.remove}}
                    </el-button>
                </div>
            </template>
        </v-table>
        <div class="footBtn">
            <el-button
                    :disabled="loadingPage"
                    :loading="disableClickSend"
                    @click="send"
                    type="primary">{{$i.order.send}}
            </el-button>
            <el-button
                    :disabled="loadingPage"
                    :loading="disableClickSaveDraft"
                    @click="saveAsDraft"
                    type="primary">{{$i.order.saveAsDraft}}
            </el-button>
            <el-button
                    :disabled="loadingPage"
                    type="primary"
                    @click="quickCreate">{{$i.order.quickCreate}}
            </el-button>
        </div>
        <el-dialog
                :visible.sync="quickCreateDialogVisible"
                width="70%">
            <v-table
                    :selection="false"
                    :height="400"
                    :loading="loadingTable"
                    :data="tableDataList"
                    :buttons="[{label: this.$i.order.createOrder, type: 1}]"
                    @change-checked="changeChecked"
                    @action="btnClick">
                <template slot="header">
                    <select-search
                            :width="300"
                            class="search"
                            @inputEnter="searchInquiry"
                            v-model="searchId"
                            :options="searchOptions"></select-search>
                </template>
            </v-table>
            <page
                    @size-change="changeSize"
                    @change="changePage"
                    :pageSizes="[50,100,200]"
                    :page-data="pageData"></page>
        </el-dialog>
        <el-dialog
                custom-class="ucn-dialog-center"
                :title="$i.order.addProduct"
                :close-on-click-modal="false"
                :visible.sync="productTableDialogVisible"
                width="70%">
            <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
                <el-tab-pane :label="$i.order.fromNewSearch" name="product">
                    <v-product
                            ref="addProduct"
                            queryType="product"
                            :form-column="$db.product.overview"
                            :disabledLine="disableProductLine"
                            @sure="handleSure"
                            @cancel="handleCancel"></v-product>
                </el-tab-pane>
                <el-tab-pane :label="$i.order.fromBookmark" name="bookmark">
                    <v-product
                            ref="addBookmark"
                            queryType="bookmark"
                            :form-column="$db.product.overview"
                            :disabledLine="disableProductLine"
                            @sure="handleSure"
                            @cancel="handleCancel"></v-product>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <v-history-modify
                code="uorder_sku_list"
                @closed="$refs.table.update()"
                @save="saveNegotiate"
                :beforeSave="beforeSave"
                ref="HM">
            <!--<div slot="skuPic" slot-scope="{data}">-->
            <!--<v-upload :limit="20" readonly></v-upload>-->
            <!--</div>-->
            <el-select
                    slot="skuFobCurrency"
                    v-model="data.value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in currencyOption"
                        :key="item.id"
                        :label="item.code"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-select
                    slot="skuExwCurrency"
                    v-model="data.value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in currencyOption"
                        :key="item.id"
                        :label="item.code"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-select
                    slot="skuCifCurrency"
                    v-model="data.value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in currencyOption"
                        :key="item.id"
                        :label="item.code"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-select
                    slot="skuDduCurrency"
                    v-model="data.value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in currencyOption"
                        :key="item.id"
                        :label="item.code"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-select
                    slot="skuUnit"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in skuUnitOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuUnitWeight"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :disabled="true"
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in weightOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuUnitLength"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :disabled="true"
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in lengthOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuUnitVolume"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :disabled="true"
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in volumeOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuExpireUnit"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in expirationDateOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuSample"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in isNeedSampleOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuInspectQuarantineCategory"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in quarantineTypeOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>

            <v-input-number
                    class="speNumber spx"
                    slot="skuFobPrice"
                    slot-scope="{data}"
                    @blur="handlePriceBlur"
                    :accuracy="4"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuExwPrice"
                    slot-scope="{data}"
                    :accuracy="4"
                    @blur="handlePriceBlur"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuCifPrice"
                    slot-scope="{data}"
                    :accuracy="4"
                    @blur="handlePriceBlur"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuDduPrice"
                    :accuracy="4"
                    slot-scope="{data}"
                    @blur="handlePriceBlur"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuQty"
                    :accuracy="1"
                    @blur="handlePriceBlur(data)"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuPrice"
                    :accuracy="4"
                    :disabled="true"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    :controls="false"
                    slot="skuLength"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuWidth"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuHeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuNetWeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuVolume"
                    :accuracy="6"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonQty"
                    :accuracy="1"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    :controls="false"
                    slot="skuInnerCartonLength"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonWidth"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonHeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonWeightNet"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonRoughWeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    :controls="false"
                    slot="skuInnerCartonVolume"
                    :accuracy="3"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonOuterNum"
                    :accuracy="1"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonQty"
                    @blur="handlePriceBlur"
                    :accuracy="1"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonLength"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonWidth"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonHeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonNetWeight"
                    :accuracy="2"
                    @blur="handlePriceBlur"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonRoughWeight"
                    :accuracy="2"
                    @blur="handlePriceBlur"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonVolume"
                    :accuracy="3"
                    @blur="handlePriceBlur"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuApplicableAge"
                    :accuracy="0"
                    :max="127"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuExpireDates"
                    :accuracy="0"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuSampleQty"
                    :accuracy="1"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuSamplePrice"
                    :accuracy="4"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuDeliveryDates"
                    :accuracy="0"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuCartonQty"
                    @blur="handlePriceBlur"
                    :accuracy="0"
                    slot-scope="{data}"
                    :disabled="true"
                    v-model="data.value"></v-input-number>

            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="totalCtnCbm"
                    :accuracy="3"
                    slot-scope="{data}"
                    :disabled="true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="totalCtnGw"
                    :accuracy="2"
                    slot-scope="{data}"
                    :disabled="true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="totalCtnNw"
                    :accuracy="2"
                    slot-scope="{data}"
                    :disabled="true"
                    v-model="data.value"></v-input-number>

        </v-history-modify>
    </div>
</template>

<script>

    import {
        VTable,
        VPagination,
        selectSearch,
        VUpload,
        VHistoryModify,
        overviewPage,
        VProduct,
        VInputNumber
    } from "@/components/index";
    import { mapActions } from "vuex";

    export default {
        name: "createOrder",
        components: {
            VTable,
            page: VPagination,
            selectSearch,
            VUpload,
            VHistoryModify,
            overviewPage,
            VProduct,
            VInputNumber
        },
        data() {
            return {
                options: [],
                /**
                 * 字典配置
                 * */
                currencyOption: [],
                supplierOption: [],
                incotermOption: [],
                paymentOption: [],
                paymentStatusOption: [],
                transportOption: [],
                skuUnitOption: [],
                lengthOption: [],
                weightOption: [],
                volumeOption: [],
                expirationDateOption: [],
                isNeedSampleOption: [],
                countryOption: [],
                quarantineTypeOption: [],
                skuStatusOption: [],
                inquiryStatusOption: [],
                skuStatusTotalOption: [],

                /**
                 * 页面基础配置
                 * */
                supplierNo: "",
                rules: {},
                disabledLcNo: true,
                allowQuery: 0,
                loadingPage: false,
                disableClickSend: false,
                disableClickSaveDraft: false,
                labelPosition: "right",
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                quickCreateDialogVisible: false,
                tableData: [],
                selectSearch: "",
                productInfoBtn: [
                    {
                        label: this.$i.order.modify,
                        type: "negotiate"
                    },
                    {
                        label: this.$i.order.detail,
                        type: "detail"
                    }
                ],
                loadingProductTable: false,
                tableTotal: [],
                activeTab: "product",
                selectProductInfoTable: [],
                disabledProductLine: [],
                queryNo: 0,
                category: [],
                inquiryId: "",           //存储选择的入库单id
                chooseProduct: [],

                /**
                 * 弹出框data配置
                 * */
                disableProductLine: [],
                pageData: {},
                loadingTable: false,
                tableDataList: [],
                searchOptions: [
                    {
                        label: this.$i.order.inquiryNo,
                        id: 1
                    }
                ],
                searchId: 1,
                inquiryConfig: {
                    inquiryNo: "",
                    operatorFilters: [],
                    pn: 1,
                    ps: 50,
                    sorts: [],
                    status: 99
                },

                /**
                 * 选择产品弹出框data
                 * */
                productTableDialogVisible: false,
                type1: "product",
                type2: "bookmark",
                updateProduct: 0,
                updateBookmark: 0,
                productTableData: [],

                /**
                 * 提交的数据
                 * */
                orderForm: {
                    supplierCompanyId: "",
                    actDeliveryDt: "",
                    attachments: [],
                    basicFlag: false,     //basicInfo是否修改
                    currency: "",
                    customerAgreementDt: "",
                    customerAgreementNo: "",
                    customerOrderNo: "",
                    deliveredQty: 0,
                    deliveryDt: "",
                    departureCountry: "",
                    departurePort: "",
                    destCountry: "",
                    destPort: "",
                    draftCustomer: false,       //saveAsDraft的时候为true
                    exchangeRateList: [
                        {
                            currency: "CNYUSD"
                            // exchangeRate: '124'
                        },
                        {
                            currency: "CNYEUR"
                            // exchangeRate: ''
                        },
                        {
                            currency: "USDEUR"
                            // exchangeRate: ''
                        },
                        {
                            currency: "USDCNY"
                            // exchangeRate: ''
                        },
                        {
                            currency: "EURCNY"
                            // exchangeRate: ''
                        },
                        {
                            currency: "EURUSD"
                            // exchangeRate: ''
                        }
                    ],
                    fieldRemark: {},
                    fieldUpdate: {},
                    incoterm: "",
                    incotermArea: "",
                    lcNo: "",
                    orderNo: "",
                    payment: "",
                    paymentDays: null,
                    productFlag: false,
                    quotationNo: "",
                    remark: "",
                    responsibilityFlag: false,
                    responsibilityList: [],
                    skuList: [],
                    supplierCode: "",
                    supplierId: 0,
                    supplierName: "",
                    supplierOrderNo: "",
                    transport: "1"
                }
            };
        },
        computed: {
            totalRow() {
                let obj = {}, arr = [];
                if (this.productTableData.length <= 0) {
                    return;
                }
                ;
                _.map(this.productTableData, v => {
                    if (!v._remark) {
                        arr.push(v);
                    }
                });
                _.map(arr, v => {
                    _.mapObject(v, (item, key) => {
                        if (item._calculate) {
                            obj[key] = {
                                value: this.$calc.add(Number(item.value), (Number(obj[key] ? obj[key].value : 0) || 0))
                            };
                        } else {
                            obj[key] = {
                                value: ""
                            };
                        }
                    });
                });

                return [obj];
            }
        },
        methods: {
            ...mapActions(["setMenuLink"]),
            send() {
                if (this.$validateForm(this.orderForm, this.$db.order.orderDetail)) {
                    return;
                }
                let params = Object.assign({}, this.orderForm);
                _.map(this.supplierOption, v => {
                    if (params.supplierName === v.id) {
                        params.supplierName = v.name;
                        params.supplierCode = v.code;
                        params.supplierId = v.id;
                        params.supplierCompanyId = v.companyId;
                    }
                });

                params.skuList = this.dataFilter(this.productTableData);
                /**
                 * 判断是否产品客户语言描述，产品客户语言品名和客户货号填了
                 * */
                for (let val in params.skuList) {
                    if (this.$validateForm(params.skuList[val], this.$db.order.productInfoTableCreate)) {
                        return;
                    }
                }
                // let rightCode = true;
                _.map(params.skuList, v => {
                    // if (v.skuSupplierCode !== params.supplierCode) {
                    //     rightCode = false;8
                    // }
                    v.skuSample = v.skuSample === "1" ? true : false;
                    v.skuInspectQuarantineCategory = v.skuInspectQuarantineCategory ? _.findWhere(this.quarantineTypeOption, { code: v.skuInspectQuarantineCategory }).code : "";
                    let picKey = ["skuPkgMethodPic", "skuInnerCartonPic", "skuOuterCartonPic", "skuAdditionalOne", "skuAdditionalTwo", "skuAdditionalThree", "skuAdditionalFour"];
                    _.map(picKey, item => {
                        if (_.isArray(v[item])) {
                            v[item] = (v[item][0] ? v[item][0] : null);
                        } else if (_.isString(v[item]) && v[item]) {
                            let key = this.$getOssKey(v[item], true);
                            v[item] = key[0];
                        }
                    });
                });
                //如果选的产品和上面选的供应商不一致，要给出提示
                // if (!rightCode) {
                //     return this.$message({
                //         message: this.$i.order.supplierNotTheSame,
                //         type: "warning"
                //     });
                // }
                params.attachments = this.$refs.upload[0].getFiles();
                this.disableClickSend = true;
                this.$ajax.post(this.$apis.ORDER_SAVE, params).then(res => {
                    this.$router.push("/order/overview");
                }).finally(() => {
                    this.disableClickSend = false;
                });
            },
            saveAsDraft() {
                let params = Object.assign({}, this.orderForm);
                _.map(this.supplierOption, v => {
                    if (params.supplierName === v.id) {
                        params.supplierName = v.name;
                        params.supplierCode = v.code;
                        params.supplierId = v.id;
                        params.supplierCompanyId = v.companyId;
                    }
                });
                params.skuList = this.dataFilter(this.productTableData);
                params.attachments = this.$refs.upload[0].getFiles();
                params.draftCustomer = true;
                let rightCode = true;
                _.map(params.skuList, v => {
                    if (v.skuSupplierCode !== params.supplierCode) {
                        rightCode = false;
                    }
                    if (v.skuSample === "1") {
                        v.skuSample = true;
                    } else if (v.skuSample === "0") {
                        v.skuSample = false;
                    }
                    if (v.skuInspectQuarantineCategory) {
                        v.skuInspectQuarantineCategory = _.findWhere(this.quarantineTypeOption, { code: v.skuInspectQuarantineCategory }).code;
                    }
                    let picKey = ["skuPkgMethodPic", "skuInnerCartonPic", "skuOuterCartonPic", "skuAdditionalOne", "skuAdditionalTwo", "skuAdditionalThree", "skuAdditionalFour"];
                    _.map(picKey, item => {
                        if (_.isArray(v[item])) {
                            v[item] = (v[item][0] ? v[item][0] : null);
                        } else if (_.isString(v[item]) && v[item]) {
                            let key = this.$getOssKey(v[item], true);
                            v[item] = key[0];
                        }
                    });
                });

                //如果选的产品和上面选的供应商不一致，要给出提示
                // if(!rightCode){
                //     return this.$message({
                //         message: this.$i.order.supplierNotTheSame,
                //         type: 'warning'
                //     });
                // }
                this.disableClickSaveDraft = true;
                this.$ajax.post(this.$apis.ORDER_SAVE_DRAFT, params).then(res => {
                    this.$router.push("/order/draft");
                }).finally(err => {
                    this.disableClickSaveDraft = false;
                });
            },
            getDetail(e) {
                this.loadingPage = true;
                this.$ajax.post(this.$apis.ORDER_DETAIL, {
                    orderId: this.$route.query.orderId
                }).then(res => {
                    this.orderForm = res;
                    _.map(this.supplierOption, v => {
                        if (v.code === res.supplierCode) {
                            this.orderForm.supplierName = v.id;
                        }
                    });
                    this.changePayment(res.payment);
                    let data = this.$getDB(this.$db.order.productInfoTableCreate, this.$refs.HM.getFilterData(res.skuList, "skuSysCode"), item => {
                        if (item._remark) {
                            item.label.value = this.$i.order.remarks;
                        }
                        else {
                            item.label.value = this.$dateFormat(item.entryDt.value, "yyyy-mm-dd");
                            item.skuSample._value = item.skuSample.value ? "YES" : "NO";
                            item.skuSample.value = item.skuSample.value ? "1" : "0";
                            item.skuUnit._value = (_.findWhere(this.skuUnitOption, { code: String(item.skuUnit.value) }) || {}).name;
                            item.skuUnitWeight._value = (_.findWhere(this.weightOption, { code: String(item.skuUnitWeight.value) }) || {}).name;
                            item.skuUnitLength._value = (_.findWhere(this.lengthOption, { code: String(item.skuUnitLength.value) }) || {}).name;
                            item.skuExpireUnit._value = (_.findWhere(this.expirationDateOption, { code: String(item.skuExpireUnit.value) }) || {}).name;
                            item.skuStatus._value = (_.findWhere(this.skuStatusTotalOption, { code: item.skuStatus.value }) || {}).name;
                            item.skuUnitVolume._value = (_.findWhere(this.volumeOption, { code: String(item.skuUnitVolume.value) }) || {}).name;
                            item.skuInspectQuarantineCategory._value = (_.findWhere(this.quarantineTypeOption, { code: String(item.skuInspectQuarantineCategory.value) }) || {}).name;
                            item.skuCategoryId._value = item.skuCategoryName.value;
                            if (item.skuCartonQty.value !== Math.ceil(item.skuCartonQty.value)) {
                                item.skuCartonQty._style = { "backgroundColor": "yellow" };
                            }
                        }
                    });
                    this.productTableData = [];
                    _.map(data, v => {
                        this.productTableData.push(v);
                    });


                    let incoterm,
                        totalPrice = ["skuFobCurrency", "skuFobPort", "skuFobPrice", "skuExwCurrency", "skuExwPrice", "skuCifPrice", "skuCifCurrency", "skuCifPort", "skuDduCurrency", "skuDduPort", "skuDduPrice"],
                        fob = ["skuFobCurrency", "skuFobPort", "skuFobPrice"],
                        exw = ["skuExwCurrency", "skuExwPrice"],
                        cif = ["skuCifPrice", "skuCifCurrency", "skuCifPort"],
                        ddu = ["skuDduCurrency", "skuDduPort", "skuDduPrice"];
                    if (this.orderForm.incoterm === "1") {
                        incoterm = fob;
                    } else if (this.orderForm.incoterm === "2") {
                        incoterm = exw;
                    } else if (this.orderForm.incoterm === "3") {
                        incoterm = cif;
                    } else if (this.orderForm.incoterm === "4") {
                        incoterm = ddu;
                    }
                    _.map(totalPrice, v => {
                        _.map(this.productTableData, item => {
                            if (!item._remark) {
                                item[v]._hide = true;
                            }
                        });
                    });
                    _.map(incoterm, v => {
                        _.map(this.productTableData, item => {
                            if (!item._remark) {
                                item[v]._hide = false;
                            }
                        });
                    });



                    this.markImportant = this.orderForm.importantCustomer;
                    //判断底部按钮能不能点
                    if (res.status !== "2" && res.status !== "3" && res.status !== "4") {
                        this.disableModify = true;
                    } else {
                        this.disableModify = false;
                    }
                    if (res.status !== "2") {
                        this.disableConfirm = true;
                    } else {
                        this.disableConfirm = false;
                    }
                    if (res.status === "5") {
                        this.hasCancelOrder = true;
                    } else {
                        this.hasCancelOrder = false;
                    }
                }).finally(err => {
                    this.loadingPage = false;
                    this.disableClickCancelModify = false;
                    if (e) {
                        this.isModify = false;
                    }
                });
            },
            getOrderNo() {
                this.loadingPage = true;
                //带了id表示是从draft页面过来的
                if (this.$route.query.orderId) {
                    // this.orderForm.orderNo=this.$route.query.orderId;
                    this.getSupplier();
                } else {
                    this.$ajax.post(this.$apis.ORDER_GETORDERNO).then(res => {
                        this.orderForm.orderNo = res;
                        this.getSupplier();
                    }).catch(err => {
                        this.loadingPage = false;
                    });
                }
            },
            changePayment(e) {
                if (!e) {
                    return;
                }
                let name = _.findWhere(this.paymentOption, { code: e }).name;
                if (name !== "L/C") {
                    this.disabledLcNo = true;
                    this.orderForm.lcNo = "";
                } else {
                    this.disabledLcNo = false;
                }
            },
            getSupplier() {
                this.loadingPage = true;
                this.$ajax.get(this.$apis.PURCHASE_SUPPLIER_LIST_SUPPLIER_BY_NAME, {
                    name: ""
                }).then(res => {
                    this.supplierOption = res;
                    if (this.$route.query.supplierCode) {
                        _.map(this.supplierOption, v => {
                            if (v.code === this.$route.query.supplierCode) {
                                this.orderForm.supplierName = v.id;
                            }
                        });
                    }
                    this.getUnit();
                }).catch(err => {
                    this.loadingPage = false;
                });
            },
            quickCreate() {
                this.quickCreateDialogVisible = true;
                this.getInquiryData();
            },
            getInquiryData() {
                this.loadingTable = true;
                this.$ajax.post(this.$apis.INQUIERY_LIST, this.inquiryConfig).then(res => {
                    this.tableDataList = this.$getDB(this.$db.order.inquiryOverview, res.datas, item => {

                        item.incoterm._value = (_.findWhere(this.incotermOption, { code: item.incoterm.value }) || {}).name;
                        item.status._value = (_.findWhere(this.inquiryStatusOption, { code: String(item.status.value) }) || {}).name;
                        if (item.id.value === this.inquiryId) {
                            this.$set(item, "_disabled", true);
                        }
                        if (item.orderNo.value) {
                            this.$set(item, "_disabled", true);
                        }
                    });
                    this.pageData = res;
                }).finally(err => {
                    this.loadingTable = false;
                });
            },
            handleChangeSupplier(data) {
                this.supplierNo = _.findWhere(this.supplierOption, { id: data }).code;
            },
            handleChangeIncoterm(key) {
                let incoterm,
                    totalPrice = ["skuFobCurrency", "skuFobPort", "skuFobPrice", "skuExwCurrency", "skuExwPrice", "skuCifPrice", "skuCifCurrency", "skuCifPort", "skuDduCurrency", "skuDduPort", "skuDduPrice"],
                    fob = ["skuFobCurrency", "skuFobPort", "skuFobPrice"],
                    exw = ["skuExwCurrency", "skuExwPrice"],
                    cif = ["skuCifPrice", "skuCifCurrency", "skuCifPort"],
                    ddu = ["skuDduCurrency", "skuDduPort", "skuDduPrice"];
                if (this.orderForm[key] === "1") {
                    incoterm = fob;
                } else if (this.orderForm[key] === "2") {
                    incoterm = exw;
                } else if (this.orderForm[key] === "3") {
                    incoterm = cif;
                } else if (this.orderForm[key] === "4") {
                    incoterm = ddu;
                }
                // _.map(totalPrice, v => {
                //     _.map(this.productTableData, item => {
                //         if (!item._remark) {
                //             item[v]._hide = true;
                //         }
                //     });
                // });
                // _.map(incoterm, v => {
                //     _.map(this.productTableData, item => {
                //         if (!item._remark) {
                //             item[v]._hide = false;
                //         }
                //     });
                // });
                _.map(this.productTableData, item => {
                    if (!item._remark) {
                        if (this.orderForm[key] === "1") {
                            //fob
                            item.skuPrice.value = this.$toFixed(this.$calc.multiply(item.skuFobPrice.value, item.skuQty.value ? item.skuQty.value : 0), 4);
                        } else if (this.orderForm[key] === "2") {
                            //exw
                            item.skuPrice.value = this.$toFixed(this.$calc.multiply(item.skuExwPrice.value, item.skuQty.value ? item.skuQty.value : 0), 4);
                        } else if (this.orderForm[key] === "3") {
                            //cif
                            item.skuPrice.value = this.$toFixed(this.$calc.multiply(item.skuCifPrice.value, item.skuQty.value ? item.skuQty.value : 0), 4);
                        } else if (this.orderForm[key] === "4") {
                            //ddu
                            item.skuPrice.value = this.$toFixed(this.$calc.multiply(item.skuDduPrice.value, item.skuQty.value ? item.skuQty.value : 0), 4);
                        }
                    }
                });
            },
            getInitialData() {
                if (this.$route.query.orderId) {
                    this.getDetail();
                }
                else if (this.$route.query.ids && this.$route.query.ids.length > 0) {
                    let ids = this.$route.query.ids;
                    this.loadingProductTable = true;
                    this.$ajax.post(this.$apis.ORDER_SKUS, ids.split(",")).then(res => {
                        let data = this.$getDB(this.$db.order.productInfoTableCreate, this.$refs.HM.getFilterData(res, "skuSysCode"), item => {
                            if (item._remark) {
                                item.label.value = this.$i.order.remarks;
                            }
                            else {
                                item.label.value = this.$dateFormat(item.entryDt.value, "yyyy-mm-dd");
                                item.skuSample._value = item.skuSample.value ? "YES" : "NO";
                                item.skuSample.value = item.skuSample.value ? "1" : "0";
                                item.skuUnit._value = (_.findWhere(this.skuUnitOption, { code: String(item.skuUnit.value) }) || {}).name;
                                item.skuUnitWeight._value = (_.findWhere(this.weightOption, { code: String(item.skuUnitWeight.value) }) || {}).name;
                                item.skuUnitLength._value = (_.findWhere(this.lengthOption, { code: String(item.skuUnitLength.value) }) || {}).name;
                                item.skuExpireUnit._value = (_.findWhere(this.expirationDateOption, { code: String(item.skuExpireUnit.value) }) || {}).name;
                                item.skuStatus._value = (_.findWhere(this.skuStatusTotalOption, { code: item.skuStatus.value }) || {}).name;
                                item.skuUnitVolume._value = (_.findWhere(this.volumeOption, { code: String(item.skuUnitVolume.value) }) || {}).name;
                                item.skuInspectQuarantineCategory._value = (_.findWhere(this.quarantineTypeOption, { code: String(item.skuInspectQuarantineCategory.value) }) || {}).name;
                                item.skuCategoryId._value = item.skuCategoryName.value;
                            }
                        });
                        _.map(data, v => {
                            this.productTableData.push(v);
                        });
                    }).finally(err => {
                        this.loadingProductTable = false;
                        this.loadingPage = false;
                    });
                }
                else {
                    this.loadingPage = false;
                }
            },

            /**
             * product info事件
             * */
            productInfoAction(e, type) {
                if (type === "negotiate") {
                    let arr = [];
                    _.map(this.productTableData, v => {
                        if (Number(v.skuSysCode.value) === Number(e.skuSysCode.value)) {
                            if (!v._remark) {
                                this.handlePriceBlur({}, v);
                            }
                            arr.push(v);
                        }
                    });
                    this.chooseProduct = this.$refs.HM.init(arr, []);
                } else if (type === "detail") {
                    this.$windowOpen({
                        url: "/product/sourcingDetail",
                        params: {
                            id: e.skuId.value
                        }
                    });
                }
            },
            changeProductChecked(e) {
                this.selectProductInfoTable = e;
            },
            addProduct() {
                this.disableProductLine = [];
                if (this.productTableData.length > 0) {
                    _.map(this.productTableData, v => {
                        if (!v._remark) {
                            this.disableProductLine.push(v.skuId.value);
                        }
                    });
                }
                this.productTableDialogVisible = true;
                this.activeTab = "product";
                this.$nextTick(() => {
                    if (this.$refs.addProduct) {
                        this.$refs.addProduct.getData();
                    }
                    if (this.$refs.addBookmark) {
                        this.$refs.addBookmark.getData();
                    }
                });
            },
            removeProduct() {
                this.$confirm(this.$i.order.sureDelete, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: "warning"
                }).then(() => {
                    let sysCodes = _.uniq(_.pluck(_.pluck(this.selectProductInfoTable, "skuSysCode"), "value"));
                    let arr = [];
                    _.map(this.productTableData, v => {
                        _.map(sysCodes, m => {
                            if (v.skuSysCode.value === m) {
                                arr.push(v);
                            }
                        });
                    });
                    this.productTableData = _.difference(this.productTableData, arr);
                    this.selectProductInfoTable = [];
                    this.$message({
                        type: "success",
                        message: this.$i.order.deleteSuccess
                    });
                }).catch(() => {

                });
            },
            handleClick(tab) {
                if (tab.index === "0") {
                    this.$refs.addProduct.getData();
                } else if (tab.index === "1") {
                    this.$refs.addBookmark.getData();
                }
            },
            handleSure(e, type) {
                this.loadingProductTable = true;
                this.productTableDialogVisible = false;
                let ids = _.pluck(_.pluck(e, type === "product" ? "id" : "skuId"), "value");
                this.$ajax.post(this.$apis.ORDER_SKUS, ids).then(res => {
                    let data = this.$getDB(this.$db.order.productInfoTableCreate, this.$refs.HM.getFilterData(res, "skuSysCode"), item => {
                        if (item._remark) {
                            item.label.value = this.$i.order.remarks;
                        }
                        else {
                            item.label.value = this.$dateFormat(item.entryDt.value, "yyyy-mm-dd");
                            item.skuSample._value = item.skuSample.value ? "YES" : "NO";
                            item.skuSample.value = item.skuSample.value ? "1" : "0";
                            item.skuUnit._value = (_.findWhere(this.skuUnitOption, { code: String(item.skuUnit.value) }) || {}).name;
                            item.skuUnitWeight._value = (_.findWhere(this.weightOption, { code: String(item.skuUnitWeight.value) }) || {}).name;
                            item.skuUnitLength._value = (_.findWhere(this.lengthOption, { code: String(item.skuUnitLength.value) }) || {}).name;
                            item.skuExpireUnit._value = (_.findWhere(this.expirationDateOption, { code: String(item.skuExpireUnit.value) }) || {}).name;
                            item.skuStatus._value = (_.findWhere(this.skuStatusTotalOption, { code: item.skuStatus.value }) || {}).name;
                            item.skuUnitVolume._value = (_.findWhere(this.volumeOption, { code: String(item.skuUnitVolume.value) }) || {}).name;
                            item.skuInspectQuarantineCategory._value = (_.findWhere(this.quarantineTypeOption, { code: String(item.skuInspectQuarantineCategory.value) }) || {}).name;
                            item.skuCategoryId._value = item.skuCategoryName.value;
                        }
                    });
                    _.map(data, v => {
                        this.productTableData.push(v);
                    });
                    let incoterm,
                        totalPrice = ["skuFobCurrency", "skuFobPort", "skuFobPrice", "skuExwCurrency", "skuExwPrice", "skuCifPrice", "skuCifCurrency", "skuCifPort", "skuDduCurrency", "skuDduPort", "skuDduPrice"],
                        fob = ["skuFobCurrency", "skuFobPort", "skuFobPrice"],
                        exw = ["skuExwCurrency", "skuExwPrice"],
                        cif = ["skuCifPrice", "skuCifCurrency", "skuCifPort"],
                        ddu = ["skuDduCurrency", "skuDduPort", "skuDduPrice"];
                    if (this.orderForm.incoterm === "1") {
                        incoterm = fob;
                    } else if (this.orderForm.incoterm === "2") {
                        incoterm = exw;
                    } else if (this.orderForm.incoterm === "3") {
                        incoterm = cif;
                    } else if (this.orderForm.incoterm === "4") {
                        incoterm = ddu;
                    }
                    _.map(totalPrice, v => {
                        _.map(this.productTableData, item => {
                            if (!item._remark) {
                                item[v]._hide = true;
                            }
                        });
                    });
                    _.map(incoterm, v => {
                        _.map(this.productTableData, item => {
                            if (!item._remark) {
                                item[v]._hide = false;
                            }
                        });
                    });

                }).finally(() => {
                    this.loadingProductTable = false;
                });
            },
            handleCancel() {
                this.productTableDialogVisible = false;
            },
            beforeSave(data) {
                let obj = {};
                _.map(data[0], (val, key) => {
                    obj[key] = val.value;
                });
                if (this.$validateForm(obj, this.$db.order.productInfoTableCreate)) {
                    return false;
                }
            },
            saveNegotiate(e) {
                _.map(this.productTableData, (v, k) => {
                    _.map(e, m => {
                        if (m.skuSysCode.value === v.skuSysCode.value && m.label.value === v.label.value) {
                            this.productTableData.splice(k, 1, m);
                        }
                    });
                });
            },
            dataFilter(data) {
                let arr = [],
                    jsons = {},
                    json = {};
                data.forEach(item => {
                    jsons = {};
                    if (item._remark) { //拼装remark 数据
                        for (let k in item) {
                            jsons[k] = item[k].value;
                        }
                        json.fieldRemark = jsons;
                    }
                    else {
                        json = {};
                        for (let k in item) {
                            if (json[k] === "fieldRemark") {
                                json[k] = jsons;
                            }
                            else {
                                if (item[k]._value) {
                                    if (item[k].key === "skuUnit") {
                                        json[k] = (_.findWhere(this.skuUnitOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuUnitWeight") {
                                        json[k] = (_.findWhere(this.weightOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuUnitLength") {
                                        json[k] = (_.findWhere(this.lengthOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuUnitVolume") {
                                        json[k] = (_.findWhere(this.volumeOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuExpireUnit") {
                                        json[k] = (_.findWhere(this.expirationDateOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuStatus") {
                                        json[k] = (_.findWhere(this.skuStatusTotalOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuSample") {
                                        json[k] = (_.findWhere(this.isNeedSampleOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuInspectQuarantineCategory") {
                                        json[k] = (_.findWhere(this.quarantineTypeOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else {
                                        json[k] = item[k].value;
                                    }
                                } else {
                                    json[k] = item[k].value;
                                }
                            }
                        }
                        ;
                        arr.push(json);
                    }
                });
                return arr;
            },

            /**
             * quick create弹出框事件
             * */
            searchInquiry(e) {
                if (!e.id) {
                    return this.$message({
                        message: this.$i.order.pleaseChooseType,
                        type: "warning"
                    });
                }
                this.inquiryConfig.inquiryNo = e.value;
                this.getInquiryData();
            },
            changeChecked() {
                console.log(1);
            },
            btnClick(e) {
                this.inquiryId = e.id.value;
                this.quickCreateDialogVisible = false;
                this.loadingProductTable = true;
                this.loadingPage = true;
                this.$ajax.get(this.$apis.INQUIRY_ID, {
                    id: e.id.value
                }).then(res => {
                    //带入inquiry信息
                    this.orderForm.attachments = res.attachments;
                    this.orderForm.quotationNo = res.quotationNo;
                    this.orderForm.supplierName = res.supplierId;
                    this.orderForm.incoterm = res.incoterm;
                    this.orderForm.payment = res.paymentMethod;
                    this.changePayment(this.orderForm.payment);
                    this.orderForm.departureCountry = res.departureCountry;
                    this.orderForm.departurePort = res.departurePort;
                    this.orderForm.destinationCountry = res.destinationCountry;
                    this.orderForm.destinationPort = res.destinationPort;
                    this.orderForm.remark = res.remark;
                    this.orderForm.currency = res.currency;
                    this.orderForm.destCountry = res.destinationCountry;
                    this.orderForm.destPort = res.destinationPort;
                    this.supplierNo = (_.findWhere(this.supplierOption, { id: res.supplierId }) || {}).code;
                    this.productTableData = [];
                    let arr = [];
                    _.map(res.details, v => {
                        console.log(v, "v");
                        let obj = {
                            bookmarkId: "",
                            companyId: null,
                            entryDt: "",
                            entryId: null,
                            entryName: "",
                            fieldRemark: {},
                            fieldUpdate: {},
                            fieldsRemark: "",
                            fieldsUpdate: "",
                            id: null,
                            orderId: null,
                            orderNo: "",
                            ownerId: null,
                            skuAdditionalFour: "",
                            skuAdditionalOne: "",
                            skuAdditionalThree: "",
                            skuAdditionalTwo: "",
                            skuAdjustPackage: true,
                            skuApplicableAge: null,
                            skuAvailableQty: null,
                            skuBrand: "",
                            skuBrandRelated: "",
                            skuBrandRemark: "",
                            skuCategoryFour: "",
                            skuCategoryId: null,
                            skuCategoryOne: "",
                            skuCategoryThree: "",
                            skuCategoryTwo: "",
                            skuCertificat: "",
                            skuCifCurrency: "",
                            skuCifPort: "",
                            skuCifPrice: null,
                            skuCode: "",
                            skuColourEn: "",
                            skuCommodityInspectionEn: "",
                            skuCustomerCreate: true,
                            skuCustomerSkuCode: "",
                            skuCustomsCode: "",
                            skuCustomsNameCn: "",
                            skuDduCurrency: "",
                            skuDduPort: "",
                            skuDduPrice: null,
                            skuDeliveredQty: null,
                            skuDeliveryDates: null,
                            skuDepartureDt: null,
                            skuDescCustomer: "",
                            skuDescEn: "",
                            skuDesign: "",
                            skuDisplayBoxQty: null,
                            skuExpireDates: null,
                            skuExpireUnit: null,
                            skuExwCurrency: "",
                            skuExwPrice: null,
                            skuFobCurrency: "",
                            skuFobPort: "",
                            skuFobPrice: null,
                            skuFormation: "",
                            skuGp20SkuQty: null,
                            skuGp40SkuQty: null,
                            skuGrossWeight: null,
                            skuHeight: null,
                            skuHq40SkuQty: null,
                            skuId: null,
                            skuInboundQty: null,
                            skuIncoterm: "",
                            skuIncotermArea: "",
                            skuInnerCartonDesc: "",
                            skuInnerCartonHeight: null,
                            skuInnerCartonLength: null,
                            skuInnerCartonMethodEn: "",
                            skuInnerCartonOuterNum: null,
                            skuInnerCartonPic: "",
                            skuInnerCartonQty: null,
                            skuInnerCartonRoughWeight: null,
                            skuInnerCartonVolume: null,
                            skuInnerCartonWeightNet: null,
                            skuInnerCartonWidth: null,
                            skuInnerPackBarCode: "",
                            skuInnerPackLabel: "",
                            skuInspectQuarantineCategory: "",
                            skuInventory: null,
                            skuInventoryCostMethod: "",
                            skuLabel: "",
                            skuLabelDesc: "",
                            skuLabelPic: "",
                            skuLength: null,
                            skuLengthWidthHeight: "",
                            skuMainSaleArea: "",
                            skuMainSaleCountry: "",
                            skuMaterialEn: "",
                            skuMethodPkgEn: "",
                            skuMinInventory: null,
                            skuModifyStatus: null,
                            skuNameCustomer: "",
                            skuNameEn: "",
                            skuNetWeight: null,
                            skuNoneSellCountry: "",
                            skuOem: true,
                            skuOrigin: "",
                            skuOtherPackInfoCn: "",
                            skuOtherPackInfoEn: "",
                            skuOuterCartonBarCode: "",
                            skuOuterCartonDesc: "",
                            skuOuterCartonHeight: null,
                            skuOuterCartonLength: null,
                            skuOuterCartonMethodEn: "",
                            skuOuterCartonNetWeight: null,
                            skuOuterCartonPic: "",
                            skuOuterCartonQty: null,
                            skuOuterCartonRoughWeight: null,
                            skuOuterCartonVolume: null,
                            skuOuterCartonWidth: null,
                            skuPictures: "",
                            skuPkgMethodPic: "",
                            skuPrice: null,
                            skuProductionDates: null,
                            skuQty: null,
                            skuQtyPerTray: null,
                            skuQualifiedQty: null,
                            skuQualityStander: "",
                            skuQuotationNo: "",
                            skuReadilyAvailable: true,
                            skuRecycle: true,
                            skuRefunQty: null,
                            skuRemarkOne: "",
                            skuRemarkThree: "",
                            skuRemarkTwo: "",
                            skuSafeInventory: null,
                            skuSample: true,
                            skuSamplePrice: null,
                            skuSampleQty: null,
                            skuShippingMarks: "",
                            skuSpecialTransportRequire: "",
                            skuStatus: "",
                            skuSupplierCode: "",
                            skuSupplierCompanyId: null,
                            skuSupplierId: null,
                            skuSupplierName: "",
                            skuSupplierTenantId: null,
                            skuSysCode: "",
                            skuTradeMarkEn: "",
                            skuTryDimension: null,
                            skuUndeliveredQty: null,
                            skuUnit: null,
                            skuUnitLength: null,
                            skuUnitVolume: null,
                            skuUnitWeight: null,
                            skuUntestedQty: null,
                            skuUseDisplayBox: true,
                            skuVolume: null,
                            skuWarehourceDefault: "",
                            skuWidth: null,
                            skuYearListed: "",
                            tenantId: null,
                            timeZone: "",
                            updateDt: "",
                            updateId: null,
                            updateName: "",
                            version: null
                        };
                        obj.skuId = v.skuId;
                        obj.skuPictures = v.skuPictures;
                        obj.skuNameEn = v.skuNameEn;
                        obj.skuDescEn = v.skuDescEn;
                        obj.skuDescCustomer = v.skuDescCustomer;
                        obj.skuNameCustomer = v.skuNameCustomer;
                        obj.skuCustomerSkuCode = v.skuCustomerSkuCode;
                        obj.skuCode = v.skuCode;
                        obj.skuSupplierName = v.skuSupplierName;
                        obj.skuSupplierCode = v.skuSupplierCode;
                        obj.skuFobCurrency = v.skuFobCurrency;
                        obj.skuFobPrice = v.skuFobPrice;
                        obj.skuFobPort = v.skuFobPort;
                        obj.skuExwCurrency = v.skuExwCurrency;
                        obj.skuExwPrice = v.skuExwPrice;
                        obj.skuCifCurrency = v.skuCifCurrency;
                        obj.skuCifPrice = v.skuCifPrice;
                        obj.skuCifPort = v.skuCifArea;
                        obj.skuDduCurrency = v.skuDduCurrency;
                        obj.skuDduPrice = v.skuDduPrice;
                        obj.skuDduPort = v.skuDduArea;
                        obj.skuUnit = v.skuUnit;
                        obj.skuMaterialEn = v.skuMaterialEn;
                        obj.skuColourEn = v.skuColourEn;
                        obj.skuDeliveryDates = v.skuDeliveryDates;
                        obj.skuDesign = v.skuDesign;
                        obj.skuCategoryId = v.skuCategoryId;
                        obj.skuCustomsCode = v.skuCustomsCode;
                        obj.skuCustomsNameCn = v.skuCustomsNameCn;
                        obj.skuTradeMarkEn = v.skuTradeMarkEn;
                        obj.skuCommodityInspectionEn = v.skuCommodityInspectionEn;
                        obj.skuOrigin = v.skuOrigin;
                        obj.skuInspectQuarantineCategory = v.skuInspectQuarantineCategory;
                        obj.skuUnitLength = v.skuUnitLength;
                        obj.skuUnitWeight = v.skuUnitWeight;
                        obj.skuUnitVolume = v.skuUnitVolume;
                        obj.skuLength = v.skuLength;
                        obj.skuWidth = v.skuWidth;
                        obj.skuHeight = v.skuHeight;
                        obj.skuNetWeight = v.skuNetWeight;
                        obj.skuGrossWeight = v.skuGrossWeight;
                        obj.skuVolume = v.skuVolume;
                        obj.skuMethodPkgEn = v.skuMethodPkgEn;
                        obj.skuInnerCartonQty = v.skuInnerCartonQty;
                        obj.skuInnerCartonLength = v.skuInnerCartonLength;
                        obj.skuInnerCartonWidth = v.skuInnerCartonWidth;
                        obj.skuInnerCartonHeight = v.skuInnerCartonHeight;
                        obj.skuInnerCartonWeightNet = v.skuInnerCartonWeightNet;
                        obj.skuInnerCartonRoughWeight = v.skuInnerCartonRoughWeight;
                        obj.skuInnerCartonVolume = v.skuInnerCartonVolume;
                        obj.skuInnerCartonDesc = v.skuInnerCartonDesc;
                        obj.skuInnerCartonMethodEn = v.skuInnerCartonMethodEn;
                        obj.skuOuterCartonDesc = v.skuOuterCartonDesc;
                        obj.skuOuterCartonQty = v.skuOuterCartonQty;
                        obj.skuOuterCartonLength = v.skuOuterCartonLength;
                        obj.skuOuterCartonWidth = v.skuOuterCartonWidth;
                        obj.skuOuterCartonHeight = v.skuOuterCartonHeight;
                        obj.skuInnerCartonOuterNum = v.skuInnerCartonOuterNum;
                        obj.skuOuterCartonNetWeight = v.skuOuterCartonNetWeight;
                        obj.skuOuterCartonRoughWeight = v.skuOuterCartonRoughWeight;
                        obj.skuOuterCartonVolume = v.skuOuterCartonVolume;
                        obj.skuOuterCartonMethodEn = v.skuOuterCartonMethodEn;
                        obj.skuBrand = v.skuBrand;
                        obj.skuApplicableAge = v.skuApplicableAge;
                        obj.skuExpireDates = v.skuExpireDates;
                        obj.skuExpireUnit = v.skuExpireUnit;
                        obj.skuStatus = "TBC";
                        obj.skuQuotationNo = v.quotationNo;
                        obj.skuSysCode = v.skuSysCode;
                        arr.push(obj);
                    });
                    let data = this.$getDB(this.$db.order.productInfoTableCreate, this.$refs.HM.getFilterData(arr, "skuSysCode"), item => {
                        if (item._remark) {
                            item.label.value = this.$i.order.remarks;
                        }
                        else {
                            item.label.value = this.$dateFormat(item.entryDt.value, "yyyy-mm-dd");
                            item.skuSample._value = item.skuSample.value ? "YES" : "NO";
                            item.skuSample.value = item.skuSample.value ? "1" : "0";
                            item.skuUnit._value = (_.findWhere(this.skuUnitOption, { code: String(item.skuUnit.value) }) || {}).name;
                            item.skuUnitWeight._value = (_.findWhere(this.weightOption, { code: String(item.skuUnitWeight.value) }) || {}).name;
                            item.skuUnitLength._value = (_.findWhere(this.lengthOption, { code: String(item.skuUnitLength.value) }) || {}).name;
                            item.skuExpireUnit._value = (_.findWhere(this.expirationDateOption, { code: String(item.skuExpireUnit.value) }) || {}).name;
                            item.skuStatus._value = (_.findWhere(this.skuStatusTotalOption, { code: item.skuStatus.value }) || {}).name;
                            item.skuUnitVolume._value = (_.findWhere(this.volumeOption, { code: String(item.skuUnitVolume.value) }) || {}).name;
                            item.skuInspectQuarantineCategory._value = (_.findWhere(this.quarantineTypeOption, { code: String(item.skuInspectQuarantineCategory.value) }) || {}).name;
                            // item.skuCategoryId.value = item.skuCategoryName.value;
                        }
                    });
                    _.map(data, v => {
                        this.productTableData.push(v);
                    });

                    let incoterm,
                        totalPrice = ["skuFobCurrency", "skuFobPort", "skuFobPrice", "skuExwCurrency", "skuExwPrice", "skuCifPrice", "skuCifCurrency", "skuCifPort", "skuDduCurrency", "skuDduPort", "skuDduPrice"],
                        fob = ["skuFobCurrency", "skuFobPort", "skuFobPrice"],
                        exw = ["skuExwCurrency", "skuExwPrice"],
                        cif = ["skuCifPrice", "skuCifCurrency", "skuCifPort"],
                        ddu = ["skuDduCurrency", "skuDduPort", "skuDduPrice"];
                    if (this.orderForm.incoterm === "1") {
                        incoterm = fob;
                    } else if (this.orderForm.incoterm === "2") {
                        incoterm = exw;
                    } else if (this.orderForm.incoterm === "3") {
                        incoterm = cif;
                    } else if (this.orderForm.incoterm === "4") {
                        incoterm = ddu;
                    }
                    _.map(totalPrice, v => {
                        _.map(this.productTableData, item => {
                            if (!item._remark) {
                                item[v]._hide = true;
                            }
                        });
                    });
                    _.map(incoterm, v => {
                        _.map(this.productTableData, item => {
                            if (!item._remark) {
                                item[v]._hide = false;
                            }
                        });
                    });

                }).finally(err => {
                    this.loadingProductTable = false;
                    this.loadingPage = false;
                });
            },
            getUnit() {
                this.skuStatusOption = [
                    {
                        code: "3",
                        name: "PROCESS"
                    },
                    {
                        code: "5",
                        name: "CANCELED"
                    }
                ];
                const currency = this.$ajax.get(this.$apis.CURRENCY_ALL, {}, { cache: true });
                const country = this.$ajax.get(this.$apis.COUNTRY_ALL, {}, { cache: true });
                const exchange = this.$ajax.get(this.$apis.CUSTOMERCURRENCYEXCHANGERATE_QUERY, {}, { cache: true });
                const partUnit = this.$ajax.post(this.$apis.get_partUnit, ["PMT", "ITM", "MD_TN", "SKU_UNIT", "LH_UNIT", "VE_UNIT", "WT_UNIT", "ED_UNIT", "NS_IS", "QUARANTINE_TYPE", "SKU_SALE_STATUS", "INQUIRY_STATUS", "SKU_STATUS"], { cache: true });
                this.$ajax.all([currency, country, exchange, partUnit]).then(res => {
                    this.currencyOption = res[0];
                    this.countryOption = res[1];
                    _.map(this.orderForm.exchangeRateList, v => {
                        _.map(res[2], m => {
                            if (v.currency === m.symbol) {
                                v.exchangeRate = m.price;
                            }
                        });
                    });
                    res[3].forEach(v => {
                        if (v.code === "ITM") {
                            this.incotermOption = v.codes;
                        } else if (v.code === "PMT") {
                            this.paymentOption = v.codes;
                        } else if (v.code === "MD_TN") {
                            this.transportOption = v.codes;
                        } else if (v.code === "SKU_UNIT") {
                            this.skuUnitOption = v.codes;
                        } else if (v.code === "LH_UNIT") {
                            this.lengthOption = v.codes;
                        } else if (v.code === "WT_UNIT") {
                            this.weightOption = v.codes;
                        } else if (v.code === "VE_UNIT") {
                            this.volumeOption = v.codes;
                        } else if (v.code === "ED_UNIT") {
                            this.expirationDateOption = v.codes;
                        } else if (v.code === "NS_IS") {
                            this.isNeedSampleOption = v.codes;
                        } else if (v.code === "QUARANTINE_TYPE") {
                            this.quarantineTypeOption = v.codes;
                        } else if (v.code === "INQUIRY_STATUS") {
                            this.inquiryStatusOption = v.codes;
                        } else if (v.code === "SKU_STATUS") {
                            this.skuStatusTotalOption = v.codes;
                        }
                    });
                    this.getInitialData();
                }).finally(() => {

                });
            },

            /**
             * history插槽事件
             * */
            handlePriceBlur(e, item) {
                let obj;
                obj = item ? item : this.chooseProduct[0];

                if (obj.skuOuterCartonQty.value && obj.skuQty.value) {
                    obj.skuCartonQty.value = this.$toFixed(this.$calc.divide(obj.skuQty.value, obj.skuOuterCartonQty.value), 1);
                    //联动totalCtnGw
                    if (obj.skuCartonQty.value && obj.skuOuterCartonRoughWeight.value) {
                        obj.totalCtnGw.value = this.$toFixed(this.$calc.multiply(obj.skuCartonQty.value, obj.skuOuterCartonRoughWeight.value), 2);
                    } else {
                        obj.totalCtnGw.value = null;
                    }

                    //联动totalCtnNw
                    if (obj.skuCartonQty.value && obj.skuOuterCartonNetWeight.value) {
                        obj.totalCtnNw.value = this.$toFixed(this.$calc.multiply(obj.skuCartonQty.value, obj.skuOuterCartonNetWeight.value), 2);
                    } else {
                        obj.totalCtnNw.value = null;
                    }

                    //联动totalCtnCbm
                    if (obj.skuCartonQty.value && obj.skuOuterCartonVolume.value) {
                        obj.totalCtnCbm.value = this.$toFixed(this.$calc.multiply(obj.skuCartonQty.value, obj.skuOuterCartonVolume.value), 3);
                    } else {
                        obj.totalCtnCbm.value = null;
                    }

                    if (obj.skuCartonQty.value !== Math.ceil(obj.skuCartonQty.value)) {
                        obj.skuCartonQty._style = { "backgroundColor": "yellow" };
                    }
                } else {
                    obj.skuCartonQty.value = null;
                    obj.totalCtnGw.value = null;
                }

                //处理totalCtnGw
                if (obj.skuCartonQty.value && obj.skuOuterCartonRoughWeight.value) {
                    obj.totalCtnGw.value = this.$toFixed(this.$calc.multiply(obj.skuCartonQty.value, obj.skuOuterCartonRoughWeight.value), 2);
                } else {
                    obj.totalCtnGw.value = null;
                }

                //处理totalCtnNw
                if (obj.skuCartonQty.value && obj.skuOuterCartonNetWeight.value) {
                    obj.totalCtnNw.value = this.$toFixed(this.$calc.multiply(obj.skuCartonQty.value, obj.skuOuterCartonNetWeight.value), 2);
                } else {
                    obj.totalCtnNw.value = null;
                }

                //处理totalCtnCbm
                if (obj.skuCartonQty.value && obj.skuOuterCartonVolume.value) {
                    obj.totalCtnCbm.value = this.$toFixed(this.$calc.multiply(obj.skuCartonQty.value, obj.skuOuterCartonVolume.value), 3);
                } else {
                    obj.totalCtnCbm.value = null;
                }


                if (!this.orderForm.incoterm) {
                    return;
                }
                if (this.orderForm.incoterm === "1") {
                    //fob
                    if (obj.skuFobPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuFobPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
                else if (this.orderForm.incoterm === "2") {
                    //exw
                    if (obj.skuExwPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuExwPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
                else if (this.orderForm.incoterm === "3") {
                    //cif
                    if (obj.skuCifPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuCifPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
                else if (this.orderForm.incoterm === "4") {
                    //ddu
                    if (obj.skuDduPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuDduPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
            },

            /**
             * 搜索框事件
             * */
            inputEnter(e) {
                console.log(e);
            },

            /**
             * 分页操作
             * */
            changePage(e) {
                this.inquiryConfig.pn = e;
                this.getInquiryData();
            },
            changeSize(e) {
                this.inquiryConfig.ps = e;
                this.getInquiryData();
            }
        },
        created() {
            this.getOrderNo();
        },
        mounted() {
            this.setMenuLink({
                path: "/order/draft",
                type: 10,
                auth: "ORDER:DRAFT_OVERVIEW",
                label: this.$i.common.draft
            });
            this.setMenuLink({
                path: "/order/archiveOrder",
                type: 20,
                auth: "ORDER:OVERVIEW_ARCHIVE",
                label: this.$i.order.archiveOrder
            });
            this.setMenuLink({
                path: "/order/archiveDraft",
                type: 30,
                auth: "ORDER:DRAFT_ARCHIVE",
                label: this.$i.order.archiveDraft
            });
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
        margin-top: 10px;
    }

    .speCol {
        height: 47px;
    }

    .speInput {
        width: 80%;
    }

    .speNumber >>> input {
        text-align: left;
    }

    .spx {
        width: 100%;
    }

    .speSearch {
        float: right;
        margin-right: 70px;
    }

    .summaryInput {
        width: 80%;
    }

    .summaryInput >>> input {
        text-align: left;
    }

    .second-title {
        font-weight: bold;
        font-size: 18px;
        color: #666666;
        padding: 10px 0;
        margin-top: 20px;
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
</style>
