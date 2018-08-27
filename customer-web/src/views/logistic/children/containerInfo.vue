<template>
  <div>
    <div class="btn-wraps" v-if="edit">
      <el-button type="primary" size="mini" @click.stop="$emit('arrayAppend')">{{ $i.logistic.add }}</el-button>
      <el-button type="danger" size="mini" @click.stop="$emit('deleteContainer')">{{ $i.logistic.delete }}</el-button>
    </div>
    <div class="tab-wrap">
      <el-table :cell-class-name="lightHight" :data="tableData" ref="table" border style="width: 100%; margin-top: 20px"
        show-summary
        :summary-method="summaryMethod"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="100" align="center" :selectable='checkboxInit' class-name="checkbox-no-margin" v-if="edit"/>
        <el-table-column type="index" width="100" align="center"/>
        <el-table-column :label="$i.logistic.containerNo" width="140" align="center" prop='{"key":"containerNo","total":false}'>
          <template slot-scope="scope">
            <span>{{ scope.row.containerNo }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.sealNo" width="120" align="center" prop='{"key":"sealNo","total":false}'>
          <template slot-scope="scope">
            <span>{{ scope.row.sealNo }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.containerWeight" width="180" prop='{"key":"containerWeight","total":true}' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.containerWeight }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.containerType" width="130" align="center" prop='{"key":"containerType","total":true}'>
          <template slot-scope="scope">
            <div v-if="edit" style="display:flex;">
              <label class="reqiuredStar"></label>
              <el-select v-model="scope.row.containerType" :placeholder="$i.logistic.placeholder" @change="ContainerInfoLight('containerType',scope.row.containerType,scope.$index)">
                <el-option v-for="item in containerType" :key="item.id" :label="item.name" :value="item.code"/>
              </el-select>
            </div>
            <span v-else>{{ scope.row.containerType }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.vgm" prop='{"key":"vgm","total":true}' width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vgm || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.totalQuantityOfOuterCartonsInContainer" width="300" prop='{"key":"totalContainerOuterCartonsQty","total":true}' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalContainerOuterCartonsQty || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.totalQuantityInContainer" width="200" prop='{"key":"totalContainerQty","total":true}' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalContainerQty || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.totalVolumeInContainer" width="200" prop='{"key":"totalContainerVolume","total":true}' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalContainerVolume || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.totalNetWeightInContainer" width="200" prop='{"key":"totalContainerNetWeight","total":true}' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalContainerNetWeight || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.totalContainerGrossWeight" width="200" prop='{"key":"totalContainerGrossWeight","total":true}' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalContainerGrossWeight || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.USD" width="100" prop='{"key":"valueUsd","total":true}' align="center">
          <template slot-scope="scope">
            <!-- <el-input placeholder="请输入内容" v-model="scope.row.totalContainerSkuPrice" v-if="edit"></el-input> -->
            <span>{{ scope.row.valueUsd || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.CNY" width="100" prop='{"key":"valueRmb","total":true}' align="center">
          <template slot-scope="scope">
            <!-- <el-input placeholder="请输入内容" v-model="scope.row.totalContainerSkuPrice" v-if="edit"></el-input> -->
            <span>{{ scope.row.valueRmb || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$i.logistic.EUR" width="100" prop='{"key":"valueEur","total":true}' align="center">
          <template slot-scope="scope">
            <!-- <el-input placeholder="请输入内容" v-model="scope.row.totalContainerSkuPrice" v-if="edit"></el-input> -->
            <span>{{ scope.row.valueEur || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      containerNo: '',
      containerSelect: '',
      ContainerInfoLightArr:[]
    }
  },
  props: {
    currencyCode:[String,Number],
    ExchangeRateInfoArr:[Array,Object],
    edit: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    matchData: {
      type: Array,
      default () {
        return []
      }
    },
    containerType: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed:{
    returnData(){
      let arr = this.$depthClone(this.matchData).map(el=> {el.fieldDisplay={}; return el } );
      return arr;
    }
  },
  methods: {
    //高亮
    ContainerInfoLight(key,v,index,scope){
      this.returnData[index].fieldDisplay[key] = v;
      this.returnData[index][key] = v;
      if(this.matchData[index][key]==v){
        delete this.returnData[index].fieldDisplay[key];
      }
      let cloneReturnData = this.$depthClone(this.returnData[index]);
      let cloneMatchData = this.$depthClone(this.matchData[index]);
      delete cloneReturnData.isModify
      delete cloneMatchData.isModify
      if(_.isEqual(cloneReturnData, cloneMatchData)){
        this.returnData[index].isModify = false;
      }else{
        this.returnData[index].isModify = true;
      }
      this.$emit('ContainerInfoLight',this.returnData);
    },
    lightHight({row, column, rowIndex, columnIndex}){
      if(column.property&&row.fieldDisplay){
        if( JSON.parse(column.property).key in row.fieldDisplay){
          return 'lightHight'
        }
      }
    },
    //返回当前行是否可选中 复选框
    checkboxInit(row,index){
      if (row.beBinding)
        return 0;//不可勾选
      else
        return 1;//可勾选
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val.map(a => a))
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
    },
    summaryMethod (param) {
      const {columns,data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.$i.logistic.sum;
            return;
          }
          const values = data.map(item => column.property&&Number(item[JSON.parse(column.property).key]));
          //提取data 拼接成汇率的key
          const currencyCode = data.map(item => {
            if(item.exchangeCurrency!=this.currencyCode){
              return item.exchangeCurrency+this.currencyCode;
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
          if (!values.every(value => isNaN(value))&&column.property&&JSON.parse(column.property).total) {
            sums[index] = values.reduce((prev, curr,i) => {
              const value = Number(curr);
              if(column.property&&JSON.parse(column.property).key=="totalContainerSkuPrice"){
                if (!isNaN(value)) {
                  return this.$calc.add(prev , this.$calc.multiply(curr,currencyCodeArr[i]));
                } else {
                  return prev;
                }
              }else{
                return this.$calc.add(prev , curr || 0);
              }
            }, 0);
            sums[index] += 0;
          } else {
            sums[index] = '--';
          }
        });

        return sums;
    }
  },
}
</script>
<style lang="less" scoped>
.btn-wraps {
  padding:10px 0;
}
.reqiuredStar:before{
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.tab-wrap{
  /deep/.lightHight{
    background: yellow;
  }
}

</style>
