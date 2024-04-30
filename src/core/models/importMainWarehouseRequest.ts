import { DeliveryStage } from './deliveryStage';
import { WarehouseFormMaterial } from './tempWarehouseRequest';

export enum ImportMainWarehouseRequestApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}

export interface ImportMainWarehouseRequest {
    id: number;
    requestDate: string;
    approveStatus: number;
    requestTitle: string;
    requestReasonContent: string;
    requestExecutionDate: string;
    actualExecutionDate: string;
    status: number;
    deliveryStageId: number;
    requestStaffId: number;
    deliveryStage: DeliveryStage;
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
