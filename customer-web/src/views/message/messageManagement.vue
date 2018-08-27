<template>
    <div>
        <div class="head">
            <el-button @click="addNews" type="primary">{{$i.common.add}}</el-button>
            <!--<el-button @click="$router.back(-1)" >{{$i.button.cancel}}</el-button>-->
        </div>
        <div class="body">
          <v-table
            :data="tabData"
            hide-filter-value
            :height="500"
            disabled-sort
            :selection="false"
          />
          <page
          :page-data="pageData"
          @change="handleSizeChange"
          :page-sizes="[50,100,200]"
          @size-change="pageSizeChange"></page>
        </div>

        <el-dialog
                class="speDialog"
                title="Add News"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-input
                type="input"
                :rows="2"
                :placeholder="$i.common.title"
                style="margin-bottom:10px"
                v-model="params.title"
               >
            </el-input>
            <el-input
                    type="textarea"
                    :rows="2"
                    :placeholder="$i.common.content"
                    v-model="params.content">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postAddMessage()">{{$i.common.release}}</el-button>
                <el-button @click="cencl()">{{$i.common.cancel}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { VTable,VPagination } from '@/components/index';
    import config from 'service/config';
    export default {
        name: "message-management",
        components:{
          VTable,
          page:VPagination
        },
        data(){
            return{
                tabData:[],
                tabLoad:true,
                pageData:{},
                params:{
                  title:'',
                  contentZh:'',
                  language:'',
                  contentEn:'',
                  content:'',
                },
                pData:{
                  ps:50,
                  pn:1
                },
                dialogVisible:false,            //弹出框显示隐藏
                newsContent:'',              //新增消息的内容
            }
        },
        methods:{
            //表格操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //发布
            publish(e){
                console.log(e)
            },
            handleSizeChange(val) {
                this.pData.pn = val;
                this.getMessageList();
            },
            pageSizeChange(val) {
                this.pData.ps = val;
                this.getMessageList();
            },
            //新增消息
            addNews(){
                this.dialogVisible=true;
            },

            //点击外部取消时的提示
            handleClose(done) {
                console.log('取消了')
                // this.$confirm('确认关闭？')
                //     .then(_ => {
                //         done();
                //     })
                //     .catch(_ => {});
                done();
            },
          cencl(){
            this.dialogVisible = false
            this.params = {}
          },
          getMessageList(){
            let url, column;
            this.tabLoad = true;
            if(this.$route.query.type == 1) {;
              url = this.$apis.post_systemmessage_query;
            } else {
              url = this.$apis.post_companymessage_query;
            };
            column = this.$db.message.table;
            this.$ajax.post(url,this.pData)
              .then(res => {
                this.tabData = this.$getDB(column, res.datas,item=>{
                  _.mapObject(item, val => {
                    val.type === 'textDate' && val.value && (val.value = this.$dateFormat(val.value, 'yyyy-mm-dd HH:MM:ss'))
                    return val
                  })
                });
                this.pageData=res;
                this.tabLoad = false;
              })
              .catch(() => {
                this.tabLoad = false;
              })
          },
          postAddMessage(){
            let url
            // if(this.$route.query.type == 1) {;
            //   url = this.$apis.post_sys_addsystemmessage;
            // } else {
            //   url = this.$apis.post_company_addcompanymessage;
            // };
            url = this.$apis.post_company_addcompanymessage
            this.params.language = config.LANGUAGE
            this.$ajax.post(url, this.params)
            .then(res => {
              this.$message({
                message: this.$i.common.addSuccess,
                type: 'success',
              });
              this.params = {}
              this.getMessageList()
            })
            .catch(() => {
              console.log('发送失败')
            })
            this.dialogVisible = false
          },

        },
      //get_messagesetting_query
      created(){
        this. getMessageList()
      }
    }
</script>

<style scoped>
    .head{
        padding: 10px 0;
    }
    .speDialog >>> .el-dialog__footer{
        text-align: center;
    }
</style>
