<template>
    <div class="compare-overview">
        <h3 class="hd">{{ $i.common.compare }}</h3>
        <div>
            <el-form :inline="true" class="demo-form-inline" style="padding:0 0 0 20px;">
                <el-form-item label="Compare Name">
                    <el-input v-model="compareInfo.compareName" size="mini" :disabled="compareType  === 'only'"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="fn">
            <div class="box-l">
                <el-button @click="addNewCopare" v-if="compareType  !== 'only'" v-authorize="'INQUIRY:COMPARE_DETAIL:ADD_NEW'">{{ $i.common.addNew }}</el-button>
                <el-button type="danger" v-if="compareType  !== 'only'" @click="deleteCompareItem" :disabled="delBtnDisabled" v-authorize="'INQUIRY:COMPARE_DETAIL:DELETE'">{{ `${$i.common.archive}(${checkedInquiryIds.length})` }}</el-button>
                <div style="margin-left: 20px;">
                  <el-checkbox v-model="hideSame" @change="renderTabdata" size="mini">{{ $i.common.hideTheSame }}</el-checkbox>
                  <el-checkbox v-model="highLight" @change="renderTabdata" size="mini">{{ $i.common.highlightTheDifferent }}</el-checkbox>
                </div>
            </div>
            <div>
                <span>{{ $i.common.compareBy }}&nbsp;</span>
                <el-radio-group v-model="compareBy" @change="compareByChange" size="mini">
                    <el-radio-button :label="0">{{$i.common.inquiry}}</el-radio-button>
                    <el-radio-button :label="1" >{{$i.common.SKU}}</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <v-table
            :code="compareBy === 0 ? 'inquiry_list' : 'inquiry'"
            :height="455"
            :data="tabData"
            :loading="tabLoad"
            @change-sort="onListSortChange"
            @change-checked="changeChecked"
            :buttons="[{label: 'detail', type: 'detail'}]"
            @action="action"/>
        <v-pagination
            :pageNum.sync="params.pn"
            :pageSize.sync="params.ps"
            :page-total.sync="pageTotal"
            :pageData="params"
            @page-change="handleSizeChange"
            @page-size-change="pageSizeChange"
            :page-sizes="[100,200,]"/>
      <div v-authorize="'INQUIRY:COMPARE_DETAIL:READ_ONLY'">
        <el-button style="margin-top:10px;" type="primary" @click="onSubmit" v-show="compareType === 'new'" v-authorize="'INQUIRY:COMPARE_DETAIL:SAVE'">{{ $i.common.saveTheCompare }}</el-button>
        <el-button type="primary" @click="showModify" v-show="compareType === 'only'" v-authorize="'INQUIRY:COMPARE_DETAIL:MODIFY'">{{ $i.common.modify }}</el-button>
        <el-button style="margin-top:10px;" type="danger" @click="deleteCompare" v-show="compareType === 'only'" v-authorize="'INQUIRY:COMPARE_DETAIL:DELETE'">{{ $i.common.archive }}</el-button>
        <el-button style="margin-top:10px;" type="primary" @click="onSubmit" v-show="compareType === 'modify'" v-authorize="'INQUIRY:COMPARE_DETAIL:SAVE'">{{ $i.common.save }}</el-button>
        <el-button style="margin-top:10px;" type="info" @click="cancel" v-show="compareType === 'modify'">{{ $i.common.cancel }}</el-button>
        <el-button v-authorize="'INQUIRY:COMPARE_DETAIL:DOWNLOAD'" v-if="$route.query.id" @click="exportDatas">{{ $i.common.download }}</el-button>
      </div>
        <add-new-inqury
            v-model="showAddListDialog"
            @addInquiry="addCopare"
            :arg-disabled="argDisabled"
            :compareId="compareInfo.id || null"
            :title="addNewTitle"
            :disableds="disableds"/>
    </div>
</template>
<script>
import { VTable, dropDownSingle, addNewInqury, VPagination } from '@/components/index';
import { mapActions } from 'vuex';
import codeUtils from '@/lib/code-utils';
import thisTool from './index';

