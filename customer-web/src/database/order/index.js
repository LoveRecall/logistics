import overviewBysku from './overviewBysku';
import responsibility from './responsibility';
import productInfo from './productInfo';


/***
 *  新增部分
 */
import overviewByOrder from './overviewByOrder';
import orderDetail from './orderDetail';
import createOrder from './createOrder';
import inquiryOverview from './inquiryOverview';
import productInfoTable from './productInfoTable';
import productInfoTableCreate from './productInfoTableCreate';

export default {
    responsibility,
    overviewBysku,
    productInfo,

    /**
     * 新引入
     * */
    overviewByOrder,
    orderDetail,
    createOrder,
    inquiryOverview,
    productInfoTable,
    productInfoTableCreate
}
