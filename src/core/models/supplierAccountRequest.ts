export enum SupplierAccountRequestApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2,
}

export interface SupplierAccountRequest {
    id: number;
    requestDate: string;
    approveStatus: number;
    approveDate: string;
    email: string;
    hashedPassword: string;
    fullName: string;
    address: string;
    phoneNumber: string;
    dob: string;
    profilePictureUrl: string;
    companyName: string;
    companyEmail: string;
    companyAddress: string;
    companyPhone: string;
    companyTaxCode: string;
    requestStaffId: number;
    approveManagerId: number;
    createdDate: string;
    createdBy: null;
    lastModifiedDate: string;
    lastModifiedBy: null;
    isDeleted: boolean;
}
