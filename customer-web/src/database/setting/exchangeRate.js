
export default{
  from: {
  key: 'fromCurrency',
    _rules:{
    required:true,
    }
  },
  to: {
  key: 'toCurrency',
    _rules:{
    required:true,
    }
  },
  tradeExchangeRate: {
  key: 'price',
    _rules:{
      required:true,
      type:'Number'
    }
  },
  id:{
    key: 'id',
    _hide:true,
  }
}