export default {
  name: 'compareOverview',
  data() {
    return {
      addNewTitle: null,
      dirCodes: ['INQUIRY_STATUS', 'CY_UNIT', 'ITM'],
      addInquiryIds: null,
      pageTotal: 0,
      showAddListDialog: false,
      compareInfo: {},
      tabLoad: false,
      tabData: [],
      bakData: [],
      compareBy: 0,
      hideSame: false,
      highLight: true,
      checkedInquiryIds: [],
      compareType: '',
      params: {
        ps: 100,
        pn: 1,
        recycleCustomer: 0
      },
      argDisabled: [],
      disableds: []
    };
  },
  components: {
    'v-table': VTable,
    'add-new-inqury': addNewInqury,
    'v-pagination': VPagination,
    dropDownSingle
  },
  computed: {
    delBtnDisabled() {
      let ids = new Set(this.bakData.map(i => (i.inquiryId || i.id).originValue)).size;
      return this.checkedInquiryIds.length < 1 || ids - this.checkedInquiryIds.length < 2;
    },
    idKey() {
      return [this.compareBy ? 'inquiryId' : 'id'];
    }
  },
  created() {
    if (this.$route.query.ids) {
      this.addInquiryIds = this.$route.query.ids.split(',');
      this.argDisabled = [...this.addInquiryIds];
    } else if (this.$route.query.id) {
      this.compareInfo.id = this.$route.query.id;
    }
    this.compareType = this.$route.params.type ? this.$route.params.type : '';
    this.getDirData().then(this.getData, this.getData);

    thisTool.setMenuLinks(this, ['INQUIRY:COMPARE_OVERVIEW:DELETE', 'INQUIRY:LOG']);
  },
  methods: {
    ...mapActions(['setMenuLink', 'setDic']),
    getData() {
      let column = this.compareBy === 0 ? this.$db.inquiry.viewByInqury : this.$db.inquiry.viewBySKU;
      this.getListByIds().then(this.getCompareList).then(datas => {
        if (!datas) return;
        this.bakData = this.$getDB(column, datas, item => this.$filterDic(item));
        this.renderTabdata();
        this.tabLoad = false;
      }, () => {
        this.tabLoad = false;
      });
    },
    exportDatas() {
      if (!this.$route.query.id) return;
      let params = {
        ps: 100,
        pn: 1,
        recycleCustomer: 0,
        ids: [this.$route.query.id]
      };
      this.$fetch.export_task('INQUIRY_COMPARE', params);
    },
    showModify() {
      this.compareType = 'modify';
      this.compareInfo._compareName = this.compareInfo.compareName;
    },
    cancel() {
      this.compareInfo.compareName = this.compareInfo._compareName;
      delete this.compareInfo._compareName;

      this.bakData = this.bakData.filter(i => !i._new);
      this.bakData.forEach(i => {
        if (i._delete) delete i._delete;
      });
      this.renderTabdata();

      if (Array.isArray(this.argDisabled)) {
        this.argDisabled = [];
      }
      this.disableds = [];
      this.compareType = 'only';
    },
    onSubmit() { // 保存Compare
      this.$confirm(this.$i.common.thisOperationKeepsAllOperationsContinuing, this.$i.common.prompt, {
        confirmButtonText: this.$i.common.confirm,
        cancelButtonText: this.$i.common.cancel,
        type: 'warning'
      }).then(() => {
        if (!this.compareInfo.compareName) {
          this.compareInfo.compareName = new Date().getTime();
        }
        this.$ajax.post(this.$apis.POST_INQUIRY_COMPARE_RS, {
          addInquiryIds: this.argDisabled,
          delInquiryIds: this.disableds,
          id: this.$route.query.id,
          compareName: this.compareInfo.compareName
        }).then(res => {
          this.argDisabled = [];
          this.disableds = [];
          if (this.$route.params.type === 'only') {
            this.getData();
            this.compareType = 'only';
            return;
          }
          this.$router.push({
            name: 'negotiationCompareDetail',
            params: {
              type: 'only'
            },
            query: {id: res.id}
          });
        });
      });
    },
    action(item, type) {
      switch (type) {
        case 'detail':
          this.$router.push({
            path: '/negotiation/inquiryDetail',
            query: {id: item[this.idKey].value}
          });
          break;
      }
    },
    getDirData() {
      return this.$ajax.post(this.$apis.POST_CODE_PART, this.dirCodes, 'cache').then(res => this.setDic(codeUtils.convertDicValueType(res)));
    },
    renderTabdata() {
      let data = JSON.parse(JSON.stringify(this.bakData.filter(i => !i._delete)));
      if (this.hideSame) {
        data = this.$table.setHideSame(data);
      }
      if (this.highLight) {
        data = this.$table.setHighlight(data);
      }
      this.tabData = data;
    },
    getCompareList(datas) {
      if (this.compareInfo.id) {
        this.params.id = this.compareInfo.id;
        let url = this.compareBy === 0 ? this.$apis.POST_INQUIRY_COMPARE : this.$apis.POST_INQUIRY_COMPARE_SKU;
        return this.$ajax.post(url, this.params).then(res => {
          this.pageTotal = res.tc;
          if (res.appendant) {
            this.compareInfo = res.appendant;
          }
          this.tabLoad = false;
          return datas ? res.datas.concat(datas) : res.datas;
        }, () => {
          this.searchLoad = false;
          this.tabLoad = false;
        });
      } else {
        return Promise.resolve(datas);
      }
    },
    getListByIds() {
      this.params.ids = [...this.argDisabled];
      if (this.addInquiryIds) {
        this.params.ids = this.params.ids.concat(this.addInquiryIds);
      }
      if (this.params.ids.length > 0) {
        this.params.id = null;
        let url = this.compareBy === 0 ? this.$apis.POST_INQIIRY_LIST : this.$apis.POST_INQIIRY_LIST_SKU;
        this.tabLoad = true;
        return this.$ajax.post(url, this.params).then(res => {
          this.pageTotal = res.tc;
          this.tabLoad = false;
          this.searchLoad = false;
          return res.datas;
        }, () => {
          this.searchLoad = false;
          this.tabLoad = false;
        });
      } else {
        return Promise.resolve();
      }
    },
    onListSortChange(args) {
      this.params.sorts = args.sorts;
      this.getData();
    },
    compareByChange() {
      this.params.sorts = null;
      this.disableds = [];
      if (!this.addInquiryIds) {
        this.argDisabled = [];
      }
      this.checkedInquiryIds = [];
      this.getData();
    },
    changeChecked(item) {
      this.checkedInquiryIds = [...new Set(item.map(i => i[this.idKey]).map(i => i.originValue))];
    },
    addNewCopare() {
      this.addNewTitle = this.$i.inquiry.addNewTitle;
      this.showAddListDialog = true;
    },
    deleteCompareItem() {
      this.disableds = this.disableds.concat(this.checkedInquiryIds);
      this.argDisabled = this.argDisabled.filter(i => this.disableds.indexOf(i) < 0);
      this.bakData.forEach(i => {
        if (this.checkedInquiryIds.includes(i[this.idKey].originValue)) {
          i._delete = true;
        }
      });
      this.renderTabdata();
      this.checkedInquiryIds = [];
    },
    deleteCompare() { // 删除
      this.$confirm(this.$i.common.confirmDeletion, this.$i.common.prompt, {
        confirmButtonText: this.$i.common.confirm,
        cancelButtonText: this.$i.common.cancel,
        type: 'warning'
      }).then(() => {
        this.$ajax.post(this.$apis.POST_INQUIRY_COMPARE_DELETE, [this.$route.query.id]).then(res => {
          this.$router.push('/negotiation/compare');
        });
      });
    },
    addCopare(arg) { // add new compare
      if (!arg.length) {
        this.$message(this.$i.common.pleaseChooseGoods);
        return;
      }
      let url, column;
      if (this.compareBy === 0) {
        url = this.$apis.POST_INQIIRY_LIST;
        column = this.$db.inquiry.viewByInqury;
      } else {
        url = this.$apis.POST_INQIIRY_LIST_SKU;
        column = this.$db.inquiry.viewBySKU;
      }
      this.$ajax.post(url, {recycleCustomer: 0, ps: 100, ids: arg}).then(res => {
        this.argDisabled = this.argDisabled.concat(arg);
        this.disableds = this.disableds.filter(i => this.argDisabled.indexOf(i) < 0);

        let datas = this.$getDB(column, res.datas, item => {
          this.$filterDic(item);
          item._new = true;
        });
        this.bakData = datas.concat(this.bakData);
        this.renderTabdata();
        this.showAddListDialog = false;
      });
    },
    handleSizeChange(val) {
      this.params.pn = val;
      this.getData();
    },
    pageSizeChange(val) {
      this.params.pn = 1;
      this.params.ps = val;
      this.getData();
    }
  }
};
</script>
<style lang="less" scoped>
    .compare-overview {
        .hd {
            height:50px;
            line-height:50px;
            color:#666;
            padding:0 20px;
        }
        .fn {
            display:flex;
            flex-wrap:wrap;
            align-items: center;
            justify-content:space-between;
            padding:0 20px;
            .box-l {
                display:flex;
                align-items: center;
                margin:10px 0;
            }
            span {
                font-size:12px;
                color:#999;
            }
            .filedSelect {
                margin-left:10px;
            }
        }
    }
</style>
