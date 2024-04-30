import moment from 'moment';
import { cancel } from 'redux-saga/effects';

import { getColorWithUuId } from '@/core/utils/api.helper';

import { EnumListItem } from '../models/common';
import { DeliveryStage, DeliveryStageStatusEnum } from '../models/deliveryStage';
import { PurchaseMaterial } from '../models/purchaseMaterial';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface PurchaseMaterialItem {
    materialName: string;

    totalQuantity: number;
    rawMaterialId: number;
}

export interface ICreateDeliveryStageDto {
    items: {
        deliveryDate: string;
        stageOrder: number;
        purchaseMaterials: PurchaseMaterialItem[];
    }[];
}
export interface IUpdateDeliveryStageDto {
    items: {
        id: number;
        status: number;
        deliveryDate: string;
        stageOrder: number;
        purchaseMaterials: PurchaseMaterial;
    }[];
}

export interface IDeliveryStageQuantityDto {
    id: number;
    purchaseMaterials: { id: number; deliveredQuantity: number; name: string }[];
}

export interface IStartDeliveringSupplementalDto {
    deliveryStageId: number;
    deliveryDate: string;
}

const baseUrl = '/DeliveryStage';

export const deliveryStageApi = {
    getAll: async () => {
        const { data } = await http.get<DeliveryStage[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<DeliveryStage>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (id: number, dto: ICreateDeliveryStageDto) => {
        const { data } = await http.post<DeliveryStage>(`${baseUrl}/purchasing-order/${id}`, dto.items);

        return data;
    },
    update: async (id: string, dto: IUpdateDeliveryStageDto) => {
        const { data } = await http.put<DeliveryStage>(`${baseUrl}/purchasing-order/${id}`, dto.items);

        return data;
    },
    updateStatus: async (id: number, status: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/status/${status}`);

        return data;
    },

    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumDeliveryStageStatus: async (search: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.YELLOW,
                id: DeliveryStageStatusEnum.PENDING,
                label: 'Pending',
                name: 'Pending',
                slug: DeliveryStageStatusEnum.PENDING.toString(),
                value: DeliveryStageStatusEnum.PENDING,
            },
            {
                color: Colors.ORANGE,
                id: DeliveryStageStatusEnum.APPROVED,
                label: 'Approved',
                name: 'Approved',
                slug: DeliveryStageStatusEnum.APPROVED.toString(),
                value: DeliveryStageStatusEnum.APPROVED,
            },
            {
                id: DeliveryStageStatusEnum.DELIVERING,
                label: 'Delivering',
                name: 'Delivering',
                slug: DeliveryStageStatusEnum.DELIVERING.toString(),
                value: DeliveryStageStatusEnum.DELIVERING,
                color: Colors.BLUE,
            },
            {
                id: DeliveryStageStatusEnum.DELIVERED,
                label: 'Delivered',
                name: 'Delivered',
                slug: DeliveryStageStatusEnum.DELIVERED.toString(),
                value: DeliveryStageStatusEnum.DELIVERED,
                color: Colors.GREEN,
            },
            {
                id: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTPENDING,
                label: 'Temp Warehouse Import Pending',
                name: 'Temp Warehouse Import Pending',
                slug: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTPENDING.toString(),
                value: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTPENDING,
                color: Colors.YELLOW,
            },
            {
                id: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTAPPROVED,
                label: 'Temp Warehouse Import Approved',
                name: 'Temp Warehouse Import Approved',
                slug: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTAPPROVED.toString(),
                value: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTAPPROVED,
                color: Colors.ORANGE,
            },
            {
                id: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTED,
                label: 'Temp Warehouse Imported',
                name: 'Temp Warehouse Imported',
                slug: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTED.toString(),
                value: DeliveryStageStatusEnum.TEMPWAREHOUSEIMPORTED,
                color: Colors.GREEN,
            },
            {
                id: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTPENDING,
                label: 'Temp Warehouse Export Pending',
                name: 'Temp Warehouse Export Pending',
                slug: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTPENDING.toString(),
                value: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTPENDING,
                color: Colors.YELLOW,
            },
            {
                id: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTAPPROVED,
                label: 'Temp Warehouse Export Approved',
                name: 'Temp Warehouse Export Approved',
                slug: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTAPPROVED.toString(),
                value: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTAPPROVED,
                color: Colors.ORANGE,
            },
            {
                id: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTED,
                label: 'Temp Warehouse Exported',
                name: 'Temp Warehouse Exported',
                slug: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTED.toString(),
                value: DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTED,
                color: Colors.GREEN,
            },
            {
                id: DeliveryStageStatusEnum.PENDINGFORINSPECTION,
                label: 'Pending For Inspection',
                name: 'Pending For Inspection',
                slug: DeliveryStageStatusEnum.PENDINGFORINSPECTION.toString(),
                value: DeliveryStageStatusEnum.PENDINGFORINSPECTION,
                color: Colors.YELLOW,
            },
            {
                id: DeliveryStageStatusEnum.INSPECTIONREQUESTAPPROVED,
                label: 'Inspection Request Approved',
                name: 'Inspection Request Approved',
                slug: DeliveryStageStatusEnum.INSPECTIONREQUESTAPPROVED.toString(),
                value: DeliveryStageStatusEnum.INSPECTIONREQUESTAPPROVED,
                color: Colors.ORANGE,
            },
            {
                id: DeliveryStageStatusEnum.INSPECTED,
                label: 'Inspected',
                name: 'Inspected',
                slug: DeliveryStageStatusEnum.INSPECTED.toString(),
                value: DeliveryStageStatusEnum.INSPECTED,
                color: Colors.GREEN,
            },
            {
                id: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTPENDING,
                label: 'Main Warehouse Import Pending',
                name: 'Main Warehouse Import Pending',
                slug: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTPENDING.toString(),
                value: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTPENDING,
                color: Colors.YELLOW,
            },
            {
                id: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTAPPROVED,
                label: 'Main Warehouse Import Approved',
                name: 'Main Warehouse Import Approved',
                slug: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTAPPROVED.toString(),
                value: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTAPPROVED,
                color: Colors.ORANGE,
            },
            {
                id: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTED,
                label: 'Main Warehouse Imported',
                name: 'Main Warehouse Imported',
                slug: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTED.toString(),
                value: DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTED,
                color: Colors.GREEN,
            },

            {
                id: DeliveryStageStatusEnum.SupInactive,
                label: 'Supplemental Inactive',
                name: 'Supplemental Inactive',
                slug: DeliveryStageStatusEnum.SupInactive.toString(),
                value: DeliveryStageStatusEnum.SupInactive,
                color: Colors.RED,
            },
            {
                id: DeliveryStageStatusEnum.DeliveryCanceled,
                label: 'Delivery Canceled',
                name: 'Delivery Canceled',
                slug: DeliveryStageStatusEnum.DeliveryCanceled.toString(),
                value: DeliveryStageStatusEnum.DeliveryCanceled,
                color: Colors.RED,
            },
        ];

        const result = list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

        return result;
    },
    updateQuantity: async (dto: IDeliveryStageQuantityDto) => {
        const { data } = await http.put(`${baseUrl}/quantity`, dto);

        return data;
    },
    cancel: async (id: number) => {
        const { data } = await http.post(`${baseUrl}/cancel/${id}`);

        return data;
    },

    startDeliveringSupplemental: async (dto: IStartDeliveringSupplementalDto) => {
        const { data } = await http.post(`${baseUrl}/start-delivering-supplemental`, dto);

        return data;
    },

    getEnumSelectOption: async (search: string, purchasingPlanId: number) => {
        const { data } = await http.get<DeliveryStage[]>(baseUrl);
        const status = await deliveryStageApi.getEnumDeliveryStageStatus(search);

        const result: EnumListItem[] = data
            .filter(
                (item) => Number(item.purchasingOrderId) === Number(purchasingPlanId) && item.deliveryStatus !== DeliveryStageStatusEnum.SupInactive,
            )
            .map((item) => {
                const currentStatus = status.find((s) => s.value === item.deliveryStatus);

                return {
                    id: item.id,
                    label: `${item.stageOrder} - ${moment(item.deliveryDate).format('DD/MM/YYYY')} - ${currentStatus?.label}`,
                    color: getColorWithUuId(item.id.toString()),
                    name: `${item.stageOrder} - ${moment(item.deliveryDate).format('DD/MM/YYYY')} - ${currentStatus?.label}`,
                    slug: item.id.toString(),
                    value: item.id,
                };
            })
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

        return result;
    },
    getInspected: async (id: number) => {
        const { data } = await http.get<DeliveryStage>(`${baseUrl}/inspected/${id}`);

        return data;
    },
};
