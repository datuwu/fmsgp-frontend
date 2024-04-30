import { DeliveryStage } from './deliveryStage';

export enum PurchasingOrderSupplierApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}

export enum PurchasingOrderStatus {
    PENDING = 0,
    PROCESSING = 1,
    FINISHED = 2,
}

export enum PurchasingOrderManagerApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}

export interface PurchasingOrder {
    id: number;
    name: string;
    poCode: string;
    isSupplierApproved: number;
    isManagerApproved: number;
    supplierName: string;
    supplierCompanyName: string;
    supplierTaxCode: string;
    supplierAddress: string;
    suppplierEmail: string;
    supplierId: number;
    supplierPhone: string;
    managerApproveStatus: number;
    supplierApproveStatus: number;
    receiverCompanyPhone: string;
    receiverCompanyEmail: string;
    receiverCompanyAddress: string;
    note: string;
    numOfDeliveryStage: number;
    totalMaterialType: number;
    totalPrice: number;
    orderStatus: number;
    purchasingPlanId: number;
    orderMaterials: [];
    deliveryStages: DeliveryStage[];
    createdDate: string;
    createdBy: number;
    lastModifiedDate: string;
    lastModifiedBy: string;
    isDeleted: boolean;
    purchasingStaffId: number;
}
