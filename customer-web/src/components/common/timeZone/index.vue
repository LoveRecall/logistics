<template>
  <div class="time-zone">
    <el-select v-model="selectValue" @change="val => {$emit('update:value',val)}"
               placeholder="请选择时区">
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>

  </div>
</template>

<script>

  export default {
    name: 'VTimeZone',
    components: {},
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        selectValue: '',
        dataList: [],
      }
    },
    watch: {},
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        this.$ajax.get(this.$apis.TIMEZONE_ALL, {}, {cache: true})
          .then(data => {
            this.dataList = data;
          });

      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .time-zone {
    display: inline-block;
    max-width: 160px;
  }
</style>
