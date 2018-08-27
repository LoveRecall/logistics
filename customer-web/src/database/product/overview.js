export default {
    categoryId:{
        type:'dropdown',
        dropDownType:'category',
        _isDefaultShow:true,
        _list:[],
        _defaultProps:{
            label: 'name',
            children: 'children'
        }
    },
    nameEnLike:{
        _isDefaultShow:true,
    },
    readilyAvailable:{
        type:'select',
        selectCode:'RA_IS',
        _isDefaultShow:true
    },
    customerSkuCodeLike:{

    },
    exwPrice:{
        type:'between',
        betweenKey:['minExwPrice','maxExwPrice'],
    },
    codeLike:{},
    fobPrice:{
        type:'between',
        betweenKey:['minFobPrice','maxFobPrice'],
    },
    materialEnLike:{},
    // country:{
    //     type:'select',
    //     multipleSelect:true,
    //     selectCode:'country',
    //     _filterable:true,
    //     _multiple:true,
    // },
    supplierNameLike:{},
    outerCartonMethodEnLike:{},
    methodPkgEnLike:{},
    deliveryDates:{
        type:'number'
    },
    descEnLike:{},
}