<template>
  <div class="nav-bar-box">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in navBarList" :key="index">
        <router-link v-if="index !== navBarList.length - 1" :to="item.path">
          {{item.meta ? item.meta.name : ''}}
        </router-link>
        <span v-else v-text="item.meta ? item.meta.name : ''"></span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';

  export default {
    name: 'NavBar',
    data() {
      return {
        navBarList: null
      }
    },
    computed: {
      ...mapState({
        navBar: state => state.navBar
      }),
    },
    created() {
      this.updateBreadcrumb()
    },
    methods: {
      ...mapActions(['setNavBar']),
      updateBreadcrumb() {
        let matched = [], first = {}, htmlTitle = 'UCN';

        matched = this.$route.matched.filter(item => {
          return item.meta ? item.meta.name : '';
        });
        first = matched[0];

        if (first && first.meta && (first.meta.name !== this.$i.common.home || first.path !== '')) {
          matched = [{meta: {name: this.$i.common.home}, path: '/'}].concat(matched)
        }

        // console.log(matched[matched.length -1])
        // if (this.navBar){
        //   matched[matched.length -1].meta
        //   console.log(matched.length)
        // }

        this.navBarList = _.clone(matched);

        matched.shift();

        _.map(matched, val => {
          if (val.meta) {
            htmlTitle += `-${val.meta.name}`;
          }
        });

        document.title = htmlTitle;
      }
    },
    watch: {
      $route() {
        this.updateBreadcrumb()
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../assets/style/base.less';

  .nav-bar-box {
    line-height: 40px;
    background-color: #F4F4F4;
    width: 100%;
    height: 40px;
    top: 60px;
    position: fixed;
    z-index: 905;
    padding-left: 15px;
  }

  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
  }

</style>
<style>
  .nav-bar-box .el-breadcrumb__inner,
  .nav-bar-box .el-breadcrumb__inner a {
    font-size: 12px;
    font-weight: 400;
    color: #9f9f9f;
  }

  .nav-bar-box .el-breadcrumb__inner a:hover,
  .nav-bar-box .el-breadcrumb__inner:hover {
    color: #666666;
  }
</style>
