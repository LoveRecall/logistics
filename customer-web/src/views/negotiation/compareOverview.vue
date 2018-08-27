<template>
    <div class="compare-overview">
        <h3 class="hd">{{ $i.common.compareOverview }}</h3>
        <div class="status">
            <div class="btn-wrap" v-authorize="'INQUIRY:COMPARE_OVERVIEW:READ_ONLY'">
                <el-button v-authorize="'INQUIRY:COMPARE_OVERVIEW:DOWNLOAD'" @click="exportDatas" :disabled="tabData.length<=0">{{ `${$i.common.download}(${checkedIds.length>0?checkedIds.length:'all'})` }}</el-button>
                <el-button type="danger" @click="compareDelete" :disabled="checkedIds.length <= 0" v-authorize="'INQUIRY:COMPARE_OVERVIEW:DELETE'">{{ `${$i.common.archive}(${checkedIds.length})`}}</el-button>
            </div>
            <select-search :options="options" @inputEnter="inputEnter"/>
        </div>
        <v-table
            code="inquiry_compare_list"
            hide-filter-value
            :data="tabData"
            :loading="tabLoad"
            :buttons="actionBtns"
            @action="action"
            @change-sort="onListSortChange"
            @change-checked="changeChecked"
            :height="455"/>
        <v-pagination
            :page-data.sync="bodyData"
            @change="handleSizeChange"
            @size-change="pageSizeChange"
            :page-sizes="[50, 100, 200]"/>
    </div>
</template>
<script>
import { VTable, selectSearch, VPagination } from '@/components/index';
import { mapActions } from 'vuex';
import thisTool from './index';

export default {
  name: '',
  data() {
    return {
      pageTotal: 0,
      checkedIds: [],
      tabData: [],
      options: [{
        id: 'compareName',
        label: this.$i.inquiry.compareName,
        operator: 'like'
      }, {
        id: 'quotationNoLike',
        label: this.$i.inquiry.compareItems
      }],
      bodyData: {
        ps: 50,
        pn: 1,
        tc: 0,
        recycle: 0,
        operatorFilters: []
      },
      tabLoad: false,
      actionBtns: []
    };
  },
  components: {
    'select-search': selectSearch,
    'v-table': VTable,
    'v-pagination': VPagination
  },
  created() {
    thisTool.setMenuLinks(this, ['INQUIRY:COMPARE_ARCHIVE', 'INQUIRY:LOG']);

    if (this.$auth('INQUIRY:COMPARE_OVERVIEW:MODIFY')) {
      this.actionBtns.push({label: this.$i.common.modify, type: 'modify'});
    }
    if (this.$auth('INQUIRY:COMPARE_DETAIL')) {
      this.actionBtns.push({label: this.$i.common.detail, type: 'detail'});
    }
    this.getList();
  },
  methods: {
    ...mapActions(['setMenuLink']),
    getList() { // 获取Compare 列表
      this.tabLoad = true;
      this.$ajax.post(this.$apis.POST_INQIIRY_COMPARE_LIST, this.bodyData)
        .then(res => {
          let data = res.datas;
          this.tabLoad = false;
          data.forEach(item => {
            item.updateDt = item.updateDt ? this.$dateFormat(item.updateDt, 'yyyy-mm-dd') : '';
          });
          this.bodyData.tc = res.tc;
          this.tabData = this.$getDB(this.$db.inquiry.compare, data);
        }, () => {
          this.tabLoad = false;
        });
    },
    onListSortChange(args) {
      this.bodyData.sorts = args.sorts;
      this.getList();
    },
    action(item, type) { // 操作表单 action
      let types = '';
      if (type === 'detail') {
        types = 'only';
      } else {
        types = 'modify';
      }
      this.$router.push({
        name: 'negotiationCompareDetail',
        params: {
          type: types
        },
        query: {
          id: _.findWhere(item, { 'key': 'id' }).value
        }
      });
    },
    changeChecked(item) { // 选中的compare
      this.checkedIds = item.map(i => i.id.value);
    },
    compareDelete() { // 删除compare
      this.$confirm(this.$i.common.confirmDeletion, this.$i.common.prompt, {
        confirmButtonText: this.$i.common.confirm,
        cancelButtonText: this.$i.common.cancel,
        type: 'warning'
      }).then(() => {
        this.$ajax.post(this.$apis.POST_INQUIRY_COMPARE_DELETE, this.checkedIds).then(res => {
          this.getList();
          this.checkedIds = [];
        });
      });
    },
    inputEnter(option, operatorFilters) {
      if (option.id === 'quotationNoLike' && option.value) {
        this.bodyData.quotationNoLike = option.value;
      } else {
        this.bodyData.quotationNoLike = null;
        this.bodyData.operatorFilters = operatorFilters;
      }
      this.getList();
    },
    exportDatas() {
      let params = this.$depthClone(this.bodyData);
      if (this.checkedIds.length) {
        params.ids = this.checkedIds;
      } else {
        delete params.ids;
      }
      this.$fetch.export_task('INQUIRY_COMPARE', params);
    },
    handleSizeChange(val) {
      this.bodyData.pn = val;
      this.getList();
    },
    pageSizeChange(val) {
      this.bodyData.pn = 1;
      this.bodyData.ps = val;
      this.getList();
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
