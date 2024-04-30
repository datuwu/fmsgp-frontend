import { InspectionForm, MaterialInspectResult } from '../models/inspectionForm';
import { WarehouseForm } from '../models/warehouseForm';
import http from './http';

export interface ICreateInspectionFormDto
    extends Pick<InspectionForm, 'resultCode' | 'inspectLocation' | 'inspectorName' | 'resultNote' | 'managerName' | 'inspectionRequestId'> {
    materialInspectResults: Array<Pick<MaterialInspectResult, 'materialCode' | 'inspectionPassQuantity' | 'note' | 'purchaseMaterialId'>>;
}
export interface IUpdateInspectionFormDto
    extends Pick<InspectionForm, 'id' | 'resultCode' | 'inspectLocation' | 'inspectorName' | 'resultNote' | 'managerName' | 'inspectionRequestId'> {
    warehouseFormMaterials: Array<Pick<MaterialInspectResult, 'id' | 'materialCode' | 'inspectionPassQuantity' | 'note' | 'purchaseMaterialId'>>;
}

export interface IUploadInspectionFormDto {
    formFile: File | null;
}

export interface IUpdateInspectionFormStatusDto extends Pick<InspectionForm, 'id' | 'inspectLocation' | 'resultCode'> {
    materialInspectResults: Array<Pick<MaterialInspectResult, 'id' | 'inspectionPassQuantity' | 'note' | 'inspectionFailQuantity'>>;
}

const baseUrl = '/InspectionForm';

export const inspectionFormApi = {
    getAll: async () => {
        const { data } = await http.get<InspectionForm[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<InspectionForm>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateInspectionFormDto) => {
        const { data } = await http.post<InspectionForm>(baseUrl, dto);

        return data;
    },
    update: async (dto: IUpdateInspectionFormDto) => {
        const { data } = await http.put<InspectionForm>(baseUrl, dto);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete<boolean>(`${baseUrl}/${id}`);

        return data;
    },

    upload: async (dto: IUploadInspectionFormDto) => {
        const formData = new FormData();
        if (dto.formFile) formData.append('formFile', dto.formFile);

        const { data } = await http.post<WarehouseForm>(`${baseUrl}/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },
    updateInspectionFormStatus: async (dto: IUpdateInspectionFormStatusDto) => {
        const { data } = await http.put<any>(`${baseUrl}/inspection-form-status`, dto);

        return data;
    },
    fromRequest: async (id: number) => {
        const { data } = await http.post<InspectionForm>(`${baseUrl}/from-request/${id}`);
        return data;
    },
};
