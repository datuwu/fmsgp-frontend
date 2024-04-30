import { RawMaterial } from './rawMaterial';

export interface WarehouseMaterial {
    id: number;
    quantity: number;
    totalPrice: number;
    rawMaterialId: number;
    warehouseId: number;
    rawMaterial: RawMaterial;
}
