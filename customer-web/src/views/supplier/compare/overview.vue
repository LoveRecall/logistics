<template>
  <div class="compare-overview">
    <div class="title">
      <span>{{$i.supplier.compareOverview}}</span>
    </div>
    <v-table
      :height="500"
      v-loading="loadingTable"
      class="speTable"
      :data="tableDataList"
      :buttons="[{label:$i.button.modify,type:1,auth:'SUPPLIER:COMPARE_OVERVIEW:MODIFY'},{label: $i.button.detail, type: 2}]"
      @action="btnClick"
      @change-checked="changeChecked">
      <template slot="header">
        <div class="btns" v-authorize="'SUPPLIER:COMPARE_OVERVIEW:READ_ONLY'">
          <el-button
            @click="download"
            v-authorize="'SUPPLIER:COMPARE_OVERVIEW:DOWNLOAD'"
            :disabled="!(tableDataList.length)>0">
            {{$i.common.download+' ('+$i.button.all+')'}}</el-button>
          <el-button
            @click="deleteCompare"
            :disabled="disableDelete"
            :loading="disableClickDeleteBtn"
            v-authorize="'SUPPLIER:COMPARE_OVERVIEW:DELETE'"
            type="danger">{{$i.common.archive}}</el-button>
          <select-search
            v-model="searchValue"
            :options="searchOptions"
            @inputEnter="searchCompare"
            class="search"></select-search>
        </div>
      </template>
    </v-table>
    <page
      @size-change="changeSize"
      @change="changePage"
      :page-sizes="[50,100,200,500]"
      :page-data="pageData"></page>


  </div>
</template>
<script>
  import {dropDown,VPagination} from '@/components/index'
  import selectSearch from '@/components/common/fnCompon/selectSearch'
  import VTable from '@/components/common/table/index'
  import { mapActions } from 'vuex'

  export default {
    name: '',
    components: {
      dropDown,
      selectSearch,
      VTable,
      page:VPagination
    },
    data() {
      return {
        /**
         * 页面基本配置
         * */
        loadingTable:false,         //是否让表格处于loading状态
        disableDelete:true,
        tableDataList:[],
        selectList:[],
        disableClickDeleteBtn:false,
        searchValue:1,
        searchOptions:[
          {
            label:this.$i.supplier.compareName,
            id:1
          },
          {
            label:this.$i.supplier.compareItem,
            id:2
          },
        ],
        params:{
          id: '',
          name: "",
          productName: '',  //sku name EN
          recycle: false,
          pn: 1,
          ps: 50,
          sorts: [
            {
              orderBy: 'updateDt',
              orderType: 'desc',
            }
          ]
        },
        pageData:{}
      }
    },
    methods: {
      ...mapActions(['setMenuLink']),
      hiddenDropDown() {
        this.showdropDown = !this.showdropDown
      },

      //获取data数据
      getList() {
        this.loadingTable=true;
        this.$ajax.post(this.$apis.post_supplier_listCompare,this.params).then(res=>{
          this.tableDataList = this.$getDB(this.$db.supplier.compareView, res.datas,(e)=>{
            if(e.productName.value.length >= 1000){
              e.productName.value.substring(0,1000)+'...'
            }
            e.updateDt.value=this.$dateFormat(e.updateDt.value,'yyyy-mm-dd');
            return e;
          });
          this.selectList=[];
          this.loadingTable=false;
          this.pageData=res;
        }).catch(err=>{
          this.loadingTable=false;
        });
      },
      pageChange(page) {
        console.log(page)
      },
      getSort(val, key) {
        console.log(val, key)
      },

      btnClick(e,type){
        if(type===1){
          //modify
          this.$windowOpen({
            url:'/supplier/compareDetail/modify',
            params:{
              isModify:true,
              compareId:e.id.value,
              compareName:e.name.value
            },
          });
        }else if(type===2){
          //Detail
          this.$windowOpen({
            url:'/supplier/compareDetail/modify',
            params:{
              compareId:e.id.value,
              compareName:e.name.value
            },
          });
        }
      },

      changeChecked(e){
        this.selectList=e;
      },
      searchCompare(e){
        if(!e.id){
          this.$message({
            message: this.$i.common.searchType,
            type: 'warning'
          });
        }else{
          this.loadingTable=true;
          if(e.id===1){
            //compareName
            this.params.productName='';
            this.params.name=e.value;
            this.getList();
          }else if(e.id===2){
            //compareItem
            this.params.name='';
            this.params.productName=e.value;
            this.getList();
          }
        }
      },
      download(){
        let ids=_.pluck(_.pluck(this.selectList,"id"),'value');
        if(ids.length>0){
          this.$fetch.export_task('UDATA_PURCHASE_EXPORT_SUPPLIER_COMPARE_IDS',{ids:ids});
        }else{
          let params=this.$depthClone(this.queryParam);
          this.$fetch.export_task('UDATA_PURCHASE_EXPORT_SUPPLIER_COMPARE_PARAMS',params);
        }
      },
      deleteCompare(){
        this.$confirm(this.$i.common.sureDelete, this.$i.common.prompt, {
          confirmButtonText: this.$i.common.confirm,
          cancelButtonText: this.$i.common.cancel,
          type: 'warning'
        }).then(() => {
          this.disableClickDeleteBtn=true;
          // let id=_.pluck(_.pluck(this.selectList,'id'),'value');
          let params=[];
          _.map(this.selectList,v=>{
            params.push({
              id:v.id.value,
              name:v.name.value
            })
          });
          this.$ajax.post(this.$apis.post_supplier_deleteCompare, params)
            .then(res => {
              this.disableClickDeleteBtn=false;
              this.$message({
                type: 'success',
                message: this.$i.common.deleteTheSuccess
              });
              this.getList();
            })
        })
      },
      /**
       * 分页操作
       * */
      changePage(e){
        this.queryParam.pn=e;
        this.getList();
      },
      changeSize(e){
        this.queryParam.ps=e;
        this.getList();
      }

    },
    created(){
      this.getList();
    },
    mounted(){
      this.setMenuLink([
        {
          path: '/logs',
          query: {code: 'PRUCHASE_SUPPLIER',bizCode: 'BIZ_PURCHASE_SUPPLIER_COMPARE'},
          type: 10,
          label: this.$i.common.log,
          auth: 'SUPPLIER:LOG'
        },
        {
          path: 'compareArchive',
          type: 20,
          label: this.$i.common.archiveSupplier,
          auth:'SUPPLIER:COMPARE_ARCHIVE'
        },
      ]);
    },
    watch:{
      selectList(n){
        if(n.length>0){
          this.disableDelete=false;
          this.downloadBtnInfo=n.length;
        }else{
          this.disableDelete=true;
          this.downloadBtnInfo='All';
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  .compare-overview {

  .title{
    font-weight: bold;
    font-size: 18px;
    height: 32px;
    line-height: 32px;
    color:#666666;
  }
  .btns{
  .search{
    float: right;
  }
  }
  .speTable{
    margin-top: 10px;
  }
  }
  .status{
    margin-top: 20px;
  }

</style>
