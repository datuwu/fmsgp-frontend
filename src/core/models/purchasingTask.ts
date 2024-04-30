export enum PurchasingTaskProgressEnum {
    PENDING = 1,
    PROCESSING = 2,
    FINISHED = 3,
}

export enum PurchasingTaskStatusEnum {
    PENDING = 1,
    PROCESSING = 2,
    FINISHED = 3,
    ASSIGNED = 4,
    OVERDUE = 5,
}

export interface PurchasingTask {
    id: number;
    quantity: number;
    assignDate: string;
    finishedDate: string;
    taskProgress: number;
    status: number;
    taskStatus: number;
    finishedQuantity: number;
    remainedQuantity: number;
    processedQuantity: number;
    purchasingPlanId: number;
    rawMaterialId: number;
    purchasingStaffId: number;
    createdDate: string;
    createdBy: number;
    lastModifiedDate: string;
    lastModifiedBy: null;
    isDeleted: number;
}
