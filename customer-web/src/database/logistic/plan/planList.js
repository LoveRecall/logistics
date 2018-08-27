export default {
  id: {
    type: 'text',
    _hide: true
  },
  destinationCountry: {
    type: 'country'
  },
  destinationPort: {
    type: 'text'
  },
  departureCountry: {
    type: 'country'
  },
  departurePort: {
    key:'deliveryPort',
    type: 'text'
  },
  logisticsNo: {
    type: 'text'
  },
  bookingDate:{
    key:'actBookingDate',
    _filed:'actBookingDate',
    type: 'textDate'
  },
  estContainerStuffingDate: {
    type: 'textDate'
  },
  estDepartureDate: {
    type: 'textDate'
  },
  estArrivalDate: {
    type: 'textDate'
  },
  declareDate: {
    key:'actDeclareDate',
    type: 'textDate'
  },
  actContainerStuffingDate: {
    type: 'textDate'
  },
  actCustomsCleanceDate: {
    type: 'textDate'
  },
  actDepartureDate: {
    type: 'textDate'
  },
  actArrivalDate: {
    type: 'textDate'
  },
  actReleaseDate: {
    type: 'textDate'
  },
  blNo: {
    type: 'text'
  },
  transportCompany: {
    type: 'text'
  },
  contractNo: {
    type: 'text'
  },
  commercialInvoiceNo: {
    type: 'text'
  },
  commercialInvoiceDate: {
    type: 'textDate'
  },
  shippingAgent: {
    type: 'text'
  },
  hq40qty: {
    type: 'text'
  },
  gp40qty: {
    type: 'text'
  },
  gp20qty: {
    type: 'text'
  },
  logisticsStatus: {
    _hide:true,
    type: 'text'
  }
}
