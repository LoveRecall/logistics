<template>
  <el-row>
    <!--<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="upload-box">
        <span>{{ title }}</span>
        <upload :accept="accept" @getres="getres" :action="action" :disabled="disabled" v-if="edit"/>
        <ul class="el-upload-list el-upload-list&#45;&#45;text el-input">
          <li tabindex="0" class="el-upload-list__item is-success file-list" v-for="(a, i) of fileList">
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{ a.name }}asdasdasd33223f2f23g23g32g23g23g23g23g</a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
            <i class="el-icon-close" @click.stop="removeFile(i)"></i>
          </li>
        </ul>
      </div>
    </el-col>-->
  </el-row>
</template>
<script>
// import { Upload } from '@/components/index'

export default {
  props: {
    title: String,
    accept: String,
    action: String,
    disabled: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    // Upload
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    getres (e) {
      this.fileList.push(e)
    },
    removeFile (i) {
      this.$confirm('是否删除该文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileList.splice(i, 1)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.upload-box {
  display:flex;
  align-items: center;
  padding:10px 0;
  span {
    width: 200px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    display:inline-block;
    font-size:12px;
    text-align: right;
    padding-right:10px;
    box-sizing: border-box;
  }
  .el-select, .el-input {
    flex:1;
  }
}
.file-list {
  display: inline-block;
  width: 16%;
  margin-right: 5%;
  &:nth-child(5n) {
    margin-right: 0;
  }
}
</style>
