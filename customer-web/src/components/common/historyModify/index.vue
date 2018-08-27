<template>
  <div class="ucn-history-modify">
    <el-dialog
      :title="isModify ? $i.common.modify : $i.common.history"
      width="80%"
      @closed="closeDialog"
      :close-on-click-modal="false"
      :visible.sync="showDialog">

      <div class="table-header">
        <div>
          <el-checkbox v-if="!isModify" v-model="hideSameChecked" @change="changeTbaleData">{{$i.common.hideTheSame}}
          </el-checkbox>
        </div>

        <v-filter-column v-if="code" ref="filterColumn" :code="code"
                         :table-ref="() => $refs.tableBox"
                         @change="val => {dataList = $refs.filterColumn.getFilterData(dataList, val)}"></v-filter-column>
      </div>

      <el-table
        :data="dataList"
        height="400"
        style="display:flex;flex-direction:column;"
        ref="tableBox"
        stripe
        :cell-style="setCellStyle"
        border>
        <el-table-column v-for="(item,columnIndex) in dataColumn" :key="item.id"
                         v-if="(!item._hide && !item._hidden) || item._title"
                         min-width="200px"
                         :fixed="!!item._title || item._fixed"
                         :prop="item.key"
                         :label-class-name="'location-' + item.key"
                         :label="item.label">
          <template slot-scope="{ row }" v-if="(row[item.key] && !row[item.key]._hide) || item._title">
            <div v-if="!row[item.key]._edit || row[item.key]._title">
              {{row[item.key]._value || row[item.key].value}}
              <!--<p v-if="row[item.key]._title" v-text="row[item.key]._title"></p>-->
            </div>

            <div v-else>
              <span
                v-if="(row[item.key]._disabled && !row._remark)
                || (!isModify && !row[item.key]._upload)
                || (!isModify && row._remark)"
                v-text="setDataFilter(row[item.key])">
              </span>

              <!--附件上传-->
              <div v-else-if="row[item.key]._upload && !row._remark">
                <el-popover
                  placement="bottom"
                  width="300"
                  trigger="click">
                  <v-upload @change="(val,type) => {changeUploadFile(val,row[item.key],type)}"
                            :limit="row[item.key]._upload.limit || 5"
                            :ref="item.key + 'Upload'"
                            :only-image="row[item.key]._image"
                            :readonly="!isModify || row[item.key]._upload.readonly"
                            :list.sync="row[item.key]._value || row[item.key].value"></v-upload>
                  <el-button slot="reference" type="text">
                    <span v-if="!row[item.key]._image">
                      {{isModify && !row[item.key]._upload.readonly ? $i.upload.uploadingAttachments : $i.upload.viewAttachment}}
                    </span>
                    <span v-else>
                      {{isModify && !row[item.key]._upload.readonly ? $i.upload.uploadImage : $i.upload.viewImage}}
                    </span>
                    ({{row[item.key]._upload.list ? row[item.key]._upload.list.length : 0}})
                  </el-button>
                </el-popover>
              </div>

              <!--自定义插槽-->
              <div v-else-if="row[item.key]._slot && !row._remark">
                <slot :name="item._slot" :data="row[item.key]"></slot>
              </div>

              <div v-else>
                <!--文本输入-->
                <el-input v-if="row[item.key].type === 'String' || row._remark" clearable
                          @change="changeOperate(row[item.key],row)"
                          :placeholder="row._remark ? $i.setting.remark :''"
                          v-model="row[item.key].value" size="mini"></el-input>

                <!--数字输入-->
                <v-input-number
                  v-else-if="row[item.key].type === 'Number'"
                  v-model="row[item.key].value"
                  @change="changeOperate(row[item.key],row)"
                  :min="row[item.key].min || 0"
                  :max="row[item.key].max || 99999999"
                  controls-position="right"
                  size="mini"
                  :controls="false"
                  style="width:100%;"></v-input-number>

                <!--下拉选项-->
                <el-select
                  v-else-if="row[item.key].type === 'Select' && row[item.key]._option"
                  clearable
                  filterable
                  v-model="row[item.key].value"
                  @change="val => {changeSelect(val,row[item.key],row)}"
                  :placeholder="$i.order.pleaseChoose">
                  <el-option
                    v-for="(optionItem,index) in row[item.key]._option"
                    :key="index"
                    :label="optionItem[row[item.key]._optionLabel || 'name']"
                    :value="optionItem[row[item.key]._optionValue || 'code']">
                  </el-option>
                </el-select>

              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button @click="showDialog = false">{{isModify ? $i.common.cancel : $i.common.close}}</el-button>
        <el-button v-if="isModify" type="primary" @click="submit">{{$i.common.confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VUpload from '../upload/index';
  import VImage from '../image/index';
  import VFilterColumn from '../table/filterColumn';
  import VInputNumber from '../inputNumber/index';

  let defaultData = [];

  export default {
    name: 'VHistoryModify',
    components: {VUpload, VImage, VFilterColumn, VInputNumber},
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      disabledRemark: {
        type: Boolean,
        default: false
      },
      beforeSave: Function,
      code: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        showDialog: false,
        defaultData: [],
        dataList: [],
        dataColumn: [],
        isModify: false,
        modified: false,
        hideSameChecked: false,
      }
    },
    watch: {
      data(val) {
      },
      visible(val) {
        this.showDialog = val;
      }
    },
    mounted() {
    },
    methods: {
      submit() {
        let data = [this.dataList[0], this.dataList[1]]
          , uploadVm = null;
        this.modified = true;

        data[0] = _.mapObject(data[0], (val, key) => {
          let files,
            uploadVm = this.$refs[key + 'Upload'];
          if (val._upload && _.isObject(val._upload) && !_.isEmpty(uploadVm)) {
            uploadVm = _.isArray(uploadVm) ? uploadVm[0] : uploadVm;
            files = uploadVm.getFiles(true);
            val.value = files.key;
            val._value = files.url;
          }
          return val;
        });

        if (typeof this.beforeSave === 'function' && this.beforeSave(data) === false) {
          return false;
        }

        this.disabledRemark && data.pop();
        this.$emit('save', data);
        this.showDialog = false
      },
      getImage(value, split = ',') {
        if (_.isEmpty(value)) return '';
        if (_.isString(value)) {
          value = value.split(split);
        }
        return value[0];
      },
      init(editData, history = [], isModify = true) {
        let dataList = [];

        if (isModify && (_.isEmpty(editData) || !_.isArray(editData))) {
          return false
        }
        this.hideSameChecked = false;
        this.dataList = [];
        this.defaultData = [];
        this.dataColumn = [];
        // 初始化可编辑行
        _.map(this.$depthClone(editData), (value, index) => {
          dataList.push(_.mapObject(value, (val, key) => {
            if (!_.isObject(val)) {
              return val;
            }
            val._edit = true;
            val.type = index === 1 ? 'String' : val.type;
            val.value = val.value || val.value;
            val.value = _.isBoolean(val.value) ? val.value : val.value; // todo 屏蔽Boolean
            return val;
          }));
        });
        dataList = dataList.concat(history);

        this.defaultData = this.$depthClone(dataList);
        this.dataColumn = dataList[0];
        this.showDialog = true;
        this.isModify = isModify;

        this.$nextTick(() => {
          this.$refs.filterColumn.update(false, dataList).then(res => {
            this.dataList = this.$refs.filterColumn.getFilterData(dataList, res);
          });
        })
        return dataList;

      },
      changeSelect(val, item, row) {
        let param = {}, obj;
        param[item._optionValue || 'code'] = val;
        obj = _.findWhere(item._option, param);
        item._value = obj ? obj[item._optionLabel || 'name'] : '';
        item._isModified = true;
        this.$emit('select-change', item, row);
        this.changeOperate(item, row);
      },
      getFilterData(data = [], k = 'id') {
        let list = [];
        _.map(data, value => {
          list.push(value);
          value.fieldRemark = value.fieldRemark || {};
          value.fieldRemark._remark = true;
          list.push(_.extend(_.mapObject(value, (val, key) => {
            if (key !== k) {
              val = '';
            }
            return val;
          }), value.fieldRemark));
        });
        return list;
      },
      changeUploadFile(val, item, type) {
        this.$set(item._upload, 'list', val);
        !type && this.$set(item, '_isModified', true);
      },
      closeDialog() {
        if (this.modified) {
          this.dataList = this.$depthClone(this.defaultData);
        }
        _.map(this.dataList, value => {
          _.map(value, val => {
            if (_.isObject(val) && val._upload && !_.isEmpty(this.$refs[val.key + 'Upload'])) {
              this.$refs[val.key + 'Upload'][0].reset();
            }
          });
        });
        this.modified = false;
        this.$emit('closed', null);
        this.$emit('update:visible', false);
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 && !this.disabledRemark) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      setCellStyle({column, row}) {
        let item = row[column.property];
        if (!_.isEmpty(item) && !_.isEmpty(item._style)) {
          return item._style;
        }
      },
      changeOperate(item, row) {
        item._isModified = true;
        if (item._toFixed) {
          item.value = this.$toFixed(item.value, item._toFixed, item.label);
        }
        this.$emit('change', item, row);
      },
      changeTbaleData(type) {
        this.dataList = type
          ? this.$table.setHideSame(this.dataList, '_remark')
          : this.$table.revertHideSame(this.dataList);
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
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ucn-history-modify /deep/ .el-table .cell {
    min-height: 23px;
  }

  .table-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center
  }
</style>
