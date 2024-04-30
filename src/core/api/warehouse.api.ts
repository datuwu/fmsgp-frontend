import { EnumListItem } from '../models/common';
import { Warehouse, WarehouseType } from '../models/warehouse';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateWarehouseDto extends Pick<Warehouse, 'location' | 'warehouseType'> {}
export interface IUpdateWarehouseDto extends Pick<Warehouse, 'location' | 'warehouseType' | 'id'> {}

const baseUrl = '/Warehouse';

export const warehouseApi = {
    getAll: async () => {
        const { data } = await http.get<Warehouse[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<Warehouse>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateWarehouseDto) => {
        const { data } = await http.post<Warehouse>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateWarehouseDto) => {
        const { data } = await http.put<Warehouse>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },
    getEnum: async () => {
        const all = await warehouseApi.getAll();

        const list: EnumListItem[] = all.map((item) => ({
            label: item.location,
            value: item.id,
            color: getColorWithId(item.id),
            id: item.id,
            name: item.location,
            slug: item.location,
        }));

        return list;
    },

    getEnumTypes: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Main Warehouse',
                value: WarehouseType.MainWarehouse,
                color: Colors.BLUE,
                id: WarehouseType.MainWarehouse,
                name: 'Main Warehouse',
                slug: 'MainWarehouse',
            },
            {
                label: 'Temp Warehouse',
                value: WarehouseType.TempWarehouse,
                color: Colors.PURPLE,
                id: WarehouseType.TempWarehouse,
                name: 'Temp Warehouse',
                slug: 'TempWarehouse',
            },
        ];
        return list;
    },
};
