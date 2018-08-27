<template>
  <el-row>
    <div class="select-search-wrap">
      <select-search :options="options" @inputEnter="searchFn"/>
    </div>
    <el-table height="500" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" ref="multipleTable">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column :label="$i.logistic.orderNo" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuCode" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuNameEn" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuNameCn" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuNameCn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.productDescription" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuNameCustomer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.blSkuName" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.blSkuName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.customsDeclarationNameCn" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuCustomsNameCn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.customsDeclarationNameEn" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuCustomsNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.hsCode" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuCustomsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.reportElement" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuDeclareElement }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.supplierName" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.supplierNo" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.customerSkuCode" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku_customerSkuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.factorySkuCode" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.factorySkuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.unit" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.exportUnitPrice " width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.exportUnitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.totalPriceOfExport" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPriceOfExport }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.currency" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuQuantityOfOuterCarton" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuQuantityOfOuterCarton }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonLength" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonLength }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonWidth" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonWidth }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonHeight" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonHeight }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonNetWeight" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonNetWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonGrossWeight" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonRoughWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonVolume" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonVolume }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.shippingMarks" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuShippingMarks }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonBarCode" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonBarCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.outerCartonSkuCode" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuOuterCartonCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuSupplierCompanyId" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuSupplierCompanyId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$i.logistic.skuSupplierTenantId" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuSupplierTenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="active" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="productDetail(scope.row.id)">{{ $i.logistic.detail }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;">
      <v-pagination :page-data="pageParams" @size-change="sizeChange" @change="pageChange"/>
    </div>
  </el-row>
</template>
<script>
import { selectSearch,VPagination } from '@/components/index'

export default {
  props:{
    basicInfoArr:[String,Number,Array]
  },
  components: {
    selectSearch,VPagination
  },
  data () {
    return {
      tableData:[],
      pageParams: {
        pn: 1,
        ps: 10,
        skuSupplierIds:[]
      },
      selectArrData: [],
      options: [
        {
          id: 'skuCode',
          label: this.$i.logistic.skuCode
        },
        {
          id: 'orderNo',
          label: this.$i.logistic.orderNo
        }
      ],
    }
  },
  methods: {
    searchFn(obj){
      const {pn, ps} = this.pageParams
      this.pageParams = {pn, ps, [obj.id]: obj.value}
      this.getOrderList()
    },
    sizeChange(e) {
      this.pageParams.ps = e
      this.getOrderList();
    },
    getSupplierIds(){
      let url = this.$route.name == 'loadingListDetail' ? 'logistics_order_getSupplierIds' : 'logistics_plan_getSupplierIds';
      this.$ajax.get(this.$apis[url],{logisticsNo:this.basicInfoArr[0].value}).then(res => {
        this.$set(this.pageParams,'skuSupplierIds',res.supplierIds);
        this.$set(this.pageParams,'customerId',res.customerId);
        this.getOrderList();
      })
    },   
    pageChange(e) {
      this.pageParams.pn = e
      this.getOrderList()
    },
    getOrderList () {
      this.$ajax.post(this.$apis.get_order_list_with_page, this.pageParams).then(res => {
        this.tableData = res.datas
        this.pageParams = {
          pn: res.pn,
          ps: res.ps,
          tc: res.tc
        }
      })
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex
    },
    handleSelectionChange (arr) {
      // arr.forEach(a => (a.id = ''))
      this.selectArrData = arr
    },
    productDetail(id){
      this.$windowOpen({url:'/product/sourcingDetail',params:{id:id}})
    }
  }
}
</script>
<style lang="less" scoped>
.select-wrap {
  display:flex;
  align-items:center;
  .select {
    width: 110px;
    margin-right:5px;
  }
}
</style>
