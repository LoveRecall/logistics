import {localStore} from 'service/store';
import config from 'service/config';

const lang = localStore.get('language') || config.LANGUAGE;

const json = {
  importTemplate:_.extend({},
    require(`./${lang}/importTemplate/page`)
  ),
  exportTemplate:_.extend({},
    require(`./${lang}/exportTemplate/page`)
  ),
  table:_.extend({},
    require(`./${lang}/table/page`),
    require(`./${lang}/table/message`)
  ),
  common: _.extend({},
    require(`./${lang}/common/quickLinks`),
    require(`./${lang}/common/basePlaceholder`),
    require(`./${lang}/common/baseText`),
    require(`./${lang}/common/setting`),
    require(`./${lang}/common/message`),
    require(`./${lang}/common/page`),
    require(`./${lang}/common/message`),
    require(`./${lang}/common/promptInfo`),
    require(`./${lang}/common/setting`)
  ),
  inquiry: _.extend({},
    require(`./${lang}/inquiry/basicInfo.pending`),
    require(`./${lang}/inquiry/compare.pending`),
    require(`./${lang}/inquiry/index`),
    require(`./${lang}/inquiry/viewByInqury.pending`),
    require(`./${lang}/inquiry/viewBySKU.pending`),
    require(`./${lang}/inquiry/productInfo.pending`)
  ),
  logistic: _.extend({},
    // require(`./${lang}/logistic/plan/basicInfo.pending`),
    require(`./${lang}/logistic/plan/plan.base`)
  ),
  logs: _.extend({},
    require(`./${lang}/logs/logs.basic`),
    require(`./${lang}/logs/logs.basic`),
    require(`./${lang}/logs/import`)
  ),
  message: _.extend({},
    require(`./${lang}/message/message.table`),
    require(`./${lang}/message/tabs`)
  ),
  order: _.extend({},
    require(`./${lang}/order/basicinfo.pending`),
    require(`./${lang}/order/overview`),
    require(`./${lang}/order/payment`),

    //新引入
    require(`./${lang}/order/order.basic`),
    require(`./${lang}/order/order.prompt`),
    require(`./${lang}/order/order.overviewTable`),
    require(`./${lang}/order/order.orderDetail`),
    require(`./${lang}/order/order.inquiryOverview`),
    require(`./${lang}/order/order.orderDetail`),
  ),
  payment: _.extend({},
    require(`./${lang}/payment/payment`),
    require(`./${lang}/payment/payment.table`)
  ),
  product: _.extend({},
    require(`./${lang}/product/product.basic`),
    require(`./${lang}/product/productDetail`),
    require(`./${lang}/product/productOverview`),
    require(`./${lang}/product/productOverviewTable`),
    require(`./${lang}/product/product.prompt`),
    require(`./${lang}/product/product.customer`),
    require(`./${lang}/product/product.overview`),
    require(`./${lang}/product/product.history`),
  ),
  setting: _.extend({},
    require(`./${lang}/setting/department`),
    require(`./${lang}/setting/personalInfo`),
    require(`./${lang}/setting/setting.basic`),
    require(`./${lang}/setting/companyInfo`),
    require(`./${lang}/setting/setting.prompt`),
    require(`./${lang}/setting/category`),
  ),
  supplier: _.extend({},
    require(`./${lang}/supplier/detail.pending`),
    require(`./${lang}/supplier/overview`)
  ),
  track: _.extend({},
    require(`./${lang}/track/trackBysku`)
  ),
  warehouse: _.extend(
    require(`./${lang}/warehouse/warehouse.basic`),
    require(`./${lang}/warehouse/payment.pending`),
    require(`./${lang}/warehouse/qcDetailBasicInfo.pending`),
    require(`./${lang}/warehouse/summary.pending`),
    require(`./${lang}/warehouse/qcDetailBasicInfo.pending`),

      /**
       * 新配置
       * */
    require(`./${lang}/warehouse/warehouse.overview`),
    require(`./${lang}/warehouse/warehouse.createQc`),
    require(`./${lang}/warehouse/warehouse.qcOrderDetail`),
    require(`./${lang}/warehouse/warehouse.prompt`),
    require(`./${lang}/warehouse/warehouse.inboundDetail`),
    require(`./${lang}/warehouse/warehouse.inboundOverviewTable`),
    require(`./${lang}/warehouse/warehouse.outboundOverview`),
    require(`./${lang}/warehouse/warehouse.outboundDetail`),
    require(`./${lang}/warehouse/warehouse.qcOverview`),

    // 新加
    require(`./${lang}/warehouse/warehouse.createOutbound`),
  ),
  workbench: _.extend({},
    require(`./${lang}/workbench/page`),
    require(`./${lang}/workbench/task`)
  ),
  router: _.extend({},
    require(`./${lang}/router/index`)
  ),
  button: _.extend({},
    require(`./${lang}/button/index`)
  ),
  hintMessage: _.extend({},
    require(`./${lang}/hintMessage/index`)
  ),
  element: _.extend({},
    require(`./${lang}/element/date`)
  ),
  upload: _.extend({},
    require(`./${lang}/upload/message`)
  ),
  util: _.extend({},
    require(`./${lang}/util/index`)
  )
}

export default json;
