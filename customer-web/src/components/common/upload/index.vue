<template>
  <div class='ucn-upload small'>
    <p class="upload-btn" :class="{'only-image':onlyImage}" v-if="!readonly">
      <i class="el-icon-plus"></i>
      <i class="el-icon-upload"></i>
      <input class="upload-file" type="file" ref="upload"
             @change="uploadFile"
             v-bind="{multiple:limit !== 1}"
             :accept="onlyImage ? 'image/*' : ''"/>
    </p>
    <ul class="upload-images" v-if="onlyImage">
      <li v-for="item in fileList" :title="item.showName">
        <v-image class="img-box" :src="item.url"></v-image>
        <div :class="{close:!item.progress || item.progress === 1}" class="progress"
             :style="{width: (item.progress * 100) + '%'}">
        </div>

        <div class="operation-box" :class="{readonly:readonly,image:readonly}"
             v-show="item.progress === 1 || item.url">

          <i class="el-icon-download" @click="$download(item.url)"></i>
          <i class="el-icon-delete" @click="deleteFile(item)"></i>
          <i class="el-icon-view" @click="setViewPicture(item.url)"></i>
        </div>

      </li>
    </ul>

    <ul class="upload-files" v-else>
      <li v-for="item in fileList">
        <i v-if="!readonly" class="el-icon-delete" @click="deleteFile(item)"></i>
        <!--<i class="el-icon-document"></i>-->
        <span v-text="item.fileName" :title="item.fileName" @click="$download(item.url)"></span>
        <i class="el-icon-success" v-if="item.progress === 1"></i>
        <el-progress :percentage="parseInt(item.progress * 100)"
                     v-if="item.progress && item.progress !== 1"></el-progress>
      </li>
    </ul>
  </div>
</template>

