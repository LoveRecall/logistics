export default {
  id: {
    type: 'text',
    _hide: true
  },
  skuPictures:{
    type: 'String',
    _image:true,
    _upload:{
      readonly:true
    }
  },
  logisticsNo: {
    type: 'text'
  },
  customerSkuCode: {
    type: 'text'
  },
  skuNameEn: {
    type: 'text'
  },
  skuSupplierAbbr: {
    type: 'text'
  },
  orderNo: {
    type: 'text'
  },
  containerNo: {
    type: 'text'
  },
  totalQuantityOfOuterCartonsInContainer: {
    key: 'ctnQty',
    type: 'String',
  },
  totalQuantityInContainer: {
    key: 'totalContainerQty',
    _filed: 'totalContainerQty',
    type: 'String',
  },
  totalVolumeInContainer: {
    key: 'totalContainerVolume',
    type: 'String'
  },
  totalNetWeightInContainer: {
    key: 'totalContainerNetWeight',
    type: 'String'
  },
  totalContainerGrossWeight: {
    key:'totalGrossWeight',
    type: 'String'
  },
  unitExportPrice: {
    type: 'String'
  },
  totalPriceOfExport: {
    key:'totalExportPrice',
    type: 'String'
  },
  currency: {
    type: 'String'
  },
  transportationWay: {
    type: 'text'
  },
  blType:{
    type: 'text'
  },
  blNo:{
    type: 'text'
  },
  shipServiceProvider:{
    type: 'text'
  },
  shippingAgent: {
    type: 'text'
  },
  skuQty: {
    type: 'String'
  },
  lcNo: {
    type: 'text'
  },
  customerOrderNo: {
    type: 'text'
  },
  supplierOrderNo: {
    type: 'text'
  },
  skuCode: {
    type: 'text'
  },
  skuBarCode: {
    type: 'text'
  },
  productDescription: {
    key:'skuNameCustomer',
    type: 'text'
  },
  ProductDescriptionCustomer: {
    key:'skuDescCustomer',
    type: 'text'
  },
  skuDescriptionCn: {
    type: 'text'
  },
  skuDescriptionEN: {
    type: 'text'
  },
  supplierSerialNumber: {
    key:'supplierSerialNo',
    type: 'text'
  },
  blSkuName: {
    type: 'text'
  },
  customsDeclarationNameEn: {
    key:'customDeclarationNameEn',
    type: 'String'
  },
  hsCode: {
    type: 'String'
  },
  totalPrice: {
    type: 'text'
  },
  unit: {
    type: 'text'
  },
  inboundDate: {
    type: 'text'
  },
  inboundNo: {
    type: 'text'
  },
  warehouseName: {
    type: 'text'
  },
  warehouseNo: {
    type: 'text'
  },
  departurePort: {
    key:'deliveryPort',
    type: 'text'
  },
  destinationPort: {
    type: 'text'
  },
  destinationCountry: {
    type: 'text'
  },
  transportCompany: {
    type: 'text'
  },
  departureCountry: {
    type: 'text'
  },
  containerType: {
    type: 'text'
  },
  createDate:{
    type: 'String'
  },
  customerName:{
    type: 'String'
  },
  payment:{
    type: 'String'
  },
  bookingDate:{
    key:'actBookingDate',
    _filed:'actBookingDate',
    type: 'textDate'
  },
  estContainerStuffingDate: {
    type: 'textDate'
  },
  actContainerStuffingDate: {
    type: 'textDate'
  },
  declareDate: {
    key:'actDeclareDate',
    type: 'textDate'
  },
  estDepartureDate: {
    type: 'textDate'
  },
  estArrivalDate: {
    type: 'textDate'
  },
  actDepartureDate: {
    type: 'textDate'
  },
  actCustomsCleanceDate: {
    type: 'textDate'
  },
  actReleaseDate: {
    type: 'textDate'
  },
  actArrivalDate: {
    type: 'textDate'
  },
  skuCartonQty: {
    type: 'textDate'
  },
  logisticsStatus: {
    _hide:true,
    type: 'text'
  }
}
