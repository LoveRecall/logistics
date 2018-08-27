<template>
  <el-row class="btns" :style="{ width: '100%', paddingLeft: hideMune ? '65px' : '195px' }">
    <div v-if="!edit">
      <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].MODIFY||'')" type="primary" v-if="pageTypeCurr!='loadingListDetail'&&(logisticsStatus==2||logisticsStatus==3)"
        @click.stop="$emit('switchEdit','edit')">{{ $i.logistic.modify }}</el-button>
      <el-button size="mini" type="primary" v-if="pageTypeCurr!='loadingListDetail'&&pageTypeCurr!='logisticDraftDetail'&&(logisticsStatus==2)"
        @click.stop="$emit('switchEdit','confirm')">{{ $i.logistic.confirm }}</el-button>
      <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].COPY||'')" type="primary" v-if="pageTypeCurr!='loadingListDetail'"
        @click.stop="$emit('switchEdit','copy')">{{ $i.logistic.copy }}</el-button>
      <el-button size="mini" type="primary" v-if="pageTypeCurr!='loadingListDetail'" @click.stop="$emit('switchEdit','placeLogisticsPlan')">{{ $i.logistic.placeLogisticsPlan }}</el-button>
      <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr]&&auth[pageTypeCurr].READ||'')" type="primary"
        v-if="pageTypeCurr=='loadingListDetail'&&fieldDisplay" @click.stop="$emit('switchEdit','read')">{{ $i.logistic.read }}</el-button>
      <!-- <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].CANCEL_LOADINGLIST||'')" type="primary" v-if="pageTypeCurr=='loadingListDetail'&&logisticsStatus!=4"
        @click.stop="$emit('switchEdit','cancelLoadingList')">{{ $i.logistic.cancelLoadingList}}</el-button> -->
      <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].DOWNLOAD||'')" type="primary" @click.stop="$emit('switchEdit','download')">{{ $i.logistic.download }}</el-button>
      <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].CANCEL||'')" type="primary" v-if="pageTypeCurr!='loadingListDetail'&&logisticsStatus!=5"
        @click.stop="$emit('switchEdit','cancel')">{{ $i.logistic.cancel }}</el-button>
    </div>
    <div v-else>
      <el-button size="mini" type="primary" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].DRAFT||'')" v-if="pageTypeCurr=='placeLogisticPlan'||pageTypeCurr=='logisticDraftDetail'"
        @click.stop="$emit('sendData', 'saveAsDraft')">{{ $i.logistic.saveAsDraft }}</el-button>
      <el-button size="mini" type="primary" @click.stop="$emit('sendData', 'send')">{{ $i.logistic.send }}</el-button>
      <el-button size="mini" type="danger" v-if="pageTypeCurr=='loadingListDetail'|| pageTypeCurr=='logisticPlanDetail' " @click.stop="$emit('toExit')">{{ $i.logistic.exit }}</el-button>
      <el-checkbox v-model="isDelay" @change="isDelayFun">{{$i.logistic.isDelay}}</el-checkbox>
    </div>
  </el-row>
