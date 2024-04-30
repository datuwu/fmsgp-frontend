export enum WarehouseFormTypeEnums {
    IMPORT = 0,
    EXPORT = 1,
}

export enum WarehouseFormStatusEnum {
    PROCESSING = 0,
    EXECUTED = 1,
}

export enum WareHouseReceiveTypeEnums {
    TEMP_WAREHOUSE = 0,
    MAIN_WAREHOUSE = 1,
}

export interface WarehouseFormMaterial {
    formStatus: WarehouseFormStatusEnum;
    id: number;
    materialName: string;
    materialCode: string;
    requestQuantity: number;
    receiveQuantity: number;
    unitPrice: number;
    purchaseMaterialId: number;
}

export interface WarehouseForm {
    id: number;
    formCode: string;
    formType: number;
    poCode: string;
    receiveCompanyName: string;
    companyAddress: string;
    receiveWarehouse: number;
    totalPrice: number;
    requestStaffName: string;
    supplierName: string;
    approveWarehouseStaffName: string;
    tempWarehouseRequestId: number | null;
    importMainWarehouseRequestId: number | null;
    warehouseFormMaterials: WarehouseFormMaterial[];
}
