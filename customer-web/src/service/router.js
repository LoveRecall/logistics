import Vue from 'vue'
import Vuex from 'vuex';
import Router from 'vue-router'
import Config from 'service/config';
import Layout from 'components/layout/index.vue';
import $i from '../language/index';
import {Notification, Message} from 'element-ui';
import {localStore, sessionStore} from 'service/store';
import Util from 'service/util';

Vue.use(Router);

export const routerMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/workbench/index',
    hidden: true, // 在侧边栏中不显示该菜单
  },
  {
    path: '/login',
    hidden: true,
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/workbench',
    component: Layout,
    meta: {name: $i.router.workbench},
    redirect: '/workbench/index',
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: 'workbench',
        meta: {},
        component: () => import('../views/workbench/index.vue')
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    meta: {
      name: $i.router.product,
      auth: 'PRODUCT'
    },
    redirect: '/product/sourcing',
    children: [
      {
        path: 'sourcing',
        name: 'productSourcingOverview',
        meta: {
          auth: 'PRODUCT:OVERVIEW',
          name: $i.router.productSourcingOverview
        },
        component: () => import('../views/product/sourcing/sourcing'),
      },
      {
        path: 'sourcingDetail',
        name: 'productSourcingDetail',
        hidden: true,
        meta: {
          auth: 'PRODUCT:DETAIL',
          name: $i.router.productSourcingDetail
        },
        component: () => import('../views/product/sourcing/detail'),
      },
      {
        path: 'bookmark',
        name: 'productBookmarkOverview',
        meta: {
          auth: 'PRODUCT:BOOKMARK_OVERVIEW',
          name: $i.router.productBookmarkOverview
        },
        component: () => import('../views/product/bookmark/bookmark'),
      },
      {
        path: 'bookmarkDetail',
        name: 'productBookmarkDetail',
        hidden: true,
        meta: {
          auth: 'PRODUCT:BOOKMARK_DETAIL',
          name: $i.router.productBookmarkDetail
        },
        component: () => import('../views/product/bookmark/detail'),
      },
      {
        path: 'bookmarkManuallyAdd',
        name: 'productBookmarkManuallyAdd',
        hidden: true,
        meta: {
          auth: 'PRODUCT:BOOKMARK_OVERVIEW:MANUALLY_ADD',
          name: $i.router.productBookmarkManuallyAdd
        },
        component: () => import('../views/product/bookmark/manuallyAdd'),
      },
      {
        path: 'bookmarkArchive',
        name: 'productBookmarkArchive',
        hidden: true,
        meta: {
          auth: 'PRODUCT:ARCHIVE',
          name: $i.router.bookmarkArchive
        },
        component: () => import('../views/product/bookmark/archive'),
      },

      {
        path: 'compare',
        name: 'productCompareOverview',
        meta: {
          auth: 'PRODUCT:COMPARE_OVERVIEW',
          name: $i.router.productCompareOverview
        },
        component: () => import('../views/product/compare/overview'),
      },
      {
        path: 'compareDetail/:type',
        name: 'productCompareDetail',
        hidden: true,
        meta: {
          auth: 'PRODUCT:COMPARE_DETAIL',
          name: $i.router.productCompareDetail
        },
        component: () => import('../views/product/compare/compare'),
      },
      {
        path: 'compareArchive',
        name: 'productCompareRecycleBin',
        hidden: true,
        meta: {
          auth: 'PRODUCT:COMPARE_ARCHIVE',
          name: $i.router.productCompareRecycleBin
        },
        component: () => import('../views/product/compare/archive'),
      },
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    meta: {
      name: $i.router.supplier,
      auth: ['SUPPLIER']
    },
    redirect: '/supplier/sourcing',
    children: [
      {
        path: 'sourcing',
        name: 'supplierSourcing',
        meta: {
          draft: false,
          recycleBin: false,
          log: true,
          name: $i.router.supplierOverview,
          auth: ['SUPPLIER:OVERVIEW']
        },
        component: () => import ('../views/supplier/sourcing/sourcing.vue')
      },
      {
        path: 'bookmark',
        name: 'supplierBookmark',
        meta: {
          draft: false,
          recycleBin: true,
          log: true,
          name: $i.router.supplierBookmark,
          auth: ['SUPPLIER:BOOKMARK_OVERVIEW']
        },

        component: () => import ('../views/supplier/bookmark/bookmark.vue')
      },
      {
        path: 'bookmarkDetail',
        name: 'supplierBookmarkDetail',
        hidden: true,
        meta: {
          draft: false,
          recycleBin: true,
          log: true,
          name: $i.router.supplierBookmarkDetail,
          auth: ['SUPPLIER:BOOKMARK_DETAIL']
        },
        component: () => import ('../views/supplier/bookmark/bookmarkDetail.vue')
      },
      {
        path: 'bookmarkRecycleBin',
        name: 'bookmarkRecycleBin',
        hidden: true,
        meta: {
          draft: false,
          recycleBin: true,
          log: true,
          name: $i.router.supplierBookmarkRecycleBin
        },
        component: () => import ('../views/supplier/bookmark/recycleBin.vue')
      },
      {
        path: 'sourcingDetail',
        name: 'supplierSourcingDetail',
        hidden: true,
        meta: {
          draft: false,
          recycleBin: false,
          log: true,
          name: $i.router.supplierSourcingDetail,
          auth: ['SUPPLIER:DETAIL']
        },
        component: () => import ('../views/supplier/sourcing/sourcingDetail.vue')
      },
      {
        path: 'compareDetail/:type',
        name: 'supplierCompareDetail',
        hidden: true,
        meta: {
          draft: false,
          recycleBin: true,
          log: true,
          name: $i.router.supplierCompareDetail,
          auth: ['SUPPLIER:COMPARE_DETAIL']
        },
        component: () => import ('../views/supplier/compare/compare.vue')
      },
      {
        path: 'compare',
        name: 'supplierCompare',
        meta: {
          draft: false,
          recycleBin: true,
          log: true,
          name: $i.router.supplierCompareOverview,
          auth: ['SUPPLIER:COMPARE_OVERVIEW']
        },
        component: () => import ('../views/supplier/compare/overview.vue')
      },
      {
        path: 'compareArchive',
        name: 'supplierCompareArchive',
        hidden: true,
        meta: {
          draft: false,
          recycleBin: true,
          log: true,
          name: $i.router.compareArchive
        },
        component: () => import ('../views/supplier/compare/archiveSupplier.vue')
      }
    ]
  },
  {
    path: '/negotiation',
    component: Layout,
    redirect: '/negotiation/inquiry',
    name: 'negotiation',
    meta: {name: $i.router.negotiation, auth: 'INQUIRY'},
    children: [
      {
        path: 'inquiry',
        name: 'negotiationInquiry',
        meta: {
          name: $i.router.negotiationInquiryOverview,
          auth: 'INQUIRY:OVERVIEW'
        },
        component: () => import('../views/negotiation/inquiryOverview')
      },
      {
        path: 'inquiryDetail',
        name: 'negotiationInquiryDetail',
        hidden: true,
        meta: {
          name: $i.router.negotiationInquiryDetail,
          messageBoard: 'code',
          auth: 'INQUIRY:DETAIL'
        },
        component: () => import('../views/negotiation/inquiryDetail')
      },
      {
        path: 'createInquiry',
        name: 'negotiationCreateInquiry',
        hidden: true,
        meta: {
          name: $i.router.negotiationCreateInquiry,
          auth: 'INQUIRY:OVERVIEW:CREATE_INQUIRY'
        },
        component: () => import('../views/negotiation/createInquiry')
      },
      {
        path: 'compare',
        name: 'negotiationCompare',
        meta: {
          name: $i.router.negotiationCompareOverview,
          auth: 'INQUIRY:OVERVIEW:COMPARE'
        },
        component: () => import('../views/negotiation/compareOverview')
      },
      {
        path: 'compareDetail/:type',
        name: 'negotiationCompareDetail',
        hidden: true,
        meta: {
          name: $i.router.negotiationCompareDetail,
          auth: 'INQUIRY:COMPARE_DETAIL'
        },
        component: () => import('../views/negotiation/compare')
      },
      {
        path: 'draft/:type',
        name: 'negotiationDraft',
        hidden: true,
        meta: {
          name: $i.router.negotiationDraft,
          auth: 'INQUIRY:DRAFT_OVERVIEW'
        },
        component: () => import('../views/negotiation/draft')
      },
      {
        path: 'recycleBin/:type',
        name: 'negotiationRecycleBin',
        hidden: true,
        meta: {
          name: $i.router.negotiationRecycleBin,
          auth: 'INQUIRY:ARCHIVE'
        },
        component: () => import('../views/negotiation/recycleBin')
      }
    ]
  },
  {
    path: '/payment',
    meta: {
      name: $i.router.payment,
      auth: ['PAYMENT']
    },
    component: Layout,
    redirect: '/payment/index',
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: 'payment',
        meta: {
          draft: true,
          recycleBin: true,
          log: true,
        },
        component: () => import('../views/payment/index.vue')
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/overview',
    meta: {
      name: $i.router.order,
      auth: 'ORDER',
    },
    noDropdown: true,
    children: [
      {
        path: 'overview',
        name: 'order',
        meta: {
          auth: 'ORDER:OVERVIEW',
          name: $i.router.orderOverview
        },
        component: () => import('../views/order/overView.vue')
      },
      {
        path: 'create',
        name: 'orderCreate',
        meta: {
          auth: 'ORDER:OVERVIEW:CREATE',
          name: $i.router.orderCreate
        },
        component: () => import('../views/order/createOrder/createOrder.vue')
      },
      {
        path: 'detail',
        name: 'Order Detail',
        meta: {
          auth: 'ORDER:DETAIL',
          name: $i.router.orderDetail
        },
        component: () => import('../views/order/orderDetail.vue')
      },

      {
        path: 'draft',
        name: 'orderDraft',
        meta: {
          auth: 'ORDER:DRAFT_OVERVIEW',
          name: $i.router.orderDraft
        },
        component: () => import('../views/order/draftOverview.vue')
      }, {
        path: 'archiveOrder',
        name: 'orderArchiveOrder',
        meta: {
          auth: 'ORDER:OVERVIEW_ARCHIVE',
          name: $i.router.orderRecycleBin
        },
        component: () => import('../views/order/archiveOrder.vue')
      },
      {
        path: 'archiveDraft',
        name: 'orderArchiveDraft',
        meta: {
          auth: 'ORDER:DRAFT_ARCHIVE',
          name: $i.router.orderRecycleBin
        },
        component: () => import('../views/order/archiveDraft.vue')
      }
    ]
  },
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/overview',
    name: 'Warehouse',
    meta: {
      auth: 'WAREHOUSE',
      name: $i.router.warehouse
    },
    noDropdown: false,
    children: [
      {
        path: 'overview',
        name: 'Warehouse Overview',
        meta: {
          auth: 'WAREHOUSE:OVERVIEW',
          name: $i.router.warehouseOverview
        },
        component: () => import('../views/warehouse/warehouseOverview.vue'),
      },
      {
        path: 'qcOverview',
        name: 'warehouseQc',
        meta: {
          auth: 'QC:ORDER_OVERVIEW',
          name: $i.router.warehouseQcOverview
        },
        component: () => import('../views/warehouse/qcOverview.vue'),
      },
      {
        path: 'qcDetail',
        name: 'warehouseQcOrderDetail',
        hidden: true,
        meta: {
          auth: 'QC:ORDER_DETAIL',
          name: $i.router.warehouseQcOrderDetail
        },
        component: () => import('../views/warehouse/qcDetail.vue'),
      },
      {
        path: 'createQc',
        name: 'warehouseCreateQcOrder',
        hidden: true,
        meta: {
          auth: 'QC:ORDER_OVERVIEW:CREATE',
          name: $i.router.warehouseCreateQcOrder
        },
        component: () => import('../views/warehouse/createQc.vue'),
      },
    ]
  },
  {
    path: '/logistic',
    name: 'logistic',
    meta: {
      name: $i.router.logistic,
      auth: ['LOGISTICS']
    },
    component: Layout,
    redirect: '/logistic/plan',
    children: [
      {
        path: 'plan',
        name: 'overviewPlan',
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: true,
          importTask: true,
          name: $i.router.logisticPlanOverview,
          auth: ['LOGISTICS:PLAN_OVERVIEW']
        },
        component: () => import('../views/logistic/logisticPlanOverview')
      },
      {
        path: 'loadingList',
        name: 'overviewLoadingList',
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: true,
          importTask: true,
          name: $i.router.logisticLoadingListOverview,
          auth: ['LOADING_LIST:OVERVIEW']
        },
        component: () => import('../views/logistic/logisticPlanOverview')
      },
      {
        path: 'draft',
        name: 'overviewDraft',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: true,
          importTask: false,
          name: $i.router.logisticLoadingDraft,
          auth: ['LOGISTICS:PLAN_DRAFT_OVERVIEW']
        },
        component: () => import('../views/logistic/logisticPlanOverview')
      },
      {
        path: 'archivePlan',
        name: 'archivePlan',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: true,
          importTask: false,
          name: $i.router.archive,
          auth: ['LOGISTICS:ARCHIVE']
        },
        component: () => import('../views/logistic/archivePlan')
      },
      {
        path: 'archiveDraft',
        name: 'archiveDraft',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: true,
          importTask: false,
          name: $i.router.archive,
          auth: ['LOGISTICS:DRAFT_ARCHIVE']
        },
        component: () => import('../views/logistic/archiveDraft')
      },
      {
        path: 'archiveLoadingList',
        name: 'archiveLoadingList',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: true,
          importTask: false,
          name: $i.router.archive,
          auth: ['LOADING_LIST:ARCHIVE']
        },
        component: () => import('../views/logistic/archiveLoadingList')
      },
      {
        path: 'placeLogisticPlan',
        name: 'placeLogisticPlan',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: false,
          importTask: false,
          name: $i.router.logisticPlaceLogisticPlan
        },
        component: () => import('../views/logistic/logisticPlanDetail')
      },
      {
        path: 'planDetail',
        name: 'logisticPlanDetail',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: false,
          importTask: true,
          name: $i.router.logisticPlaceDetail,
          auth: ['LOGISTICS:PLAN_DETAIL']
        },
        component: () => import('../views/logistic/logisticPlanDetail')
      },
      {
        path: 'loadingListDetail',
        name: 'loadingListDetail',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: false,
          importTask: true,
          name: $i.router.logisticLoadingList,
          auth: ['LOADING_LIST:DETAIL']
        },
        component: () => import('../views/logistic/logisticPlanDetail')
      },
      {
        path: 'planDraftDetail',
        name: 'logisticDraftDetail',
        hidden: true,
        meta: {
          draft: '/logistic/draft',
          recycleBin: false,
          log: false,
          importTask: false,
          name: $i.router.logisticLoadingDraft
        },
        component: () => import('../views/logistic/logisticPlanDetail')
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/department',
    meta: {
      name: $i.router.settings,
      auth: ['SETTING']
    },
    children: [
      {
        path: 'department',
        name: 'settingsDepartment',
        meta: {
          auth: [0],
          name: $i.router.settingsDepartment
        },
        component: () => import('../views/settings/departmentSetting.vue')
      },
      {
        path: 'category',
        name: 'settingsCategory',
        meta: {
          draft: true,
          recycleBin: true,
          log: true,
          auth: [0],
          name: $i.router.settingsCategory
        },
        component: () => import('../views/settings/CategorySetting')
      },
      {
        path: 'Personal',
        name: 'settingsPersonal',
        meta: {
          draft: true,
          recycleBin: true,
          log: true,
          name: $i.router.settingsPersonal,
          auth: ['SETTING:PERSONAL']
        },
        component: () => import('../views/settings/personalSetting')
      },
      {
        path: 'companyInfo',
        name: 'settingsCompany',
        meta: {
          draft: true,
          recycleBin: true,
          log: true,
          auth: [0],
          name: $i.router.settingsCompany
        },
        component: () => import('../views/settings/companyInfo')
      },
    ]
  },
  {
    path: '/track',
    component: Layout,
    redirect: '/track/index',
    meta: {name: $i.router.track},
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: 'track',
        meta: {
          draft: true,
          recycleBin: true,
          log: true,
        },
        component: () => import('../views/track/trackBySKU.vue'),
      }
    ]
  },
  {
    path: '/logs',
    component: Layout,
    redirect: '/logs/index',
    meta: {name: $i.router.logs},
    noDropdown: true,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'logs',
        meta: {
          draft: true,
          recycleBin: true,
          log: true,
        },
        component: () => import('../views/logs/logs.vue')
      },
      {
        path: 'task',
        name: 'logsTask',
        meta: {},
        component: () => import('../views/logs/task.vue')
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/index',
    meta: {
      name: $i.router.message,
      auth: ['MESSAGE']
    },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'message',
        component: () => import('../views/message/message.vue'),
      },
      {
        name: 'Management',
        path: 'messageManagement',
        meta: {
          name: $i.router.messageManagement
        },
        component: () => import('../views/message/messageManagement.vue'),
      },

    ],
  },
  // todo 供应商路由
  //draft  草稿箱路由
  {
    path: '/draft',
    component: Layout,
    meta: {name: $i.router.draft},
    redirect: '/draft/index',
    noDropdown: true,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'draft',
        meta: {
          draft: false,
          recycleBin: false,
          log: false,
        },
        component: () => import('../views/draft/index.vue')
      }
    ]
  },
  //recycleBin  回收站路由
  {
    path: '/recycle',
    component: Layout,
    meta: {name: $i.router.recycle},
    redirect: '/recycle/index',
    noDropdown: true,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'recycleBin',
        meta: {
          draft: false,
          recycleBin: false,
          log: false,
        },
        component: () => import('../views/recycleBin/index.vue')
      }
    ]
  },
]

let router = new Router({
  mode: 'history',
  routes: routerMap
});

router.beforeResolve((to, from, next) => {
  let ts = localStore.get('token')
    , ri = localStore.get('router_intercept');

  // 登录验证
  if ((to.path !== '/login' || from.path === '/login') && _.isEmpty(ts)) {
    return next({path: '/login'});
  }

  // 数据验证拦截
  if (ri && (to.path !== ri.path || from.path === ri.path)) {
    return next(ri);
  }

  // 权限验证
  if (to.meta && to.meta.auth && !Util.$auth(to.meta.auth)) {

    return Notification.error({
      title: $i.hintMessage.systemHints,
      message: $i.hintMessage.noAuthority
    });
  }

  next();
});

export default router
