import { EnumListItem } from '../models/common';
import { ProductionPlan } from '../models/productionPlan';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateProductionPlanDto extends Pick<ProductionPlan, 'name' | 'planStartDate' | 'planEndDate' | 'note'> {
    productInPlans: {
        quantity: number;
        productId: number;
    }[];
    expectedMaterials: {
        requireQuantity: number;
        rawMaterialId: number;
    }[];
}

export interface IUploadProductionPlanDto {
    formFile: File | null;
}
export interface IUpdateProductionPlanDto
    extends Pick<ProductionPlan, 'name' | 'planStartDate' | 'planEndDate' | 'note' | 'fileUrl' | 'id' | 'managerId'> {}

const baseUrl = '/ProductionPlan';

export const productionPlanApi = {
    getAll: async () => {
        const { data } = await http.get<ProductionPlan[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<ProductionPlan>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateProductionPlanDto) => {
        const { data } = await http.post<ProductionPlan>(baseUrl, dto);

        return data;
    },

    upload: async (dto: IUploadProductionPlanDto) => {
        const formData = new FormData();
        if (dto.formFile) formData.append('formFile', dto.formFile);

        const { data } = await http.post<ProductionPlan>(`${baseUrl}/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },
    update: async (dto: IUpdateProductionPlanDto) => {
        const { data } = await http.put<ProductionPlan>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },
    getSelect: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<ProductionPlan[]>(baseUrl);

        return data
            .map((item) => {
                const data: EnumListItem = {
                    label: item.name,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: item.name,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },

    getNotPurchasingPlanYet: async (search: string) => {
        const { data } = await http.get<ProductionPlan[]>(`${baseUrl}/no-purchasing-plan-yet`);

        return data
            .map((item) => {
                const data: EnumListItem = {
                    label: item.name,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: item.name,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },

    _getNotPurchasingPlanYet: async () => {
        const { data } = await http.get<ProductionPlan[]>(`${baseUrl}/no-purchasing-plan-yet`);

        return data;
    },
};
