/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AdminLayoutImport } from './routes/_admin-layout'
import { Route as IndexImport } from './routes/index'
import { Route as AdminLayoutDashboardIndexImport } from './routes/_admin-layout.dashboard/index'
import { Route as AdminLayoutDashboardAnalyticsImport } from './routes/_admin-layout.dashboard/analytics'
import { Route as AdminLayoutDashboardIdImport } from './routes/_admin-layout.dashboard/$id'
import { Route as AdminLayoutDashboardWarehouseIndexImport } from './routes/_admin-layout.dashboard/warehouse/index'
import { Route as AdminLayoutDashboardWarehouseMaterialIndexImport } from './routes/_admin-layout.dashboard/warehouse-material/index'
import { Route as AdminLayoutDashboardUserIndexImport } from './routes/_admin-layout.dashboard/user/index'
import { Route as AdminLayoutDashboardTempWarehouseIndexImport } from './routes/_admin-layout.dashboard/temp-warehouse/index'
import { Route as AdminLayoutDashboardTempWarehouseRequestIndexImport } from './routes/_admin-layout.dashboard/temp-warehouse-request/index'
import { Route as AdminLayoutDashboardSupplierIndexImport } from './routes/_admin-layout.dashboard/supplier/index'
import { Route as AdminLayoutDashboardSupplierAccountRequestIndexImport } from './routes/_admin-layout.dashboard/supplier-account-request/index'
import { Route as AdminLayoutDashboardRoleIndexImport } from './routes/_admin-layout.dashboard/role/index'
import { Route as AdminLayoutDashboardRawMaterialIndexImport } from './routes/_admin-layout.dashboard/raw-material/index'
import { Route as AdminLayoutDashboardPurchasingTaskIndexImport } from './routes/_admin-layout.dashboard/purchasing-task/index'
import { Route as AdminLayoutDashboardPurchasingPlanIndexImport } from './routes/_admin-layout.dashboard/purchasing-plan/index'
import { Route as AdminLayoutDashboardPurchasingOrderIndexImport } from './routes/_admin-layout.dashboard/purchasing-order/index'
import { Route as AdminLayoutDashboardProductionPlanIndexImport } from './routes/_admin-layout.dashboard/production-plan/index'
import { Route as AdminLayoutDashboardProductIndexImport } from './routes/_admin-layout.dashboard/product/index'
import { Route as AdminLayoutDashboardProductCategoryIndexImport } from './routes/_admin-layout.dashboard/product-category/index'
import { Route as AdminLayoutDashboardPoReportIndexImport } from './routes/_admin-layout.dashboard/po-report/index'
import { Route as AdminLayoutDashboardMaterialCategoryIndexImport } from './routes/_admin-layout.dashboard/material-category/index'
import { Route as AdminLayoutDashboardInspectionRequestIndexImport } from './routes/_admin-layout.dashboard/inspection-request/index'
import { Route as AdminLayoutDashboardInspectedDeliveryStageIndexImport } from './routes/_admin-layout.dashboard/inspected-delivery-stage/index'
import { Route as AdminLayoutDashboardImportMainWarehouseRequestIndexImport } from './routes/_admin-layout.dashboard/import-main-warehouse-request/index'
import { Route as AdminLayoutDashboardTempWarehouseRequestCreateImport } from './routes/_admin-layout.dashboard/temp-warehouse-request/create'
import { Route as AdminLayoutDashboardSupplierCreateImport } from './routes/_admin-layout.dashboard/supplier/create'
import { Route as AdminLayoutDashboardSupplierAccountRequestCreateImport } from './routes/_admin-layout.dashboard/supplier-account-request/create'
import { Route as AdminLayoutDashboardRawMaterialCreateImport } from './routes/_admin-layout.dashboard/raw-material/create'
import { Route as AdminLayoutDashboardPurchasingPlanCreateImport } from './routes/_admin-layout.dashboard/purchasing-plan/create'
import { Route as AdminLayoutDashboardPurchasingOrderCreateImport } from './routes/_admin-layout.dashboard/purchasing-order/create'
import { Route as AdminLayoutDashboardInspectionRequestCreateImport } from './routes/_admin-layout.dashboard/inspection-request/create'
import { Route as AdminLayoutDashboardImportMainWarehouseRequestCreateImport } from './routes/_admin-layout.dashboard/import-main-warehouse-request/create'
import { Route as AdminLayoutDashboardWarehouseIdIndexImport } from './routes/_admin-layout.dashboard/warehouse/$id/index'
import { Route as AdminLayoutDashboardTempWarehouseRequestIdIndexImport } from './routes/_admin-layout.dashboard/temp-warehouse-request/$id/index'
import { Route as AdminLayoutDashboardSupplierIdIndexImport } from './routes/_admin-layout.dashboard/supplier/$id/index'
import { Route as AdminLayoutDashboardSupplierAccountRequestIdIndexImport } from './routes/_admin-layout.dashboard/supplier-account-request/$id/index'
import { Route as AdminLayoutDashboardRawMaterialIdIndexImport } from './routes/_admin-layout.dashboard/raw-material/$id/index'
import { Route as AdminLayoutDashboardPurchasingTaskIdIndexImport } from './routes/_admin-layout.dashboard/purchasing-task/$id/index'
import { Route as AdminLayoutDashboardPurchasingPlanIdIndexImport } from './routes/_admin-layout.dashboard/purchasing-plan/$id/index'
import { Route as AdminLayoutDashboardPurchasingOrderIdIndexImport } from './routes/_admin-layout.dashboard/purchasing-order/$id/index'
import { Route as AdminLayoutDashboardProductionPlanIdIndexImport } from './routes/_admin-layout.dashboard/production-plan/$id/index'
import { Route as AdminLayoutDashboardProductIdIndexImport } from './routes/_admin-layout.dashboard/product/$id/index'
import { Route as AdminLayoutDashboardPoReportIdIndexImport } from './routes/_admin-layout.dashboard/po-report/$id/index'
import { Route as AdminLayoutDashboardInspectionRequestIdIndexImport } from './routes/_admin-layout.dashboard/inspection-request/$id/index'
import { Route as AdminLayoutDashboardInspectedDeliveryStageIdIndexImport } from './routes/_admin-layout.dashboard/inspected-delivery-stage/$id/index'
import { Route as AdminLayoutDashboardImportMainWarehouseRequestIdIndexImport } from './routes/_admin-layout.dashboard/import-main-warehouse-request/$id/index'
import { Route as AdminLayoutDashboardSupplierIdEditImport } from './routes/_admin-layout.dashboard/supplier/$id/edit'
import { Route as AdminLayoutDashboardSupplierAccountRequestIdEditImport } from './routes/_admin-layout.dashboard/supplier-account-request/$id/edit'
import { Route as AdminLayoutDashboardRawMaterialIdEditImport } from './routes/_admin-layout.dashboard/raw-material/$id/edit'
import { Route as AdminLayoutDashboardPurchasingPlanIdEditImport } from './routes/_admin-layout.dashboard/purchasing-plan/$id/edit'
import { Route as AdminLayoutDashboardPurchasingOrderIdEditImport } from './routes/_admin-layout.dashboard/purchasing-order/$id/edit'
import { Route as AdminLayoutDashboardProductionPlanIdEditImport } from './routes/_admin-layout.dashboard/production-plan/$id/edit'

