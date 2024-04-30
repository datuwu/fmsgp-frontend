import { DownloadOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Table } from 'antd';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { deliveryStageApi } from '@/core/api/delivery-stage.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { warehouseFormApi } from '@/core/api/warehouse-form.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { DeliveryStageStatusEnum } from '@/core/models/deliveryStage';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { TempWarehouseRequestApproveStatus } from '@/core/models/tempWarehouseRequest';
import { WarehouseFormStatusEnum, WarehouseFormTypeEnums } from '@/core/models/warehouseForm';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

const Page = () => {
    const queryClient = useQueryClient();
    const { id } = Route.useParams();
    const deliveryStageQuery = useQuery({
        queryKey: ['inspected-delivery-stage', id],
        queryFn: () => deliveryStageApi.getInspected(Number(id)),
    });
    const { isManager, isWarehouseStaff } = useSelector<RootState, UserState>((state) => state.user);
    useDocumentTitle('Inspected Delivery Stage Detail');

    return (
        <div className="fade-in w-full gap-4 space-y-4">
            <div className="flex  gap-2  rounded-lg bg-white p-4">
                <FieldBuilder
                    isPadding={false}
                    containerClassName="w-full"
                    fields={[
                        {
                            title: 'Title',
                            key: 'title',
                            type: FieldType.TEXT,
                            span: 2,
                        },
                        {
                            title: 'PO Code',
                            key: 'poCode',
                            type: FieldType.TEXT,
                            span: 1,
                        },
                        {
                            title: 'Request Date',
                            key: 'requestInspectDate',
                            type: FieldType.TIME_DATE,
                            span: 2,
                        },
                        {
                            title: 'Content',
                            key: 'content',
                            type: FieldType.MULTILINE_TEXT,
                            span: 3,
                        },
                        {
                            title: 'Delivery Stage',
                            key: 'deliveryStageId',
                            type: FieldType.TEXT,
                            span: 1,
                        },
                    ]}
                    record={deliveryStageQuery.data?.inspectionRequest}
                    title="Inspection Request"
                />
            </div>{' '}
            <div className="flex flex-col  gap-2 rounded-lg bg-white p-4">
                <div className="flex flex-col items-start gap-4">
                    <div className="text-xl font-bold text-black">Delivery Stage </div>

                    {deliveryStageQuery.data?.deliveryStatus === DeliveryStageStatusEnum.INSPECTED &&
                        !_.get(deliveryStageQuery.data, 'exportTempWarehouseForm') && (
                            <CTAButton
                                ctaApi={async () => {
                                    const res = await warehouseFormApi.tempExportWarehouseFormDeliveryStage(deliveryStageQuery.data?.id as number);
                                }}
                                extraOnSuccess={() => {
                                    toast.success('Exported Material to Temp Warehouse successfully');

                                    queryClient.invalidateQueries({
                                        queryKey: ['inspected-delivery-stage', id],
                                    });
                                }}
                                extraOnError={(error) => {
                                    const message = _.get(error, 'data.message') || 'An error occurred while exporting materials to Temp Warehouse.';
                                    toast.error(message);
                                }}
                            >
                                {(isLoading) => {
                                    return (
                                        <Button size="small" icon={<DownloadOutlined />} type="primary" loading={isLoading}>
                                            Create Export Temp Warehouse Form
                                        </Button>
                                    );
                                }}
                            </CTAButton>
                        )}

                    {deliveryStageQuery.data?.deliveryStatus === DeliveryStageStatusEnum.TEMPWAREHOUSEEXPORTED &&
                        !_.get(deliveryStageQuery.data, 'importMainWarehouseForm') && (
                            <CTAButton
                                ctaApi={async () => {
                                    const res = await warehouseFormApi.mainImportWarehouseFormDeliveryStage(deliveryStageQuery.data?.id as number);
                                }}
                                extraOnSuccess={() => {
                                    toast.success('Imported Material to Main Warehouse successfully');

                                    queryClient.invalidateQueries({
                                        queryKey: ['inspected-delivery-stage', id],
                                    });
                                }}
                                extraOnError={(error) => {
                                    const message = _.get(error, 'data.message') || 'An error occurred while importing materials to Main Warehouse.';
                                    toast.error(message);
                                }}
                            >
                                {(isLoading) => {
                                    return (
                                        <Button size="small" icon={<DownloadOutlined />} type="primary" loading={isLoading}>
                                            Create Import Main Warehouse Form
                                        </Button>
                                    );
                                }}
                            </CTAButton>
                        )}
                </div>
                <FieldBuilder
                    record={deliveryStageQuery.data}
                    isPadding={false}
                    fields={[
                        {
                            key: '',
                            title: 'Po Code',
                            type: FieldType.TEXT,
                            span: 2,
                            formatter() {
                                return deliveryStageQuery.data?.inspectionRequest?.poCode || 'N/A';
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
                            pageData.forEach(({ afterInspectQuantity, totalPrice }) => {
                                quantity += afterInspectQuantity;
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
                                    <Table.Summary.Cell index={5}>
                                        <FieldDisplay value={price} type={FieldType.NUMBER} />
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                        dataSource={deliveryStageQuery.data?.purchaseMaterials || []}
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
            {Boolean(deliveryStageQuery.data?.importMainWarehouseForm) && (
                <>
                    <FieldBuilder
                        extra={[
                            <div className="flex items-center gap-2">
                                {isWarehouseStaff && (
                                    <>
                                        {deliveryStageQuery.data?.importMainWarehouseForm?.formType === WarehouseFormTypeEnums.IMPORT &&
                                            deliveryStageQuery.data?.inspectionRequest.approveStatus ===
                                                TempWarehouseRequestApproveStatus.APPROVED && (
                                                <CTAButton
                                                    ctaApi={async () => {
                                                        const res = await warehouseFormApi.exportImportWarehouseForm(
                                                            Number(deliveryStageQuery.data?.importMainWarehouseForm?.id),
                                                        );
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

                                        {deliveryStageQuery.data?.importMainWarehouseForm?.formType === WarehouseFormTypeEnums.EXPORT &&
                                            deliveryStageQuery.data?.inspectionRequest.approveStatus ===
                                                TempWarehouseRequestApproveStatus.APPROVED && (
                                                <CTAButton
                                                    ctaApi={async () => {
                                                        const res = await warehouseFormApi.exportExportWarehouseForm(
                                                            Number(deliveryStageQuery.data?.importMainWarehouseForm?.id),
                                                        );
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
                                    </>
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
                        record={deliveryStageQuery.data?.importMainWarehouseForm}
                        title="Import Main Warehouse Form"
                    />
                    <div className="flex flex-col gap-4 bg-white p-8">
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-bold text-black">Import Main Warehouse Form Materials</div>
                            <div>
                                {isWarehouseStaff && (
                                    <>
                                        {!deliveryStageQuery.data?.importMainWarehouseForm?.warehouseFormMaterials.some(
                                            (item) => item.formStatus === WarehouseFormStatusEnum.EXECUTED,
                                        ) &&
                                            deliveryStageQuery.data?.importMainWarehouseForm?.formType === WarehouseFormTypeEnums.EXPORT && (
                                                <>
                                                    <CTAButton
                                                        confirmMessage="Are you sure you want to confirm quantity?"
                                                        ctaApi={async () => {
                                                            return await warehouseFormApi.tempExportFormStatus(
                                                                Number(deliveryStageQuery.data?.importMainWarehouseForm?.id),
                                                            );
                                                        }}
                                                        isConfirm
                                                        extraOnSuccess={() => {
                                                            toast.success('Export materials successfully');
                                                            queryClient.invalidateQueries({
                                                                queryKey: ['inspected-delivery-stage', id],
                                                            });
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

                                        {deliveryStageQuery.data?.importMainWarehouseForm?.warehouseFormMaterials.some(
                                            (item) => item.formStatus === WarehouseFormStatusEnum.PROCESSING,
                                        ) &&
                                            deliveryStageQuery.data?.importMainWarehouseForm?.formType === WarehouseFormTypeEnums.IMPORT && (
                                                <>
                                                    <CTAButton
                                                        ctaApi={async () => {
                                                            return await warehouseFormApi.mainImportFormStatus(
                                                                deliveryStageQuery.data?.importMainWarehouseForm?.id as number,
                                                            );
                                                        }}
                                                        confirmMessage="Are you sure you want to confirm quantity?"
                                                        isConfirm
                                                        extraOnSuccess={() => {
                                                            toast.success('Confirm quantity successfully');

                                                            queryClient.invalidateQueries({
                                                                queryKey: ['inspected-delivery-stage', id],
                                                            });
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
                                                </>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>
                        <Table
                            scroll={{ x: 1400 }}
                            size="small"
                            pagination={false}
                            dataSource={deliveryStageQuery.data?.importMainWarehouseForm?.warehouseFormMaterials}
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
                                    title: 'Request Quantity',
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
                                    title:
                                        deliveryStageQuery.data?.importMainWarehouseForm?.formType === WarehouseFormTypeEnums.IMPORT
                                            ? 'Import Date'
                                            : 'Export Date',
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
            {Boolean(deliveryStageQuery.data?.exportTempWarehouseForm) && (
                <>
                    <FieldBuilder
                        extra={[
                            <div className="flex items-center gap-2">
                                {isWarehouseStaff && (
                                    <>
                                        {deliveryStageQuery.data?.exportTempWarehouseForm?.formType === WarehouseFormTypeEnums.IMPORT &&
                                            deliveryStageQuery.data?.inspectionRequest.approveStatus ===
                                                TempWarehouseRequestApproveStatus.APPROVED && (
                                                <CTAButton
                                                    ctaApi={async () => {
                                                        const res = await warehouseFormApi.exportImportWarehouseForm(
                                                            Number(deliveryStageQuery.data?.exportTempWarehouseForm?.id),
                                                        );
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

                                        {deliveryStageQuery.data?.exportTempWarehouseForm?.formType === WarehouseFormTypeEnums.EXPORT &&
                                            deliveryStageQuery.data?.inspectionRequest.approveStatus ===
                                                TempWarehouseRequestApproveStatus.APPROVED && (
                                                <CTAButton
                                                    ctaApi={async () => {
                                                        const res = await warehouseFormApi.exportExportWarehouseForm(
                                                            Number(deliveryStageQuery.data?.exportTempWarehouseForm?.id),
                                                        );
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
                                    </>
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
                        record={deliveryStageQuery.data?.exportTempWarehouseForm}
                        title="Export Temp Warehouse Form"
                    />
                    <div className="flex flex-col gap-4 bg-white p-8">
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-bold text-black">Export Temp Warehouse Form Materials</div>
                            <div>
                                {isWarehouseStaff && (
                                    <>
                                        {!deliveryStageQuery.data?.exportTempWarehouseForm?.warehouseFormMaterials.some(
                                            (item) => item.formStatus === WarehouseFormStatusEnum.EXECUTED,
                                        ) &&
                                            deliveryStageQuery.data?.exportTempWarehouseForm?.formType === WarehouseFormTypeEnums.EXPORT && (
                                                <>
                                                    <CTAButton
                                                        confirmMessage="Are you sure you want to confirm quantity?"
                                                        ctaApi={async () => {
                                                            return await warehouseFormApi.tempExportFormStatus(
                                                                Number(deliveryStageQuery.data?.exportTempWarehouseForm?.id),
                                                            );
                                                        }}
                                                        isConfirm
                                                        extraOnSuccess={() => {
                                                            toast.success('Export materials successfully');
                                                            queryClient.invalidateQueries({
                                                                queryKey: ['inspected-delivery-stage', id],
                                                            });
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

                                        {deliveryStageQuery.data?.exportTempWarehouseForm?.warehouseFormMaterials.some(
                                            (item) => item.formStatus === WarehouseFormStatusEnum.PROCESSING,
                                        ) &&
                                            deliveryStageQuery.data?.exportTempWarehouseForm?.formType === WarehouseFormTypeEnums.IMPORT && (
                                                <>
                                                    <CTAButton
                                                        ctaApi={async () => {
                                                            return await warehouseFormApi.tempImportFormStatus(
                                                                deliveryStageQuery.data?.exportTempWarehouseForm?.id as number,
                                                            );
                                                        }}
                                                        confirmMessage="Are you sure you want to confirm quantity?"
                                                        isConfirm
                                                        extraOnSuccess={() => {
                                                            toast.success('Confirm quantity successfully');

                                                            queryClient.invalidateQueries({
                                                                queryKey: ['inspected-delivery-stage', id],
                                                            });
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
                                                </>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>
                        <Table
                            scroll={{ x: 1400 }}
                            size="small"
                            pagination={false}
                            dataSource={deliveryStageQuery.data?.exportTempWarehouseForm?.warehouseFormMaterials}
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
                                    title: 'Request Quantity',
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
                                    title:
                                        deliveryStageQuery.data?.exportTempWarehouseForm?.formType === WarehouseFormTypeEnums.IMPORT
                                            ? 'Import Date'
                                            : 'Export Date',
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

export const Route = createFileRoute('/_admin-layout/dashboard/inspected-delivery-stage/$id/')({
    component: Page,
});
