import { ExpectedMaterial } from './expectedMaterial';
import { ProductInPlan } from './productInPlan';

export interface ProductionPlan {
    id: number;
    name: string;
    planStartDate: string;
    planEndDate: string;
    note: string;
    fileUrl: string;
    managerId: number;
    createdDate: string;
    createdBy: number;
    lastModifiedDate: string;
    lastModifiedBy: number;
    isDeleted: boolean;
    expectedMaterials: ExpectedMaterial[];
    productInPlans: ProductInPlan[];
}
