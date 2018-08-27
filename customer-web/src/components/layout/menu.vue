<template>
  <div class="menu ucn-menu" :class="{hideMenu:layout.hideMenu}">
    <div class="fold-box" @click="changeHideMenu">
      <i class="el-icon-arrow-left" v-show="!layout.hideMenu"></i>
      <i class="el-icon-arrow-right" v-show="layout.hideMenu"></i>
    </div>

    <el-menu class="menu-box">
      <el-menu-item-group style="border-bottom: 1px solid rgba(255,255,255,.5);padding-bottom: 10px">
        <div slot="title">
          <i class="el-icon-menu" style="font-size: 22px;vertical-align: middle"></i>
          <span v-text="$i.common.quickLink" style="vertical-align: middle"></span>
        </div>
        <el-menu-item v-for="(item,index) in quickLink.list"
                      v-if="$auth(item.auth)"
                      :index="'1-' + index" :key="index">
          <el-tooltip :effect="layout.hideMenu ? 'dark' : 'light'" :content="item.label"
                      placement="right">
            <router-link :to="item.link || '/'">
              <i class="iconfont" :class="[item.icon || 'icon-sousuo']"></i>
              <span v-text="item.label"></span>
            </router-link>
          </el-tooltip>
        </el-menu-item>
        <el-menu-item @click="quickLink.show = true" index="1-0">
          <i class="el-icon-more"></i>
          <span v-text="$i.button.addNewLinks"></span>
        </el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group>
        <el-menu-item v-for="(item,index) in menuLink.list" :key="index" :index="'2-' + index"
                      v-if="!item.auth || $auth(item.auth)"
                      @click="$router.push({path:item.path,query:item.query})">
          <el-tooltip :disabled="!layout.hideMenu" effect="dark"
                      :content="item.label" placement="right">
            <i class="el-icon-edit-outline"></i>
          </el-tooltip>
          <span v-text="item.label"></span>
        </el-menu-item>

        <el-menu-item index="2-4" v-if="$route.meta && $route.meta.importTask !== false">
          <router-link to="/logs/task">
            <el-tooltip :disabled="!layout.hideMenu" effect="dark" :content="$i.logs.taskList" placement="right">
              <i class="el-icon-time"></i>
            </el-tooltip>
            <span v-text="$i.logs.taskList"></span>
          </router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>

  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import {routerMap} from 'service/router'

  export default {
    name: 'VMenu',
    data() {
      return {
        routerList: [],
        activeName: null,
        activeOpen: [],
      }
    },
    computed: {
      ...mapState({
        quickLink: state => state.quickLink,
        layout: state => state.layout,
        menuLink: state => state.menuLink
      }),
    },
    mounted() {
      routerMap.forEach(value => {
        // 判断路由是否显示
        if (!value.hidden) {
          this.routerList.push(value)
        }
      });

      this.updateMenuActive();
    },
    watch: {
      $route() {
        this.updateMenuActive();
      }
    },
    methods: {
      updateMenuActive() {
        this.activeOpen = [];
        this.activeName = '';
        _.map(this.routerList, (val, index) => {
          if (val.name === this.$route.matched[0].name) {
            this.activeOpen.push(index.toString());
            _.map(val.children, (cVal, cIndex) => {
              if (this.$route.name === cVal.name || this.$route.path === cVal.redirect) {
                this.activeName = `${index}-${cIndex}`;
              }
            });
            if (!this.activeName) {
              _.map(val.children, (cVal, cIndex) => {
                if (this.$route.matched[1].name === cVal.name) {
                  this.activeName = `${index}-${cIndex}`;
                }
              });
            }
          }
        });
      },
      checkAuth(param) {
        let user = this.$localStore.get('user') || {userType: 1};

        if (_.isEmpty(param)) {
          return true;
        }

        return _.indexOf(param, user.userType) !== -1;
      },
      changeHideMenu() {
        this.layout.hideMenu = !this.layout.hideMenu;
        this.$userAction.set('hideMenu', this.layout.hideMenu);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/style/base.less";

  .ucn-menu {
    position: fixed;
    height: 100%;
    margin-top: 60px;
    top: 0;
    left: 0;
    background-color: @menu-back;
    z-index: 910;
    transform: translate(0, 0);
    transition: all .4s;
  }

  .ucn-menu .menu-box {
    width: 180px;
    height: 100%;
    overflow: auto;
  }

  .ucn-menu .ivu-menu {
    background-color: @menu-back;
    transition: all .3s;
  }

  .ucn-menu .ivu-menu-item {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ivu-menu-dark {
    background-color: #333333;
  }

  .fold-box {
    position: absolute;
    right: 0;
    top: 40%;
    z-index: 911;
    height: 60px;
    background-color: #3f3f3f;
    width: 20px;
    cursor: pointer;
    line-height: 60px;
    text-align: center;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    transition: all .5s;
    opacity: 0;
    transform: translate(0, 0);
  }

  .el-menu {
    border: none;
    background-color: inherit;
  }

  .el-menu-item,
  .el-menu-item a,
  .el-menu-item i {
    line-height: 34px;
    height: 36px;
    font-size: 12px;
    color: #FFFFFF;
    overflow: hidden;
    display: block;
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
    /*background-color: inherit !important;*/
  }

  .el-menu-item i {
    width: 20px;
    font-size: 16px;
    text-align: center;
    display: inline-block;
  }

  .ucn-menu.hideMenu .fold-box,
  .ucn-menu:hover .fold-box {
    transform: translate(20px);
    opacity: 1;
  }

  .fold-box i {
    color: rgba(255, 255, 255, .7);;
    font-size: 18px;
    margin-left: -2px;
    margin-top: 2px;
  }

  .fold-box:hover i {
    color: #FFFFFF;
  }

  .ucn-menu.hideMenu {
    transform: translate(-130px, 0);
  }

  .ucn-menu.hideMenu .el-menu-item-group__title i,
  .ucn-menu.hideMenu .el-menu-item i {
    font-size: 20px;
    margin-right: 0;
    padding-right: 15px;
  }

  .ucn-menu.hideMenu .el-menu-item {
    padding-right: 0;
  }

  .ucn-menu.hideMenu .el-menu-item-group__title span,
  .ucn-menu.hideMenu .el-menu-item span {
    display: none;
  }

  .ucn-menu.hideMenu .el-menu-item-group__title > div,
  .ucn-menu.hideMenu .el-menu-item {
    text-align: right;
  }

  .el-menu-item:hover,
  .el-menu-item:focus {
    background-color: rgba(119, 119, 119, .5);
  }

  .ucn-menu /deep/ .el-menu-item [class^="el-icon-"] {
    margin-right: 0;
  }
</style>
