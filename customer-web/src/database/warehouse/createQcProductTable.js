export default {
    id: {
        _hide:true
    },
    skuCode:{},
    customerSkuCode:{},
    orderSkuQty:{},
    expectQcQty:{
        key:'expectQcQty',
        showType:'number',
        accuracy: 2
    },
    unqualifiedProcessingMode:{//不合格处理方式
        key:'unqualifiedProcessingMode',
        showType:'input'
    },
    samplingRate:{
        key:'samplingRate',
        showType:'number',
        accuracy: 2
    },
    checkOuterCartons:{
        fromService:true,
        key: 'checkOuterCartonQty'
    },
    skuQcResultDictCode:{
        showType:'qc'
    },
    skuInventoryStatusDictCode:{},
    
    // factorySkuCode:{},
    // skuNameCn:{},
    skuBrand:{},
    skuDesign:{},
    skuMethodPkgEn:{},
    skuInnerCartonMethodEn:{},
    // packingMethodCn:{},
    // innerCartonPackingMethodCn:{},
    deliveryDate:{
        showType:'date'
    },
    skuUnitDictCode:{},
   
    inboundNo:{},
    outerCartonTotalQty:{},
    skuLength:{},
    skuWidth:{},
    skuHeight:{},
    skuNetWeight:{},
    outerCartonSkuQty:{},
    actQtyOfOuterCarton:{
        fromService:true,
        key: 'actOuterCartonSkuQty'
    },
    //外箱中包数(create的时候不要)
    actQuantityOfInnerBoxOuterCarton:{
        // fromService:true,
        key: 'outerCartonInnerBoxQty' // 来自order
    },
    actOuterCartonInnerBoxQty:{
        fromService:true
    },
    //中包产品数(create的时候不要)
    actualQuantityInnerCarton:{
        // fromService:true,
        key: 'innerCartonSkuQty' // 来自order
    },
    actInnerCartonSkuQty:{},
    innerCartonLength:{ // 中包长
        fromService:true
    },
    innerCartonWidth:{
        fromService:true
    },
    innerCartonHeight:{
        fromService:true
    },
    innerCartonNetWeight:{
        fromService:true
    },
    innerCartonGrossWeight:{
        fromService:true
    },
    innerCartonVolume:{
        fromService:true
    },
    outerCartonLength:{
        fromService:true
    },
    outerCartonWidth:{
        fromService:true
    },
    outerCartonHeight:{
        fromService:true
    },
    netWeightOfOuterCarton:{
        fromService:true
    },
    outerCartonVolume:{
        fromService:true
    },
    
    grossWeightOfOuterCarton:{
        fromService:true,
        key: 'outerCartonGrossWeight'
    },
    actualProductTotalCTNS:{
        fromService:true,
        key: 'actSkuCartonTotalQty'
    },
    qualifiedProductsTotalCTNS:{
        fromService:true,
        key: 'qualifiedSkuCartonTotalQty'
    },
    unqualifiedProductTotalCTNS:{
        fromService:true,
        key: 'unqualifiedSkuCartonTotalQty'
    },
    actProductQuantity:{
        fromService:true,
        key: 'actSkuQty'
    },
    qualifiedProductsTotalQTYS:{ // 合格产品数
        fromService:true,
        key: 'qualifiedSkuQty'
    },
    unqualifiedProductsQTY:{
        fromService:true,
        key: 'unqualifiedSkuQty'
    },
    qualifiedProductTotalNW:{
        fromService:true,
        key: 'qualifiedSkuNetWeight'
    },
    unqualifiedProductTotalNW:{
        fromService:true,
        key: 'unqualifiedSkuNetWeight'
    },
    qualifiedProductsTotalCBM:{
        fromService:true,
        key: 'qualifiedSkuVolume'
    },
    unqualifiedProductsTotalCBM:{
        fromService:true,
        key: 'unqualifiedSkuVolume'
    },
    qualifiedProductTotalGW:{
        fromService:true,
        key: 'qualifiedSkuGrossWeight'
    },
    unqualifiedProductTotalGW:{
        fromService:true,
        key: 'unqualifiedSkuGrossWeight'
    },
    unqualifiedType:{//不合格类型
        fromService:true
    },
    skuBarCode:{},
    productBarCodeResults:{
        fromService:true,
        key: 'skuBarCodeResultDictCode'
    },
    skuLabel:{},
    productLabelResults:{
        fromService:true,
        key: 'skuLabelResultDictCode'
    },
    innerPackingBarCode:{},
    innerPackingBarCodeResults:{
        fromService:true,
        key: 'innerPackingBarCodeResultDictCode'
    },
    outerCartonBarCode:{},
    outerCartonBarCodeResults:{
        fromService:true,
        key: 'outerCartonBarCodeResultDictCode'
    },
    shippingMark:{},
    outerCartonMarksResults:{
        fromService:true,
        key: 'shippingMarkResultDictCode'
    },
    // innerCartonMark:{
    //     key:'innerCartonMark'
    // },
    // innerCartonMarkResultDictCode:{
    //     key:'innerCartonMarkResultDictCode'
    // },
    qcPic:{
        fromService:true
    },
    remark:{
        fromService:true
    },
    // skuMaterialCn:{
    //     key: 'skuMaterialCn'
    // },
    skuMaterialEn: {
        key: 'skuMaterialEn'
    },
    skuNameEn: {
        key: 'skuNameEn'
    },
    lengthUnitDictCode:{},
    volumeUnitDictCode:{},
    weightUnitDictCode:{},
}