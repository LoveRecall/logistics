<template>
    <div class="inquiry">
        <h3 class="hd"> {{ $i.inquiry.inquiryTitle }}</h3>
        <div class="status">
            <div class="state">
                <span>{{ $i.common.Status }}</span>
                <el-radio-group v-model="params.status" @change="gettabData" size="mini">
                    <el-radio-button :label="null">{{$i.common.all}}</el-radio-button>
                    <el-radio-button
                        v-for="item in $db.inquiry.overoiewState"
                        :label="item.id"
                        :key="item.id">
                      {{ $i.inquiry[item.text] }}
                    </el-radio-button>
                </el-radio-group>
            </div>
            <select-search
                :options="options"
                @inputEnter="inputEnter"
                :searchLoad="searchLoad"/>
        </div>
        <div class="fn">
            <div class="btn-wrap" v-authorize="'INQUIRY:OVERVIEW:READ_ONLY'">
                <el-button @click="toCompare" :disabled="checkedIds.length < 2" v-authorize="'INQUIRY:OVERVIEW:COMPARE'">{{ $i.common.compare }}<span>({{ checkedIds.length }})</span></el-button>
                <el-button @click="$windowOpen({url:'/negotiation/createInquiry'})" v-authorize="'INQUIRY:OVERVIEW:CREATE_INQUIRY'">{{ $i.common.createNewInquiry }}</el-button>
                <el-button @click="cancelInquiry" v-authorize="'INQUIRY:OVERVIEW:CANCEL_INQUIRY'" :disabled="!cancelAble">{{ $i.common.cancelTheInquiry }}<span>({{ checkedIds.length }})</span></el-button>
                <el-button @click="deleteInquiry" type="danger" v-authorize="'INQUIRY:OVERVIEW:DELETE'" :disabled="!deleteAble">{{ $i.common.archive }}<span>({{ checkedIds.length }})</span></el-button>
                <el-button @click="exportDatas" :disabled="!tabData.length" v-authorize="'INQUIRY:OVERVIEW:DOWNLOAD'">{{ `${$i.common.download}(${checkedIds.length >= 1 ? checkedIds.length : 'all'})` }}</el-button>
            </div>
            <div class="viewBy">
                <span>{{ $i.common.viewBy }}&nbsp;</span>
                <el-radio-group v-model="viewByStatus" @change="viewByChange"  size="mini">
                    <el-radio-button :label="0">{{$i.common.inquiry}}</el-radio-button>
                    <el-radio-button :label="1" >{{$i.common.SKU}}</el-radio-button>
                </el-radio-group>
            </div>
        </div>
      <!--:code="viewByStatus ? 'inquiry': 'inquiry_list'"-->
        <v-table
            hide-filter-value
            :data="tabData"
            :buttons="actionBtns"
            :height="450"
            @action="action"
            @change-checked="changeChecked"
            @change-sort="onListSortChange"
            :loading="tabLoad"
            ref="tab"
        />
        <v-pagination
            :page-data.sync="params"
            :pageSizes="[50, 100, 200]"
            @change="handleSizeChange"
            @size-change="pageSizeChange"
        />
    </div>
</template>
<script>
/**
 * @param selectChange 下拉框 值发生变更触发
 * @param options 下拉框 原始数据
*/
import { selectSearch, VTable, VPagination } from '@/components/index';
import { mapActions } from 'vuex';
import codeUtils from '@/lib/code-utils';
import thisTool from './index';

