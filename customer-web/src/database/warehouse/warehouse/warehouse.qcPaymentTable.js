export default {
    no:{
        key:'paymentNo',
        realKey:'no'
    },
    name:{
        key:'paymentItem',
        realKey:'name',
        type:'select'
    },
    planPayDt:{
        realKey:'planPayDt',
        type:'date'
    },
    planPayAmount:{
        realKey:'planPayAmount',
        type:'number',
        accuracy: 2
    },
    actualPayDt:{
        realKey:'actualPayDt',
        type:'date'
    },
    actualPayAmount:{
        realKey:'actualPayAmount',
        type:'number',
        accuracy: 2
    },
    currencyCode:{
        realKey:'currencyCode',
        type:'select',
        isCurrency:true
    },
    status:{
        key:'available',
        realKey:'status',
        isStatus:true
    },
    remark:{
        realKey: 'remark',
        type: 'input'
    }
}