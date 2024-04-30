import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { purchasingTaskApi } from '@/core/api/purchasing-task.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import NKLink from '@/core/routing/components/NKLink';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { isPurchasingManager, purchasingStaffId, isPurchasingStaff } = useSelector<RootState, UserState>((state: RootState) => state.user);

    // const purchasingStaff = useQuery({
    //     queryKey: ['purchasing-staff'],
    //     queryFn: async () => {
    //         return await userApi.getByRole(3);
    //     },
    //     initialData: [],
    // });

    const rawMaterial = useQuery({
        queryKey: ['raw-material'],
        queryFn: async () => {
            return await rawMaterialApi.getAll();
        },
        initialData: [],
    });

    const purchasingTask = useQuery({
        queryKey: ['purchasing-task'],
        queryFn: async () => {
            return await purchasingTaskApi.getAll();
        },
        initialData: [],
    });

    const purchasingPlan = useQuery({
        queryKey: ['purchasing-plan'],
        queryFn: async () => {
            return await purchasingPlanApi.getAll();
        },
        initialData: [],
    });

    useDocumentTitle('Purchasing Task List');

    if (!purchasingStaff.isFetched || !purchasingTask.isFetched || !purchasingPlan.isFetched) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="purchasing-task"
                    title="Purchasing Task List"
                    columns={[
                        {
                            key: 'purchasingPlanId',
                            title: 'Purchasing Plan',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingPlanApi.getSelect,
                        },
                        {
                            key: 'purchasingStaffId',
                            title: 'Purchasing Staff',
                            type: FieldType.LINK,
                            apiAction: async (value) => {
                                if (!value) {
                                    return {
                                        link: '',
                                        label: 'Not assigned',
                                    };
                                }

                                const user = await userApi.getPurchasingStaff(value);

                                return {
                                    link: '',
                                    label: `${user.staffCode} - ${user.fullName}`,
                                };
                            },
                        },
                        {
                            key: 'rawMaterialId',
                            title: 'Raw Material',
                            type: FieldType.BADGE_API,
                            apiAction: rawMaterialApi.getEnumSelectOption,
                        },
                        {
                            key: 'quantity',
                            title: 'Quantity',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'finishedDate',
                            title: 'Finished Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'taskStartDate',
                            title: 'Task Start Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'taskEndDate',
                            title: 'Task End Date',
                            type: FieldType.TIME_DATE,
                        },

                        {
                            key: 'taskStatus',
                            title: 'Task Status',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingTaskApi.getEnumStatus,
                        },
                    ]}
                    queryApi={async () => {
                        if (isPurchasingStaff) {
                            return purchasingTaskApi.getByPurchasingStaff(purchasingStaffId as any);
                        }

                        return purchasingTaskApi.getAll();
                    }}
                    defaultOrderBy="createdDate"
                    actionColumns={[
                        {
                            label: (record: any) => (
                                <div>
                                    <NKLink href={NKRouter.purchasingTask.detail(record.id)}>
                                        <Button>View Detail</Button>
                                    </NKLink>
                                </div>
                            ),
                        },
                    ]}
                    // filters={[
                    //     {
                    //         label: 'Purchasing Plan',
                    //         comparator: FilterComparator.EQUAL,
                    //         name: 'purchasingPlanId',
                    //         type: NKFormType.SELECT_API_OPTION,
                    //         apiAction: purchasingPlanApi.getSelect,
                    //     },
                    // ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-task/')({
    component: Page,
});
