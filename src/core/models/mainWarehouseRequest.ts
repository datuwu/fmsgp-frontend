import { DeliveryStage } from './deliveryStage';

export enum TempWarehouseRequestType {
    IMPORT = 0,
    EXPORT = 1,
}

export enum TempWarehouseRequestApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}

export interface WarehouseFormMaterial {
    id: number;
    materialName: string;
    materialCode: string;
    formStatus: number;
    requestQuantity: number;
    receiveQuantity: number;
    unitPrice: number;
    purchaseMaterialId: number;
}

export interface TempWarehouseRequest {
    id: number;
    requestDate: string;
    poCode: string;
    approveStatus: number;
    rejectReason: string;
    updateDate: string;
    requestTitle: string;
    requestReasonContent: string;
    requestType: number;
    requestExecutionDate: string;
    approveExecutionDate: string;
    deliveryStageId: number;
    requestStaffId: number;
    approveWStaffId: number;
    warehouseFormId: number;

    warehouseForm: {
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
        tempWarehouseRequestId: number;
        importMainWarehouseRequestId: string;
        warehouseFormMaterials: WarehouseFormMaterial[];
    };
}
