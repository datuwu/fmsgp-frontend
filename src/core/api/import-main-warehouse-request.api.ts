import { EnumListItem } from '../models/common';
import { ImportMainWarehouseRequest, ImportMainWarehouseRequestApproveStatus } from '../models/importMainWarehouseRequest';
import { Colors } from '../utils/colors.helper';
import http from './http';

const baseUrl = '/ImportMainWarehouseRequest';

export interface ICreateImportMainWarehouseRequestDto {
    id: number;
    approveStatus: number;
    rejectReason: string;
    statusUpdateDate: string;
    approveExecutionDate: string;
}

export const importMainWarehouseRequestApi = {
    getAll: async () => {
        const { data } = await http.get<ImportMainWarehouseRequest[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<ImportMainWarehouseRequest>(`${baseUrl}/${id}`);

        return data;
    },
    approval: async (dto: ICreateImportMainWarehouseRequestDto) => {
        const { data } = await http.put<ImportMainWarehouseRequest>(`${baseUrl}/approval`, dto);

        return data;
    },
    getEnumSupplierApproveStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: ImportMainWarehouseRequestApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: ImportMainWarehouseRequestApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: ImportMainWarehouseRequestApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: ImportMainWarehouseRequestApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: ImportMainWarehouseRequestApproveStatus.REJECTED,
                color: Colors.RED,
                id: ImportMainWarehouseRequestApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
};
