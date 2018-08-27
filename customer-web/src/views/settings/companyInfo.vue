<template>
    <div class="company-info">
        <div class="title" :style="{'height': !showNameBox ? '32px':'0'}">
            <span><span style="color:red;font-weight: bold"></span>{{$i.setting.companyInfo}}</span>
        </div>
        <div class="alert" v-show="showNameBox">
          <el-alert
            :title="$i.setting.requiredPage"
            type="warning"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
        <div class="summary">
            <el-form ref="summary"   label-width="220px">
                <el-row class="speZone">
                    <el-col :class="{speCol:v.key!=='description'}" v-if="v.belong==='summary'" v-for="v in $db.setting.companyInfo" :key="v.key" :xs="24" :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:8" :xl="v.fullLine?24:8">
                        <el-form-item class="speWidth"  :label="v.label +'：'" :required="v._rules?v._rules.required:false">
                            <div v-if="v.type==='input'">
                                <el-input
                                        :disabled="v.key==='code'?true:summaryDisabled"
                                        size="mini"
                                        :placeholder="$i.common.inputkeyWordToSearch"
                                        v-model="companyInfo[v.key]">
                                </el-input>
                            </div>
                          <div v-if="v.type==='customValidation'">
                            <el-input
                              :disabled="v.key==='code'?true:summaryDisabled"
                              size="mini"
                              :placeholder="$i.common.inputkeyWordToSearch"
                              @blur="customValidation"
                              v-model="companyInfo[v.key]">
                            </el-input>
                          </div>
                            <div v-if="v.type==='select'">
                                <el-select :disabled="summaryDisabled" class="speWidth" v-model="companyInfo[v.key]" :placeholder="$i.common.inputSearch">
                                    <el-option
                                            size="mini"
                                            v-for="item in options[v.key]"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="Number(item.code) ||  item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="v.type==='selectCurrency'">
                              <el-select :disabled="summaryDisabled" class="speWidth" v-model="companyInfo[v.key]" :placeholder="$i.common.inputSearch">
                                <el-option
                                  size="mini"
                                  v-for="item in options[v.key]"
                                  :key="item.code"
                                  :label="item.code"
                                  :value="item.code">
                                </el-option>
                              </el-select>
                            </div>
                            <div v-if="v.type==='textarea'">
                                <el-input
                                        :disabled="summaryDisabled"
                                        class="speWidth"
                                        type="textarea"
                                        autosize
                                        :placeholder="$i.common.inputkeyWordToSearch"
                                        v-model="companyInfo[v.key]">
                                </el-input>
                            </div>
                          <div v-if="v.type === 'function' ">
                            <v-upload
                              ref="uploadFile"
                              only-image
                              oss-private
                              :list="companyInfo.logo"
                              :readonly="summaryDisabled"/>
                          </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="summary-btn">
                <div v-if="summaryDisabled">
                    <el-button @click="modifySummary">{{$i.common.modify}}</el-button>
                </div>
                <div v-else>
                    <el-button :loading="allowModifySummary" @click="saveModifySummary" type="primary">{{$i.button.confirm}}</el-button>
                    <el-button @click="cancelModifySummary">{{$i.button.cancel}}</el-button>
                </div>
            </div>
        </div>
        <div class="section">
            <el-tabs type="border-card" @tab-click="handleClick">
                <el-tab-pane :label="$i.setting.address">
                    <div class="section-btn">
                        <el-button @click="addAddress" type="primary">{{$i.button.add}}</el-button>
                    </div>
                  <v-table
                    :data="addressDatas"
                    :height="500"
                    :buttons="[{label: 'Modify', type: 1},{label: 'Delete', type: 2}]"
                    @action="addressAction"
                    :selection="false"
                    disabled-sort
                  ></v-table>
                </el-tab-pane>
                <el-tab-pane :label="$i.setting.accountInfo">
                  <div class="section-btn">
                    <el-button @click="addAccount" type="primary">{{$i.button.add}}</el-button>
                  </div>
                  <v-table
                    :data="accountsData"
                    :height="500"
                    :buttons="[{label: 'Modify', type: 1},{label: 'Delete', type: 2}]"
                    @action="accountAction"
                    :selection="false"
                    disabled-sort
                  ></v-table>
                </el-tab-pane>
                <el-tab-pane :label="$i.setting.contactInfo">
                    <div class="section-btn">
                        <el-button @click="addContact" type="primary">{{$i.button.add}}</el-button>
                    </div>
                    <v-table
                    :data="contctsData"
                    :height="500"
                    :buttons="[{label: 'Modify', type: 1},{label: 'Delete', type: 2}]"
                    @action="contactAction"
                    :selection="false"
                    disabled-sort
                  ></v-table>
                </el-tab-pane>

                <el-tab-pane :label="$i.setting.documentRequired">
                    <div class="section-btn" style="margin-bottom:50px;">
                        <el-button @click="modifyDocument()" type="primary">{{$i.button.save}}</el-button>
                    </div>
                  <el-form label-width="200px">
                    <el-row>
                      <el-col :span="24">
                        <div class="documentBox">
                          <ul class="documentBoxCon">
                            <li class="documentBoxCon1" v-for="(item,index) in documentTypeClone" :key="item.id" >
                              <el-checkbox
                                :checked="item.checked"
                                @change="handleCheckedDocument(item,index)">
                                {{item.name}}
                              </el-checkbox>
                              <div class="uploadBox" :disabled="item.checked">
                                <v-upload
                                oss-private
                                :ref="'uploadDocument'+item.code"
                                :limit="20"
                                :list="item.attachments"
                                :readonly="!item.checked"
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane :label="$i.setting.attachment">
                  <div class="section-btn">
                    <el-button @click="upload" type="primary">{{$i.button.save}}</el-button>
                  </div>
                  <v-upload ref="uploadAttachment" :limit="20" :list="companyInfo.attachments" oss-private />
                </el-tab-pane>

                <el-tab-pane :label="$i.setting.custom">
                  <div class="section-btn">
                    <el-button @click="addCustom(customData)" type="primary">{{$i.button.modify}}</el-button>
                  </div>
                  <el-form label-width="400px" :model="customData">
                    <el-row>
                      <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                        <el-form-item  :label="$i.setting.oceanFreight +'：'">
                          <span>{{customData.oceanFreightUSD40HC}}</span>
                        </el-form-item>
                        <el-form-item  :label="$i.setting.insuranceExpenses +'：'">
                          <span>{{customData.insuranceExpensesUSD40HC}}</span>
                        </el-form-item>
                        <el-form-item :label="$i.setting.priceCurrency +'：'">
                          <span>{{customData.portWarehousePrice40HC}}</span>
                        </el-form-item>
                        <el-form-item  :label="$i.setting.exchangeRate +'：'">
                          <span>{{customData.exchangeRateUSD}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>

                <el-tab-pane :label="$i.setting.tradeExchangeRate">
                  <v-table
                    :data="currencyList"
                    :height="500"
                    :buttons="[{label: 'Modify', type: 1}]"
                    :selection="false"
                    @action="rateAction"
                    disabled-sort
                  ></v-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog width="50%" :title="$i.setting.address" :visible.sync="addressDialogVisible">
            <el-form label-width="190px" :model="addressData">
                <el-row>
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.companyAddress+'：'" required>
                      <el-select  v-model="addressData.country" :placeholder="$i.setting.selectCountry" style="width:100%">
                        <el-option
                          v-for="item in options.country"
                          :key="item.id"
                          :label="item.name"
                          :value="item.code"
                          style="width:100%">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item   required>
                      <el-input size="mini" v-model="addressData.province" :placeholder="$i.setting.inputProvince" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item   required>
                      <el-input size="mini" v-model="addressData.city" :placeholder="$i.setting.inputCity" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item   required>
                      <el-input size="mini" v-model="addressData.address" :placeholder="$i.setting.inputAddress" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.receiverAddress +'：'">
                      <el-select  v-model="addressData.receiveCountry" :placeholder="$i.setting.selectCountry" style="width:100%">
                        <el-option
                          v-for="item in options.country"
                          :key="item.id"
                          :label="item.name"
                          :value="item.code"
                          style="width:100%">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  >
                      <el-input size="mini" v-model="addressData.receiveProvince" :placeholder="$i.setting.inputProvince"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  >
                      <el-input size="mini" v-model="addressData.receiveCity" :placeholder="$i.setting.inputCity"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  >
                      <el-input size="mini" v-model="addressData.receiveAddress" :placeholder="$i.setting.inputAddress"></el-input>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">-->
                    <!--<el-form-item  :label="$i.setting.destinationPort +'：'">-->
                      <!--<el-select  v-model="addressData.destPort" :placeholder="$i.common.inputSearch" style="width:100%">-->
                        <!--<el-option-->
                          <!--v-for="item in options.country"-->
                          <!--:key="item.id"-->
                          <!--:label="item.name"-->
                          <!--:value="item.code"-->
                          <!--style="width:100%">-->
                        <!--</el-option>-->
                      <!--</el-select>-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.destinationPort +'：'">
                      <el-input size="mini" v-model="addressData.destPort" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.consignee +'：'">
                      <el-input size="mini" v-model="addressData.consignee" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.notify +'：'">
                      <el-input size="mini" v-model="addressData.notify" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-checkbox-group v-model="addressData.def" size="medium">
                        <el-checkbox :label="$i.setting.setDefaultAddress"  @change="setAddress"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addressDialogVisible=false">{{$i.button.cancel}}</el-button>
                <el-button :loading="allowAddAddress" type="primary" @click="sureAddAddress">{{$i.button.confirm}}</el-button>
            </div>
        </el-dialog>

        <el-dialog width="50%" :title="$i.setting.accountInfo" :visible.sync="accountDialogVisible">
            <el-form label-width="230px" :model="accountData">
                <el-row>
                    <el-col :span="12">
                        <el-form-item  :label="$i.setting.beneficiaryName +'：'" required>
                            <el-input size="mini" v-model="accountData.beneficiaryName" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item  :label="$i.setting.beneficiaryAccount +'：'" required>
                            <el-input size="mini" v-model="accountData.beneficiaryAccount" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item  :label="$i.setting.beneficiaryAddress +'：'">
                            <el-input size="mini" v-model="accountData.beneficiaryAddress" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item  :label="$i.setting.beneficiaryBankName +'：'" required>
                            <el-input size="mini" v-model="accountData.beneficiaryBankName" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item  :label="$i.setting.beneficiaryBankSWIFT +'：'">
                            <el-input size="mini" v-model="accountData.beneficiaryBankSwift" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.accountType +'：'">
                      <el-input size="mini" v-model="accountData.accountType" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  :label="$i.setting.currency +'：'">
                      <el-select  v-model="accountData.currency" :placeholder="$i.common.inputSearch" style="width:100%">
                        <el-option
                          v-for="item in options.currency"
                          :key="item.id"
                          :label="item.code"
                          :value="item.code"
                          style="width:100%">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="accountDialogVisible=false">{{$i.button.cancel}}</el-button>
                <el-button :loading="allowAddAccount" type="primary" @click="sureAddAccount">{{$i.button.confirm}}</el-button>
            </div>
        </el-dialog>

      <el-dialog width="50%" :title="$i.setting.contactInfo" :visible.sync="contactDialogVisible">
        <el-form label-width="200px" :model="contactData">
          <el-row>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.name +'：'" required>
                <el-input size="mini" v-model="contactData.name" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$i.setting.department +'：'">
                <el-select  v-model="contactData.deptId" :placeholder="$i.common.inputSearch" style="width:100%" >
                  <el-option
                    v-for="item in department"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                    style="width:100%">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.gender +'：'">
                <el-select v-model="contactData.gender" :placeholder="$i.common.inputSearch" style="width:100%">
                  <el-option
                    v-for="item in sex"
                    :key="item.code"
                    :label="item.name"
                    :value="Number(item.code)"
                    style="width:100%">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.mobileNumber +'：'">
                <el-input size="mini" v-model="contactData.cellphone" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.telNumber +'：'">
                <el-input size="mini" v-model="contactData.telphone" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.faxNumber +'：'">
                <el-input size="mini" v-model="contactData.fax" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.emailAddress +'：'">
                <el-input size="mini" v-model="contactData.email" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.skype +'：'">
                <el-input size="mini" v-model="contactData.skype" :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="contactDialogVisible=false">{{$i.button.cancel}}</el-button>
          <el-button :loading="allowAddContact" type="primary" @click="sureAddContact">{{$i.button.confirm}}</el-button>
        </div>
      </el-dialog>

      <el-dialog width="55%" :title="$i.setting.custom" :visible.sync="customDialogVisible">
        <el-form label-width="300px" :model="customData">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$i.setting.oceanFreight +'：'">
                <v-input-number
                  class="speInput speNumber"
                  size="mini"
                  v-model="customData.oceanFreightUSD40HC"
                  :accuracy="4"
                  :mark="$i.setting.oceanFreight"
                  :controls="false"
                  style="width: 90%"
                  :placeholder="$i.common.inputkeyWordToSearch"></v-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$i.setting.insuranceExpenses +'：'">
                <v-input-number
                  class="speInput speNumber"
                  size="mini"
                  v-model="customData.insuranceExpensesUSD40HC"
                  :accuracy="4"
                  :mark="$i.setting.insuranceExpenses"
                  :controls="false"
                  style="width: 90%"
                  :placeholder="$i.common.inputkeyWordToSearch"></v-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.priceCurrency +'：'">
                <v-input-number
                  class="speInput speNumber"
                  size="mini"
                  v-model="customData.portWarehousePrice40HC"
                  :accuracy="4"
                  :mark="$i.setting.priceCurrency"
                  :controls="false"
                  style="width: 90%"
                  :placeholder="$i.common.inputkeyWordToSearch"></v-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$i.setting.exchangeRate +'：'">
                <v-input-number
                  class="speInput speNumber"
                  size="mini"
                  v-model="customData.exchangeRateUSD"
                  :accuracy="4"
                  :mark="$i.setting.exchangeRate"
                  :controls="false"
                  style="width: 90%"
                  :placeholder="$i.common.inputkeyWordToSearch"></v-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customDialogVisible=false">{{$i.button.cancel}}</el-button>
          <el-button :loading="allowAddAccount" type="primary" @click="modifyCustom">{{$i.button.confirm}}</el-button>
        </div>
      </el-dialog>

      <el-dialog width="50%" :title="$i.setting.tradeExchangeRate" :visible.sync="exchangerateDialogVisible">
        <el-form label-width="200px" >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$i.setting.from +'：'" required>
                <el-input size="mini" v-model="exchangerateData.fromCurrency" disabled  :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.to +'：'" required>
                <el-input size="mini" v-model="exchangerateData.toCurrency" disabled  :placeholder="$i.common.inputkeyWordToSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  :label="$i.setting.tradeExchangeRate +'：'" required>
                <v-input-number
                  class="speInput speNumber"
                  size="mini"
                  v-model="exchangerateData.price"
                  :accuracy="4"
                  :mark="$i.setting.tradeExchangeRate"
                  :controls="false"
                  style="width: 100%"
                  :placeholder="$i.common.inputkeyWordToSearch"></v-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="exchangerateDialogVisible=false">{{$i.button.cancel}}</el-button>
          <el-button :loading="allowAddAccount" type="primary" @click="modifyExchangerate">{{$i.button.confirm}}</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import { VTable,VUpload,VInputNumber } from '@/components/index';
    import { mapActions } from 'vuex'
    export default {
        name: "companyInfo",
        components:{
          VTable,
          VUpload,
          VInputNumber
        },
        data(){
            return{
              checked:false,
                summaryDisabled:true,
                addressDialogVisible:false,
                accountDialogVisible:false,
                contactDialogVisible:false,
                documentDialogVisible:false,
                customDialogVisible:false,
                exchangerateDialogVisible:false,
                //页面page绑定
                companyInfo:{
                  city: "",
                  code: "",
                  companyId: 0,
                  country: "",
                  currency: 0,
                  exportLicense: true,
                  id: 0,
                  incoterm: 0,
                  logo: "",
                  name: "",
                  ownerId: 0,
                  payment: 0,
                  recycle: true,
                  shortName: "",
                  status: 0,
                  tenantId: 0,
                  type: 0,
                  shipAgent:'',
                  version: "",
                  attachments:[]
                },
                cloneData:{},                   //用于克隆存储的对象
                //验证规则
                companyInfoRules:{

                },

                //弹出框data
                addressData:{
                    address: "",
                    city: "",
                    country: "",
                    customerId: 0,
                    id: "",
                    orderNo: "",
                    province: "",
                    receiveAddress: "",
                    receiveCity: "",
                    receiveCountry: "",
                    receiveProvince: "",
                    version: "",
                    def: false
                },
                accountData: {
                  accountType: '',
                  beneficiaryAccount: '',
                  beneficiaryAddress: '',
                  beneficiaryBankName: '',
                  beneficiaryBankSwift: '',
                  beneficiaryName: '',
                  currency: '',
                  customerId: null,
                  id: null,
                  version: null
                },
                contactData:{
                  cellphone: "",
                  customerId: 0,
                  deptId: "",
                  deptName: "",
                  email: "",
                  fax: "",
                  gender: "",
                  id: "",
                  name: "",
                  position: "",
                  qq: "",
                  skype: "",
                  status: "",
                  telphone: "",
                  version: ""
                },
              customData:{
                customerId: "",
                exchangeRateUSD: "",
                id:"",
                insuranceExpensesUSD40HC: "",
                oceanFreightUSD40HC: "",
                portWarehousePrice40HC: "",
                version: ""
              },
              exchangerateData: {
                id: "",
                fromCurrency: "",
                toCurrency: "",
                price: "",
                symbol: ""
              },
              logoParmas:{
                id: "",
                type: "PICTURE",
                url: ""
              },
              documentParmas:{
                documents: [
                  {
                    attachments: [],
                    checked: true,
                    code: '',
                    id: null,
                    version: null
                  }
                ],
                settingId: null
              },
              addressDatas:[],
              accountsData:[],
              contctsData:[],
              sex:[],
              //btn loading状态
              allowAddAddress:false,
              allowAddAccount:false,
              allowAddContact:false,
              allowModifySummary:false,           //顶部保存按钮
              //是否正在修改地址标识，因为新增和修改都是用的同一个按钮，所以为了区分增加一个标识
              isModifyAddress:false,
              isModifyAccount:false,
              isModifyContact:false,
            //判断是否修改过
              isModify:false,
              showNameBox:false,
              options:{},
              department:[],
              currencyList:[],
              documentType: [],
              checkList:[],
              documentRedonly:false,
              documentList:[],
              documentTypeClone:[]
            }
        },
        methods:{
          ...mapActions(['setMenuLink']),
            handleClick(tab, event) {
              switch(Number(tab.index)){
                case 3:
                  this.getDocument();
                  break;
                case 6:
                  this.getGridfavoritePartData();
                  break;
              }
            },
            //获取整个页面数据
            getWholeData(){
                this.companyInfo.concats=[];
                this.$ajax.get(this.$apis.get_purchase_customer_getCustomer).then(res=>{
                    this.companyInfo=res;
                    //判断shortName是否存在
                    if (this.companyInfo.shortName){
                      this.$localStore.remove('router_intercept')
                    }else{
                      this.showNameBox = true;
                    }

                    this.addressDatas = this.$getDB(this.$db.setting.companyAddress, res.address,e=>{
                      let country,receiveCountry;
                      country = _.findWhere(this.options.country, {code: e.country.value}) || {};
                      receiveCountry = _.findWhere(this.options.country, {code: e.receiveCountry.value}) || {};
                      e.country._value = country.name || '';
                      e.receiveCountry._value = receiveCountry.name || '';
                      const province = e.province.value || '';
                      const city = e.city.value || '';
                      const address = e.address.value || ''
                      const receiveProvince = e.receiveProvince.value || '';
                      const receiveCity = e.receiveCity.value || '';
                      const receiveAddress = e.receiveAddress.value || '';
                      e.companyAddress.value = e.country._value +' '+province+' '+city+' '+address;
                      e.receiverAddress.value = e.receiveCountry._value +' '+receiveProvince+' '+receiveCity+' '+receiveAddress
                      e.def.value ? e.def._value = this.$i.setting.isDefaultAddress : e.def._value = ''
                      return e;

                    });
                    this.accountsData = this.$getDB(this.$db.setting.companyAccountInfo, res.accounts)
                    this.contctsData = this.$getDB(this.$db.setting.companyContact, res.concats, e => {
                      let gender,deptId;
                      gender = _.findWhere(this.sex, {code: (e.gender.value)+''}) || {};
                      deptId = _.findWhere(this.department, {deptId: e.deptId.value}) || {};
                      e.gender._value = gender.name || '';
                      e.deptId._value = deptId.deptName || '';
                      return e;
                    });
                    if(res.custom){
                      this.customData = res.custom
                    }
                })
            },
            postUpdateIsSetting(){
              this.$ajax.post(this.$apis.post_purchase_customer_updateIsSetting,{id:this.companyInfo.id}).then(res=>{
                this.isModify = res;
              }).catch(err=>{
                console.log(err)
              });
            },
          //获取币种
          getCurrency(){
              this.$ajax.get(this.$apis.get_currency_all,{},{cache:true}).then(res=>{
                  this.options.currency = res
              }).catch(err=>{
                console.log(err)
              });
          },
          //获取字典
          getCodePart(){
            this.$ajax.post(this.$apis.POST_CODE_PART,["ITM","PMT","CUSTOMER_TYPE","EL_IS","SEX","DOCUMENT_TYPE"],{cache:true}).then(res=>{
              this.options.payment = _.findWhere(res, {'code': 'PMT'}).codes;
              this.options.incoterm = _.findWhere(res, {'code': 'ITM'}).codes;
              this.options.type = _.findWhere(res, {'code': 'CUSTOMER_TYPE'}).codes;
              this.options.exportLicense = _.findWhere(res, {'code': 'EL_IS'}).codes;
              this.sex = _.findWhere(res, {'code': 'SEX'}).codes;
              this.documentType = _.findWhere(res, {'code': 'DOCUMENT_TYPE'}).codes;
            }).catch(err=>{
              console.log(err)
            });
          },
          //获取国家
          getCountryAll(){
            this.$ajax.get(this.$apis.GET_COUNTRY_ALL,{},{cache:true}).then(res=>{
              this.options.country = res
              this.$sessionStore.set('country', res);
            }).catch(err=>{
              console.log(err)
            });
          },
          //获取部门列表
          getDepartment(){
            this.$ajax.get(this.$apis.GET_DEPARTMENT,{},{cache:true}).then(res=>{
              this.department = res
            }).catch(err=>{
              console.log(err)
            });
          },

          //修改顶部简介信息
            modifySummary(){
                this.summaryDisabled=false;
                this.cloneData=Object.assign({},this.companyInfo);
            },
            saveModifySummary(){
                if (this.$validateForm(this.companyInfo, this.$db.setting.companyInfo)) {
                  return false;
                }
                let params={
                    city: this.companyInfo.city,
                    code: this.companyInfo.code,
                    companyId: this.companyInfo.companyId,
                    country: this.companyInfo.country,
                    currency: this.companyInfo.currency,
                    exportLicense: this.companyInfo.exportLicense,
                    id:this.companyInfo.id,
                    incoterm: this.companyInfo.incoterm,
                    logo: '',
                    name: this.companyInfo.name,
                    ownerId: this.companyInfo.ownerId,
                    payment: this.companyInfo.payment,
                    recycle: this.companyInfo.recycle,
                    shortName: this.companyInfo.shortName,
                    status: this.companyInfo.status,
                    tenantId: this.companyInfo.tenantId,
                    type: this.companyInfo.type,
                    shipAgent: this.companyInfo.shipAgent,
                    version: this.companyInfo.version
                };
                this.allowModifySummary=true;
                this.$ajax.post(`${this.$apis.post_purchase_customer}/${this.companyInfo.id}`,params).then(res=>{
                    this.$message({
                        message: this.$i.common.modifySuccess,
                        type: 'success'
                    });
                    this.getWholeData();
                    this.allowModifySummary=false;
                    this.summaryDisabled=true;
                    if (!this.companyInfo.setting){
                      this.postUpdateIsSetting();
                    }
                }).catch(err=>{
                    this.getWholeData();
                    this.allowModifySummary=false;
                    this.summaryDisabled=true;
                });

                this.logoParmas.id = this.companyInfo.id;
                this.logoParmas.url = this.$refs.uploadFile[0].getFiles()[0];
                this.$ajax.post(this.$apis.post_oss_company_upload,this.logoParmas).then(res=>{
                  if (!this.companyInfo.setting){
                    this.postUpdateIsSetting();
                  }
                  this.getWholeData();
                })
            },
            cancelModifySummary(){
                this.companyInfo=Object.assign({},this.cloneData);
                this.summaryDisabled=true;
            },
          addressAction(item,type){
            switch(type) {
              case 1:
                this.modifyAddress(item);
                break;
              case 2:
                this.deleteAddress(item);
                break;
            }
          },
            /**
             * address操作
             * */
            addAddress(){
                this.addressDialogVisible=true;
            },
            sureAddAddress(){
              if (this.$validateForm(this.addressData, this.$db.setting.companyAddress)) {
                return false;
              }
              this.allowAddAddress=true;
              this.addressData.customerId=this.companyInfo.id;
              if(this.isModifyAddress){
                //表示是在修改地址
                this.$ajax.post(`${this.$apis.post_purchase_customer_address_id}/${this.addressData.id}`,this.addressData).then(res=>{
                  this.allowAddAddress=false;
                  this.$message({
                    message: this.$i.common.modifySuccess,
                    type: 'success'
                  });
                  this.getWholeData();
                  this.addressDialogVisible=false;
                }).catch(err=>{
                  this.allowAddAddress=false;
                });
              }else{
                //表示是在新增地址
                this.$ajax.post(this.$apis.post_purchase_customer_address,this.addressData).then(res=>{
                  this.allowAddAddress=false;
                  if (!this.companyInfo.setting){
                    this.postUpdateIsSetting();
                  }
                  this.$message({
                    message: this.$i.common.addSuccess,
                    type: 'success'
                  });
                  this.getWholeData();
                  this.addressDialogVisible=false;
                }).catch(err=>{
                  this.allowAddAddress=false;
                  this.$message({
                    message: err,
                    type: 'success'
                  });
                  this.addressDialogVisible=false;
                });
              }
            },
            modifyAddress(e){
               var result = {}
                for(const i in e){
                    result[e[i].key]= e[i].value
                }
                this.isModifyAddress=true;      //标识正在修改地址
                this.addressData=Object.assign({}, result);
                this.addressDialogVisible=true;
            },
            deleteAddress(e){
                this.$confirm(this.$i.common.sureToDeleteAddress, this.$i.common.prompt, {
                    confirmButtonText: this.$i.common.confirm,
                    cancelButtonText: this.$i.common.cancel,
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post(this.$apis.post_purchase_customer_deleteAddress,{id:e.id.value}).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.common.deleteTheSuccess
                        });
                        this.getWholeData();
                    }).catch(err=>{
                        console.log(err)
                    });
                }).catch(() => {

                });
            },
             //更改默认地址
            setAddress(){
              let def = [];
              this.addressDatas.forEach(v=>{
                def.push(_.findWhere(v,{key:'def'}).value);
              })
              if (_.compact(def).length != 0){
                this.$confirm(this.$i.setting.isReplace, this.$i.common.prompt, {
                  confirmButtonText: this.$i.common.confirm,
                  cancelButtonText: this.$i.common.cancel,
                  type: 'warning'
                }).then(() => {
                }).finally(()=>{
                  if (this.addressData.def){
                    this.$message({
                      type: 'success',
                      message: this.$i.setting.replaceSuccess
                    });
                  }else{
                    this.$message({
                      type: 'success',
                      message: this.$i.setting.cancelReplace
                    });
                  }
                })
              }
            },

          /**
           * Account操作
           * */
          addAccount(){
            this.accountDialogVisible=true;
          },
          accountAction(item,type){
            switch(type) {
              case 1:
                this.modifyAccount(item);
                break;
              case 2:
                this.deleteAccount(item);
                break;
            }
          },
          sureAddAccount(){
            if (this.$validateForm(this.accountData, this.$db.setting.companyAccountInfo)) {
              return false;
            }
            this.allowAddAccount=true;
            this.accountData.customerId=this.companyInfo.id;

            if(this.isModifyAccount){
              //表示是在修改account
              this.$ajax.post(`${this.$apis.post_purchase_customer_account_id}/${this.accountData.id}`,this.accountData)
                .then(res=>{
                this.allowAddAccount=false;
                this.$message({
                  message: this.$i.common.modifySuccess,
                  type: 'success'
                });
                this.getWholeData();
                this.accountDialogVisible=false;
              }).catch(err=>{
                this.allowAddAccount=false;
                this.accountDialogVisible=false;
              });
            }
            else{
              //表示是在新增account
              this.$ajax.post(this.$apis.post_purchase_customer_account,this.accountData).then(res=>{
                if (!this.companyInfo.setting){
                  this.postUpdateIsSetting();
                }
                this.allowAddAccount=false;
                this.$message({
                  message: this.$i.common.addSuccess,
                  type: 'success'
                });
                this.getWholeData();
                this.accountDialogVisible=false;
              }).catch(err=>{
                this.allowAddAccount=false;
                this.accountDialogVisible=false;
              });
            }
          },
          modifyAccount(e){
            var result = {}
            for(const i in e){
              result[e[i].key]= e[i].value
            }
            this.isModifyAccount=true;      //标识正在修改contact
            this.accountData=Object.assign({}, result);
            this.accountDialogVisible=true;
          },
          //79886349729017856
          deleteAccount(e){
            this.$confirm(this.$i.common.sureToDeleteAccount, this.$i.common.prompt, {
              confirmButtonText: this.$i.common.confirm,
              cancelButtonText: this.$i.common.cancel,
              type: 'warning'
            }).then(() => {
              this.$ajax.post(this.$apis.post_purchase_customer_account_delete,{id:e.id.value}).then(res=>{
                this.$message({
                  type: 'success',
                  message: this.$i.common.deleteTheSuccess
                });
                this.getWholeData();
              }).catch(err=>{
                console.log(err)
              });
            }).catch(() => {

            });
          },

            /**
             * contact操作
             * */
            addContact(){
                this.contactDialogVisible=true;
            },
            contactAction(item,type){
              switch(type) {
                case 1:
                  this.modifyContact(item);
                  break;
                case 2:
                  this.deleteContact(item);
                  break;
              }
            },
            sureAddContact(){
                if (this.$validateForm(this.contactData, this.$db.setting.companyContact)) {
                  return false;
                }
                this.allowAddContact=true;
                this.contactData.customerId=this.companyInfo.id;

                if(this.isModifyContact){
                    //表示是在修改account
                    this.$ajax.post(`${this.$apis.post_purchase_customer_concat_id}/${this.contactData.id}`,this.contactData).then(res=>{
                        this.allowAddContact=false;
                        this.$message({
                            message: this.$i.common.modifySuccess,
                            type: 'success'
                        });
                        this.getWholeData();
                        this.contactDialogVisible=false;
                    }).catch(err=>{
                        this.allowAddContact=false;
                        this.contactDialogVisible=false;
                    });
                }
                else{
                    //表示是在新增account
                    this.$ajax.post(this.$apis.post_purchase_customer_concat,this.contactData).then(res=>{
                        if (!this.companyInfo.setting){
                          this.postUpdateIsSetting();
                        }
                        this.allowAddContact=false;
                        this.$message({
                            message: this.$i.common.addSuccess,
                            type: 'success'
                        });
                        this.getWholeData();
                        this.contactDialogVisible=false;
                    }).catch(err=>{
                        this.allowAddContact=false;
                        this.contactDialogVisible=false;
                    });
                }
            },
            modifyContact(e){
                var result = {}
                for(const i in e){
                    result[e[i].key]= e[i].value
                }
                this.isModifyContact=true;      //标识正在修改contact
                this.contactData=Object.assign({}, result);
                this.contactDialogVisible=true;
            },
            deleteContact(e){
                this.$confirm(this.$i.common.sureToDeleteContact, this.$i.common.prompt, {
                    confirmButtonText: this.$i.common.confirm,
                    cancelButtonText: this.$i.common.cancel,
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post(this.$apis.post_purchase_customer_deleteConcat,{id:e.id.value}).then(res=>{
                        this.$message({
                            type: 'success',
                            message: this.$i.common.deleteTheSuccess
                        });
                        this.getWholeData();
                    }).catch(err=>{
                        console.log(err)
                    });
                }).catch(() => {

                });
            },
          /**
           * document操作
           * */
          getDocument(){
            this.$ajax.get(this.$apis.get_purchase_customer_document).then(res=>{
              // this.documentList = res
              this.documentTypeClone = this.$depthClone(this.documentType)
              this.documentTypeClone.forEach(v=>{
                res.forEach(m =>{
                  if (v.code === m.code){
                      v.attachments= m.attachments,
                      v.checked= m.checked,
                      v.code= m.code,
                      v.newId= m.id,
                      v.version= m.version
                  }
                })
              });
            })
          },
          modifyDocument(){
            const documentParmas = {
              documents:[],
              settingId: this.companyInfo.id
            }
            this.documentTypeClone.forEach(v=>{
              documentParmas.documents.push({
                attachments: this.$refs['uploadDocument'+v.code][0].getFiles() ,
                code: v.code,
                id: v.newId || '',
                checked: v.checked,
                version: v.version
              })
            });

            this.$ajax.post(this.$apis.post_purchase_customer_document,documentParmas).then(res=>{
              this.$message({
                message: this.$i.common.uploadSuccess,
                type: 'success'
              });
              this.getDocument();
            })
          },
          handleCheckedDocument(item,index){
            item.checked = !item.checked;
            this.$set(this.documentTypeClone,index, item);
          },
          /**
           * custom操作
           * */
          addCustom(){
            this.customDialogVisible = true;

          },
          modifyCustom(){
            this.customDialogVisible = false;
            this.customData.customerId=this.companyInfo.id;
            if (!this.customData.id){
              this.$ajax.post(this.$apis.post_purchase_customer_custom,this.customData).then(res=>{
                this.$message({
                  message: this.$i.common.addSuccess,
                  type: 'success'
                });
                if (!this.companyInfo.setting){
                  this.postUpdateIsSetting();
                }
                this.getWholeData();
                this.customDialogVisible = false;
              }).catch(err=>{
                this.getWholeData();
                this.customDialogVisible=false;
              });
            }else{
              this.$ajax.post(`${this.$apis.post_purchase_customer_custom_id}/${this.customData.id}`,this.customData).then(res=>{
                if (!this.companyInfo.setting){
                  this.postUpdateIsSetting();
                }
                this.$message({
                  message: this.$i.common.modifySuccess,
                  type: 'success'
                });
                this.getWholeData();
                this.customDialogVisible = false;
              }).catch(err=>{
                this.getWholeData();
                this.customDialogVisible=false;
              });
            }
          },

          /**
           * Trade exchange rate操作
           * */
          getGridfavoritePartData(){
            this.$ajax.get(this.$apis.get_customcurrencyexchangerate_query).then(res=>{
                this.currencyList = this.$getDB(this.$db.setting.exchangeRate, res)
            })
          },
          rateAction(item,type){
            switch(type) {
              case 1:
                this.updateExchangerate(item);
                break;
            }
          },
          updateExchangerate(e){
            var result = {}
            for(const i in e){
              result[e[i].key]= e[i].value
            }
            this.exchangerateDialogVisible = true;
            this.exchangerateData=Object.assign({}, result);
          },
          modifyExchangerate(){
            if (this.$validateForm(this.exchangerateData, this.$db.setting.exchangeRate)) {
              return false;
            }
            this.$ajax.post(this.$apis.post_exchangerate_update,this.exchangerateData).then(res=>{
              if (!this.companyInfo.setting){
                this.postUpdateIsSetting();
              }
              this.$message({
                message: this.$i.common.modifySuccess,
                type: 'success'
              });
              this.getGridfavoritePartData();
              this.exchangerateDialogVisible = false;
            }).catch(err=>{
              this.exchangerateDialogVisible = false;
            });
          },
          /**
           * Attachment操作
           * */
          upload(){
              //ATTACHMENT,文件 PICTURE 图片
            const uploadParams = {
              id: this.companyInfo.id,
              type: "ATTACHMENT",
              url: this.$refs.uploadAttachment.getFiles()[0]
            };
            const batchUploadParams = {
              id: this.companyInfo.id,
              type: "ATTACHMENT",
              urls: this.$refs.uploadAttachment.getFiles()
            };
            if (this.$refs.uploadAttachment.getFiles().length !== 0){
              if (this.$refs.uploadAttachment.getFiles().length === 1){
                if (!this.companyInfo.setting){
                  this.postUpdateIsSetting();
                }
                this.$ajax.post(this.$apis.post_oss_company_upload,uploadParams).then(res=>{
                  this.$message({
                    message: this.$i.common.uploadSuccess,
                    type: 'success'
                  });
                  this.getWholeData();
                })

              }else{
                this.$ajax.post(this.$apis.post_oss_company_batchUpload,batchUploadParams).then(res=>{
                  if (!this.companyInfo.setting){
                    this.postUpdateIsSetting();
                  }
                  this.$message({
                    message: this.$i.common.uploadSuccess,
                    type: 'success'
                  });
                  this.getWholeData();
                })
              }
            }else{
              this.$message({
                message: this.$i.common.uploadFile,
                type: 'warning'
              });
              return false;
            }
          },
          customValidation(){
            if(this.companyInfo.shortName === ""){ //输入不能为空
              this.$message({
                message: `${this.$i.util.validateRequired} ${this.$i.setting.customerShortName}`,
                type: 'warning'
              });
            }else if(this.companyInfo.shortName.length>6){
              this.$message({
                message: this.$i.setting.shortNameLength,
                type: 'warning'
              });
            }else if (!/^[0-9a-zA-Z]+$/.test(this.companyInfo.shortName)){
              this.$message({
                message: this.$i.setting.numberLetter,
                type: 'warning'
              });
            }else if (!/^[0-9a-hj-np-yA-HJ-NP-Y]+$/g.test(this.companyInfo.shortName)){
              this.$message({
                message: this.$i.setting.abbreviationAllowed,
                type: 'warning'
              });
            }else{
              this.$ajax.post(this.$apis.post_purchase_customer_exist,{
                id: this.companyInfo.id,
                shortName: this.companyInfo.shortName
              }).then(res=>{
                if (res){
                  this.$message({
                    message: this.$i.setting.abbreviationOnly,
                    type: 'warning'
                  });
                }else {
                  this.showNameBox = false;
                }
              })
            }
          },
        },
        created(){
             this.getCodePart();
             this.getCurrency();
             this.getCountryAll();
             this.getDepartment();
             this.getWholeData();
        },
        mounted(){
          this.setMenuLink({
              path: '/logs',
              query: {code: 'CUSTOMER_SETTING',bizCode: 'BIZ_CUSTOMER_SETTING'},
              type: 100,
              label: this.$i.common.log,
            });
        },
        watch:{
            addressDialogVisible(n){
                if(!n){
                    _.map(this.addressData,(v,k)=>{
                        this.$set(this.addressData,k,'');
                    });
                    this.isModifyAddress=false;
                }
            },
            accountDialogVisible(n){
                if(!n){
                    _.map(this.accountData,(v,k)=>{
                        this.$set(this.accountData,k,'');
                    });
                    this.isModifyAccount=false;
                }
            },
            contactDialogVisible(n){
                if(!n){
                    _.map(this.contactData,(v,k)=>{
                        this.$set(this.contactData,k,'');
                    });
                    this.isModifyContact=false;
                }
            },
        },
        computed: {

        }
    }
</script>

<style scoped>
    .title{
        font-weight: bold;
        font-size: 18px;
        line-height: 32px;
        color:#666666;
    }
    .speCol{
        height: 51px;
    }
    .speWidth{
        width: 100%;
    }
    .summary-btn{
        text-align: center;
        padding-top: 10px;

    }
    .section-btn{
        margin-bottom: 10px;
    }

    .section{
        margin-top: 20px;
    }
    .logo{
      width: 48px;
      height: 48px;
      float: left;
      margin-left: 15px;
      border: 1px solid #cccccc;
      border-radius: 10%;
    }

    /*弹出框样式*/
    .dialog-footer{
        text-align: center;
    }
  .attachmentList{
    padding-top: 20px;
  }

  .documentBoxCon{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .documentBoxCon1{
    width: 25%;
  }
  .uploadBox{
    padding-top: 10px;
  }
  .alert{
    width: 40%;
    margin: 0 auto;
    padding: 15px;
  }
</style>
