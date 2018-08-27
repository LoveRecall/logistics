<template>
  <div class="create-inquiry">
    <h3 class="hd">{{ showInquiryNo ? `${$i.inquiry.inquiryNo}${fromArg.inquiryNo}` : $i.common.createInquiry }}</h3>
    <div class="select-wrap">
      <h4 class="content-hd">{{ $i.inquiry.basicInfo }}</h4>
      <el-form ref="ruleform" :model="fromArg" :show-message="false">
        <el-row :gutter="10">
          <el-col
            v-for="(item, index) in $db.inquiry.basicInfo"
            :key="index"
            :xs="item.xs || 8"
            :sm="item.sm || 8"
            :md="item.md || 8"
            :lg="item.lg || 8"
            v-if="!item._inquiryHide && !item._hide">
            <el-form-item
              :label="item.label+':'"
              :prop="item.key"
              :rules="item.rules"
              :label-width="item.width || '150px'"
              :required="item._rules?item._rules.required:false">
              <el-input
                v-model="fromArg[item.key]"
                :size="item.size || 'mini'"
                :placeholder="item.placeholder"
                v-if="item.type === 'String' && !item._hide && item.types !== 'textarea'"
                :disabled="item.disabled"/>
              <el-select
                v-model="fromArg[item.key]"
                value-key="id"
                filterable
                :size="item.size || 'mini'"
                :placeholder="item.placeholder"
                v-else-if="item.key === 'destinationCountry' || item.key === 'departureCountry'"
                style="width:100%;">
                <el-option
                  v-for="items in optionData[item.key]"
                  :key="items.id"
                  :label="items.name"
                  :value="items.code"
                  :id="items.id"/>
              </el-select>
              <el-select
                v-model="fromArg[item.key]"
                value-key="id"
                filterable
                :size="item.size || 'mini'"
                :placeholder="item.placeholder"
                v-else-if="item.key === 'currency'"
                style="width:100%;">
                <el-option
                  v-for="items in optionData[item.key]"
                  :key="items.id"
                  :label="items.code"
                  :value="items.code"
                  :id="items.id"/>
              </el-select>
              <el-select
                v-model="fromArg[item.key]"
                value-key="id"
                filterable
                :size="item.size || 'mini'"
                :placeholder="item.placeholder"
                v-else-if="item.type === 'Select'"
                style="width:100%;">
                <el-option
                  v-for="items in optionData[item.key]"
                  :key="items.id"
                  :label="items.name"
                  :value="items.code"
                  :id="items.id"/>
              </el-select>
              <el-select
                style="width:100%;"
                v-else-if="item.type === 'manySelect'"
                v-model="fromArg.suppliers"
                multiple
                filterable
                remote
                reserve-keyword
                value-key="id"
                :size="item.size || 'mini'"
                :placeholder="$i.common.pleaseEnterTheKeyWords"
                :remote-method="getSuppliers"
                :loading="loading">
                <el-option
                  v-for="items in optionData[item.key]"
                  :key="items.id"
                  :label="items.name"
                  :value="items"
                  :id="items.id"/>
              </el-select>
              <el-input
                type="textarea"
                v-model="fromArg[item.key]"
                :rows="item.rows || 4"
                :size="item.size || 'mini'"
                :placeholder="item.placeholder"
                v-else-if="item.types === 'textarea'"
                resize="none"
                :disabled="item.disabled"/>
              <span v-else-if="item.type === 'Number'" style="display:flxe;">
                <v-input-number v-model="fromArg[item.key]" :min="0" :max="100"
                    controls-position="right" size="mini" :controls="false"
                    style="width:100%; padding-right:10px;"/>
                <i style="position:absolute; right:5px; top:50%;transform: translate(0, -50%); font-size:12px;">%</i>
              </span>
              <v-upload v-else-if="item.type === 'attachment'" :limit="20" :list="fromArg.attachments" ref="UPLOAD"></v-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <h4 class="content-hd">{{ $i.common.productInfo }}</h4>
    <div class="status">
      <div class="btn-wrap">
        <el-button @click="addProduct">{{ $i.common.addProduct }}</el-button>
        <el-button type="danger" :disabled="checkedSkuIds.length <= 0" @click="removeList">{{
          `${$i.common.remove}(${checkedSkuIds.length})` }}
        </el-button>
      </div>
      <!-- <select-search :options="[]" @inputEnter="inputEnter" /> -->
    </div>
    <v-table
      code="inquiry"
      :data.sync="tabData"
      :buttons="productInfoBtn"
      :loading="tableLoad"
      :height="450"
      :totalRow="productTotalRow"
      @action="producInfoAction"
      @change-checked="changeChecked"
      :parId="'skuId'"
      :rowspan="2"/>
    <div class="bom-btn-wrap">
      <el-button @click="submitForm()" v-authorize="'INQUIRY:OVERVIEW:CREATE_INQUIRY'">{{ $i.common.submit }}</el-button>
      <el-button @click="submitForm('draft')" v-authorize="'INQUIRY:OVERVIEW:CREATE_INQUIRY'">{{ $i.common.saveAsDraft }}</el-button>
    </div>
    <div class="bom-btn-wrap-station"></div>
    <el-dialog
      custom-class="ucn-dialog-center"
      title="Add Product"
      :visible.sync="dialogTableVisible"
      width="80%"
      lock-scroll>
      <el-radio-group v-model="radio" @change="fromChange">
        <el-radio-button label="product">{{$i.common.fromNewSearch}}</el-radio-button>
        <el-radio-button label="bookmark">{{$i.common.FromMyBookmark}}</el-radio-button>
      </el-radio-group>
      <v-product
        :hideBtns="true"
        :hideBtn="true"
        :disabledLine="disabledLine"
        @handleOK="getList"
        @handleCancel="handleCancel"
        :forceUpdateNumber="trig"
        :type="radio"
        :isInquiry="true"></v-product>
    </el-dialog>
    <v-history-modify code="inquiry" @save="save" :beforeSave="beforeSave" ref="HM"/>
  </div>
