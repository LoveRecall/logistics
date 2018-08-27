<template>
  <div class="add-quick-link">

    <el-dialog :title="$i.common.addNewLinks" :visible.sync="quickLink.show"
               @close="dialogClose">
      <el-checkbox-group v-model="checkedList">
        <el-row>
          <el-col :span="8" v-for="item in $db.common.quickLink" :key="item.key" v-if="$auth(item.auth)">
            <el-checkbox :label="item.key">
              {{item.label}}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="quickLink.show = false">{{$i.button.cancel}}</el-button>
        <el-button type="primary" @click="updateQuickLink" :loading="loading">{{$i.button.confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 表格组件
   * @desc 组件描述
   * @author xuffy
   * @param {Object} [title]    - 参数说明
   * @param {String} [columns] - 参数说明
   *
   * @method @sort-change(val, key)   - 点击排序
   * @method @page-size-change(size)    - 改变分页条数
   * @method @page-change(page)   - 改变分页
   *
   * @example
   *  <v-table></v-table>
   */

  import {mapActions, mapState} from 'vuex';
  import config from '../../../service/config'

  export default {
    name: 'VAddQuickLink',
    components: {},
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        loading: false,
        checkedList: [],
      }
    },
    computed: {
      ...mapState({
        quickLink: state => state.quickLink
      }),
    },
    watch: {},
    created() {
      let ql = {};

      _.map(this.$db.common.quickLink, (val, key) => {
        switch (config.CLIENT_TYPE) {
          case 1:
            if (val.customer) {
              ql[key] = val;
            }
            break;
          case 2:
            if (val.supplier) {
              ql[key] = val;
            }
            break;
          case 3:
            if (val.server) {
              ql[key] = val;
            }
            break;
        }
      });
      this.$db.common.quickLink = ql;

    },
    mounted() {
      this.getQuickLink();
    },
    methods: {
      getQuickLink() {
        this.$ajax.post(this.$apis.ITEMFAVORITE_PART, {bizCode: 'QUICK_LINK', type: config.CLIENT_TYPE})
          .then((data) => {
            let list = [];

            this.checkedList = _.map(data, val => {
              let v = this.$db.common.quickLink[val.itemCode];
              v && list.push(v);
              return val.itemCode;
            });

            this.quickLink.list = list;
          });
      },
      updateQuickLink() {
        let data = [];

        // if (_.isEmpty(this.checkedList)) return this.quickLink.show = false;

        this.loading = true;
        _.map(this.checkedList, (val, index) => data.push({bizCode: 'QUICK_LINK', itemCode: val, seqNum: index}));

        this.$ajax.post(this.$apis.ITEMFAVORITE_UPDATE, data)
          .then(() => {
            this.getQuickLink();
            this.$message({
              message: this.$i.hintMessage.operationSuccessful,
              type: 'success'
            });
            this.quickLink.show = false;
            this.loading = false;
          })
          .catch(() => {
            this.$message({
              message: this.$i.hintMessage.operationFailed,
              type: 'warning'
            });
            this.loading = false;
          });
      },
      dialogClose() {
        this.checkedList = _.map(this.quickLink.list, val => {
          return val.key;
        });
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
