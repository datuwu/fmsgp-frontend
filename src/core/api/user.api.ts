import { NKConfig } from '../NKConfig';
import { EnumListItem } from '../models/common';
import { Supplier } from '../models/supplier';
import { SystemRole, User } from '../models/user';
import { UserRole } from '../models/userRole';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ILoginUserDto extends Pick<User, 'email' | 'hashedPassword'> {}
export interface ICreateUserDto
    extends Pick<User, 'staffCode' | 'email' | 'hashedPassword' | 'fullName' | 'address' | 'phoneNumber' | 'dob' | 'profilePictureUrl' | 'roleId'> {}
export interface IUpdateUserDto
    extends Pick<
        User,
        | 'id'
        | 'staffCode'
        | 'email'
        | 'hashedPassword'
        | 'fullName'
        | 'address'
        | 'phoneNumber'
        | 'dob'
        | 'profilePictureUrl'
        | 'roleId'
        | 'accountStatus'
    > {}

export interface ICreateSupplierDto
    extends Pick<User, 'email' | 'hashedPassword' | 'fullName' | 'address' | 'phoneNumber' | 'dob' | 'profilePictureUrl'> {
    supplier: Pick<Supplier, 'companyName' | 'companyEmail' | 'companyAddress' | 'companyPhone' | 'companyTaxCode'>;
}

export interface IUpdateSupplierDto extends Pick<User, 'id' | 'staffCode' | 'email' | 'fullName' | 'address' | 'phoneNumber' | 'dob' | 'roleId'> {
    supplier: Pick<Supplier, 'id' | 'companyName' | 'companyEmail' | 'companyAddress' | 'companyPhone' | 'companyTaxCode' | 'lastModifiedDate'>;
}

const baseUrl = '/User';

export const userApi = {
    getAll: async () => {
        const { data } = await http.get<User[]>(baseUrl);

        return data;
    },

    getUserEnum: async () => {
        const data = await userApi.getAll();

        const list: EnumListItem[] = data.map((x) => {
            return {
                label: x.fullName,
                value: x.id,
                color: Colors.BLUE,
                id: x.id,
                name: x.fullName,
                slug: x.fullName,
            };
        });

        return list;
    },

    getPurchasingStaffEnum: async () => {
        const data = await userApi.getAll();

        const list: EnumListItem[] = data.map((x) => {
            return {
                label: x.fullName,
                value: x.purchasingStaffId,
                color: Colors.BLUE,
                id: x.id,
                name: x.fullName,
                slug: x.fullName,
            };
        });

        return list;
    },

    getInspectorStaffEnum: async () => {
        const data = await userApi.getAll();

        const list: EnumListItem[] = data.map((x) => {
            return {
                label: x.fullName,
                value: x.inspectorId,
                color: Colors.BLUE,
                id: x.inspectorId,
                name: x.fullName,
                slug: x.fullName,
            };
        });

        return list;
    },

    getById: async (id: number) => {
        const { data } = await http.get<User>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (role: ICreateUserDto) => {
        const { data } = await http.post<User>(baseUrl, role);

        return data;
    },
    update: async (role: IUpdateUserDto) => {
        const { data } = await http.put<User>(baseUrl, role);

        return data;
    },
    login: async (user: ILoginUserDto) => {
        const { data } = await http.post<User>(`${baseUrl}/login`, user);

        return data;
    },

    getSuppliers: async () => {
        const { data } = await http.get<User[]>(`${baseUrl}`);

        return data.filter((x) => x.supplier);
    },

    createSupplier: async (supplier: ICreateSupplierDto) => {
        const { data } = await http.post<User>(`${baseUrl}/supplier`, supplier);

        return data;
    },

    updateSupplier: async (supplier: IUpdateSupplierDto) => {
        const { data } = await http.put<User>(`${baseUrl}/supplier`, supplier);

        return data;
    },

    getStatus: (): EnumListItem[] => {
        return [
            {
                label: 'Active',
                value: 0,
                color: Colors.GREEN,
                id: 0,
                name: 'Active',
                slug: 'Active',
            },
            {
                label: 'Inactive',
                value: 1,
                color: Colors.RED,
                id: 1,
                name: 'Inactive',
                slug: 'Inactive',
            },
            {
                label: 'Blocked',
                value: 2,
                color: Colors.YELLOW,
                id: 2,
                name: 'Blocked',
                slug: 'Blocked',
            },
        ];
    },

    getPurchasingStaff: async (id: number) => {
        const { data } = await http.get<User>(`${NKConfig.SERVER_URL}/purchasingStaff/${id}`);

        return data;
    },
    getByRole: async (role: number) => {
        const { data } = await http.get<User[]>(`${baseUrl}/role/${role}`);

        return data;
    },

    getRoles: (): EnumListItem[] => {
        return [
            {
                label: 'Inspector Staff',
                value: SystemRole.InspectorStaff,
                color: Colors.BLUE,
                id: SystemRole.InspectorStaff,
                name: 'Inspector Staff',
                slug: 'InspectorStaff',
            },
            {
                label: 'Manager',
                value: SystemRole.Manager,
                color: Colors.PURPLE,
                id: SystemRole.Manager,
                name: 'Manager',
                slug: 'Manager',
            },
            {
                label: 'Purchasing Manager',
                value: SystemRole.PurchasingManager,
                color: Colors.ORANGE,
                id: SystemRole.PurchasingManager,
                name: 'Purchasing Manager',
                slug: 'PurchasingManager',
            },
            {
                label: 'Purchasing Staff',
                value: SystemRole.PurchasingStaff,
                color: Colors.YELLOW,
                id: SystemRole.PurchasingStaff,
                name: 'Purchasing Staff',
                slug: 'PurchasingStaff',
            },
            {
                label: 'Supplier',
                value: SystemRole.Supplier,
                color: Colors.GREEN,
                id: SystemRole.Supplier,
                name: 'Supplier',
                slug: 'Supplier',
            },
            {
                label: 'Warehouse Staff',
                value: SystemRole.WarehouseStaff,
                color: Colors.RED,
                id: SystemRole.WarehouseStaff,
                name: 'Warehouse Staff',
                slug: 'WarehouseStaff',
            },
            {
                label: 'Admin',
                value: SystemRole.Admin,
                color: Colors.BLUE,
                id: SystemRole.Admin,
                name: 'Admin',
                slug: 'Admin',
            },
        ];
    },
};
