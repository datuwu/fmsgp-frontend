import React, { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Table } from 'antd';
import joi from 'joi';
import _ from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


import { NKRouter } from '@/core/NKRouter';
import { productionPlanApi } from '@/core/api/production-plan.api';
import { ICreatePurchasingOrderDto, purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { purchasingTaskApi } from '@/core/api/purchasing-task.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { PurchaseTask } from '@/core/models/purchaseTask';
import { PurchasingTaskStatusEnum } from '@/core/models/purchasingTask';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { getRootPath } from '@/core/utils/string.helper';

const Page = () => {
    const router = useNKRouter();
    const [selectedPurchasingPlanId, setSelectedPurchasingPlanId] = React.useState<number>(0);
    const [supplierId, setSupplierId] = React.useState<number>(0);
    const { id } = useSelector<RootState, UserState>((state) => state.user);
    const [currentPurchasingStaffId, setCurrentPurchasingStaffId] = React.useState<number>();

    const userMe = useQuery({
        queryKey: ['me', id],
        queryFn: async () => {
            return await userApi.getById(Number(id));
        },
        enabled: Boolean(id),
    });

    useEffect(() => {
        if (userMe.data) {
            setCurrentPurchasingStaffId(userMe.data.purchasingStaffId);
        }
    }, [userMe.data]);

    const mePurchasingTask = useQuery({
        queryKey: ['me-purchasing-staff', currentPurchasingStaffId],
        queryFn: async () => {
            return await purchasingTaskApi.getByPurchasingStaff(currentPurchasingStaffId as number);
        },
        enabled: Boolean(currentPurchasingStaffId),
        initialData: [],
    });

    const selectedProductionPlan = useQuery({
        queryKey: ['purchasing', selectedPurchasingPlanId],
        queryFn: async () => {
            return await purchasingPlanApi.getById(selectedPurchasingPlanId);
        },
        enabled: selectedPurchasingPlanId > 0,
    });

    const rawMaterialOptions = useQuery({
        queryKey: ['raw-material', 'enum-select-option'],
        queryFn: async () => {
            const res = await rawMaterialApi.getEnumSelectOptionWithCode();

            return res;
        },
        initialData: [],
    });

    const rawMaterialList = useQuery({
        queryKey: ['raw-material', 'list'],
        queryFn: async () => {
            return await rawMaterialApi.getAll();
        },
        initialData: [],
    });

    const suppliers = useQuery({
        queryKey: ['suppliers'],
        queryFn: userApi.getSuppliers,
        initialData: [],
    });

    useDocumentTitle('Create Purchasing Order');

    if (!suppliers.isFetched && !rawMaterialOptions.isFetched && !rawMaterialList.isFetched) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full gap-4">
            <div className=" flex flex-1 flex-col gap-2">
                <FormBuilder<ICreatePurchasingOrderDto>
                    title="Create Purchasing Order"
                    apiAction={purchasingOrderApi.create}
                    onExtraSuccessAction={() => {
                        toast.success('Create purchasing order successfully');
                        router.push(NKRouter.purchasingOrder.list());
                    }}
                    onExtraErrorAction={(error: any) => {
                        const message = _.get(error, 'data.message') || 'Create purchasing plan failed';
                        toast.error(message);
                    }}
                    defaultValues={{
                        name: '',
                        supplierName: '',
                        supplierCompanyName: '',
                        supplierTaxCode: '',
                        supplierAddress: '',
                        suppplierEmail: '',
                        supplierPhone: '',
                        receiverCompanyAddress: '',
                        note: '',
                        purchasingPlanId: 0,
                        orderMaterials: [],
                        deliveryStages: [],
                        receiverCompanyEmail: '',
                        receiverCompanyPhone: '',
                        supplierId: 0,
                    }}
                    fields={[
                        {
                            type: NKFormType.SELECT_API_OPTION,
                            name: 'purchasingPlanId',
                            label: 'Purchasing Plan',
                            fieldProps: {
                                apiAction: purchasingPlanApi.getApproveSelectWithoutOverdueWithCode,
                            },
                            onChangeExtra: async (value, name, formMethods) => {
                                setSelectedPurchasingPlanId(value);

                                const purchasingPlan = await purchasingPlanApi.getById(value);

                                const orderMaterials = purchasingPlan.purchaseTasks
                                    .filter((task) => {
                                        const purchaseTask = mePurchasingTask.data.find((meTask) => meTask.id === task.id);
                                        return Boolean(purchaseTask) && task.taskStatus !== PurchasingTaskStatusEnum.OVERDUE;
                                    })

                                    .map((task) => ({
                                        rawMaterialId: task.rawMaterialId,
                                        packageQuantity: 0,
                                        packagePrice: 0,
                                        materialName: '',
                                        materialPerPackage: 0,
                                    }));

                                formMethods.setValue('orderMaterials', orderMaterials);
                            },
                        },
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
                                apiAction: async (search) => {
                                    return suppliers.data
                                        .map((supplier) => ({
                                            label: `${supplier?.fullName} - ${supplier?.supplier?.companyName}`,
                                            value: supplier?.supplier?.id,
                                            name: `${supplier?.fullName} - ${supplier?.supplier?.companyName}`,
                                            id: supplier?.supplier?.id,
                                        }))
                                        .filter((supplier) => {
                                            return supplier.label.toLowerCase().includes(search.toLowerCase());
                                        });
                                },
                            },
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
                            name: 'receiverCompanyAddress',
                            label: 'Receiver Company Address',
                            span: 4,
                        },

                        {
                            type: NKFormType.TEXTAREA,
                            name: 'note',
                            label: 'Note',
                        },

                        {
                            type: NKFormType.ARRAY,
                            name: 'orderMaterials',
                            label: 'Order Materials',

                            fieldProps: {
                                isAllowAddField: (values) => {
                                    return (
                                        values.orderMaterials?.length <
                                        (selectedProductionPlan.data?.purchaseTasks?.filter((task) => {
                                            const purchaseTask = mePurchasingTask.data.find((meTask) => meTask.id === task.id);
                                            return Boolean(purchaseTask) && task.remainedQuantity > 0;
                                        }).length || 0)
                                    );
                                },
                                defaultValues: {
                                    rawMaterialId: null,
                                    packageQuantity: 0,
                                    packagePrice: 0,
                                    materialPerPackage: 0,
                                    materialName: '',
                                },
                                addFieldLabel: 'Add Material',
                                fields: [
                                    {
                                        type: NKFormType.SELECT_API_OPTION,
                                        name: 'rawMaterialId',
                                        label: 'Raw Material',
                                        span: 4,
                                        onChangeExtra: async (value, name, formMethods) => {
                                            const getPath = name.split('.')[0];

                                            const options = await rawMaterialApi.getEnumSelectOption();

                                            const option = options.find((option) => String(option.value) === String(value));
                                            const rawMaterial = rawMaterialList.data.find((rawMaterial) => rawMaterial.id === value);

                                            formMethods.setValue(`${getPath}.materialName`, option?.label || '');
                                            formMethods.setValue(`${getPath}.packagePrice`, rawMaterial?.estimatePrice || 0);
                                        },
                                        fieldProps: {
                                            apiAction: async (data, formMethods: any, isDefault, name) => {
                                                const currentValues = formMethods.getValues() as ICreatePurchasingOrderDto;
                                                const index = Number(name.split('.')[0].split('[')[1].split(']')[0]);

                                                const allowedRawMaterials =
                                                    selectedProductionPlan.data?.purchaseTasks
                                                        .filter((task) => {
                                                            const purchaseTask = mePurchasingTask.data.find((meTask) => meTask.id === task.id);
                                                            return Boolean(purchaseTask);
                                                        })
                                                        .filter((task) => {
                                                            return task.remainedQuantity > 0;
                                                        })
                                                        .map((task) => task.rawMaterialId) || [];

                                                const options = await rawMaterialApi.getEnumSelectOptionWithPackageWithCode();
                                                if (!isDefault) {
                                                    return options;
                                                }
                                                const currentExistOptions = currentValues.orderMaterials.filter((task, i) => i !== index);

                                                return options
                                                    .filter((option) => {
                                                        return selectedProductionPlan.data?.purchaseTasks.some(
                                                            (task) => Number(task.rawMaterialId) === Number(option.value),
                                                        );
                                                    })
                                                    .filter((option) => {
                                                        return allowedRawMaterials.includes(Number(option.value));
                                                    })
                                                    .filter((option) => {
                                                        return !currentExistOptions.some(
                                                            (task) => Number(task.rawMaterialId) === Number(option.value),
                                                        );
                                                    });
                                            },
                                        },
                                    },

                                    {
                                        type: NKFormType.NUMBER,
                                        name: 'packageQuantity',
                                        label: 'Package Quantity',
                                        span: 2,
                                    },
                                    {
                                        type: NKFormType.NUMBER,
                                        name: 'materialPerPackage',
                                        label: 'Material Per Package',
                                        span: 2,
                                    },
                                    {
                                        type: NKFormType.NUMBER,
                                        name: 'packagePrice',
                                        label: 'Package Price (VND)',
                                        span: 2,
                                    },
                                ],
                            },
                        },
                        {
                            label: 'Delivery Stages',
                            name: 'deliveryStages',
                            type: NKFormType.ARRAY,
                            span: 4,
                            fieldProps: {
                                defaultValues: {
                                    deliveryDate: selectedProductionPlan.data?.startDate
                                        ? moment(selectedProductionPlan.data?.startDate).format('YYYY-MM-DD')
                                        : moment().format('YYYY-MM-DD'),
                                    stageOrder: 1,
                                    purchaseMaterials: [],
                                },
                                isAllowAddField: () => true,
                                addFieldLabel: 'Add Delivery Stage',
                                fields: [
                                    {
                                        label: 'Delivery Date',
                                        name: 'deliveryDate',
                                        span: 4,
                                        type: NKFormType.DATE,
                                    },

                                    {
                                        label: 'Purchase Materials',
                                        name: 'purchaseMaterials',
                                        type: NKFormType.ARRAY,
                                        fieldProps: {
                                            defaultValues: {
                                                materialName: '',

                                                totalQuantity: 0,
                                                rawMaterialId: null,
                                            },
                                            isAllowAddField: (values, formMethods, name) => {
                                                const orderMaterials = formMethods.getValues().orderMaterials as PurchaseMaterial[];

                                                const path = name.split('.')[0];

                                                const currentValues = _.get(values, `${path}.purchaseMaterials`, []) as PurchaseMaterial[];

                                                return currentValues.length < orderMaterials.length;
                                            },
                                            fields: [
                                                {
                                                    label: 'Raw Material',
                                                    name: 'rawMaterialId',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    span: 4,

                                                    onChangeExtra(value, path, formMethods) {
                                                        const rootPath = getRootPath(path);
                                                        const rawMaterial = rawMaterialOptions.data.find(
                                                            (option) => String(option.value) === String(value),
                                                        );

                                                        if (rawMaterial) {
                                                            formMethods.setValue(`${rootPath}.materialName`, rawMaterial.name);
                                                        }
                                                    },
                                                    fieldProps: {
                                                        isSetDefault: false,
                                                        apiAction: async (data, formMethods: any, isDefault, name) => {
                                                            const currentValues = formMethods.getValues() as ICreatePurchasingOrderDto;
                                                            const index = Number(name.split('.')[0].split('[')[1].split(']')[0]);
                                                            const subIndex = Number(name.split('.')[1].split('[')[1].split(']')[0]);

                                                            const orderMaterials = currentValues.orderMaterials;

                                                            const allowedRawMaterials = orderMaterials.map((task) => task.rawMaterialId);

                                                            const options = rawMaterialOptions.data.filter((option) => {
                                                                return allowedRawMaterials.includes(Number(option.value));
                                                            });

                                                            const currentSelectedRawMaterial = currentValues.deliveryStages[index].purchaseMaterials
                                                                .map((task) => Number(task.rawMaterialId))
                                                                .filter((_, idx) => idx !== subIndex);

                                                            return options.filter((option) => {
                                                                return !currentSelectedRawMaterial.includes(Number(option.value));
                                                            });
                                                        },
                                                    },
                                                },

                                                {
                                                    label: 'Total Quantity',
                                                    name: 'totalQuantity',
                                                    type: NKFormType.NUMBER,
                                                    span: 4,
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ]}
                    schema={{
                        name: joi.string().required(),
                        note: joi.string().allow('').required(),
                        supplierId: joi.number().required(),
                        orderMaterials: joi
                            .array()
                            .min(1)
                            .items(
                                joi.object({
                                    rawMaterialId: joi.number().required(),
                                    packageQuantity: joi.number().min(1).required(),
                                    materialName: joi.string().allow('').required(),
                                    packagePrice: joi.number().min(1).required(),
                                    materialPerPackage: joi.number().greater(0).required(),
                                }),
                            ),
                        purchasingPlanId: joi.number().required(),
                        deliveryStages: joi
                            .array()
                            .min(1)
                            .items(
                                joi.object({
                                    deliveryDate: joi.string().required(),
                                    stageOrder: joi.number().required(),
                                    purchaseMaterials: joi
                                        .array()
                                        .min(1)
                                        .items(
                                            joi.object({
                                                materialName: joi.string().required(),

                                                totalQuantity: joi.number().greater(0).required(),
                                                rawMaterialId: joi.number().required(),
                                            }),
                                        ),
                                }),
                            ),
                        receiverCompanyAddress: joi.string().required(),
                        receiverCompanyEmail: joi
                            .string()
                            .email({
                                tlds: { allow: false },
                            })
                            .required(),
                        receiverCompanyPhone: joi.string().allow('').required(),
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
                                dataSource={(selectedProductionPlan.data?.purchaseTasks || []).filter((task) => {
                                    const purchaseTask = mePurchasingTask.data.find((meTask) => meTask.id === task.id);

                                    return Boolean(purchaseTask);
                                })}
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
                                                    value={record}
                                                    type={FieldType.LINK}
                                                    apiAction={async (data) => {
                                                        const res = await rawMaterialApi.getById(data.rawMaterialId);

                                                        return {
                                                            label: res.name,
                                                            link: NKRouter.rawMaterial.detail(data.id),
                                                        };
                                                    }}
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
                                        title: 'Remaining Quantity',

                                        key: 'remainingQuantity',

                                        render: (record: PurchaseTask) => {
                                            return <FieldDisplay value={record.remainedQuantity} type={FieldType.NUMBER} />;
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
                                        title: 'status',
                                        key: 'taskStatus',
                                        render: (record: PurchaseTask) => (
                                            <FieldDisplay
                                                value={record.taskStatus}
                                                type={FieldType.BADGE_API}
                                                apiAction={purchasingTaskApi.getEnumStatus}
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

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-order/create')({
    component: Page,
});
