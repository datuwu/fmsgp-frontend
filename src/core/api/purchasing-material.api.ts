import { EnumListItem } from '../models/common';
import { ProductionPlan } from '../models/productionPlan';
import { PurchaseMaterial } from '../models/purchaseMaterial';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

const baseUrl = '/PurchaseMaterial';

export const purchasingMaterialApi = {
    getAll: async () => {
        const { data } = await http.get<PurchaseMaterial[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<PurchaseMaterial>(`${baseUrl}/${id}`);

        return data;
    },

    getSelect: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchaseMaterial[]>(baseUrl);

        return data.map((item) => {
            const data: EnumListItem = {
                label: item.materialName,
                value: item.id,
                color: getColorWithId(item.id),
                id: item.id,
                name: item.materialName,
                slug: item.id.toString(),
            };

            return data;
        });
    },
};
