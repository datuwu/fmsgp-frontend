import { User } from './user';

export interface PurchaseTask {
    id: number;
    quantity: number;
    assignDate: string;
    finishedDate: string;
    taskProgress: number;
    purchasingPlanId: number;
    rawMaterialId: number;
    remainedQuantity: number;
    purchasingStaffId: number;
    processedQuantity: number;
    createdDate: string;
    createdBy: User;
    lastModifiedDate: string;
    lastModifiedBy: User;
    taskStatus: number;
    packageQuantity: number;
    finishedQuantity: number;
    isDeleted: boolean;
    taskStartDate: string;
    taskEndDate: string;
}
