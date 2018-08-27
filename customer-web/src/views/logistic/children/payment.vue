<template>
  <div class="payment">
    <el-button v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].PAYMENT_APPLY||'')" type="primary" :disabled="addPaymentBtn" size="mini" @click.stop="$emit('addPayment');addPaymentBtn=true;">{{ $i.logistic.applyForPayment }}</el-button>
    <el-table ref="table" :row-class-name="tableRowClassName" :data="tableData" border style="width: 100%; margin-top: 20px" show-summary :summary-method="summaryMethod">
      <el-table-column type="index" width="100" align="center"/>
      <el-table-column :label="$i.logistic.paymentNo" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.paymentItem" align="center" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.edit" style="display:flex;">
            <label class="reqiuredStar"></label>
            <el-select v-model="scope.row.name" :placeholder="$i.logistic.placeholder">
              <el-option
                v-for="(item,index) in selectArr.paymentItem"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <!-- <el-input :placeholder="$i.logistic.placeholder" v-model="scope.row.name" v-if="scope.row.edit"></el-input> -->
          </div>
          <span v-else>{{ textFilter(scope.row.name,'paymentItem') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.remark" align="center" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.edit" style="display:flex;">
            <el-input :placeholder="$i.logistic.placeholder" v-model="scope.row.remark" v-if="scope.row.edit"></el-input>
          </div>
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuSupplierName" align="center" width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.edit" style="display:flex;">
            <label class="reqiuredStar"></label>
            <el-select v-model="scope.row.payToCompanyId" filterable :placeholder="$i.logistic.placeholder">
              <el-option
                v-for="item in selectArr.supplierAbbr"
                :key="item.companyId"
                :label="item.supplierName"
                :value="item.companyId">
              </el-option>
            </el-select>
          </div>
          <!-- <span v-else>{{ computedCurrency('supplier', 'skuSupplierId', 'skuSupplierName', scope.row.payToId) }}</span> 接手 注释 -->
          <span v-else>{{ scope.row.payToCompanyName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.estPayDate" align="center" width="260">
        <template slot-scope="scope">
          <!-- <el-input placeholder="请输入内容" v-model="scope.row.planPayDt" v-if="edit"></el-input> -->
          <div v-if="scope.row.edit" style="display:flex;">
            <label class="reqiuredStar"></label>
            <el-date-picker v-if="scope.row.edit" v-model="scope.row.planPayDt" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"/>
          </div>
          <span v-else>{{ scope.row.planPayDt ? $dateFormat(scope.row.planPayDt, 'yyyy-mm-dd') : null }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.estAmount" prop="planPayAmount" align="center" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.edit" style="display:flex;">
            <label class="reqiuredStar"></label>
            <v-input-number
              v-model="scope.row.planPayAmount"
              :min="0"
              :controls="false"
              :accuracy="4"
              :mark="$i.logistic.estAmount"
              :placeholder="$i.logistic.placeholder"
              v-if="scope.row.edit"></v-input-number>
          </div>
          <span v-else>{{ scope.row.planPayAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.actPayDate" align="center" width="260">
        <template slot-scope="scope">
          <el-date-picker v-if="scope.row.edit" v-model="scope.row.actualPayDt" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"/>
          <!-- <el-input placeholder="请输入内容" v-model="scope.row.actPayDate" v-if="edit"></el-input> -->
          <span v-else>{{ scope.row.actualPayDt ? $dateFormat(scope.row.actualPayDt, 'yyyy-mm-dd') : null }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.actAmount" prop="actualPayAmount" align="center" width="180">
        <template slot-scope="scope">
          <v-input-number
            v-model="scope.row.actualPayAmount"
            :min="0"
            :controls="false"
            :accuracy="4"
            :mark="$i.logistic.actAmount"
            :placeholder="$i.logistic.placeholder"
            v-if="scope.row.edit"></v-input-number>
          <span v-else>{{ scope.row.actualPayAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.currency" align="center" width="180">
        <template slot-scope="scope">
          <!-- <el-input placeholder="请输入内容" v-model="scope.row.currencyCode" v-if="scope.row.edit"></el-input> -->
          <span>{{ scope.row.currencyCode }}</span>
          <!-- <span>{{ computedCurrency('exchangeCurrency', 'code', 'name', scope.row.currencyCode)}}</span> -->
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.avilable" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ paymentDec.find(a => a.code === scope.row.status).name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.operation" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <div v-if="!scope.row.edit">
            <el-button size="mini" type="primary" @click.stop="$emit('savePayment', scope.$index)">保存</el-button>
            <el-button size="mini" type="primary" @click.stop="$emit('deletePaymentList', scope.$index)">取消</el-button>
          </div> -->
          <div v-if="scope.row.status === -1">
            <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].PAYMENT_ACTION||'')" type="primary" @click.stop="switchStatus(scope.$index, $apis.recover_plan_payment,$i.logistic.recover)">{{ $i.logistic.recover}}</el-button>
          </div>
          <div v-if="scope.row.status === 20 || scope.row.status === 40">
            <div v-if="scope.row.edit">
              <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].PAYMENT_ACTION||'')" type="primary" @click.stop="$emit('savePayment', scope.$index)">{{ $i.logistic.save }}</el-button>
              <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].PAYMENT_ACTION||'')" type="primary" @click.stop="cancelPaymentModify(scope.$index)">{{ $i.logistic.cancel }}</el-button>
            </div>
            <div v-else>
              <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].PAYMENT_ACTION||'')" type="primary" @click.stop="switchModify(scope.$index)">{{ $i.logistic.modify }}</el-button>
              <el-button size="mini" v-authorize="auth[pageTypeCurr]&&(auth[pageTypeCurr].PAYMENT_ACTION||'')" type="primary" @click.stop="switchStatus(scope.$index, $apis.abandon_plan_payment,$i.logistic.invalid)">{{ $i.logistic.invalid }}</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {VInputNumber} from '@/components/index';
export default {
  components:{
    VInputNumber
  },
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    currencyCode: String,
    ExchangeRateInfoArr:[Array,Object],
    selectArr: {
      type: Object,
      default: () => {}
    },
    paymentSum: {
      type: Object,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      copyPaymentObj: {},
      addPaymentBtn:false,
      paymentDec: [
        {
          code: -1,
          name: this.$i.logistic.invalid
        },
        {
          code: 10,
          hightLight:true,
          name: this.$i.logistic.tbcc
        },
        {
          code: 20,
          hightLight:true,
          name: this.$i.logistic.tbcs
        },
        {
          code: 30,
          hightLight:true,
          name: this.$i.logistic.tbcsp
        },
        {
          code: 40,
          name: this.$i.logistic.confirmed
        }
      ],
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
      },
      auth:{
        logisticPlanDetail: {
          PAYMENT_APPLY:'LOGISTICS:PLAN_DETAIL:PAYMENT_APPLY',
          PAYMENT_ACTION:'LOGISTICS:PLAN_DETAIL:PAYMENT_ACTION'
        },
        loadingListDetail: {
          PAYMENT_APPLY:'LOADING_LIST:DETAIL:PAYMENT_APPLY',
          PAYMENT_ACTION:'LOADING_LIST:DETAIL:PAYMENT_ACTION'
        }
      },
    }
  },
  computed:{
    restaurants(){
      return this.selectArr.supplier;
    },
    pageTypeCurr() {
      return this.$route.name;
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    summaryMethod (param) {
      const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.$i.logistic.sum;
            return;
          }
          const values = data.map(item => Number(item[column.property]));  //要给 组件el-table-column 上加上 prop="xxxx"
          //提取data 拼接成汇率的key
          const currencyCode = data.map(item => {
            if(item.currencyCode!=this.currencyCode){
              return item.currencyCode+this.currencyCode;
            }else{
              return this.currencyCode;
            }
          });
          let currencyCodeArr = [];
          //拿到拼接的key 匹配汇率的key 推入数组
          currencyCode.forEach((item)=>{
            this.ExchangeRateInfoArr.forEach((findItem)=>{
              if(findItem.key==item){
                currencyCodeArr.push(findItem.value)
              }
            })
            if(item == this.currencyCode){
                currencyCodeArr.push(1)
            }
          })
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr,i) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.$calc.add(prev , this.$calc.multiply(curr,currencyCodeArr[i]));
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '--';
          }
        });

        return sums;
    },
    tableRowClassName({row, rowIndex}) {
      if (this.paymentDec.find(a => a.code == row.status).hightLight) {
        return 'warning-row';
      }
    },
    computedCurrency (key, findKey, returnKey,currencyCode) {
      // 'supplier', 'skuSupplierId', 'skuSupplierName', scope.row.payToId 接手注释
      if (!this.selectArr[key]) return null
      const obj = this.selectArr[key].find(a => a[findKey] === currencyCode)
      return obj ? obj[returnKey] : null
    },
    switchModify (i) {
      this.copyPaymentObj = this.tableData[i]
      this.$emit('updatePaymentWithView', { i, edit: true })
    },
    cancelPaymentModify (i) {
      this.addPaymentBtn =false;
      if (!this.tableData[i].id) return this.tableData.splice(i, 1)
      this.$emit('updatePaymentWithView', { i, edit: false,btnstatus:'cancel' })
    },
    switchStatus (i, url,title) {
      this.$confirm(this.$i.logistic.isConfirmPeration, this.$i.logistic.tips, {
        confirmButtonText: this.$i.logistic.confirm,
        cancelButtonText: this.$i.logistic.cancel,
        type: 'warning'
      }).then(() => {
        this.addPaymentBtn = false;
        this.$ajax.post(`${url}/${this.tableData[i].id}?version=${this.tableData[i].version}&moduleCode=LOGISTIC`).then(({ status,orderNo }) => {
          this.$emit('updatePaymentWithView', { i, edit: false, status,res:{'orderNo':orderNo},title})
        })
      })
    },
    textFilter(code,key) {
      let obj = this.selectArr[key].find(item => item.code == code);
      return obj ? obj.name : null;
    } 
  },
}
</script>

<style scoped lang="less">
  .payment/deep/.el-table .warning-row {
    background: yellow;
  }
  .reqiuredStar:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
</style>
