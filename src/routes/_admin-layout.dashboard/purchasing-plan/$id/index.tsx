import React, { useEffect } from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Table } from 'antd';
import joi from 'joi';
import _ from 'lodash';
import moment from 'moment';
import ApexCharts from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { productionPlanApi } from '@/core/api/production-plan.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { IAssignPurchasingTaskDto, purchasingTaskApi } from '@/core/api/purchasing-task.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { PurchaseTask } from '@/core/models/purchaseTask';
import { PurchasingPlanApproveStatus } from '@/core/models/purchasingPlan';
import { PurchasingTaskStatusEnum } from '@/core/models/purchasingTask';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const { isManager, isPurchasingManager } = useSelector<RootState, UserState>((state) => state.user);

    const query = useQuery({
        queryKey: ['purchasing-plan', id],
        queryFn: async () => {
            return await purchasingPlanApi.getById(Number(id));
        },
    });
    const [hiddenColumns, setHiddenColumns] = React.useState<number[]>([]);

    const purchasingStaff = useQuery({
        queryKey: ['purchasing-staff'],
        queryFn: async () => {
            return await userApi.getByRole(3);
        },
        initialData: [],
    });

    useEffect(() => {
        if (!query.data?.purchaseTasks) return;

        setHiddenColumns(
            query.data.purchaseTasks
                .filter((task) => task.purchasingStaffId && task.taskStatus !== PurchasingPlanApproveStatus.PENDING && !isPurchasingManager)
                .map((task) => task.id),
        );
    }, [query.data?.purchaseTasks]);

    useDocumentTitle(query.data?.title || 'Purchasing Plan Detail');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <FieldBuilder
                record={query.data}
                title="Purchasing Plan Detail"
                extra={[
                    <div className="flex items-center gap-2">
                        {query.data?.approveStatus === PurchasingPlanApproveStatus.PENDING && (
                            <>
                                {isManager && (
                                    <>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return purchasingPlanApi.approve(Number(id), PurchasingPlanApproveStatus.APPROVED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to approve this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Approve purchasing plan successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button icon={<CheckOutlined />} type="primary" className="w-full">
                                                Approve
                                            </Button>
                                        </CTAButton>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return purchasingPlanApi.approve(Number(id), PurchasingPlanApproveStatus.REJECTED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to reject this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Approve purchasing successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button type="primary" icon={<CloseOutlined />} danger className="w-full">
                                                Reject
                                            </Button>
                                        </CTAButton>
                                    </>
                                )}
                                {isPurchasingManager && (
                                    <>
                                        <NKLink href={NKRouter.purchasingPlan.edit(Number(id))}>
                                            <Button icon={<EditOutlined />} className="w-full">
                                                Edit
                                            </Button>
                                        </NKLink>

                                        <CTAButton
                                            ctaApi={async () => {
                                                return purchasingPlanApi.delete(Number(id));
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to delete this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Delete purchasing successfully');
                                                query.refetch();
                                                router.push(NKRouter.purchasingPlan.list());
                                            }}
                                        >
                                            <Button icon={<DeleteOutlined />} danger className="w-full">
                                                Delete
                                            </Button>
                                        </CTAButton>
                                    </>
                                )}
                            </>
                        )}
                    </div>,
                ]}
                fields={[
                    {
                        key: 'planCode',
                        title: 'Code',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'title',
                        title: 'Title',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'startDate',
                        title: 'Start Date',
                        type: FieldType.TIME_DATE,
                        span: 1,
                    },
                    {
                        key: 'endDate',
                        title: 'End Date',
                        type: FieldType.TIME_DATE,
                        span: 1,
                    },
                    {
                        key: 'approveStatus',
                        title: 'Approve Status',
                        type: FieldType.BADGE_API,
                        apiAction: purchasingPlanApi.getEnumStatus,
                        span: 1,
                    },
                    {
                        key: 'processStatus',
                        title: 'Process Status',
                        type: FieldType.BADGE_API,
                        apiAction: purchasingPlanApi.getEnumProcessingStatus,
                        span: 3,
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
                        key: 'note',
                        title: 'Note',
                        type: FieldType.MULTILINE_TEXT,
                    },
                ]}
            />
            <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold">Purchase Tasks</div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs font-semibold">
                            <span>Purchasing Plan Progress</span>
                            <span>
                                {`${(query.data?.purchaseTasks || []).filter((item) => item.taskStatus === PurchasingTaskStatusEnum.FINISHED).length}`}
                                /{`${(query.data?.purchaseTasks || []).length}`}
                            </span>
                        </div>
                        <div className="relative h-4 w-96 rounded-lg bg-gray-300">
                            <div
                                className="absolute h-4 rounded-lg bg-green-500"
                                style={{
                                    width: `${((query.data?.purchaseTasks || []).filter((item) => item.taskStatus === PurchasingTaskStatusEnum.FINISHED).length / (query.data?.purchaseTasks || []).length) * 100}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                <Table
                    dataSource={query.data?.purchaseTasks || []}
                    size="small"
                    rowClassName={(record: PurchaseTask) => {
                        // // finished date less than tomorrow
                        // if (record.taskEndDate && moment(record.taskEndDate).isBefore(moment().add(1, 'day')) && record.taskStatus !== 3) {
                        //     return 'bg-red-100';
                        // }

                        return '';
                    }}
                    columns={[
                        {
                            title: 'Code',
                            key: 'rawMaterialId',
                            render: (record: PurchaseTask) => {
                                return (
                                    <FieldDisplay
                                        value={record.rawMaterialId}
                                        type={FieldType.BADGE_API}
                                        apiAction={rawMaterialApi.getEnumCodeSelectOption}
                                    />
                                );
                            },
                        },
                        {
                            title: 'Raw Material',
                            key: 'rawMaterial',
                            render: (record: PurchaseTask) => {
                                return (
                                    <FieldDisplay
                                        value={record.rawMaterialId}
                                        type={FieldType.BADGE_API}
                                        apiAction={rawMaterialApi.getEnumSelectOption}
                                    />
                                );
                            },
                        },
                        {
                            title: 'Purchasing Staff',

                            key: 'purchasingStaffId',

                            render: (record: PurchaseTask) => {
                                if (!record.purchasingStaffId) return <div>Not assigned</div>;

                                return (
                                    <FieldDisplay
                                        value={record.purchasingStaffId}
                                        type={FieldType.BADGE_API}
                                        apiAction={userApi.getPurchasingStaffEnum}
                                    />
                                );
                            },
                        },
                        {
                            title: 'Quantity',

                            key: 'quantity',

                            render: (record: PurchaseTask) => {
                                return <FieldDisplay value={record.quantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Processed Quantity',

                            key: 'processedQuantity',

                            render: (record: PurchaseTask) => {
                                return <FieldDisplay value={record.processedQuantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Remained Quantity',

                            key: 'remainedQuantity',

                            render: (record: PurchaseTask) => {
                                return <FieldDisplay value={record.remainedQuantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Finished Quantity',

                            key: 'finishedQuantity',

                            render: (record: PurchaseTask) => {
                                return <FieldDisplay value={record.finishedQuantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Unit',
                            key: 'rawMaterialId',
                            render: (record: PurchaseTask) => (
                                <FieldDisplay
                                    value={record.rawMaterialId}
                                    type={FieldType.BADGE_API}
                                    apiAction={rawMaterialApi.getEnumUnitWithMaterialId}
                                />
                            ),
                        },
                        {
                            title: 'Task Status',

                            key: 'taskStatus',

                            render: (record: PurchaseTask) => {
                                return (
                                    <FieldDisplay value={record.taskStatus} type={FieldType.BADGE_API} apiAction={purchasingTaskApi.getEnumStatus} />
                                );
                            },
                        },
                        {
                            title: '',
                            key: '',
                            width: 100,
                            render: (record: PurchaseTask) => {
                                if (record.purchasingStaffId || query.data?.approveStatus === PurchasingPlanApproveStatus.PENDING) return null;
                                return (
                                    <div>
                                        {isPurchasingManager && (
                                            <ModalBuilder
                                                btnLabel="Assign Task"
                                                btnProps={{
                                                    size: 'small',
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
                                                                id: record.id,
                                                                taskEndDate: query.data?.endDate
                                                                    ? moment(query.data?.endDate).format('YYYY-MM-DD')
                                                                    : moment().format('YYYY-MM-DD'),
                                                                taskStartDate: query.data?.startDate
                                                                    ? moment(query.data?.startDate).format('YYYY-MM-DD')
                                                                    : moment().format('YYYY-MM-DD'),
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
                                                                                .filter((staff) =>
                                                                                    staff.label.toLowerCase().includes(search.toLowerCase()),
                                                                                );
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
                                    </div>
                                );
                            },
                            hidden: hiddenColumns.some((col) => {
                                return Boolean(query.data?.purchaseTasks?.find((task) => task.id === col));
                            }),
                        },
                        {
                            key: 'assignDate',
                            title: 'Assign Date',
                            render: (record: PurchaseTask) => {
                                if (!record.purchasingStaffId) return <FieldDisplay type={FieldType.TEXT} value="N/A" />;

                                return <FieldDisplay value={record.assignDate} type={FieldType.TIME_DATE} />;
                            },
                        },
                        {
                            key: 'finishedDate',
                            title: 'Finished Date',
                            render: (record: PurchaseTask) => {
                                if (!record.purchasingStaffId) return <FieldDisplay type={FieldType.TEXT} value="N/A" />;

                                return <FieldDisplay value={record.finishedDate} type={FieldType.TIME_DATE} />;
                            },
                        },
                        {
                            key: 'taskStartDate',
                            title: 'Task Start Date',
                            render: (record: PurchaseTask) => {
                                return <FieldDisplay value={record.taskStartDate} type={FieldType.TIME_DATE} />;
                            },
                        },
                        {
                            key: 'taskEndDate',
                            title: 'Task End Date',
                            render: (record: PurchaseTask) => {
                                return <FieldDisplay value={record.taskEndDate} type={FieldType.TIME_DATE} />;
                            },
                        },
                    ]}
                    pagination={false}
                />
            </div>
            <div className="flex justify-center gap-8">
                {/* <ApexCharts
                    type="pie"
                    height={350}
                    width={350}
                    series={[activePlan, pendingPlan, overduePlan]}
                    options={{
                        title: {
                            text: 'Active Purchasing Plan',
                        },
                        colors: ['#00E396', '#FEB019', '#FF4560'],
                        labels: ['Active Plan', 'Pending Plan', 'Overdue Plan'],
                    }}
                /> */}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-plan/$id/')({
    component: Page,
});
