import { EnumListItem } from '../models/common';
import { SupplierAccountRequestApproveStatus } from '../models/supplierAccountRequest';
import { TempWarehouseRequest, TempWarehouseRequestApproveStatus, TempWarehouseRequestType } from '../models/tempWarehouseRequest';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTempWarehouseRequestDto
    extends Pick<
        TempWarehouseRequest,
        'requestDate' | 'requestTitle' | 'requestReasonContent' | 'requestType' | 'requestExecutionDate' | 'deliveryStageId'
    > {
    purchasingOrderId: number;
}
export interface IUpdateTempWarehouseRequestDto
    extends Pick<
        TempWarehouseRequest,
        'requestDate' | 'requestTitle' | 'requestReasonContent' | 'requestType' | 'requestExecutionDate' | 'deliveryStageId' | 'id'
    > {}

export interface IApproveTempWarehouseRequestDto {
    id: number;
    approveStatus: number;
    rejectReason: string;
    updateDate: string;
    approveExecutionDate: string | null;
}

const baseUrl = '/TempWarehouseRequest';

export const temWareHouseRequestApi = {
    getAll: async () => {
        const { data } = await http.get<TempWarehouseRequest[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<TempWarehouseRequest>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateTempWarehouseRequestDto) => {
        const { data } = await http.post<TempWarehouseRequest>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateTempWarehouseRequestDto) => {
        const { data } = await http.put<TempWarehouseRequest>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    approve: async (dto: IApproveTempWarehouseRequestDto) => {
        const { data } = await http.put<boolean>(`${baseUrl}/approval`, dto);

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

    getEnumInspectType: async () => {
        const list: EnumListItem[] = [
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
    getEnumPurchasingStaffType: async () => {
        const list: EnumListItem[] = [
            {
                value: TempWarehouseRequestType.IMPORT,
                id: TempWarehouseRequestType.IMPORT,
                name: 'Import',
                slug: 'import',
                color: Colors.BLUE,
                label: 'Import',
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