<script>
  import OSS from 'ali-oss';
  import co from 'co';
  import VImage from '../image/index'
  import config from '../../../service/config';
  import {mapActions, mapState} from 'vuex';

  const imageType = ['JPG', 'PNG'];
  const prohibitType = ['EXE'];
  const maxSize = 128; // MB


  export default {
    name: 'VUpload',
    props: {
      list: {
        type: [Array, String],
        default() {
          return [];
        },
      },
      ossPrivate: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 1,
      },
      onlyImage: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: 'normal' // normal 、small
      }
    },
    components: {VImage},
    data() {
      return {
        tenantId: '',
        fileList: {},
        bucket: ''
      }
    },
    created() {
      let {tenantId} = this.$localStore.get('user') || {};
      this.tenantId = tenantId;
    },
    mounted() {
      this.bucket = this.ossPrivate ? config.ENV.OSS_BUCKET_PRIVATE : config.ENV.OSS_BUCKET_PUBLIC;
      this.setList(this.list);
    },
    watch: {
      fileList(val) {
      },
      list(val) {
        this.setList(val);
      }
    },
    methods: {
      ...mapActions(['setViewPicture']),
      uploadFile() {
        this.$ajax.get(this.$apis.OSS_TOKEN).then(data => {
          let client = this.signature(data)
            , files = this.$refs.upload.files
            , fileNames = _.pluck(_.values(this.fileList), 'fileName');

          _.map(files, value => {
            let val = new File([value], value.name.replace(/\s/g, ''), {type: value.type});
            if (_.indexOf(prohibitType, val.name.split('.').pop().toLocaleUpperCase()) > -1) {
              return this.$message.warning(`${this.$i.upload.typeLimit}: ${prohibitType.join()} `);
            }

            if (val.size > 1024 * 1024 * maxSize) {
              return this.$message.warning(`${this.$i.upload.sizeLimit}: ${maxSize}MB`);
            }
            _.indexOf(fileNames, val.name) === -1 && this.startUpload(client, val);
          });

          this.$refs.upload.value = '';
        });
      },
      startUpload(client, files) {
        let _this = this
          , params
          , uid = _this.$getUUID()
          , fileKey = `${this.tenantId}/${uid}/${files.name}`;

        if (_.values(_this.fileList).length >= this.limit) {
          return this.$message.warning(`${this.$i.upload.numberLimit}: ${this.limit}`);
        }

        params = _.extend(this.$getOssKey(files.name)[0], {
          fileKey,
          fileName: files.name,
          progress: 0,
          id: uid,
          temporary: true
        });

        _this.$set(_this.fileList, uid, params);

        co(function* () {
          yield client.multipartUpload(fileKey, files, {
            progress: p => {
              return done => {
                if (_this.fileList[uid]) {
                  _this.fileList[uid].progress = p;
                }
                done();
              }
            }
          }).then(result => {
            _this.$set(_this.fileList[uid], 'url', client.signatureUrl(result.name));
            _this.$emit('change', _.values(_this.fileList));
          });
        }).catch(() => {
          this.deleteFile(params);
        });
      },
      deleteFile(item) {
        let list = {};
        item.temporary && this.$ajax.get(this.$apis.OSS_TOKEN).then(data => {
          let client = this.signature(data);
          client.delete(item.fileKey || '');
        });

        _.map(this.fileList, val => {
          if (val.id !== item.id) {
            list[val.id] = val;
          }
        });
        this.fileList = list;
        this.$emit('change', _.values(list));
      },
      signature(params) {
        return new OSS.Wrapper({
          region: params.region,
          accessKeyId: params.accessKeyId,
          accessKeySecret: params.accessKeySecret,
          stsToken: params.securityToken,
          bucket: this.bucket
        });

      },
      filterType(name) {
        let rs = name.split('?')[0].split('/')
          , ns = rs.pop().split('.')
          , param = {};

        param.url = name;
        param.id = rs[rs.length - 1];

        if (ns.length > 1) {
          let k = name.split('?')[0].match(/.com\/(\S*)/);
          param.fileName = ns.join('.');
          param.showType = ns.pop().toLocaleUpperCase();
          param.showName = ns.shift();
          param.fileKey = k ? k[1] : '';
        } else {
          param.showName = ns[0];
          param.showType = 'File';
          param.fileName = ns[0];
        }

        if (_.indexOf(imageType, param.showType) !== -1) {
          param.isImage = true;
        }


        return param;
      },
      setList(list) {
        if (_.isEmpty(list)) {
          this.fileList = {};
          return false;
        }

        if (_.isString(list)) {
          list = [list];
        }

        _.map(list, value => {
          let param;
          if (!_.isString(value)) {
            return;
          }
          param = this.$getOssKey(value)[0];

          if (_.isEmpty(this.fileList[param.id])) {
            this.$set(this.fileList, param.id, param);
          }
        });

        this.$emit('change', _.values(this.fileList), true);
      },
      getFiles(type) {
        let files = _.pluck(_.values(this.fileList), 'fileKey')
          , key = _.map(files, val => `${this.bucket}:${val}`);

        return type ? {key, url: _.pluck(_.values(this.fileList), 'url')} : key;
      },
      reset() {
        this.setList();
        this.$emit('update:list', []);
      }
    },
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .upload-btn {
    width: 100px;
    height: 100px;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    margin-bottom: 5px;
    box-sizing: border-box;
    line-height: 146px;
    position: relative;
    vertical-align: middle;
    display: inline-block;
  }

  .upload-btn:not(.only-image) .el-icon-plus {
    display: none;
  }

  .upload-btn.only-image .el-icon-upload {
    display: none;
  }

  .ucn-upload.small .upload-btn {
    width: 50px;
    height: 50px;
  }

  .upload-btn:not(.only-image) {
    height: 30px !important;
  }

  .upload-btn:not(.only-image) .el-icon-upload {
    font-size: 16px;
  }

  .upload-btn > i {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 24px;
    color: #8c939d;
    transform: translate(-50%, -50%);
  }

  .upload-file {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .upload-images {
    vertical-align: middle;
    display: inline-block;
  }

  .upload-images > li {
    width: 100px;
    height: 100px;
    display: inline-block;
    background-color: #fbfdff;
    word-wrap: break-word;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    margin-right: 5px;
    margin-bottom: 5px;
    position: relative;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .ucn-upload.small .upload-images > li {
    width: 50px;
    height: 50px;
  }

  .operation-box {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 5;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, .8);
    opacity: 0;
    transition: all .5s;
  }

  .operation-box:hover {
    opacity: 1;
  }

  .operation-box i {
    position: absolute;
    top: 50%;
    font-size: 18px;
    color: #ffffff;
    cursor: pointer;
    transition: all .5s;
    transform: translate(-50%, -50%);
  }

  .operation-box .el-icon-download {
    left: 25%;
  }

  .operation-box .el-icon-delete {
    left: 75%;
  }

  .operation-box .el-icon-view {
    left: 75%;
  }

  .operation-box i:hover {
    color: #409eff;
  }

  .operation-box.readonly .el-icon-delete {
    display: none;
  }

  .operation-box:not(.image) .el-icon-view {
    display: none;
  }

  .operation-box.readonly:not(.image) .el-icon-download {
    left: 50%;
  }

  .progress {
    position: absolute;
    height: 100%;
    width: 0;
    background-color: rgba(0, 0, 0, .5);
    /*border-radius: 6px;*/
    bottom: 0;
    left: 0;
    z-index: 2;
    opacity: 1;
    transition: all 1s;
  }

  .progress.close {
    opacity: 0;
    z-index: -10;
    transition: all 1s;
    transition-delay: 1s;
  }

  .progress h6 {
    color: #ffffff;
    width: 100%;
    line-height: 20px;
    text-align: center;
    transition-delay: 1s;
  }

  .upload-images > li label {
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    text-shadow: 1px 1px #eaeaea, -1px -1px #8a8a8a;
    color: #C8C8C8;
    font-size: 20px;
  }

  .ucn-upload.small .upload-images > li label {
    font-size: 16px;
    top: 50%;
    margin-top: -8px;
  }

  .upload-images > li span {
    display: block;
    height: 100%;
    width: 100%;
    text-align: center;
    padding: 3px 3px 20px 3px;
    box-sizing: border-box;
    color: #606266;
    opacity: .7;
  }

  .ucn-upload.small .upload-images > li span {
    display: none;
  }

  .img-box {
    background-position: center;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-size: cover;
    transition-delay: 1s;
  }

  .ucn-upload /deep/ .ucn-image .image {
    border-radius: 6px;
  }

  .upload-files {
    font-size: 12px;
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    max-width: 800px;
  }

  .upload-files li {
    line-height: 20px;
    color: #606266;
    position: relative;
    width: 50%;
    display: flex;
    align-items: center;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .upload-files li:hover {
    color: #409EFF;
  }

  .upload-files li span {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
    padding: 0 5px;
    box-sizing: border-box;
  }

  .upload-files .el-icon-success {
    opacity: 1;
  }

  .upload-files .el-icon-delete {
    cursor: pointer;
  }

  .upload-files .el-icon-success {
    color: #67c23a;
    vertical-align: middle;
  }
</style>
