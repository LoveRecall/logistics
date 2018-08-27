<template>
  <div id="app" class="ucn-app" :class="{'ucn-language-zh':$localStore.get('language') === 'zh-CN'}">
    <router-view></router-view>
    <v-view-picture ref="viewPicture"></v-view-picture>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import {VViewPicture} from 'components/index'

  export default {
    name: 'app',
    components: {VViewPicture},
    computed: {
      ...mapState({
        quickLink: state => state.quickLink,
        layout: state => state.layout,
        menuLink: state => state.menuLink,
        viewPicture: state => state.viewPicture
      }),
    },
    watch: {
      $route(val) {
        this.menuLink.list = [];

        this.layout.paddingRight = 0;
      }
    },
    created() {
      this.menuLink.list = [];
      this.layout.hideMenu = this.$userAction.get('hideMenu');
    },
    mounted() {
      this.viewPicture.vm = this.$refs.viewPicture;
    },
    methods: {
    }
  }
</script>


<style lang="less">

  #app {
  }
</style>
