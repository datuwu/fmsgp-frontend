import React from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Switch, Table } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { ICreateDeliveryStageDto, IUpdateDeliveryStageDto, deliveryStageApi } from '@/core/api/delivery-stage.api';
import { ICreatePOReportDto, poReportApi } from '@/core/api/po-report.api';
import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import CTAButton from '@/core/components/cta/CTABtn';
import DrawerBuilder from '@/core/components/drawer/DrawerBuilder';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { PurchaseTask } from '@/core/models/purchaseTask';
import { PurchasingOrderManagerApproveStatus, PurchasingOrderSupplierApproveStatus } from '@/core/models/purchasingOrder';
import { PurchasingPlanApproveStatus } from '@/core/models/purchasingPlan';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const [stageDeliveryId, setStageDeliveryId] = React.useState<number>();
    const [isShowIncludeSupplemental, setIsShowIncludeSupplemental] = React.useState<boolean>(false);
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isManager, isPurchasingManager, isSupplier, isPurchasingStaff } = useSelector<RootState, UserState>((state) => state.user);

    const query = useQuery({
        queryKey: ['purchasing-order', id],
        queryFn: async () => {
            return await purchasingOrderApi.getById(Number(id));
        },
    });

    useDocumentTitle(`Purchasing Order Detail`);

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <FieldBuilder
                record={query.data}
                title="Purchasing Order Detail"
                extra={[
                    <div className="flex items-center gap-2">
                        {query.data?.managerApproveStatus === PurchasingOrderManagerApproveStatus.PENDING &&
                            query.data?.supplierApproveStatus === PurchasingOrderSupplierApproveStatus.PENDING && (
                                <>
                                    {isPurchasingStaff && (
                                        <>
                                            <CTAButton
                                                ctaApi={async () => {
                                                    return purchasingOrderApi.delete(Number(id));
                                                }}
                                                isConfirm
                                                confirmMessage="Are you sure to delete this request?"
                                                extraOnSuccess={() => {
                                                    toast.success('Delete purchasing successfully');
                                                    query.refetch();
                                                    router.push(NKRouter.purchasingOrder.list());
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
                        {query.data?.managerApproveStatus === PurchasingOrderManagerApproveStatus.PENDING && (
                            <>
                                {isPurchasingManager && (
                                    <>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return purchasingOrderApi.approveManager(Number(id), PurchasingPlanApproveStatus.APPROVED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to approve this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Approve request successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button icon={<CheckOutlined />} type="primary" className="w-full">
                                                Approve
                                            </Button>
                                        </CTAButton>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return purchasingOrderApi.approveManager(Number(id), PurchasingPlanApproveStatus.REJECTED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to reject this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Reject request successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button type="primary" icon={<CloseOutlined />} danger className="w-full">
                                                Reject
                                            </Button>
                                        </CTAButton>
                                        {/* <NKLink href={NKRouter.purchasingOrder.edit(Number(id))}>
                                            <Button icon={<EditOutlined />} className="w-full">
                                                Edit
                                            </Button>
                                        </NKLink> */}
                                    </>
                                )}
                            </>
                        )}
                        {query.data?.supplierApproveStatus === PurchasingOrderSupplierApproveStatus.PENDING && (
                            <>
                                {isSupplier && (
                                    <>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return purchasingOrderApi.approveSupplier(Number(id), PurchasingPlanApproveStatus.APPROVED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to approve this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Approve request successfully');
                                                query.refetch();
                                            }}
                                            disabled={query.data?.managerApproveStatus !== PurchasingOrderManagerApproveStatus.APPROVED}
                                        >
                                            <Button
                                                icon={<CheckOutlined />}
                                                type="primary"
                                                className="w-full"
                                                disabled={query.data?.managerApproveStatus !== PurchasingOrderManagerApproveStatus.APPROVED}
                                            >
                                                {query.data?.managerApproveStatus !== PurchasingOrderManagerApproveStatus.APPROVED
                                                    ? 'Pending'
                                                    : 'Approve'}
                                            </Button>
                                        </CTAButton>
                                        {query.data?.managerApproveStatus === PurchasingOrderManagerApproveStatus.APPROVED && (
                                            <>
                                                <ModalBuilder
                                                    btnLabel="Reject"
                                                    btnProps={{
                                                        type: 'primary',
                                                        icon: <CloseOutlined />,
                                                        danger: true,
                                                        className: 'w-full',
                                                    }}
                                                >
                                                    {(close) => (
                                                        <FormBuilder<ICreatePOReportDto>
                                                            defaultValues={{
                                                                reportTitle: '',
                                                                reportContent: '',
                                                                purchasingOrderId: Number(id),
                                                                supplierId: query.data?.supplierId || 0,
                                                            }}
                                                            schema={{
                                                                reportTitle: Joi.string().required(),
                                                                reportContent: Joi.string().required(),
                                                                purchasingOrderId: Joi.number().required(),
                                                                supplierId: Joi.number().required(),
                                                            }}
                                                            apiAction={async (data) => {
                                                                await poReportApi.create(data);

                                                                await purchasingOrderApi.approveSupplier(
                                                                    Number(id),
                                                                    PurchasingPlanApproveStatus.REJECTED,
                                                                );
                                                            }}
                                                            onExtraSuccessAction={() => {
                                                                toast.success('Reject request successfully');
                                                                query.refetch();
                                                                close();
                                                            }}
                                                            fields={[
                                                                {
                                                                    label: 'Report Title',
                                                                    name: 'reportTitle',
                                                                    type: NKFormType.TEXT,
                                                                    span: 4,
                                                                },
                                                                {
                                                                    label: 'Report Content',
                                                                    name: 'reportContent',
                                                                    type: NKFormType.TEXTAREA,
                                                                    span: 4,
                                                                },
                                                            ]}
                                                            title="Reject Reason"
                                                        />
                                                    )}
                                                </ModalBuilder>
                                                {/* <CTAButton
                                                    ctaApi={async () => {
                                                        return purchasingOrderApi.approveSupplier(Number(id), PurchasingPlanApproveStatus.REJECTED);
                                                    }}
                                                    isConfirm
                                                    confirmMessage="Are you sure to reject this request?"
                                                    extraOnSuccess={() => {
                                                        toast.success('Reject request successfully');
                                                        query.refetch();
                                                    }}
                                                >
                                                    <Button type="primary" icon={<CloseOutlined />} danger className="w-full">
                                                        Reject
                                                    </Button>
                                                </CTAButton> */}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>,
                ]}
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
                        span: 1,
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
                        span: 1,
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
                        span: 1,
                    },
                    {
                        key: 'supplierName',
                        title: 'Supplier Name',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'supplierCompanyName',
                        title: 'Supplier Company Name',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'supplierTaxCode',
                        title: 'Supplier Tax Code',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'supplierAddress',
                        title: 'Supplier Address',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'suppplierEmail',
                        title: 'Supplier Email',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'supplierPhone',
                        title: 'Supplier Phone',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'receiverCompanyAddress',
                        title: 'Receiver Company Address',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'receiverCompanyEmail',
                        title: 'Receiver Company Email',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'receiverCompanyPhone',
                        title: 'Receiver Company Phone',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'numOfDeliveryStage',
                        title: 'Number Of Delivery Stage',
                        type: FieldType.NUMBER,
                        span: 1,
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
                        span: 1,
                        apiAction: async (data) => {
                            const res = await purchasingPlanApi.getById(data);

                            return {
                                label: res.title,
                                link: NKRouter.purchasingPlan.detail(data.purchasingPlanId),
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
            <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4  ">
                <div className="text-xl font-bold text-black">Order Detail</div>

                <Table
                    dataSource={query.data?.orderMaterials || []}
                    size="small"
                    columns={[
                        {
                            title: 'Material Name',
                            key: 'materialName',
                            render: (record: any) => {
                                return <FieldDisplay value={record.materialName} type={FieldType.TEXT} />;
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
                            render: (record: any) => {
                                return <FieldDisplay value={record.quantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Unit Price (VND)',
                            key: 'unitPrice',
                            render: (record: any) => {
                                return <FieldDisplay value={record.unitPrice} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Total Price (VND)',
                            key: 'materialTotalPrice',
                            render: (record: any) => {
                                return <FieldDisplay value={record.materialTotalPrice} type={FieldType.NUMBER} />;
                            },
                        },
                    ]}
                    pagination={false}
                />
            </div>
            <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4 ">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-black">Delivery Stage</div>
                    <div className="flex items-center gap-1 font-semibold ">
                        <div>Show Supplemental</div>
                        <Switch
                            checkedChildren=""
                            unCheckedChildren=""
                            checked={isShowIncludeSupplemental}
                            onChange={(checked) => setIsShowIncludeSupplemental(checked)}
                        />
                    </div>
                </div>
                <Table
                    dataSource={(query.data?.deliveryStages || [])
                        .filter((stage: any) => {
                            if (isShowIncludeSupplemental) return true;

                            return !stage.isSupplemental;
                        })
                        .sort((a: any, b: any) => a?.stageOrder - b?.stageOrder)}
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
                                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={3} colSpan={1}>
                                                        {quantity}
                                                    </Table.Summary.Cell>
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
                                                title: 'Id',
                                                key: 'id',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.id} type={FieldType.TEXT} />;
                                                },
                                            },
                                            {
                                                title: 'Material Name',
                                                key: 'materialName',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.materialName} type={FieldType.TEXT} />;
                                                },
                                            },
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
                                                title: 'Supplier Material Code',
                                                key: 'supplierMaterialCode',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.supplierMaterialCode} type={FieldType.TEXT} />;
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
                                                title: 'Unit Price (VND)',
                                                key: 'unitPrice',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.unitPrice} type={FieldType.NUMBER} />;
                                                },
                                            },
                                            {
                                                title: 'Total Quantity',
                                                key: 'totalQuantity',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.totalQuantity} type={FieldType.NUMBER} />;
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
                        return '';
                    }}
                    columns={[
                        {
                            title: 'Id',
                            key: 'id',
                            render: (record: any) => {
                                return <FieldDisplay value={record.id} type={FieldType.TEXT} />;
                            },
                        },
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
                            title: 'Supplemental',
                            key: 'deliveryStatus',
                            render: (record: any) => {
                                return <FieldDisplay value={record.isSupplemental} type={FieldType.BOOLEAN} />;
                            },
                        },
                        // {
                        //     title: 'Supplemental',
                        //     key: 'isSupplemental',
                        //     render: (record: any) => {
                        //         return <FieldDisplay value={record.isSupplemental} type={FieldType.BOOLEAN} />;
                        //     },
                        // },
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
                        {
                            title: '',
                            key: 'action',
                            render: (record: any) => {
                                return (
                                    <div className="flex gap-2">
                                        <DrawerBuilder
                                            btnLabel=""
                                            width="80%"
                                            btnProps={{
                                                icon: <EditOutlined />,
                                                size: 'small',
                                                type: 'primary',
                                                className: '!bg-blue-600',
                                            }}
                                            drawerTitle="Edit Delivery Stage"
                                        >
                                            {(close) => (
                                                <div>
                                                    <FormBuilder<IUpdateDeliveryStageDto>
                                                        apiAction={async (data) => {
                                                            return deliveryStageApi.update(id, data);
                                                        }}
                                                        defaultValues={{
                                                            items: [
                                                                {
                                                                    id: _get(record, 'id', 0),
                                                                    status: _get(record, 'status', 1),
                                                                    deliveryDate: _get(
                                                                        record,
                                                                        'deliveryDate',
                                                                        moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                    ),
                                                                    stageOrder: _get(record, 'stageOrder', 1),
                                                                    purchaseMaterials: _get(record, 'purchaseMaterials', []),
                                                                },
                                                            ],
                                                        }}
                                                        onExtraSuccessAction={() => {
                                                            toast.success('Update stage successfully');
                                                            query.refetch();
                                                            close();
                                                        }}
                                                        fields={[
                                                            {
                                                                label: 'Delivery Stages',
                                                                name: 'items',
                                                                type: NKFormType.ARRAY,
                                                                span: 4,
                                                                fieldProps: {
                                                                    defaultValues: {
                                                                        deliveryDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                        stageOrder: 1,
                                                                        purchaseMaterials: [],
                                                                    },
                                                                    fields: [
                                                                        {
                                                                            label: 'Delivery Date',
                                                                            name: 'deliveryDate',
                                                                            span: 2,
                                                                            type: NKFormType.DATE,
                                                                        },
                                                                        {
                                                                            label: 'Stage Order',
                                                                            name: 'stageOrder',
                                                                            type: NKFormType.NUMBER,
                                                                            span: 2,
                                                                        },
                                                                        {
                                                                            label: 'Purchase Materials',
                                                                            name: 'purchaseMaterials',
                                                                            type: NKFormType.ARRAY,
                                                                            fieldProps: {
                                                                                defaultValues: {
                                                                                    materialName: '',
                                                                                    supplierMaterialCode: '',

                                                                                    unitPrice: 0,
                                                                                    totalQuantity: 0,
                                                                                    rawMaterialId: null,
                                                                                },
                                                                                fields: [
                                                                                    {
                                                                                        label: 'Material Name',
                                                                                        name: 'materialName',
                                                                                        type: NKFormType.TEXT,
                                                                                        span: 2,
                                                                                    },
                                                                                    {
                                                                                        label: 'Supplier Material Code',
                                                                                        name: 'supplierMaterialCode',
                                                                                        type: NKFormType.TEXT,
                                                                                        span: 2,
                                                                                    },
                                                                                    {
                                                                                        label: 'Unit',
                                                                                        name: 'unit',
                                                                                        type: NKFormType.SELECT_API_OPTION,
                                                                                        span: 2,
                                                                                        fieldProps: {
                                                                                            apiAction: rawMaterialApi.getEnumUnit,
                                                                                        },
                                                                                    },
                                                                                    {
                                                                                        label: 'Unit Price',
                                                                                        name: 'unitPrice',
                                                                                        type: NKFormType.NUMBER,
                                                                                        span: 2,
                                                                                    },
                                                                                    {
                                                                                        label: 'Total Quantity',
                                                                                        name: 'totalQuantity',
                                                                                        type: NKFormType.NUMBER,
                                                                                        span: 2,
                                                                                    },
                                                                                    {
                                                                                        label: 'Raw Material',
                                                                                        name: 'rawMaterialId',
                                                                                        type: NKFormType.SELECT_API_OPTION,
                                                                                        span: 2,

                                                                                        fieldProps: {
                                                                                            apiAction: async (
                                                                                                data,
                                                                                                formMethods: any,
                                                                                                isDefault,
                                                                                                name,
                                                                                            ) => {
                                                                                                const path = name.split('.')[0];

                                                                                                const currentValues =
                                                                                                    formMethods.getValues() as ICreateDeliveryStageDto;

                                                                                                const values = _get(
                                                                                                    currentValues,
                                                                                                    `${path}.purchaseMaterials`,
                                                                                                    [],
                                                                                                ) as PurchaseMaterial[];

                                                                                                const options =
                                                                                                    await rawMaterialApi.getEnumSelectOption();

                                                                                                if (!isDefault) {
                                                                                                    return options;
                                                                                                }

                                                                                                return options.filter((option) => {
                                                                                                    return !values.some(
                                                                                                        (value) =>
                                                                                                            String(value.rawMaterialId) ===
                                                                                                            String(option.value),
                                                                                                    );
                                                                                                });
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        ]}
                                                        title=""
                                                        schema={{
                                                            items: Joi.array()
                                                                .min(1)
                                                                .items(
                                                                    Joi.object({
                                                                        id: Joi.number().required(),
                                                                        status: Joi.number().required(),
                                                                        deliveryDate: Joi.string().required(),
                                                                        stageOrder: Joi.number().required(),
                                                                        purchaseMaterials: Joi.array()
                                                                            .min(1)
                                                                            .items(
                                                                                Joi.object({
                                                                                    materialName: Joi.string().required(),
                                                                                    supplierMaterialCode: Joi.string().required(),

                                                                                    unitPrice: Joi.number().min(1).required(),
                                                                                    totalQuantity: Joi.number().greater(0).required(),
                                                                                    rawMaterialId: Joi.number().min(1).required(),
                                                                                }).options({
                                                                                    allowUnknown: true,
                                                                                }),
                                                                            ),
                                                                    }).options({
                                                                        allowUnknown: true,
                                                                    }),
                                                                ),
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </DrawerBuilder>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return deliveryStageApi.delete(record.id);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to delete this stage?"
                                            extraOnSuccess={() => {
                                                toast.success('Delete stage successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button size="small" icon={<DeleteOutlined />} type="primary" danger />
                                        </CTAButton>
                                    </div>
                                );
                            },
                        },
                    ]}
                    pagination={false}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/po-report/$id/')({
    component: Page,
});
