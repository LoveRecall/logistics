/*
 * created by L_Recall on 2018/05/28
 */
// plan BasicInfo
export const basicInfoObj = {
  logisticsNo: {
    type: 'input',
    value: null,
    disabled:true 
  },
  contractNo: {
    type: 'input',
    value: null
  },
  logisticsStatus: {
    type: 'selector',
    value: 2,
    defaultVal: 2,
    disabled:true 
  },
  shipmentStatus: {
    type: 'selector',
    value: null
  },
  createDate: {
    key:'entryDt',
    type: 'date',
    value: null,
    disabled:true 
  },
  customerName: {
    type: 'input',
    value: null,
    disabled:true 
  },
  shipServiceProvider: {
    type: 'input',
    value: null
  },
  receiptCompany: {
    type: 'input',
    value: null,
  },
  shippingAgent: {
    type: 'input',
    value: null
  },
  exchangeCurrency: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  payment: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  paymentTerm: {
    type: 'input',
    value: null
  },
  transportationWay: {
    type: 'input',
    value: '',
    defaultVal: 'transportationWayVal',
    disabled:true 
  },
  loadingType: {
    type: 'input',
    value: '',
    defaultVal: 'loadingTypeVal',
    disabled:true 
  },
  permitedForTransportation: {
    type: 'selector',
    value: null
  },
  blType: {
    type: 'selector',
    value: null
  },
  blQty: {
    type: 'input',
    value: '',
    _rules:{
      required:true,
      type:'Number'
    }
  },
  blNo: {
    type: 'input',
    value: null
  },
  consignee: {
    type: 'input',
    value: null
  },
  notify: {
    type: 'input',
    value: null
  }
}


//place plan BasicInfo
export const CreatPlanBasicInfoObj = {
  logisticsNo: {
    type: 'input',
    value: null,
    disabled:true 
  },
  contractNo: {
    type: 'input',
    value: null
  },
  logisticsStatus: {
    type: 'selector',
    value: 2,
    defaultVal: 2,
    disabled:true 
  },
  shipmentStatus: {
    type: 'selector',
    value: null
  },
  customerName: {
    type: 'input',
    value: null,
    disabled:true 
  },
  shipServiceProvider: {
    type: 'input',
    value: null
  },
  receiptCompany: {
    type: 'input',
    value: null,
  },
  shippingAgent: {
    type: 'input',
    value: null
  },
  exchangeCurrency: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  payment: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  paymentTerm: {
    type: 'input',
    value: null
  },
  transportationWay: {
    type: 'input',
    value: '',
    defaultVal: 'transportationWayVal',
    disabled:true 
  },
  loadingType: {
    type: 'input',
    value: '',
    defaultVal: 'loadingTypeVal',
    disabled:true 
  },
  permitedForTransportation: {
    type: 'selector',
    value: null
  },
  blType: {
    type: 'selector',
    value: null
  },
  blQty: {
    type: 'input',
    value: '',
    _rules:{
      required:true,
      type:'Number'
    }
  },
  blNo: {
    type: 'input',
    value: null
  },
  consignee: {
    type: 'input',
    value: null
  },
  notify: {
    type: 'input',
    value: null
  }
}

//loading list BasicInfo
export const LLBasicInfoObj = {
  logisticsNo: {
    type: 'input',
    value: null,
    disabled:true 
  },
  contractNo: {
    type: 'input',
    value: null
  },
  shipmentStatus: {
    type: 'selector',
    value: null
  },
  customerName: {
    type: 'input',
    value: null,
    disabled:true 
  },
  shipServiceProvider: {
    type: 'input',
    value: null
  },
  receiptCompany: {
    type: 'input',
    value: null,
  },
  shippingAgent: {
    type: 'input',
    value: null
  },
  exchangeCurrency: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  payment: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  paymentTerm: {
    type: 'input',
    value: null
  },
  transportationWay: {
    type: 'input',
    value: '',
    defaultVal: 'transportationWayVal',
    disabled:true 
  },
  loadingType: {
    type: 'input',
    value: '',
    defaultVal: 'loadingTypeVal',
    disabled:true 
  },
  permitedForTransportation: {
    type: 'selector',
    value: null
  },
  blType: {
    type: 'selector',
    value: null
  },
  blQty: {
    type: 'input',
    value: '',
    _rules:{
      required:true,
      type:'Number'
    }
  },
  blNo: {
    type: 'input',
    value: null
  },
  consignee: {
    type: 'input',
    value: null
  },
  notify: {
    type: 'input',
    value: null
  }
}

