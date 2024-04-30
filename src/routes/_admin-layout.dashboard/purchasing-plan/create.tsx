import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Table } from 'antd';
import joi from 'joi';
import _ from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { productApi } from '@/core/api/product.api';
import { productionPlanApi } from '@/core/api/production-plan.api';
import { ICreatePurchasingPlanDto, purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { warehouseMaterialApi } from '@/core/api/warehouse-material.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { ExpectedMaterial } from '@/core/models/expectedMaterial';
import { ProductInPlan } from '@/core/models/productInPlan';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    const router = useNKRouter();
    const [currentProductionPlanId, setCurrentProductionPlanId] = useState<number | null>(null);

    const allWarehouseQuantityQuery = useQuery({
        queryKey: ['warehouse-quantity'],
        queryFn: async () => {
            return await warehouseMaterialApi.getAllWarehouseMaterialByWarehouseId(2);
        },
        initialData: [],
    });

    const allProductionPlan = useQuery({
        queryKey: ['production-plan'],
        queryFn: async () => {
            return await productionPlanApi.getAll();
        },
        initialData: [],
    });

    const currentProductionPlan = useQuery({
        queryKey: ['current-production-plan', currentProductionPlanId],
        queryFn: async () => {
            const res = await productionPlanApi._getNotPurchasingPlanYet();

            return res.find((item) => Number(item.id) === Number(currentProductionPlanId));
        },
        enabled: Boolean(currentProductionPlanId),
    });

    useDocumentTitle('Create Purchasing Plan');

    return (
        <div className="fade-in flex w-full gap-4">
            <div className=" flex flex-1 flex-col ">
                <FormBuilder<ICreatePurchasingPlanDto>
                    title="Create Purchasing Plan"
                    apiAction={(value) => {
                        return purchasingPlanApi.create(value);
                    }}
                    onExtraSuccessAction={() => {
                        toast.success('Create purchasing plan successfully');
                        router.push(NKRouter.purchasingPlan.list());
                    }}
                    onExtraErrorAction={(error: any) => {
                        const message = _.get(error, 'data.message') || 'Create purchasing plan failed';
                        toast.error(message);
                    }}
                    defaultValues={{
                        endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
                        note: '',
                        productionPlanId: 0,
                        purchaseTasks: [],
                        startDate: moment().format('YYYY-MM-DD'),
                        title: '',
                    }}
                    fields={[
                        {
                            type: NKFormType.TEXT,
                            name: 'title',
                            label: 'Title',
                        },
                        {
                            type: NKFormType.SELECT_API_OPTION,
                            name: 'productionPlanId',
                            label: 'Production Plan',

                            fieldProps: {
                                apiAction: productionPlanApi.getNotPurchasingPlanYet,
                            },
                            onChangeExtra(value, path, formMethods) {
                                const productionPlan = allProductionPlan.data.find((item) => Number(item.id) === Number(value));
                                if (!productionPlan) {
                                    return;
                                }
                                const mapRawMaterial = productionPlan?.expectedMaterials.map((task) => {
                                    return {
                                        rawMaterialId: task.rawMaterialId,
                                        quantity: task.requireQuantity,
                                    };
                                });
                                formMethods.setValue('purchaseTasks', mapRawMaterial);
                                setCurrentProductionPlanId(productionPlan.id);
                            },
                        },
                        {
                            type: NKFormType.DATE,
                            name: 'startDate',
                            label: 'Start Date',
                        },
                        {
                            type: NKFormType.DATE,
                            name: 'endDate',
                            label: 'End Date',
                        },
                        {
                            type: NKFormType.TEXTAREA,
                            name: 'note',
                            label: 'Note',
                        },
                        {
                            type: NKFormType.ARRAY,
                            name: 'purchaseTasks',
                            label: 'Purchase Tasks',
                            fieldProps: {
                                defaultValues: {
                                    rawMaterialId: null,
                                    quantity: 1,
                                },
                                fields: [
                                    {
                                        type: NKFormType.SELECT_API_OPTION,
                                        name: 'rawMaterialId',
                                        label: 'Raw Material',
                                        span: 4,

                                        fieldProps: {
                                            apiAction: async (data, formMethods: any, isDefault) => {
                                                const currentValues = formMethods.getValues() as ICreatePurchasingPlanDto;
                                                const options = await rawMaterialApi.getEnumSelectOptionWithCode();

                                                if (!isDefault) {
                                                    return options;
                                                }

                                                return options.filter((option) => {
                                                    return !currentValues.purchaseTasks.some((task) => task.rawMaterialId === option.value);
                                                });
                                            },
                                        },
                                    },
                                    {
                                        type: NKFormType.NUMBER,
                                        name: 'quantity',
                                        label: 'Quantity',
                                        span: 4,
                                    },
                                ],
                            },
                        },
                    ]}
                    schema={{
                        title: joi.string().required(),
                        startDate: joi.date().required(),
                        endDate: joi.date().required(),
                        note: joi.string().allow('').required(),
                        productionPlanId: joi.number().required(),
                        purchaseTasks: joi
                            .array()
                            .items(
                                joi.object({
                                    rawMaterialId: joi.number().required(),
                                    quantity: joi.number().greater(0).required(),
                                }),
                            )
                            .required(),
                    }}
                />
            </div>
            <div className="flex-1">
                {Boolean(currentProductionPlan.data) && (
                    <>
                        <div className="fade-in flex w-full flex-col gap-4">
                            <FieldBuilder
                                fields={[
                                    {
                                        title: 'Id',
                                        key: 'id',
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
                                record={currentProductionPlan.data}
                                title="Production Plan"
                            />

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
                                            title: 'Require Quantity',
                                            key: 'requireQuantity',
                                            render: (record: ExpectedMaterial) => (
                                                <FieldDisplay value={record.requireQuantity} type={FieldType.NUMBER} />
                                            ),
                                        },
                                        {
                                            title: 'Warehouse Quantity',
                                            key: '',
                                            render: (record: ExpectedMaterial) => {
                                                const warehouseQuantity = allWarehouseQuantityQuery.data.find(({ rawMaterialId }) => {
                                                    return rawMaterialId === record.rawMaterialId;
                                                });

                                                return <FieldDisplay value={warehouseQuantity?.quantity} type={FieldType.NUMBER} />;
                                            },
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
                                    dataSource={currentProductionPlan?.data?.expectedMaterials}
                                />
                            </div>
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
                                                console.log(record);
                                                return <FieldDisplay value={record.product?.code} type={FieldType.TEXT} />;
                                            },
                                        },
                                        {
                                            title: 'Quantity',
                                            key: 'requireQuantity',
                                            render: (record: ProductInPlan) => <FieldDisplay value={record.quantity} type={FieldType.NUMBER} />,
                                        },
                                        {
                                            title: 'Material Category',
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
                                            title: 'Unit',
                                            key: 'unit',
                                            render: (record: ProductInPlan) => (
                                                <FieldDisplay
                                                    value={record.product?.unit}
                                                    type={FieldType.BADGE_API}
                                                    apiAction={productApi.getProductUnit}
                                                />
                                            ),
                                        },
                                    ]}
                                    dataSource={currentProductionPlan?.data?.productInPlans}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-plan/create')({
    component: Page,
});
