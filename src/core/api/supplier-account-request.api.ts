import { EnumListItem } from '../models/common';
import { SupplierAccountRequest, SupplierAccountRequestApproveStatus } from '../models/supplierAccountRequest';
import { Warehouse, WarehouseType } from '../models/warehouse';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateSupplierAccountRequestDto
    extends Pick<
        SupplierAccountRequest,
        | 'email'
        | 'hashedPassword'
        | 'fullName'
        | 'address'
        | 'phoneNumber'
        | 'dob'
        | 'profilePictureUrl'
        | 'companyName'
        | 'companyEmail'
        | 'companyAddress'
        | 'companyPhone'
        | 'companyTaxCode'
        | 'requestStaffId'
    > {}
export interface IUpdateSupplierAccountRequestDto
    extends Pick<
        SupplierAccountRequest,
        | 'email'
        | 'hashedPassword'
        | 'fullName'
        | 'address'
        | 'phoneNumber'
        | 'dob'
        | 'profilePictureUrl'
        | 'companyName'
        | 'companyEmail'
        | 'companyAddress'
        | 'companyPhone'
        | 'companyTaxCode'
        | 'id'
    > {}

const baseUrl = '/SupplierAccountRequest';

export const supplierAccountRequestApi = {
    getAll: async () => {
        const { data } = await http.get<SupplierAccountRequest[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SupplierAccountRequest>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateSupplierAccountRequestDto) => {
        const { data } = await http.post<Warehouse>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateSupplierAccountRequestDto) => {
        const { data } = await http.put<Warehouse>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    approve: async (id: number, approveStatus: SupplierAccountRequestApproveStatus) => {
        const { data } = await http.get<boolean>(`${baseUrl}/approve/${id}/${approveStatus}`);

        return data;
    },

    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: SupplierAccountRequestApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: SupplierAccountRequestApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Approved',
                value: SupplierAccountRequestApproveStatus.APPROVED,
                color: Colors.GREEN,
                id: SupplierAccountRequestApproveStatus.APPROVED,
                name: 'Approved',
                slug: 'approved',
            },
            {
                label: 'Rejected',
                value: SupplierAccountRequestApproveStatus.REJECTED,
                color: Colors.RED,
                id: SupplierAccountRequestApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
};
