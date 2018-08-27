<template>
  <div class="inquiryDetail">
    <div class="hd">
      <h4 class="title">{{ $i.inquiry.inquiryDetailTitle }} {{ tabData[0] ? tabData[0].inquiryNo.value : '' }}</h4>
    </div>
    <div class="container" :class="{'active':switchStatus}">
      <div class="table-wrap">
        <div class="basic-info">
          <div class="basesic-hd">
            <h5>{{ $i.common.basicInfo }}</h5>
          </div>
          <div class="tab-msg-wrap">
            <v-table
                hide-filter-value
                :height="450"
                :data.sync="newTabData"
                :selection="false"
                :disabledSort="true"
                :buttons="basicInfoBtn"
                :loading="tableLoad"
                :rowspan="2"
                @action="basicInfoAction"
                :hideFilterColumn="statusModify"/>
          </div>
        </div>
        <div class="basic-info">
          <h5>{{ $i.common.productInfo }}</h5>
          <div class="status">
            <div class="btn-wrap">
              <el-button @click="addProduct" :disabled="!statusModify">{{ $i.common.addProduct }}</el-button>
              <el-button type="danger" :disabled="checkedAll && checkedAll.length && statusModify ? false : true" @click="removeProduct()">{{ $i.common.remove }} <span>({{checkedAll.length}})</span></el-button>
            </div>
          </div>
          <!--code="inquiry"-->
          <v-table
              hide-filter-value
              :data.sync="newProductTabData"
              :buttons="productInfoBtn"
              :loading="tableLoad"
              :height="450"
              :totalRow="productTotalRow"
              @action="producInfoAction"
              @change-checked="changeChecked"
              @change-sort="onListSortChange"
              :rowspan="2"
              :hideFilterColumn="statusModify"/>
          <div class="bom-btn-wrap" v-show="!statusModify" v-if="tabData[0]" v-authorize="'INQUIRY:DETAIL:READ_ONLY'">
            <el-button type="primary" @click="ajaxInqueryAction('accept')" :disabled="tabData[0].status.originValue !== 22" v-authorize="'INQUIRY:DETAIL:ACCEPT'">{{ $i.common.accept }}</el-button>
            <el-button @click="addToCompare" v-authorize="'INQUIRY:DETAIL:ADD_COMPARE'">{{ $i.common.addToCompare }}</el-button>
            <el-button @click="$router.push({'path': '/negotiation/createInquiry', query: {'id': $route.query.id, 'from': 'copy'}})" v-authorize="'INQUIRY:DETAIL:COPY'">{{ $i.common.copy }}</el-button>
            <el-button @click="statusModify = true" :disabled="tabData[0].status.originValue !== 22" v-authorize="'INQUIRY:DETAIL:MODIFY'">{{ $i.common.modify }}</el-button>
            <el-button @click="exportDatas" v-authorize="'INQUIRY:DETAIL:DOWNLOAD'">{{ $i.common.download }}</el-button>
            <el-button type="warning" v-authorize="'INQUIRY:DETAIL:CANCEL_INQUIRY'" @click="ajaxInqueryAction('cancel')" :disabled="![21, 22].includes(tabData[0].status.originValue)">{{ $i.common.cancel }}</el-button>
            <el-button type="danger" v-authorize="'INQUIRY:OVERVIEW:DELETE'" @click="ajaxInqueryAction('delete')" :disabled="![1, 99].includes(tabData[0].status.originValue)">{{ $i.common.archive }}</el-button>
          </div>
          <div class="bom-btn-wrap" v-show="statusModify">
            <el-button v-authorize="'INQUIRY:DETAIL:MODIFY'" @click="modify">{{ $i.common.send }}</el-button>
            <el-button type="info" @click="modifyCancel">{{ $i.common.exit }}</el-button>
          </div>
          <div class="bom-btn-wrap-box"></div>
        </div>
      </div>
    </div>
    <v-compare-list :data="compareConfig" @clearData="clerCompare" @closeTag="handleClose" @goCompare="startCompare" v-if="compareLists" />
    <el-dialog
          :title="$i.common.addProduct"
          :visible.sync="newSearchDialogVisible"
          width="70%"
          lock-scroll>
      <el-radio-group v-model="radio" @change="trig = new Date().getTime()">
        <el-radio-button label="product">{{ $i.common.fromNewSearch }}</el-radio-button>
        <el-radio-button label="bookmark">{{ $i.common.FromMyBookmark }}</el-radio-button>
      </el-radio-group>
      <v-product
          :hideBtns="true"
          :hideBtn="true"
          :disabledLine="disabledLine"
          @handleOK="queryAndAddProduction"
          @handleCancel="newSearchDialogVisible = false"
          :forceUpdateNumber="trig"
          :type="radio"
          :isInquiry="true">
      </v-product>
    </el-dialog>
    <v-history-modify :code="idType === 'basicInfo' ? 'inquiry_list' : 'inquiry'" @save="save" @change="computePrice" ref="HM"></v-history-modify>
    <v-message-board v-if="chatParams" v-authorize="'INQUIRY:DETAIL:MESSAGE_BOARD'" module="INQUIRY" code="inquiryDetail" :id="chatParams.bizNo" :arguments="chatParams"></v-message-board>
  </div>
