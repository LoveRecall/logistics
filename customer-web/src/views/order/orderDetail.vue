<template>
    <div class="create-order" v-loading="loadingPage">
        <div class="title">
            {{$i.order.basicInfo}}
        </div>
        <el-form :modal="orderForm" ref="basicInfo" class="speForm" label-width="250px" :label-position="labelPosition">
            <el-row>
                <el-col
                        :class="{speCol:v.type!=='textarea' && v.type!=='attachment',isModify:v._isModified}"
                        v-for="v in $db.order.orderDetail"
                        v-if="v.belong==='basicInfo' && v.type!=='supplierNo'"
                        :key="v.key"
                        :xs="24"
                        :sm="v.fullLine?24:12"
                        :md="v.fullLine?24:12"
                        :lg="v.fullLine?24:8"
                        :xl="v.fullLine?24:8">
                    <el-form-item :prop="v.key" :label="v.label">
                        <div v-if="v.type==='input'">
                            <div v-if="v.key==='lcNo'">
                                <el-input
                                        @change="handleChange(v.key)"
                                        :placeholder="v.isQuotationNo?(isModify?$i.order.pleaseCreate:''):(isModify?$i.order.pleaseInput:'')"
                                        class="speInput"
                                        :disabled="v.disabled || disabledLcNo || !isModify"
                                        v-model="orderForm[v.key]"></el-input>
                            </div>
                            <div v-else>
                                <el-input
                                        @change="handleChange(v.key)"
                                        :placeholder="v.isQuotationNo?(isModify?$i.order.pleaseCreate:''):(isModify?$i.order.pleaseInput:'')"
                                        class="speInput"
                                        :disabled="v.disabled || v.disableDetail || !isModify"
                                        v-model="orderForm[v.key]"></el-input>
                            </div>
                        </div>
                        <div v-else-if="v.type==='date'">
                            <el-date-picker
                                    @change="handleChange(v.key)"
                                    format="yyyy-MM-dd"
                                    :disabled="v.disabled || v.disableDetail || !isModify"
                                    v-model="orderForm[v.key]"
                                    :editable="false"
                                    :placeholder="isModify?$i.order.pleaseChoose:''"
                                    class="speInput"
                                    align="right"
                                    type="date">
                            </el-date-picker>
                        </div>
                        <div v-else-if="v.type==='select'">
                            <div v-if="v.isSupplier">
                                <el-select
                                        @change="handleChange(v.key)"
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="v.disableDetail || !isModify"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
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
                                        @change="handleChange(v.key)"
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="!isModify"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
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
                                        @change="handleChange(v.key)"
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="!isModify"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
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
                                        @change="changePayment(orderForm[v.key],v.key)"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="!isModify"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
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
                                        @change="handleChange(v.key)"
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="!isModify"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
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
                                        @change="handleChange(v.key)"
                                        class="speInput"
                                        v-model="orderForm[v.key]"
                                        filterable
                                        :disabled="v.disabled || !isModify"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
                                    <el-option
                                            v-for="item in transportOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isStatus">
                                <el-select
                                        @change="handleChange(v.key)"
                                        class="speInput"
                                        :disabled="v.disableDetail || !isModify"
                                        v-model="orderForm[v.key]"
                                        :placeholder="isModify?$i.order.pleaseChoose:''">
                                    <el-option
                                            v-for="item in orderStatusOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select
                                        @change="handleChange(v.key)"
                                        :placeholder="isModify?$i.order.pleaseChoose:''"
                                        :disabled="v.disabled || !isModify"
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
                                    @change="handleChange(v.key)"
                                    :placeholder="isModify?$i.order.pleaseInput:''"
                                    :disabled="v.disabled || !isModify"
                                    class="speInput speNumber"
                                    v-model="orderForm[v.key]"
                                    :controls="false">

                            </v-input-number>
                        </div>
                        <div v-else-if="v.type==='textarea'">
                            <el-input
                                    @change="handleChange(v.key)"
                                    :disabled="v.disabled || !isModify"
                                    class="speInput"
                                    type="textarea"
                                    :autosize="{ minRows: 2}"
                                    :placeholder="isModify?$i.order.pleaseInput:''"
                                    v-model="orderForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.type==='attachment'">
                            <v-upload
                                    @change="changeAttachment"
                                    ref="upload"
                                    :readonly="!isModify"
                                    :list="orderForm.attachments"
                                    :limit="20"></v-upload>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div>
            <div class="title">
                {{$i.order.responsibility}}
            </div>
            <el-button
                    class="addBtn"
                    :disabled="!isModify"
                    @click="addResponsibility">
                {{$i.order.addResponsibility}}
            </el-button>
            <el-table
                    :data="orderForm.responsibilityList"
                    style="width: 100%;border-top:1px solid #ebeef5;">
                <el-table-column
                        prop="type"
                        align="center"
                        :label="$i.order.type">
                    <template slot-scope="scope">
                        <el-input
                                :class="{'high-light':scope.row && scope.row.fieldUpdates && scope.row.fieldUpdates.type===''}"
                                @change="handleResponsibilityChange(scope.row,'type')"
                                :disabled="!isModify"
                                :placeholder="isModify?$i.order.pleaseInput:''"
                                v-model="scope.row.type"
                                clearable>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="customer"
                        align="center"
                        :label="$i.order.customer">
                    <template slot-scope="scope">
                        <el-date-picker
                                :class="{'high-light':scope.row && scope.row.fieldUpdates && scope.row.fieldUpdates.customer===''}"
                                @change="handleResponsibilityChange(scope.row,'customer')"
                                v-model="scope.row.customer"
                                :editable="false"
                                align="right"
                                type="date"
                                :disabled="!isModify"
                                :placeholder="isModify?$i.order.pleaseChoose:''">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="supplier"
                        align="center"
                        :label="$i.order.supplier">
                    <template slot-scope="scope">
                        <el-date-picker
                                :class="{'high-light':scope.row && scope.row.fieldUpdates &&  scope.row.fieldUpdates.supplier===''}"
                                @change="handleResponsibilityChange(scope.row,'supplier')"
                                v-model="scope.row.supplier"
                                align="right"
                                :editable="false"
                                type="date"
                                :placeholder="isModify?$i.order.pleaseChoose:''"
                                :disabled="!isModify">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="Remark"
                        align="center"
                        :label="$i.order.remarkBig">
                    <template slot-scope="scope">
                        <el-input
                                :class="{'high-light':scope.row && scope.row.fieldUpdates && scope.row.fieldUpdates.remark===''}"
                                @change="handleResponsibilityChange(scope.row,'remark')"
                                :disabled="!isModify"
                                :placeholder="isModify?$i.order.pleaseInput:''"
                                v-model="scope.row.remark"
                                clearable>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="actualDate"
                        align="center"
                        :label="$i.order.actualDate">
                    <template slot-scope="scope">
                        <el-date-picker
                                :class="{'high-light':scope.row && scope.row.fieldUpdates && scope.row.fieldUpdates.actualDt===''}"
                                @change="handleResponsibilityChange(scope.row,'actualDt')"
                                v-model="scope.row.actualDt"
                                align="right"
                                type="date"
                                :editable="false"
                                :disabled="!isModify"
                                :placeholder="isModify?$i.order.pleaseChoose:''">
                        </el-date-picker>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-authorize="'ORDER:DETAIL:PAYMENT'">
            <div class="title">
                {{$i.order.payment}}
            </div>
            <div class="payment-table">
                <el-button
                        v-authorize="'ORDER:DETAIL:PAYMENT:APPLY_FOR_PAYMENT'"
                        :disabled="disableApplyPay || !allowHandlePay ||loadingPaymentTable"
                        :loading="disableClickApplyPay"
                        @click="applyPay"
                        type="primary">{{$i.order.applyPay}}
                </el-button>
                <v-button
                        v-authorize="'ORDER:DETAIL:PAYMENT:URGE_PAYMENT'"
                        moduleCode="ORDER"
                        :orderNo="orderForm.orderNo"
                        :orderType="10"
                        :disabled="!allowHandlePay || loadingPaymentTable">
                    {{$i.order.remindSupplierRefund}}
                </v-button>
                <el-table
                        v-loading="loadingPaymentTable"
                        class="payTable"
                        :data="paymentData"
                        border
                        :summary-method="getSummaries"
                        show-summary
                        :row-class-name="tableRowClassName"
                        style="width: 100%">
                    <el-table-column
                            fixed="left"
                            label="#"
                            align="center"
                            width="55">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="no"
                            :label="$i.order.payNo"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            :label="$i.order.payName"
                            width="180">
                        <template slot-scope="scope">
                            <el-select
                                    v-if="scope.row.isNew || scope.row.isModify"
                                    v-model="scope.row.name"
                                    clearable
                                    :placeholder="$i.order.pleaseChoose">
                                <el-option
                                        v-for="item in paymentItemOption"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                            <span v-else>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$i.order.planPayDt"
                            width="200">
                        <template slot-scope="scope">
                            <el-date-picker
                                    v-if="scope.row.isNew || scope.row.isModify"
                                    class="speDate"
                                    v-model="scope.row.planPayDt"
                                    type="date"
                                    :picker-options="datePickOption"
                                    :placeholder="$i.order.pleaseChoose">
                            </el-date-picker>
                            <span v-else>{{scope.row.planPayDt?$dateFormat(scope.row.planPayDt,"yyyy-mm-dd"):""}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="planPayAmount"
                            :label="$i.order.planPayAmount"
                            width="160">
                        <template slot-scope="scope">
                            <v-input-number
                                    v-if="scope.row.isNew || scope.row.isModify"
                                    class="speNumber"
                                    v-model="scope.row.planPayAmount"
                                    :controls="false"
                                    :min="0"></v-input-number>
                            <span v-else>{{scope.row.planPayAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="actualPayDt"
                            :label="$i.order.actualPayDt"
                            width="200">
                        <template slot-scope="scope">
                            <el-date-picker
                                    class="speDate"
                                    v-if="scope.row.isNew || scope.row.isModify"
                                    v-model="scope.row.actualPayDt"
                                    type="date"
                                    :picker-options="datePickOption1"
                                    :placeholder="$i.order.pleaseChoose">
                            </el-date-picker>
                            <span v-else>{{scope.row.actualPayDt?$dateFormat(scope.row.actualPayDt,"yyyy-mm-dd"):""}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="actualPayAmount"
                            :label="$i.order.actualPayAmount"
                            width="160">
                        <template slot-scope="scope">
                            <v-input-number
                                    v-if="scope.row.isNew || scope.row.isModify"
                                    class="speNumber"
                                    v-model="scope.row.actualPayAmount"
                                    :controls="false"
                                    :min="0"></v-input-number>
                            <span v-else>{{scope.row.actualPayAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$i.order.planRefundDt"
                            width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.planRefundDt?$dateFormat(scope.row.planRefundDt,"yyyy-mm-dd"):""}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="planRefundAmount"
                            :label="$i.order.planRefundAmount"
                            width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.planRefundAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$i.order.actualRefundDt"
                            width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.actualRefundDt?$dateFormat(scope.row.actualRefundDt,"yyyy-mm-dd"):""}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="actualRefundAmount"
                            :label="$i.order.actualRefundAmount"
                            width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.actualRefundAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            :label="$i.order.remarkBig"
                            width="200">
                        <template slot-scope="scope">
                            <el-input
                                    v-if="scope.row.isNew || scope.row.isModify"
                                    :placeholder="$i.order.pleaseInput"
                                    v-model="scope.row.remark"
                                    clearable>
                            </el-input>
                            <span v-else>{{scope.row.remark}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="currencyCode"
                            :label="$i.order.payCurrency"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            align="center"
                            :label="$i.order.available"
                            width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status===-1">{{$i.order.abandon}}</span>
                            <span v-if="scope.row.status===10">{{$i.order.waitCustomerConfirm}}</span>
                            <span v-if="scope.row.status===20">{{$i.order.waitSupplierConfirm}}</span>
                            <span v-if="scope.row.status===30">{{$i.order.waitServiceConfirm}}</span>
                            <span v-if="scope.row.status===40">{{$i.order.confirm}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            :label="$i.order.action"
                            align="center"
                            width="160">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status===10">
                                <el-button
                                        v-authorize="'ORDER:DETAIL:PAYMENT:CONFIRM_REFUND'"
                                        @click="confirmPay(scope.row)"
                                        type="text">{{$i.order.confirm}}
                                </el-button>
                            </div>
                            <div v-else-if="scope.row.status===40 && scope.row.planRefundDt">

                            </div>
                            <div v-else>
                                <div v-if="scope.row.isNew">
                                    <el-button
                                            :disabled="!allowHandlePay"
                                            @click="saveNewPay(scope.row)"
                                            type="text"
                                            size="small">{{$i.order.save}}
                                    </el-button>
                                    <el-button
                                            :disabled="!allowHandlePay"
                                            @click="cancelNewPay(scope.row)"
                                            type="text"
                                            size="small">{{$i.order.cancel}}
                                    </el-button>
                                </div>
                                <div v-else>
                                    <div v-if="scope.row.status===-1">
                                        <el-button
                                                v-authorize="'ORDER:DETAIL:PAYMENT:ORDER_PAYMENT_MODIFY_INVALID_RECOVER'"
                                                v-if="scope.row.planPayDt"
                                                :disabled="!allowHandlePay"
                                                @click="restorePay(scope.row)"
                                                type="text">{{$i.order.restore}}
                                        </el-button>
                                    </div>
                                    <div v-else-if="scope.row.isModify">
                                        <el-button
                                                :disabled="!allowHandlePay"
                                                @click="saveModifyPay(scope.row)"
                                                type="text"
                                                size="small">{{$i.order.save}}
                                        </el-button>
                                        <el-button :disabled="!allowHandlePay" @click="cancelModifyPay(scope.row)"
                                                   type="text" size="small">{{$i.order.cancel}}
                                        </el-button>
                                    </div>
                                    <div v-else>
                                        <el-button
                                                v-authorize="'ORDER:DETAIL:PAYMENT:ORDER_PAYMENT_MODIFY_INVALID_RECOVER'"
                                                @click="modifyPay(scope.row)"
                                                :disabled="!allowHandlePay"
                                                type="text">
                                            {{$i.order.modify}}
                                        </el-button>
                                        <el-button
                                                v-authorize="'ORDER:DETAIL:PAYMENT:ORDER_PAYMENT_MODIFY_INVALID_RECOVER'"
                                                @click="abandonPay(scope.row)"
                                                :disabled="!allowHandlePay"
                                                type="text">
                                            {{$i.order.abandon}}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="title">
            {{$i.order.productInfoBig}}
        </div>
        <v-table ref="table"
                 :totalRow="totalRow"
                 code="uorder_sku_list"
                 native-sort="skuSysCode"
                 @change-sort="$refs.table.setSort(productTableData)"
                 :height="500"
                 :data.sync="productTableData"
                 :buttons="handleShowBtn"
                 @action="productInfoAction"
                 :loading='loadingProductTable'
                 @change-checked="changeProductChecked"
                 :rowspan="2"
                 :total-row="tableTotal">
            <template slot="header">
                <div class="btns">
                    <el-button
                            :disabled="!isModify"
                            @click="addProduct">{{$i.order.addProduct}}
                    </el-button>
                    <el-button
                            @click="removeProduct"
                            :disabled="selectProductInfoTable.length===0 || !isModify"
                            type="danger">{{$i.order.remove}}
                    </el-button>
                </div>
            </template>
        </v-table>
        <div class="summary">
            <div class="second-title">
                {{$i.order.summary}}
            </div>
            <el-form label-width="280px">
                <el-row class="speZone">
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.totalOuterCartonQty">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.totalOuterCartonQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.totalSkuPrice">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.totalSkuPrice"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.orderSkuQty">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.skuQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.totalQty">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.totalQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.totalNetWeight">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.totalNetWeight"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.totalGrossWeight">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.totalGrossWeight"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.order.totalVolume">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="orderForm.totalVolume"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="footBtn">
            <div v-if="isModify">
                <el-button
                        :disabled="loadingPage"
                        :loading="disableClickSend"
                        @click="send"
                        type="primary">
                    {{$i.order.send}}
                </el-button>
                <el-button :loading="disableClickCancelModify" @click="cancelModify" type="danger">{{$i.order.exit}}
                </el-button>
            </div>
            <div v-else>
                <el-button
                        v-authorize="'ORDER:DETAIL:MODIFY'"
                        :disabled="loadingPage || disableModify || hasCancelOrder || hasFinishOrder"
                        @click="modifyOrder"
                        type="primary">{{$i.order.modify}}
                </el-button>
                <el-button
                        v-authorize="'ORDER:DETAIL:CONFIRM'"
                        :disabled="loadingPage || disableConfirm || hasCancelOrder"
                        @click="confirmOrder"
                        :loading="disableClickConfirm"
                        type="primary">{{$i.order.confirm}}
                </el-button>
                <el-button
                        v-authorize="'ORDER:DETAIL:DOWNLOAD'"
                        :disabled="loadingPage"
                        @click="downloadOrder"
                        :loading="disableClickConfirm"
                        type="primary">
                    {{$i.order.download}}
                </el-button>
                <el-button
                        v-authorize="'ORDER:DETAIL:CANCEL'"
                        :disabled="loadingPage || hasCancelOrder || hasFinishOrder" :loading="disableCancelOrder"
                        @click="cancelOrder"
                        type="danger">{{$i.order.cancel}}
                </el-button>
            </div>
        </div>
        <el-dialog
                custom-class="ucn-dialog-center"
                :title="$i.order.addProduct"
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
            <el-select
                    slot="skuFobCurrency"
                    v-model="data.value"
                    slot-scope="{data}"
                    clearable
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified = true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
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
                    @change="val => data._isModified=true"
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in quarantineTypeOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            <el-select
                    slot="skuStatus"
                    :disabled="disableChangeSkuStatus"
                    v-model="data._value"
                    slot-scope="{data}"
                    clearable
                    @change="val=>data._isModifyStatus=true"
                    :placeholder="$i.order.pleaseChoose">
                <el-option
                        v-for="item in skuStatusOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>

            <v-input-number
                    class="speNumber spx"
                    slot="skuFobPrice"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    @blur="handlePriceBlur"
                    :accuracy="4"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuExwPrice"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    @blur="handlePriceBlur"
                    :accuracy="4"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuCifPrice"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    @blur="handlePriceBlur"
                    :accuracy="4"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuDduPrice"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    @blur="handlePriceBlur"
                    :accuracy="4"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuQty"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    @blur="handlePriceBlur(data)"
                    :accuracy="1"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    class="speNumber spx"
                    slot="skuPrice"
                    slot-scope="{data}"
                    :disabled="true"
                    :accuracy="4"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuLength"
                    slot-scope="{data}"
                    :accuracy="2"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuWidth"
                    slot-scope="{data}"
                    :accuracy="2"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuHeight"
                    slot-scope="{data}"
                    :accuracy="2"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuNetWeight"
                    slot-scope="{data}"
                    :accuracy="2"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuVolume"
                    slot-scope="{data}"
                    :accuracy="6"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonQty"
                    slot-scope="{data}"
                    :accuracy="1"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuInnerCartonLength"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuInnerCartonWidth"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuInnerCartonHeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuInnerCartonWeightNet"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuInnerCartonRoughWeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonVolume"
                    :accuracy="3"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuInnerCartonOuterNum"
                    :accuracy="1"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    slot="skuOuterCartonQty"
                    @blur="handlePriceBlur"
                    :accuracy="1"
                    slot-scope="{data}"
                    @change="val => data._isModified=true"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuOuterCartonLength"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuOuterCartonWidth"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuOuterCartonHeight"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuOuterCartonNetWeight"
                    @blur="handlePriceBlur"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuOuterCartonRoughWeight"
                    @blur="handlePriceBlur"
                    :accuracy="2"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuOuterCartonVolume"
                    @blur="handlePriceBlur"
                    :accuracy="3"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuApplicableAge"
                    :accuracy="0"
                    :max="127"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuExpireDates"
                    :accuracy="0"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuSampleQty"
                    :accuracy="1"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuSamplePrice"
                    :accuracy="4"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
                    slot="skuDeliveryDates"
                    :accuracy="0"
                    slot-scope="{data}"
                    v-model="data.value"></v-input-number>
            <v-input-number
                    :min="0"
                    class="speNumber spx"
                    @change="val => data._isModified=true"
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
        <v-message-board
                v-if="chatParams"
                :readonly="orderForm.status==='5'"
                module="ORDER"
                code="orderDetail"
                :arguments="chatParams"
                :id="$route.query.orderId"></v-message-board>
    </div>
</template>

<script>

    import {
        VTable,
        VPagination,
        selectSearch,
        VUpload,
        VHistoryModify,
        VMessageBoard,
        VProduct,
        VInputNumber,
        VButton
    } from "@/components/index";
    import { mapActions } from "vuex";

    export default {
        name: "createOrder",
        components: {
            VTable,
            page: VPagination,
            selectSearch,
            VUpload,
            VProduct,
            VHistoryModify,
            VMessageBoard,
            VInputNumber,
            VButton
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
                orderStatusOption: [],
                countryOption: [],
                quarantineTypeOption: [],
                skuStatusOption: [],
                skuStatusTotalOption: [],
                paymentItemOption: [],

                /**
                 * Negotiate 插槽变量
                 * */
                skuLabelPic: "",

                /**
                 * 底部按钮禁用状态
                 * */
                disableModify: false,
                markImportant: false,
                disableConfirm: false,
                disableCancelOrder: false,
                hasCancelOrder: false,
                hasFinishOrder: false,
                disableClickCancelModify: false,
                disableClickConfirm: false,

                /**
                 * 页面基础配置
                 * */
                isModify: false,     //是否在modify状态
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
                tableData: [],
                selectSearch: "",
                productInfoBtn: [
                    {
                        label: this.$i.order.modify,
                        type: "negotiate"
                    },
                    {
                        label: this.$i.order.history,
                        type: "history"
                    },
                    {
                        label: this.$i.order.detail,
                        type: "detail"
                    }
                ],
                productNotModifyBtn: [
                    {
                        label: this.$i.order.history,
                        type: "history"
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
                datePickOption: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                datePickOption1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                copyObj: {},
                chooseProduct: {},
                savedIncoterm: "",           //用来存储incoterm
                disableChangeSkuStatus: false,
                initialData: {},
                chatParams: null,

                /**
                 * payment data配置
                 * */
                disableApplyPay: false,
                disableClickApplyPay: false,
                allowHandlePay: false,       //是否可以操作payment模块
                loadingPaymentTable: false,
                paymentData: [],
                copyList: [],

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
                    sorts: []
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
                    archive: true,
                    attachments: [],
                    basicFlag: false,     //basicInfo是否修改
                    currency: "",
                    customerAgreementDt: "",
                    customerAgreementNo: "",
                    // customerName: "string",
                    customerOrderNo: "",
                    deliveredQty: 0,
                    deliveryDt: "",
                    departureCountry: "",
                    departurePort: "",
                    destCountry: "",
                    destPort: "",
                    draftCustomer: false,       //saveAsDraft的时候为true
                    // draftSupplier: true,
                    // entryDt: "2018-06-01T01:37:58.742Z",
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
                    fieldRemark: {
                        // additionalProp1: "string",
                        // additionalProp2: "string",
                        // additionalProp3: "string"
                    },
                    fieldUpdate: {},
                    // importantCustomer: true,
                    // importantSupplier: true,
                    incoterm: "",
                    incotermArea: "",
                    lcNo: "",
                    orderNo: "",
                    orderSkuUpdateList: [],
                    payment: "",
                    paymentDays: 0,
                    productFlag: false,
                    // paymentRemark: "",
                    // paymentStatus: "",
                    quotationNo: "",
                    remark: "",
                    remind: true,
                    responsibilityFlag: false,
                    responsibilityList: [],
                    skuList: [],
                    // skuQty: 0,
                    // skuSupplierName: "",
                    // status: "",
                    supplierCode: "",
                    supplierId: 0,
                    supplierName: "",
                    supplierOrderNo: "",
                    // timeZone: "",
                    transport: "1"
                }
            };
        },
        computed: {
            totalRow() {
                let obj = {};
                let arr = [];
                _.map(this.productTableData, v => {
                    if (!v._remark) {
                        arr.push(v);
                    }
                });
                let sameCurrency = true;
                if (this.orderForm.incoterm === "1") {
                    let size = new Set(arr.map(e => e.skuFobCurrency).map(e => e.value));
                    if ([...size].length > 1) sameCurrency = false;
                }
                else if (this.orderForm.incoterm === "2") {
                    let size = new Set(arr.map(e => e.skuExwCurrency).map(e => e.value));
                    if ([...size].length > 1) sameCurrency = false;
                }
                else if (this.orderForm.incoterm === "3") {
                    let size = new Set(arr.map(e => e.skuCifCurrency).map(e => e.value));
                    if ([...size].length > 1) sameCurrency = false;
                }
                else if (this.orderForm.incoterm === "4") {
                    let size = new Set(arr.map(e => e.skuDduCurrency).map(e => e.value));
                    if ([...size].length > 1) sameCurrency = false;
                }
                if (this.productTableData.length <= 0) {
                    return;
                }
                _.map(this.productTableData, v => {
                    _.mapObject(v, (item, key) => {
                        if (item._calculate) {
                            if (key === "skuPrice") {
                                if (sameCurrency) {
                                    obj[key] = {
                                        value: this.$calc.add(Number(item.value), (Number(obj[key] ? obj[key].value : 0) || 0))
                                    };
                                } else {
                                    obj[key] = {
                                        value: "-"
                                    };
                                }
                            } else {
                                obj[key] = {
                                    value: this.$calc.add(Number(item.value), (Number(obj[key] ? obj[key].value : 0) || 0))
                                };
                            }
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
            /**
             * 获取页面数据
             * */
            getUnit() {
                let currency, country, exchangeRate, unit;
                currency = this.$ajax.get(this.$apis.CURRENCY_ALL, {}, { cache: true });
                country = this.$ajax.get(this.$apis.COUNTRY_ALL, {}, { cache: true });
                exchangeRate = this.$ajax.get(this.$apis.CUSTOMERCURRENCYEXCHANGERATE_QUERY, {}, { cache: true });
                unit = this.$ajax.post(this.$apis.get_partUnit, ["PMT", "ITM", "MD_TN", "SKU_UNIT", "LH_UNIT", "VE_UNIT", "WT_UNIT", "ED_UNIT", "NS_IS", "QUARANTINE_TYPE", "ORDER_STATUS", "SKU_SALE_STATUS", "SKU_STATUS", "PAYMENT_ITEM_NAME"], { cache: true });
                this.skuStatusOption = [];
                this.$ajax.all([currency, country, exchangeRate, unit]).then(res => {
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
                        } else if (v.code === "ORDER_STATUS") {
                            this.orderStatusOption = v.codes;
                        } else if (v.code === "QUARANTINE_TYPE") {
                            this.quarantineTypeOption = v.codes;
                        } else if (v.code === "SKU_STATUS") {
                            this.skuStatusTotalOption = v.codes;
                            _.map(this.skuStatusTotalOption, (v, k) => {
                                if (k === 1 || k === 3) {
                                    this.skuStatusOption.push(v);
                                }
                            });
                        } else if (v.code === "PAYMENT_ITEM_NAME") {
                            this.paymentItemOption = v.codes;
                        }
                    });
                    this.getDetail();
                }).catch(() => {
                    this.loadingPage = false;
                });
            },
            getDetail(e, isTrue) {
                this.$ajax.post(this.$apis.ORDER_DETAIL, {
                    orderId: this.$route.query.orderId,
                    orderNo: this.$route.query.orderNo || this.$route.query.code
                }).then(res => {
                    this.orderForm = res;
                    this.chatParams = {
                        bizNo: res.orderNo,
                        dataAuthCode: "BIZ_ORDER",
                        funcAuthCode: "",            //功能权限
                        suppliers: [{
                            userId: res.supplierUserId,
                            companyId: res.supplierCompanyId,
                            tenantId: res.supplierTenantId
                        }]
                    };
                    /**
                     * 高亮处理
                     * */
                    _.map(this.$db.order.orderDetail, v => {
                        v._isModified = false;
                    });
                    if (this.orderForm.status === "1" || this.orderForm.status === "2" && !isTrue) {
                        _.map(this.orderForm.fieldUpdate, (v, k) => {
                            if (k === "attachments") {
                                k = "attachment";
                            }
                            this.$db.order.orderDetail[k]._isModified = true;
                        });

                        _.map(this.orderForm.responsibilityList, v => {
                            v.fieldUpdates = v.fieldUpdate;
                            v.fieldUpdate = {};
                        });
                    }
                    this.orderForm.fieldUpdate = {};
                    this.initialData = this.$depthClone(this.orderForm);
                    this.savedIncoterm = Object.assign({}, res).incoterm;
                    _.map(this.supplierOption, v => {
                        if (v.code === res.supplierCode) {
                            this.orderForm.supplierName = v.id;
                        }
                    });
                    this.changePayment(res.payment);
                    let data = this.$getDB(this.$db.order.productInfoTable, this.$refs.HM.getFilterData(res.skuList, "skuSysCode"), item => {
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
                    this.handleIncoterm();
                    if (this.orderForm.status === "1" || this.orderForm.status === "2" && !isTrue) {
                        _.map(this.productTableData, v => {
                            if (v.fieldUpdate.value) {
                                _.map(v.fieldUpdate.value, (value, key) => {
                                    if (key !== "skuPictures") {
                                        if (v[key]) {
                                            v[key]._style = { "backgroundColor": "yellow" };
                                        }
                                    }
                                });
                                v.fieldUpdate.value = {};
                            }
                            if (v._remark) {
                                // console.log(this.$depthClone(v.fieldRemarkUpdate),'fieldRemarkUpdate')
                            }
                        });
                    }
                    this.markImportant = this.orderForm.importantCustomer;
                    //判断底部按钮能不能点
                    if (res.status !== "2" && res.status !== "3" && res.status !== "4") {
                        this.disableModify = true;
                    }
                    else {
                        this.disableModify = false;
                    }
                    if (res.status !== "2") {
                        this.disableConfirm = true;
                    }
                    else {
                        this.disableConfirm = false;
                    }
                    if (res.status === "4") {
                        this.hasFinishOrder = true;
                    }
                    else {
                        this.hasFinishOrder = false;
                    }
                    if (res.status === "5") {
                        this.hasCancelOrder = true;
                    }
                    else {
                        this.hasCancelOrder = false;
                    }
                    //代表已经接单了
                    if (res.supplierUserId) {
                        this.allowHandlePay = true;
                    }
                    /**
                     * 获取payment数据
                     * */
                    this.getPaymentData();
                }).finally(() => {
                    this.$nextTick(() => {
                        this.loadingPage = false;
                    });
                    this.disableClickCancelModify = false;
                    if (e) {
                        this.isModify = false;
                    }
                });
            },
            getPaymentData() {
                this.loadingPaymentTable = true;
                this.$ajax.post(this.$apis.PAYMENT_LIST, {
                    orderNo: this.orderForm.orderNo,
                    orderType: 10,
                    moduleCode: "ORDER"
                }).then(res => {
                    _.map(res.datas, v => {
                        v.name = (_.findWhere(this.paymentItemOption, { code: v.name }) || {}).name;
                    });
                    this.paymentData = res.datas;
                }).finally(() => {
                    this.loadingPaymentTable = false;
                });
            },
            send() {
                let params = Object.assign({}, this.orderForm);
                _.map(this.supplierOption, v => {
                    if (params.supplierName === v.id) {
                        params.supplierName = v.name;
                        params.supplierCode = v.code;
                        params.supplierId = v.id;
                        params.supplierCompanyId = v.companyId;
                    }
                });
                let orderSkuUpdateList = [];
                _.map(this.productTableData, item => {
                    let isModify = false, isModifyStatus = false;
                    _.map(item, (val, index) => {
                        if (val._isModified) {
                            isModify = true;
                        }
                        if (val._isModifyStatus) {
                            isModifyStatus = true;
                        }
                    });
                    if (isModify || isModifyStatus) {
                        let isIn = false;
                        _.map(orderSkuUpdateList, data => {
                            if (data.skuId === item.skuId.value) {
                                data.skuInfo = isModify;
                                data.skuStatus = isModifyStatus;
                                isIn = true;
                            }
                        });
                        if (!isIn) {
                            orderSkuUpdateList.push({
                                skuId: item.skuId.value,
                                skuInfo: isModify,
                                skuStatus: isModifyStatus
                            });
                        }
                    }
                    if (!item._remark) {
                        _.map(item, (v, k) => {
                            if (v._isModified || v._isModifyStatus) {
                                if (!item.fieldUpdate.value) {
                                    item.fieldUpdate.value = {};
                                }
                                item.fieldUpdate.value[k] = "";
                            }
                        });
                    }
                    else {
                        if (!item.fieldRemarkUpdate || !item.fieldRemarkUpdate.value) {
                            item.fieldRemarkUpdate = { value: {} };
                        }
                        _.map(item, (v, k) => {
                            if (v._isModified || v._isModifyStatus) {
                                item.fieldRemarkUpdate.value[k] = "";
                            }
                        });
                    }
                });
                params.orderSkuUpdateList = orderSkuUpdateList;
                params.skuList = this.dataFilter(this.productTableData);

                /**
                 * 判断是否产品客户语言描述，产品客户语言品名和客户货号填了
                 * */
                for (let val in params.skuList) {
                    if (this.$validateForm(params.skuList[val], this.$db.order.productInfoTable)) {
                        return;
                    }
                }

                let rightCode = true;
                _.map(params.skuList, v => {
                    if (v.skuSupplierCode !== params.supplierCode) {
                        rightCode = false;
                    }
                    v.skuSample = v.skuSample === "1" ? true : false;
                    v.skuInspectQuarantineCategory = (_.findWhere(this.quarantineTypeOption, { code: v.skuInspectQuarantineCategory }) || {}).code;
                    let picKey = ["skuPkgMethodPic", "skuInnerCartonPic", "skuOuterCartonPic", "skuAdditionalOne", "skuAdditionalTwo", "skuAdditionalThree", "skuAdditionalFour"];
                    _.map(picKey, item => {
                        if (_.isArray(v[item])) {
                            v[item] = (v[item][0] ? v[item][0] : null);
                        } else if (_.isString(v[item])) {
                            let key = this.$getOssKey(v[item], true);
                            v[item] = key[0];
                        }
                    });
                });
                if (!rightCode) {
                    return this.$message({
                        message: this.$i.order.supplierNotTheSame,
                        type: "warning"
                    });
                }
                params.attachments = this.$refs.upload[0].getFiles();
                this.disableClickSend = true;
                this.$ajax.post(this.$apis.ORDER_UPDATE, params).then(res => {
                    this.isModify = false;
                    this.getDetail();
                }).finally(err => {
                    this.disableClickSend = false;
                });
            },
            saveAsDraft() {
                let params = Object.assign({}, this.orderForm);
                _.map(this.supplierOption, v => {
                    if (params.supplierName === v.code) {
                        params.supplierName = v.name;
                        params.supplierCode = v.code;
                        params.supplierId = v.id;
                    }
                });
                params.skuList = this.dataFilter(this.productTableData);
                params.attachments = this.$refs.upload[0].getFiles();
                params.draftCustomer = true;
                this.disableClickSaveDraft = true;
                this.$ajax.post(this.$apis.ORDER_SAVE, params).then(res => {
                    this.$router.push("/order/overview");
                }).finally(err => {
                    this.disableClickSaveDraft = false;
                });
            },
            getOrderNo() {
                this.getSupplier();
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
                }).catch(() => {
                    this.loadingPage = false;
                });
            },
            getInquiryData() {
                this.loadingTable = true;
                this.$ajax.post(this.$apis.INQUIERY_LIST, this.inquiryConfig).then(res => {
                    this.tableDataList = this.$getDB(this.$db.order.inquiryOverview, res.datas);
                    this.pageData = res;
                }).finally(() => {
                    this.loadingTable = false;
                });
            },
            changePayment(e, key) {
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
                if (key) {
                    if (!this.orderForm.fieldUpdate) {
                        this.orderForm.fieldUpdate = {};
                    }
                    this.orderForm.fieldUpdate[key] = "";
                }
            },

            /**
             * basic info事件
             * */
            handleChange(key) {
                if (!this.orderForm.fieldUpdate) {
                    this.orderForm.fieldUpdate = {};
                }
                this.orderForm.fieldUpdate[key] = "";
                if (key === "incoterm") {

                    this.handleIncoterm();

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
                }
            },
            changeAttachment(a, b) {
                if (b) {
                    return;
                }
                if (!this.orderForm.fieldUpdate) {
                    this.orderForm.fieldUpdate = {};
                }
                this.orderForm.fieldUpdate["attachments"] = "";
            },

            /**
             * responsibility事件
             * */
            handleResponsibilityChange(data, key) {
                this.orderForm.responsibilityFlag = true;
                if (!data.fieldUpdate) {
                    data.fieldUpdate = {};
                }
                data.fieldUpdate[key] = "";
            },
            addResponsibility() {
                this.orderForm.responsibilityList.push({
                    type: "",
                    customer: "",
                    supplier: "",
                    remark: "",
                    actualDt: "",
                    fieldUpdate: {
                        type: "",
                        customer: "",
                        supplier: "",
                        remark: "",
                        actualDt: ""
                    },
                    orderNo: this.orderForm.orderNo
                });
            },

            /**
             * product info事件
             * */
            handleShowBtn(item) {
                let config;
                if (this.isModify) {
                    if (item.skuStatus.value === "SHIPPED") {
                        config = this.productNotModifyBtn;
                    } else {
                        config = this.productInfoBtn;
                    }
                } else {
                    config = this.productNotModifyBtn;
                }
                return config;
            },
            handleIncoterm() {
                let incoterm,
                    totalPrice = ["skuFobCurrency", "skuFobPort", "skuFobPrice", "skuExwCurrency", "skuExwPrice", "skuCifPrice", "skuCifCurrency", "skuCifPort", "skuDduCurrency", "skuDduPort", "skuDduPrice"],
                    fob = ["skuFobCurrency", "skuFobPort", "skuFobPrice"],
                    exw = ["skuExwCurrency", "skuExwPrice"],
                    cif = ["skuCifPrice", "skuCifCurrency", "skuCifPort"],
                    ddu = ["skuDduCurrency", "skuDduPort", "skuDduPrice"];
                console.log(this.orderForm.incoterm, "this.orderForm.incoterm");
                if (this.orderForm.incoterm === "1") {
                    incoterm = fob;
                } else if (this.orderForm.incoterm === "2") {
                    incoterm = exw;
                } else if (this.orderForm.incoterm === "3") {
                    incoterm = cif;
                } else if (this.orderForm.incoterm === "4") {
                    incoterm = ddu;
                }
                // _.map(totalPrice, v => {
                //     _.map(this.productTableData, item => {
                //         if (!item._remark) {
                //             item[v]._mustHide=true;
                //             item[v]._mustShow=false;
                //         }
                //     });
                // });
                // _.map(incoterm, v => {
                //     _.map(this.productTableData, item => {
                //         if (!item._remark) {
                //             item[v]._mustHide=false;
                //             item[v]._mustShow=true;
                //         }
                //     });
                // });
                // this.$refs.table.$refs.filterColumn.update(false,this.$depthClone(this.productTableData)).then(res=>{
                //     this.productTableData=this.$refs.table.$refs.filterColumn.getFilterData(this.$depthClone(this.productTableData),res);
                // });
            },
            productInfoAction(e, type) {
                if (type === "negotiate") {
                    if (e._isNew) {
                        this.disableChangeSkuStatus = true;
                    } else {
                        this.disableChangeSkuStatus = false;
                    }
                    let arr = [];
                    _.map(this.productTableData, v => {
                        if (Number(v.skuSysCode.value) === Number(e.skuSysCode.value)) {
                            arr.push(v);
                        }
                    });
                    this.getHistory(e, arr, true).then(data => {
                        this.chooseProduct = data;
                    });
                }
                else if (type === "detail") {
                    this.$windowOpen({
                        url: "/product/sourcingDetail",
                        params: {
                            id: e.skuId.value
                        }
                    });
                }
                else if (type === "history") {
                    let data = _.filter(this.productTableData, (m) =>
                        m.skuSysCode.value === e.skuSysCode.value
                    );
                    this.getHistory(e, []);
                }
            },
            getHistory(e, data, isTrue) {
                let param = {
                    operatorFilters: [],
                    orderId: this.$route.query.orderId,
                    pn: 1,
                    ps: 50,
                    skuId: e.skuId.value
                };

                return this.$ajax.post(this.$apis.ORDER_HISTORY, param).then(res => {
                    let array = [], obj = {};
                    _.map(res.datas, v => {
                        obj = JSON.parse(v.history);
                        obj.fieldRemark = JSON.parse(v.fieldsRemark);
                        array.push(obj);
                    });

                    let history = this.$getDB(this.$db.order.productInfoTable, this.$refs.HM.getFilterData(array, "skuSysCode", true), item => {
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
                    return this.$refs.HM.init(data, history, isTrue ? true : false);
                }).finally(() => {

                });
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
                    console.log(this.selectProductInfoTable, "this.selectProductInfoTable");
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
                    _.map(res, v => {
                        v.skuStatus = "TBC";
                    });
                    let data = this.$getDB(this.$db.order.productInfoTable, this.$refs.HM.getFilterData(res, "skuSysCode"), item => {
                        item._isNew = true;
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

                    this.handleIncoterm();
                }).finally(err => {
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
                if (this.$validateForm(obj, this.$db.order.productInfoTable)) {
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
                            if (k === "fieldRemarkUpdate") {
                                json[k] = item[k].value;
                            } else {
                                jsons[k] = item[k].value;
                            }
                        }
                        json.fieldRemark = jsons;
                    } else {
                        json = {};
                        for (let k in item) {
                            if (json[k] === "fieldRemark") {
                                json[k] = jsons;
                            } else {
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
                                        json[k] = _.findWhere(this.expirationDateOption, { name: item[k]._value }).code;
                                    }
                                    else if (item[k].key === "skuStatus") {
                                        json[k] = (_.findWhere(this.skuStatusTotalOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuSample") {
                                        json[k] = (_.findWhere(this.isNeedSampleOption, { code: item[k].value }) || {}).code;
                                    }
                                    else if (item[k].key === "skuInspectQuarantineCategory") {
                                        json[k] = (_.findWhere(this.quarantineTypeOption, { name: item[k]._value }) || {}).code;
                                    }
                                    else {
                                        json[k] = item[k].value;
                                    }
                                }
                                else {
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
             * payment事件
             * */
            applyPay() {
                this.disableClickApplyPay = true;
                this.$ajax.post(this.$apis.get_qcPaymentNo).then(res => {
                    this.paymentData.push({
                        no: res,
                        name: "",
                        planPayDt: "",
                        planPayAmount: "",
                        actualPayDt: "",
                        actualPayAmount: "",
                        currencyCode: this.initialData.currency,
                        status: 20,
                        remark: "",
                        isNew: true
                    });
                }).finally(() => {
                    this.disableClickApplyPay = false;
                });
            },
            saveNewPay(data) {
                let param = {
                    actualPayAmount: data.actualPayAmount,
                    actualPayDt: data.actualPayDt,
                    currency: 0,
                    currencyCode: "",
                    name: data.name,
                    no: data.no,
                    orderNo: this.orderForm.orderNo,
                    orderType: 10,
                    payToCompanyId: this.orderForm.supplierCompanyId,
                    payToCompanyName: this.orderForm.supplierName,
                    planPayAmount: data.planPayAmount,
                    planPayDt: data.planPayDt,
                    remark: data.remark,
                    type: 10,
                    moduleCode: "ORDER"
                };
                _.map(this.currencyOption, v => {
                    if (v.code === data.currencyCode) {
                        param.currency = v.id;
                        param.currencyCode = v.code;
                    }
                });
                this.loadingPaymentTable = true;
                this.$ajax.post(this.$apis.PAYMENT_SAVE, param).then(res => {
                    this.$message({
                        message: this.$i.order.saveSuccess,
                        type: "success"
                    });
                    this.$set(data, "name", (_.findWhere(this.paymentItemOption, { code: res.name } || {}).name));
                    this.$set(data, "isNew", false);
                    this.$set(data, "version", res.version);
                    this.$set(data, "id", res.id);
                    this.disableApplyPay = false;
                }).finally(err => {
                    this.loadingPaymentTable = false;
                });
            },
            cancelNewPay(data) {
                this.paymentData = _.difference(this.paymentData, [data]);
                this.$message({
                    type: "success",
                    message: this.$i.order.deleteSuccess
                });
            },
            modifyPay(data) {
                data.name = (_.findWhere(this.paymentItemOption, { name: data.name }) || {}).code;
                this.$set(data, "isModify", true);
                let has = false;
                this.copyList.forEach(v => {
                    if (v.no === data.no) {
                        has = true;
                    }
                });
                if (!has) {
                    this.copyList.push(Object.assign({}, data));
                }
            },
            saveModifyPay(data) {
                let param = {
                    actualPayAmount: data.actualPayAmount,
                    actualPayDt: data.actualPayDt,
                    id: data.id,
                    name: data.name,
                    planPayAmount: data.planPayAmount,
                    planPayDt: data.planPayDt,
                    version: data.version,
                    remark: data.remark,
                    moduleCode: "ORDER"
                };
                this.loadingPaymentTable = true;
                this.$ajax.post(this.$apis.PAYMENT_UPDATE, param).then(res => {
                    console.log(res);
                    this.$message({
                        message: this.$i.warehouse.changeSuccess,
                        type: "success"
                    });
                    this.copyList.forEach(v => {
                        if (v.no === data.no) {
                            let obj = Object.assign({}, data);
                            this.$set(v, "name", obj.name);
                            this.$set(v, "planPayDt", obj.planPayDt);
                            this.$set(v, "planPayAmount", obj.planPayAmount);
                            this.$set(v, "actualPayDt", obj.actualPayDt);
                            this.$set(v, "actualPayAmount", obj.actualPayAmount);
                            this.$set(v, "remark", obj.remark);
                        }
                    });
                    this.$set(data, "name", (_.findWhere(this.paymentItemOption, { code: res.name }) || {}).name);
                    this.$set(data, "isModify", false);
                    this.$set(data, "version", res.version);
                    this.$set(data, "status", res.status);
                }).finally(err => {
                    this.loadingPaymentTable = false;
                });
            },
            cancelModifyPay(data) {
                this.copyList.forEach(v => {
                    if (v.no === data.no) {
                        let obj = Object.assign({}, v);
                        this.$set(data, "name", (_.findWhere(this.paymentItemOption, { code: obj.name }) || {}).name);
                        this.$set(data, "planPayDt", obj.planPayDt);
                        this.$set(data, "planPayAmount", obj.planPayAmount);
                        this.$set(data, "actualPayDt", obj.actualPayDt);
                        this.$set(data, "actualPayAmount", obj.actualPayAmount);
                        this.$set(data, "remark", obj.remark);
                    }
                });
                this.$set(data, "isModify", false);
            },
            abandonPay(data) {
                this.$confirm(this.$i.order.sureAbandon, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: "warning"
                }).then(() => {
                    this.loadingPaymentTable = true;
                    this.$ajax.post(this.$apis.PAYMENT_ABANDON, {
                        id: data.id,
                        version: data.version,
                        moduleCode: "ORDER"
                    }).then(res => {
                        this.$message({
                            type: "success",
                            message: this.$i.order.handleSuccess
                        });
                        this.$set(data, "status", -1);
                        this.$set(data, "version", res.version);
                    }).finally(err => {
                        this.loadingPaymentTable = false;
                    });
                }).catch(() => {

                });
            },
            restorePay(data) {
                this.$confirm(this.$i.order.sureRestore, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: "warning"
                }).then(() => {
                    this.loadingPaymentTable = true;
                    this.$ajax.post(this.$apis.PAYMENT_RESTORE, {
                        id: data.id,
                        version: data.version,
                        moduleCode: "ORDER"
                    }).then(res => {
                        this.$message({
                            type: "success",
                            message: this.$i.order.handleSuccess
                        });
                        this.$set(data, "status", 20);
                        this.$set(data, "version", res.version);
                    }).finally(err => {
                        this.loadingPaymentTable = false;
                    });
                }).catch(() => {

                });
            },
            tableRowClassName({ row, rowIndex }) {
                if (row.status === -1) {
                    return "warning-row";
                } else if (row.status === 10 || row.status === 20 || row.status === 30) {
                    if (!row.isNew) {
                        return "waiting-row";
                    }

                }
                return "";
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.$i.product.total;
                        return;
                    } else if (index === 4 || index === 6 || index === 8 || index === 10) {
                        if (_.uniq(_.pluck(this.paymentData, "currencyCode")).length > 1) {
                            sums[index] = "-";
                        }
                        else {
                            const values = data.map(item => {
                                if (item.status === 40) {
                                    return Number(item[column.property]);
                                }
                            });
                            if (!values.every(value => isNaN(value))) {
                                sums[index] = values.reduce((prev, curr) => {
                                    const value = Number(curr);
                                    if (!isNaN(value)) {
                                        return prev + curr;
                                    } else {
                                        return prev;
                                    }
                                }, 0);
                            } else {

                            }
                        }
                    }
                });
                return sums;
            },
            confirmPay(data) {
                this.$confirm(this.$i.order.sureConfirm, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: "warning"
                }).then(() => {
                    this.loadingPaymentTable = true;
                    this.$ajax.post(this.$apis.PAYMENT_ACCEPT, {
                        id: data.id,
                        version: data.version,
                        moduleCode: "ORDER"
                    }).then(res => {
                        this.$message({
                            type: "success",
                            message: this.$i.order.handleSuccess
                        });
                        _.map(this.$db.order.orderDetail, v => {
                            v._isModified = false;
                        });
                        this.$set(data, "status", 40);
                        this.$set(data, "version", res.version);
                    }).finally(() => {
                        this.loadingPaymentTable = false;
                    });
                }).catch(() => {

                });
            },

            /**
             * history部分事件
             * */
            handleBlurSkuQty(data) {
                if (this.orderForm.incoterm === "1") {
                    //FOB
                } else if (this.orderForm.incoterm === "2") {
                    //EXW
                } else if (this.orderForm.incoterm === "3") {
                    //CIF
                }
            },
            handlePriceBlur(e, item) {
                let obj;
                obj = item ? item : this.chooseProduct[0];
                // skuOuterCartonQty    外箱产品数
                // skuQty    数量
                // skuCartonQty     产品箱数
                // totalCtnGw       外箱总毛重
                // skuOuterCartonRoughWeight    外箱毛重

                // 处理product info新增的四个字段
                //处理产品箱数(因为后续三个字段都与此有关，所以还要联动后面三个字段)
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

                if (this.savedIncoterm === "1") {
                    //fob
                    if (obj.skuFobPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuFobPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
                else if (this.savedIncoterm === "2") {
                    //exw
                    if (obj.skuExwPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuExwPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
                else if (this.savedIncoterm === "3") {
                    //cif
                    if (obj.skuCifPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuCifPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
                else if (this.savedIncoterm === "4") {
                    //ddu
                    if (obj.skuDduPrice.value && obj.skuQty.value) {
                        obj.skuPrice.value = this.$toFixed(this.$calc.multiply(obj.skuDduPrice.value, obj.skuQty.value), 4);
                    } else {
                        obj.skuPrice.value = 0;
                    }
                }
            },

            /**
             * 底部按钮事件
             * */
            modifyOrder() {
                this.isModify = true;
            },
            cancelModify() {
                this.disableClickCancelModify = true;
                this.disableApplyPay = false;
                this.getDetail(true);
            },
            changeMarkImportant(e) {
                this.$ajax.post(this.$apis.ORDER_MARK, {
                    importantCustomer: e,
                    ids: [this.orderForm.id]
                }).then(res => {
                    this.$message({
                        message: this.$i.order.handleSuccess,
                        type: "success"
                    });
                }).finally(err => {

                });
            },
            confirmOrder() {
                this.disableClickConfirm = true;
                this.$ajax.post(this.$apis.ORDER_CONFIRM, {
                    ids: [this.orderForm.id],
                    orderNos: [this.orderForm.orderNo]
                }).then(res => {
                    this.getDetail(false, true);
                }).finally(err => {
                    this.disableClickConfirm = false;
                });
            },
            downloadOrder() {
                this.$fetch.export_task("EXPORT_ORDER", { ids: [this.orderForm.id] });
            },
            cancelOrder() {
                this.$confirm(this.$i.order.sureCancel, this.$i.order.prompt, {
                    confirmButtonText: this.$i.order.sure,
                    cancelButtonText: this.$i.order.cancel,
                    type: "warning"
                }).then(() => {
                    this.disableCancelOrder = true;
                    this.$ajax.post(this.$apis.ORDER_CANCEL, {
                        ids: [this.orderForm.id],
                        orderNos: [this.orderForm.orderNo]
                    }).then(res => {
                        this.$message({
                            message: this.$i.order.handleSuccess,
                            type: "success"
                        });
                        this.disableCancelOrder = false;
                        this.$router.push("/order/overview");
                    }).catch(() => {
                        this.getDetail();
                        this.disableCancelOrder = false;
                    });
                });
            },
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
                path: "/logs/index",
                query: { code: "ORDER" },
                type: 20,
                auth: "ORDER:LOG",
                label: this.$i.common.log
            });
            this.setMenuLink({
                path: "/order/archiveOrder",
                type: 30,
                auth: "ORDER:OVERVIEW_ARCHIVE",
                label: this.$i.order.archiveOrder
            });
            this.setMenuLink({
                path: "/order/archiveDraft",
                type: 40,
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

    .isModify >>> input {
        background-color: yellow !important;
    }

    .high-light >>> input {
        background-color: yellow !important;
    }

    .isModify >>> textarea {
        background-color: yellow !important;
    }

    .isModify >>> li {
        background-color: yellow !important;
    }

    .high-light >>> textarea {
        background-color: yellow !important;
    }

    .second-title {
        font-weight: bold;
        font-size: 18px;
        color: #666666;
        padding: 10px 0;
        margin-top: 20px;
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

    .payTable {
        margin-top: 10px;
    }

    .payTable >>> .el-checkbox {
        margin-right: 0;
    }

    .speDate {
        width: 160px;
    }

    .speNumber >>> input {
        text-align: left;
    }

    .el-table >>> .warning-row {
        background: #f5f7fa;
    }

    .el-table >>> .waiting-row {
        background: yellow;
    }

    .addBtn {
        margin: 5px 0;
    }

    .summaryInput {
        width: 80%;
    }

    .summaryInput >>> input {
        text-align: left;
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
