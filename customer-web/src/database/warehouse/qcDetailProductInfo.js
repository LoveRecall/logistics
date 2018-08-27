export default{
    id: {
        _hide: true
    },
    skuId:{
        _hide:true
    },
    orderNo:{
        _hide:true
    },
    purchaserHandle:{
        _hide:true
    },
    inboundSkuId:{
        _hide:true
    },
    skuCode: {
        key: 'skuCode',
        type: 'String'
    },
    customerSkuCode: {
        key: 'customerSkuCode',
        type: 'String'
    },
    orderSkuQuantity: {
        key: 'orderSkuQty',
        type: 'Number',
        _calculate:true
    },
    expectQcQty: {
        key: 'expectQcQty',
        type: 'Number',
        _calculate:true
    },
    skuQcResultDictCode: {
        key: 'skuQcResultDictCode',
        type: 'String',
        isFWS: true
    },
    skuInventoryStatusDictCode:{
        key: 'skuInventoryStatusDictCode',
        type: 'String',
        _sort:false
    },
    
    // factorySkuCode: {
    //     key: 'factorySkuCode',
    //     type: 'String'
    // },
    // skuNameCn: {
    //     key: 'skuNameCn',
    //     type: 'String'
    // },
    skuBrand: {
        key: 'skuBrand',
        type: 'String'
    },
    skuDesign: {
        key: 'skuDesign',
        type: 'String'
    },
    skuInnerCartonMethodEn: {
        _sort:false,
    },
    skuMethodPkgEn: {
        _sort:false,
    },
    // packingMethodCn: {
    //     key: 'packingMethodCn',
    //     type: 'String'
    // },
    // innerCartonPackingMethodCn: {
    //     key: 'innerCartonPackingMethodCn',
    //     type: 'String'
    // },
    deliveryDate: {
        key: 'deliveryDate',
        type: 'String'
    },
    unit: {
        key: 'skuUnitDictCode',
        type: 'String'
    },
    
    inboundNo: {
        key: 'inboundNo',
        type: 'String'
    },
    
    samplingRate: {
        key: 'samplingRate',
        type: 'String'
    },
    checkOuterCartons:{
        key: 'checkOuterCartonQty',
        type: 'Number',
        _calculate:true,
        isFWS: true
    },
    unqualifiedProcessingMode: {
        key: 'unqualifiedProcessingMode',
        type: 'String'
    },
    outerCartonTotalQty: {
        key: 'outerCartonTotalQty',
        type: 'Number'
    },
    skuLength: {
        key: 'skuLength',
        type: 'Number',
        isFWS: true
    },
    skuWidth: {
        key: 'skuWidth',
        type: 'Number'
    },
    skuHeight: {
        key: 'skuHeight',
        type: 'Number'
    },
    skuNetWeight:{
        key: 'skuNetWeight',
        type: 'Number'
    },
    outerCartonSkuQty:{
        key: 'outerCartonSkuQty',
        type: 'Number'
    },
    actOuterCartonSkuQty:{
        key: 'actOuterCartonSkuQty',
        type: 'Number',
        isFWS: true
    },
    outerCartonInnerBoxQty:{
        key: 'outerCartonInnerBoxQty',
        type: 'Number'
    },
    actQuantityOfInnerBoxOuterCarton:{
        key: 'actOuterCartonInnerBoxQty',
        type: 'Number',
        isFWS: true
    },
    innerCartonSkuQty:{
        key: 'innerCartonSkuQty',
        type: 'Number'
    },
    actualQuantityInnerCarton:{
        key: 'actInnerCartonSkuQty',
        type: 'Number',
        isFWS: true
    },
    innerCartonLength:{
        key: 'innerCartonLength',
        type: 'Number',
        isFWS: true
    },
    innerCartonWidth:{
        key: 'innerCartonWidth',
        type: 'Number',
        isFWS: true
    },
    innerCartonHeight:{
        key: 'innerCartonHeight',
        type: 'Number',
        isFWS: true
    },
    innerCartonNetWeight:{
        key: 'innerCartonNetWeight',
        type: 'Number',
        isFWS: true
    },
    innerCartonGrossWeight:{
        key: 'innerCartonGrossWeight',
        type: 'Number',
        isFWS: true
    },
    innerCartonVolume:{
        key: 'innerCartonVolume',
        type: 'Number',
        isFWS: true
    },
    outerCartonLength:{
        key: 'outerCartonLength',
        type: 'Number'
    },
    outerCartonWidth:{
        key: 'outerCartonWidth',
        type: 'Number',
        isFWS: true
    },
    outerCartonHeight:{
        key: 'outerCartonHeight',
        type: 'Number',
        isFWS: true
    },
    netWeightOfOuterCarton:{
        key: 'outerCartonNetWeight',
        type: 'Number',
        isFWS: true
    },
    volumeOfOuterCarton:{
        key: 'outerCartonVolume',
        type: 'Number'
    },
    grossWeightofOuterCarton:{
        key: 'outerCartonGrossWeight',
        type: 'Number',
        isFWS: true
    },
    actualProductTotalCTNS:{
        key: 'actSkuCartonTotalQty',
        type: 'Number',
        _calculate:true
    },
    qualifiedProductsTotalCTNS:{
        key: 'qualifiedSkuCartonTotalQty',
        type: 'Number',
        _calculate:true,
        isFWS: true
    },
    unqualifiedProductTotalCTNS:{
        key: 'unqualifiedSkuCartonTotalQty',
        type: 'Number',
        _calculate:true,
        isFWS: true
    },
    actProductQuantity:{
        key: 'actSkuQty',
        type: 'Number',
        _calculate:true
    },
    qualifiedProductsTotalQTYS:{
        key: 'qualifiedSkuQty',
        type: 'Number',
        _calculate:true
    },
    unqualifiedProductsQTY:{
        key: 'unqualifiedSkuQty',
        type: 'Number',
        _calculate:true
    },
    qualifiedProductTotalNW:{
        key: 'qualifiedSkuNetWeight',
        type: 'Number',
        _calculate:true
    },
    unqualifiedProductTotalNW:{
        key: 'unqualifiedSkuNetWeight',
        type: 'Number',
        _calculate:true
    },
    qualifiedProductsTotalCBM:{
        key: 'qualifiedSkuVolume',
        type: 'Number'
    },
    unqualifiedProductsTotalCBM:{
        key: 'unqualifiedSkuVolume',
        type: 'Number',
        _calculate:true
    },
    qualifiedProductTotalGW:{
        key: 'qualifiedSkuGrossWeight',
        type: 'Number',
        _calculate:true
    },
    unqualifiedProductTotalGW:{
        key: 'unqualifiedSkuGrossWeight',
        type: 'Number',
        _calculate:true
    }, 
    unqualifiedType:{
        key: 'unqualifiedType',
        type: 'String',
        isFWS: true
    },
    skuBarCode:{
        key: 'skuBarCode',
        type: 'String',
        isFWS: true
    },
    productBarCodeResults:{
        key: 'skuBarCodeResultDictCode',
        type: 'String'
    },
    skuLabel:{
        key: 'skuLabel',
        type: 'String',
        isFWS: true
    },
    productLabelResults:{
        key: 'skuLabelResultDictCode',
        type: 'String'
    },
    innerPackingBarCode:{
        key: 'innerPackingBarCode',
        type: 'String'
    },
    innerPackingBarCodeResults:{
        key: 'innerPackingBarCodeResultDictCode',
        type: 'String',
        isFWS: true
    },
    innerCartonMarkResultDictCode:{
        key:'innerCartonMarkResultDictCode'
    },
    innerCartonMark:{
        key:'innerCartonMark'
    },
    outerCartonBarCode:{
        key: 'outerCartonBarCode',
        type: 'String'
    },
    outerCartonBarCodeResults:{
        key: 'outerCartonBarCodeResultDictCode',
        type: 'String',
        isFWS: true
    },
    shippingMark:{
        key: 'shippingMark',
        type: 'String',
        isFWS: true
    },
    outerCartonMarksResults:{
        key: 'shippingMarkResultDictCode',
        type: 'String'
    },
    qcPics:{
        key: 'qcPics',
        type: 'String',
        _image:true,
        _sort:false,
        isFWS: true
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
    remark:{
        key: 'remark',
        type: 'String',
        isFWS: true
    },
    lengthUnitDictCode: {
        key: 'lengthUnitDictCode',
        type: 'String'
    },
    volumeUnitDictCode: {
        key: 'volumeUnitDictCode',
        type: 'String'
    },
    weightUnitDictCode: {
        key: 'weightUnitDictCode',
        type: 'String'
    },
}