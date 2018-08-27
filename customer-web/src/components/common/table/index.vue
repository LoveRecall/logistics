<template>
  <div class="ucn-table" v-loading="loading || tableLoading"
       :class="{'fixed-left-box':selection,'fixed-right-box':buttons}">
    <div class="header-content" v-if="!hideFilterColumn || !hideFilterValue">
      <div style="width: 100%">
        <slot name="header"></slot>
      </div>
      <div class="fixed">
        <!--<v-filter-value v-if="!hideFilterValue && code" ref="tableFilter" :code="code" :data="dataColumn"
                        @change="val => {$emit('filter-value',val)}"></v-filter-value>-->

        <v-filter-column v-if="!hideFilterColumn && code" ref="filterColumn" :code="code"
                         :table-ref="() => $refs.tableContainer"
                         @change="val => setDataList(dataList)"></v-filter-column>
      </div>
    </div>

    <div class="table-container" ref="tableContainer">

      <!--固定header-->
      <div class="fixed-header fixed-left-header" v-show="dataList.length">
        <div class="fixed-left-header-item" v-if="selection" ref="fixedLeft">
          <input type="checkbox" v-model="checkedAll" :class="{visibility:selectionRadio}" ref="checkboxAll"
                 @change="changeCheckedAll"/>
        </div>
        <div class="fixed-left-header-item">#</div>

        <div class="fixed-left-header-item"
             v-for="item in dataColumn"
             v-if="!item._hide && !item._hidden && item.key && item._fixed === 'left'"
             :class="['location-' + item.key]">
          <v-header-item :item="item"
                         :change-sort="changeSort"
                         :current-sort="currentSort"
                         :disabled-sort="disabledSort"></v-header-item>
        </div>

      </div>

      <div class="fixed-header fixed-right-header" v-show="dataList.length">
        <div class="fixed-right-header-item" v-if="buttons">
          {{$i.table.action}}
        </div>
      </div>

      <!--表格 渲染-->
      <div class="table-box" id="table-box" ref="tableBox" :style="{'max-height':height + 'px'}">
        <table v-if="dataList.length">
          <thead ref="tableTitle">
          <tr>
            <td ref="tableCheckbox" v-if="selection" class="checkbox">
              <div style="visibility: hidden">
                <input type="checkbox" :class="{visibility:selectionRadio}"/>
              </div>
            </td>
            <td style="min-width: 50px">
              <div>#</div>
            </td>
            <td v-for="item in dataColumn" v-if="!item._hide && !item._hidden && item.key"
                :class="['location-' + item.key]">
              <v-header-item :item="item"
                             :change-sort="changeSort"
                             :current-sort="currentSort"
                             :disabled-sort="disabledSort"></v-header-item>
            </td>
            <td v-if="buttons" ref="tableAction">
              <div>{{$i.table.action}}</div>
            </td>
          </tr>
          </thead>

          <tbody ref="tableBody">
          <tr v-for="(item,index) in dataList"
              v-if="!item._remark"
              :class="{rowspan:index % newRowspan !== 0,disabled:item._disabled}">

            <!--checkbox 渲染-->
            <td v-if="selection && (index % newRowspan === 0) " :rowspan="newRowspan" class="fixed-left">
              <div>
                <input type="checkbox" ref="checkbox" :disabled="item._disabled || item._disabledCheckbox"
                       v-if="typeof selection === 'function' ? selection(item) : true"
                       @change="changeCheck(item)"
                       v-model="item._checked"/>
              </div>
            </td>

            <!--序号 渲染-->
            <td v-if="index % newRowspan === 0" :rowspan="newRowspan" class="fixed-left">
              <div v-text="(index / rowspan) + 1"></div>
            </td>

            <!--数据内容 渲染-->
            <td v-for="(cItem,cKey) in item" v-if="!cItem._hide && !cItem._hidden && cItem.key"
                :class="{'fixed-left':cItem._fixed === 'left'}"
                :style="cItem._style">
              <!-- 是否为图片显示 -->
              <v-image class="img" v-if="cItem._image"
                       :src="getImage(cItem._value || cItem.value)"
                       height="30px"
                       width="30px"
                       @click="setViewPicture(cItem._value || cItem.value)"></v-image>

              <el-popover
                v-else-if="cItem._upload && !item._remark"
                placement="bottom"
                width="300"
                trigger="click">
                <v-upload readonly :limit="cItem._upload.limit || 5"
                          :ref="cItem.key + 'Upload'"
                          :list="cItem._value || cItem.value"></v-upload>
                <el-button slot="reference" type="text" :disabled="!cItem.value">{{$i.upload.viewAttachment}}
                </el-button>
              </el-popover>

              <div v-else
                   :style="{color:cItem._color || '','min-width': cItem._width || setWidth(cItem)}"
                   v-text="setDataFilter(cItem)"></div>
            </td>

            <!--操作按钮 渲染-->
            <td v-if="buttons && (index % newRowspan === 0)" :rowspan="newRowspan" class="fixed-right">
              <div style="white-space: nowrap;">
                <span class="button"
                      v-for="aItem in (typeof buttons === 'function' ? buttons(item) : buttons)"
                      v-authorize="aItem.auth"
                      :class="{disabled:aItem.disabled || item._disabled}"
                      @click="(!aItem.disabled && !item._disabled) && $emit('action',item,aItem.type, index)">
                  {{aItem.label || aItem}}</span>
              </div>
            </td>
          </tr>
          </tbody>

          <!--合计行显示-->
          <tfoot ref="tableFoot" v-if="totalRow">
          <tr v-for="totalItem in totalRow">
            <td>
              <div v-text="totalItem._totalRow ? totalItem._totalRow.label : $i.product.total"></div>
            </td>
            <td v-if="newRowspan < 2">
            </td>
            <td v-for="item in dataColumn" v-if="!item._hide && !item._hidden && typeof item === 'object'">
              <div v-text="totalItem[item.key]._value || totalItem[item.key].value"></div>
            </td>
            <td v-if="buttons">
              <div></div>
            </td>
          </tr>
          </tfoot>
        </table>

        <div v-else class="empty">
          {{loading ? $i.table.gettingData : (emptyText || $i.hintMessage.noData)}}
        </div>
      </div>
    </div>

    <div>
      <slot name="footer"></slot>
    </div>

  </div>
