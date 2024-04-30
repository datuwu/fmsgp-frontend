import { EnumListItem } from '../models/common';
import { SupplierAccountRequestApproveStatus } from '../models/supplierAccountRequest';
import { TempWarehouseRequest, TempWarehouseRequestApproveStatus, TempWarehouseRequestType } from '../models/tempWarehouseRequest';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateMainWarehouseRequestDto
    extends Pick<TempWarehouseRequest, 'requestDate' | 'requestTitle' | 'requestReasonContent' | 'requestExecutionDate' | 'deliveryStageId'> {
    purchasingOrderId: number;
}

const baseUrl = '/ImportMainWarehouseRequest';

export const mainWareHouseRequestApi = {
    getAll: async () => {
        const { data } = await http.get<TempWarehouseRequest[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<TempWarehouseRequest>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateMainWarehouseRequestDto) => {
        const { data } = await http.post<TempWarehouseRequest>(baseUrl, dto);

        return data;
    },

    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    getEnumType: async () => {
        const list: EnumListItem[] = [
            {
                value: TempWarehouseRequestType.IMPORT,
                id: TempWarehouseRequestType.IMPORT,
                name: 'Import',
                slug: 'import',
                color: Colors.BLUE,
                label: 'Import',
            },
            {
                value: TempWarehouseRequestType.EXPORT,
                id: TempWarehouseRequestType.EXPORT,
                name: 'Export',
                slug: 'export',
                color: Colors.GREEN,
                label: 'Export',
            },
        ];
        return list;
    },
    getApproveEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Approved',
                value: TempWarehouseRequestApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: TempWarehouseRequestApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: TempWarehouseRequestApproveStatus.REJECTED,
                color: Colors.RED,
                id: TempWarehouseRequestApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: TempWarehouseRequestApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: TempWarehouseRequestApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: TempWarehouseRequestApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: TempWarehouseRequestApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: TempWarehouseRequestApproveStatus.REJECTED,
                color: Colors.RED,
                id: TempWarehouseRequestApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
};
