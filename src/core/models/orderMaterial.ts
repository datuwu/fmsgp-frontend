export interface OrderMaterial {
    id: number;
    rawMaterialId: number;
    materialName: string;
    quantity: number;
    unitPrice: number;
    materialTotalPrice: number;
    materialPerPackage: number;
    supplierMaterialCode: string;
}
