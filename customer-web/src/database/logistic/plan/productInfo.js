export default {
  "id": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "vId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "argID": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "skuPictures":{
    type: 'String',
    _image:true,
    _upload:{
      readonly:true
    },
    typeSlef: 'text'
  },
  "skuCustomerSkuCode": {
    _filed:'customerSkuCode',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuNameEn": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
  },
  "skuSupplierAbbr": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
  },
  "orderNo": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "containerNo": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "totalQuantityOfOuterCartonsInContainer": {
    key: 'totalContainerOuterCartonsQty',
    _filed: 'totalContainerOuterCartonsQty',
    // computedKey 计算要使用的key 的联动值
    // computedResKey 计算的结果显示的key 的联动值
    computed : [
      {computedKey:'skuOuterCartonQty',computedResKey:'totalContainerQty'},
      {computedKey:'skuOuterCartonVolume',computedResKey:'totalCtnCbm'},
      {computedKey:'skuOuterCartonNetWeight',computedResKey:'totalCtnNw'},
      {computedKey:'skuOuterCartonRoughWeight',computedResKey:'totalCtnGw'}
    ],
    type: 'String',
    _toFixed:1,
    typeSlef: 'text',
    _important: true
  },
  "totalQuantityInContainer": {
    key: 'totalContainerQty',
    _filed: 'totalContainerQty',
    _disabled: true,
    type: 'String',
    typeSlef: 'text',
    _important: true
  },
  "totalVolumeInContainer": {
    key: 'totalCtnCbm',
    _filed: 'totalContainerVolume',
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _important: true
  },
  "totalNetWeightInContainer": {
    key: 'totalCtnNw',
    _filed: 'totalContainerNetWeight',
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _important: true
  },
  "totalContainerGrossWeight": {
    key:'totalCtnGw',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "unitExportPrice": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _important: true
  },
  "totalPriceOfExport": {
    key:'totalExportPrice',
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _important: true
  },
  "currency": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuSupplierId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "entryDt": {
    type: 'Date',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "entryName": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "skuCode": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "orderId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "skuId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "fieldDisplay": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "skuNameCn": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "ProductDescriptionCustomer": {
    key:'skuDescCustomer',
    type: 'text'
  },
  "blSkuName": {
    key:'skuNameCustomer',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "customsDeclarationNameCn": {
    key:'customDeclarationNameCn',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "customsDeclarationNameEn": {
    key:'customDeclarationNameEn',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "hsCode": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "reportElement": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "supplierNo": {
    key:'supplierCode',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuCustomsNameCn": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuCustomsNameEn": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuUnit": {
    _filed:'unit',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuQty": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuCartonQty": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "containerId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "containerType": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonQty": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _important: true
  },
  "skuOuterCartonVolume": {
    _filed:'outerCartonVolume',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonNetWeight": {
    _filed:'outerCartonNetWeight',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonRoughWeight": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonLength": {
    _filed:'outerCartonLenth',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonWidth": {
    _filed:'outerCartonWidth',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonHeight": {
    _filed:'outerCartonHeight',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonRoughWeight": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuShippingMarks": {
    key:'shippingMarks',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonBarCode": {
    key:'outerCartonBarCode',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuSupplierCompanyId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  },
  "skuSupplierTenantId": {
    type: 'String',
    _disabled: true,
    typeSlef: 'text',
    _hide: true
  }
}