// Create/Update Routes

const AdminLayoutRoute = AdminLayoutImport.update({
  id: '/_admin-layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AdminLayoutDashboardIndexRoute = AdminLayoutDashboardIndexImport.update({
  path: '/dashboard/',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutDashboardAnalyticsRoute =
  AdminLayoutDashboardAnalyticsImport.update({
    path: '/dashboard/analytics',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardIdRoute = AdminLayoutDashboardIdImport.update({
  path: '/dashboard/$id',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutDashboardWarehouseIndexRoute =
  AdminLayoutDashboardWarehouseIndexImport.update({
    path: '/dashboard/warehouse/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardWarehouseMaterialIndexRoute =
  AdminLayoutDashboardWarehouseMaterialIndexImport.update({
    path: '/dashboard/warehouse-material/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardUserIndexRoute =
  AdminLayoutDashboardUserIndexImport.update({
    path: '/dashboard/user/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardTempWarehouseIndexRoute =
  AdminLayoutDashboardTempWarehouseIndexImport.update({
    path: '/dashboard/temp-warehouse/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardTempWarehouseRequestIndexRoute =
  AdminLayoutDashboardTempWarehouseRequestIndexImport.update({
    path: '/dashboard/temp-warehouse-request/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierIndexRoute =
  AdminLayoutDashboardSupplierIndexImport.update({
    path: '/dashboard/supplier/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierAccountRequestIndexRoute =
  AdminLayoutDashboardSupplierAccountRequestIndexImport.update({
    path: '/dashboard/supplier-account-request/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardRoleIndexRoute =
  AdminLayoutDashboardRoleIndexImport.update({
    path: '/dashboard/role/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardRawMaterialIndexRoute =
  AdminLayoutDashboardRawMaterialIndexImport.update({
    path: '/dashboard/raw-material/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingTaskIndexRoute =
  AdminLayoutDashboardPurchasingTaskIndexImport.update({
    path: '/dashboard/purchasing-task/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingPlanIndexRoute =
  AdminLayoutDashboardPurchasingPlanIndexImport.update({
    path: '/dashboard/purchasing-plan/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingOrderIndexRoute =
  AdminLayoutDashboardPurchasingOrderIndexImport.update({
    path: '/dashboard/purchasing-order/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardProductionPlanIndexRoute =
  AdminLayoutDashboardProductionPlanIndexImport.update({
    path: '/dashboard/production-plan/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardProductIndexRoute =
  AdminLayoutDashboardProductIndexImport.update({
    path: '/dashboard/product/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardProductCategoryIndexRoute =
  AdminLayoutDashboardProductCategoryIndexImport.update({
    path: '/dashboard/product-category/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPoReportIndexRoute =
  AdminLayoutDashboardPoReportIndexImport.update({
    path: '/dashboard/po-report/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardMaterialCategoryIndexRoute =
  AdminLayoutDashboardMaterialCategoryIndexImport.update({
    path: '/dashboard/material-category/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardInspectionRequestIndexRoute =
  AdminLayoutDashboardInspectionRequestIndexImport.update({
    path: '/dashboard/inspection-request/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardInspectedDeliveryStageIndexRoute =
  AdminLayoutDashboardInspectedDeliveryStageIndexImport.update({
    path: '/dashboard/inspected-delivery-stage/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardImportMainWarehouseRequestIndexRoute =
  AdminLayoutDashboardImportMainWarehouseRequestIndexImport.update({
    path: '/dashboard/import-main-warehouse-request/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardTempWarehouseRequestCreateRoute =
  AdminLayoutDashboardTempWarehouseRequestCreateImport.update({
    path: '/dashboard/temp-warehouse-request/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierCreateRoute =
  AdminLayoutDashboardSupplierCreateImport.update({
    path: '/dashboard/supplier/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierAccountRequestCreateRoute =
  AdminLayoutDashboardSupplierAccountRequestCreateImport.update({
    path: '/dashboard/supplier-account-request/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardRawMaterialCreateRoute =
  AdminLayoutDashboardRawMaterialCreateImport.update({
    path: '/dashboard/raw-material/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingPlanCreateRoute =
  AdminLayoutDashboardPurchasingPlanCreateImport.update({
    path: '/dashboard/purchasing-plan/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingOrderCreateRoute =
  AdminLayoutDashboardPurchasingOrderCreateImport.update({
    path: '/dashboard/purchasing-order/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardInspectionRequestCreateRoute =
  AdminLayoutDashboardInspectionRequestCreateImport.update({
    path: '/dashboard/inspection-request/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardImportMainWarehouseRequestCreateRoute =
  AdminLayoutDashboardImportMainWarehouseRequestCreateImport.update({
    path: '/dashboard/import-main-warehouse-request/create',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardWarehouseIdIndexRoute =
  AdminLayoutDashboardWarehouseIdIndexImport.update({
    path: '/dashboard/warehouse/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardTempWarehouseRequestIdIndexRoute =
  AdminLayoutDashboardTempWarehouseRequestIdIndexImport.update({
    path: '/dashboard/temp-warehouse-request/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierIdIndexRoute =
  AdminLayoutDashboardSupplierIdIndexImport.update({
    path: '/dashboard/supplier/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierAccountRequestIdIndexRoute =
  AdminLayoutDashboardSupplierAccountRequestIdIndexImport.update({
    path: '/dashboard/supplier-account-request/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardRawMaterialIdIndexRoute =
  AdminLayoutDashboardRawMaterialIdIndexImport.update({
    path: '/dashboard/raw-material/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingTaskIdIndexRoute =
  AdminLayoutDashboardPurchasingTaskIdIndexImport.update({
    path: '/dashboard/purchasing-task/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingPlanIdIndexRoute =
  AdminLayoutDashboardPurchasingPlanIdIndexImport.update({
    path: '/dashboard/purchasing-plan/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingOrderIdIndexRoute =
  AdminLayoutDashboardPurchasingOrderIdIndexImport.update({
    path: '/dashboard/purchasing-order/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardProductionPlanIdIndexRoute =
  AdminLayoutDashboardProductionPlanIdIndexImport.update({
    path: '/dashboard/production-plan/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardProductIdIndexRoute =
  AdminLayoutDashboardProductIdIndexImport.update({
    path: '/dashboard/product/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPoReportIdIndexRoute =
  AdminLayoutDashboardPoReportIdIndexImport.update({
    path: '/dashboard/po-report/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardInspectionRequestIdIndexRoute =
  AdminLayoutDashboardInspectionRequestIdIndexImport.update({
    path: '/dashboard/inspection-request/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardInspectedDeliveryStageIdIndexRoute =
  AdminLayoutDashboardInspectedDeliveryStageIdIndexImport.update({
    path: '/dashboard/inspected-delivery-stage/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardImportMainWarehouseRequestIdIndexRoute =
  AdminLayoutDashboardImportMainWarehouseRequestIdIndexImport.update({
    path: '/dashboard/import-main-warehouse-request/$id/',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierIdEditRoute =
  AdminLayoutDashboardSupplierIdEditImport.update({
    path: '/dashboard/supplier/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardSupplierAccountRequestIdEditRoute =
  AdminLayoutDashboardSupplierAccountRequestIdEditImport.update({
    path: '/dashboard/supplier-account-request/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardRawMaterialIdEditRoute =
  AdminLayoutDashboardRawMaterialIdEditImport.update({
    path: '/dashboard/raw-material/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingPlanIdEditRoute =
  AdminLayoutDashboardPurchasingPlanIdEditImport.update({
    path: '/dashboard/purchasing-plan/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardPurchasingOrderIdEditRoute =
  AdminLayoutDashboardPurchasingOrderIdEditImport.update({
    path: '/dashboard/purchasing-order/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

const AdminLayoutDashboardProductionPlanIdEditRoute =
  AdminLayoutDashboardProductionPlanIdEditImport.update({
    path: '/dashboard/production-plan/$id/edit',
    getParentRoute: () => AdminLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_admin-layout': {
      preLoaderRoute: typeof AdminLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_admin-layout/dashboard/$id': {
      preLoaderRoute: typeof AdminLayoutDashboardIdImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/analytics': {
      preLoaderRoute: typeof AdminLayoutDashboardAnalyticsImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/': {
      preLoaderRoute: typeof AdminLayoutDashboardIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/import-main-warehouse-request/create': {
      preLoaderRoute: typeof AdminLayoutDashboardImportMainWarehouseRequestCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/inspection-request/create': {
      preLoaderRoute: typeof AdminLayoutDashboardInspectionRequestCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-order/create': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingOrderCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-plan/create': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingPlanCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/raw-material/create': {
      preLoaderRoute: typeof AdminLayoutDashboardRawMaterialCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier-account-request/create': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierAccountRequestCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier/create': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/temp-warehouse-request/create': {
      preLoaderRoute: typeof AdminLayoutDashboardTempWarehouseRequestCreateImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/import-main-warehouse-request/': {
      preLoaderRoute: typeof AdminLayoutDashboardImportMainWarehouseRequestIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/inspected-delivery-stage/': {
      preLoaderRoute: typeof AdminLayoutDashboardInspectedDeliveryStageIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/inspection-request/': {
      preLoaderRoute: typeof AdminLayoutDashboardInspectionRequestIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/material-category/': {
      preLoaderRoute: typeof AdminLayoutDashboardMaterialCategoryIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/po-report/': {
      preLoaderRoute: typeof AdminLayoutDashboardPoReportIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/product-category/': {
      preLoaderRoute: typeof AdminLayoutDashboardProductCategoryIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/product/': {
      preLoaderRoute: typeof AdminLayoutDashboardProductIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/production-plan/': {
      preLoaderRoute: typeof AdminLayoutDashboardProductionPlanIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-order/': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingOrderIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-plan/': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingPlanIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-task/': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingTaskIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/raw-material/': {
      preLoaderRoute: typeof AdminLayoutDashboardRawMaterialIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/role/': {
      preLoaderRoute: typeof AdminLayoutDashboardRoleIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier-account-request/': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierAccountRequestIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier/': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/temp-warehouse-request/': {
      preLoaderRoute: typeof AdminLayoutDashboardTempWarehouseRequestIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/temp-warehouse/': {
      preLoaderRoute: typeof AdminLayoutDashboardTempWarehouseIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/user/': {
      preLoaderRoute: typeof AdminLayoutDashboardUserIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/warehouse-material/': {
      preLoaderRoute: typeof AdminLayoutDashboardWarehouseMaterialIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/warehouse/': {
      preLoaderRoute: typeof AdminLayoutDashboardWarehouseIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/production-plan/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardProductionPlanIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-order/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingOrderIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-plan/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingPlanIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/raw-material/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardRawMaterialIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier-account-request/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierAccountRequestIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier/$id/edit': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierIdEditImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/import-main-warehouse-request/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardImportMainWarehouseRequestIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/inspected-delivery-stage/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardInspectedDeliveryStageIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/inspection-request/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardInspectionRequestIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/po-report/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardPoReportIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/product/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardProductIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/production-plan/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardProductionPlanIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-order/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingOrderIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-plan/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingPlanIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/purchasing-task/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardPurchasingTaskIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/raw-material/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardRawMaterialIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier-account-request/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierAccountRequestIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/supplier/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardSupplierIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/temp-warehouse-request/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardTempWarehouseRequestIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
    '/_admin-layout/dashboard/warehouse/$id/': {
      preLoaderRoute: typeof AdminLayoutDashboardWarehouseIdIndexImport
      parentRoute: typeof AdminLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AdminLayoutRoute.addChildren([
    AdminLayoutDashboardIdRoute,
    AdminLayoutDashboardAnalyticsRoute,
    AdminLayoutDashboardIndexRoute,
    AdminLayoutDashboardImportMainWarehouseRequestCreateRoute,
    AdminLayoutDashboardInspectionRequestCreateRoute,
    AdminLayoutDashboardPurchasingOrderCreateRoute,
    AdminLayoutDashboardPurchasingPlanCreateRoute,
    AdminLayoutDashboardRawMaterialCreateRoute,
    AdminLayoutDashboardSupplierAccountRequestCreateRoute,
    AdminLayoutDashboardSupplierCreateRoute,
    AdminLayoutDashboardTempWarehouseRequestCreateRoute,
    AdminLayoutDashboardImportMainWarehouseRequestIndexRoute,
    AdminLayoutDashboardInspectedDeliveryStageIndexRoute,
    AdminLayoutDashboardInspectionRequestIndexRoute,
    AdminLayoutDashboardMaterialCategoryIndexRoute,
    AdminLayoutDashboardPoReportIndexRoute,
    AdminLayoutDashboardProductCategoryIndexRoute,
    AdminLayoutDashboardProductIndexRoute,
    AdminLayoutDashboardProductionPlanIndexRoute,
    AdminLayoutDashboardPurchasingOrderIndexRoute,
    AdminLayoutDashboardPurchasingPlanIndexRoute,
    AdminLayoutDashboardPurchasingTaskIndexRoute,
    AdminLayoutDashboardRawMaterialIndexRoute,
    AdminLayoutDashboardRoleIndexRoute,
    AdminLayoutDashboardSupplierAccountRequestIndexRoute,
    AdminLayoutDashboardSupplierIndexRoute,
    AdminLayoutDashboardTempWarehouseRequestIndexRoute,
    AdminLayoutDashboardTempWarehouseIndexRoute,
    AdminLayoutDashboardUserIndexRoute,
    AdminLayoutDashboardWarehouseMaterialIndexRoute,
    AdminLayoutDashboardWarehouseIndexRoute,
    AdminLayoutDashboardProductionPlanIdEditRoute,
    AdminLayoutDashboardPurchasingOrderIdEditRoute,
    AdminLayoutDashboardPurchasingPlanIdEditRoute,
    AdminLayoutDashboardRawMaterialIdEditRoute,
    AdminLayoutDashboardSupplierAccountRequestIdEditRoute,
    AdminLayoutDashboardSupplierIdEditRoute,
    AdminLayoutDashboardImportMainWarehouseRequestIdIndexRoute,
    AdminLayoutDashboardInspectedDeliveryStageIdIndexRoute,
    AdminLayoutDashboardInspectionRequestIdIndexRoute,
    AdminLayoutDashboardPoReportIdIndexRoute,
    AdminLayoutDashboardProductIdIndexRoute,
    AdminLayoutDashboardProductionPlanIdIndexRoute,
    AdminLayoutDashboardPurchasingOrderIdIndexRoute,
    AdminLayoutDashboardPurchasingPlanIdIndexRoute,
    AdminLayoutDashboardPurchasingTaskIdIndexRoute,
    AdminLayoutDashboardRawMaterialIdIndexRoute,
    AdminLayoutDashboardSupplierAccountRequestIdIndexRoute,
    AdminLayoutDashboardSupplierIdIndexRoute,
    AdminLayoutDashboardTempWarehouseRequestIdIndexRoute,
    AdminLayoutDashboardWarehouseIdIndexRoute,
  ]),
])

/* prettier-ignore-end */