</template>
<script>
  export default {
    props: {
      fieldDisplay: [String, Object],
      logisticsStatus: [String, Number],
      DeliveredEdit: [Boolean],
      basicInfoArr: [Array],
      listData: Array,
      selectArr: [Array, Object],
      btnModifyTime: [Array, Object],
      shipmentStatus: [Number, String],
      edit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isDelay: false,
        btnWidth: 0,
        scale: 1,
        auth: {
          placeLogisticPlan: {
            DRAFT: ['LOGISTICS:PLAN_DETAIL:DRAFT','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            MODIFY: ['LOGISTICS:PLAN_DETAIL:MODIFY','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            DOWNLOAD: ['LOGISTICS:PLAN_DETAIL:DOWNLOAD','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            CANCEL: ['LOGISTICS:PLAN_DETAIL:CANCEL','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            COPY: ['LOGISTICS:PLAN_DETAIL:COPY','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY']
          },
          logisticPlanDetail: {
            DRAFT: ['LOGISTICS:PLAN_DETAIL:DRAFT','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            MODIFY: ['LOGISTICS:PLAN_DETAIL:MODIFY','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            DOWNLOAD: ['LOGISTICS:PLAN_DETAIL:DOWNLOAD','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            CANCEL: ['LOGISTICS:PLAN_DETAIL:CANCEL','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            COPY: ['LOGISTICS:PLAN_DETAIL:COPY','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY']
          },
          logisticDraftDetail: {
            DRAFT: ['LOGISTICS:PLAN_DETAIL:DRAFT','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            MODIFY: ['LOGISTICS:PLAN_DETAIL:MODIFY','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            DOWNLOAD: ['LOGISTICS:PLAN_DETAIL:DOWNLOAD','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            CANCEL: ['LOGISTICS:PLAN_DETAIL:CANCEL','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            COPY: ['LOGISTICS:PLAN_DETAIL:COPY','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY']
          },
          loadingListDetail: {
            READ: ['LOADING_LIST:DETAIL:READ','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            DOWNLOAD: ['LOADING_LIST:DETAIL:DOWNLOAD','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY'],
            CANCEL_LOADINGLIST: ['LOADING_LIST:DETAIL:CANCEL','LOGISTICS:PLAN_DRAFT_OVERVIEW:READ_ONLY']
          }
        },
      }
    },
    computed: {
      pageTypeCurr() {
        return this.$route.name;
      },
      hideMune() {
        return this.$store.state.layout.hideMenu
      },
    },
    methods: {
      isDelayFun(v) {
        let status = 0;
        if (v) {
          status = 6;
          this.changeShipmentStatusOption(status);
        } else {
          this.modifyTime();
        }
      },
      CompareDate(d1, d2) {
        return ((new Date(d1.replace(/-/g, "\/"))) - (new Date(d2.replace(/-/g, "\/"))));
      },
      modifyTime() {
        let _shipmentStatus = this.basicInfoArr.find(el => el.key == 'shipmentStatus').value;
        let BookingTime;
        let LoadingTime;
        let cleanceTime;
        if (!_.isEmpty(this.btnModifyTime)) {
          BookingTime = this.$dateFormat(new Date(this.btnModifyTime.BookingTime), 'yyyy-mm-dd');
          LoadingTime = this.$dateFormat(new Date(this.btnModifyTime.LoadingTime), 'yyyy-mm-dd');
          cleanceTime = this.$dateFormat(new Date(this.btnModifyTime.cleanceTime), 'yyyy-mm-dd');
        } else {
          BookingTime = this.$dateFormat(new Date(this.listData[0].bookingDate.value), 'yyyy-mm-dd');
          LoadingTime = this.$dateFormat(new Date(this.listData[0].actContainerStuffingDate.value), 'yyyy-mm-dd');
          cleanceTime = this.$dateFormat(new Date(this.listData[0].actCustomsCleanceDate.value), 'yyyy-mm-dd');
        }
        let currTime = this.$dateFormat(new Date(), 'yyyy-mm-dd');
        let status = this.$depthClone(this.shipmentStatus);
        if (BookingTime && this.CompareDate(BookingTime, currTime) <= 0 && [0].includes(this.shipmentStatus)) {
          status = 1;
        }
        if (LoadingTime && this.CompareDate(LoadingTime, currTime) <= 0 && [0, 1, 2, 3].includes(this.shipmentStatus)) {
          status = 4;
        }
        if (cleanceTime && this.CompareDate(cleanceTime, currTime) <= 0 && [0, 1, 2, 3, 4].includes(this.shipmentStatus)) {
          status = 5;
        }
        this.changeShipmentStatusOption(status);
      },
      changeShipmentStatusOption(status) {
        this.basicInfoArr.find(el => el.key == 'shipmentStatus').disabled = true;
        let arr = this.$depthClone(this.selectArr.shipmentStatus).map(el => {
          el.disabled = true;
          return el;
        });
        if (status == 0 || status == 1) {
          this.basicInfoArr.find(el => el.key == 'shipmentStatus').disabled = false;
          arr = this.$depthClone(arr).map(el => {
            if (el.code == 2 || el.code == 3) {
              el.disabled = false;
            }
            return el;
          });
        } else if (status == 0 || status == 1 || status == 2) {
          this.basicInfoArr.find(el => el.key == 'shipmentStatus').disabled = false;
          arr = this.$depthClone(arr).map(el => {
            if (el.code == 3) {
              el.disabled = false;
            }
            return el;
          });
        }
        this.$set(this.selectArr, 'shipmentStatus', arr);
        this.$emit('shipmentStatus', status);
      }
    },
    watch: {
      edit(v) {
        if (!v) {
          this.isDelay = false
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  .btns {
    transition: padding-left .5s;
    border-top: 1px solid #ccc;
    padding: 15px 0;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
  }

</style>
