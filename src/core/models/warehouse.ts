import { WarehouseMaterial } from './warehouseMaterial';

export interface Warehouse {
    id: number;
    location: string;
    warehouseType: WarehouseType;
    warehouseMaterials: WarehouseMaterial[];
}

export enum WarehouseRequestType {
    Import = 1,
    Export = 2,
}

export enum WarehouseType {
    TempWarehouse = 0,
    MainWarehouse = 1,
}

export enum WarehouseStatus {
    TempWarehouse = 1,
    MainWarehouse = 2,
}