//draft BasicInfo
export const draftBasicInfoObj = {
  logisticsNo: {
    type: 'input',
    value: null,
    disabled:true 
  },
  contractNo: {
    type: 'input',
    value: null
  },
  customerName: {
    type: 'input',
    value: null,
    disabled:true 
  },
  shipServiceProvider: {
    type: 'input',
    value: null
  },
  receiptCompany: {
    type: 'input',
    value: null,
  },
  shippingAgent: {
    type: 'input',
    value: null
  },
  exchangeCurrency: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  payment: {
    type: 'selector',
    value: null,
    _rules:{
      required:true
    }
  },
  paymentTerm: {
    type: 'input',
    value: null
  },
  transportationWay: {
    type: 'input',
    value: '',
    defaultVal: 'transportationWayVal',
    disabled:true 
  },
  loadingType: {
    type: 'input',
    value: '',
    defaultVal: 'loadingTypeVal',
    disabled:true 
  },
  permitedForTransportation: {
    type: 'selector',
    value: null
  },
  blType: {
    type: 'selector',
    value: null
  },
  blQty: {
    type: 'input',
    value: '',
    _rules:{
      required:true,
      type:'Number'
    }
  },
  blNo: {
    type: 'input',
    value: null
  },
  consignee: {
    type: 'input',
    value: null
  },
  notify: {
    type: 'input',
    value: null
  }
}

export const ExchangeRateInfo = {
  'CNYUSD':{
    type: 'input',
    value: null,
    disabled:true 
  },
  'USDCNY':{
    type: 'input',
    value: null,
    disabled:true 
  },
  'CNYEUR':{
    type: 'input',
    value: null,
    disabled:true 
  },
  'EURCNY':{
    type: 'input',
    value: null,
    disabled:true 
  },
  'USDEUR':{
    type: 'input',
    value: null,
    disabled:true 
  },
  'EURUSD':{
    type: 'input',
    value: null,
    disabled:true 
  },
}


export const transportInfoObj = {
  transportCompany: {
    type: 'input',
    value: null
  },
  vesselName: {
    type: 'input',
    value: null
  },
  vesselNo: {
    type: 'input',
    value: null
  },
  departureCountry: {
    type: 'filterable',
    value: null
  },
  departurePort: {
    type: 'input',
    value: null,
    _rules:{
      required:true
    }
  },
  destinationCountry: {
    type: 'filterable',
    value: null
  },
  destinationPort: {
    type: 'input',
    value: null,
    _rules:{
      required:true
    }
  }
}

export const payMentInfo = {
  paymentItem: {
    key:'name',
    _rules:{
      required:true
    }
  },
  skuSupplierName: {
    key:'payToCompanyName',
    _rules:{
      required:true
    }
  },
  estPayDate: {
    key:'planPayDt',
    _rules:{
      required:true
    }
  },
  estAmount: {
    key:'planPayAmount',
    _rules:{
      type:'Number',
      required:true
    }
  },
  actPayDate: {
    key:'actualPayDt',
  },
  actAmount: {
    key:'actualPayAmount'
  }
}

export const dbcontainerInfo = {
  containerType: {
    _rules:{
      required:true
    }
  }
}

export const dbProductInfo = {
  "totalQuantityInContainer":{
    key:'totalContainerQty',
    _rules:{
      required:true,
      type:'Number'
    }
  }
}


export const addProductFromOrderFilter = {
  "orderNo": {
    _isDefaultShow:true
  },
  "skuCode": {
    _isDefaultShow:true
  },
  "skuNameEn": {
    _isDefaultShow:true
  }
}
//验证shipper必填
export const validateShipperObj = {
  "name":{
    _rules:{
      required:true
    }
  }
}