import React, { useEffect } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _ from 'lodash';
import moment from 'moment';
import ApexCharts from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { IAssignPurchasingTaskDto, purchasingTaskApi } from '@/core/api/purchasing-task.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { PurchasingOrderStatus } from '@/core/models/purchasingOrder';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();

    const { isPurchasingManager, isAdmin, isManager } = useSelector<RootState, UserState>((state: RootState) => state.user);
    const [selectPurchasingStaffId, setSelectPurchasingStaffId] = React.useState<number | undefined>(undefined);
    const [pendingCount, setPendingCount] = React.useState<number>(0);
    const [processingCount, setProcessingCount] = React.useState<number>(0);
    const [finishedCount, setFinishedCount] = React.useState<number>(0);

    const query = useQuery({
        queryKey: ['purchasing-task', id],
        queryFn: async () => {
            return await purchasingTaskApi.getById(Number(id));
        },
    });

    const purchasingPlan = useQuery({
        queryKey: ['purchasing-plan', id],
        queryFn: async () => {
            return await purchasingOrderApi.getPurchasingTaskByPurchasingOrderId(Number(id));
        },
    });

    useEffect(() => {
        if (purchasingPlan.data) {
            setPendingCount(purchasingPlan.data.filter((task) => task.orderStatus === PurchasingOrderStatus.PENDING).length);
            setProcessingCount(purchasingPlan.data.filter((task) => task.orderStatus === PurchasingOrderStatus.PROCESSING).length);
            setFinishedCount(purchasingPlan.data.filter((task) => task.orderStatus === PurchasingOrderStatus.FINISHED).length);
        }
    }, [purchasingPlan.data]);

    useEffect(() => {
        if (query.data) {
            setSelectPurchasingStaffId(query.data.purchasingStaffId);
        }
    }, [query.data]);

    const purchasingStaff = useQuery({
        queryKey: ['purchasing-staff'],
        queryFn: async () => {
            return await userApi.getByRole(3);
        },
        initialData: [],
    });

    const selectedPurchasingStaff = useQuery({
        queryKey: ['selected-purchasing-staff', selectPurchasingStaffId],
        queryFn: async () => {
            return await userApi.getPurchasingStaff(selectPurchasingStaffId as any);
        },
        enabled: !!selectPurchasingStaffId,
    });

    useDocumentTitle('Purchasing Task');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col  gap-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <FieldBuilder
                        record={query.data}
                        title="Purchasing Task"
                        extra={
                            <>
                                {isPurchasingManager && !query.data?.purchasingStaffId && (
                                    <ModalBuilder
                                        btnLabel="Assign Task"
                                        btnProps={{
                                            type: 'primary',
                                            icon: <PlusOutlined />,
                                        }}
                                        width="400px"
                                    >
                                        {(closeChildren) => {
                                            return (
                                                <FormBuilder<IAssignPurchasingTaskDto>
                                                    apiAction={purchasingTaskApi.assign}
                                                    defaultValues={{
                                                        id: Number(id),
                                                        taskEndDate: moment().format('YYYY-MM-DD'),
                                                        taskStartDate: moment().format('YYYY-MM-DD'),
                                                        purchasingStaffId: 0,
                                                    }}
                                                    fields={[
                                                        {
                                                            name: 'taskStartDate',
                                                            label: 'Task Start Date',
                                                            type: NKFormType.DATE,
                                                        },
                                                        {
                                                            name: 'taskEndDate',
                                                            label: 'Task End Date',
                                                            type: NKFormType.DATE,
                                                        },
                                                        {
                                                            name: 'purchasingStaffId',
                                                            label: 'Purchasing Staff',
                                                            type: NKFormType.SELECT_API_OPTION,
                                                            fieldProps: {
                                                                apiAction: async (search) => {
                                                                    return purchasingStaff.data
                                                                        .map((staff) => ({
                                                                            label: `${staff.staffCode} - ${staff.fullName}`,
                                                                            name: `${staff.staffCode} - ${staff.fullName}`,
                                                                            value: staff.purchasingStaffId,
                                                                            id: staff.purchasingStaffId,
                                                                            slug: staff.purchasingStaffId,
                                                                            color: 'blue',
                                                                        }))
                                                                        .filter((staff) => staff.label.toLowerCase().includes(search.toLowerCase()));
                                                                },
                                                            },
                                                        },
                                                    ]}
                                                    onExtraSuccessAction={() => {
                                                        toast.success('Task assigned successfully!');
                                                        query.refetch();
                                                        closeChildren();
                                                    }}
                                                    onExtraErrorAction={(error: any) => {
                                                        const message = _.get(error, 'data.message') || 'Failed to assign task';
                                                        toast.error(message);
                                                    }}
                                                    schema={{
                                                        taskStartDate: joi.string().required(),
                                                        taskEndDate: joi.string().required(),
                                                        id: joi.number().required(),
                                                        purchasingStaffId: joi.number().required(),
                                                    }}
                                                    title="Assign Task"
                                                />
                                            );
                                        }}
                                    </ModalBuilder>
                                )}
                            </>
                        }
                        fields={[
                            {
                                key: 'id',
                                title: 'ID',
                                type: FieldType.TEXT,
                            },
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
                                            label: 'Unknown',
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
                                span: 2,
                            },
                            {
                                key: 'remainedQuantity',
                                title: 'Remained Quantity',
                                type: FieldType.NUMBER,
                                span: 2,
                            },
                            {
                                key: 'processedQuantity',
                                title: 'Processed Quantity',
                                type: FieldType.NUMBER,
                                span: 2,
                            },
                            {
                                key: 'finishedQuantity',
                                title: 'Finished Quantity',
                                type: FieldType.NUMBER,
                                span: 2,
                            },
                            {
                                title: 'Unit',
                                key: 'rawMaterialId',
                                type: FieldType.BADGE_API,
                                apiAction: rawMaterialApi.getEnumUnitWithMaterialId,
                            },
                            {
                                key: 'finishedDate',
                                title: 'Finished Date',
                                type: FieldType.TIME_DATE,
                                span: 2,
                            },

                            {
                                key: 'taskStatus',
                                title: 'Task Status',
                                type: FieldType.BADGE_API,
                                apiAction: purchasingTaskApi.getEnumStatus,
                                span: 2,
                            },
                        ]}
                    />
                </div>
                {Boolean(selectedPurchasingStaff.data) && (
                    <div className="flex-1">
                        <FieldBuilder
                            record={selectedPurchasingStaff.data}
                            title="Purchasing Staff"
                            fields={[
                                {
                                    key: 'staffCode',
                                    title: 'Staff Code',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'fullName',
                                    title: 'Full Name',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'email',
                                    title: 'Email',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'phoneNumber',
                                    title: 'Phone Number',
                                    type: FieldType.TEXT,
                                },
                            ]}
                        />
                    </div>
                )}
            </div>
            <div className="flex gap-8">
                <ApexCharts
                    type="pie"
                    height={400}
                    width={400}
                    series={[query.data?.finishedQuantity ?? 0, query.data?.remainedQuantity ?? 0, query.data?.processedQuantity ?? 0]}
                    options={{
                        title: {
                            text: 'Purchasing Task Progress',
                        },
                        colors: ['#FEB019', '#00E396', '#775DD0'],
                        labels: ['Finished Quantity', 'Remained Quantity', 'Processed Quantity'],
                    }}
                />

                <ApexCharts
                    type="pie"
                    height={350}
                    width={350}
                    series={[pendingCount, processingCount, finishedCount]}
                    options={{
                        title: {
                            text: 'Purchasing Order Status',
                        },
                        colors: ['#FEB019', '#775DD0', '#00E396'],
                        labels: ['Pending', 'Processing', 'Finished'],
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-task/$id/')({
    component: Page,
});
