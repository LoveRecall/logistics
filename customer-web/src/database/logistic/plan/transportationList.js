// 22个 业务展现有效字段
export default {
  id: {
    type: 'text',
    _hide: true
  },
  transportationWay: {
    type: 'text'
  },
  loadingType:{
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
  logisticsNo:{
    type: 'text'
  },
  bookingDate:{
    key:'actBookingDate',
    _filed:'actBookingDate',
    type: 'textDate'
  },
  estContainerStuffingDate: {
    type: 'textDate'
  },
  estDepartureDate: {
    type: 'textDate'
  },
  estArrivalDate: {
    type: 'textDate'
  },
  declareDate: {
    key:'actDeclareDate',
    type: 'textDate'
  },
  actContainerStuffingDate: {
    type: 'textDate'
  },
  actCustomsCleanceDate: {
    type: 'textDate'
  },
  actDepartureDate: {
    type: 'textDate'
  },
  actArrivalDate: {
    type: 'textDate'
  },
  actReleaseDate: {
    type: 'textDate'
  },
  containerNo:{
    type: 'text'
  },
  sealNo:{
    type: 'text'
  },
  containerWeight:{
    type: 'text'
  },
  containerType: {
    type: 'container'
  },
  vgm: {
    type: 'text'
  },
  totalQuantityOfOuterCartonsInContainer: {
    key: 'totalContainerCartonQty',
    type: 'text'
  },
  totalSkuPriceInContainer: {
    type: 'text'
  },
  totalQuantityInContainer: {
    key: 'totalContainerQty',
    type: 'String'
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
    key:'totalCtnGw',
    type: 'String'
  },
  createDate:{
    type: 'textDate'
  },
  customerName:{
    type: 'String'
  },
  currency:{
    type: 'String'
  },
  payment:{
    type: 'String'
  },
  logisticsStatus: {
    _hide:true,
    type: 'text'
  }
}
