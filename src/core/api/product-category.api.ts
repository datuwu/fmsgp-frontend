import { EnumListItem } from '../models/common';
import { ProductCategory } from '../models/productCategory';
import { getColorWithUuId } from '../utils/api.helper';
import http from './http';

export interface ICreateProductCategoryDto extends Pick<ProductCategory, 'name'> {}
export interface IUpdateProductCategoryDto extends Pick<ProductCategory, 'name' | 'id'> {}
const baseUrl = '/ProductCategory';

export const productCategoryApi = {
    getAll: async () => {
        const { data } = await http.get<ProductCategory[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<ProductCategory>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateProductCategoryDto) => {
        const { data } = await http.post<ProductCategory>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateProductCategoryDto) => {
        const { data } = await http.put<ProductCategory>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<ProductCategory>(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOption: async () => {
        const { data } = await http.get<ProductCategory[]>(baseUrl);

        const result: EnumListItem[] = data.map((item) => ({
            id: item.id,
            label: item.name,
            color: getColorWithUuId(item.id.toString()),
            name: item.name,
            slug: item.id.toString(),
            value: item.id,
        }));

        return result;
    },
};
