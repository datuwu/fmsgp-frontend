import { ProductionPlan } from './productionPlan';
import { PurchaseTask } from './purchaseTask';
import { User } from './user';

export enum PurchasingPlanApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}
export enum PurchasingPlanProgressEnum {
    PENDING = 0,
    PROCESSING = 1,
    FINISHED = 2,
    REJECTED = 3,
    OVERDUE = 4,
}

export interface PurchasingPlan {
    id: number;
    title: string;
    code: string;
    planCode: string;
    startDate: string;
    endDate: string;
    note: string;
    approveStatus: number;
    productionPlanId: number;
    processStatus: number;
    purchasingManagerId: number;
    productionPlan: ProductionPlan;
    purchaseTasks: PurchaseTask[];
    createdDate: string;
    createdBy: User;
    lastModifiedDate: string;
    lastModifiedBy: User;
    isDeleted: boolean;
    supplierApproveStatus: number;
    managerApproveStatus: number;
}
