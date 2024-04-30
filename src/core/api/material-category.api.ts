import { getColorWithUuId } from '@/core/utils/api.helper';

import { EnumListItem } from '../models/common';
import { MaterialCategory } from '../models/materialCategory';
import http from './http';

export interface ICreateMaterialCategoryDto extends Pick<MaterialCategory, 'name'> {}
export interface IUpdateMaterialCategoryDto extends Pick<MaterialCategory, 'id' | 'name'> {}

const baseUrl = '/MaterialCategory';

export const materialCategoryApi = {
    getAll: async () => {
        const { data } = await http.get<MaterialCategory[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<MaterialCategory>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (role: ICreateMaterialCategoryDto) => {
        const { data } = await http.post<MaterialCategory>(baseUrl, role);

        return data;
    },
    update: async (role: IUpdateMaterialCategoryDto) => {
        const { data } = await http.put<MaterialCategory>(baseUrl, role);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },

    getEnumSelectOption: async () => {
        const { data } = await http.get<MaterialCategory[]>(baseUrl);

        const result: EnumListItem[] = data.map((item) => ({
            id: item.id,
            label: item.name,
            color: '',
            name: item.name,
            slug: item.id.toString(),
            value: item.id,
        }));

        return result;
    },
};
