import { EnumListItem } from '../models/common';
import { OrderMaterial } from '../models/orderMaterial';
import {
    PurchasingOrder,
    PurchasingOrderManagerApproveStatus,
    PurchasingOrderStatus,
    PurchasingOrderSupplierApproveStatus,
} from '../models/purchasingOrder';
import { PurchasingPlanApproveStatus } from '../models/purchasingPlan';
import { Colors } from '../utils/colors.helper';
import { PurchaseMaterialItem } from './delivery-stage.api';
import http from './http';

export interface ICreatePurchasingOrderDto
    extends Pick<
        PurchasingOrder,
        | 'name'
        | 'supplierName'
        | 'supplierCompanyName'
        | 'supplierTaxCode'
        | 'supplierAddress'
        | 'suppplierEmail'
        | 'supplierPhone'
        | 'receiverCompanyAddress'
        | 'receiverCompanyEmail'
        | 'receiverCompanyPhone'
        | 'note'
        | 'purchasingPlanId'
        | 'supplierId'
    > {
    orderMaterials: Array<
        Pick<OrderMaterial, 'materialName' | 'rawMaterialId' | 'supplierMaterialCode'> & {
            packagePrice: number;
            packageQuantity: number;
            materialPerPackage: number;
        }
    >;
    deliveryStages: {
        deliveryDate: string;
        stageOrder: number;
        purchaseMaterials: PurchaseMaterialItem[];
    }[];
}
export interface IUpdatePurchasingOrderDto
    extends Pick<
        PurchasingOrder,
        | 'id'
        | 'name'
        | 'supplierName'
        | 'supplierCompanyName'
        | 'supplierTaxCode'
        | 'supplierAddress'
        | 'suppplierEmail'
        | 'supplierPhone'
        | 'receiverCompanyAddress'
        | 'receiverCompanyEmail'
        | 'receiverCompanyPhone'
        | 'note'
        | 'supplierId'
    > {}

const baseUrl = '/PurchasingOrder';

export const purchasingOrderApi = {
    getAll: async () => {
        const { data } = await http.get<PurchasingOrder[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<PurchasingOrder>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreatePurchasingOrderDto) => {
        const { data } = await http.post<PurchasingOrder>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdatePurchasingOrderDto) => {
        const { data } = await http.put<PurchasingOrder>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    approveManager: async (id: number, approveStatus: PurchasingPlanApproveStatus) => {
        const { data } = await http.get<boolean>(`${baseUrl}/${id}/approval/${approveStatus}`, {
            params: { isSupplier: 'false' },
        });

        return data;
    },

    approveSupplier: async (id: number, approveStatus: PurchasingPlanApproveStatus) => {
        const { data } = await http.get<boolean>(`${baseUrl}/${id}/approval/${approveStatus}`, {
            params: { isSupplier: 'true' },
        });

        return data;
    },

    getSelect: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchasingOrder[]>(baseUrl);

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

    getSelectWithCodeAndApprove: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchasingOrder[]>(baseUrl);

        return data
            .filter(
                (item) =>
                    item.managerApproveStatus === PurchasingOrderManagerApproveStatus.APPROVED &&
                    item.supplierApproveStatus === PurchasingOrderSupplierApproveStatus.APPROVED,
            )
            .map((item) => {
                const data: EnumListItem = {
                    label: `${item.name} (${item.poCode})`,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: `${item.name} (${item.poCode})`,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },

    getEnumSupplierApproveStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: PurchasingOrderSupplierApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: PurchasingOrderSupplierApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: PurchasingOrderSupplierApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: PurchasingOrderSupplierApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: PurchasingOrderSupplierApproveStatus.REJECTED,
                color: Colors.RED,
                id: PurchasingOrderSupplierApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
    getEnumOrderStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: PurchasingOrderStatus.PENDING,
                color: Colors.YELLOW,
                id: PurchasingOrderStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Processing',
                value: PurchasingOrderStatus.PROCESSING,
                color: Colors.BLUE,
                id: PurchasingOrderStatus.PROCESSING,
                name: 'Processing',
                slug: 'processing',
            },
            {
                label: 'Finished',
                value: PurchasingOrderStatus.FINISHED,
                color: Colors.GREEN,
                id: PurchasingOrderStatus.FINISHED,
                name: 'Finished',
                slug: 'finished',
            },
        ];
        return list;
    },
    getEnumManagerApproveStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: PurchasingOrderManagerApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: PurchasingOrderManagerApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: PurchasingOrderManagerApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: PurchasingOrderManagerApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: PurchasingOrderManagerApproveStatus.REJECTED,
                color: Colors.RED,
                id: PurchasingOrderManagerApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },

    async getPurchasingTaskByPurchasingOrderId(purchasingOrderId: number) {
        const { data } = await http.get<PurchasingOrder[]>(`${baseUrl}/purchasingTask/${purchasingOrderId}`);

        return data;
    },
};
