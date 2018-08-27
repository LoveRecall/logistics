
/**
 *  @param key 必填字段，用于匹配国际化json文件那边的key
 *  @param belongPage 用于区分在哪个页面上显示,因为多个页面的字段不一样，但是遍历的都是同一个文件
 *  @param showType 页面上展示的类型，是Input框还是select或者是纯文本
 *  @param isDefaultShow 专用于overview页面，用于表示哪三个字段在外面不隐藏
 *  @param isOutside 专用于detail页面，表示是否是顶部简介展示字段
 *
 *
 * */



export default {
    //overview页面字段
    categoryId: {
        key: 'categoryId',
        type: 'String',
        showType:'dropdown',
        isDefaultShow:true,               //是否是默认显示
        belongPage:'sellerProductOverview'
        // isText:true,
    },
    nameCnLike: {
        key: 'nameCnLike',
        type: 'String',
        showType:'input',
        isDefaultShow:true,               //是否是默认显示
        length: 45,
        rule:'',
        belongPage:'sellerProductOverview'

    },
    readilyAvailable: {
        key: 'readilyAvailable',
        type: 'Boolean',
        showType:'select',
        isDefaultShow:true,               //是否是默认显示
        belongPage:'sellerProductOverview',
        options:[
            {
                label:'是',
                value:true
            },
            {
                label:'否',
                value:false
            }
        ],
    },
    customerSkuCodeLike: {
        key: 'customerSkuCodeLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    exwPrice: {
        key: 'exwPrice',
        type: 'Number',
        showType:'exwNumber',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    codeLike:{
        key: 'codeLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },

    nameEnLike:{
        key: 'nameEnLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    fobPrice:{
        key: 'fobPrice',
        type: 'String',
        showType:'fobNumber',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    materialEnLike:{
        key: 'materialEnLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    country:{
        key: 'country',
        type: 'String',
        showType:'select',
        length: 10,
        belongPage:'sellerProductOverview',
        options:[
            {
                label:'中国',
                value:1
            },
            {
                label:'美国',
                value:2
            }
        ],
    },
    supplierNameLike:{
        key: 'supplierNameLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    outerCartonMethodEnLike:{
        key: 'outerCartonMethodEnLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    methodPkgEnLike:{
        key: 'methodPkgEnLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    deliveryDates:{
        key: 'deliveryDates',
        type: 'String',
        showType:'number',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    descCnLike:{
        key: 'descCnLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },
    descEnLike:{
        key: 'descEnLike',
        type: 'String',
        showType:'input',
        length: 10,
        belongPage:'sellerProductOverview'
    },

}
