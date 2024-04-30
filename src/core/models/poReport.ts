export enum POReportResolveStatus {
    PENDING = 0,
    PROCESSING = 1,
    RESOLVED = 2,
}

export enum POReportResolveSupplierStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}

export interface POReport {
    id: number;
    resolveStatus: number;
    reportTitle: string;
    reportContent: string;
    reportAnswer: string;
    supplierId: number;
    purchasingOrderId: number;
    purchasingStaffId: number;
    createdDate: string;
    createdBy: null;
    lastModifiedDate: string;
    lastModifiedBy: string;
    isDeleted: boolean;
    supplierApprovingStatus: number;
}
