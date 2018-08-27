<template>
  <div class="view-picture">
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      top="0vh"
      :close-on-click-modal="false"
      custom-class="ucn-view-picture">
      <i class="el-icon-error" @click="visible = false"></i>
      <el-carousel v-if="visible" :autoplay="false" height="80vh" class="banner"
                   :initial-index="initialIndex"
                   :indicator-position="data.length > 1 ? 'outside' : 'none'"
                   :arrow="data.length > 1 ? 'always' : 'never'">
        <el-carousel-item v-for="item in data" :key="item">
          <v-image class="img" :src="item"></v-image>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
  import VImage from '../image/index'

  export default {
    name: 'VViewPicture',
    props: {},
    components: {VImage},
    data() {
      return {
        visible: false,
        data: [],
        initialIndex: 0,
      }
    },
    methods: {
      show(pictures, split = ',') {
        if (_.isEmpty(pictures)) {
          return false
        }

        if (_.isString(pictures)) {
          pictures = pictures.split(split);
        }

        if (!_.isArray(pictures) && _.isObject(pictures)) {
          this.initialIndex = _.indexOf(pictures.list, pictures.url);
          pictures = pictures.list;
        }

        this.visible = true;
        this.data = pictures;
      }
    }
  }
</script>

<style scoped>
  .view-picture {

  }

  .view-picture .img {
    width: 3rem;
    height: 2rem;
    cursor: pointer;
  }

  .banner .img {
    width: 100%;
    height: 100%;
  }

  .el-icon-error {
    font-size: 50px;
    position: fixed;
    right: 15px;
    top: 15px;
    color: #dddddd;
    cursor: pointer;
    transition: color .5s;
  }

  .el-icon-error:hover {
    color: #FFFFFF;
  }
</style>
<style>
  .ucn-view-picture .ucn-image {
    background: none !important;
  }

  .ucn-view-picture {
    background-color: rgba(0, 0, 0, 0) !important;
    box-shadow: inherit !important;
    margin: 0;
    width: 80%;
  }

  .ucn-view-picture .el-dialog__header {
    display: none;
  }

  .ucn-view-picture .el-carousel__item:before {
    content: '';
    height: 100%;
    width: 0;
    opacity: 0;
    display: inline-block;
    vertical-align: middle;
  }

  .ucn-view-picture .el-carousel__item .img {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }

  .ucn-view-picture .el-carousel__item .img .image {
    /*background-size: 100% 100%;*/
  }

  .ucn-view-picture .el-dialog__body {
    padding: 0;
  }

  .ucn-view-picture.el-dialog:not(.ucn-dialog-center) {
    vertical-align: middle;
  }

</style>
