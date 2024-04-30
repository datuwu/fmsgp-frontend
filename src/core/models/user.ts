import { Supplier } from './supplier';

export interface User {
    id: number;
    staffCode: string;
    email: string;
    hashedPassword: string;
    fullName: string;
    address: string;
    phoneNumber: string;
    dob: string;
    profilePictureUrl: string;
    roleId: number;
    accountStatus: number;
    purchasingManagerId: number;
    supplier: Supplier;
    purchasingStaffId: number;
    supplierId: number;
    inspectorId: number;
}

export enum SystemRole {
    InspectorStaff = 1,
    Manager = 2,
    PurchasingManager = 3,
    PurchasingStaff = 4,
    Supplier = 5,
    WarehouseStaff = 6,
    Admin = 7,
}