</template>
<script>
/**
 * @param options 下拉框原始数据
 * @param switchStatus 留言板状态
 */
import {
  VMessageBoard,
  selectSearch,
  VTable,
  compareList,
  VHistoryModify
} from '@/components/index';
import { getData } from '@/service/base';
import product from '@/views/product/addProduct';
import { mapActions, mapState } from 'vuex';
import codeUtils from '@/lib/code-utils';
import thisTool from './index';

export default {
  name: 'inquiryDetail',
  data() {
    return {
      disabledLine: [],
      trig: 0,
      id: null,
      compareLists: false,
      tabData: [],
      productTabData: [],
      newTabData: [],
      newProductTabData: [],
      tableLoad: true,
      checkedAll: '',
      historyColumn: {},
      radio: 'product',
      oSwitch: false, // VHistory 组件开关状态
      statusModify: false,
      newSearchDialogVisible: false,
      compareConfig: [],
      switchStatus: false,
      deleteDetailIds: [],
      idType: '',
      params: {
        ps: 200,
        pn: 1,
        operatorFilters: [],
        sorts: []
      },
      chatParams: null,
      custom: null,
      exchangeRates: []
    };
  },
  components: {
    'v-message-board': VMessageBoard,
    'select-search': selectSearch,
    'v-table': VTable,
    'v-product': product,
    'v-compare-list': compareList,
    VHistoryModify
  },
  computed: {
    ...mapState({
      primeList: state => state.dic
    }),
    selectAll() {
      let json = {};
      _.mapObject(this.$db.inquiry.basicInfo, (val, k) => {
        if (val.transForm && val.transForm !== 'time') {
          json[val.transForm] = _.findWhere(this.primeList, {code: val.transForm}) ? _.findWhere(this.primeList, { code: val.transForm }).codes : '';
        }
      });
      return json;
    },
    productTotalRow() {
      let obj = {};
      if (this.newProductTabData.length <= 0) {
        return false;
      }
      let totalUnitKeys = {};
      Object.values(this.$db.inquiry.productInfo).filter(i => i._total && i._total.unitKey).forEach(i => totalUnitKeys[i._total.unitKey] = new Set());

      this.newProductTabData.filter(i => !i._remark).forEach(v => {
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
    const menuLink = thisTool.setMenuLinks(this, ['INQUIRY:OVERVIEW:DRAFT', 'INQUIRY:OVERVIEW:DELETE', 'INQUIRY:LOG']);
    // Object.keys(menuLink).forEach(auth => {
    //   if (this.$auth(auth)) {
    //     this.setMenuLink(menuLink[auth]);
    //   }
    // });

    if (this.$localStore.get('$in_quiryCompare')) {
      this.compareConfig = this.$localStore.get('$in_quiryCompare');
    }
    Promise.all([codeUtils.getInquiryDicCodes(this), codeUtils.getCotegories(this)]).then(res => {
      let data = res[0];
      if (res[1]) {
        data.push(res[1]);
      }
      this.setDic(data);
    }).then(this.getInquiryDetail, this.getInquiryDetail);
  },
  methods: {
    ...mapActions(['setMenuLink', 'setDic']),
    deleteInquiry() {
      this.$confirm(this.$i.common.confirmDeletion, this.$i.common.prompt, {
        confirmButtonText: this.$i.common.confirm,
        cancelButtonText: this.$i.common.cancel,
        type: 'warning'
      }).then(() => {
        this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
          action: 'delete',
          ids: [this.id]
        }).then(() => {
          this.$router.push('/negotiation/inquiry');
        });
      });
    },
    addProduct() {
      this.disabledLine = this.newProductTabData.filter(item => !item._disabled);
      this.trig = new Date().getTime();
      this.newSearchDialogVisible = true;
    },
    startCompare() {
      // 前往比较
      let arr = this.compareConfig.map(i => i.id);
      this.$router.push({
        name: 'negotiationCompareDetail',
        params: {
          type: 'new'
        },
        query: {
          ids: arr.join(',')
        }
      });
    },
    clerCompare() {
      // clear
      this.compareConfig = [];
      this.$localStore.remove('$in_quiryCompare');
    },
    handleClose(item) {
      // 删除
      this.compareConfig.forEach((items, index) => {
        if (items.id === item.id) {
          this.compareConfig.splice(index, 1);
        }
      });
      this.$localStore.set('$in_quiryCompare', this.compareConfig);
    },
    addToCompare() {
      // 添加对比
      this.compareLists = true;
      let config = {
        name: this.tabData[0].inquiryNo.value,
        id: this.tabData[0].id.value
      };

      for (let i = 0; i < this.compareConfig.length; i++) {
        if (this.compareConfig[i].id === config.id) {
          return;
        }
      }
      this.compareConfig.push(config);
      this.$localStore.set('$in_quiryCompare', this.compareConfig);
    },
    markFieldHighlight(items, color) {
      let c = color || 'yellow';
      let remarks = items.filter(i => i._remark);
      let lines = items.filter(i => !i._remark);
      for (let line of lines) {
        let fieldDisplay = line.fieldDisplay.value;
        if (fieldDisplay && typeof fieldDisplay === 'object') {
          Object.keys(fieldDisplay).forEach(k => {
            if (fieldDisplay[k] === '1' && line[k]) {
              line[k]._style = {backgroundColor: c};
            }
          });
        }

        let key = line.hasOwnProperty('skuId') ? 'skuId' : 'id';
        let remark = remarks.find(i => i[key].value.toString() === line[key].value.toString());
        let fieldRemarkDisplay = line.fieldRemarkDisplay.value;
        if (fieldRemarkDisplay && typeof fieldRemarkDisplay === 'object') {
          Object.keys(fieldRemarkDisplay).forEach(k => {
            if (remark && fieldRemarkDisplay[k] === '1' && remark[k]) {
              remark[k]._style = {backgroundColor: c};
            }
          });
        }
      }
    },
    getInquiryDetail() {
      let promise = null;
      if (this.$route.query.id) {
        promise = this.$ajax.get(`${this.$apis.GET_INQIIRY_DETAIL}/{id}`, {id: this.$route.query.id});
      } else if (this.$route.query.code) {
        promise = this.$ajax.get(`${this.$apis.GET_INQIIRY_DETAIL_BY_CODE}?code=${this.$route.query.code}`);
      } else {
        this.$message(this.$i.common.addressError);
        return;
      }
      promise.then(res => {
        this.id = res.id;
        this.chatParams = {
          bizNo: res.quotationNo,
          dataAuthCode: 'BIZ_INQUIRY',
          funcAuthCode: '',
          suppliers: [{
            userId: res.supplierUserId,
            companyId: res.supplierCompanyId,
            tenantId: res.supplierTenantId
          }]
        };
        this.tableLoad = false;
        // this.$ajax.post(this.$apis.GET_CUSTOMER_EXCHANGE_RATE_FEE, {tenantId: res.tenantId, companyId: res.companyId})
        this.$ajax.get(this.$apis.get_customcurrencyexchangerate_query).then(res2 => {
          this.custom = res2.custom;
          this.exchangeRates = res2.exchangeRates;
        });
        // Basic Info
        this.tabData = this.newTabData = this.$getDB(
          this.$db.inquiry.basicInfo,
          this.$refs.HM.getFilterData([res]),
          item => this.$filterDic(item)
        );
        this.markFieldHighlight(this.newTabData);
        this.showDetails(res.details);
      }, () => {
        this.tableLoad = false;
      });
    },
    showDetails(details) {
      let db = this.$db.inquiry.productInfo;
      let keys = new Set();
      details.map(i => i.fieldDisplay).forEach(i => {
        if (i) {
          Object.keys(i).forEach(k => keys.add(k));
        }
      });

      for (let field in db) {
        if (!field) continue;
        let key = db[field].key || field;
        db[field]._mustChecked = keys.has(key);

        let note = db[field]._i_note;
        if (note) {
          db[field]._note = this.$i.inquiry[note];
        }
      }

      this.productTabData = this.newProductTabData = this.$getDB(
        db,
        this.$refs.HM.getFilterData(details, 'skuId'),
        item => this.$filterDic(item)
      );
      this.markFieldHighlight(this.newProductTabData);
    },
    getInquiryDetailList() {
      if(!this.id) return;
      let url = this.$apis.parse(this.$apis.GET_INQIIRY_DETAIL_LIST, {id: this.id});
      this.$ajax.post(url, this.params).then(this.showDetails);
    },
    exportDatas() {
      if (this.id) {
        this.$fetch.export_task('INQUIRY_ORDER', {'draft': 0, 'recycleCustomer': false, 'id': this.id});
      }
    },
    onListSortChange(args) {
      this.params.sorts = args.sorts;
      this.getInquiryDetailList();
    },
    queryAndAddProduction(ids) {
      if (!Array.isArray(ids) || !ids.length) {
        this.$message.warning(this.$i.inquiry.noItemSelected);
        return;
      }
      this.$ajax.post(this.$apis.POST_INQUIRY_SKUS, ids).then(res => {
        let arr = this.$getDB(
          this.$db.inquiry.productInfo,
          this.$refs.HM.getFilterData(res, 'skuId'),
          item => this.$filterDic(item)
        );
        this.newProductTabData = arr.concat(this.newProductTabData);
        this.newSearchDialogVisible = false;
      });
    },
    basicInfoBtn(item) {
      let options = [];
      if (item.id.value) {
        options.push({label: this.$i.common.histoty, type: 'histoty'});
        if (this.statusModify) {
          options.push({label: this.$i.common.modify, type: 'modify'});
        }
      }
      return options;
    },
    productInfoBtn(item) {
      let options = null;
      if (!item._disabled) {
        options = [
          {label: this.$i.common.histoty, type: 'histoty', _disabled: false},
          {label: this.$i.common.detail, type: 'detail', _disabled: false}
        ];
        if (this.statusModify) {
          options.push({label: this.$i.common.modify, type: 'modify'});
        }
      }
      return options;
    },
    beforeSave(data) {
      if (this.idType === 'basicInfo') {
        return true;
      }
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
    save(data) {
      // modify 编辑完成反填数据
      if (this.idType === 'basicInfo') {
        this.newTabData = data;
      } else if (this.idType === 'producInfo') {
        this.newProductTabData = _.map(this.newProductTabData, oldItem => {
          let tmp = _.filter(data, item => _.findWhere(oldItem, {'key': 'skuId'}).value === _.findWhere(item, {'key': 'skuId'}).value && !!oldItem._remark === !!item._remark);
          if (tmp[0] && tmp[0].skuPictures && tmp[0].skuPictures._image) {
            tmp[0].skuPictures.value = tmp[0].skuPictures._value;
          }
          return tmp[0] || oldItem;
        });
      }
    },
    fnBasicInfoHistoty(item, type, config) {
      let inquiries = !item.id.value || config.type === 'modify' ? this.newTabData : this.tabData;
      let inquiryDetails = !item.id.value || config.type === 'modify' ? this.newProductTabData : this.productTabData;
      // 查看历史记录
      let arr;
      if (!item.id.value) {
        if (config.type === 'modify') {
          arr = inquiryDetails.filter(i => i.skuId.value === config.data);
          this.$refs.HM.init(arr, [], true);
        }
        return;
      }
      let historyApi = item.skuId ? this.$apis.GET_INQUIRY_DETAIL_HISTORY : this.$apis.GET_INQUIRY_HISTORY;
      this.$ajax.get(historyApi, {id: item.id.value}).then(res => {
        if (type === 'basicInfo') {
          arr = inquiries.filter(i => i.id.value.toString() === config.data.toString());
          this.markFieldHighlight(arr);
          this.$refs.HM.init(arr, this.$getDB(this.$db.inquiry.basicInfo, this.$refs.HM.getFilterData(res), i => this.$filterDic(i)), config.type === 'modify');
        } else {
          arr = inquiryDetails.filter(i => i.skuId.value.toString() === config.data.toString());
          this.markFieldHighlight(arr);
          this.$refs.HM.init(arr, this.$getDB(this.$db.inquiry.productInfo, this.$refs.HM.getFilterData(res, 'skuId'), i => this.$filterDic(i)), config.type === 'modify');
        }
      });
    },
    basicInfoAction(data, type) {
      if (['histoty', 'modify'].indexOf(type) === -1) {
        return;
      }
      // basic info 按钮操作
      this.idType = 'basicInfo';
      this.historyColumn = this.$db.inquiry.basicInfo;
      this.fnBasicInfoHistoty(data, 'basicInfo', {type, data: data.id.value});
      if (type === 'modify') {
        this.onSwitch = true;
      }
    },
    producInfoAction(data, type) {
      if (type === 'detail') {
        this.$router.push({path: '/product/sourcingDetail', query: {id: data.skuId.value}});
        return;
      }
      if (['histoty', 'modify'].indexOf(type) === -1) {
        return;
      }
      // Produc info 按钮操作
      this.idType = 'producInfo';
      this.historyColumn = this.$db.inquiry.productInfo;
      this.fnBasicInfoHistoty(data, 'productInfo', {type, data: data.skuId.value});
      if (type === 'modify') {
        this.onSwitch = true;
      }
    },
    // 计算指定货币到美元的价格
    toUSDCurrency(price, fromCurrency) {
      if (fromCurrency === 'USD') return price;
      if (isNaN(price) || !Array.isArray(this.exchangeRates) || !this.exchangeRates.length) return null;
      let symbol = fromCurrency + 'USD';
      let rate = this.exchangeRates.filter(i => i.symbol === symbol)[0] || null;
      return rate && rate * price;
    },
    computePrice(col, item) {
      let field = col.key;
      if (item._remark || !this.custom || !['skuExwPrice', 'skuFobPrice', 'skuCifPrice', 'skuOuterCartonQty', 'skuOuterCartonVolume'].includes(field)) {
        return;
      }

      let outerCartonQty = item.skuOuterCartonQty.value; // 外箱产品数量
      let outerCartonVolume = item.skuOuterCartonVolume.value; // 外箱体积
      if (field === 'skuExwPrice' || field === 'skuOuterCartonQty' || field === 'skuOuterCartonVolume') {
        let exwPrice = this.toUSDCurrency(item.skuExwPrice.value, item.skuExwCurrency.value);
        if (codeUtils.isNumber(exwPrice, outerCartonVolume, outerCartonQty)) {
          let fob = (exwPrice + 985 / 68 * outerCartonVolume / outerCartonQty) * 1.05;
          item.skuRefFobPrice.value = Number(fob.toFixed(item.skuRefFobPrice._toFixed || 4));
        }
      }
      if (field === 'skuFobPrice' || field === 'skuOuterCartonQty' || field === 'skuOuterCartonVolume') {
        let oceanFreight = this.custom.oceanFreightUSD40HC; // 海运费
        let insuranceExpenses = this.custom.insuranceExpensesUSD40HC; // 保险费
        let fobPrice = this.toUSDCurrency(item.skuFobPrice.value, item.skuFobCurrency) || item.skuRefFobPrice.value;
        if (codeUtils.isNumber(fobPrice, outerCartonQty, outerCartonVolume, oceanFreight, insuranceExpenses)) {
          let cif = fobPrice + (oceanFreight + insuranceExpenses) / 68 * outerCartonVolume / outerCartonQty;
          item.skuRefCifPrice.value = Number(cif.toFixed(item.skuRefCifPrice._toFixed || 4));
        }
      }
      if (field === 'skuCifPrice' || field === 'skuOuterCartonQty' || field === 'skuOuterCartonVolume') {
        let portWarehouse = this.custom.portWarehousePrice40HC; // 港口到仓库运费
        let cifPrice = this.toUSDCurrency(item.skuCifPrice.value, item.skuCifCurrency.value) || item.skuRefCifPrice;
        if (codeUtils.isNumber(cifPrice, outerCartonQty, outerCartonVolume, portWarehouse)) {
          let ddu = cifPrice + portWarehouse / 68 * outerCartonVolume / outerCartonQty;
          item.skuRefDduPrice.value = Number(ddu.toFixed(item.skuRefDduPrice._toFixed || 4));
        }
      }
    },
    // 获取选中的单 集合
    changeChecked(item) {
      this.checkedAll = item.filter(i => !i._remark);
    },
    // 创建单
    toCreateInquire() {
      this.$router.push('/negotiation/createInquiry');
    },
    // 接受单
    ajaxInqueryAction(type) {
      if (this.id) {
        this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {action: type, ids: [this.id]}).then(() => {
          this.$router.push('/negotiation/inquiry');
        });
      }
    },
    // 删除product 某个单
    removeProduct() {
      this.newProductTabData = this.newProductTabData.filter(item => this.checkedAll.map(i => i.skuId.value.toString()).indexOf(item.skuId.value.toString()) === -1);
      this.deleteDetailIds = this.deleteDetailIds.concat(this.checkedAll.filter(item => item.id.value).map(item => item.id.value));
      this.checkedAll = [];
    },
    modifyCancel() {
      // 页面编辑取消
      this.newTabData = this.tabData;
      this.newProductTabData = this.productTabData;
      this.$set(this.newProductTabData, 'length', this.productTabData.length);
      this.deleteDetailIds = [];
      this.statusModify = false;
    },
    modify() {
      // 页面编辑提交
      let parentNode = this.dataFilter(this.newTabData)[0];
      let arr = this.newProductTabData.filter(i => !i._disabled);
      parentNode.details = this.dataFilter(arr);
      parentNode.draft = 0;
      let saveData = this.$filterModify(parentNode);
      saveData.attachment = null;
      saveData.skuQty = 0;
      saveData.details.filter(i => !isNaN(i.qty)).forEach(i => {
        saveData.skuQty += Number(i.qty);
      });
      saveData.deleteDetailIds = this.deleteDetailIds;
      this.$ajax.post(this.$apis.POST_INQUIRY_SAVE, saveData).then(res => {
        this.newTabData[0].status.originValue = res.status;
        this.statusModify = false;
        this.getInquiryDetail();
      });
    },
    getRemarkObject(remark) {
      let o = {};
      Object.keys(remark).forEach(field => {
        if (!(/^[_$]/).test(field) && remark[field].value) {
          o[field] = remark[field].value;
        }
      });
      return o;
    },
    getChangeFields(item) {
      let excludeFields = ['fieldDisplay', 'fieldRemark', 'fieldRemarkDisplay', 'status', 'entryDt', 'updateDt'];
      let changedFields = {};
      Object.keys(item).forEach(key => {
        if (excludeFields.indexOf(key) > -1) {
          return;
        }
        if (item[key]._isModified === true) {
          changedFields[key] = '1';
        }
      });
      return changedFields;
    },
    dataFilter(data) {
      let excludeColumns = 'fieldDisplay,fieldRemarkDisplay,entryDt,updateDt,status';
      let datas = data.filter(item => !item._remark);
      let remarks = data.filter(item => item._remark);

      let list = [];
      for (let item of datas) {
        let o = {};
        let key = item.hasOwnProperty('skuId') ? 'skuId' : 'id';
        let remark = remarks.find(i => i[key].value.toString() === item[key].value.toString());
        o.fieldDisplay = this.getChangeFields(item);
        if (remark) {
          o.fieldRemark = this.getRemarkObject(remark);
          o.fieldRemarkDisplay = this.getChangeFields(remark);
        }
        Object.keys(item).forEach(field => {
          let val = item[field];
          if (excludeColumns.indexOf(field) > -1) {
            return;
          }
          o[field] = val.value;
        });
        list.push(o);
      }
      return list;
    }
  }
};
</script>
<style scoped>
.inquiryDetail >>> .el-checkbox-group .el-checkbox__label {
  font-size: 12px;
}
</style>

<style lang="less" scoped>
.inquiryDetail {
  .hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #999;
    padding-right: 50px;
    .title {
      padding-left: 15px;
      color: #666;
      font-size: 18px;
    }
  }
  .container {
    display: flex;
    .table-wrap {
      width: 100%;
      .basic-info {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        .tab-msg-wrap {
          padding-right: 25px;
        }
        .basesic-hd {
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          height: 50px;
          align-items: center;
          padding-right: 30px;
          padding-left: 15px;
          box-sizing: border-box;
          h5 {
            font-size: 14px;
          }
        }
        .status {
          display: flex;
          height: 60px;
          box-sizing: border-box;
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
          padding-top: 20px;
          padding-left: 190px;
          position: fixed;
          left: 0;
          bottom: 0;
          background: #fff;
          z-index: 99;
          width: 100%;
          box-shadow: 0 -1px 5px #ccc;
          button {
            margin-bottom: 10px;
          }
        }
        .bom-btn-wrap-box {
          width: 100%;
          height: 62px;
        }
      }
    }
    .message-board-wrap {
      position: relative;
      width: 300px;
      height: 100%;
      margin-top: 1px;
      background: #fff;
      z-index: 11;
      .con {
        width: 100%;
        overflow: hidden;
      }
      .switch-btn {
        width: 30px;
        position: absolute;
        left: -30px;
        top: 0;
        writing-mode: tb-rl;
        transform: rotate(180deg);
        cursor: pointer;
        background: #f2f2f2;
        line-height: 30px;
        height: 240px;
        text-align: right;
        font-size: 12px;
        color: #333;
        font-weight: bold;
        padding-bottom: 10px;
        border-radius: 0 5px 0 0;
        z-index: 11;
        i {
          transition: all 0.5s ease;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          font-weight: bold;
          color: #c0c0c0;
        }
      }
    }
  }
}
@media screen and (max-width: 1023px) {
  .inquiryDetail .container .table-wrap {
    width: 100%;
  }
  .inquiryDetail .container .message-board-wrap {
    position: fixed;
    right: 0;
    top: 100px;
    z-index: 999;
    width: 0;
    &.active {
      width: 300px;
    }
  }
}
</style>
