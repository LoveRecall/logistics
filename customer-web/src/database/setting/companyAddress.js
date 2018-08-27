export default {
  // orderNumber: {
  //   key: 'orderNo',
  // },
  country: {
    key: 'country',
    _rules:{
      required:true,
    },
    _hide:true
  },
  province: {
    key: 'province',
    _rules:{
      required:true,
    },
    _hide:true
  },
  city: {
    key: 'city',
    _rules:{
      required:true,
    },
    _hide:true
  },
  address: {
    key: 'address',
    _rules:{
      required:true,
    },
    _hide:true
  },
  receiveCountry: {
    key: 'receiveCountry',
    _hide:true
  },
  receiveProvince: {
    key: 'receiveProvince',
    _hide:true
  },
  receiveCity: {
    key: 'receiveCity',
    _hide:true
  },
  receiverAddress1: {
    key: 'receiveAddress',
    _hide:true
  },
  id:{
    key: 'id',
    _hide:true,
  },
  companyAddress:{
    key: '',
    _important:true,
  },
  receiverAddress:{
    key: '',
    _important:true,
  },
  destinationPort:{
    key:'destPort'
  },
  consignee:{
    key:'consignee'
  },
  notify:{
    key:'notify'
  },
  defaultAddress: {
    key: 'def'
  }
}
