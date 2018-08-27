/*
   type: text select attachment 
   _disabled:true false
   _hide:true
   key:后台字段
   _calu:合计
   _slot:插槽
*/

export default {
    _firstColumn: {
        key: 'updateDt',
        label: ' ',
        type: 'text',
        _disabled: true,
        _title: 'remark',
        state: 'time'
    },
    _remark: {
        _hide: true
    },
    id: {
        key: 'id',
        _hide: true
    },
    companyId: {
        key: 'companyId',
        _hide: true
    },
    incoterm: {
        key: 'incoterm',
        _hide: true
    },
    orderId: {
        key: 'orderId',
        _hide: true
    },
    orderNo: {
        key: 'orderNo',
        _hide: true
    },
    ownerId: {
        key: 'ownerId',
        _hide: true
    },
    _id: {
        _hide: true
    },
    _remark: {
        _hide: true,
    },
    skuSupplierCode: {
        _hide: true
    },
    skuPic: {
        key: 'skuPic',
        type: 'attachment',
        _disabled: true
    },
    skuNameEn: {
        key: 'skuNameEn',
        type: 'text',
        _disabled: true
    },
    skuNameCn: {
        key: 'skuNameCn',
        type: 'text',
        _disabled: true
    },
    skuDescCn: {
        key: 'skuDescCn',
        type: 'text',
        _disabled: true
    },
    skuDescEn: {
        key: 'skuDescEn',
        type: 'text',
        _disabled: true
    },
    skuDescCustomer: {
        key: 'skuDescCustomer',
        _disabled: true
    },
    skuNameCustomer: {
        key: 'skuNameCustomer',
        type: 'text',
        _disabled: true
    },
    skuCustomerSkuCode: {
        key: 'skuCustomerSkuCode',
        _disabled: true
    },
    skuCode: {
        key: 'skuCode',
        type: 'text',
        _disabled: true,
        _hide: true
    },
    skuSupplierName: {
        key: 'skuSupplierName',
        _disabled: true
    },
    //FOB币种
    skuFobCurrency: {
        key: 'skuFobCurrency',
        _slot: 'skuFobCurrency',
        type: 'select'
    },
    skuFobPrice: {
        key: 'skuFobPrice',
    },
    skuFobPort: {
        key: "skuFobPort",
        _slot: 'skuFobPort',
        type: 'select'
    },
    skuUnit: {
        key: 'skuUnit'
    },
    skuMaterialEn: {
        key: 'skuMaterialEn',
    },
    skuMaterialCn: {
        key: 'skuMaterialCn',
    },
    skuQty: {
        key: 'skuQty',
        _calu: true
    },
    skuPrice: {
        key: 'skuPrice',
        _calu: true
    },
    skuRateValueAddedTax: {
        key: 'skuRateValueAddedTax',

    },
    skuTaxRefundRate: {
        key: 'skuTaxRefundRate',

    },

    skuColourEn: {
        key: 'skuColourEn',

    },
    skuColourCn: {
        key: 'skuColourCn',

    },
    skuMinOrderQty: {
        key: 'skuMinOrderQty'
        // S可编辑/C不可编辑
    },
    skuDeliveryDates: {
        key: 'skuDeliveryDates',

    },
    skuDesign: {
        key: 'skuDesign'
    },
    skuCategoryOne: {
        key: 'skuCategoryOne',
        _disabled: true,
    },
    skuCategoryTwo: {
        key: 'skuCategoryTwo',
        _disabled: true,
    },
    skuCategoryThree: {
        key: 'skuCategoryThree',
        _disabled: true,
    },
    skuCategoryFour: {
        key: 'skuCategoryFour',
        _disabled: true,
    },
    skuCustomsCode: {
        key: 'skuCustomsCode',
        _disabled: true,
    },
    skuCustomsNameCn: {
        key: 'skuCustomsNameCn',

    },
    skuCustomsNameEn: {
        key: 'skuCustomsNameEn',

    },

    //jpag
    skuTradeMarkCn: {
        key: 'skuTradeMarkCn',
        type: 'attachment'
    },
    skuTradeMarkEn: {
        key: 'skuTradeMarkEn',
        type: 'attachment'
    },


    skuCommodityInspectionCn: {
        key: 'skuCommodityInspectionCn',

    },
    skuCommodityInspectionEn: {
        key: 'skuCommodityInspectionEn',

    },
    skuDeclareElement: {
        key: 'skuDeclareElement',

    },
    //原产地
    skuOrigin: {
        key: 'skuOrigin',
        _slot: 'skuOrigin',
        type: 'select'
        //select
    },
    //检验检疫类别
    skuInspectQuarantineCategory: {
        key: 'skuInspectQuarantineCategory',
        _slot: 'skuInspectQuarantineCategory'
        //select
    },
    //重量单位
    skuUnitWeight: {
        key: 'skuUnitWeight',
        _slot: 'skuUnitWeight',
        type: 'select'
        //select
    },
    //长度单位
    skuUnitLength: {
        key: 'skuUnitLength',
        _slot: 'skuUnitLength',
        type: 'select'
        //select
    },
    //体积单位
    skuUnitVolume: {
        key: 'skuUnitVolume',
        _slot: 'skuUnitVolume',
        type: 'select'
        //select
    },
    skuLength: {
        key: 'skuLength',
    },
    skuWidth: {
        key: 'skuWidth',
    },
    skuHeight: {
        key: 'skuHeight',
    },
    skuGrossWeight: {
        key: 'skuNetWeight',
    },
    skuNetWeight: {
        key: 'skuNetWeight',

    },
    skuVolume: {
        key: 'skuVolume',

    },

    //产品包装方式CN
    skuMethodPkgCn: {
        key: 'skuMethodPkgCn',
        _slot: 'skuMethodPkgCn',
        type: 'select'
    },
    //产品包装方式EN
    skuMethodPkgEn: {
        key: 'skuMethodPkgEn',
        _slot: 'skuMethodPkgEn',
        type: 'select'
    },
    //中包单位
    skuInnerCartonUnit: {
        key: 'skuInnerCartonUnit',
        _slot: 'skuInnerCartonUnit',
        type: 'select'
    },
    skuInnerCartonQty: {
        key: 'skuInnerCartonQty',
        _calu: true
    },
    skuInnerCartonLength: {
        key: 'skuInnerCartonLength',

    },
    skuInnerCartonWidth: {
        key: 'skuInnerCartonWidth',
        _disabled: true,
    },
    skuInnerCartonHeight: {
        key: 'skuInnerCartonHeight',

    },
    skuInnerCartonWeightNet: {
        key: 'skuInnerCartonWeightNet',

    },
    skuInnerCartonRoughWeight: {
        key: 'skuInnerCartonRoughWeight',

    },
    skuInnerCartonVolume: {
        key: 'skuInnerCartonVolume',

    },
    skuInnerCartonDesc: {
        key: 'skuInnerCartonDesc',

    },
    //中包包装方式CN
    skuInnerCartonMethodCn: {
        key: 'skuInnerCartonMethodCn',
        _slot: 'skuInnerCartonMethodCn',
        type: 'select'
    },
    //中包包装方式EN
    skuInnerCartonMethodEn: {
        key: 'skuInnerCartonMethodEn',
        _slot: 'skuInnerCartonMethodEn',
        type: 'select'
    },

    skuOuterCartonUnit: {
        key: 'skuOuterCartonUnit',

    },
    skuOuterCartonDesc: {
        key: 'skuOuterCartonDesc',

    },
    skuInnerCartonOuterNum: {
        key: 'skuInnerCartonOuterNum',
        _calu: true
    },
    skuOuterCartonQty: {
        key: 'skuOuterCartonQty',
        _calu: true
    },
    skuOuterCartonLength: {
        key: 'skuOuterCartonLength',

    },
    skuOuterCartonWidth: {
        key: 'skuOuterCartonWidth',

    },
    skuOuterCartonHeight: {
        key: 'skuOuterCartonHeight',

    },
    skuOuterCartonNetWeight: {
        key: 'skuOuterCartonNetWeight',

    },
    skuOuterCartonRoughWeight: {
        key: 'skuOuterCartonRoughWeight',

    },
    skuOuterCartonVolume: {
        key: 'skuOuterCartonVolume',

    },
    //外包装方式CN
    skuOuterCartonMethodCn: {
        key: 'skuOuterCartonMethodCn',
        _slot: 'skuOuterCartonMethodCn',
        type: 'select'
    },
    //外包装方式EN
    skuOuterCartonMethodEn: {
        key: 'skuOuterCartonMethodEn',
        _slot: 'skuOuterCartonMethodEn',
        type: 'select'
    },

    skuBrand: {
        key: 'skuBrand',
    },
    skuApplicableAge: {
        key: 'skuApplicableAge',

    },
    skuExpireDates: {
        key: 'skuExpireDates',

    },
    skuExpireUnit: {
        key: 'skuExpireUnit',

    },
    skuComments: {
        key: 'skuComments',
        _disabled: true,
    },

    skuId: {
        _hide: true,
        key: 'skuId',
        _disabled: true,
    },

    //产品状态
    skuStatus: {
        key: 'skuStatus',
        _slot: 'skuStatus',
        type: 'select'
    },

    skuSaleStatus: {
        key: 'skuSaleStatus'
    },
    skuLabel: {
        key: 'skuLabel'
    },

    skuBarCode: {
        key: 'skuBarCode'
    },

    skuInnerPackBarCode: {
        key: 'skuInnerPackBarCode',

    },
    skuInnerPackLabe: {
        key: 'skuInnerPackLabe'
    },
    skuInnerPackCode: {
        key: 'skuInnerPackCode'
    },

    skuShippingMarks: {
        key: 'skuShippingMarks'
    },
    skuOuterCartonBarCode: {
        key: 'skuOuterCartonBarCode'
    },
    skuOuterCartonCode: {
        key: 'skuOuterCartonCode'
    },
    skuLabelPic: {
        key: "skuLabelPic",
        type: 'attachment',
    },
    skuLabelDesc: {
        key: 'skuLabelDesc'
    },
    skuPkgMethodPic: {
        key: 'skuPkgMethodPic',
        type: 'attachment',
    },
    skuInnerCartonPic: {
        key: 'skuInnerCartonPic',
        type: 'attachment',
    },
    skuOuterCartonPic: {
        key: 'skuOuterCartonPic',
        type: 'attachment',
    },
    //是否需要样品
    skuSample: {
        key: 'skuSample',
        // 是否
        _slot: 'skuSample',
        type: 'select'
    },
    skuSampleQty: {
        key: 'skuSampleQty',
        type: 'text',
        _calu: true
    },
    skuSamplePrice: {
        key: 'skuSamplePrice',
        type: 'text',
        _calu: true
    },
    skuDeliveredQty: {
        key: 'skuDeliveredQty',
        _disabled: true,
        _calu: true
    },
    skuUndeliveredQty: {
        key: 'skuDeliveredQty',
        _disabled: true,
        _calu: true
    },
    skuQuotationNo: {
        key: 'skuQuotationNo',
        _disabled: true,
    },
    skuRemarkOne: {
        key: 'skuRemarkOne'
    },
    skuRemarkTwo: {
        key: 'skuRemarkTwo'
    },
    skuRemarkThree: {
        key: 'skuRemarkThree'
    },
    skuAdditionalOne: {
        key: 'skuAdditionalOne',
        type: 'attachment',
    },
    skuAdditionalTwo: {
        key: 'skuAdditionalTwo',

        type: 'attachment',
    },
    skuAdditionalThree: {
        key: 'skuAdditionalThree',
        type: 'attachment',
    },
    skuAdditionalFour: {
        key: 'skuAdditionalFour',
        type: 'attachment',
    },
    skuUntestedQty: {
        key: 'skuUntestedQty',
        _disabled: true,
        _calu: true
    },
    skuQualifiedQty: {
        key: 'skuQualifiedQty',
        _disabled: true,
        _calu: true
    }
}
