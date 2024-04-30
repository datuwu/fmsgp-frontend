import { EnumListItem } from '../models/common';
import { PurchaseTask } from '../models/purchaseTask';
import { PurchasingPlan, PurchasingPlanApproveStatus, PurchasingPlanProgressEnum } from '../models/purchasingPlan';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreatePurchasingPlanDto extends Pick<PurchasingPlan, 'title' | 'startDate' | 'endDate' | 'note'> {
    productionPlanId: number;
    purchaseTasks: Array<Pick<PurchaseTask, 'quantity' | 'rawMaterialId'>>;
}
export interface IUpdatePurchasingPlanDto extends Pick<PurchasingPlan, 'lastModifiedDate' | 'id' | 'title' | 'startDate' | 'endDate' | 'note'> {
    purchaseTasks: Array<Pick<PurchaseTask, 'quantity' | 'rawMaterialId'>>;
}

const baseUrl = '/PurchasingPlan';

export const purchasingPlanApi = {
    getAll: async () => {
        const { data } = await http.get<PurchasingPlan[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<PurchasingPlan>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreatePurchasingPlanDto) => {
        const { data } = await http.post<PurchasingPlan>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdatePurchasingPlanDto) => {
        const { data } = await http.put<PurchasingPlan>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    approve: async (id: number, approveStatus: PurchasingPlanApproveStatus) => {
        const { data } = await http.get<boolean>(`${baseUrl}/${id}/approval/${approveStatus}`);

        return data;
    },

    getSelect: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchasingPlan[]>(baseUrl);

        return data
            .map((item) => {
                const data: EnumListItem = {
                    label: item.title,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: item.title,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },

    getApproveSelect: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchasingPlan[]>(baseUrl);

        return data
            .filter((item) => item.approveStatus === PurchasingPlanApproveStatus.APPROVED)
            .map((item) => {
                const data: EnumListItem = {
                    label: item.title,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: item.title,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },

    getApproveSelectWithoutOverdue: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchasingPlan[]>(baseUrl);

        return data
            .filter(
                (item) => item.approveStatus === PurchasingPlanApproveStatus.APPROVED && item.processStatus !== PurchasingPlanProgressEnum.OVERDUE,
            )
            .map((item) => {
                const data: EnumListItem = {
                    label: item.title,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: item.title,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },
    getApproveSelectWithoutOverdueWithCode: async (search: string): Promise<EnumListItem[]> => {
        const { data } = await http.get<PurchasingPlan[]>(baseUrl);

        return data
            .filter(
                (item) => item.approveStatus === PurchasingPlanApproveStatus.APPROVED && item.processStatus !== PurchasingPlanProgressEnum.OVERDUE,
            )
            .map((item) => {
                const data: EnumListItem = {
                    label: `${item.planCode} - ${item.title}`,
                    value: item.id,
                    color: Colors.BLUE,
                    id: item.id,
                    name: `${item.planCode} - ${item.title}`,
                    slug: item.id.toString(),
                };

                return data;
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    },

    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: PurchasingPlanApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: PurchasingPlanApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: PurchasingPlanApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: PurchasingPlanApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: PurchasingPlanApproveStatus.REJECTED,
                color: Colors.RED,
                id: PurchasingPlanApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },

    getEnumProcessingStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: PurchasingPlanProgressEnum.PENDING,
                color: Colors.YELLOW,
                id: PurchasingPlanProgressEnum.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Processing',
                value: PurchasingPlanProgressEnum.PROCESSING,
                color: Colors.BLUE,
                id: PurchasingPlanProgressEnum.PROCESSING,
                name: 'Processing',
                slug: 'processing',
            },
            {
                label: 'Finished',
                value: PurchasingPlanProgressEnum.FINISHED,
                color: Colors.GREEN,
                id: PurchasingPlanProgressEnum.FINISHED,
                name: 'Finished',
                slug: 'finished',
            },
            {
                label: 'Rejected',
                value: PurchasingPlanProgressEnum.REJECTED,
                color: Colors.RED,
                id: PurchasingPlanProgressEnum.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
            {
                label: 'Overdue',
                value: PurchasingPlanProgressEnum.OVERDUE,
                color: Colors.RED,
                id: PurchasingPlanProgressEnum.OVERDUE,
                name: 'Overdue',
                slug: 'overdue',
            },
        ];
        return list;
    },
};
