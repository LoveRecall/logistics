<template>
  <div class="ucn-message-board ucn-container-right" :class="{show:layout.paddingRight}">
    <div class="title-box">
      <h3 class="ucn-content-title inline">{{$i.common.messageBoard}}</h3>
      <i class="el-icon-d-arrow-right"
         @click="changeShow"></i>
    </div>

    <div class="content">
      <ul class="message-box" v-loading="contentLoading" ref="messageBox" :class="{readonly:readonly}">
        <li v-for="item in messageList" :key="item.id">
          <span class="name">{{item.sendByUserName}}</span>
          <label class="time">{{$dateFormat(item.sendTime,'yyyy-mm-dd HH:MM:ss')}}</label>
          <pre class="box" v-if="item.content.trim()" v-text="item.content"></pre>
          <div style="display: block;margin-top: 10px">
            <v-image class="image" v-for="(imgItem,index) in item.picUrls" :key="imgItem" :src="imgItem"
                     width="55px" height="55px"
                     @click="setViewPicture({url:item.picUrls[index],list:item.picUrls})"></v-image>
          </div>
        </li>
      </ul>
      <div class="form-box" v-if="!readonly">
        <div class="form">
          <textarea v-model="messageContent"
                    @keydown="addListener"></textarea>
          <br/>
          <div class="upload_div">
            <v-upload only-image ref="fileUpload" :limit="5"></v-upload>
          </div>

        </div>
        <div class="btn-box">
          <el-button type="primary" @click='sendMessage' :loading="submitLoading">{{$i.common.submit}}</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  /**
   * <v-message-board module="业务模块名称/workbench" code="子业务模块/workbench" id="详情id"></v-message-board>
   */


  import VUpload from '../upload/index'
  import VImage from '../image'
  import {mapActions, mapState} from 'vuex';

  export default {
    name: 'VMessageBoard',
    components: {
      VUpload,
      VImage
    },
    //传送的数据
    props: {
      module: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      id: {
        type: [String, Number],
        default: ''
      },
      readonly: {
        type: Boolean,
        default: false
      },
      arguments: {
        type: Object
      }
    },
    data() {
      return {
        submitLoading: false,
        contentLoading: false,
        messageContent: '',
        messageList: []
      }
    },
    computed: {
      ...mapState({
        layout: state => state.layout
      }),
    },
    watch: {
      module() {
        this.getMessage();
      },
      code() {
        this.getMessage();
      },
      id() {
        this.getMessage();
      }
    },
    created() {
      if (this.$userAction.get('messageBoard')) {
        this.layout.paddingRight = '367px'
      }
    },
    mounted() {
      this.getMessage();
    },
    methods: {
      ...mapActions(['setViewPicture']),
      sendMessage() {
        let files = this.$refs.fileUpload.getFiles() || []
          , {partnerType, companyId, tenantId, userId} = this.$localStore.get('user')
          , sender = [null, 'purchasers', 'suppliers', 'servicers']
          , params;
        if (!this.messageContent && _.isEmpty(files)) {
          return this.$message.warning(this.$i.common.content);
        }

        this.submitLoading = true;
        params = {
          moduleCode: this.module,
          bizCode: this.code,
          bizNo: this.id,
          content: this.messageContent,
          picPaths: files
        };

        if (this.arguments) {
          params = _.extend(params, this.arguments);
          params[sender[partnerType]] = [{companyId, tenantId, userId}];
        }

        this.$ajax.post(this.$apis.CHATMESSAGE_ADD, params).then(data => {
          this.messageContent = '';
          this.getMessage();
          this.$refs.fileUpload.reset();
          this.$emit('send');
        }).finally(() => this.submitLoading = false);
      },
      getMessage() {
        if (!this.module || !this.code || !this.id) {
          return false;
        }
        this.contentLoading = true;
        this.$ajax.post(this.$apis.CHATMESSAGE_QUERY,
          {moduleCode: this.module, bizCode: this.code, bizNo: this.id, pn: 1, ps: 100})
          .then(data => {
            data = data.datas || [];
            this.messageList = data.reverse();
            this.$refs.messageBox && this.$nextTick(() => this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight)
          })
          .finally(() => this.contentLoading = false);
      },
      changeShow() {
        this.layout.paddingRight = this.layout.paddingRight ? 0 : '365px';
        this.$userAction.set('messageBoard', !!this.layout.paddingRight);
      },
      addListener(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          if (e.ctrlKey) {
            this.messageContent += '\n';
          } else {
            this.sendMessage();
          }
        }
      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ucn-message-board {
    width: 350px;
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    z-index: 920;
    box-sizing: border-box;
    background-color: #FFFFFF;
    transition: all .5s;
    transform: translate(120%, 0);
    padding: 100px 10px 10px 10px;

  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    padding: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: rgba(0, 0, 0, .2)
  }

  ::-webkit-scrollbar-track {
    border-radius: 2px;
    background: rgba(128, 133, 144, 0)
  }

  .ucn-message-board .content {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ucn-message-board .title-box {
    width: 50%;
    top: 60px;
    left: 0;
    line-height: 36px;
    height: 36px;
    position: absolute;
    transition: all .5s;
    transition-delay: .5s;
    transform: translate(-150%, 0);
    box-sizing: border-box;
    background-color: #FFFFFF;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, .1);
  }

  .ucn-message-board .title-box .ucn-content-title {
    padding-left: 10px;
    font-size: 14px;
  }

  .ucn-message-board .title-box * {
    color: #606266;
  }

  .ucn-message-board .title-box i {
    font-size: 20px;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    transition: all .5s;
    transform: rotate(180deg);
  }

  .ucn-message-board.show {
    /*padding-right: 370px;*/
    transform: translate(0, 0);
  }

  .ucn-message-board.show .title-box {
    transform: translate(0, 0);
  }

  .ucn-message-board.show .title-box {
    box-shadow: none;
    transition-delay: 0s;
    width: 100%;
  }

  .ucn-message-board.show .title-box i {
    transform: rotate(0);
    transition-delay: .5s;
  }

  .message-box {
    height: 75%;
    width: 100%;
    overflow: auto;
    background-color: rgba(245, 245, 245, .3);
    padding: 10px 10px;
    border: 1px solid rgba(220, 220, 220, .5);
  }

  .message-box.readonly {
    height: 100%;
  }

  .message-box > li {
    position: relative;
    margin-bottom: 10px;
  }

  .message-box .name {
    color: #409EFF;
  }

  .message-box .time {
    position: absolute;
    right: 0;
    top: 0;
    color: #cccccc;
  }

  .message-box .box {
    color: #666666;
    padding: 10px 10px 0 10px;
    line-height: 18px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .form-box {
    width: 100%;
  }

  .btn-box {
    width: 100%;
    text-align: right;
  }

  .form-box .form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .form-box textarea {
    width: 100%;
  }

  .text_enter {
    width: 90%;
    height: 60px;
    border: 0;
    overflow: hidden;
    resize: none;
    margin: auto;
    margin-top: 10px;
  }

  .upload_div {
    margin-bottom: 10px;
    width: 100%;
  }

  .text_enter::-webkit-input-placeholder {
    padding-left: 10px;
    color: #BEBEBE
  }

  .messagelist_upload {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-right: 5%;
  }

  .image {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .image /deep/ img {
    width: 100%;
    height: 100%;
  }

  .view-picture /deep/ .el-dialog__wrapper {
    position: fixed;
    width: 100vw;
    height: 100%;
    top: 0;
    left: 0;
    transform: translate(calc(350px - 100vw), 0);
  }

</style>
<style>
  .ucn-message-board .el-upload--picture-card {
    width: 38px;
    height: 38px;
    line-height: 38px;
  }

  .ucn-message-board .el-upload {
    width: 38px;
    height: 38px;
  }

  .ucn-message-board .el-upload-list__item {
    width: 38px;
    height: 38px;
  }

  .ucn-message-board .el-upload-list--picture-card .el-upload-list__item-actions span + span {
    margin-left: 0;

  }

  .ucn-message-board .el-icon-zoom-in {
    display: none
  }

  .ucn-message-board .el-icon-delete {
  }

  .ucn-message-board textarea {
    resize: none;
    min-height: 100px !important;
    transition: all .5s;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    border: 1px solid rgba(220, 220, 220, .3);
  }

  .ucn-message-board textarea:focus {
    border: 1px solid rgba(220, 220, 220, 1);
  }
</style>
