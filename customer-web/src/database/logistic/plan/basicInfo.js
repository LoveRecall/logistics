export default {
    shippmentInvoiceNo: {
        type: 'text'
    },
    logisticsID: {
        type: 'hide',
        _hide: true
    },
    logisticsStatus: { //物流状态
        type: 'text',
        _hide: true
    },
    createDate: {
        type: 'hide',
        _hide: true
    },
    estDelivaryDate: {
        type: 'date'
    },
    declareDate: {
        type: 'textDate',
        disabled: true
    },
    bookingDate: {
        type: 'textDate',
        disabled: true
    },
    estContainerStuffingDate: {
        type: 'textDate',
        disabled: true
    },
    estCustomsCleanceDate: {
        type: 'textDate',
        disabled: true
    },
    estDepartureDate: {
        type: 'textDate',
        disabled: true
    },
    estArrivalDate: {
        type: 'textDate',
        disabled: true
    },
    estReleaseDate: {
        type: 'textDate',
        disabled: true
    },
    shipServiceProvider: {
        type: 'text'
    },
    customerName: {
        type: 'hide',
        _hide: true
    },
    receiptCompany: {
        type: 'text'
    },
    shippingAgent: {
        type: 'text'
    },
    incoterm: {
        type: 'select',
        select: ['fob', 'exw', '其他']
    },
    currency: {
        type: 'select',
        select: ['USD', 'CNY', 'EUR']
    },
    payment: {
        type: 'select',
        select: ['T/T', 'L/C', 'Cash', 'Bank Transfer', 'DP', 'DA']
    },
    paymentTerms: {
        type: 'text'
    },
    transportationWay: {
        type: "text",
    disabled: true
    },
    loadingType: {
        type: 'text',
        disabled: true
    },
    permitedForTransportation: {
        type: 'select',
        select: ['是', '否']
    },
    BLType: {
        type: 'select',
        select: ['电放', '正本']
    },
    BLQuantity: {
        type: 'number'
    },
    BLNumber: {
        type: 'text'
    },
    shipper: {
        type: 'text'
    },
    consignee: {
        type: 'text'
    },
    notify: {
        type: 'text'
    }
}