<template>
    <div class="compare-overview">
        <h3 class="hd">{{ title }}</h3>
        <div class="status">
            <div class="btn-wrap" v-authorize="'INQUIRY:DRAFT_OVERVIEW:READ_ONLY'">
                <el-button type="primary" v-authorize="'INQUIRY:DRAFT_OVERVIEW:SEND'" @click="submit" :disabled="checkedArg.length <= 0">{{ `${$i.common.submit}(${checkedArg.length})` }}</el-button>
                <el-button type="danger" v-authorize="'INQUIRY:DRAFT_OVERVIEW:ARCHIVE'" @click="deleteList" :disabled="checkedArg.length <= 0">{{ `${$i.common.archive}(${checkedArg.length})`}}</el-button>
            </div>
            <select-search :options="options" @inputEnter="searchEnter" />
        </div>
        <div class="fn">
            <div class="btn-wrap">

            </div>
            <div class="viewBy">
                <span>{{ $i.common.viewBy }}&nbsp;</span>
                <el-radio-group v-model="postParams.viewType" @change="viewByChange"  size="mini">
                    <el-radio-button :label="0">{{$i.common.inquiry}}</el-radio-button>
                    <el-radio-button :label="1" >{{$i.common.SKU}}</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <v-table
            :code="postParams.viewType === 0 ? 'inquiry_list' : 'inquiry_sku_list'"
            :data="tabData"
            :loading="tabLoad"
            :buttons="[{label: 'Detail', type: 'detail'}]"
            @action="action"
            @change-sort="onListSortChange"
            @change-checked="changeChecked"
            :height="450"
            :page-total="pageTotal"/>
        <v-pagination
            :page-data.sync="postParams"
            @change="handleSizeChange"
            @size-change="pageSizeChange"/>
    </div>
</template>
<script>
import { VTable, selectSearch, VPagination } from '@/components/index';
import { mapActions } from 'vuex';
import codeUtils from '@/lib/code-utils';
import thisTool from './index';

export default {
  name: '',
  data() {
    return {
      title: '',
      pageTotal: 0,
      checkedArg: [],
      tabData: [],
      options: [{
        id: 'inquiryNo',
        label: this.$i.inquiry.InquiryNo,
        operator: 'like'
      }, {
        id: 'supplierName',
        label: this.$i.inquiry.supplierName,
        operator: 'like'
      }],
      postParams: {
        ps: 50,
        pn: 1,
        tc: 0,
        viewType: 0,
        operatorFilters: []
      },
      tabLoad: false
    };
  },
  components: {
    'select-search': selectSearch,
    'v-table': VTable,
    'v-pagination': VPagination
  },
  created() {
    let type = this.$route.params.type;
    if (type !== 'compare' && type !== 'inquiry') {
      this.$router.push({name: 'negotiationInquiry'});
      return;
    }
    thisTool.setMenuLinks(this, ['INQUIRY:OVERVIEW:DELETE', 'INQUIRY:LOG']);

    switch (this.$route.params.type) {
      case 'inquiry':
        this.title = this.$i.common.inquiryDraft;
        break;
    }
    this.$ajax.post(this.$apis.POST_CODE_PART, ['INQUIRY_STATUS', 'CY_UNIT', 'ITM'], 'cache').then(data => {
      this.setDic(codeUtils.convertDicValueType(data));
      this.getList();
    });
  },
  methods: {
    ...mapActions(['setMenuLink', 'setDic']),
    handleSizeChange(val) {
      this.postParams.pn = val;
      this.getList();
    },
    pageSizeChange(val) {
      this.postParams.pn = 1;
      this.postParams.ps = val;
      this.getList();
    },
    getInquiryList() { // 获取inquirylist
      let url = this.$apis.POST_INQIIRY_DRAFT, column;
      this.tabLoad = true;
      if (this.postParams.viewType === 0) {
        column = this.$db.inquiry.viewByInqury;
      } else {
        column = this.$db.inquiry.overviewBySKU;
        column.price.key = 'skuPrice';
      }
      column.supplierName._sort = false;
      this.$ajax.post(url, this.postParams).then(res => {
        this.postParams.tc = res.tc;
        this.tabData = this.$getDB(column, res.datas, item => this.$filterDic(item));
        this.tabLoad = false;
        this.searchLoad = false;
        this.checkedArg = [];
      });
    },
    onListSortChange(args) {
      if (args.sorts.map(s => s.orderBy).includes('supplierName')) {
        return;
      }
      this.postParams.sorts = args.sorts;
      this.getList();
    },
    viewByChange() {
      this.postParams.sorts = null;
      this.getList();
    },
    searchEnter(val, operatorFilters) { // 搜索框
      this.postParams.operatorFilters = operatorFilters;
      this.searchLoad = true;
      this.getList();
    },
    action(item, type) { // 操作表单 action
      this.$router.push({
        name: 'negotiationCreateInquiry',
        query: {
          id: item.id.value
        }
      });
    },
    changeChecked(item) { // 选中的list
      this.checkedArg = [...new Set(item.map(i => i.id.value))];
    },
    getList() {
      switch (this.$route.params.type) {
        case 'inquiry':
          this.getInquiryList();
          break;
      }
    },
    actionInquiry(type) {
      this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
        ids: this.checkedArg,
        action: type
      }).then(res => {
        this.getInquiryList();
        this.checkedArg = [];
      });
    },
    submit() { // 提交草稿
      switch (this.$route.params.type) {
        case 'inquiry':
          this.actionInquiry('submit');
          break;
      }
    },
    ajaxInqueryAction(type) {
      const argId = this.getChildrenId();
      this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
        action: type,
        ids: argId
      })
        .then(res => {
          this.getInquiryList();
          this.checkedArg = [];
        });
    },
    deleteList() { // 删除
      this.$confirm(this.$i.common.confirmDeletion, this.$i.common.prompt, {
        confirmButtonText: this.$i.common.confirm,
        cancelButtonText: this.$i.common.cancel,
        type: 'warning'
      }).then(() => {
        switch (this.$route.params.type) {
          case 'inquiry':
            this.actionInquiry('delete');
            break;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.compare-overview{
  .hd {
    padding-left:15px;
    height: 50px;
    line-height:50px;
    color:#666;
  }
  .status {
    display:flex;
    height: 60px;
    box-sizing: border-box;
    padding-left:25px;
    padding-right:25px;
    align-items: center;
    justify-content:space-between;
    .btn-wrap {
      display:flex;
      align-items: center;
      span {
        font-size:14px;
      }
    }
  }
  .fn {
    display:flex;
    justify-content:space-between;
    padding:10px 15px;
    box-sizing: border-box;
    .viewBy {
      display:flex;
      align-items: center;
      span {
        font-size:14px;
        color:#666;
      }
      button {
        cursor: pointer;
        padding:2px 5px;
      }
      .set {
        cursor: pointer;
        padding-left:18px;
        color:#999;
        i {
            font-size:25px;
        }
      }
    }
  }
}
</style>
