export default {
  createInquiry: {
    icon: 'icon-xunpanC',
    link: '/negotiation/createInquiry',
    customer: true,
    supplier: false,
    server: false,
    auth: ['INQUIRY:OVERVIEW:CREATE_INQUIRY']
  },
  createOrder: {
    icon: 'icon-dingdanC',
    link: '/order/create',
    customer: true,
    supplier: false,
    server: false,
    auth:['ORDER:OVERVIEW:CREATE']
  },
  addProduct: {
    icon: 'icon-chanpinC',
    link: '/product/addNewProduct',
    customer: false,
    supplier: true,
    server: false,
    auth:['PRODUCT:OVERVIEW:ADD_PRODUCT']
  },
  createInbound: {
    icon: 'icon-rukuC',
    link: '/warehouse/createInbound',
    customer: false,
    supplier: true,
    server: false,
    auth:['']
  },
  createQC: {
    icon: 'icon-QCC',
    link: '/warehouse/createQc',
    customer: true,
    supplier: false,
    server: false,
    auth:['QC:ORDER_OVERVIEW:CREATE']
  },
  createOutbound: {
    icon: 'icon-chukuC',
    link: '/warehouse/createOutbound',
    customer: false,
    supplier: true,
    server: false,
    auth:['']
  },
  placeLogisticPlan: {
    icon: 'icon-wuliuC',
    link: '/logistic/placeLogisticPlan',
    customer: true,
    supplier: false,
    server: false,
    auth:['LOGISTICS:PLAN_DETAIL']
  },
  // placeLogisticOrder: {icon: '', link: ''},
  message: {
    icon: 'icon-xiaoxi',
    link: '/message/index',
    customer: true,
    supplier: true,
    server: true,
    auth:['']
  },
  sourcingOverview: { // todo not
    icon: '',
    link: '/product/sourcing',
    customer: true,
    supplier: false,
    server: false,
    auth:['PRODUCT:OVERVIEW']
  },
  bookmarkOverview: {
    icon: 'icon-shuqian',
    link: '/product/bookmark',
    customer: true,
    supplier: false,
    server: false,
    auth:['PRODUCT:BOOKMARK_OVERVIEW']
  },
  compareInquiryOverview: {// todo not
    icon: '',
    link: '/negotiation/compare',
    customer: true,
    supplier: false,
    server: false,
    auth:['INQUIRY:COMPARE_OVERVIEW']
  },
  supplierOverview: {
    icon: 'icon-gongyingshang',
    link: '/supplier/sourcing',
    customer: true,
    supplier: false,
    server: false,
    auth:['SUPPLIER:OVERVIEW']
  },
  inquiryOverview: {
    icon: 'icon-xunpan',
    link: '/negotiation/inquiry',
    customer: true,
    supplier: false,
    server: false,
    auth:['INQUIRY:OVERVIEW']
  },
  orderOverview: {
    icon: 'icon-dingdan',
    link: '/order/overview',
    customer: true,
    supplier: true,
    server: false,
    auth:['ORDER:OVERVIEW']
  },
  warehouseOverview: {
    icon: '',
    link: '/warehouse/overview',
    customer: true,
    supplier: true,
    server: false,
    auth:['WAREHOUSE:OVERVIEW']
  },
  inboundOverview: {
    icon: 'icon-ruku',
    link: '/warehouse/inbound',
    customer: false,
    supplier: true,
    server: false,
    auth:['']
  },
  outboundOverview: {
    icon: 'icon-chuku',
    link: '/warehouse/outbound',
    customer: false,
    supplier: true,
    server: false,
    auth:['']
  },
  QCOrderOverview: {
    icon: 'icon-QC',
    link: '/warehouse/qcOverview',
    customer: true,
    supplier: true,
    server: true,
    auth:['QC:ORDER_OVERVIEW']
  },
  logisticPlanOverview: {
    icon: 'icon-wuliu',
    link: '/logistic/plan',
    customer: true,
    supplier: false,
    server: false,
    auth:['LOGISTICS:PLAN_OVERVIEW']
  },
  loadingListOrderOverview: { // todo not
    icon: '',
    link: '/logistic/loadingList',
    customer: true,
    supplier: true,
    server: false,
    auth:['LOADING_LIST:OVERVIEW']
  },
  track: {
    icon: 'icon-genzong',
    link: '/track/index',
    customer: true,
    supplier: false,
    server: false,
    auth:['']
  },
  compareSupplierOverview: {
    icon: 'icon-duibiS',
    link: '/supplier/compare',
    customer: true,
    supplier: false,
    server: false,
    auth:['SUPPLIER:COMPARE_OVERVIEW']
  },
  productOverview: { // todo
    icon: '',
    link: '/product/overview',
    customer: false,
    supplier: true,
    server: false,
    auth:['PRODUCT:OVERVIEW']
  },
  customerOverview: {
    icon: 'icon-kehu',
    link: '/customer/overview',
    customer: false,
    supplier: true,
    server: true,
    auth:['CUSTOMER:OVERVIEW']
  },
}
