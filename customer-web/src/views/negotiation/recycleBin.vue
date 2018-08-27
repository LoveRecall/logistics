<template>
    <div class="compare-overview">
        <h3 class="hd">{{ title }}</h3>
        <div class="status">
            <div class="btn-wrap"  v-authorize="$route.params.type === 'inquiry' ? 'INQUIRY:ARCHIVE:READ_ONLY' : 'INQUIRY:COMPARE_ARCHIVE:READ_ONLY'">
                <el-button type="primary" v-authorize="$route.params.type === 'inquiry' ? 'INQUIRY:ARCHIVE:RECOVER' : 'INQUIRY:COMPARE_ARCHIVE:RECOVER'" @click="submit" :disabled="checkedArg.length <= 0">{{ `${$i.common.recover}(${checkedArg.length})` }}</el-button>
                 <el-button type="primary" v-authorize="'INQUIRY:ARCHIVE:DOWNLOAD'">{{ `${$i.common.download}(${checkedArg.length ? checkedArg.length : 'all'})`}}</el-button>
            </div>
            <select-search :options="options" @inputEnter="searchEnter" />
        </div>
        <v-table
            :code="$route.params.type === 'inquiry' ? 'inquiry_list' : null"
            :data="tabData"
            :loading="tabLoad"
            @change-sort="onListSortChange"
            @change-checked="changeChecked"
            :height="350"
            :page-total="pageTotal"
        />
    </div>
</template>
<script>
import { VTable, selectSearch } from '@/components/index';
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
      options: [],
      params: {
        operatorFilters: [],
        ps: 50,
        pn: 1
      },
      tabLoad: false
    };
  },
  components: {
    'select-search': selectSearch,
    'v-table': VTable
  },
  created() {
    let type = this.$route.params.type;
    if (type !== 'compare' && type !== 'inquiry') {
      this.$router.push({name: 'negotiationInquiry'});
      return;
    }
    switch (type) {
      case 'inquiry':
        this.options = [{
          id: 'supplierName',
          label: this.$i.inquiry.supplierName,
          operator: 'like'
        }, {
          id: 'inquiryNo',
          label: this.$i.inquiry.InquiryNo,
          operator: 'like'
        }, {
          id: 'quotationNo',
          label: this.$i.inquiry.quotationNo,
          operator: 'like'
        }];
        this.title = this.$i.common.inquiryRecycleBin;
        this.params.recycleCustomer = 1;
        break;
      case 'compare':
        this.options = [{
          id: 'compareName',
          label: this.$i.inquiry.compareName,
          operator: 'like'
        }, {
          id: 'quotationNoLike',
          label: this.$i.inquiry.compareItems
        }];
        this.title = this.$i.common.archive;
        this.params.recycle = 1;
        // recycleSupplier
        break;
    }
    thisTool.setMenuLinks(this, ['INQUIRY:LOG']);

    this.$ajax.post(this.$apis.POST_CODE_PART, ['INQUIRY_STATUS', 'CY_UNIT', 'ITM'], 'cache')
      .then(data => this.setDic(codeUtils.convertDicValueType(data)))
      .then(this.getList);
  },
  methods: {
    ...mapActions(['setMenuLink', 'setDic']),
    getInquiryList() { // 获取inquirylist
      this.$ajax.post(this.$apis.POST_INQIIRY_LIST, this.params).then(res => {
        this.pageTotal = res.tc;
        this.tabData = this.$getDB(this.$db.inquiry.viewByInqury, res.datas, (item) => {
          this.$filterDic(item);
        });
        this.tabLoad = false;
        this.searchLoad = false;
      }, () => {
        this.searchLoad = false;
        this.tabLoad = false;
      });
    },
    getCompare() { // 获取compare
      this.$ajax.post(this.$apis.POST_INQIIRY_COMPARE_LIST, this.params).then(res => {
        let data = res.datas;
        this.tabLoad = false;
        data.forEach(item => {
          item.updateDt = item.updateDt ? this.$dateFormat(item.updateDt, 'yyyy-mm-dd') : '';
        });
        this.pageTotal = res.tc;
        this.tabData = this.$getDB(this.$db.inquiry.compare, data);
      });
    },
    searchEnter(option, operatorFilters) { // 搜索框
      if (option.id === 'quotationNoLike' && option.value) {
        this.params.quotationNoLike = option.value;
      } else {
        this.params.quotationNoLike = null;
        this.params.operatorFilters = operatorFilters;
      }
      this.getList();
    },
    action(item, type) { // 操作表单 action
      switch (this.$route.params.type) {
        case 'compare':
          this.$router.push({
            name: 'negotiationCompareDetail',
            query: {
              id: item.id.value
            },
            params: {
              type: 'only'
            }
          });
          break;
        case 'inquiry':
          this.$router.push({
            path: '/negotiation/inquiryDetail',
            query: {
              id: item.id.value
            }
          });
          break;
      }
    },
    changeChecked(item) { // 选中的list
      let arr = [];
      item.forEach(item => {
        arr.push(item.id.value);
      });
      this.checkedArg = arr;
    },
    onListSortChange(args) {
      this.params.sorts = args.sorts;
      this.getList();
    },
    getList() {
      switch (this.$route.params.type) {
        case 'inquiry':
          this.getInquiryList();
          break;
        case 'compare':
          this.getCompare();
          break;
      }
    },
    actionInquiry(type) {
      this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
        ids: this.checkedArg,
        action: type
      }).then(res => {
        this.tabData.forEach((item, index) => {
          res.forEach(key => {
            if (item.id.value === key) {
              this.tabData.splice(index, 1);
            }
          });
        });
        this.checkedArg = [];
      });
    },
    actionCompare() {
      this.$ajax.post(this.$apis.POST_INQUIRY_COMPARE_RESTORE, this.checkedArg)
        .then(res => {
          this.checkedArg = [];
          this.getCompare();
        });
    },
    submit() { // 删除恢复
      switch (this.$route.params.type) {
        case 'inquiry':
          this.actionInquiry('revert');
          break;
        case 'compare':
          this.actionCompare('revert');
          break;
      }
    },
    ajaxInqueryAction(type) {
      const argId = this.getChildrenId();
      this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
        action: type,
        ids: argId
      }).then(res => {
        this.getInquiryList();
        this.checkedData = [];
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
    }
</style>
