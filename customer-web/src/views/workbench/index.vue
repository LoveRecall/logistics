<template>
  <div class="workbench">
    <!--<h1 @click="$refs.exportTemplate.start({ids:['82161595060334592','82161907640840192']})">
      export</h1>-->
    <ul class="welcome-box ucn-container-right" :class="{show:settingStateShow}">
      <li class="title" v-text="$i.workbench.settingState"></li>
      <li v-if="!settingState.departmentInfo && userInfo.userType === 0">
        <el-checkbox disabled>{{$i.workbench.settingDepartment}}</el-checkbox>
        <br>
        <router-link to="/settings/department">
          <el-button type="text">Go set>></el-button>
        </router-link>
      </li>
      <li v-if="!settingState.companyInfo && userInfo.userType === 0">
        <el-checkbox disabled>{{$i.workbench.settingCompany}}</el-checkbox>
        <br>
        <router-link to="/settings/companyInfo">
          <el-button type="text">Go set>></el-button>
        </router-link>
      </li>
      <li v-if="!settingState.categoryInfo && userInfo.userType === 0">
        <el-checkbox disabled>{{$i.workbench.settingCategory}}</el-checkbox>
        <br>
        <router-link to="/settings/category">
          <el-button type="text">{{$i.workbench.goSet}}>></el-button>
        </router-link>
      </li>
      <!--<li v-if="!settingState.personalInfo">
        <el-checkbox disabled>{{$i.workbench.settingPersonal}}</el-checkbox>
        <br>
        <router-link to="/settings/Personal">
          <el-button type="text">{{$i.workbench.goSet}}>></el-button>
        </router-link>
      </li>-->
    </ul>

    <!--<div class="quickLink">
      <h3 class="ucn-content-title inline" @click="$refs.importFile.show()" v-text="$i.workbench.quickLink"></h3>
      <el-button size="mini" type="primary" icon="el-icon-plus"
                 style="display: inline-block;margin-left: 30px!important;"
                 @click="quickLink.show = true"></el-button>
      <br/>
      <el-button size="mini" v-for="item in quickLink.list" :key="item.id" v-if="$auth(item.auth)">
        <router-link :to="item.link || '/'">
          {{item.label}}
        </router-link>
      </el-button>
    </div>-->
    <v-data-dashboard v-authorize="'WORKBENCH:DATA_DASHBOARD'"></v-data-dashboard>
    <br/><br/>
    <el-row :gutter="10">
      <el-col :span="12">
        <v-table-data :type="1"></v-table-data>
      </el-col>
      <el-col :span="12">
        <v-table-data :type="2"></v-table-data>
      </el-col>
      <el-col :span="12">
        <v-table-data :type="3"></v-table-data>
      </el-col>
      <el-col :span="12">
        <v-table-data :type="4"></v-table-data>
      </el-col>
    </el-row>
    <v-export-template ref="exportTemplate" code="SKU_PURCHASE_EXPORT_IDS"></v-export-template>
    <!--<button @click="test">sadas</button>-->
    <!--<v-upload ref="upload"></v-upload>-->
    <!--<v-import-template ref="importFile" code="PRODUCT_SUPPLIER" biz-code="PRODUCT_SUPPLIER"></v-import-template>-->
    <!--<v-message-board module="workbench" code="workbench" id="123" readonly></v-message-board>-->
  </div>
</template>

<script>
  import VDataDashboard from './dataDashboard'
  import VTableData from './tableData'
  import VBasicInfo from './basicInfo'
  import config from 'service/config'
  import {mapActions, mapState} from 'vuex';
  import {
    VHistoryModify,
    VMessageBoard,
    VTimeZone,
    VUpload,
    VImportTemplate,
    VExportTemplate,
    VImage
  } from '@/components/index';

  export default {
    name: 'workbench',
    components: {
      VImportTemplate,
      VExportTemplate,
      VUpload,
      VDataDashboard,
      VTableData,
      VBasicInfo,
      VHistoryModify,
      VMessageBoard,
      VTimeZone,
      VImage,
    },
    data() {
      return {
        visible: false,
        settingState: {},
        settingStateShow: false,
        settingStateLoading: false,
        userInfo: this.$localStore.get('user') || {},
      }
    },
    created() {
      //
    },
    mounted() {
      this.userInfo.userType === 0 && this.getBasicInfo();
      /*// 第一种 单个设置
      this.setMenuLink({
        path: '',
        query: {code: ''},
        type: 10,
        auth: 'ADASDAS',
        label: this.$i.common.archive
      });

       // 多个设置
       this.setMenuLink([{
         path: '',
         query: {code: ''},
         type: 10,
         label: this.$i.common.archive
       }, {
         path: '',
         query: {code: ''},
         type: 100, // type = 100  为log
         label: this.$i.common.archive
       }]);*/

    },
    computed: {
      ...mapState({
        quickLink: state => state.quickLink,
        layout: state => state.layout
      }),
    },
    methods: {
      ...mapActions(['setMenuLink']),
      getBasicInfo() {
        this.settingStateLoading = true;
        this.$ajax.post(this.$apis.USER_CUSTOMER_ISSETUSERINFO, {type: config.CLIENT_TYPE})
          .then(res => {
            if (!res.categoryInfo || !res.companyInfo || !res.departmentInfo) {
              this.settingStateShow = true;
              this.layout.paddingRight = '240px'
              this.settingState = res;
            }
          })
          .finally(() => this.settingStateLoading = false);
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workbench .el-col-12 {
    margin-bottom: 20px;
  }

  .quickLink .el-button {
    margin-top: 10px;
  }

  .welcome-box {
    position: fixed;
    top: 0;
    right: 0;
    width: 230px;
    height: 100%;
    padding: 100px 10px 10px 10px;
    background-color: #FFFFFF;
    box-sizing: border-box;
    z-index: 10;;
    transition: all .5s;
    transform: translate(120%, 0);
  }

  .welcome-box.show {
    transform: translate(0, 0);
  }

  .welcome-box li {
    margin-top: 10px;
  }

  .welcome-box .title {
    font-size: 16px;
    line-height: 20px;
    color: #666666;
  }

  .welcome-box /deep/ .el-checkbox__inner,
  .welcome-box /deep/ .el-checkbox__label {
    cursor: pointer !important;
    color: #999999 !important;
  }

  .welcome-box /deep/ .el-button {
    margin-left: 22px !important;
  }

</style>
<style>
  /*.workbench-notify {
    !*width: 250px;*!
  }*/
</style>
