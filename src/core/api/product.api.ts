import { get } from 'lodash';

import { EnumListItem } from '../models/common';
import { Product, ProductAreaUnit, ProductSize, ProductUnitEnum } from '../models/product';
import { getColorWithId } from '../utils/api.helper';
import http from './http';
import { rawMaterialApi } from './raw-material.api';

export interface ICreateProductMaterial {
    rawMaterialId: number;
    quantity: number;
}

export interface IUpdateProductMaterial {
    id: number;
    quantity: number;
    productId: number;
    rawMaterialId: number;
}

export interface ICreateProductDto extends Pick<Product, 'name' | 'note' | 'description' | 'productCategoryId' | 'unit' | 'productSize'> {
    productMaterials: ICreateProductMaterial[];
}
export interface IUpdateProductDto extends Pick<Product, 'name' | 'note' | 'description' | 'productCategoryId' | 'id' | 'unit' | 'productSize'> {
    productMaterials: IUpdateProductMaterial[];
}

const baseUrl = '/Product';

export const productApi = {
    getAll: async () => {
        const { data } = await http.get<Product[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<Product>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateProductDto) => {
        const { data } = await http.post<Product>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateProductDto) => {
        const { data } = await http.put<Product>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOption: async () => {
        const { data } = await http.get<Product[]>(baseUrl);

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

    getEnumSelectOptionWithCodeAndUnit: async () => {
        const { data } = await http.get<Product[]>(baseUrl);
        const units = await productApi.getProductUnit();

        const result: EnumListItem[] = data.map((item) => ({
            id: item.id,
            label: `${item.code} - ${item.name} - ${units.find((u) => u.value === item.unit)?.label}`,
            color: '',
            name: `${item.code} - ${item.name} - ${units.find((u) => u.value === item.unit)?.label}`,
            slug: item.id.toString(),
            value: item.id,
        }));

        return result;
    },

    getAreaUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: ProductAreaUnit.SquareCentimeter,
                name: 'Square Centimeter',
                label: 'Square Centimeter',
                slug: 'squareCentimeter',
                value: ProductAreaUnit.SquareCentimeter,
                color: getColorWithId(ProductAreaUnit.SquareCentimeter),
            },
            {
                id: ProductAreaUnit.SquareMeter,
                name: 'Square Meter',
                label: 'Square Meter',
                slug: 'squareMeter',
                value: ProductAreaUnit.SquareMeter,
                color: getColorWithId(ProductAreaUnit.SquareMeter),
            },
        ];
        return list;
    },

    getProductUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: ProductUnitEnum.Set,
                name: 'Set',
                label: 'Set',
                slug: 'set',
                value: ProductUnitEnum.Set,
                color: getColorWithId(ProductUnitEnum.Set),
            },
            {
                id: ProductUnitEnum.Piece,
                name: 'Piece',
                label: 'Piece',
                slug: 'piece',
                value: ProductUnitEnum.Piece,
                color: getColorWithId(ProductUnitEnum.Piece),
            },
            {
                id: ProductUnitEnum.Roll,
                name: 'Roll',
                label: 'Roll',
                slug: 'roll',
                value: ProductUnitEnum.Roll,
                color: getColorWithId(ProductUnitEnum.Roll),
            },
        ];
        return list;
    },
    getProductSize: async () => {
        const list: EnumListItem[] = [
            {
                id: ProductSize.None,
                name: 'None',
                label: 'None',
                slug: 'none',
                value: ProductSize.None,
                color: getColorWithId(ProductSize.None),
            },
            {
                id: ProductSize.Other,
                name: 'Other',
                label: 'Other',
                slug: 'other',
                value: ProductSize.Other,
                color: getColorWithId(ProductSize.Other),
            },
            {
                id: ProductSize.XS,
                name: 'XS',
                label: 'XS',
                slug: 'xs',
                value: ProductSize.XS,
                color: getColorWithId(ProductSize.XS),
            },
            {
                id: ProductSize.S,
                name: 'S',
                label: 'S',
                slug: 's',
                value: ProductSize.S,
                color: getColorWithId(ProductSize.S),
            },
            {
                id: ProductSize.M,
                name: 'M',
                label: 'M',
                slug: 'm',
                value: ProductSize.M,
                color: getColorWithId(ProductSize.M),
            },
            {
                id: ProductSize.L,
                name: 'L',
                label: 'L',
                slug: 'l',
                value: ProductSize.L,
                color: getColorWithId(ProductSize.L),
            },
            {
                id: ProductSize.XL,
                name: 'XL',
                label: 'XL',
                slug: 'xl',
                value: ProductSize.XL,
                color: getColorWithId(ProductSize.XL),
            },
            {
                id: ProductSize.XXL,
                name: 'XXL',
                label: 'XXL',
                slug: 'xxl',
                value: ProductSize.XXL,
                color: getColorWithId(ProductSize.XXL),
            },
        ];
        return list;
    },
};
