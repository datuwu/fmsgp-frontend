import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { deliveryStageApi } from '@/core/api/delivery-stage.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { DeliveryStageStatusEnum } from '@/core/models/deliveryStage';
import { InspectionRequest } from '@/core/models/inspectionRequest';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isPurchasingManager, isAdmin, isManager, isInspector, isPurchasingStaff, isAuth, purchasingStaffId } = useSelector<RootState, UserState>(
        (state) => state.user,
    );

    useDocumentTitle('Inspected Delivery Stage List');

    if (!isAuth) {
        return null;
    }

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="inspected-delivery-stage"
                    title="Inspected Delivery Stage List"
                    columns={[
                        {
                            key: 'stageOrder',
                            title: 'Stage Order',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'purchasingOrder.poCode',
                            title: 'PO Code',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'totalTypeMaterial',
                            title: 'Total Type Material',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'totalPrice',
                            title: 'Total Price',
                            type: FieldType.NUMBER,
                        },

                        {
                            key: 'deliveryDate',
                            title: 'Delivery Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'createdDate',
                            title: 'Created Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'deliveryStatus',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: deliveryStageApi.getEnumDeliveryStageStatus,
                        },
                    ]}
                    actionColumns={[
                        {
                            label: (record: InspectionRequest) => (
                                <div className="flex flex-col">
                                    <Button type="link" onClick={() => router.push(NKRouter.inspectedDeliveryStage.detail(record.id))}>
                                        Detail
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    queryApi={async () => {
                        const data = await deliveryStageApi.getAll();

                        const FILTER = [
                            DeliveryStageStatusEnum.INSPECTED,
                            DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTED,
                            DeliveryStageStatusEnum.MAINWAREHOUSEIMPORTED,
                        ];

                        return data.filter((x) => FILTER.includes(x.deliveryStatus));
                    }}
                />
            </div>
        </div>
    );
};


export const Route = createFileRoute('/_admin-layout/dashboard/inspected-delivery-stage/')({
    component: Page,
});
