import { EnumListItem } from '../models/common';
import { PurchasingTask, PurchasingTaskProgressEnum, PurchasingTaskStatusEnum } from '../models/purchasingTask';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface IAssignPurchasingTaskDto {
    id: number;
    taskStartDate: string;
    taskEndDate: string;
    purchasingStaffId: number;
}

const baseUrl = '/PurchasingTask';

export const purchasingTaskApi = {
    getAll: async () => {
        const { data } = await http.get<PurchasingTask[]>(baseUrl);

        return data;
    },

    getMyAll: async (purchasingStaffId: number) => {
        const { data } = await http.get<PurchasingTask[]>(`${baseUrl}`);

        return data.filter((x) => x.purchasingStaffId === purchasingStaffId);
    },

    getById: async (id: number) => {
        const { data } = await http.get<PurchasingTask>(`${baseUrl}/${id}`);

        return data;
    },
    assign: async (dto: IAssignPurchasingTaskDto) => {
        const { data } = await http.put<PurchasingTask>(`${baseUrl}/assign`, dto);

        return data;
    },

    getByPurchasingStaff: async (purchasingStaffId: number) => {
        const { data } = await http.get<PurchasingTask[]>(`${baseUrl}/purchasingStaff/${purchasingStaffId}`);

        return data;
    },

    getEnumProgress: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: PurchasingTaskProgressEnum.PENDING,
                color: Colors.YELLOW,
                id: PurchasingTaskProgressEnum.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Processing',
                value: PurchasingTaskProgressEnum.PROCESSING,
                color: Colors.BLUE,
                id: PurchasingTaskProgressEnum.PROCESSING,
                name: 'Processing',
                slug: 'processing',
            },
            {
                label: 'Finished',
                value: PurchasingTaskProgressEnum.FINISHED,
                color: Colors.RED,
                id: PurchasingTaskProgressEnum.FINISHED,
                name: 'Finished',
                slug: 'Finished',
            },
        ];
        return list;
    },

    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                id: PurchasingTaskStatusEnum.PENDING,
                name: 'Pending',
                slug: 'pending',
                color: Colors.YELLOW,
                value: PurchasingTaskStatusEnum.PENDING,
            },
            {
                label: 'Processing',
                id: PurchasingTaskStatusEnum.PROCESSING,
                name: 'Processing',
                slug: 'processing',
                color: Colors.BLUE,
                value: PurchasingTaskStatusEnum.PROCESSING,
            },
            {
                label: 'Finished',
                id: PurchasingTaskStatusEnum.FINISHED,
                name: 'Finished',
                slug: 'finished',
                color: Colors.GREEN,
                value: PurchasingTaskStatusEnum.FINISHED,
            },
            {
                label: 'Assigned',
                id: PurchasingTaskStatusEnum.ASSIGNED,
                name: 'Assigned',
                slug: 'assigned',
                color: Colors.ORANGE,
                value: PurchasingTaskStatusEnum.ASSIGNED,
            },
            {
                label: 'Overdue',
                id: PurchasingTaskStatusEnum.OVERDUE,
                name: 'Overdue',
                slug: 'overdue',
                color: Colors.RED,
                value: PurchasingTaskStatusEnum.OVERDUE,
            },
        ];

        return list;
    },
};
