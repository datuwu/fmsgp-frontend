import React, { useEffect } from 'react';

import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Table } from 'antd';
import Joi from 'joi';
import _ from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { deliveryStageApi } from '@/core/api/delivery-stage.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { IApproveTempWarehouseRequestDto, temWareHouseRequestApi } from '@/core/api/temp-warehouse-request.api';
import { userApi } from '@/core/api/user.api';
import { ICreateWarehouseFormDto, warehouseFormApi } from '@/core/api/warehouse-form.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { TempWarehouseRequestApproveStatus } from '@/core/models/tempWarehouseRequest';
import { WarehouseFormStatusEnum, WarehouseFormTypeEnums } from '@/core/models/warehouseForm';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const [warehouseFormRecord, setWarehouseFormRecord] = React.useState<ICreateWarehouseFormDto | null>(null);
    const { isManager, isPurchasingStaff, isWarehouseStaff, isInspector } = useSelector<RootState, UserState>((state) => state.user);
    const [total, setTotal] = React.useState(0);
    const [deliveryStageId, setDeliveryStageId] = React.useState(0);

    const query = useQuery({
        queryKey: ['temp-warehouse-request', id],
        queryFn: async () => {
            return await temWareHouseRequestApi.getById(Number(id));
        },
    });

    useEffect(() => {
        if (query.data?.deliveryStageId) {
            setDeliveryStageId(query.data?.deliveryStageId);
        }
    }, [query.data]);

    const deliveryStageQuery = useQuery({
        queryKey: ['warehouse-form', deliveryStageId],
        queryFn: async () => {
            return await deliveryStageApi.getById(Number(deliveryStageId));
        },
        enabled: Boolean(deliveryStageId),
    });

    useEffect(() => {
        if (warehouseFormRecord) {
            const total = warehouseFormRecord.warehouseFormMaterials.reduce((acc: number, item: any) => {
                return acc + item.receiveQuantity * item.unitPrice;
            }, 0);

            setTotal(total);
        }
    }, [warehouseFormRecord]);

    useDocumentTitle('Temp Warehouse Request Detail');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    console.log(
        query.data?.warehouseForm?.warehouseFormMaterials.map((item) => {
            return {
                id: item.id,
                receiveQuantity: item.receiveQuantity,
                materialName: item.materialName,
                executionDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
            };
        }) || [],
    );

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <div className="flex gap-2  rounded-lg bg-white p-4">
                <FieldBuilder
                    isPadding={false}
                    record={query.data}
                    title="Temp Warehouse Request Detail"
                    extra={[
                        <>
                            {isWarehouseStaff && (
                                <>
                                    {query.data?.approveStatus === TempWarehouseRequestApproveStatus.APPROVED &&
                                        query.data?.warehouseForm === null && (
                                            <CTAButton
                                                confirmMessage="Are you sure you want to create warehouse form?"
                                                ctaApi={async () => {
                                                    return await warehouseFormApi.createTempWarehouseForm(Number(id));
                                                }}
                                                isConfirm
                                                extraOnSuccess={() => {
                                                    toast.success('Create warehouse form successfully');
                                                    query.refetch();
                                                }}
                                                extraOnError={(error) => {
                                                    const message = _.get(error, 'data.message', 'Create warehouse form failed');
                                                    toast.error(message);
                                                }}
                                            >
                                                <Button icon={<CheckOutlined />} type="primary" size="small">
                                                    Create Warehouse Form
                                                </Button>
                                            </CTAButton>
                                        )}
                                    {query.data?.approveStatus === TempWarehouseRequestApproveStatus.PENDING && (
                                        <>
                                            <ModalBuilder
                                                btnLabel="Approve"
                                                btnProps={{
                                                    type: 'primary',
                                                    icon: <CheckOutlined />,
                                                    size: 'small',
                                                }}
                                            >
                                                {(closeChildren) => {
                                                    return (
                                                        <FormBuilder<IApproveTempWarehouseRequestDto>
                                                            apiAction={async (data) => {
                                                                await temWareHouseRequestApi.approve(data);
                                                            }}
                                                            title="Approve Temp Warehouse Request"
                                                            schema={{
                                                                approveStatus: Joi.number().required(),
                                                                approveExecutionDate: Joi.any(),
                                                                id: Joi.number().required(),
                                                                rejectReason: Joi.string().allow(''),
                                                                updateDate: Joi.string().allow(''),
                                                            }}
                                                            defaultValues={{
                                                                approveStatus: TempWarehouseRequestApproveStatus.APPROVED,
                                                                id: query.data?.id || 0,
                                                                approveExecutionDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                rejectReason: '',
                                                                updateDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                            }}
                                                            onExtraSuccessAction={() => {
                                                                toast.success('Approve temp warehouse request successfully');
                                                                query.refetch();
                                                                closeChildren();
                                                            }}
                                                            fields={[
                                                                {
                                                                    name: 'approveExecutionDate',
                                                                    label: 'Approve Execution Date',
                                                                    type: NKFormType.DATE_TIME,
                                                                },
                                                            ]}
                                                        />
                                                    );
                                                }}
                                            </ModalBuilder>
                                            <ModalBuilder
                                                btnLabel="Reject"
                                                btnProps={{
                                                    type: 'primary',
                                                    icon: <CloseOutlined />,
                                                    size: 'small',
                                                    danger: true,
                                                }}
                                            >
                                                {(closeChildren) => {
                                                    return (
                                                        <FormBuilder<IApproveTempWarehouseRequestDto>
                                                            apiAction={async (data) => {
                                                                return temWareHouseRequestApi.approve(data);
                                                            }}
                                                            title="Reject Temp Warehouse Request"
                                                            schema={{
                                                                approveStatus: Joi.number().required(),
                                                                approveExecutionDate: Joi.any(),
                                                                id: Joi.number().required(),
                                                                rejectReason: Joi.string().allow(''),
                                                                updateDate: Joi.string().allow(''),
                                                            }}
                                                            defaultValues={{
                                                                approveStatus: TempWarehouseRequestApproveStatus.REJECTED,
                                                                id: query.data?.id || 0,
                                                                approveExecutionDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                rejectReason: '',
                                                                updateDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                            }}
                                                            onExtraSuccessAction={() => {
                                                                toast.success('Reject temp warehouse request successfully');
                                                                query.refetch();
                                                                closeChildren();
                                                            }}
                                                            fields={[
                                                                {
                                                                    name: 'rejectReason',
                                                                    label: 'Reject Reason',
                                                                    type: NKFormType.TEXTAREA,
                                                                },
                                                            ]}
                                                        />
                                                    );
                                                }}
                                            </ModalBuilder>
                                        </>
                                    )}
                                </>
                            )}
                        </>,
                    ]}
                    containerClassName="w-full"
                    fields={[
                        {
                            key: 'poCode',
                            title: 'Purchase Order Code',
                            type: FieldType.TEXT,
                            span: 3,
                        },
                        {
                            key: 'requestTitle',
                            title: 'Request Title',
                            type: FieldType.TEXT,
                            span: 3,
                        },

                        {
                            key: 'requestReasonContent',
                            title: 'Request Reason Content',
                            type: FieldType.MULTILINE_TEXT,
                            span: 3,
                        },

                        {
                            key: 'requestType',
                            title: 'Request Type',
                            type: FieldType.BADGE_API,
                            apiAction: temWareHouseRequestApi.getEnumType,
                            span: 3,
                        },

                        {
                            key: 'requestDate',
                            title: 'Request Date',
                            type: FieldType.TIME_DATE,
                            span: 3,
                        },
                    ]}
                />

                <FieldBuilder
                    containerClassName="w-full pt-7"
                    record={query.data}
                    isPadding={false}
                    title=" "
                    fields={[
                        {
                            key: 'approveStatus',
                            title: 'Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: temWareHouseRequestApi.getEnumStatus,
                            span: 3,
                        },
                        {
                            key: 'rejectReason',
                            title: 'Reject Reason',
                            type: FieldType.MULTILINE_TEXT,
                            span: 3,
                        },

                        {
                            key: 'warehouseForm.createdDate',
                            title: 'Execution Date',
                            type: FieldType.TIME_DATE,
                            span: 3,
                        },
                    ]}
                />
            </div>
            <div className="flex flex-col  gap-2 rounded-lg bg-white p-4">
                <div className="text-xl font-bold text-black">Delivery Stage </div>

                <FieldBuilder
                    record={query.data?.deliveryStage}
                    isPadding={false}
                    fields={[
                        {
                            key: '',
                            title: 'Po code',
                            type: FieldType.TEXT,
                            span: 2,
                            formatter: (value) => {
                                return query.data?.poCode;
                            },
                        },
                        {
                            key: 'stageOrder',
                            title: 'Stage Order',
                            type: FieldType.TEXT,
                            span: 2,
                        },
                        {
                            key: 'deliveryDate',
                            title: 'Delivery Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'deliveryStatus',
                            title: 'Delivery Status',
                            type: FieldType.BADGE_API,
                            apiAction: deliveryStageApi.getEnumDeliveryStageStatus,
                            span: 2,
                        },
                        {
                            key: 'isSupplemental',
                            title: 'Supplemental',
                            type: FieldType.BOOLEAN,
                            span: 2,
                        },
                        {
                            key: 'totalTypeMaterial',
                            title: 'Total Type Material',
                            type: FieldType.NUMBER,
                            span: 2,
                        },
                        {
                            key: 'totalPrice',
                            title: 'Total Price (VND)',
                            type: FieldType.NUMBER,
                            span: 2,
                        },
                    ]}
                    title=""
                />

                <div className="fade-in pb-8 ">
                    <div className="font-bold">Purchase Materials</div>
                    <Table
                        scroll={{ x: 1400 }}
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
                                        {quantity}
                                    </Table.Summary.Cell>{' '}
                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
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
                        dataSource={query.data?.deliveryStage.purchaseMaterials || []}
                        size="small"
                        pagination={false}
                        columns={[
                            {
                                title: 'Purchase Material Code',
                                key: 'code',
                                render: (record: any) => {
                                    return <FieldDisplay value={record.code} type={FieldType.TEXT} />;
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
                                title: 'Package Quantity',
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
                                title: 'Number per Package',
                                key: 'materialPerPackage',
                                render: (record: any) => {
                                    return <FieldDisplay value={record.materialPerPackage} type={FieldType.NUMBER} />;
                                },
                            },
                            {
                                title: 'Unit',
                                key: 'unit',
                                render: (record: any) => {
                                    return <FieldDisplay value={record.unit} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumUnit} />;
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
                                title: 'Total Price (VND)',
                                key: 'totalPrice',
                                render: (record: any) => {
                                    return <FieldDisplay value={record.totalPrice} type={FieldType.NUMBER} />;
                                },
                            },
                        ]}
                    />
                </div>
            </div>
            {Boolean(query.data?.warehouseForm) && (
                <>
                    <FieldBuilder
                        extra={[
                            <div className="flex items-center gap-2">
                                {isWarehouseStaff &&
                                    query.data?.warehouseForm?.formType === WarehouseFormTypeEnums.IMPORT &&
                                    query.data.approveStatus === TempWarehouseRequestApproveStatus.APPROVED && (
                                        <CTAButton
                                            ctaApi={async () => {
                                                const res = await warehouseFormApi.exportImportWarehouseForm(Number(query.data?.warehouseForm?.id));
                                            }}
                                        >
                                            {(isLoading) => {
                                                return (
                                                    <Button size="small" icon={<DownloadOutlined />} type="primary" loading={isLoading}>
                                                        Export to Excel file
                                                    </Button>
                                                );
                                            }}
                                        </CTAButton>
                                    )}

                                {isWarehouseStaff &&
                                    query.data?.warehouseForm?.formType === WarehouseFormTypeEnums.EXPORT &&
                                    query.data.approveStatus === TempWarehouseRequestApproveStatus.APPROVED && (
                                        <CTAButton
                                            ctaApi={async () => {
                                                const res = await warehouseFormApi.exportExportWarehouseForm(Number(query.data?.warehouseForm?.id));
                                            }}
                                        >
                                            {(isLoading) => {
                                                return (
                                                    <Button size="small" icon={<DownloadOutlined />} type="primary" loading={isLoading}>
                                                        Export to Excel file
                                                    </Button>
                                                );
                                            }}
                                        </CTAButton>
                                    )}
                            </div>,
                        ]}
                        fields={[
                            {
                                key: 'id',
                                title: 'Id',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'formCode',
                                title: 'Form Code',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'formType',
                                title: 'Form Type',
                                type: FieldType.BADGE_API,
                                apiAction: warehouseFormApi.getEnumType,
                                span: 2,
                            },

                            {
                                key: 'poCode',
                                title: 'PO Code',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'receiveCompanyName',
                                title: 'Receive Company Name',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'companyAddress',
                                title: 'Company Address',
                                type: FieldType.TEXT,
                                span: 4,
                            },
                            {
                                key: 'receiveWarehouse',
                                title: 'Receive Warehouse',
                                type: FieldType.BADGE_API,
                                apiAction: warehouseFormApi.getEnumReceiveType,
                                span: 2,
                            },
                            {
                                key: 'totalPrice',
                                title: 'Total Price (VND)',
                                type: FieldType.NUMBER,
                                span: 2,
                            },
                            {
                                key: 'requestStaffName',
                                title: 'Request Staff Name',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'supplierName',
                                title: 'Supplier Name',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'approveWarehouseStaffName',
                                title: 'Approve Warehouse Staff Name',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                        ]}
                        record={query.data?.warehouseForm}
                        title="Warehouse Form"
                    />
                    <div className="flex flex-col gap-4 bg-white p-8">
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-bold text-black">Warehouse Form Materials</div>
                            <div>
                                {!query.data?.warehouseForm?.warehouseFormMaterials.some(
                                    (item) => item.formStatus === WarehouseFormStatusEnum.EXECUTED,
                                ) &&
                                    query.data?.warehouseForm?.formType === WarehouseFormTypeEnums.EXPORT && (
                                        <>
                                            <CTAButton
                                                confirmMessage="Are you sure you want to export materials?"
                                                ctaApi={async () => {
                                                    return await warehouseFormApi.tempExportFormStatus(Number(query.data?.warehouseForm?.id));
                                                }}
                                                isConfirm
                                                extraOnSuccess={() => {
                                                    toast.success('Export materials successfully');
                                                    query.refetch();
                                                }}
                                                extraOnError={(error) => {
                                                    const message = _.get(error, 'data.message', 'Export materials failed');
                                                    toast.error(message);
                                                }}
                                            >
                                                <Button icon={<ExportOutlined />} type="primary" size="small">
                                                    Confirm Quantity
                                                </Button>
                                            </CTAButton>
                                        </>
                                    )}

                                {query.data?.warehouseForm?.warehouseFormMaterials.some(
                                    (item) => item.formStatus === WarehouseFormStatusEnum.PROCESSING,
                                ) &&
                                    query.data?.warehouseForm?.formType === WarehouseFormTypeEnums.IMPORT && (
                                        <>
                                            <CTAButton
                                                ctaApi={async () => {
                                                    return await warehouseFormApi.tempImportFormStatus(query.data?.warehouseForm.id);
                                                }}
                                                confirmMessage="Are you sure you want to confirm quantity?"
                                                isConfirm
                                                extraOnSuccess={() => {
                                                    toast.success('Confirm quantity successfully');
                                                    query.refetch();
                                                }}
                                                extraOnError={(error) => {
                                                    const message = _.get(error, 'data.message', 'Confirm quantity failed');
                                                    toast.error(message);
                                                }}
                                            >
                                                <Button icon={<EditOutlined />} type="primary" size="small">
                                                    Confirm Quantity
                                                </Button>
                                            </CTAButton>
                                            {/* <DrawerBuilder
                                                width="50%"
                                                drawerTitle="Add Form Information"
                                                btnLabel=" Add Form Information"
                                                btnProps={{
                                                    type: 'primary',
                                                    icon: <EditOutlined />,
                                                    size: 'small',
                                                }}
                                            >
                                                {(close) => (
                                                    <div>
                                                        <FormBuilder<IMainImportFormStatusFormDto>
                                                            apiAction={(data) => {
                                                                return warehouseFormApi.getApiTempImportFormStatus({
                                                                    id: data.id,
                                                                    warehouseFormMaterials: data.warehouseFormMaterials.map((item) => {
                                                                        return {
                                                                            id: item.id,
                                                                            receiveQuantity: item.receiveQuantity,
                                                                            executionDate: item.executionDate,
                                                                        };
                                                                    }),
                                                                });
                                                            }}
                                                            onExtraSuccessAction={() => {
                                                                toast.success('Update warehouse form materials successfully');
                                                                query.refetch();
                                                                close();
                                                            }}
                                                            defaultValues={{
                                                                id: query.data?.warehouseForm?.id || 0,
                                                                warehouseFormMaterials:
                                                                    query.data?.warehouseForm?.warehouseFormMaterials.map((item) => {
                                                                        return {
                                                                            id: item.id,
                                                                            receiveQuantity: item.receiveQuantity,
                                                                            materialName: item.materialName,
                                                                            executionDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                            requestQuantity: item.requestQuantity,
                                                                        };
                                                                    }) || [],
                                                            }}
                                                            schema={{
                                                                id: Joi.number().required(),
                                                                warehouseFormMaterials: Joi.array().items(
                                                                    Joi.object({
                                                                        id: Joi.number().required(),
                                                                        receiveQuantity: Joi.number().greater(0).required(),
                                                                        executionDate: Joi.string().min(1).required(),
                                                                    }).options({ allowUnknown: true }),
                                                                ),
                                                            }}
                                                            title=""
                                                            fields={[
                                                                {
                                                                    name: 'warehouseFormMaterials',
                                                                    label: 'Warehouse Form Materials',
                                                                    type: NKFormType.ARRAY,
                                                                    fieldProps: {
                                                                        defaultValues: {
                                                                            id: 0,
                                                                            receiveQuantity: 0,
                                                                            executionDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                        },
                                                                        isAllowAddField: () => false,
                                                                        isAllowDeleteField: () => false,
                                                                        fields: [
                                                                            {
                                                                                name: 'materialName',
                                                                                label: 'Material Name',
                                                                                type: NKFormType.TEXT,
                                                                                fieldProps: {
                                                                                    readOnly: true,
                                                                                },
                                                                                span: 2,
                                                                            },

                                                                            {
                                                                                name: 'executionDate',
                                                                                label: 'Execution Date',
                                                                                type: NKFormType.DATE_TIME,
                                                                                span: 2,
                                                                            },
                                                                            {
                                                                                name: 'requestQuantity',
                                                                                label: 'Request Quantity',
                                                                                type: NKFormType.NUMBER,
                                                                                span: 2,
                                                                                fieldProps: {
                                                                                    readOnly: true,
                                                                                },
                                                                            },
                                                                            {
                                                                                name: 'receiveQuantity',
                                                                                label: 'Receive Quantity',
                                                                                type: NKFormType.NUMBER,
                                                                                span: 2,
                                                                            },
                                                                        ],
                                                                    },
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                )}
                                            </DrawerBuilder> */}
                                        </>
                                    )}
                            </div>
                        </div>
                        <Table
                            scroll={{ x: 1400 }}
                            size="small"
                            pagination={false}
                            dataSource={query.data?.warehouseForm?.warehouseFormMaterials}
                            columns={[
                                {
                                    title: 'No',
                                    key: '',
                                    render: (_record: any, _, index) => {
                                        return <FieldDisplay value={index + 1} type={FieldType.TEXT} />;
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
                                    title: 'Code',
                                    key: 'code',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.materialCode} type={FieldType.TEXT} />;
                                    },
                                },
                                {
                                    title: 'Package',
                                    key: 'purchaseMaterial.package',
                                    render: (record: any) => {
                                        return (
                                            <FieldDisplay
                                                value={record.purchaseMaterial.package}
                                                type={FieldType.BADGE_API}
                                                apiAction={rawMaterialApi.getEnumPackageUnit}
                                            />
                                        );
                                    },
                                },
                                {
                                    title: 'Quantity',
                                    key: 'requestQuantity',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.requestQuantity} type={FieldType.NUMBER} />;
                                    },
                                },
                                {
                                    title: 'Unit',
                                    key: 'purchaseMaterial.unit',
                                    render: (record: any) => {
                                        return (
                                            <FieldDisplay
                                                value={record.purchaseMaterial.unit}
                                                type={FieldType.BADGE_API}
                                                apiAction={rawMaterialApi.getEnumUnit}
                                            />
                                        );
                                    },
                                },
                                {
                                    title: 'Unit Per Package',
                                    key: 'materialPerPackage',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.materialPerPackage} type={FieldType.NUMBER} />;
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
                                    title: 'Package Quanity',
                                    key: 'requestQuantity',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.requestQuantity} type={FieldType.NUMBER} />;
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
                                    title: 'Status',
                                    key: 'formStatus',
                                    render: (record: any) => {
                                        return (
                                            <FieldDisplay
                                                value={record.formStatus}
                                                type={FieldType.BADGE_API}
                                                apiAction={warehouseFormApi.getEnumStatus}
                                            />
                                        );
                                    },
                                },
                                {
                                    title: query.data?.warehouseForm?.formType === WarehouseFormTypeEnums.IMPORT ? 'Import Date' : 'Export Date',
                                    key: 'executionDate',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.executionDate} type={FieldType.TIME_DATE} />;
                                    },
                                },
                            ]}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/temp-warehouse-request/$id/')({
    component: Page,
});
