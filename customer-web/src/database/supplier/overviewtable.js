export default {
    //.......................表格
   supplierName: {
        key: 'name'
    },
    supplierAbbr: {
       key:'shortName',
       mustShowColumn: true
    },
   supplierType: {
        key: 'type',
        transForm: 'SR_TYPE'
    },
    country: {
        key: 'country',
        transForm:''
    },
  companyId: {
        _hide: true,
        key: 'companyId'
    },
    mainbusinessscope: {
        key: 'mainBuiness'
    },
    provideincoterm: {
        key: 'incoterm'
    },
   exportLicense: {
        key: 'exportLicense'
    },
    id: {
        _hide: true,
        key: 'id',
    },
    logo: {
        _hide: true,
    },
   provideIncoterm: {
        _hide: true,
    },

    recycle: {
        _hide: true,
    },
  bookmarkId:{
    key:"bookmarkId",
    _hide: true,
  },
  supplierId:{
    key:'supplierId',
    _hide: true,
  }
}
