import { WarehouseType } from '../models/warehouse';
import { WarehouseMaterial } from '../models/warehouseMaterial';
import http from './http';
import { warehouseApi } from './warehouse.api';

export interface ICreateWarehouseMaterialDto extends Pick<WarehouseMaterial, 'quantity' | 'rawMaterialId' | 'warehouseId'> {}
export interface IUpdateWarehouseMaterialDto extends Pick<WarehouseMaterial, 'id' | 'quantity'> {}

const baseUrl = '/WarehouseMaterial';

export const warehouseMaterialApi = {
    getAll: async () => {
        const { data } = await http.get<WarehouseMaterial[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<WarehouseMaterial>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateWarehouseMaterialDto) => {
        const { data } = await http.post<WarehouseMaterial>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateWarehouseMaterialDto) => {
        const { data } = await http.put<WarehouseMaterial>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    getAllMainWarehouse: async () => {
        const allWarehouseMaterial = await warehouseApi.getAll();
        const warehouse = allWarehouseMaterial.find((x) => x.warehouseType === WarehouseType.MainWarehouse);
        const { data } = await http.get<WarehouseMaterial[]>(`${baseUrl}`);

        return data.filter((x) => x.warehouseId === warehouse?.id);
    },
    getAllTempWarehouse: async () => {
        const allWarehouseMaterial = await warehouseApi.getAll();
        const warehouse = allWarehouseMaterial.find((x) => x.warehouseType === WarehouseType.TempWarehouse);
        const { data } = await http.get<WarehouseMaterial[]>(`${baseUrl}`);

        return data.filter((x) => x.warehouseId === warehouse?.id);
    },
    getAllWarehouseMaterialByWarehouseId: async (warehouseId: number) => {
        const { data } = await http.get<WarehouseMaterial[]>(`${baseUrl}/warehouse/${warehouseId}`);

        return data;
    },
};
