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
    key:'skuCustomsNameCn',
    _filed:'customDeclarationNameCn',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "customsDeclarationNameEn": {
    key:'skuCustomsNameEn',
    _filed:'customDeclarationNameEn',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "hsCode": {
    key:'skuCustomsCode',
    _filed:'hsCode',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "reportElement": {
    key:'skuDeclareElement',
    _filed:'reportElement',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "supplierNo": {
    key:'skuSupplierCode',
    _filed:'supplierCode',
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
  "outerCartonLenth": {
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
    _filed:'shippingMarks',
    type: 'String',
    _disabled: true,
    typeSlef: 'text'
  },
  "skuOuterCartonBarCode": {
    _filed:'outerCartonBarCode',
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
  },
  "skuQuantityOfOuterCarton": {
    key:'outerCartonQty',
    type: 'text'
  },
}
