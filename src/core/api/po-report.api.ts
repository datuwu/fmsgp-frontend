import { getColorWithUuId } from '@/core/utils/api.helper';

import { EnumListItem } from '../models/common';
import { MaterialCategory } from '../models/materialCategory';
import { POReport, POReportResolveStatus, POReportResolveSupplierStatus } from '../models/poReport';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreatePOReportDto extends Pick<POReport, 'reportTitle' | 'reportContent' | 'supplierId' | 'purchasingOrderId'> {}
export interface IUpdateStaffPOReportDto extends Pick<POReport, 'id' | 'reportTitle' | 'reportContent'> {}

export interface IUpdatePurchasingStaffPOReportDto extends Pick<POReport, 'id' | 'reportAnswer' | 'purchasingStaffId'> {}

const baseUrl = '/PO_Report';

export const poReportApi = {
    getAll: async () => {
        const { data } = await http.get<POReport[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<POReport>(`${baseUrl}/${id}`);

        return data;
    },
    getPurchasingOrderId: async (id: number) => {
        const { data } = await http.get<POReport[]>(`${baseUrl}/purchasingOrder/${id}`);

        return data;
    },
    create: async (role: ICreatePOReportDto) => {
        const { data } = await http.post<MaterialCategory>(baseUrl, role);

        return data;
    },
    update: async (role: IUpdateStaffPOReportDto) => {
        const { data } = await http.put<MaterialCategory>(`${baseUrl}/Supplier`, role);

        return data;
    },
    updatePurchasingStaff: async (role: IUpdatePurchasingStaffPOReportDto) => {
        const { data } = await http.put<MaterialCategory>(`${baseUrl}/PurchasingStaff`, role);

        return data;
    },

    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },

    getEnumSelectOption: async () => {
        const { data } = await http.get<MaterialCategory[]>(baseUrl);

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

    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: POReportResolveStatus.PENDING,
                color: Colors.YELLOW,
                id: POReportResolveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Processing',
                value: POReportResolveStatus.PROCESSING,
                color: Colors.BLUE,
                id: POReportResolveStatus.PROCESSING,
                name: 'Processing',
                slug: 'processing',
            },
            {
                label: 'Resolved',
                value: POReportResolveStatus.RESOLVED,
                color: Colors.GREEN,
                id: POReportResolveStatus.RESOLVED,
                name: 'Resolved',
                slug: 'resolved',
            },
        ];
        return list;
    },
    getSupplierApprovingStatusEnum: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Approved',
                value: POReportResolveSupplierStatus.APPROVED,
                color: Colors.GREEN,
                id: POReportResolveSupplierStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: POReportResolveSupplierStatus.REJECTED,
                color: Colors.RED,
                id: POReportResolveSupplierStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
    updateResolve: async (poReportId: number, resolveStatus: number) => {
        const { data } = await http.put<POReport>(
            `${baseUrl}/${poReportId}/resolve`,
            {},
            {
                params: {
                    resolveStatus,
                },
            },
        );

        return data;
    },

    getSupplierStatusEnum: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: POReportResolveSupplierStatus.PENDING,
                color: Colors.YELLOW,
                id: POReportResolveSupplierStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: POReportResolveSupplierStatus.APPROVED,
                color: Colors.GREEN,
                id: POReportResolveSupplierStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: POReportResolveSupplierStatus.REJECTED,
                color: Colors.RED,
                id: POReportResolveSupplierStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
};
