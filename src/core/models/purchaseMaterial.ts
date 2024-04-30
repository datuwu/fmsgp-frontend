export interface PurchaseMaterial {
    id: number;
    materialName: string;
    rawMaterialId: number;
    supplierMaterialCode: string;
    companyMaterialCode: string;
    unit: number;
    unitPrice: number;
    totalQuantity: number;
    totalPrice: number;
    tempImportDate: string;
    tempExportDate: string;
    mainImportDate: string;
    mainExportDate: string;
    planInspectDate: string;
    warehouseStatus: number;
    afterInspectQuantity: number;
    afterInspectPrice: number;
    package: number;
}
