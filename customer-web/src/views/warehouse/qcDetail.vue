<template>
    <div class="qc-detail" v-loading="loadingData">
        <div class="title">
            <span>{{$i.warehouse.qcOrderDetail}}</span>
        </div>
        <div class="second-title">
            {{$i.warehouse.basicInfo}}
        </div>
        <div>
            <el-form label-width="190px">
                <el-row class="speZone">
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.qcOrderNo">
                            <el-input
                                    v-model="qcDetail.qcOrderNo"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.qcTypeDictCode">
                            <el-select style="width: 100%" placeholder="service choose" :disabled="true" class="speInput" size="mini" v-model="qcDetail.qcTypeDictCode">
                                <el-option
                                        v-for="item in qcTypeOption"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.qcDate">
                            <el-date-picker
                                    style="width: 100%"
                                    :disabled="true"
                                    class="speInput"
                                    size="mini"
                                    v-model="qcDetail.qcDate"
                                    align="right"
                                    type="date"
                                    placeholder="service input">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.factoryAddress">
                            <el-input
                                    v-model="qcDetail.factoryAddress"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.factoryContactPhone">
                            <el-input
                                    v-model="qcDetail.factoryContactPhone"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.qcStatusDictCode">
                            <el-input
                                    v-model="qcDetail.qcStatusDictCode"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.qcMethodDictCode">
                            <el-select style="width: 100%;" placeholder="service choose" :disabled="true" class="speInput" size="mini" v-model="qcDetail.qcMethodDictCode">
                                <el-option
                                        v-for="item in qcMethodOption"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.surveyor">
                            <el-input
                                    :placeholder="$i.warehouse.serviceChoose"
                                    v-model="qcDetail.surveyor"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.serviceFee">
                            <el-input
                                    :placeholder="$i.warehouse.serviceFill"
                                    v-model="qcDetail.serviceFee"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.serviceName">
                            <el-input
                                    v-model="qcDetail.serviceName"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item prop="11" :label="$i.warehouse.exchangeCurrencyDictCode">
                            <el-input
                                    v-model="qcDetail.exchangeCurrencyDictCode"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">-->
                        <!--<el-form-item prop="11" label="Time Zone">-->
                            <!--<el-input-->
                                    <!--v-model="qcDetail.timeZone"-->
                                    <!--:disabled="true">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col class="speCol" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item prop="11" :label="$i.warehouse.remark">
                            <el-input
                                    type="textarea"
                                    :autosize="{minRows: 2}"
                                    v-model="qcDetail.remark"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item prop="11" :label="$i.warehouse.attachment">
                            <v-upload readonly :list="qcDetail.attachments" :limit="20" ref="upload"></v-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="second-title">
            {{$i.warehouse.payment}}
        </div>
        <div class="payment-table">
            <el-button @click="addPayment" v-authorize="'QC:ORDER_DETAIL:PAYMENT:ADD'" :loading="disableClickAdd" class="payment-btn" :disabled="disableAdd" type="primary">{{$i.warehouse.add}}</el-button>
            <el-table
                    v-loading='loadingPaymentTable'
                    :data="paymentTableData"
                    :row-class-name="tableRowClassName"
                    border
                    show-summary
                    :summary-method="getSummaries"
                    style="width: 100%">
                <el-table-column
                    label="#"
                    align="center"
                    fixed="left"
                    width="60">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column
                        v-for="v in $db.warehouse.qcPaymentTable"
                        :label="$i.warehouse[v.key]"
                        :key="v.key"
                        :prop="v.key"
                        align="center"
                        :fixed="v.isStatus?'right':null"
                        width="200">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isNew || scope.row.isModify">
                            <div v-if="v.type==='input'">
                                <el-input
                                        :placeholder="$i.warehouse.pleaseInput"
                                        v-model="scope.row[v.realKey]"
                                        clearable>
                                </el-input>
                            </div>
                            <div v-else-if="v.type==='date'">
                                <el-date-picker
                                        style="width: 160px"
                                        v-model="scope.row[v.realKey]"
                                        align="right"
                                        type="date"
                                        :editable="false"
                                        :placeholder="$i.warehouse.pleaseChoose"
                                        :picker-options="v.key==='planPayDt'?pickerOptions1:pickerOptions">
                                </el-date-picker>
                            </div>
                            <div v-else-if="v.type==='number'">
                                <!-- <el-input-number
                                        class="speNumber"
                                        v-model="scope.row[v.realKey]"
                                        :min="0"
                                        :controls="false"></el-input-number> -->
                                <v-input-number
                                    v-model="scope.row[v.realKey]"
                                    :min="0"
                                    class="speNumber"
                                    :controls="false"
                                    :mark="v.label"
                                    :accuracy="v.accuracy ? v.accuracy : null"
                                    label="please input"></v-input-number>
                            </div>
                            <div v-else-if="v.type==='select'">
                                <div v-if="v.key === 'paymentItem'">
                                    <el-select  v-model="scope.row[v.realKey]" :placeholder="$i.warehouse.pleaseChoose">
                                        <el-option
                                            v-for="item in paymentItem"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    <el-select :disabled="true" v-model="scope.row[v.realKey]" :placeholder="$i.warehouse.pleaseChoose">
                                        <el-option
                                                v-for="item in currencyOption"
                                                :key="item.id"
                                                :label="item.code"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div v-else-if="v.isStatus">
                                <span v-if="scope.row.status===-1">{{$i.warehouse.abandon}}</span>
                                <span v-if="scope.row.status===10">{{$i.warehouse.waitCustomerConfirm}}</span>
                                <span v-if="scope.row.status===20">{{$i.warehouse.waitSupplierConfirm}}</span>
                                <span v-if="scope.row.status===30">{{$i.warehouse.waitServiceConfirm}}</span>
                                <span v-if="scope.row.status===40">{{$i.warehouse.hasConfirm}}</span>
                            </div>
                            <div v-else>
                                {{scope.row[v.realKey]}}
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="v.type==='date'">
                                {{scope.row[v.realKey]?$dateFormat(scope.row[v.realKey],'yyyy-mm-dd'):''}}
                            </div>
                            <div v-else-if="v.isStatus">
                                <span v-if="scope.row.status===-1">{{$i.warehouse.abandon}}</span>
                                <span v-if="scope.row.status===10">{{$i.warehouse.waitCustomerConfirm}}</span>
                                <span v-if="scope.row.status===20">{{$i.warehouse.waitSupplierConfirm}}</span>
                                <span v-if="scope.row.status===30">{{$i.warehouse.waitServiceConfirm}}</span>
                                <span v-if="scope.row.status===40">{{$i.warehouse.hasConfirm}}</span>
                            </div>
                            <div v-else>
                                {{scope.row[v.realKey]}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Action"
                        align="center"
                        width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status===-1">
                            <el-button
                                    v-authorize="'QC:ORDER_DETAIL:PAYMENT_ACTION'"
                                    @click="restore(scope.row)"
                                    type="text"
                                    size="small">{{$i.warehouse.restore}}</el-button>
                        </div>
                        <div v-else>
                            <div v-if="scope.row.isNew">
                                <el-button @click="sureAdd(scope.row)" type="text" size="small">{{$i.warehouse.submit}}</el-button>
                                <el-button @click="cancelAdd(scope.row)" type="text" size="small">{{$i.warehouse.cancel}}</el-button>
                            </div>
                            <div v-else-if="scope.row.isModify">
                                <el-button @click="sureModify(scope.row)" type="text" size="small">{{$i.warehouse.submit}}</el-button>
                                <el-button @click="cancelModify(scope.row)" type="text" size="small">{{$i.warehouse.cancel}}</el-button>
                            </div>
                            <div v-else>
                                <el-button
                                         v-authorize="'QC:ORDER_DETAIL:PAYMENT:MODIFY'"
                                        @click="modify(scope.row)"
                                        type="text"
                                        size="small">{{$i.warehouse.modify}}</el-button>
                                <el-button
                                        v-authorize="'QC:ORDER_DETAIL:PAYMENT:INVALID'"
                                        @click="invalid(scope.row)"
                                        type="text"
                                        size="small">{{$i.warehouse.invalid}}</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="second-title">
            {{$i.warehouse.productInfo}}
        </div>
        <div class="product-info">
            <v-table
                    code="uwarehouse_qc_order_detail"
                    :loading="loadingProductInfoTable"
                    :data="productInfoData"
                    :buttons="[{'label': $i.warehouse.detail, type: 1, auth: 'PRODUCT:DETAIL'}]"
                    @action="btnClick"
                    @change-sort="val=>{getProductInfo(val)}"
                    @change-checked="changeChecked"
                    :totalRow="totalRow">
                <template slot="header">
                    <div class="btn-group">
                        <el-button
                                v-authorize="'QC:ORDER_DETAIL:PRODUCT_CONFIRM_SKU'"
                                :disabled="selectList.length===0"
                                type="primary"
                                @click="confirm">{{$i.warehouse.confirmSKU}}</el-button>
                        <el-button
                                v-authorize="'QC:ORDER_DETAIL:RESTART_QC'"
                                @click="restartQc"
                                :disabled="disableClickRestart"
                                type="primary">{{$i.warehouse.restartQc}}</el-button>
                        <el-button
                                v-authorize="'QC:ORDER_DETAIL:PRODUCT_REWORK'"
                                :disabled="selectList.length===0"
                                type="primary"
                                @click="rework">{{$i.warehouse.rework}}</el-button>
                        <el-button
                                v-authorize="'QC:ORDER_DETAIL:PRODUCT_RETURN'"
                                :disabled="selectList.length===0"
                                type="danger"
                                @click="returnProduct">{{$i.warehouse.return}}</el-button>
                    </div>
                </template>
            </v-table>
        </div>
        <div class="summary">
            <div class="second-title">
                {{$i.warehouse.summary}}
            </div>
            <el-form label-width="280px">
                <el-row class="speZone">
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.cartonOfQualifiedProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.qualifiedSkuCartonTotalQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.quantityOfQualifiedProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.qualifiedSkuQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.volumeOfQualifiedProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.qualifiedSkuVolume"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.netWeightOfQualifiedProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.qualifiedSkuNetWeight"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.grossWeightOfQualifiedProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.qualifiedSkuGrossWeight"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.quantityOfSubQualityProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.unqualifiedSkuQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.cartonOfSubQualityProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.unqualifiedSkuCartonTotalQty"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.netWeightOfSubQualityProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.unqualifiedSkuNetWeight"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.volumeOfSubQualityProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.unqualifiedSkuVolume"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.grossWeightOfSubQualityProducts">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="qcDetail.unqualifiedSkuGrossWeight"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="speCol" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-form-item :label="$i.warehouse.skuQuantity">
                            <el-input
                                    class="summaryInput"
                                    size="mini"
                                    v-model="summaryData.skuQuantity"
                                    :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="footBtn">
            <el-button
                    v-authorize="'QC:ORDER_DETAIL:DOWNLOAD'"
                    :disabled="loadingData"
                    type="primary"
                    @click="download">{{$i.warehouse.download}}</el-button>
            <el-button v-authorize="'QC:ORDER_DETAIL:CANCEL'" @click="cancel" type="danger">{{$i.warehouse.exit}}</el-button>
        </div>
        <v-message-board module="warehouse" code="qcDetail" :id="$route.query.id"></v-message-board>
    </div>
</template>
<script>

    import {VTable,VUpload,VMessageBoard,VInputNumber} from '@/components/index';
    import { mapActions } from 'vuex'

    export default {
        name:'qc-detail',
        components:{
            VTable,
            VUpload,
            VMessageBoard,
            VInputNumber
        },
        data(){
            return{
                qcDetail:{},
                qcTypeOption:[],
                qcMethodOption:[],
                disableClickRestart:true,
                disableAdd:true,
                copyList:[],
                /**
                 * paymentTable data
                 * */
                loadingPaymentTable:false,
                paymentTableData: [],
                disableClickAdd:false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime()+3600 * 1000 * 24 < Date.now();
                    },
                },
                currencyOption:[],

                /**
                 * product info data
                 * */
                loadingProductInfoTable:false,
                productInfoConfig:{
                    pn: 1,
                    ps: 200,
                    qcOrderId: this.$route.query.id,
                    qcOrderNo:this.$route.query.code
                    // sorts: [
                    //     {
                    //         orderBy: "",
                    //         orderType: "",
                    //     }
                    // ],
                },
                productInfoData:[],
                selectList:[],
                loadingData:false,

                /**
                 * summary Data
                 * */
                summaryData:{
                    skuQuantity:0
                },


                /**
                 * 字典配置
                 * */
                skuUnitOption:[],       //计量单位
                lengthOption:[],
                volumeOption:[],
                weightOption:[],
                pbCodeOption:[],
                paymentItem: []

            }
        },
        computed:{
            totalRow(){
                let obj={};
                if(this.productInfoData.length<=0){
                    return;
                }
                _.map(this.productInfoData,v=>{
                    _.mapObject(v,(item,key)=>{
                        if(item._calculate){
                            obj[key]={
                                value: Number(item.value)  + (Number(obj[key] ? obj[key].value : 0) || 0),
                            };
                        }else{
                            obj[key] = {
                                value: ''
                            };
                        }
                    })
                });
                return [obj];

            }
        },
        methods:{
            ...mapActions(["setMenuLink"]),
            getQcOrderDetail(){
                if(this.$route.query.id){
                    this.$ajax.get(`${this.$apis.get_qcDetail}?id=${this.$route.query.id}`)
                        .then(res=>{
                            this.qcDetail=res;
                            this.loadingData=false;
                            this.getProductInfo();
                            this.getPaymentData();
                        }).catch(err=>{
                            this.loadingData=false;
                        }
                    );
                }else if(this.$route.query.code){
                    this.$ajax.get(`${this.$apis.GET_QC_GETBYQCORDERNO}?qcOrderNo=${this.$route.query.code}`)
                        .then(res=>{
                            this.qcDetail=res;
                            this.loadingData=false;
                            this.getProductInfo();
                            this.getPaymentData();
                        }).catch(err=>{
                            this.loadingData=false;
                        }
                    );
                }

            },
            getProductInfo(e){
                this.loadingProductInfoTable=true;
                if(e){
                    Object.assign(this.productInfoConfig,e);
                }
                this.$ajax.post(this.$apis.get_qcProductInfo,this.productInfoConfig).then(res=>{
                    this.productInfoData = this.$getDB(this.$db.warehouse.qcDetailProductInfo, res.datas,e=>{
                        if(e.skuQcResultDictCode.value==='WAIT_FOR_QC'){
                            e._disabled=true;
                        }
                        e.deliveryDate.value=this.$dateFormat(e.deliveryDate.value,'yyyy-mm-dd');
                        e.skuUnitDictCode.value=e.skuUnitDictCode.value?(_.findWhere(this.skuUnitOption,{code:e.skuUnitDictCode.value}) || {}).name:'';
                        e.volumeUnitDictCode.value=e.volumeUnitDictCode.value?(_.findWhere(this.volumeOption,{code:e.volumeUnitDictCode.value}) || {}).name:'';
                        e.weightUnitDictCode.value=e.weightUnitDictCode.value?(_.findWhere(this.weightOption,{code:e.weightUnitDictCode.value}) || {}).name:'';
                        e.lengthUnitDictCode.value=e.lengthUnitDictCode.value?(_.findWhere(this.lengthOption,{code:e.lengthUnitDictCode.value}) || {}).name:'';
                        e.skuBarCodeResultDictCode.value=e.skuBarCodeResultDictCode.value?(_.findWhere(this.pbCodeOption,{code:e.skuBarCodeResultDictCode.value}) || {}).name:'';
                        e.innerPackingBarCodeResultDictCode.value=e.innerPackingBarCodeResultDictCode.value?(_.findWhere(this.pbCodeOption,{code:e.innerPackingBarCodeResultDictCode.value}) || {}).name:'';
                        e.skuLabelResultDictCode.value=e.skuLabelResultDictCode.value?(_.findWhere(this.pbCodeOption,{code:e.skuLabelResultDictCode.value}) || {}).name:'';
                        e.outerCartonBarCodeResultDictCode.value=e.outerCartonBarCodeResultDictCode.value?(_.findWhere(this.pbCodeOption,{code:e.outerCartonBarCodeResultDictCode.value}) || {}).name:'';
                        e.shippingMarkResultDictCode.value=e.shippingMarkResultDictCode.value?(_.findWhere(this.pbCodeOption,{code:e.shippingMarkResultDictCode.value}) || {}).name:'';
                        e.innerCartonMarkResultDictCode.value = e.innerCartonMarkResultDictCode.value?(_.findWhere(this.pbCodeOption,{code:e.innerCartonMarkResultDictCode.value}) || {}).name:'';
                        return e;
                    });
                    let diffData=[];
                    let qcStatusDictCode = this.qcDetail.qcStatusDictCode
                    this.productInfoData.forEach(v=>{
                        diffData.push(v.skuId.value+v.orderNo.value);
                        if (qcStatusDictCode === 'COMPLETED_QC') {
                            _.mapObject(v, (item, k) => {
                                if (item.isFWS) {
                                    item._mustChecked = true
                                }
                            })
                        }
                    });
                    this.summaryData.skuQuantity=_.uniq(diffData).length;

                    if(res.datas.length>0){
                        let obj=Object.assign({},res.datas[0]);
                        _.map(obj,(v,key)=>{
                            if(key==='orderSkuQty' || key==='expectQcQty' || key==='outerCartonTotalQty' || key==='actSkuCartonTotalQty' || key==='qualifiedSkuCartonTotalQty' || key==='unqualifiedSkuCartonTotalQty' || key==='actSkuQty' || key==='qualifiedSkuQty' || key==='unqualifiedSkuQty' || key==='qualifiedSkuNetWeight' || key==='unqualifiedSkuNetWeight' || key==='qualifiedSkuVolume' || key==='unqualifiedSkuVolume' || key==='qualifiedSkuGrossWeight' || key==='unqualifiedSkuGrossWeight' || key==='checkOuterCartonQty'){
                                obj[key] = 0;
                            }else{
                                obj[key]=null;
                            }
                        })

                        _.map(res.datas,data=>{
                            _.map(data,(v,key)=>{
                                if(key==='orderSkuQty' || key==='expectQcQty' || key==='outerCartonTotalQty' || key==='actSkuCartonTotalQty' || key==='qualifiedSkuCartonTotalQty' || key==='unqualifiedSkuCartonTotalQty' || key==='actSkuQty' || key==='qualifiedSkuQty' || key==='unqualifiedSkuQty' || key==='qualifiedSkuNetWeight' || key==='unqualifiedSkuNetWeight' || key==='qualifiedSkuVolume' || key==='unqualifiedSkuVolume' || key==='qualifiedSkuGrossWeight' || key==='unqualifiedSkuGrossWeight' || key==='checkOuterCartonQty'){
                                    obj[key]+=Number(data[key]);
                                }

                            })
                        })
                    }
                    this.loadingProductInfoTable=false;
                    this.selectList=[];
                }).catch(err=>{
                    this.loadingProductInfoTable=false;
                });
            },
            getPaymentData(){
                this.loadingPaymentTable=true;
                this.$ajax.post(this.$apis.get_qcPaymentData,{
                    orderNo:this.qcDetail.qcOrderNo,
                    orderType:20,
                    moduleCode: 'WAREHOUSE'
                }).then(res=>{
                    this.loadingPaymentTable=false;
                    this.paymentTableData=res.datas;
                    _.map(this.paymentTableData,v=>{
                        v.actualPayDt='';
                    });
                    if(this.qcDetail.qcStatusDictCode==='WAITING_QC'){
                        this.disableAdd=true;
                    }else{
                        this.disableAdd=false;
                    }
                    // console.log(this.disableAdd,'this.disableAdd')
                }).catch(err=>{
                    this.loadingPaymentTable=false;

                });
            },

            /**
             * payment事件
             * */
            tableRowClassName({row}) {
                if(row.status===-1){
                    return 'warning-row';
                }
                return '';
            },
            addPayment(){
                this.disableClickAdd=true;
                this.$ajax.post(this.$apis.get_qcPaymentNo).then(res=>{
                    this.paymentTableData.push({
                        no:res,
                        name:'',
                        planPayDt:'',
                        planPayAmount:'',
                        actualPayDt:'',
                        actualPayAmount:'',
                        currencyCode:this.qcDetail.exchangeCurrencyDictCode,
                        status:30,
                        isNew:true
                    });
                }).finally(()=>{
                    this.disableClickAdd=false;
                });
            },
            sureAdd(e){
                let param={
                    actualPayAmount: e.actualPayAmount,
                    actualPayDt: e.actualPayDt,
                    name: e.name,
                    no: e.no,
                    orderNo: this.qcDetail.qcOrderNo,
                    orderType: 20,
                    planPayAmount: e.planPayAmount,
                    planPayDt: e.planPayDt,
                    type: 10,       //10代表付款
                    payToCompanyId: this.qcDetail.serviceProviderId,
                    payToCompanyName: this.qcDetail.serviceName,
                    currency: 0,
                    currencyCode: '',
                    moduleCode: 'WAREHOUSE',
                    remark: e.remark
                };
                this.currencyOption.forEach(v=>{
                    if(v.code===this.qcDetail.exchangeCurrencyDictCode){
                        param.currency=v.id;
                        param.currencyCode=v.code;
                    }
                });
                this.loadingPaymentTable=true;
                this.$ajax.post(this.$apis.save_qcPayment,param).then(res=>{
                    this.$message({
                        message: this.$i.warehouse.submitSuccess,
                        type: 'success'
                    });
                    this.loadingPaymentTable=false;
                    this.$set(e,'isNew',false);
                    this.$set(e,'version',res.version);
                    this.$set(e,'id',res.id);
                }).catch(err=>{
                    this.loadingPaymentTable=false;
                });
            },
            cancelAdd(e){
                this.$confirm(this.$i.warehouse.sureDelete, 'Info', {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(() => {
                    this.paymentTableData=_.difference(this.paymentTableData,[e]);

                    this.$message({
                        type: 'success',
                        message: this.$i.warehouse.deleteSuccess
                    });
                }).catch(() => {

                });
            },
            modify(e){
                this.$set(e,'isModify',true);
                let has=false;
                this.copyList.forEach(v=>{
                    if(v.no===e.no){
                        has=true;
                    }
                });
                if(!has){
                    this.copyList.push(Object.assign({},e));
                }
            },
            invalid(e){
                this.$confirm(this.$i.warehouse.sureInvalid, this.$i.warehouse.prompt, {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(() => {
                    this.loadingPaymentTable=true;
                    this.$ajax.post(this.$apis.abandon_qcPayment,{
                        id:e.id,
                        version:e.version,
                        moduleCode: 'WAREHOUSE'
                    }).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.warehouse.invalidSuccess
                        });
                        this.$set(e,'status',-1);
                        this.$set(e,'version',res.version);
                        this.loadingPaymentTable=false;
                    }).catch(err=>{
                        this.loadingPaymentTable=false;
                    });
                }).catch(() => {

                });
            },
            restore(e){
                this.$confirm(this.$i.warehouse.sureRestore, 'Info', {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(() => {
                    this.loadingPaymentTable=true;
                    this.$ajax.post(this.$apis.recover_qcPayment,{
                        id:e.id,
                        version:e.version,
                        moduleCode: 'WAREHOUSE'
                    }).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.warehouse.restoreSuccess
                        });
                        this.$set(e,'status',res.status);
                        this.$set(e,'version',res.version);
                        this.loadingPaymentTable=false;
                    }).catch(err=>{
                        this.loadingPaymentTable=false;
                    });
                }).catch(() => {

                });
            },
            sureModify(e){
                let param={
                    actualPayAmount: e.actualPayAmount,
                    actualPayDt: e.actualPayDt,
                    id: e.id,
                    name: e.name,
                    planPayAmount: e.planPayAmount,
                    planPayDt: e.planPayDt,
                    version:e.version,
                    moduleCode: 'WAREHOUSE',
                    remark: e.remark
                };
                this.loadingPaymentTable=true;
                this.$ajax.post(this.$apis.update_qcPayment,param).then(res=>{
                    this.$message({
                        message: this.$i.warehouse.changeSuccess,
                        type: 'success'
                    });
                    this.copyList.forEach(v=>{
                        if(v.no===e.no){
                            let obj=Object.assign({},e);
                            this.$set(v,'name',obj.name);
                            this.$set(v,'planPayDt',obj.planPayDt);
                            this.$set(v,'planPayAmount',obj.planPayAmount);
                            this.$set(v,'actualPayDt',obj.actualPayDt);
                            this.$set(v,'actualPayAmount',obj.actualPayAmount);
                        }
                    });
                    this.$set(e,'status',res.status)
                    this.$set(e,'isModify',false);
                    this.$set(e,'version',res.version);
                    this.loadingPaymentTable=false;
                }).catch(err=>{
                    this.loadingPaymentTable=false;
                });
            },
            cancelModify(e){
                this.copyList.forEach(v=>{
                    if(v.no===e.no){
                        let obj=Object.assign({},v);
                        this.$set(e,'name',obj.name);
                        this.$set(e,'planPayDt',obj.planPayDt);
                        this.$set(e,'planPayAmount',obj.planPayAmount);
                        this.$set(e,'actualPayDt',obj.actualPayDt);
                        this.$set(e,'actualPayAmount',obj.actualPayAmount);
                    }
                });
                this.$set(e,'isModify',false);
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.$i.warehouse.totalMoney;
                        return;
                    }else if(index===4 || index===6){
                        const values = data.map(item => {
                            if(item.status===40){
                                return Number(item[column.property])
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
                        }else{
                            sums[index]=0;
                        }
                    }
                });

                return sums;
            },

            /**
             * product info表格事件
             * */
            btnClick(e){
                this.$windowOpen({
                    url:'/product/sourcingDetail',
                    params:{
                        id:e.skuId.value
                    },
                })
            },
            changeChecked(e){
                this.selectList=e;
            },
            confirm(){
                this.$confirm(this.$i.warehouse.sureConfirm, this.$i.warehouse.prompt, {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(() => {
                    let allow=true;
                    _.map(this.selectList,v=>{
                        if(v.purchaserHandle.value){
                            allow=false;
                        }
                    });
                    if(!allow){
                        return this.$message({
                            message: this.$i.warehouse.alreadyHandled,
                            type: 'warning'
                        });
                    }
                    let id=[];
                    this.selectList.forEach(v=>{
                        id.push(v.id.value);
                    });
                    this.loadingProductInfoTable=true;
                    this.$ajax.post(this.$apis.set_qcResultConfirm,id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.warehouse.confirmSuccess
                        });
                        this.getProductInfo();

                    }).catch(err=>{
                        this.loadingProductInfoTable=false;
                    });
                }).catch(() => {

                });

            },
            restartQc(){
                this.$confirm(this.$i.warehouse.sureRestartQc, this.$i.warehouse.prompt, {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(()=>{
                    let orderNo=this.selectList[0].orderNo.value;
                    let ids='';
                    this.selectList.forEach(v=>{
                        ids+=(v.inboundSkuId.value+',');
                    });
                    ids=ids.slice(0,ids.length-1);
                    this.$windowOpen({
                        url:'/warehouse/createQc',
                        params:{
                            ids:ids,
                            orderNo:orderNo
                        },
                    });
                }).catch(()=>{

                })
            },
            rework(){
                this.$confirm(this.$i.warehouse.sureRework, this.$i.warehouse.prompt, {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(() => {
                    let allow=true;
                    _.map(this.selectList,v=>{
                        if(v.purchaserHandle.value){
                            allow=false;
                        }
                    });
                    if(!allow){
                        return this.$message({
                            message: this.$i.warehouse.alreadyHandled,
                            type: 'warning'
                        });
                    }

                    let id=[];
                    this.selectList.forEach(v=>{
                        id.push(v.id.value);
                    });
                    this.loadingProductInfoTable=true;
                    this.$ajax.post(this.$apis.set_qcResultRework,id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.warehouse.reworkSuccess
                        });
                        this.getProductInfo();
                    }).catch(err=>{
                        this.loadingProductInfoTable=false;
                    });
                }).catch(() => {

                });
            },
            returnProduct(){
                this.$confirm(this.$i.warehouse.sureReturn, this.$i.warehouse.prompt, {
                    confirmButtonText: this.$i.warehouse.sure,
                    cancelButtonText: this.$i.warehouse.cancel,
                    type: 'warning'
                }).then(() => {
                    let allow=true;
                    _.map(this.selectList,v=>{
                        if(v.purchaserHandle.value){
                            allow=false;
                        }
                    });
                    if(!allow){
                        return this.$message({
                            message: this.$i.warehouse.alreadyHandled,
                            type: 'warning'
                        });
                    }

                    let id=[];
                    this.selectList.forEach(v=>{
                        id.push(v.id.value);
                    });
                    this.loadingProductInfoTable=true;
                    this.$ajax.post(this.$apis.set_qcResultReturn,id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.warehouse.returnSuccess
                        });
                        this.getProductInfo();
                    }).catch(err=>{
                        this.loadingProductInfoTable=false;
                    });
                }).catch(() => {

                });
            },
            download(){
                this.$fetch.export_task('QC_ORDER',{qcOrderNos:[this.qcDetail.qcOrderNo]});
            },
            cancel(){
                window.close();
            },
            getCurrency(){
                this.$ajax.get(this.$apis.get_currency,{},{cache:true}).then(res=>{
                    this.currencyOption=res;
                }).catch(err=>{

                });
            },
        },
        created(){
            this.getCurrency();
            this.loadingData=true;
            this.$ajax.post(this.$apis.get_partUnit,['QC_TYPE','QC_MD','SKU_UNIT','LH_UNIT','VE_UNIT','WT_UNIT','PB_CODE','PAYMENT_ITEM_NAME'],{cache:true})
                .then(res=>{
                    res.forEach(v=>{
                        if(v.code==='QC_TYPE'){
                            this.qcTypeOption=v.codes;
                        }else if(v.code==='QC_MD'){
                            this.qcMethodOption=v.codes;
                        }else if(v.code==='SKU_UNIT'){
                            this.skuUnitOption=v.codes;
                        }else if(v.code==='LH_UNIT'){
                            this.lengthOption=v.codes;
                        }else if(v.code==='VE_UNIT'){
                            this.volumeOption=v.codes;
                        }else if(v.code==='WT_UNIT'){
                            this.weightOption=v.codes;
                        }else if(v.code==='PB_CODE'){
                            this.pbCodeOption=v.codes;
                        }else if (v.code === 'PAYMENT_ITEM_NAME') {
                            this.paymentItem = v.codes
                        }
                    });
                    this.getQcOrderDetail();
                    // this.getProductInfo();
                })
                .catch(err=>{
                    this.loadingData=false;
                });
        },
        mounted(){
            this.setMenuLink({
                path: '/logs/index',
                query: {code: 'QC'},
                type: 10,
                auth:'QC:LOG',
                label: this.$i.common.log
            });
        },
        watch:{
            selectList(n){
                if(n.length===0){
                    this.disableClickRestart=true;
                }else{
                    let allow=false;
                    n.forEach(v=>{
                        if(v.skuInventoryStatusDictCode.value==='WAIT_FOR_QC' || v.skuInventoryStatusDictCode.value==='APPLY_FOR_RETURN' || v.skuInventoryStatusDictCode.value==='CONFIRMATION_OF_RETURN'){
                            allow=true;
                        }
                    });
                    this.disableClickRestart=allow;
                }
            }
        }
    }
</script>
<style scoped>
    .el-table >>> .warning-row {
        background: #f5f7fa;
    }
    .title{
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color:#666666;
    }
    .second-title{
        font-size: 16px;
        color: #999999;
        padding: 10px 0;
        margin-top: 20px;
    }
    .payment-btn{
        margin: 5px 0 10px 0;
    }
    .footBtn{
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
    .speInput{
        width: 80%;
    }
    .speNumber >>> input{
        text-align: left;
    }
    .summary{
        margin-top: 50px;
    }
    .summaryInput{
        width: 80%;
    }
    .summaryInput >>> input{
        text-align: left;
    }
</style>
