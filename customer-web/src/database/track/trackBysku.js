export default {
  pic: {
    key: 'pics',
    _filed:'pic',
    _image:true,
    _sort:false
  },
  orderNo: {
    key: 'orderNo'
  },
  purchaseOrderNumber: {
    key: 'customerOrderNo'
  },
  salesOrderNumber: {
    key: 'supplierOrderNo'
  },
  customerItemNumber: {
    key: 'skuCustomerSkuCode'
  },
  vendorSKUCode: {
    key: 'skuCode'
  },
  supplier: {
    key: 'supplierName'
  },
  skuNameEn: {
    key: 'skuNameEn'
  },
  skuDescriptionEn: {
    key: 'skuDescEn'
  },
  unit: {
    key: 'skuUnit'
  },
  incoterm: {
    key: 'incoterm'
  },
  incotermArea: {
    key: 'incotermArea'
  },
  currency: {
    key: 'currency'
  },
  unitPrice: {
    key: 'unitPrice'
  },
  yu: {
    key: 'skuPrice'
  },
  quantity: {
    key: 'skuQty'
  },
  outerCartonQuantity: {
    key: 'totalOuterCartonQty'
  },
  skuQuantityOfInnerCarton: {
    key: 'skuInnerCartonQty'    //中包商品数
  },
  packingMethodEn: {
    key: 'skuMethodPkgEn'
  },
  packingMethodOfInnerCartonEn: {
    key: 'skuInnerCartonMethodEn'
  },
  packingMethodOfOuterCartonEn: {
    key: 'skuOuterCartonMethodEn'
  },
  outerCartonLength: {
    key: 'skuOuterCartonLength'
  },
  outerCartonWidth: {
    key: 'skuOuterCartonWidth'
  },
  outerCartonHeight: {
    key: 'skuOuterCartonHeight'
  },
  outerCartonVolume: {
    key: 'skuOuterCartonVolume'
  },
  outerCartonNetWeight: {
    key: 'skuOuterCartonNetWeight'
  },
  outerCartonGrossWeight: {
    key: 'skuOuterCartonRoughWeight'
  },
  skuNetWeight: {
    key: 'skuNetWeight'
  },
  skuVolume: {
    key: 'skuVolume'
  },
  skuBarCode: {
    key: 'skuBarCode'
  },
  innerPackingBarCode: {
    key: 'skuInnerPackBarCode'
  },
  outerCartonBarCode: {
    key: 'skuOuterCartonBarCode'
  },
  skuLabel: {
    key: 'skuInnerPackLabel'
  },
  innerPackingLabel: {
    key: 'skuInnerPackBarCode'
  },
  shippingMarks: {
    key: 'skuShippingMarks'
  },
  deliveryDays: {
    key: 'skuDeliveryDates'
  },
  remark: {
    key: 'remark'
  },
  skuStatus: {
    key: 'skuStatus'
  },
  qCDateA: {
    key: 'firstQcDt',
    type: 'textDate'
  },
  qCDateB: {
    key: 'secondQcDt',
    type: 'textDate'
  },
  qCDateC: {
    key: 'lastQcDt',
    type: 'textDate'
  },
  confirmQcDate: {
    key: 'confirmQcDt',
    type: 'textDate'
  },
  bookingDate: {
    key: 'bookingDt',
    type: 'textDate'
  },
  shippingSpaceReleaseDate: {
    key: 'shippingSpaceReleaseDt',
    type: 'textDate'
  },
  estContainerStuffingDate: {
    key: 'estContainerStuffingDt',
    type: 'textDate'
  },
  actContainerStuffingDate: {
    key: 'actContainerStuffingDt',
    type: 'textDate'
  },
  declareDate: {
    key: 'declareDt',
    type: 'textDate'
  },
  estCustomsCleanceDate: {
    key: 'estCustomsCleanceDt',
    type: 'textDate'
  },
  actCustomsCleanceDate: {
    key: 'actCustomsCleanceDt',
    type: 'textDate'
  },
  estArrivalDate: {
    key: 'estArrivalDt',
    type: 'textDate'
  },
  actArrivalDate: {
    key: 'actArrivalDt',
    type: 'textDate'
  },
  actReleaseDate: {
    key: 'actReleaseDt'
  },
  qualifiedProductsTotalQTYS: {
    key: 'qualifiedSkuQty'
  },
  deliveredQuantity: {
    key: 'totalContainerQty'
  },
  undeliveredQuantity: {
    key: 'skuUndeliveredQty'
  },
  country: {
    key: 'customerCountry'
  },
  departurePort:{
    key: 'departurePort'
  },
  destinationPort: {
    key: 'destinationPort'
  },
  shippingAgent: {
    key: 'shippingAgent'
  },
  contactPersonOfBuyer: {
    key: 'customerCompanyName', //customerCompanyName
    mustShowColumn: true,
    _sort:false
  },
  emailOfBuyer: {
    key: 'customerEmail',
    _sort:false
  },
  phoneOfBuyer: {
    key: 'customerCellphone',
    _sort:false
  },
  emailOfSeller: {
    key: 'supplierEmail',
    _sort:false
  },
  phoneOfSeller: {
    key: 'supplierCellphone',
    _sort:false
  },
  contactPersonOfSeller: {
    key: 'supplierCompanyName',
    mustShowColumn: true,
    _sort:false
  },
  sealine: {
    key: 'transportCompany'
  },
  BLtype: {
    key: 'blType'
  },
  BorLNo: {
    key: 'blNo'
  },
  containerNo: {
    key: 'containerNo'
  },
  sealNo: {
    key: 'sealNo'
  },
  logisticsNo: {
    key: 'logisticsNo'
  },
  category: {
    key: 'skuCategoryName',
    mustShowColumn: true,
    // _important:true,
  },
  categoryLevel1: {
    key: 'skuCategoryOne',
    _hide:true
  },
  categoryLevel2: {
    key: 'skuCategoryTwo',
    _hide:true
  },
  categoryLevel3: {
    key: 'skuCategoryThree',
    _hide:true
  },
  categoryLevel4: {
    key: 'skuCategoryFour',
    _hide:true
  },
  itemOrderDelayed: {
    key: 'isOrderDelay'
  },
  comment: {
    key: 'remark'
  },
  FLCorLCL: {
    key: 'isFullContainerLoad'
  },
  commercialInvoiceNumber: {
    key: 'commercialInvoiceNo'
  },
  invoiceDate: {
    key: 'invoiceDt',
    type: 'textDate'
  },
  orderReceivedDate: {
    key: 'orderReceivedDt',
    type: 'textDate'
  },
  orderAcceptedDate: {
    key: 'orderAcceptedDt',
    type: 'textDate'
  },
  container: {
    key: 'containerNo'
  },
  shipServiceProvider: {
    key: 'shipServiceProvider'
  },
  orderId: {
    key: 'orderId',
    _important:true,
    _hide:true
  },
  logisticsId: {
    key: 'logisticsId',
    _important:true,
    _hide:true
  },
  qcId: {
    key: 'qcId',
    _important:true,
    _hide:true
  },
  supplierAbbr: {
    key: 'supplierAbbr'
  }
}
