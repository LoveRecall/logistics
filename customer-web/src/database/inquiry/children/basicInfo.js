export default {
  updateDt: {
    key: 'updateDt',
    type: 'text',
    transForm: 'time',
    _disabled: true,
    _title: 'remark',
    _inquiryHide: true
  },
  id: {
    _hide: true
  },
  _remark: {
    _hide: true
  },
  paymentTerm: {
    _inquiryHide: true,
    _hide: true
  },
  inquiryAmount: {
    _inquiryHide: true,
    _hide: true,
    _toFixed: 2
  },
  timeZone: {
    _inquiryHide: true,
    _hide: true
  },
  operater: { // 修改人 系统带入
    key: 'updateName',
    width: '190px',
    type: 'String',
    _disabled: true,
    _inquiryHide: true
  },
  inquiryNo: { // 询价单号 系统带入
    key: 'inquiryNo',
    rules: [],
    width: '190px',
    type: 'String',
    _disabled: true,
    _inquiryHide: true
  },
  quotationNo: { // 询价子单号 系统带入
    rules: [],
    width: '190px',
    type: 'String',
    _disabled: true,
    _inquiryHide: true
  },
  createTime: { // 创建时间
    key: 'entryDt',
    rules: [],
    width: '190px',
    type: 'String',
    _inquiryHide: true,
    _disabled: true,
    transForm: 'time'
  },
  inquiryStatus: { // 询价单状态
    key: 'status',
    rules: [],
    width: '190px',
    type: 'String',
    _disabled: true,
    _inquiryHide: true,
    transForm: 'INQUIRY_STATUS'
  },
  transportationWay: { // 下拉选择 运输方式
    key: 'transport',
    rules: [],
    width: '190px',
    type: 'Select',
    transForm: 'MD_TN'
  },
  payment: { // 付款方式 下拉选择
    key: 'paymentMethod',
    rules: [],
    width: '190px',
    type: 'Select',
    transForm: 'PMT'
  },
  destinationCountry: { // 目的国 下拉选择
    key: 'destinationCountry',
    rules: [],
    width: '190px',
    type: 'Select',
    transForm: 'COUNTRY'
  },
  departureCountry: { // 发运国 下拉选择所有选项 ok
    rules: [],
    width: '190px',
    type: 'Select',
    transForm: 'COUNTRY'
  },
  incoterm: { // 价格条款 选择 ok
    rules: [],
    width: '190px',
    type: 'Select',
    transForm: 'ITM',
    _rules: {
      required: true
    }
  },
  currency: { // 币种 选择 ok
    rules: [],
    width: '190px',
    type: 'Select',
    transForm: 'CY_UNIT'
  },
  exchangeRate: {
    _disabled: true,
    _inquiryHide: true
  },
  // discountRate: { // 折扣率 限制输入百分比 ok
  //   rules: [],
  //   width: '150px',
  //   type: 'Number',
  //   state: 'rate',
  //   min: 0,
  //   max: 100
  // },
  departurePort: { // 发运港口  ok
    rules: [],
    width: '190px',
    type: 'String',
    transForm: 'SPORT'
  },
  destinationPort: { // 目的港口 ok
    rules: [],
    width: '190px',
    type: 'String',
    transForm: 'SPORT'
  },
  supplierName: { // 供应商名称 ok
    rules: [],
    width: '190px',
    type: 'manySelect',
    _disabled: true,
    _rules: {
      required: true
    }
  },
  supplierType: { // 供应商类型 ok
    rules: [],
    width: '190px',
    type: 'Select',
    _disabled: true,
    _inquiryHide: true,
    transForm: 'SUPPLIER_TYPE'
  },
  exportLicense: { // 出口资质 ok
    rules: [],
    width: '190px',
    type: 'Select',
    _disabled: true,
    transForm: 'EL_IS'
  },
  quantity: {
    key: 'skuQty',
    _disabled: true,
    _inquiryHide: true
  },
  inquiryRemark: { // 询价备注
    key: 'remark',
    rules: [],
    width: '190px',
    type: 'String',
    types: 'textarea',
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24
  },
  relatedOrderNO: { // 关联订单号
    key: 'orderNo',
    width: '190px',
    type: 'String',
    _inquiryHide: true,
    _disabled: true
  },
  attachment: { // 上传附件
    key: 'attachments',
    rules: [],
    width: '190px',
    type: 'attachment',
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    _upload: {
      ref: 'attachment'
    }
  },
  fieldDisplay: {
    _hide: true
  },
  fieldRemarkDisplay: {
    _hide: true
  }
};
