<template>
  <div class="header-box ucn-header">
    <div class="header">
      <img class="c5-icon logo" src="../../assets/images/logo.png" @click="$router.push('/')">

      <div class="ucn-header-menu" v-if="routerList.length">
        <el-menu :default-active="activeName" class="el-menu-demo" mode="horizontal">


          <template v-for="(item,index) in routerList">
            <el-menu-item
              v-if="item.children.length && item.noDropdown && !item.hidden && menuAuth(item)"
              :index="index + ''">
              <router-link class="link"
                           :to="item.path+'/'+item.children[0].path">
                {{item.meta ? item.meta.name : ''}}
              </router-link>
            </el-menu-item>


            <el-submenu
              v-if="!item.noDropdown && !item.hidden && menuAuth(item)" :index="index + ''">
              <template slot="title">
                <span v-if="item.meta" v-text="item.meta.name"></span>
              </template>

              <template v-if="item.children.length && !item.noDropdown && !item.hidden"
                        v-for="(cItem,cIndex) in item.children">
                <el-menu-item class="ucn-header-submenu"
                              v-if="!cItem.hidden && menuAuth(cItem)" :index="index +'-'+cIndex">
                  <router-link class="link" :to="item.path+'/'+cItem.path">
                    {{cItem.meta ? cItem.meta.name : ''}}
                  </router-link>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>

        </el-menu>
      </div>

      <div class="header-right" style="color: #999999!important;line-height: 57px">
        <el-dropdown placement="bottom">
          <span class="icon-menu"><i class="iconfont icon-duoyuyan"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in languageOption" :key="item.type">
              <span @click="changeLanguage(item)" v-text="item.label"></span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>


        <div class="message-box" v-popover:messageBox>
          <el-badge :value="message.count || ''">
            <i class="el-icon-bell"></i>
          </el-badge>

          <el-popover
            popper-class="message-popover"
            ref="messageBox"
            placement="bottom-end"
            width="300"
            v-model="message.show"
            trigger="click">
            <div v-loading="message.loading">
              <h3 class="ucn-content-title">{{$i.common.systemMessage}}（{{message.count}} {{$i.common.new}} ）</h3>
              <ul class="list" v-if="message.count">
                <li class="unread" v-for="item in message.list" @click="goMessage(item)">
                  <p v-text="item.title"></p>
                  <span v-text="$dateFormat(item.sendTime,'yyyy-mm-dd HH:MM:ss')"></span>
                </li>
              </ul>
              <div v-else style="color: #999999;height: 100px;width: 100%;text-align: center;line-height: 100px">
                {{$i.hintMessage.noLatestNews}}
              </div>
              <el-row>
                <el-col :span="12" style="text-align: left;padding: 5px 10px">
                  <el-button type="text" size="mini" @click="readMessage" v-if="message.count">
                    {{$i.common.markAsRead}}
                  </el-button>
                </el-col>
                <el-col :span="12" style="text-align: right;padding: 5px 10px">
                  <el-button type="text" size="mini" @click="goMessage">{{$i.common.more}}</el-button>
                </el-col>
              </el-row>
            </div>
          </el-popover>
        </div>

        <div class="user-box">
          <el-dropdown placement="bottom">
            <a href="javascript:void(0)" class="" style="cursor: pointer">
              {{userInfo.userName || 'User Name'}}
            </a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>Signed in as {{userInfo.userName || 'User Name'}}</el-dropdown-item>
              <el-dropdown-item divided><span @click="clearData">{{$i.common.cleanCache}}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <a href="javascript:void(0)" @click="logout">
            {{$i.common.signOut}}
          </a>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import {routerMap} from 'service/router'

  export default {
    name: 'VHeader',
    data() {
      return {
        username: 'User Name',
        userInfo: {},
        routerList: [],
        activeName: null,
        activeOpen: [],
        languageOption: [
          {type: 'zh-CN', label: '简体中文'},
          {type: 'en', label: 'English'},
        ],
        message: {
          count: 0,
          show: false,
          list: [],
          loading: false,
        },
      }
    },
    watch: {
      $route() {
        this.updateMenuActive();
      },
      'message.show'(val) {
        val && this.getMessage();
      }
    },
    created() {
      this.userInfo = this.$localStore.get('user');

      routerMap.forEach(value => {
        // 判断路由是否显示
        if (!value.hidden) {
          this.routerList.push(value)
        }
      });

      this.updateMenuActive()

      this.getMessage();
    },
    methods: {
      logout() {
        this.$confirm(this.$i.hintMessage.logoutHints, this.$i.hintMessage.systemHints, {
          confirmButtonText: this.$i.button.confirm,
          cancelButtonText: this.$i.button.ccancel,
          type: 'warning'
        }).then(() => {
          this.$localStore.clearAll();
          this.$localStore.clearAll();
          this.$router.push('/login');
        }).catch(e => e);
      },
      goMessage({id, type}) {
        id && type && this.$ajax.post(this.$apis.USERMESSAGE_READ, [{id, type}])
          .then(() => this.getMessage());
        this.message.show = false;
        this.$router.push('/message/index');
      },
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
      getMessage() {
        this.message.loading = true;
        this.$ajax.get(this.$apis.USERMESSAGE_UNREADTOP, {top: 8})
          .then(res => {
            this.message.list = res.messages || [];
            this.message.count = res.count || 0;
          })
          .finally(() => {
            this.message.loading = false;
          });
      },
      readMessage() {
        let list = [];
        if (_.isEmpty(this.message.list)) return false;

        this.message.loading = true;

        list = _.map(this.message.list, ({id, type}) => ({id, type}));

        this.$ajax.post(this.$apis.USERMESSAGE_READ, list)
          .then(() => this.getMessage())
          .finally(() => this.message.loading = false);
      },
      clearData() {
        this.$sessionStore.remove('request_cache');
        history.go(0);
      },
      menuAuth(item) {
        if (item.meta && item.meta.auth) {
          return this.$auth(item.meta.auth);
        }
        return true;
      },
      changeLanguage({type}) {
        if (this.$localStore.get('language') !== type) {
          this.$localStore.set('language', type);
          this.clearData();
        }
      }
    },
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../assets/style/base.less';

  .header-box {
    height: 60px;
    position: fixed;
    width: 100%;
    z-index: 999;
    overflow: hidden;
  }

  .ucn-header .link {
    width: 100%;
    height: 100%;
    display: block !important;
  }

  .header {
    height: 100%;
    background-color: @header-back;
  }

  .logo {
    margin-left: 20px;
    margin-right: 40px;
    cursor: pointer;
    vertical-align: middle;
    transition: all .5s;
  }

  .logo-icon {
    margin-right: 15px;
  }

  .title {
    font-size: 24px;
    color: #ffffff;
    font-weight: 400;
    cursor: pointer;
  }

  .ivu-dropdown-rel a {
    color: #ffffff;
    font-size: 14px;
  }

  .ivu-dropdown {
    margin-left: 30px;
  }

  .ivu-dropdown-menu {
    text-align: left;
  }

  .ucn-header-menu {
    display: inline-block;
    line-height: 70px;
    vertical-align: middle;
  }

  .ucn-header-menu .ivu-menu {
    background: none;
  }

  .header-right {
    position: absolute;
    right: 20px;
    top: 0;
    background-color: #3f3f3f;
    padding-left: 10px;
  }

  .user-box {
    vertical-align: middle;
    display: inline-block;
  }

  .user-box a {
    transition: all .5s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80px;
    display: inline-block;
    vertical-align: middle;
  }

  .user-box a:hover {
    color: #eeeeee;
  }

  .el-menu--horizontal {
    border: none;
  }

  .el-menu--horizontal {
    background-color: initial;
  }

  .el-submenu,
  .el-menu-item {
    padding: 0 34px 0 0;
    border: none !important;
    transition: all .5s;
  }

  .el-menu-item:hover,
  .el-menu--horizontal > .el-menu-item.is-active,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    background-color: inherit;
    color: #FFFFFF !important;
    /*background-color: rgba(119, 119, 119, .5);*/
  }

  /*.el-menu-item:hover,
  .el-menu--horizontal > .el-menu-item.is-active,
  .el-menu--horizontal .el-menu-item:focus,
  .el-menu--horizontal .el-menu-item:hover,
  .el-menu--horizontal .el-submenu:focus,
  .el-menu--horizontal .el-submenu:hover {
    background-color: rgba(119, 119, 119, .5);
  }*/

  .message-box {
    position: relative;
    display: inline-block;
    line-height: 20px;
    cursor: pointer;
    margin-right: 10px;
  }

  .message-box i {
    font-size: 20px;
    color: #eeeeee;
  }

  .message-popover .ucn-content-title {
    font-size: 14px;
    width: 100%;
    padding: 15px 10px 10px 10px;
    box-sizing: border-box;
  }

  .message-popover .list {
    width: 100%;
    max-height: 300px;
    overflow: auto;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
  }

  .message-popover .list li {
    padding: 10px 10px 10px 20px;
    cursor: pointer;
    position: relative;
    border-bottom: 1px solid #eeeeee;
  }

  .message-popover .list li.unread:before {
    content: '';
    width: 8px;
    height: 8px;
    top: 50%;
    left: 5px;
    margin-top: -4px;
    border-radius: 50%;
    background-color: #f56c6c;
    position: absolute;
  }

  .message-popover .list li:last-child {
    border-bottom: none;
  }

  .message-popover .list li:hover {
    background-color: #F7F4F4;
  }

  .message-popover .list li span {
    display: block;
    width: 100%;
    text-align: right;
    color: #CDCDCD;
  }

  .icon-menu {
    vertical-align: middle;
    display: inline-block;
  }

  .icon-menu i {
    font-size: 20px;
    color: #eeeeee;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
<style>
  .message-popover {
    padding: 0;
  }

  .ucn-header-submenu a {
    width: 100%;
    height: 100%;
    display: block !important;
  }

  .ucn-header .router-link-active {
    color: #FFFFFF !important;
  }

  .ucn-header-submenu.is-active,
  .ucn-header-submenu:hover {
    background-color: #f5f7fa !important;
  }

  .ucn-header-menu .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background-color: inherit !important;
    color: #FFFFFF !important;
  }

  .ucn-header-menu .el-menu--horizontal > .el-submenu .el-submenu__title {
    color: #909399;
    font-size: 12px;
    padding: 0;
    padding-right: 5px;
    border: none;
    line-height: 58px;
  }

  .ucn-header-menu .el-menu--horizontal > .el-menu-item a {
    font-size: 12px;
    display: inline;
  }

  .ucn-header-menu .el-menu--horizontal > .el-submenu.is-active .el-submenu__title,
  .ucn-header-menu .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: none;
  }

  .ucn-header-menu .is-active .el-submenu__title span {
    color: #ffffff;
  }

  .ucn-header .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
    display: inline;
  }

  .ucn-header .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
  .ucn-header .el-menu--horizontal > .el-submenu:hover .el-submenu__title {
    color: #909399;
  }

  .ucn-language-zh .ucn-header .el-submenu,
  .ucn-language-zh .ucn-header .el-menu-item {
    padding: 0 55px 0 0;
  }

  .ucn-language-zh .ucn-header .el-submenu span,
  .ucn-language-zh .ucn-header .el-menu-item a {
    font-size: 14px;
  }

</style>
