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
import { deliveryStageApi } from '@/core/api/delivery-stage.api';
import { ICreateInspectionRequestDto, inspectionRequestApi } from '@/core/api/inspection-request.api';
import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { purchasingTaskApi } from '@/core/api/purchasing-task.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { DeliveryStageStatusEnum } from '@/core/models/deliveryStage';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

const Page = () => {
    const router = useNKRouter();
    const [selectedPurchasingPlanId, setSelectedPurchasingPlanId] = React.useState<number>(0);
    const { id, purchasingStaffId } = useSelector<RootState, UserState>((state) => state.user);
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

    const purchasingOrder = useQuery({
        queryKey: ['purchasing-order', id],
        queryFn: async () => {
            return await purchasingOrderApi.getAll();
        },

        initialData: [],
    });

    const selectedProductionPlan = useQuery({
        queryKey: ['purchasing-order', selectedPurchasingPlanId],
        queryFn: async () => {
            return await purchasingOrderApi.getById(selectedPurchasingPlanId);
        },
        enabled: selectedPurchasingPlanId > 0,
    });

    const deliveryStagesQuery = useQuery({
        queryKey: ['delivery-stage'],
        queryFn: async () => {
            return await deliveryStageApi.getAll();
        },
    });

    useDocumentTitle('Add Inspection Request');

    if (purchasingOrder.isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full gap-4">
            <div className=" flex flex-1 flex-col gap-2">
                <FormBuilder<ICreateInspectionRequestDto>
                    title="Add Inspection Request"
                    apiAction={inspectionRequestApi.create}
                    onExtraSuccessAction={() => {
                        toast.success('Add Inspection Request successfully');
                        router.push(NKRouter.inspectionRequest.list());
                    }}
                    onExtraErrorAction={(error: any) => {
                        const message = _.get(error, 'data.message') || 'Create Inspection Request failed';
                        toast.error(message);
                    }}
                    defaultValues={{
                        content: '',
                        deliveryStageId: 0,
                        purchasingOrderId: 0,
                        title: '',
                        requestInspectDate: moment().format('YYYY-MM-DD'),
                    }}
                    fields={[
                        {
                            type: NKFormType.SELECT_API_OPTION,
                            name: 'purchasingOrderId',
                            label: 'Purchasing Order',
                            fieldProps: {
                                apiAction: async (value) => {
                                    const res = await purchasingOrderApi.getSelectWithCodeAndApprove(value);
                                    const purchasingOrderIds = purchasingOrder.data
                                        .filter((item) => {
                                            return item.purchasingStaffId === purchasingStaffId;
                                        })
                                        .map((item) => item.id);

                                    return res.filter((item) => {
                                        return purchasingOrderIds.includes(item.id);
                                    });
                                },
                            },
                            onChangeExtra(value, path, formMethods) {
                                setSelectedPurchasingPlanId(value);
                            },
                        },
                        {
                            label: 'Delivery Stage',
                            name: 'deliveryStageId',
                            isShowField: (form: ICreateInspectionRequestDto) => form.purchasingOrderId !== 0,
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: async (value, formMethods) => {
                                    const form = formMethods.getValues() as ICreateInspectionRequestDto;

                                    const res = await deliveryStageApi.getEnumSelectOption(value, form.purchasingOrderId);

                                    return res;
                                },
                            },
                            onChangeExtra(value, path, formMethods) {
                                const deliveryStage = deliveryStagesQuery.data?.find((item) => Number(item.id) === Number(value));

                                formMethods.setValue('requestInspectDate', deliveryStage?.deliveryDate || moment().format('YYYY-MM-DD'));
                            },
                        },
                        {
                            label: 'Title',
                            name: 'title',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Content',
                            name: 'content',
                            type: NKFormType.TEXTAREA,
                        },
                        {
                            label: 'Request Inspect Date',
                            name: 'requestInspectDate',
                            type: NKFormType.DATE,
                        },
                    ]}
                    schema={{
                        content: joi.string().optional().allow(''),
                        deliveryStageId: joi.number().required(),
                        purchasingOrderId: joi.number().required(),
                        title: joi.string().required(),
                        requestInspectDate: joi.date().required(),
                    }}
                />
            </div>

            <div className="fade-in flex w-full max-w-2xl flex-1 flex-col gap-4">
                {Boolean(selectedProductionPlan.data) && (
                    <div className="flex flex-col gap-4">
                        <FieldBuilder
                            size="small"
                            record={selectedProductionPlan.data}
                            title="Purchasing Order Detail"
                            fields={[
                                {
                                    key: 'id',
                                    title: 'Id',
                                    type: FieldType.TEXT,
                                    span: 1,
                                },
                                {
                                    key: 'name',
                                    title: 'Name',
                                    type: FieldType.TEXT,
                                    span: 2,
                                },
                                {
                                    key: 'poCode',
                                    title: 'PO Code',
                                    type: FieldType.TEXT,
                                    span: 1,
                                },
                                {
                                    key: 'totalPrice',
                                    title: 'Total Price (VND)',
                                    type: FieldType.NUMBER,
                                    span: 2,
                                },
                                {
                                    key: 'supplierApproveStatus',
                                    title: 'Supplier Approve Status',
                                    type: FieldType.BADGE_API,
                                    apiAction: purchasingOrderApi.getEnumSupplierApproveStatus,
                                    span: 1,
                                },
                                {
                                    key: 'managerApproveStatus',
                                    title: 'Manager Approve Status',
                                    type: FieldType.BADGE_API,
                                    apiAction: purchasingOrderApi.getEnumManagerApproveStatus,
                                    span: 2,
                                },
                                {
                                    key: 'supplierName',
                                    title: 'Supplier Name',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'supplierCompanyName',
                                    title: 'Supplier Company Name',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'supplierTaxCode',
                                    title: 'Supplier Tax Code',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'supplierAddress',
                                    title: 'Supplier Address',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'suppplierEmail',
                                    title: 'Supplier Email',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'supplierPhone',
                                    title: 'Supplier Phone',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'receiverCompanyAddress',
                                    title: 'Receiver Company Address',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'receiverCompanyEmail',
                                    title: 'Receiver Company Email',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'receiverCompanyPhone',
                                    title: 'Receiver Company Phone',
                                    type: FieldType.TEXT,
                                    span: 3,
                                },
                                {
                                    key: 'numOfDeliveryStage',
                                    title: 'Number Of Delivery Stage',
                                    type: FieldType.NUMBER,
                                    span: 2,
                                },
                                {
                                    key: 'totalMaterialType',
                                    title: 'Total Material Type',
                                    type: FieldType.NUMBER,
                                    span: 1,
                                },

                                {
                                    key: 'purchasingPlanId',
                                    title: 'Purchasing Plan',
                                    type: FieldType.LINK,
                                    span: 3,
                                    apiAction: async (data) => {
                                        const res = await purchasingPlanApi.getById(data);

                                        return {
                                            label: res.title,
                                            link: NKRouter.purchasingPlan.detail(data),
                                        };
                                    },
                                },
                                {
                                    key: 'note',
                                    title: 'Note',
                                    type: FieldType.TEXT,
                                },
                            ]}
                        />
                        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
                            <div className="text-xl font-semibold">Delivery Stages</div>
                            <Table
                                scroll={{ x: 1024 }}
                                dataSource={(selectedProductionPlan.data?.deliveryStages || [])
                                    .sort((a: any, b: any) => a?.stageOrder - b?.stageOrder)
                                    .filter((item: any) => item.deliveryStatus !== DeliveryStageStatusEnum.SupInactive)}
                                size="small"
                                key="id"
                                rowKey="id"
                                expandable={{
                                    expandedRowRender: (record: any) => {
                                        return (
                                            <div className="fade-in pb-8 pl-4 pr-4">
                                                <div className="font-bold">Purchase Materials</div>
                                                <Table
                                                    summary={(pageData) => {
                                                        let quantity = 0;
                                                        let price = 0;
                                                        pageData.forEach(({ totalQuantity, totalPrice }) => {
                                                            quantity += totalQuantity;
                                                            price += totalPrice;
                                                        });

                                                        return (
                                                            <Table.Summary.Row>
                                                                <Table.Summary.Cell index={0}>
                                                                    <div className="font-bold">Total</div>
                                                                </Table.Summary.Cell>
                                                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={3} colSpan={1}>
                                                                    <FieldDisplay value={quantity} type={FieldType.NUMBER} />
                                                                </Table.Summary.Cell>
                                                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={5}>
                                                                    <FieldDisplay value={price} type={FieldType.NUMBER} />
                                                                </Table.Summary.Cell>
                                                            </Table.Summary.Row>
                                                        );
                                                    }}
                                                    dataSource={record.purchaseMaterials || []}
                                                    size="small"
                                                    pagination={false}
                                                    columns={[
                                                        {
                                                            title: 'Raw Material',
                                                            key: 'rawMaterial',
                                                            render: (record: PurchaseMaterial) => {
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
                                                            title: 'Package Price (VND)',
                                                            key: 'packagePrice',
                                                            render: (record: any) => {
                                                                return <FieldDisplay value={record.packagePrice} type={FieldType.NUMBER} />;
                                                            },
                                                        },
                                                        {
                                                            title: 'Total Package Quantity',
                                                            key: 'totalQuantity',
                                                            render: (record: any) => {
                                                                return <FieldDisplay value={record.totalQuantity} type={FieldType.NUMBER} />;
                                                            },
                                                        },
                                                        {
                                                            title: 'Delivered Quantity',
                                                            key: 'deliveredQuantity',
                                                            render: (record: any) => {
                                                                return <FieldDisplay value={record.deliveredQuantity} type={FieldType.NUMBER} />;
                                                            },
                                                        },
                                                        {
                                                            title: 'After Inspect Quantity',
                                                            key: 'afterInspectQuantity',
                                                            render: (record: any) => {
                                                                return <FieldDisplay value={record.afterInspectQuantity} type={FieldType.NUMBER} />;
                                                            },
                                                        },
                                                        {
                                                            title: 'Package',
                                                            key: 'package',
                                                            render: (record: any) => {
                                                                return (
                                                                    <FieldDisplay
                                                                        value={record.package}
                                                                        type={FieldType.BADGE_API}
                                                                        apiAction={rawMaterialApi.getEnumPackageUnit}
                                                                    />
                                                                );
                                                            },
                                                        },
                                                        {
                                                            title: 'Material Per Package',
                                                            key: 'materialPerPackage',
                                                            render: (record: any) => {
                                                                return <FieldDisplay value={record.materialPerPackage} type={FieldType.NUMBER} />;
                                                            },
                                                        },
                                                        {
                                                            title: 'Unit',
                                                            key: 'unit',
                                                            render: (record: any) => {
                                                                return (
                                                                    <FieldDisplay
                                                                        value={record.unit}
                                                                        type={FieldType.BADGE_API}
                                                                        apiAction={rawMaterialApi.getEnumUnit}
                                                                    />
                                                                );
                                                            },
                                                        },
                                                        {
                                                            title: 'Total Price (VND)',
                                                            key: 'totalPrice',
                                                            render: (record: any) => {
                                                                return <FieldDisplay value={record.totalPrice} type={FieldType.NUMBER} />;
                                                            },
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        );
                                    },
                                }}
                                rowClassName={(record, index) => {
                                    if (record.isSupplemental) {
                                        return 'bg-blue-200';
                                    }

                                    return '';
                                }}
                                columns={[
                                    {
                                        title: 'Stage Order',
                                        key: 'stageOrder',
                                        render: (record: any) => {
                                            return <FieldDisplay value={record.stageOrder} type={FieldType.TEXT} />;
                                        },
                                    },
                                    {
                                        title: 'Delivery Date',
                                        key: 'deliveryDate',
                                        render: (record: any) => {
                                            return <FieldDisplay value={record.deliveryDate} type={FieldType.TIME_DATE} />;
                                        },
                                    },
                                    {
                                        title: 'Delivery Status',
                                        key: 'deliveryStatus',
                                        render: (record: any) => {
                                            return (
                                                <FieldDisplay
                                                    value={record.deliveryStatus}
                                                    type={FieldType.BADGE_API}
                                                    apiAction={deliveryStageApi.getEnumDeliveryStageStatus}
                                                />
                                            );
                                        },
                                    },
                                    {
                                        title: 'Total Type Material',
                                        key: 'totalTypeMaterial',
                                        render: (record: any) => {
                                            return <FieldDisplay value={record.totalTypeMaterial} type={FieldType.NUMBER} />;
                                        },
                                    },
                                    {
                                        title: 'Total Price (VND)',
                                        key: 'totalPrice',
                                        render: (record: any) => {
                                            return <FieldDisplay value={record.totalPrice} type={FieldType.NUMBER} />;
                                        },
                                    },
                                ]}
                                pagination={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/inspection-request/create')({
    component: Page,
});
