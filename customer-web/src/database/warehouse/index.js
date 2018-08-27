import inbound from './inbound';
import inboundTable from './inboundTable';
import qcOrderTable from './qcOrderTable';
import inboundOrderTable from './inboundOrderTable';
import warehouseTable from './warehouseTable';
import sellerWarehouseTable from './sellerWarehouseTable';
import inboundOrderProductTable from './inboundOrderProductTable';
import inboundDetailProductTable from './inboundDetailProductTable';
import outbound from './outbound';
import outboundOrderTable from './outboundOrderTable';
import outboundProduct from './outboundProduct';
import qcDetailBasicInfo from './qcDetailBasicInfo';
import summary from './summary';
import createQcProductDialog from './createQcProductDialog';
import outboundOverviewTable from './outboundOverviewTable';
import createQcProductTable from './createQcProductTable';
import payment from './payment';
import qcDetailProductInfo from './qcDetailProductInfo';
import qcOrderDetailBasicInfo from './qcOrderDetailBasicInfo';



/**
 * 新配置
 * */
import warehouseOverview from './warehouse/warehouseOverview';
import qcPaymentTable from './warehouse/warehouse.qcPaymentTable';

export default {
    inbound,
    outbound,
    inboundTable,
    qcOrderTable,
    inboundOrderTable,
    warehouseTable,
    inboundOrderProductTable,
    sellerWarehouseTable,
    inboundDetailProductTable,
    outboundOrderTable,
    outboundProduct,
    qcDetailBasicInfo,
    summary,
    createQcProductDialog,
    outboundOverviewTable,
    createQcProductTable,
    payment,
    qcDetailProductInfo,


    /**
     * 新配置
     * */
    warehouseOverview,
    qcPaymentTable,
    qcOrderDetailBasicInfo
}
