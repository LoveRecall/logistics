<template>
  <div>
    <div class="hd"></div>
    <div class="hd active">{{ title }}</div>
		<table border="0" v-if="listData.length>0">
			<tr>
        <th>{{$i.logistic.dateName}}</th>
        <th>{{$i.logistic.EstDate}}</th>
        <th>{{$i.logistic.ActDate}}</th>
      </tr>
      <tr v-if="listData[0].bookingDate"> 
        <td>{{$i.logistic.Booking}}</td>
        <td>--</td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('bookingDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].bookingDate.value, 'yyyy-mm-dd')}}</span> 
          <el-date-picker :picker-options="BookingTimeOptions" :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('bookingDate')}" @change="modifyTime(listData[0].bookingDate.value,listData[0].bookingDate._key)" v-if="edit&&(pageTypeCurr=='logisticPlanDetail'||pageTypeCurr=='placeLogisticPlan')" format="yyyy-MM-dd" v-model="listData[0].bookingDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
      <tr v-if="listData[0].actContainerStuffingDate">
        <td>{{$i.logistic.Loading}}</td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('estContainerStuffingDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].estContainerStuffingDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker v-if="edit&&(pageTypeCurr=='logisticPlanDetail'||pageTypeCurr=='placeLogisticPlan')" @change="modifyTime(false,listData[0].estContainerStuffingDate._key)" format="yyyy-MM-dd" v-model="listData[0].estContainerStuffingDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('actContainerStuffingDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].actContainerStuffingDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker :picker-options="LoadingTimeOptions" v-else @change="modifyTime(listData[0].actContainerStuffingDate.value,listData[0].actContainerStuffingDate._key)" format="yyyy-MM-dd" v-model="listData[0].actContainerStuffingDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
      <tr v-if="listData[0].declareDate">
        <td>{{$i.logistic.declared}}</td>
        <td>
          --
        </td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('declareDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].declareDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker :picker-options="cleanceTimeOptions" @change="modifyTime(false,listData[0].declareDate._key)" v-if="edit&&(pageTypeCurr=='logisticPlanDetail'||pageTypeCurr=='placeLogisticPlan')" format="yyyy-MM-dd" v-model="listData[0].declareDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
      <tr v-if="listData[0].estDepartureDate">
        <td>{{$i.logistic.shipped}}</td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('estDepartureDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].estDepartureDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker v-if="edit&&(pageTypeCurr=='logisticPlanDetail'||pageTypeCurr=='placeLogisticPlan')" @change="modifyTime(false,listData[0].estDepartureDate._key)" format="yyyy-MM-dd" v-model="listData[0].estDepartureDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('actDepartureDate')}">
          <span v-if="!edit||pageTypeCurr!='loadingListDetail'||pageTypeCurr!='placeLogisticPlan'">{{$dateFormat(listData[0].actDepartureDate.value, 'yyyy-mm-dd') || '--' }}</span>
          <el-date-picker v-else format="yyyy-MM-dd" v-model="listData[0].actDepartureDate.value" @change="modifyTime(false,listData[0].actDepartureDate.value)" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
      <tr v-if="listData[0].estCustomsCleanceDate">
        <td>{{$i.logistic.cleance}}</td>
        <td>
          --
        </td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('actCustomsCleanceDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].actCustomsCleanceDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker v-else @change="modifyTime(listData[0].actCustomsCleanceDate.value,listData[0].actCustomsCleanceDate._key)" format="yyyy-MM-dd" v-model="listData[0].actCustomsCleanceDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
      <tr v-if="listData[0].estReleaseDate">
        <td>{{$i.logistic.release}}</td>
        <td>
          --
        </td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('actReleaseDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].actReleaseDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker v-else format="yyyy-MM-dd" @change="modifyTime(false,listData[0].actReleaseDate._key)" v-model="listData[0].actReleaseDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
      <tr v-if="listData[0].estArrivalDate">
        <td>{{$i.logistic.arrival}}</td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('estArrivalDate')}">
          <span v-if="!edit">{{$dateFormat(listData[0].estArrivalDate.value, 'yyyy-mm-dd')}}</span>
          <el-date-picker v-if="edit&&(pageTypeCurr=='logisticPlanDetail'||pageTypeCurr=='placeLogisticPlan')" @change="modifyTime(false,listData[0].estArrivalDate.value)" format="yyyy-MM-dd" v-model="listData[0].estArrivalDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
        <td :class="{ definedStyleClass : fieldDisplay&&fieldDisplay.hasOwnProperty('actArrivalDate')}">
          <span v-if="!edit||pageTypeCurr!='loadingListDetail'||pageTypeCurr!='placeLogisticPlan'">{{$dateFormat(listData[0].actArrivalDate.value, 'yyyy-mm-dd') || '--'}}</span>
          <el-date-picker v-else format="yyyy-MM-dd" :picker-options="arrivalTimeOptions" @change="modifyTime(false,listData[0].actArrivalDate.value)" v-model="listData[0].actArrivalDate.value" align="right" type="date" :placeholder="$i.logistic.placeholder"/>
        </td>
      </tr>
		</table>
  </div>
</template>

<script>
  export default {
     data() {
      return {
        BookingTime:'',
        LoadingTime:'',
        cleanceTime:'',
        hightLightModify:{},
        BookingTimeOptions: {
          disabledDate:(time)=> {
            //当 如果选择前置条件  这后置的会清空
            this.listData[0].actContainerStuffingDate.value = '';  //实际装柜日期
            this.listData[0].declareDate.value = '';  //实际报关日期
          }
        },
        LoadingTimeOptions: {
          disabledDate:(time)=> {
            this.listData[0].declareDate.value = '';  //实际报关日期
            return this.$dateFormat(time.getTime(),'yyyy-mm-dd') < this.listData[0].bookingDate.value;
          }
        },
        cleanceTimeOptions: {
          disabledDate:(time)=> {
            return this.$dateFormat(time.getTime(),'yyyy-mm-dd') < this.listData[0].actContainerStuffingDate.value;
          }
        },
        arrivalTimeOptions: {
          disabledDate:(time)=> {
            return this.$dateFormat(time.getTime(),'yyyy-mm-dd') < this.listData[0].actDepartureDate.value;
          }
        }
      }
    },
    props: {
      title: String,
      fieldDisplay:Object,
      listData: Array,
      basicInfoArr: Array,
      edit:Boolean,
      selectArr:Object,
      shipmentStatus:[Number,String]
    },
    computed: {
      pageTypeCurr(){
        return this.$route.name;
      }
    },
    methods:{
      CompareDate(d1,d2)
      {
        return ((new Date(d1.replace(/-/g,"\/"))) - (new Date(d2.replace(/-/g,"\/"))));
      },
      modifyTime(arg,key){
        //因为有些 日期不需要出发 业务逻辑  所以多加一个参数 区别
        this.listData[0][key].value = this.$dateFormat(this.listData[0][key].value,'yyyy-mm-dd');
        this.$set(this.hightLightModify,key,arg);
        this.$emit('hightLightModifyFun',this.hightLightModify,this.name);
        if(arg){
          //初始化值
          let _shipmentStatus = this.basicInfoArr.length ? this.basicInfoArr.find(el=> el.key == 'shipmentStatus')&&this.basicInfoArr.find(el=> el.key == 'shipmentStatus').value : 0;
          this.BookingTime = this.listData[0].bookingDate.value&&this.$dateFormat(new Date(this.listData[0].bookingDate.value),'yyyy-mm-dd');
          this.LoadingTime = this.listData[0].actContainerStuffingDate.value&&this.$dateFormat(new Date(this.listData[0].actContainerStuffingDate.value),'yyyy-mm-dd');
          this.cleanceTime = this.listData[0].actCustomsCleanceDate.value&&this.$dateFormat(new Date(this.listData[0].actCustomsCleanceDate.value),'yyyy-mm-dd');
          let currTime = this.$dateFormat(new Date(),'yyyy-mm-dd');
          let status = this.$depthClone(this.shipmentStatus || 0);
          if(_shipmentStatus!=6){
            if(this.BookingTime&&this.CompareDate(this.BookingTime,currTime)<=0&&[0].includes(this.shipmentStatus)){
              status=1;
            }
            if(this.LoadingTime&&this.CompareDate(this.LoadingTime,currTime)<=0&&[0,1,2,3].includes(this.shipmentStatus)){
              status=4;
            }
            if(this.cleanceTime&&this.CompareDate(this.cleanceTime,currTime)<=0&&[0,1,2,3,4].includes(this.shipmentStatus)){
              status=5;
            }
          }
          this.changeShipmentStatusOption(status);
          this.$emit('modifyTime',{BookingTime:this.BookingTime,LoadingTime:this.LoadingTime,cleanceTime:this.cleanceTime});
        }
      },
      changeShipmentStatusOption(status){
        let shipmentStatusCurr = this.basicInfoArr.find(el=> el.key=='shipmentStatus');
        shipmentStatusCurr && (shipmentStatusCurr.disabled = true);
        let arr = this.$depthClone(this.selectArr.shipmentStatus).map(el=> {
          el.disabled = true;
          return el;
        });
        if(status==0||status==1){
          shipmentStatusCurr && (shipmentStatusCurr.disabled = false);
          arr = this.$depthClone(arr).map(el=> {
            if(el.code==2||el.code==3){
              el.disabled = false;
            }
            return el;
          });
        }else if(status==0||status==1||status==2){
          shipmentStatusCurr && (shipmentStatusCurr.disabled = false);
          arr = this.$depthClone(arr).map(el=> {
            if(el.code==3){
              el.disabled = false;
            }
            return el;
          });
        }
        this.$set(this.selectArr,'shipmentStatus',arr);
        this.$emit('shipmentStatus',status);
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
  table{
    width: 100%;
    table-layout: fixed;
    th,td{
      text-align: center;
      padding: 6px 0;
      line-height: 23px;
      padding-left: 10px;
      padding-right: 10px;
      font-size: 12px;
      color: #1d1007;
      line-height: 24px;
      font-weight: 400;
    }
    /deep/.definedStyleClass{
      background: yellow;
    }
  }
  table,th, td{
    border: 1px solid #ebeef5;
  }
</style>
