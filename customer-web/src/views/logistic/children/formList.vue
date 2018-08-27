<template>
  <div>
    <div class="hd" v-if="showHd"></div>
    <div class="hd active">{{ title }}</div>
    <!-- <el-row :gutter="10"> -->
      <el-form label-width="300px" label-position="right" class="form" >
        <!-- <el-col :xs="gap" :sm="gap" :md="gap" :lg="gap" :xl="gap" v-for="a of listData" :key="'el-col-' + a.label"> -->
        <div v-for="a of listData" :key="'el-col-' + a.label" class="formWarp">
          
          <el-form-item v-if="!edit" :label="a.label+'：'">
            <p class="textFilter" :style="fieldDisplay&&fieldDisplay.hasOwnProperty(a.key) ? definedStyle : ''">{{ textFilter(a) }}</p>
          </el-form-item>
          <div v-else>
            <el-form-item :required="a._rules&&a._rules.required" :show-message="false" :label="a.label+'：'" v-if="a.type === 'input'">
              <el-input maxlength="500" :placeholder="$i.logistic.placeholder" :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty(a.key)}" v-model="a.value" :disabled="a.disabled" @change="selectChange(a.value,a.key)"/>
            </el-form-item>
            
            <el-form-item :required="a._rules&&a._rules.required" :show-message="false" :label="a.label+'：'" v-if="a.type === 'selector'">
              <el-select v-model="a.value" :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty(a.key)}" :placeholder="$i.logistic.placeholder" :disabled="a.disabled" @change="selectChange(a.value,a.key)">
                <el-option :disabled="item.disabled" :label="a.key=='exchangeCurrency' ? item.code : item.name" :value="isNaN(item.code) ? item.code : Number(item.code)" v-for="item of selectArr[a.key]" :key="item.id"/>
              </el-select>
            </el-form-item>

            <el-form-item :required="a._rules&&a._rules.required" :show-message="false" :label="a.label+'：'" v-if="a.type === 'filterable'">
              <el-select filterable v-model="a.value" :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty(a.key)}" :placeholder="$i.logistic.placeholder" :disabled="a.disabled" @change="selectChange(a.value,a.key)">
                <el-option :label="item.name" :value="isNaN(item.code) ? item.code : Number(item.code)" v-for="item of selectArr.country" :key="item.id"
                  v-if="selectArr.country" />
              </el-select>
            </el-form-item>

            <el-form-item :required="a._rules&&a._rules.required" :show-message="false" :label="a.label+'：'" v-if="a.type === 'date'">
              <el-date-picker :disabled="a.disabled" format="yyyy-MM-dd" v-model="a.value" :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty(a.key)}" align="right" type="date" :placeholder="$i.logistic.placeholder" :picker-options="pickerOptions" @change="selectChange(a.value,a.key)"/>
            </el-form-item>
          </div>
        </div>
        <!-- </di> -->
      </el-form>
    <!-- </el-row> -->
  </div>
</template>
<script>
  export default {
    props: {
      DeliveredEdit:[Boolean,String],
      name:String,
      definedStyle:{
        type:Object,
        default (){
          return {
            background:'yellow'
          }
        }
      },
      fieldDisplay:Object,
      title: String,
      showHd: {
        type: Boolean,
        default: true
      },
      edit: {
        type: Boolean,
        default: false
      },
      gap: {
        type: Number,
        default: 8
      },
      listData: {
        type: Array,
        default () {
          return []
        }
      },
      selectArr: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        paymentList: [],
        hightLightModify:{},
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() > Date.now();
          // },
          shortcuts: [{
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: 'A week ago',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }
      } 
    },
    methods: {
      selectChange(value,key){
        if(key=='exchangeCurrency'){
          this.$emit('selectChange',value); 
        }
        this.$set(this.hightLightModify,key,value);
        this.$emit('hightLightModifyFun',this.hightLightModify,this.name);
      },
      textFilter(a) {
        if (a.type === 'input' || a.type === 'text') return a.value
        if (a.type === 'date') return a.value ? this.$dateFormat(a.value, 'yyyy-mm-dd') : null
        if (a.type === 'selector' && this.selectArr[a.key]) {
          let obj = this.selectArr[a.key].find(item => item.code == a.value)
          return obj ? a.key=='exchangeCurrency' ? obj.code : obj.name : null;
        }
        if(a.type === 'filterable' && this.selectArr.country){
          let obj = this.selectArr.country.find(item => item.code == a.value)
          return obj ? obj.name : null
        }
      } 
    }
  }

</script>
<style lang="less" scoped>
  .hd-top {
    font-size: 18px;
    color: #666;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    padding: 0 15px;
  }

  .hd {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    padding: 0 15px;
    font-weight: bold;
    &.active {
      border: none;
    }
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    /deep/.el-form-item__label{
      font-weight: bold;
    }
    /deep/.el-form-item p{
      min-width: 220px;
    }
    /deep/.el-input,
    /deep/.el-input__inner {
      width: 100%;
      min-width: 150px;
    }
    /deep/.el-select{
      width: 100%;
      min-width: 150px;
    }
    /deep/.definedStyleClass input{
      background:yellow;
    }
    .formWarp{
      min-width: 33.3%;
    }
  }
  .el-select-dropdown__item.is-disabled{
    display:none;
  }
</style>