export default {
  name: '',
  data() {
    return {
      checkedData: [],
      searchLoad: false,
      options: [{
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
      }],
      tabData: [],
      viewByStatus: 0,
      params: {
        status: null,
        ps: 50,
        pn: 1,
        tc: 0,
        draft: 0,
        recycleCustomer: false,
        operatorFilters: []
        // recycleSupplier
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
  computed: {
    checkedIds() {
      return Array.from(new Set(this.checkedData.map(i => i[i.inquiryId ? 'inquiryId' : 'id'].value)));
    },
    cancelAble() {
      return new Set(this.checkedData.map(i => i.status.value).filter(i => ![21, 22].includes(i))).size === 0;
    },
    deleteAble() {
      return new Set(this.checkedData.map(i => i.status.value).filter(i => ![1, 11, 99].includes(i))).size === 0;
    }
  },
  created() {
    thisTool.setMenuLinks(this, ['INQUIRY:OVERVIEW:DRAFT', 'INQUIRY:OVERVIEW:DELETE', 'INQUIRY:LOG']);

    if (this.$auth('INQUIRY:DETAIL')) {
      this.actionBtns.push({label: this.$i.common.detail, type: 'detail'});
    }

    this.getBaseData().then(this.gettabData, this.gettabData);
  },
  methods: {
    ...mapActions(['setMenuLink', 'setDic']),
    inputEnter(val, operatorFilters) {
      this.params.operatorFilters = operatorFilters;
      this.searchLoad = true;
      this.gettabData();
    },
    getBaseData() {
      const postCodes = this.$ajax.post(this.$apis.POST_CODE_PART, ['INQUIRY_STATUS', 'ITM'], { cache: true });
      console.log(postCodes)
      const getCurrencies = this.$ajax.get(this.$apis.GET_CURRENCY_ALL, '', {cache: false});
      return this.$ajax.all([postCodes, getCurrencies]).then(res => {
        let data = res[0];

        res[1].forEach(item => item.name = item.code);
        data.push({
          code: 'CY_UNIT',
          name: 'CY_UNIT(币种)',
          codes: res[1]
        });
        this.setDic(codeUtils.convertDicValueType(data));
      });
    },
    gettabData() {
      let url, column;
      this.tabLoad = true;
      if (this.viewByStatus === 0) {
        url = this.$apis.POST_INQIIRY_LIST;
        column = this.$db.inquiry.viewByInqury;
      } else {
        url = this.$apis.POST_INQIIRY_LIST_SKU;
        column = this.$db.inquiry.overviewBySKU;
      }
      this.$ajax.post(url, this.params).then(res => {
        this.checkedData = [];
        this.params.tc = res.tc;
        this.tabData = this.$getDB(column, res.datas, (item) => {
          this.$filterDic(item);
        });
        this.tabLoad = false;
        this.searchLoad = false;
      }, () => {
        this.searchLoad = false;
        this.tabLoad = false;
      });
    },
    viewByChange() {
      this.params.sorts = null;
      this.params.pn = 1;
      this.gettabData();
    },
    onListSortChange(args) {
      this.params.sorts = args.sorts;
      this.gettabData();
    },
    exportDatas() {
      let params = this.$depthClone(this.params);
      if (this.checkedIds.length) {
        params.ids = this.checkedIds;
      } else {
        delete params.ids;
      }
      this.$fetch.export_task('INQUIRY_ORDER', params);
    },
    cancelInquiry() { // 取消询价单
      this.ajaxInqueryAction('cancel');
    },
    deleteInquiry() { // 删除询价单
      this.$confirm(this.$i.common.confirmDeletion, this.$i.common.prompt, {
        confirmButtonText: this.$i.common.confirm,
        cancelButtonText: this.$i.common.cancel,
        type: 'warning'
      }).then(() => {
        this.ajaxInqueryAction('delete');
      });
    },
    ajaxInqueryAction(type) {
      this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
        action: type,
        ids: this.checkedIds
      })
        .then(res => {
          this.gettabData();
          this.checkedData = [];
        });
    },
    action(item, type) {
      switch (type) {
        case 'detail':
          this.detail(item);
          break;
      }
    },
    detail(item) {
      let id = item.inquiryId ? item.inquiryId.value : item.id.value;
      this.$router.push({
        path: '/negotiation/inquiryDetail',
        query: {id}
      });
    },
    toCompare() {
      if (this.checkedData.length >= 100) {
        this.$message({
          message: 'No more than a hundred!',
          type: 'warning'
        });
        return;
      }
      if (this.checkedIds.length >= 2) {
        this.$windowOpen({
          url: '/negotiation/compareDetail/new',
          params: {
            type: 'new',
            ids: this.checkedIds.join(',')
          }
        });
      }
    },
    handleSizeChange(val) {
      this.params.pn = val;
      this.gettabData();
    },
    pageSizeChange(val) {
      this.params.pn = 1;
      this.params.ps = val;
      this.gettabData();
    },
    changeChecked(item) { // tab 勾选
      this.checkedData = item;
    }
  }
};
</script>
<style lang="less" scoped>
    .inquiry {
        .hd {
            padding-left:15px;
            height: 50px;
            line-height:50px;
            color:#666;
            border-bottom:1px solid #ccc;
        }
        .status {
            display:flex;
            height: 60px;
            align-items: center;
            justify-content:space-between;
            padding:0 15px;
            box-sizing: border-box;
            .state {
                display:flex;
                align-items: center;
                font-size:16px;
                color:#666;
            }
            span {
                padding-right:5px;
            }
            .btn-wrap {
                display:flex;
                align-items: center;
                span {
                    font-size:14px;
                }
                button {
                    padding:2px 5px;
                }
            }
            .select-wrap {
                display:flex;
                align-items:center;
                .select {
                    width: 110px;
                    margin-right:5px;
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
