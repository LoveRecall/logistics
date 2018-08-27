<template>
  <div :class="{'sort-wrapper':item._sort,active:currentSort.orderBy === item.key}" class="header-item">
    <span @click="item._sort && changeSort(item.key)">{{item.label}}</span>

    <el-popover
      v-if="item._note"
      placement="bottom-start"
      trigger="hover"
      :content="item._note">
      <i slot="reference" class="el-icon-question"></i>
    </el-popover>

    <div class="sort-box" v-if="!disabledSort && item._sort" @click="item._sort && changeSort(item.key)">
      <i class="el-icon-caret-top"
         :class="{active:currentSort.orderType === 'asc' && currentSort.orderBy === item.key}"
         @click.stop="changeSort(item.key,'asc')"></i>
      <i class="el-icon-caret-bottom"
         :class="{active:currentSort.orderType === 'desc' && currentSort.orderBy === item.key}"
         @click.stop="changeSort(item.key,'desc')"></i>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'VHeaderItem',
    props: {
      item: {
        type: Object,
        default() {
          return {};
        }
      },
      changeSort: {
        type: Function
      },
      currentSort: {
        type: Object,
        default() {
          return {};
        }
      },
      disabledSort: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {}
    },
    watch: {},
    mounted() {

    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-item {
    display: flex;
    align-items: center;
    padding: 0 20px;
    position: relative;
    justify-content: center;
  }

  .header-item:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    left: 0;
    background-color: #dcdbdb;
  }

  .el-icon-question {
    margin-left: 5px;
    font-size: 16px;
  }

  .sort-box {
    margin-left: 20px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 24px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }


  .sort-box i.active,
  .sort-box i:hover {
    color: #409EFF;
  }
</style>