</template>

<script>
  /**
   * 表格组件
   * @desc 表格基础组件
   * @param {Array} [data]    - 列表数据  例：[{},{},{}]
   * @param {String} [dataKey]    - i18n对应配置参数  例：'negotiation.tableProductInfo'
   * @param {Boolean} [loading]    - 加载loading状态  例：true
   * @param {String} [height]    - 设置表格高度  例：200
   * @param {Array} [F]    - 允许分页显示条数  例：[10,20,30]
   * @param {Number} [pageSize]    - 每页条数  例：200
   * @param {Number} [pageTotal]    - 总条数  例：200
   * @param {Function, Array} [buttons]    - 设置action按钮，可传入函数判断按钮是否显示，返回Array
   *                                         例：[{label: 'detail', type: 1}, {label: 'history', type: 2}]
   *                                         例：['detail', 'history']
   *
   * @method @change-checked(checkedList)   - checkbox改变时调用
   * @method @page-size-change(size)    - 改变分页条数
   * @method @page-change(page)   - 改变分页
   *
   * @example
   *  <v-table></v-table>
   */


  import VFilterValue from './filterValue'
  import VFilterColumn from './filterColumn'
  import VUpload from '../upload/index'
  import VImage from '../image/index'
  import VHeaderItem from './headerItem'
  import {mapActions, mapState} from 'vuex';

  export default {
    name: 'VTable',
    components: {VFilterValue, VImage, VFilterColumn, VUpload, VHeaderItem},
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      dataKey: {
        type: String,
        default: '',
      },
      loading: {
        type: Boolean,
        default: false,
      },
      height: {
        type: Number,
        default: 300,
      },
      buttons: {
        type: [Function, Array]
      },
      selection: {
        type: [Function, Boolean],
        default: true,
      },
      selectionRadio: {
        type: Boolean,
        default: false,
      },
      rowspan: { // 原 rowspan
        type: Number,
        default: 1,
      },
      newRowspan: {
        type: Number,
        default: 1,
      },
      hideFilterValue: {
        type: Boolean,
        default: false,
      },
      hideFilterColumn: {
        type: Boolean,
        default: false,
      },
      nativeSort: {
        type: [Boolean, String],
        default: false,
      },
      disabledSort: {
        type: Boolean,
        default: false,
      },
      totalRow: {
        type: [Boolean, Array],
        default: false,
      },
      code: {
        type: String,
        default: '',
      },
      emptyText: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        tableLoading: false,
        dataList: [],
        dataColumn: [],
        checkedAll: false,
        interval: null,
        tableAttr: {st: 0, sl: 0, w: 0, h: 0},
        currentSort: {orderBy: '', orderType: ''}
      }
    },
    watch: {
      data(val) {
        this.setDataList(val, true);
      },
      dataList(val) {
        let selected = this.getSelected();
        this.checkedAll = selected.length === val.length;
      }
    },
    mounted() {
      this.setDataList(this.data, true);
      this.$refs.tableBox.addEventListener('scroll', this.updateTable);
      this.interval = setInterval(this.updateTable, 300);
    },
    methods: {
      ...mapActions(['setViewPicture']),
      setField(key, type) {
        this.$refs.filterColumn.setField(key, type);
      },
      changeSort(key, type) {
        let params = {sorts: []};
        if (key !== this.currentSort.orderBy) {
          this.currentSort = this.$options.data().currentSort;
        }

        this.currentSort.orderBy = key;

        if (type) {
          this.currentSort.orderType = type;
        } else if (this.currentSort.orderType === 'desc') {
          this.currentSort = this.$options.data().currentSort;
        } else {
          this.currentSort.orderType = this.currentSort.orderType === 'asc' ? 'desc' : 'asc';
        }
        params.sorts = this.currentSort.orderType ? [this.currentSort] : [];

        this.$emit('change-sort', params);
      },
      setSort(data) {
        let sortData = [], newData = [], key
          , sorts = this.currentSort;

        if (_.isEmpty(sorts) || !this.nativeSort) {
          return false;
        }

        if (!this.currentSort.orderType && data) {
          return this.dataList = data;
        }

        key = _.isString(this.nativeSort) ? this.nativeSort : 'id';

        _.map(this.dataList, val => {
          if (_.isEmpty(val._remark)) {
            sortData.push(_.mapObject(val, v => {
              return v._value || v.value;
            }))
          }
        });

        sortData = _.sortBy(sortData, sorts.orderBy);

        sortData = sorts.orderType === 'desc' ? sortData.reverse() : sortData;

        _.map(sortData, val => {
          _.map(this.dataList, v => {
            if (val[key] && v[key].value === val[key]) {
              newData.push(v);
            }
          });
        });
        this.dataList = newData;
      },
      onFilterColumn(checked) {
        this.$emit('update:data', this.$refs.tableFilter.getFilterColumn(this.dataList, checked));
      },
      filterColumn() {
        this.dataColumn = _.values(this.dataList[0]);
      },
      updateTable(e) {
        this.$nextTick(() => {
          if (!this.$refs.tableBody) return false;

          let ele = e ? e.target : this.$refs.tableBox
            , trs = this.$refs.tableBody.children;
          let st, sl, sw, sh;

          st = e ? ele.scrollTop : this.tableAttr.st;
          sl = e ? ele.scrollLeft : this.tableAttr.sl;
          sw = ele.scrollWidth;
          sh = ele.scrollHeight;

          this.tableAttr.st = st;
          this.tableAttr.sl = sl;
          this.tableAttr.w = sw;
          this.tableAttr.h = sh;

          if (this.$refs.tableFoot) {
            this.$refs.tableFoot.style.transform = `translate3d(0,${-(sh - ele.clientHeight - st - 1)}px,0)`;
          }

          _.map(trs, (val, index) => {
            if (index % this.newRowspan !== 0) return false;
            _.map(val.getElementsByClassName('fixed-left'), (v, i) => {
              let eb = this.$refs.tableContainer.getElementsByClassName('fixed-left-header-item')[i];

              v.style.transform = `translate3d(${sl}px,0,100px)`;
              if (eb) {
                eb.style.width = `${v.offsetWidth}px`;
              }
            });

            _.map(val.getElementsByClassName('fixed-right'), (v, i) => {
              let eb = this.$refs.tableContainer.getElementsByClassName('fixed-right-header-item')[i];

              v.style.transform = `translate3d(${this.$refs.tableBox.offsetWidth - sw + sl}px,0,0)`;
              if (eb) {
                eb.style.width = `${v.offsetWidth}px`;
              }
            });

          });

          this.$refs.tableTitle.style.transform = `translate3d(0,${!ele.scrollTop ? 0 : st}px,0)`;

        });
      },
      getImage(value, split = ',') {
        if (_.isEmpty(value)) return '';

        if (_.isString(value)) {
          value = value.split(split);
        }

        return value[0];
      },
      changeCheck(item, value) {
        let selected = this.getSelected();

        if (this.selectionRadio) {
          this.setDataList(_.map(this.dataList, val => {
            val._checked = false;
            return val;
          }));
          item._checked = true;
        }

        this.checkedAll = selected.length === this.dataList.length;
        this.$emit('change-checked', selected);
      },
      getSelected() {
        return this.selectionRadio ? _.findWhere(this.dataList, {_checked: true}) :
          _.where(this.dataList, {_checked: true});
      },
      setDataList(val, type) {
        let e = this.$refs.tableBox, timeout = null;

        // this.tableLoading = true;
        if (this.dataList.length !== val.length || _.values(this.dataList[0]).length !== _.values(val[0]).length) {
          e.scrollTop = 0;
          e.scrollLeft = 0;
        }

        timeout = setTimeout(() => {
          // this.tableLoading = false;
          clearTimeout(timeout);
          this.resetFile();
          if (!this.hideFilterColumn && this.$refs.filterColumn && this.code && !_.isEmpty(val)) {
            this.$refs.filterColumn.update(false, val).then(res => {
              this.dataList = this.$refs.filterColumn.getFilterData(val, res);
              type && this.filterColumn();
              this.$nextTick(() => this.setSort())
              this.tableLoading = false;
            })
          } else {
            this.dataList = val;
            type && this.filterColumn();
            this.tableLoading = false;
          }
        }, 100);
      },
      resetFile() {
        _.mapObject(this.dataList, value => {
          _.map(value, val => {
            let e = this.$refs[val.key + 'Upload'];
            if (val._upload && !_.isEmpty(e)) {
              e[0].reset();
            }
          });
        });
      },
      changeFilterColumn(data) {
        this.dataList = this.$refs.filterColumn.getFilterData(this.dataList, data);
      },
      changeCheckedAll() {
        this.setDataList(_.map(this.dataList, val => {
          if (!val._disabled && !val._disabledCheckbox) {
            this.$set(val, '_checked', this.checkedAll);
          }
          return val;
        }));
        this.changeCheck(this.dataList, this.checkedAll);
      },
      update() {
        this.$refs.filterColumn.update().then(res => {
          this.dataList = this.$refs.filterColumn.getFilterData(this.dataList, res);
        });
      },
      setWidth(item) {
        let val = item._value || item.value;
        if (_.isString(val) && (val.length / 2 * 8) < 300) {

          return `${val.length / 2 * 8}px`;
        }
      },
      setDataFilter(item) {
        let value = '';
        value = item._value || item.value;
        if (item._toFixed) {
          value = this.$toFixed(value, item._toFixed);
        }

        if (value !== 0 && !value) {
          value = '--';
        }
        return value;
      }
    },
    beforeDestroy() {
      this.$refs.tableBox.removeEventListener('scroll', this.updateTable);
      clearInterval(this.interval);
      this.interval = null;
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .ucn-table .table-container {
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    border-top: 1px solid #e2e2e2;
  }

  .ucn-table .visibility {
    visibility: hidden !important;
  }

  .fixed-header {
    position: absolute;
    z-index: 4;
    top: 0;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
    text-align: center;
    color: #999999;
    background-color: #ECEFF1;
    display: flex;
    align-items: center;
    padding-right: 1px;
  }

  .fixed-right-header {
    right: 15px;
  }

  .fixed-left-header-item /deep/ .header-item:before {
    content: none;
  }

  .fixed-header > div {
    position: relative;
  }

  .fixed-header > div:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    right: -2px;
    background-color: #dcdbdb;
  }

  .fixed-right-header > div:before {
    left: 2px;
  }

  .ucn-table .fixed-right {
    right: 15px;
  }

  .ucn-table .table-box {
    max-width: 100%;
    overflow-y: scroll;
    overflow-x: auto;
    border: 1px solid #ebeef5;
  }

  .ucn-table table {
    border-collapse: collapse;
    border: none;
    table-layout: fixed;
    min-width: 100%;
  }

  .ucn-table input[type=checkbox] {
    zoom: 130%;
    cursor: pointer;
    margin: 0;
    vertical-align: middle;
  }

  .ucn-table tr {
    background-color: #FFFFFF;
  }

  .ucn-table td,
  .ucn-table th {
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
  }

  .ucn-table thead td {
    background-color: #ECEFF1;
    color: #999999;
  }

  .ucn-table tfoot td {
    padding: 0 20px;
  }

  .ucn-table tfoot td {
    box-sizing: border-box;
    position: relative;
    color: #999999;
  }

  .ucn-table tfoot td:after {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #ebeef5;
  }

  .ucn-table tfoot td:before {
    width: 1px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #999999;
  }

  .ucn-table tfoot tr td:last-child:before {
    display: none;
  }

  .ucn-table td > div {
    text-align: center;
    width: 100%;
    line-height: 14px;
    min-height: 14px;
  }

  .ucn-table thead td > div {
    line-height: 40px;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .ucn-table tfoot td > div {
    line-height: 30px;
    white-space: nowrap;
  }

  .ucn-table tbody td {
    padding: 10px;
    border-right: 1px solid #ebeef5;
    white-space: normal;
    word-break: break-all;
    max-width: 300px;
  }

  .ucn-table tbody tr:nth-child(even) td.fixed-left,
  .ucn-table tbody tr:nth-child(even) td.fixed-right,
  .ucn-table tfoot tr:nth-child(even),
  .ucn-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .ucn-table tbody td .img {
    vertical-align: middle;
    cursor: pointer;
  }

  .ucn-table tbody tr.disabled td {
    color: #dad8d8;
  }

  .ucn-table .fixed-left,
  .ucn-table .fixed-right {
    position: relative;
    background-color: #FFFFFF;
  }

  .ucn-table .fixed-left:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    right: -1px;
    background-color: #ebeef5;
  }

  .ucn-table .fixed-right:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    left: 0;
    background-color: #ebeef5;
  }

  .ucn-table.fixed-right-box tbody tr:not(.rowspan) td:last-child:after {
    left: 0;
  }

  .ucn-table .button {
    color: #409eff;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
  }

  .ucn-table .button.disabled {
    color: #dad8d8;
    cursor: not-allowed;
  }

  .ucn-table .button:last-child {
    margin-right: 0;
  }

  .ucn-table .empty {
    text-align: center;
    color: #999999;
    height: 200px;
    line-height: 200px;
  }

  .ucn-table .el-pagination {
    white-space: inherit;
  }

  .header-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .header-content .fixed {
    margin-right: 5px;
    display: flex;
  }

  .ucn-table /deep/ .ucn-image .image,
  .ucn-table /deep/ .ucn-image {
    position: initial;
  }

  .ucn-table /deep/ .ucn-image > i {
    display: none;
  }

  .ucn-table /deep/ .ucn-image {
    margin: 0 auto;
  }

  .sort-wrapper {
    cursor: pointer;
    box-sizing: border-box;
  }

  /*  .sort-wrapper.active .sort-box,
    .sort-wrapper:hover .sort-box {
      opacity: 1;
    }

    .sort-box i {
      height: 10px;
    }

    .sort-box i.active,
    .sort-box i:hover {
      color: #409EFF;
    }*/
</style>
