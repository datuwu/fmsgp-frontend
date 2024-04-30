import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Table } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { productionPlanApi } from '@/core/api/production-plan.api';
import { IUpdatePurchasingOrderDto, purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { PurchaseTask } from '@/core/models/purchaseTask';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
//
const Page = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const [selectedPurchasingPlanId, setSelectedPurchasingPlanId] = React.useState<number>(0);
    const [supplierId, setSupplierId] = React.useState<number>(0);

    const selectedProductionPlan = useQuery({
        queryKey: ['purchasing', selectedPurchasingPlanId],
        queryFn: async () => {
            return await purchasingPlanApi.getById(selectedPurchasingPlanId);
        },
        enabled: selectedPurchasingPlanId > 0,
    });

    const query = useQuery({
        queryKey: ['purchasing-order', id],
        queryFn: async () => {
            return await purchasingOrderApi.getById(Number(id));
        },
    });

    React.useEffect(() => {
        if (query.data) {
            setSelectedPurchasingPlanId(query.data.purchasingPlanId);
            setSupplierId(query.data.supplierId);
        }
    }, [query.data]);

    const suppliers = useQuery({
        queryKey: ['suppliers'],
        queryFn: userApi.getSuppliers,
        initialData: [],
    });

    const rawMaterialOptions = useQuery({
        queryKey: ['raw-material', 'enum-select-option'],
        queryFn: async () => {
            return await rawMaterialApi.getEnumSelectOptionWithoutUnit();
        },
        initialData: [],
    });

    useDocumentTitle('Edit Purchasing Order');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in  flex w-full gap-4">
            <div className=" flex  flex-1 flex-col gap-2">
                <FormBuilder<IUpdatePurchasingOrderDto>
                    title="Update Purchasing Order"
                    apiAction={purchasingOrderApi.update}
                    onExtraSuccessAction={() => {
                        toast.success('Update purchasing order successfully');
                        router.push(NKRouter.purchasingOrder.detail(Number(id)));
                    }}
                    onExtraErrorAction={(error: any) => {
                        const message = _get(error, 'data.message') || 'Update purchasing order failed';
                        toast.error(message);
                    }}
                    defaultValues={{
                        id: _get(query, 'data.id', 0),
                        supplierId: _get(query, 'data.supplierId', 0),
                        name: _get(query, 'data.name', ''),

                        supplierName: _get(query, 'data.supplierName', ''),
                        supplierCompanyName: _get(query, 'data.supplierCompanyName', ''),
                        supplierTaxCode: _get(query, 'data.supplierTaxCode', ''),
                        supplierAddress: _get(query, 'data.supplierAddress', ''),
                        suppplierEmail: _get(query, 'data.suppplierEmail', ''),
                        supplierPhone: _get(query, 'data.supplierPhone', ''),
                        receiverCompanyAddress: _get(query, 'data.receiverCompanyAddress', ''),
                        receiverCompanyEmail: _get(query, 'data.receiverCompanyEmail', ''),
                        receiverCompanyPhone: _get(query, 'data.receiverCompanyPhone', ''),
                        note: _get(query, 'data.note', ''),
                    }}
                    isDebug
                    fields={[
                        {
                            type: NKFormType.TEXT,
                            name: 'name',
                            label: 'Name',
                            span: 4,
                        },

                        {
                            type: NKFormType.SELECT_API_OPTION,
                            name: 'supplierId',
                            label: 'Supplier',
                            span: 4,
                            onChangeExtra: async (value, name, formMethods) => {
                                const supplier = suppliers.data.find((supplier) => String(supplier?.supplier?.id) === String(value));

                                if (!supplier) {
                                    return;
                                }

                                setSupplierId(supplier?.supplier?.id);

                                formMethods.setValue('supplierName', supplier?.fullName || '');
                                formMethods.setValue('supplierCompanyName', supplier?.supplier?.companyName || '');
                                formMethods.setValue('supplierTaxCode', supplier?.supplier?.companyTaxCode || '');
                                formMethods.setValue('supplierAddress', supplier?.supplier?.companyAddress || '');
                                formMethods.setValue('suppplierEmail', supplier?.supplier?.companyEmail || '');
                                formMethods.setValue('supplierPhone', supplier?.supplier?.companyPhone || '');
                            },
                            fieldProps: {
                                apiAction: async () => {
                                    return suppliers.data.map((supplier) => ({
                                        label: supplier?.fullName,
                                        value: supplier?.supplier?.id,
                                        name: supplier?.fullName,
                                        id: supplier?.supplier?.id,
                                    }));
                                },
                            },
                        },

                        {
                            type: NKFormType.TEXT,
                            name: 'receiverCompanyAddress',
                            label: 'Receiver Company Address',
                            span: 2,
                        },
                        {
                            type: NKFormType.TEXT,
                            name: 'receiverCompanyEmail',
                            label: 'Receiver Company Email',
                            span: 2,
                        },
                        {
                            type: NKFormType.TEXT,
                            name: 'receiverCompanyPhone',
                            label: 'Receiver Company Phone',
                            span: 2,
                        },
                        {
                            type: NKFormType.TEXTAREA,
                            name: 'note',
                            label: 'Note',
                        },
                    ]}
                    schema={{
                        name: joi.string().required(),
                        note: joi.string().allow('').required(),
                        supplierId: joi.number().required(),

                        id: joi.number().required(),

                        receiverCompanyAddress: joi.string().required(),
                        receiverCompanyEmail: joi
                            .string()
                            .email({
                                tlds: { allow: false },
                            })
                            .required(),
                        receiverCompanyPhone: joi.string().required(),

                        supplierAddress: joi.string().allow('').required(),
                        supplierCompanyName: joi.string().allow('').required(),
                        supplierName: joi.string().allow('').required(),
                        supplierPhone: joi.string().allow('').required(),
                        supplierTaxCode: joi.string().allow('').required(),
                        suppplierEmail: joi
                            .string()

                            .allow('')
                            .required(),
                    }}
                />
            </div>
            <div className="fade-in flex w-full flex-1 flex-col gap-4">
                {Boolean(selectedProductionPlan.data) && (
                    <div className="flex flex-col gap-4">
                        <FieldBuilder
                            record={selectedProductionPlan.data}
                            title="Purchasing Plan Detail"
                            fields={[
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
                                    span: 2,
                                },
                                {
                                    key: 'approveStatus',
                                    title: 'Approve Status',
                                    type: FieldType.BADGE_API,
                                    apiAction: purchasingPlanApi.getEnumStatus,
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
                            <div className="text-xl font-semibold">Purchase Tasks</div>
                            <Table
                                dataSource={selectedProductionPlan.data?.purchaseTasks || []}
                                size="small"
                                columns={[
                                    {
                                        title: 'Code',
                                        key: 'rawMaterial',
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
                                        title: 'Quantity',

                                        key: 'quantity',

                                        render: (record: PurchaseTask) => {
                                            return <FieldDisplay value={record.quantity} type={FieldType.TEXT} />;
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
                                ]}
                                pagination={false}
                            />
                        </div>
                    </div>
                )}

                {Boolean(supplierId) && (
                    <>
                        <FieldBuilder
                            title="Supplier Detail"
                            record={suppliers.data.find((supplier) => supplier.supplier.id === supplierId)}
                            fields={[
                                {
                                    key: 'supplier.companyName',
                                    title: 'Full Name',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'supplier.companyTaxCode',
                                    title: 'Tax Code',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'supplier.companyAddress',
                                    title: 'Address',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'supplier.companyEmail',
                                    title: 'Email',
                                    type: FieldType.TEXT,
                                },
                                {
                                    key: 'supplier.companyPhone',
                                    title: 'Phone',
                                    type: FieldType.TEXT,
                                },
                            ]}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-order/$id/edit')({
    component: Page,
});
