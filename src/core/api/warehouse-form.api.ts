import axios from 'axios';

import { EnumListItem } from '../models/common';
import {
    WareHouseReceiveTypeEnums,
    WarehouseForm,
    WarehouseFormMaterial,
    WarehouseFormStatusEnum,
    WarehouseFormTypeEnums,
} from '../models/warehouseForm';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateWarehouseFormDto
    extends Pick<
        WarehouseForm,
        | 'formType'
        | 'poCode'
        | 'receiveCompanyName'
        | 'companyAddress'
        | 'receiveWarehouse'
        | 'totalPrice'
        | 'requestStaffName'
        | 'supplierName'
        | 'approveWarehouseStaffName'
        | 'tempWarehouseRequestId'
        | 'importMainWarehouseRequestId'
    > {
    warehouseFormMaterials: Array<
        Pick<WarehouseFormMaterial, 'materialName' | 'materialCode' | 'requestQuantity' | 'receiveQuantity' | 'unitPrice' | 'purchaseMaterialId'>
    >;
}
export interface IUpdateWarehouseFormDto
    extends Pick<
        WarehouseForm,
        | 'id'
        | 'formType'
        | 'poCode'
        | 'receiveCompanyName'
        | 'companyAddress'
        | 'receiveWarehouse'
        | 'totalPrice'
        | 'requestStaffName'
        | 'supplierName'
        | 'approveWarehouseStaffName'
        | 'tempWarehouseRequestId'
        | 'importMainWarehouseRequestId'
    > {
    warehouseFormMaterials: Array<
        Pick<
            WarehouseFormMaterial,
            'id' | 'materialName' | 'materialCode' | 'requestQuantity' | 'receiveQuantity' | 'unitPrice' | 'purchaseMaterialId'
        >
    >;
}

export interface ITempImportFormStatusFormDto {
    id: number;
    warehouseFormMaterials: {
        id: number;
        receiveQuantity: number;
        executionDate: string;
    }[];
}

export interface IMainImportFormStatusFormDto {
    id: number;
    warehouseFormMaterials: {
        id: number;
        receiveQuantity: number;
        executionDate: string;
    }[];
}
export interface ITempImportFormStatusDto {
    formFile: File | null;
}

const baseUrl = '/WarehouseForm';

export const warehouseFormApi = {
    getAll: async () => {
        const { data } = await http.get<WarehouseForm[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<WarehouseForm>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateWarehouseFormDto) => {
        const { data } = await http.post<WarehouseForm>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateWarehouseFormDto) => {
        const { data } = await http.put<WarehouseForm>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },
    createTempWarehouseForm: async (id: number) => {
        const res = await http.post(`${baseUrl}/temp-warehouse-form/${id}`);

        return res;
    },
    createMainWarehouseForm: async (id: number) => {
        const res = await http.post(`${baseUrl}/import-main-warehouse-form/${id}`);

        return res;
    },
    upload: async (dto: ITempImportFormStatusDto) => {
        const formData = new FormData();
        if (dto.formFile) formData.append('formFile', dto.formFile);

        const { data } = await http.post<WarehouseForm>(`${baseUrl}/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },
    getApiTempImportFormStatus: async (data: ITempImportFormStatusFormDto) => {
        const { data: res } = await http.put(`${baseUrl}/temp-import-form-status`, data);

        return res;
    },
    getApiMainImportFormStatus: async (data: IMainImportFormStatusFormDto) => {
        const { data: res } = await http.put(`${baseUrl}/main-import-form-status`, data);

        return res;
    },

    getEnumType: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Import',
                value: WarehouseFormTypeEnums.IMPORT,
                color: Colors.YELLOW,
                id: WarehouseFormTypeEnums.IMPORT,
                name: 'Import',
                slug: 'Import',
            },
            {
                label: 'Export',
                value: WarehouseFormTypeEnums.EXPORT,
                color: Colors.GREEN,
                id: WarehouseFormTypeEnums.EXPORT,
                name: 'Export',
                slug: 'Export',
            },
        ];
        return list;
    },

    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Processing',
                value: WarehouseFormStatusEnum.PROCESSING,
                color: Colors.YELLOW,
                id: WarehouseFormStatusEnum.PROCESSING,
                name: 'Processing',
                slug: 'Processing',
            },
            {
                label: 'Executed',
                value: WarehouseFormStatusEnum.EXECUTED,
                color: Colors.GREEN,
                id: WarehouseFormStatusEnum.EXECUTED,
                name: 'Executed',
                slug: 'Executed',
            },
        ];
        return list;
    },

    getEnumReceiveType: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Temp Warehouse',
                value: WareHouseReceiveTypeEnums.TEMP_WAREHOUSE,
                color: Colors.YELLOW,
                id: WareHouseReceiveTypeEnums.TEMP_WAREHOUSE,
                name: 'Temp Warehouse',
                slug: 'Temp Warehouse',
            },
            {
                label: 'Main Warehouse',
                value: WareHouseReceiveTypeEnums.MAIN_WAREHOUSE,
                color: Colors.GREEN,
                id: WareHouseReceiveTypeEnums.MAIN_WAREHOUSE,
                name: 'Main Warehouse',
                slug: 'Main Warehouse',
            },
        ];
        return list;
    },

    tempExportFormStatus: async (id: number) => {
        const res = await http.put(`${baseUrl}/temp-export-form-status/${id}`);

        return res;
    },

    exportImportWarehouseForm: async (id: number) => {
        // /WarehouseForm/1/file/export-import-warehouse-form
        const res = await http.get(`${baseUrl}/${id}/file/export-import-warehouse-form`);

        setTimeout(() => {
            window.open(`https://mpms-api.monoinfinity.net/api/WarehouseForm/${id}/file/export-import-warehouse-form`, '_blank');
        }, 1000);

        return res;
    },

    tempImportFormStatus: async (id: number) => {
        const res = await http.put(`${baseUrl}/temp-import-form-status/${id}`);

        return res;
    },
    mainImportFormStatus: async (id: number) => {
        const res = await http.put(`${baseUrl}/main-import-form-status/${id}`);

        return res;
    },

    exportExportWarehouseForm: async (id: number) => {
        // /WarehouseForm/1/file/export-export-warehouse-form
        const res = await http.get(`${baseUrl}/${id}/file/export-export-warehouse-form`);

        setTimeout(() => {
            window.open(`https://mpms-api.monoinfinity.net/api/WarehouseForm/${id}/file/export-export-warehouse-form`, '_blank');
        }, 1000);

        return res;
    },
    exportInspectionForm: async (id: number) => {
        // /WarehouseForm/1/file/export-inspection-form
        const res = await http.get(`/InspectionForm/${id}/file/export-inspection-form`);

        setTimeout(() => {
            window.open(`https://mpms-api.monoinfinity.net/api/InspectionForm/${id}/file/export-inspection-form`, '_blank');
        }, 0);

        return res;
    },
    tempExportWarehouseFormDeliveryStage: async (deliveryStageId: number) => {
        // TODO: why when use axios it works but when use http it doesn't work
        const { data } = await http.post(
            `https://mpms-api.monoinfinity.net/api/WarehouseForm/temp-export-warehouse-form/delivery-stage/${deliveryStageId}`,
        );
        return data;
    },
    mainImportWarehouseFormDeliveryStage: async (deliveryStageId: number) => {
        const { data } = await http.post(
            `https://mpms-api.monoinfinity.net/api/WarehouseForm/main-import-warehouse-form/delivery-stage/${deliveryStageId}`,
        );

        return data;
    },
};
