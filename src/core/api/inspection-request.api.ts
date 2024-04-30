import { omit } from 'lodash';

import { EnumListItem } from '../models/common';
import { InspectionRequest, InspectionRequestApproveStatus } from '../models/inspectionRequest';
import { Colors } from '../utils/colors.helper';
import http from './http';

const baseUrl = '/InspectionRequest';

export interface IAproveInspectionRequestDto extends Pick<InspectionRequest, 'id' | 'approveStatus' | 'approvedDate'> {
    rejectReason: string;
}

export interface ICreateInspectionRequestDto extends Pick<InspectionRequest, 'title' | 'content' | 'deliveryStageId' | 'requestInspectDate'> {
    purchasingOrderId: number;
}

export const inspectionRequestApi = {
    getAll: async () => {
        const { data } = await http.get<InspectionRequest[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<InspectionRequest>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (dto: ICreateInspectionRequestDto) => {
        const { data } = await http.post<InspectionRequest>(baseUrl, omit(dto, ['purchasingOrderId']));

        return data;
    },
    getEnumStatus: async () => {
        const list: EnumListItem[] = [
            {
                label: 'Pending',
                value: InspectionRequestApproveStatus.PENDING,
                color: Colors.YELLOW,
                id: InspectionRequestApproveStatus.PENDING,
                name: 'Pending',
                slug: 'pending',
            },
            {
                label: 'Inspected',
                value: InspectionRequestApproveStatus.INSPECTED,
                color: Colors.GREEN,
                id: InspectionRequestApproveStatus.INSPECTED,
                name: 'Inspected',
                slug: 'inspected',
            },
            {
                label: 'Rejected',
                value: InspectionRequestApproveStatus.REJECTED,
                color: Colors.RED,
                id: InspectionRequestApproveStatus.REJECTED,
                name: 'Rejected',
                slug: 'rejected',
            },
        ];
        return list;
    },
    approve: async (body: IAproveInspectionRequestDto) => {
        const { data } = await http.put<string>(`${baseUrl}/approve`, body);

        return data;
    },
    fromRequest: async (id: number) => {
        const { data } = await http.post<InspectionRequest>(`${baseUrl}/from-request/${id}`);
        return data;
    },
};
