import React, { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Table, Tabs } from 'antd';
import moment from 'moment';
import ApexCharts from 'react-apexcharts';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { productApi } from '@/core/api/product.api';
import { productionPlanApi } from '@/core/api/production-plan.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { ExpectedMaterial } from '@/core/models/expectedMaterial';
import { ProductInPlan } from '@/core/models/productInPlan';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const { isAdmin, isManager } = useSelector<RootState, UserState>((state: RootState) => state.user);
    const [activePlan, setActivePlan] = React.useState(0);
    const [pendingPlan, setPendingPlan] = React.useState(0);
    const [overduePlan, setOverduePlan] = React.useState(0);

    const [pendingPlanCount, setPendingPlanCount] = React.useState(0);
    const [processedPlanCount, setProcessedPlanCount] = React.useState(0);
    const [finishedPlanCount, setFinishedPlanCount] = React.useState(0);
    const [overduePlanCount, setOverduePlanCount] = React.useState(0);

    const query = useQuery({
        queryKey: ['production-plan', id],
        queryFn: async () => {
            return await productionPlanApi.getById(Number(id));
        },
    });

    const purchasingPlanQuery = useQuery({
        queryKey: ['purchasing-plan', id],
        queryFn: async () => {
            const res = await purchasingPlanApi.getAll();

            return res.filter((item) => item.productionPlanId === Number(id));
        },
        initialData: [],
    });

    useEffect(() => {
        if (!purchasingPlanQuery.data.length) return;

        // today is between purchasing plan startdate and enddate
        const active = purchasingPlanQuery.data.filter((item) => {
            return moment(item.startDate).isBefore(moment()) && moment(item.endDate).isAfter(moment());
        });
        setActivePlan(active.length);

        // purchasing end date is over today
        const overdue = purchasingPlanQuery.data.filter((item: any) => {
            return moment(item.endDate).isBefore(moment());
        });
        setOverduePlan(overdue.length);

        // today is greater than purchasing plan start date
        const pending = purchasingPlanQuery.data.filter((item: any) => {
            return moment(item.startDate).isAfter(moment());
        });
        setPendingPlan(pending.length);
    }, [purchasingPlanQuery.data, query.data]);

    useEffect(() => {
        const pending = purchasingPlanQuery.data?.filter((item: any) => item.processStatus === 0);
        setPendingPlanCount(pending.length);

        const processed = purchasingPlanQuery.data?.filter((item: any) => item.processStatus === 1);
        setProcessedPlanCount(processed.length);

        const finished = purchasingPlanQuery.data?.filter((item: any) => item.processStatus === 2);
        setFinishedPlanCount(finished.length);

        const overdue = purchasingPlanQuery.data?.filter((item: any) => item.processStatus === 4);
        setOverduePlanCount(overdue.length);
    }, [purchasingPlanQuery.data]);

    useDocumentTitle(query.data?.name || 'Production Plan');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <FieldBuilder
                fields={[
                    {
                        title: 'Code',
                        key: 'productionPlanCode',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        type: FieldType.TEXT,
                        span: 2,
                    },
                    {
                        title: 'Plan Start Date',
                        type: FieldType.TIME_DATE,
                        key: 'planStartDate',
                        span: 2,
                    },
                    {
                        title: 'Plan End Date',
                        type: FieldType.TIME_DATE,
                        key: 'planEndDate',
                        span: 2,
                    },
                    {
                        title: 'Note',
                        key: 'note',
                        type: FieldType.MULTILINE_TEXT,
                    },
                ]}
                record={query.data}
                title="Production Plan"
            />
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Detail" key="1">
                    <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4 ">
                        <div className="text-xl font-bold text-black">Product In Plan</div>

                        <Table
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Code',
                                    key: 'code',
                                    render: (record: ProductInPlan) => {
                                        return <FieldDisplay value={record.product.code} type={FieldType.TEXT} />;
                                    },
                                },
                                {
                                    title: 'Product Name',
                                    key: 'materialCategoryId',
                                    render: (record: ProductInPlan) => (
                                        <FieldDisplay
                                            value={record.productId}
                                            type={FieldType.BADGE_API}
                                            apiAction={productApi.getEnumSelectOption}
                                        />
                                    ),
                                },
                                {
                                    title: 'Quantity',
                                    key: 'requireQuantity',
                                    render: (record: ProductInPlan) => <FieldDisplay value={record.quantity} type={FieldType.NUMBER} />,
                                },
                                {
                                    title: 'Unit',
                                    key: 'product.unit',
                                    render: (record) => (
                                        <FieldDisplay value={record.product.unit} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumUnit} />
                                    ),
                                },
                            ]}
                            dataSource={query.data?.productInPlans}
                        />
                    </div>
                    <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4 ">
                        <div className="text-xl font-bold text-black">Expected Materials</div>
                        <Table
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Code',
                                    key: 'code',
                                    render: (record: ExpectedMaterial) => (
                                        <FieldDisplay
                                            value={record.rawMaterialId}
                                            type={FieldType.BADGE_API}
                                            apiAction={rawMaterialApi.getEnumCodeSelectOption}
                                        />
                                    ),
                                },
                                {
                                    title: 'Raw Material',
                                    key: 'rawMaterialId',
                                    render: (record: ExpectedMaterial) => (
                                        <FieldDisplay
                                            value={record.rawMaterialId}
                                            type={FieldType.BADGE_API}
                                            apiAction={rawMaterialApi.getEnumSelectOptionWithoutUnit}
                                        />
                                    ),
                                },

                                {
                                    title: 'Quantity',
                                    key: 'requireQuantity',
                                    render: (record: ExpectedMaterial) => <FieldDisplay value={record.requireQuantity} type={FieldType.NUMBER} />,
                                },
                                {
                                    title: 'Unit',
                                    key: 'rawMaterialId',
                                    render: (record: ExpectedMaterial) => (
                                        <FieldDisplay
                                            value={record.rawMaterialId}
                                            type={FieldType.BADGE_API}
                                            apiAction={rawMaterialApi.getEnumUnitWithMaterialId}
                                        />
                                    ),
                                },
                            ]}
                            dataSource={query.data?.expectedMaterials}
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Purchasing Plan" key="2">
                    <div className="flex justify-center gap-8">
                        <ApexCharts
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
                        />
                        <ApexCharts
                            type="pie"
                            height={350}
                            width={350}
                            series={[pendingPlanCount, processedPlanCount, finishedPlanCount, overduePlanCount]}
                            options={{
                                title: {
                                    text: 'Purchasing Plan base on status',
                                },
                                colors: ['#FEB019', '#546E7A', '#00E396', '#775DD0'],
                                labels: ['Pending Plan', 'Processing Plan', 'Finished Plan', 'Overdue Plan'],
                            }}
                        />
                    </div>
                    <Table
                        dataSource={purchasingPlanQuery.data}
                        columns={[
                            {
                                key: 'planCode',
                                title: 'Code',

                                render: (record) => {
                                    return <FieldDisplay value={record.planCode} type={FieldType.TEXT} />;
                                },
                            },

                            {
                                key: 'title',
                                title: 'Title',
                                render: (record) => {
                                    return (
                                        <FieldDisplay
                                            value={record}
                                            type={FieldType.LINK}
                                            apiAction={async (value: any) => {
                                                return {
                                                    link: NKRouter.purchasingPlan.detail(record.id),
                                                    label: value.title,
                                                };
                                            }}
                                        />
                                    );
                                },
                            },
                            {
                                key: 'productionPlanId',
                                title: 'Production Plan',

                                render: (record) => {
                                    return (
                                        <FieldDisplay
                                            value={record.productionPlanId}
                                            type={FieldType.LINK}
                                            apiAction={async (value: number) => {
                                                const data = await productionPlanApi.getById(value);
                                                return {
                                                    link: '',
                                                    label: data.name,
                                                };
                                            }}
                                        />
                                    );
                                },
                            },

                            {
                                key: 'processStatus',
                                title: 'Process Status',

                                render: (record) => {
                                    return (
                                        <FieldDisplay
                                            value={record.processStatus}
                                            type={FieldType.BADGE_API}
                                            apiAction={purchasingPlanApi.getEnumProcessingStatus}
                                        />
                                    );
                                },
                            },
                            {
                                key: 'approveStatus',
                                title: 'Approve Status',

                                render: (record) => {
                                    return (
                                        <FieldDisplay
                                            value={record.approveStatus}
                                            type={FieldType.BADGE_API}
                                            apiAction={purchasingPlanApi.getEnumStatus}
                                        />
                                    );
                                },
                            },

                            {
                                key: 'startDate',
                                title: 'Start Date',

                                render: (record) => {
                                    return <FieldDisplay value={record.startDate} type={FieldType.TIME_DATE} />;
                                },
                            },
                            {
                                key: 'endDate',
                                title: 'End Date',

                                render: (record) => {
                                    return <FieldDisplay value={record.endDate} type={FieldType.TIME_DATE} />;
                                },
                            },
                        ]}
                        size="small"
                        pagination={false}
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/production-plan/$id/')({
    component: Page,
});
