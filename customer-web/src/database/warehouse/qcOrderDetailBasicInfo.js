export default {
    qcOrderNo:{
        type:'input',
        disabled:true,
    },
    qcTypeDictCode:{
        type:'select',
        isQcType:true,
        isServiceFill:true
    },
    qcDate:{
        type:'date',
        isServiceFill:true
    },
    factoryAddress:{
        type:'select',
        isAddress: true
    },
    factoryContactPhone:{
        type:'input',
        disabled:true,
        // _rules:{
        //     required:true
        // }
    },
    qcStatusDictCode:{
        type:'select',
        isQcStatus:true,
        disabled:true,
        isInCreateStatus:true,
    },
    qcMethodDictCode:{
        type:'select',
        isQcMethod:true,
        isServiceFill:true
    },
    // surveyor:{
    //     type:'select',
    //     isSurveyor:true,
    //     isServiceFill:true
    // },
    serviceFee:{
        type:'input',
        isServiceFill:true
    },
    serviceName:{
        type:'select',
        isServiceName:true,
        disabled:true,
    },
    exchangeCurrencyDictCode:{
        type:'select',
        isCurrency:true,
        disabled:true
    },
    remark:{
        type:'textarea',
        fullLine:true,
        disabled:true
    },
    attachment:{
        type:'attachment',
        key:'attachments',
        disabled:true,
        fullLine:true
    },
}