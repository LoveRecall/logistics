<template>
  <div class="ucn-pagination" :class="{show:pageLayout}">
    <el-pagination
      background
      @size-change="size => {$emit('size-change', size)}"
      @current-change="page => {$emit('change', page)}"
      :page-sizes="pageSizes"
      :current-page="pageInfo.pn"
      :page-size="pageInfo.ps"
      :total="pageInfo.tc"
      :layout="pageLayout">
    </el-pagination>
  </div>
</template>

<script>

  export default {
    name: 'VPagination',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 30, 40, 50];
        },
      },
      pageSize: {
        type: Number,
        default: 10,
      },
      pageTotal: {
        type: Number,
        default: 1,
      },
      pageNum: {
        type: Number,
        default: 1,
      },
      pageData: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        pageInfo: {},
        pageLayout: ''
      }
    },
    watch: {
      pageTotal() {
        this.pageListener(true);
      },
      pageSize() {
        this.pageListener(true);
      },
      pageNum() {
        this.pageListener(true);
      },
      pageData: {
        handler() {
          this.pageListener();
        },
        deep: true
      }
    },
    mounted() {

    },
    methods: {
      pageListener(type) {

        this.pageInfo = _.extend(this.pageData, type ? {
          pn: this.pageNum,
          ps: this.pageSize,
          tc: this.pageTotal,
        } : {});
        if (!this.pageInfo.tc || !this.pageInfo.ps) {
          return this.pageLayout = '';
        } else if (this.pageInfo.tc <= this.pageInfo.ps) {
          return this.pageLayout = 'pager,sizes,total';
        } else {
          this.pageLayout = 'prev, pager, next,sizes,total, jumper';
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ucn-pagination {
    visibility: hidden;
  }

  .ucn-pagination.show {
    visibility: inherit !important;
  }

  .ucn-pagination /deep/ .el-pagination {
    white-space: initial;
  }
</style>