</template>
<script>
import {selectSearch, VTable, VUpload, VHistoryModify, VInputNumber} from '@/components/index';
import product from '@/views/product/addProduct';
import {mapActions} from 'vuex';
import codeUtils from '@/lib/code-utils';
import thisTool from './index';

export default {
  name: 'createInquiry',
  data() {
    return {
      showInquiryNo: false,
      disabledLine: [],
      checkedSkuIds: [],
      trig: 0,
      tableLoad: false,
      optionData: {
        paymentMethod: [],
        transport: [],
        incoterm: [],
        currency: [],
        supplierName: [],
        exportLicense: [],
        destinationCountry: [],
        departureCountry: []
      },
      loading: false,
      fromArg: {
        paymentTerm: 0,
        timeZone: 1,
        inquiryAmount: 1,
        skuQty: 1
      },
      radio: 'product', // Add Product status
      dialogTableVisible: false, // Add Product switch

      tabColumn: '', // tab top
      tabData: [], // tab Data
      textarea: '',
      initDetailIds: [],
      sdbo: null
    };
  },
  components: {
    'select-search': selectSearch,
    'v-table': VTable,
    'v-product': product,
    VUpload,
    VHistoryModify,
    VInputNumber
  },
  computed: {
    productTotalRow() {
      let obj = {};
      if (this.tabData.length <= 0) {
        return false;
      }
      let totalUnitKeys = {};
      Object.values(this.$db.inquiry.productInfo).filter(i => i._total && i._total.unitKey).forEach(i => totalUnitKeys[i._total.unitKey] = new Set());

      this.tabData.filter(i => !i._remark).forEach(v => {
        _.mapObject(v, (item, key) => {
          if (item._hide) return;
          if (item._total) {
            let unitKey = item._total.unitKey;
            if (unitKey && v[unitKey] && totalUnitKeys[unitKey]) {
              totalUnitKeys[unitKey].add(v[unitKey].value || null);
              if (totalUnitKeys[unitKey].size > 1) {
                obj[key].value = null;
                return;
              }
            }
            if (!isNaN(item.value)) {
              let value = Number(item.value) + (Number(obj[key] ? obj[key].value : 0) || 0);
              obj[key] = {
                value: item._toFixed ? Number(value.toFixed(item._toFixed)) : value
              };
            }
          } else {
            obj[key] = {
              value: ''
            };
          }
        });
      });

      return [obj];
    }
  },
  created() {
    thisTool.setMenuLinks(this, ['INQUIRY:OVERVIEW:DRAFT', 'INQUIRY:OVERVIEW:DELETE', 'INQUIRY:LOG']);

    this.sdbo = this.$db.inquiry.productInfo;

    for (let field in this.sdbo) {
      let note = this.sdbo[field]._i_note;
      if (note) {
        this.sdbo[field]._note = this.$i.inquiry[note];
      }
    }
    console.log(this.sdbo);

    Promise.all([codeUtils.getInquiryDicCodes(this), codeUtils.getCotegories(this), this.getSuppliers('')]).then(res => {
      let data = res[0];
      if (res[1]) {
        data.push(res[1]);
      }
      this.$store.dispatch('setDic', data);

      this.optionData.paymentMethod = codeUtils.findCodes(this, 'PMT');
      this.optionData.transport = codeUtils.findCodes(this, 'MD_TN');
      this.optionData.incoterm = codeUtils.findCodes(this, 'ITM');
      this.optionData.exportLicense = codeUtils.findCodes(this, 'EL_IS');

      this.optionData.currency = codeUtils.findCodes(this, 'CY_UNIT');

      this.optionData.destinationCountry = codeUtils.findCodes(this, 'COUNTRY');
      this.optionData.departureCountry = codeUtils.findCodes(this, 'COUNTRY');
    }).then(this.initFromParams);
  },
  methods: {
    ...mapActions(['setMenuLink']),
    getBaseData() {
      let getCodes = this.$ajax.post(this.$apis.POST_CODE_PART, ['PMT', 'ITM', 'EL_IS', 'MD_TN'], {cache: true});
      let getCurrencies = this.$ajax.get(this.$apis.GET_CURRENCY_ALL);
      let getCountries = this.$ajax.get(this.$apis.GET_COUNTRY_ALL, '', {cache: true});

      Promise.all([getCodes, getCurrencies, getCountries]).then(res => {
        this.optionData.paymentMethod = _.findWhere(res[0], {'code': 'PMT'}).codes;
        this.optionData.transport = _.findWhere(res[0], {'code': 'MD_TN'}).codes;
        this.optionData.incoterm = _.findWhere(res[0], {'code': 'ITM'}).codes;
        this.optionData.exportLicense = _.map(_.findWhere(res[0], {'code': 'EL_IS'}).codes, item => {
          item.code = Number(item.code);
          return item;
        });

        this.optionData.currency = res[1];

        this.optionData.destinationCountry = res[2];
        this.optionData.departureCountry = res[2];
      });
    },
    getSuppliers(name) {
      return this.$ajax.get(this.$apis.PURCHASE_SUPPLIER_LISTSUPPLIERBYNAME + '?name=' + name).then(res => {
        this.optionData.supplierName = res;
        return res;
      });
    },
    initFromParams() {
      let query = this.$route.query, regex = (/^\d+(,\d+)*$/);
      if (query.id && !isNaN(query.id)) {
        this.getInquiryInfo(query.id);
        if (!query.from || query.from !== 'copy') {
          this.showInquiryNo = true;
        }
        return;
      }
      if (query.skus && regex.test(query.skus)) {
        this.getList(query.skus.split(','));
      }
      let suppliers = [];
      if (query.supplierCompanies && regex.test(query.supplierCompanies)) {
        let supplierCompanies = query.supplierCompanies.split(',');
        if (supplierCompanies.length > 0) {
          suppliers.push.apply(suppliers, this.optionData.supplierName.filter(c => supplierCompanies.indexOf(c.companyId.toString()) > -1));
        }
      }
      if (query.supplierCodes && (/^\w+(,\w+)*$/).test(query.supplierCodes)) {
        let supplierCodes = query.supplierCodes.split(',');
        if (supplierCodes.length > 0) {
          suppliers.push.apply(suppliers, this.optionData.supplierName.filter(c => supplierCodes.indexOf(c.code.toString()) > -1));
        }
      }
      if (suppliers.length > 0) {
        this.fromArg.suppliers = suppliers;
      }
    },
    getInquiryInfo(id) {
      this.$ajax.get(`${this.$apis.GET_INQIIRY_DETAIL}/{id}`, {id}).then(res => {
        if (res.exportLicense === false) {
          res.exportLicense = 0;
        } else if (res.exportLicense === true) {
          res.exportLicense = 1;
        }
        if (Array.isArray(res.suppliers)) {
          res.suppliers.forEach(items => {
            _.mapObject(items, (val, k) => {
              if (/^supplier/.test(k)) items[k.substring(8, k.length).toLowerCase()] = val;
            });
          });
        } else if (res.supplierId) {
          res.suppliers = this.optionData.supplierName.filter(c => c.id === res.supplierId);
        }
        if (!this.showInquiryNo) {
          delete res.id;
          delete res.orderNo;
          delete res.tenantId;
          delete res.companyId;
          delete res.inquiryNo;
          delete res.quotationNo;
          delete res.status;
        }
        if (res.details) {
          for (let item of res.details) {
            item.entryDt = null;
            item.updateDt = null;
            item.updateName = null;
            this.initDetailIds.push(item.id);
          }
        }
        this.fromArg = res;
        this.tabData = this.$getDB(this.sdbo, this.$refs.HM.getFilterData(res.details, 'skuId'), item => {
          this.$filterDic(item);
          _.map(item, val => {
            val.defaultData = _.isUndefined(val.dataBase) ? val.value : val.dataBase;
            if (val.type === 'attachment' && val.value) {
              val.value = val.value.split(',');
            }
          });
        });
      });
    },
    handleCancel() {
      this.dialogTableVisible = false;
    },
    addProduct() {
      this.disabledLine = this.tabData.filter(i => !i._disabled);
      this.trig = new Date().getTime();
      this.dialogTableVisible = true;
    },
    removeList() {
      this.tabData = this.tabData.filter(i => !this.checkedSkuIds.includes(i.skuId.value));
      this.checkedSkuIds = [];
    },
    beforeSave(data) {
      if (Array.isArray(data)) {
        for (let item of data) {
          if (!item._remark && item.skuReadilyAvailable.value === 1 && (isNaN(item.skuAvailableQty.value) || item.skuAvailableQty.value < 1)) {
            this.$message.warning(this.$i.inquiry.skuAvailableQtyMustGreatNotLessThanOne);
            return false;
          }
        }
      }
      return true;
    },
    save(data) { // modify 编辑完成反填数据
      let items = _.map(data, item => {
        _.map(item, (o, field) => {
          if (['fieldDisplay', 'status', 'entryDt', 'updateDt'].indexOf(field) > -1) {
            return;
          }
          if (typeof o.defaultData !== 'undefined' && o.value !== o.defaultData) {
            o._color = 'blue';
          }
        });
        return item;
      });
      this.tabData = _.map(this.tabData, oldItem => {
        let tmp = _.filter(items, item => _.findWhere(oldItem, {'key': 'skuId'}).value === _.findWhere(item, {'key': 'skuId'}).value && !!oldItem._remark === !!item._remark);
        if (tmp[0] && tmp[0].skuPictures && tmp[0].skuPictures._image) {
          tmp[0].skuPictures.value = tmp[0].skuPictures._value;
        }
        return tmp[0] || oldItem;
      });
    },
    getProduct() {

    },
    fromChange(val) {
      this.trig = new Date().getTime();
    },
    submitForm(type) { // 提交
      this.fromArg.draft = type && type === 'draft' ? 1 : 0;
      // this.$refs.ruleform.validate((valid) => {
      //   if (!valid) {
      //     valid failed.
      //   } else {
      //     successed.
      //   }
      // });
      let arr = [];
      _.map(this.fromArg.suppliers, item => {
        let json = {};
        _.mapObject(item, (val, k) => {
          if (!(/^supplier/).test(k)) json[`supplier${k.substring(0, 1).toUpperCase()}${k.substring(1, k.length)}`] = val;
        });
        arr.push(json);
      });
      let upData = _.clone(this.fromArg);
      if (arr.length) upData.suppliers = arr;
      upData.details = this.dataFilter(this.tabData);
      upData.skuQty = upData.details.length;
      upData.attachments = this.$refs.UPLOAD[0].getFiles();

      let postData = this.$filterModify(upData);
      if (postData.discountRate && isNaN(postData.discountRate)) {
        this.$message.warning(this.$i.inquiry.discountRateMustNumber);
        return;
      }
      if (type !== 'draft') {
        if (typeof postData.incoterm === 'undefined' || postData.incoterm === null) {
          this.$message.warning(this.$i.inquiry.incotermRequired);
          return;
        }
        if (!postData.suppliers || postData.suppliers.length === 0) {
          this.$message.warning(this.$i.inquiry.supplierRequired);
          return;
        }
        if (!postData.details || postData.details.length === 0) {
          this.$message.warning(this.$i.inquiry.skuRequired);
          return;
        }
      }

      let ids = postData.details.filter(i => i.id).map(i => i.id);
      postData.deleteDetailIds = this.initDetailIds.filter(i => !ids.includes(i));

      this.$ajax.post(this.$apis.POST_INQUIRY_SAVE, postData).then(() => {
        if (!this.fromArg.draft) {
          this.$router.push('/negotiation/inquiry')
        } else {
          this.$router.push({
            name: 'negotiationDraft',
            params: {
              type: 'inquiry'
            }
          });
        }
      });
    },
    dataFilter(data) {
      let excludeColumns = '$changedFields,$pageState,entryDt,updateDt,status';
      let arr = [], remark = {}, json = {};
      data.forEach(item => {
        remark = {};
        if (item._remark) {
          // 拼装remark 数据
          for (let field in item) {
            let value = item[field].value;
            if (value && value.length > 0) {
              remark[field] = value;
            }
          }
          json.fieldRemark = remark;
        } else {
          json = {};
          for (let k in item) {
            if (excludeColumns.indexOf(k) > -1) continue;
            if (k === 'fieldRemark') {
              json[k] = remark;
            } else if (k === 'fieldDisplay') {
              json[k] = {};
              if (item.$changedFields) {
                for (let f in item.$changedFields) {
                  if (item.$changedFields.hasOwnProperty(f)) {
                    json[k][f] = item.$changedFields[f];
                  }
                }
              }
            } else {
              if (item[k].dataType && item[k].dataType === 'boolean' && typeof item[k].value === 'string') {
                json[k] = item[k].value === '1' || item[k].value === 'true';
              } else {
                json[k] = item[k].value;
              }
            }
          }
          arr.push(json);
        }
      });
      return arr;
    },
    changeChecked(item) {
      this.checkedSkuIds = [...new Set(item.filter(i => !i._remark).map(i => i.skuId.value))];
    },
    getList(ids) {
      if (!Array.isArray(ids) || !ids.length) {
        this.$message.warning(this.$i.inquiry.noItemSelected);
        return;
      }
      this.$ajax.post(this.$apis.POST_INQUIRY_SKUS, ids)
        .then(res => {
          let arr = this.$getDB(this.sdbo, this.$refs.HM.getFilterData(res, 'skuId'), (item) => {
            this.$filterDic(item);
          });
          this.tabData = arr.concat(this.tabData);
          this.dialogTableVisible = false;
        });
    },
    productInfoBtn(item) { // Product info 按钮创建
      return [{label: this.$i.common.negotiate, type: 'modify'}, {label: this.$i.common.detail, type: 'detail'}];
    },
    fnBasicInfoHistoty(item, type) { // 查看历史记录
      let arr = [];
      _.map(this.tabData, o => {
        if (_.findWhere(o, {'key': 'skuId'}).value.toString() === item.skuId.value.toString() && !o._disabled) arr.push(o);
      });
      if (this.fromArg.quotationNo) {
        this.$ajax.get(this.$apis.GET_INQUIRY_SKU_HISTORY + `?quotationNo=${this.fromArg.quotationNo}&skuCode=${item.skuCode.value}`).then(res => {
          this.$refs.HM.init(arr, this.$getDB(this.sdbo, this.$refs.HM.getFilterData(res, 'skuCode')), type === 'modify');
        });
      } else if (type === 'modify') {
        this.$refs.HM.init(arr, [], true);
      }
    },
    producInfoAction(data, type) { // Produc info 按钮操作
      switch (type) {
        case 'histoty':
          this.fnBasicInfoHistoty(data, type);
          break;
        case 'modify':
          this.oSwitch = true;
          this.fnBasicInfoHistoty(data, type);
          break;
        case 'detail':
          this.$router.push({
            path: '/product/sourcingDetail',
            query: {
              id: data.skuId.value
            }
          });
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .create-inquiry {
    position: relative;

  .hd {
    padding-left: 15px;
    height: 50px;
    line-height: 50px;
    color: #666;
    border-bottom: 1px solid #ccc;
  }

  .content-hd {
    font-size: 14px;
    line-height: 40px;
    padding-left: 20px;
  }

  .status {
    display: flex;
    height: 60px;
    box-sizing: border-box;
    padding-left: 25px;
    padding-right: 25px;
    align-items: center;
    justify-content: space-between;

  .btn-wrap {
    display: flex;
    align-items: center;

  span {
    font-size: 14px;
  }

  }
  .select-wrap {
    display: flex;
    align-items: center;

  .select {
    width: 110px;
    margin-right: 5px;
  }

  .set {
    cursor: pointer;
    padding-left: 18px;
    color: #999;

  i {
    font-size: 25px;
  }

  }
  }
  }
  .bom-btn-wrap {
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9;
    width: 100%;
    padding: 10px 200px 10px;
    box-shadow: 0 -1px 5px #ccc;
  }

  .bom-btn-wrap-station {
    height: 52px;
    width: 100%;
  }

  }
</style>
<style scoped>
  .select-wrap .el-form {
    padding: 10px;
  }

  .select-wrap .el-form-item /deep/ .el-form-item__label {
    display: flex;
    justify-content: flex-end;
    text-align: left;
  }
</style>

