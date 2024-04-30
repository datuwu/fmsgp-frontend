export const NKRouter = {
    dashboard: () => '/dashboard',
    menu: {
        list: () => '/dashboard/menu',
    },
    auth: {
        forgotPassword: () => '/auth/forgot-password',
    },
    inspectedDeliveryStage: {
        list: () => '/dashboard/inspected-delivery-stage',
        create: () => '/dashboard/inspected-delivery-stage/create',
        edit: (id: number) => `/dashboard/inspected-delivery-stage/${id}/edit`,
        detail: (id: number) => `/dashboard/inspected-delivery-stage/${id}`,
    },
    user: {
        list: () => '/dashboard/user',
        create: () => '/dashboard/user/create',
        edit: (id: number) => `/dashboard/user/${id}/edit`,
        detail: (id: number) => `/dashboard/user/${id}`,
    },
    materialCategory: {
        list: () => '/dashboard/material-category',
        create: () => '/dashboard/material-category/create',
        edit: (id: number) => `/dashboard/material-category/${id}/edit`,
        detail: (id: number) => `/dashboard/material-category/${id}`,
    },
    product: {
        list: () => '/dashboard/product',
        create: () => '/dashboard/product/create',
        edit: (id: number) => `/dashboard/product/${id}/edit`,
        detail: (id: number) => `/dashboard/product/${id}`,
    },
    productCategory: {
        list: () => '/dashboard/product-category',
        create: () => '/dashboard/product-category/create',
        edit: (id: number) => `/dashboard/product-category/${id}/edit`,
        detail: (id: number) => `/dashboard/product-category/${id}`,
    },

    rawMaterial: {
        list: () => '/dashboard/raw-material',
        create: () => '/dashboard/raw-material/create',
        edit: (id: number) => `/dashboard/raw-material/${id}/edit`,
        detail: (id: number) => `/dashboard/raw-material/${id}`,
    },
    warehouseMaterial: {
        list: () => '/dashboard/warehouse-material',
        create: () => '/dashboard/warehouse-material/create',
        edit: (id: number) => `/dashboard/warehouse-material/${id}/edit`,
        detail: (id: number) => `/dashboard/warehouse-material/${id}`,
    },
    tempWarehouse: {
        list: () => '/dashboard/temp-warehouse',
        create: () => '/dashboard/temp-warehouse/create',
        edit: (id: number) => `/dashboard/temp-warehouse/${id}/edit`,
        detail: (id: number) => `/dashboard/temp-warehouse/${id}`,
    },
    role: {
        list: () => '/dashboard/role',
    },
    supplier: {
        list: () => '/dashboard/supplier',
        create: () => '/dashboard/supplier/create',
        edit: (id: number) => `/dashboard/supplier/${id}/edit`,
        detail: (id: number) => `/dashboard/supplier/${id}`,
    },
    supplierAccountRequest: {
        list: () => '/dashboard/supplier-account-request',
        create: () => '/dashboard/supplier-account-request/create',
        edit: (id: number) => `/dashboard/supplier-account-request/${id}/edit`,
        detail: (id: number) => `/dashboard/supplier-account-request/${id}`,
    },
    warehouse: {
        list: () => '/dashboard/warehouse',
        create: () => '/dashboard/warehouse/create',
        edit: (id: number) => `/dashboard/warehouse/${id}/edit`,
        detail: (id: number) => `/dashboard/warehouse/${id}`,
    },
    productionPlan: {
        list: () => '/dashboard/production-plan',
        create: () => '/dashboard/production-plan/create',
        edit: (id: number) => `/dashboard/production-plan/${id}/edit`,
        detail: (id: number) => `/dashboard/production-plan/${id}`,
    },
    purchasingPlan: {
        list: () => '/dashboard/purchasing-plan',
        create: () => '/dashboard/purchasing-plan/create',
        edit: (id: number) => `/dashboard/purchasing-plan/${id}/edit`,
        detail: (id: number) => `/dashboard/purchasing-plan/${id}`,
    },
    purchasingOrder: {
        list: () => '/dashboard/purchasing-order',
        create: () => '/dashboard/purchasing-order/create',
        edit: (id: number) => `/dashboard/purchasing-order/${id}/edit`,
        detail: (id: number) => `/dashboard/purchasing-order/${id}`,
    },
    tempWarehouseRequest: {
        list: () => '/dashboard/temp-warehouse-request',
        create: () => '/dashboard/temp-warehouse-request/create',
        edit: (id: number) => `/dashboard/temp-warehouse-request/${id}/edit`,
        detail: (id: number) => `/dashboard/temp-warehouse-request/${id}`,
    },
    purchasingTask: {
        list: () => '/dashboard/purchasing-task',
        create: () => '/dashboard/purchasing-task/create',
        edit: (id: number) => `/dashboard/purchasing-task/${id}/edit`,
        detail: (id: number) => `/dashboard/purchasing-task/${id}`,
    },
    inspectionRequest: {
        list: () => '/dashboard/inspection-request',
        create: () => '/dashboard/inspection-request/create',
        edit: (id: number) => `/dashboard/inspection-request/${id}/edit`,
        detail: (id: number) => `/dashboard/inspection-request/${id}`,
    },

    importMainWarehouseRequest: {
        list: () => '/dashboard/import-main-warehouse-request',
        create: () => '/dashboard/import-main-warehouse-request/create',
        edit: (id: number) => `/dashboard/import-main-warehouse-request/${id}/edit`,
        detail: (id: number) => `/dashboard/import-main-warehouse-request/${id}`,
    },
    poReport: {
        list: () => '/dashboard/po-report',
        create: () => '/dashboard/po-report/create',
        edit: (id: number) => `/dashboard/po-report/${id}/edit`,
        detail: (id: number) => `/dashboard/po-report/${id}`,
    },
};
