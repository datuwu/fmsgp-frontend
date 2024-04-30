import React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { productionPlanApi } from '@/core/api/production-plan.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { PurchasingPlan } from '@/core/models/purchasingPlan';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { id, isPurchasingManager, purchasingManagerId } = useSelector<RootState, UserState>((state: RootState) => state.user);

    useDocumentTitle('Purchasing Plan List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey={'purchasing-plan'}
                    title="Purchasing Plan List"
                    extraButtons={
                        <>
                            {isPurchasingManager && (
                                <div className="flex items-center gap-4">
                                    <NKLink href={NKRouter.purchasingPlan.create()}>
                                        <Button type="primary" icon={<PlusOutlined />}>
                                            Create Purchasing Plan
                                        </Button>
                                    </NKLink>
                                </div>
                            )}
                        </>
                    }
                    columns={[
                        {
                            key: 'planCode',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'title',
                            title: 'Title',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'productionPlanId',
                            title: 'Production Plan',
                            type: FieldType.LINK,
                            apiAction: async (value: number) => {
                                const data = await productionPlanApi.getById(value);
                                return {
                                    link: NKRouter.productionPlan.detail(data.id),
                                    label: data.name,
                                };
                            },
                        },

                        {
                            key: 'processStatus',
                            title: 'Process Status',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingPlanApi.getEnumProcessingStatus,
                        },
                        {
                            key: 'approveStatus',
                            title: 'Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingPlanApi.getEnumStatus,
                        },

                        {
                            key: 'startDate',
                            title: 'Start Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'endDate',
                            title: 'End Date',
                            type: FieldType.TIME_DATE,
                        },
                    ]}
                    queryApi={async () => {
                        const res = await purchasingPlanApi.getAll();

                        if (isPurchasingManager) {
                            return res.filter((x) => x.purchasingManagerId === purchasingManagerId);
                        }

                        return res;
                    }}
                    defaultOrderBy="createdDate"
                    actionColumns={[
                        {
                            label: (record: PurchasingPlan) => (
                                <div>
                                    <NKLink href={NKRouter.purchasingPlan.detail(record.id)}>
                                        <Button type="link">View Detail</Button>
                                    </NKLink>
                                </div>
                            ),
                        },
                    ]}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Code',
                            comparator: FilterComparator.LIKE,
                            name: 'planCode',
                            type: NKFormType.TEXT,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-plan/')({
    component: Page,
});
