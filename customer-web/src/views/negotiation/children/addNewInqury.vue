<template>
    <div class="inquiry">
        <el-dialog
            :title="title || $i.common.prompt"
            :visible.sync="showDialog"
            width="80%">
                <div class="status">
                    <div class="state">
                        <span>{{ $i.common.Status }}</span>
                        <el-radio-group v-model="params.status" @change="gettabData" size="mini">
                            <el-radio-button :label="null">{{$i.common.all}}</el-radio-button>
                            <el-radio-button
                                v-for="item in $db.inquiry.overoiewState"
                                :label="item.id"
                                :key="item.id">
                            {{ item.text }}
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                    <select-search
                        :options="options"
                        @inputEnter="inputEnter"
                        :searchLoad="searchLoad"/>
                </div>
                <v-table
                    :data="tabData"
                    @change-checked="changeChecked"
                    :loading="tabLoad"
                    :selection-radio="selectionRadio"
                    ref="tab"/>
                <el-pagination
                    @change="handleSizeChange"
                    @size-change="pageSizeChange"
                    :currentPage.sync="params.pn"
                    :page-sizes="pazeSize"
                    :page-size="params.ps"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">{{ $i.common.cancel }}</el-button>
                <el-button type="primary" @click="addCompare">{{ $i.common.ok }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
/**
 * @param selectChange 下拉框 值发生变更触发
 * @param options 下拉框 原始数据
*/
import selectSearch from '@/components/common/fnCompon/selectSearch';
import VTable from '@/components/common/table/index';
export default {
  name: '',
  data() {
    return {
      checkedData: [],
      pazeSize: [50, 100, 200],
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
      params: {
        status: null,
        keyType: '',
        key: '',
        ps: 50,
        pn: 1,
        recycleCustomer: 0,
        compareInquiryIds: [],
        compareInquiryDelIds: [],
        compareId: null
      },
      tabLoad: false,
      pageTotal: 0
    };
  },
  components: {
    'select-search': selectSearch,
    'v-table': VTable
  },
  model: {
    prop: 'show',
    event: 'changeShow'
  },
  props: {
    title:{
      type: String
    },
    show: {
      type: Boolean,
      default: false
    },
    selectionRadio: {
      type: Boolean,
      default: false
    },
    argDisabled: {
      type: Array,
      default: () => {
        return [];
      }
    },
    compareId: {
      default: null
    },
    disableds: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('changeShow', val);
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.checkedData = [];
        this.params.compareInquiryIds = this.argDisabled;
        this.params.compareInquiryDelIds = this.disableds;
        this.params.compareId = this.compareId;
        this.gettabData();
      }
    }
  },
  methods: {
    addCompare() {
      let ids = this.checkedData.filter(i => !i._disabled).map(i => i.id.value);
      this.$emit('addInquiry', ids);
    },
    inputEnter(val, operatorFilters) {
      this.params.operatorFilters = operatorFilters;
      this.searchLoad = true;
      this.gettabData();
    },
    gettabData() {
      this.tabLoad = true;
      this.$ajax.post(this.$apis.POST_INQIIRY_LIST, this.params).then(res => {
        this.pageTotal = res.tc;
        this.tabLoad = false;
        this.searchLoad = false;
        this.tabData = this.$getDB(this.$db.inquiry.viewByInqury, res.datas, item => {
          if (item.compareDisplay.value === 1) {
            item._disabled = true;
            item._checked = true;
          }
        });
      }, () => {
        this.searchLoad = false;
        this.tabLoad = false;
      });
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
      const argId = this.getChildrenId();
      this.$ajax.post(this.$apis.POST_INQUIRY_ACTION, {
        action: type,
        ids: argId
      }).then(() => {
        this.gettabData();
        this.checkedData = [];
      });
    },
    getChildrenId(type) {
      let arr = [];
      this.checkedData.forEach(item => {
        arr.push(item.id.value);
      });
      if (typeof type === 'string') {
        arr.join(',');
      }
      return arr;
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
                    input {}
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
