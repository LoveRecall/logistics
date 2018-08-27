<template>
    <div>
        <el-dialog :title="title" :visible.sync="value" width="70%" lock-scroll>
            <el-table
                    :data="history"
                    style="width: 100%"
                    v-if="title === 'Modify'"
                    :span-method="arraySpanMethod"
                    :row-class-name="tableRowClassName">
                <!-- <el-table-column type="index" /> -->
                <el-table-column
                        :label="item.label"
                        :width="item.wdith || 120"
                        v-for="item in column"
                        :key="item.id"
                        v-if="!item._hide">
                    <template slot-scope="scope">
                        <el-select
                                v-model="remarkJson[item.key]"
                                :placeholder="item.placeholder"
                                v-if="item.type === 'select' && scope.row[item.key] && scope.row[item.key].history">
                            <el-option
                                    v-for="items in item.select"
                                    :key="items"
                                    :value="items">
                            </el-option>
                        </el-select>
                        <span v-if="scope.row[item.key] && !scope.row[item.key].remark && !scope.row[item.key].history">{{scope.row[item.key] ? scope.row[item.key].value : ''}}</span>

                        <el-input v-if="scope.row[item.key] && scope.row[item.key].remark && item.key != 'updateDt'" :disabled="item._disabled" placeholder="Please select" v-model="historyJson[item.key]" size="mini"></el-input>

                        <el-input v-if="scope.row[item.key] && scope.row[item.key].history && (item.type === 'text' || item.type === 'textarea') && item.key != 'updateDt'" placeholder="Please select" :disabled="item._disabled" v-model="remarkJson[item.key]" size="mini"></el-input>

                        <span v-if="scope.row[item.key] && scope.row[item.key].history && item.key === 'discountRate'" style="display:flex; item-align:center;">
                            <el-input-number v-model="remarkJson[item.key]" :min="1" :max="100" controls-position="right" size="mini" :controls="false"></el-input-number> %
                        </span>

                        <v-image class="img" v-if="item._image" :src="getImage(item._value || item.value)" height="30px" width="30px"></v-image>

                        <v-up-load v-if="item.type === 'attachment' && scope.row[item.key] &&scope.row[item.key].history"/>
                    </template>
                </el-table-column>
            </el-table>
            <VTable :data.sync="history" :rowspan="2" :selection="false" v-if="title === 'Histoty'" />

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modify" v-if="title !== 'Histoty'">{{ $i.common.ok }}</el-button>
                <el-button @click="value = false">{{ $i.common.cancel }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import VTable from '@/components/common/table/index';
import VImage from '@/components/common/image/index';
// import Upload from '@/components/common/upload/upload';
export default {
  data() {
    return {
      data: [],
      remarkJson: {},
      historyJson: {}
    };
  },
  props: {
    title: {
      type: String,
      default: 'title'
    },
    oSwitch: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    column: {
      type: Object,
      default: () => {
        return {};
      }
    },
    msgTableType: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  computed: {
    value: {
      get() {
        if (this.msgTableType) {
          // console.log(this.column)
        }
        return this.oSwitch;
      },
      set(val) {
        this.$emit('update:oSwitch', val);
      }
    },
    filtColumn() {
      let column = [],
        data = this.column;
      for (let key in data) {
        if (key !== 'id') {
          column.push(data[key]);
        }
      }
      return column;
    },
    history() {
      let arr = this.$getDB(
        this.$db.inquiry.basicInfo,
        this.$filterRemark(this.list, 'fieldRemark')
      );
      if (this.title === 'Modify') {
        let json = {};
        for (let key in this.column) {
          if (this.column[key].key === 'id') {
            let jsons = {};
            for (let k in this.column) {
              jsons[this.column[k].key] = {
                key: this.column[k].key,
                remark: true
              };
            }
            arr.unshift(jsons);
          }
          json[this.column[key].key] = {
            key: this.column[key].key,
            history: true
          };
        }
        arr.unshift(json);
      }
      return arr;
    }
  },
  watch: {
    oSwitch(val) {
      let json = {};
      for (let key in this.column) {
        json[key] = null;
      }
      this.historyJson = json;
      let jsons = {};
      for (let key in this.column) {
        json[key] = null;
      }
      this.historyJson = jsons;
      this.$emit('update:oSwitch', val);
    }
  },
  created() {
    // this.$nextTick(() => {
    //     document.onclick = () => {
    //         console.log(this.remarkJson.operater)
    //     }
    // })
  },
  mounted() {},
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
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
    getImage(value, split = ',') {
      if (_.isEmpty(value)) return '';
      if (_.isString(value)) {
        value = value.split(split);
      }
      return value[0];
    },
    tableRowClassName(row, index) {
      row.index = index;
    },
    modify() {
      this.$emit('isModify', {
        history: this.historyJson,
        remark: this.remarkJson
      });
    }
  },
  components: {
    VTable,
    VImage
    // 'v-up-load': Upload
  }
};
</script>
<style lang="less" scoped>
</style>
