import { InspectionRequest } from './inspectionRequest';
import { PurchaseMaterial } from './purchaseMaterial';
import { WarehouseForm } from './warehouseForm';

export enum DeliveryStageStatusEnum {
    PENDING = 0,
    APPROVED = 1,
    DELIVERING = 2,
    DELIVERED = 3,
    TEMPWAREHOUSEIMPORTPENDING = 4,
    TEMPWAREHOUSEIMPORTAPPROVED = 5,
    TEMPWAREHOUSEIMPORTED = 6,
    TEMPWAREHOUSEEXPORTPENDING = 7,
    TEMPWAREHOUSEEXPORTAPPROVED = 8,
    TEMPWAREHOUSEEXPORTED = 9,
    PENDINGFORINSPECTION = 10,
    INSPECTIONREQUESTAPPROVED = 11,
    INSPECTED = 12,
    MAINWAREHOUSEIMPORTPENDING = 13,
    MAINWAREHOUSEIMPORTAPPROVED = 14,
    MAINWAREHOUSEIMPORTED = 15,
    SupInactive = 16,
    DeliveryCanceled = 17,
}

export interface DeliveryStage {
    id: number;
    deliveryDate: string;
    stageOrder: number;
    totalTypeMaterial: number;
    totalPrice: number;
    deliveryStatus: number;
    isSupplemental: boolean;
    purchaseMaterials: PurchaseMaterial[];
    createdDate: string;
    createdBy: string;
    lastModifiedDate: string;
    lastModifiedBy: string;
    isDeleted: boolean;
    purchasingOrderId: number;
    inspectionRequest: InspectionRequest;
    exportTempWarehouseForm: WarehouseForm | null;
    importMainWarehouseForm: WarehouseForm | null;
}
