import { DeliveryStage } from './deliveryStage';
import { InspectionForm } from './inspectionForm';

export interface InspectionRequest {
    id: number;
    title: string;
    content: string;
    poCode: string;
    stageCode: string;
    stageOrder: number;
    requestDate: string;
    approveStatus: number;
    approvedDate: string;
    deliveryStageId: number;
    requestStaffId: number;
    approvingInspectorId: number;
    requestInspectDate: string;
    deliveryStage: DeliveryStage;
    inspectionForm: InspectionForm;
}

export enum InspectionRequestApproveStatus {
    PENDING = 0,
    INSPECTED = 1,
    REJECTED = 2,
}
