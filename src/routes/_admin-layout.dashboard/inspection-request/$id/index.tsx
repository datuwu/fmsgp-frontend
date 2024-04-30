import React from 'react';

import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
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
import { ICreateInspectionFormDto, IUpdateInspectionFormStatusDto, inspectionFormApi } from '@/core/api/inspection-form.api';
import { inspectionRequestApi } from '@/core/api/inspection-request.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { warehouseFormApi } from '@/core/api/warehouse-form.api';
import CTAButton from '@/core/components/cta/CTABtn';
import DrawerBuilder from '@/core/components/drawer/DrawerBuilder';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { InspectionRequestApproveStatus } from '@/core/models/inspectionRequest';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const [inspectionRequestRecord, setInspectionRequestRecord] = React.useState<ICreateInspectionFormDto | null>(null);
    const query = useQuery({
        queryKey: ['inspection-request', id],
        queryFn: async () => {
            return await inspectionRequestApi.getById(Number(id));
        },
    });
    const { isPurchasingManager, isAdmin, isManager, isInspector } = useSelector<RootState, UserState>((state) => state.user);

    const packageUnit = useQuery({
        queryKey: ['packageUnit'],
        queryFn: async () => {
            return await rawMaterialApi.getEnumPackageUnit();
        },
        initialData: [],
    });

    useDocumentTitle('Inspection Request Detail');

    if (query.isLoading || packageUnit.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in w-full gap-4 space-y-4">
            <div className="flex  gap-2  rounded-lg bg-white p-4">
                <FieldBuilder
                    extra={[
                        <>
                            {isInspector && (
                                <>
                                    {query.data?.inspectionForm === null &&
                                        query.data?.approveStatus === InspectionRequestApproveStatus.INSPECTED && (
                                            <CTAButton
                                                ctaApi={async () => {
                                                    return inspectionFormApi.fromRequest(Number(id));
                                                }}
                                                isConfirm
                                                confirmMessage="Are you sure you want to import inspection form?"
                                                extraOnSuccess={() => {
                                                    toast.success('Import inspection form successfully');
                                                    query.refetch();
                                                }}
                                                extraOnError={(error) => {
                                                    const message = _.get(error, 'data.message', 'Import inspection form failed');

                                                    toast.error(message);
                                                }}
                                            >
                                                <Button type="primary" icon={<CheckOutlined />} size="small">
                                                    Import Inspection Form
                                                </Button>
                                            </CTAButton>
                                        )}
                                    {query.data?.approveStatus === InspectionRequestApproveStatus.PENDING && (
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
                                                        <FormBuilder<any>
                                                            isDebug
                                                            apiAction={async (data) => {
                                                                await inspectionRequestApi.approve(data);
                                                            }}
                                                            title="Approve Inspection Request"
                                                            schema={{
                                                                approveStatus: Joi.number().required(),
                                                                approvedDate: Joi.any(),
                                                                id: Joi.number().required(),
                                                                rejectReason: Joi.string().allow(''),
                                                            }}
                                                            defaultValues={{
                                                                approveStatus: InspectionRequestApproveStatus.INSPECTED,
                                                                id: query.data?.id || 0,
                                                                approvedDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                rejectReason: '',
                                                            }}
                                                            onExtraSuccessAction={() => {
                                                                toast.success('Approve inspection request successfully');
                                                                query.refetch();
                                                                closeChildren();
                                                            }}
                                                            fields={[
                                                                {
                                                                    name: 'approvedDate',
                                                                    label: 'Approve Date',
                                                                    type: NKFormType.DATE,
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
                                                        <FormBuilder<any>
                                                            apiAction={async (data) => {
                                                                await inspectionRequestApi.approve(data);
                                                            }}
                                                            title="Reject Inspection Request"
                                                            schema={{
                                                                approveStatus: Joi.number().required(),
                                                                approvedDate: Joi.any(),
                                                                id: Joi.number().required(),
                                                                rejectReason: Joi.string().allow(''),
                                                            }}
                                                            defaultValues={{
                                                                approveStatus: InspectionRequestApproveStatus.REJECTED,
                                                                id: query.data?.id || 0,
                                                                approvedDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                                rejectReason: '',
                                                            }}
                                                            onExtraSuccessAction={() => {
                                                                toast.success('Reject inspection request successfully');
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
                    record={query.data}
                    title="Inspection Request"
                />
                <FieldBuilder
                    containerClassName="fade-in flex flex-col gap-4  rounded-lg bg-white  w-full pt-7"
                    record={query.data}
                    isPadding={false}
                    title=" "
                    fields={[
                        {
                            key: 'approveStatus',
                            title: 'Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: inspectionRequestApi.getEnumStatus,
                            span: 3,
                        },
                        {
                            key: 'rejectReason',
                            title: 'Reject Reason',
                            type: FieldType.MULTILINE_TEXT,
                            span: 3,
                        },

                        {
                            key: 'approvedDate',
                            title: 'Execution Date',
                            type: FieldType.TIME_DATE,
                            span: 3,
                        },
                    ]}
                />
            </div>{' '}
            <div className="flex flex-col  gap-2 rounded-lg bg-white p-4">
                <div className="text-xl font-bold text-black">Delivery Stage </div>

                <FieldBuilder
                    record={query.data?.deliveryStage}
                    isPadding={false}
                    fields={[
                        {
                            key: '',
                            title: 'Po Code',
                            type: FieldType.TEXT,
                            span: 2,
                            formatter() {
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
            {Boolean(query.data?.inspectionForm) && (
                <>
                    <FieldBuilder
                        extra={[
                            <>
                                {isInspector && query.data?.approveStatus === InspectionRequestApproveStatus.INSPECTED && (
                                    <CTAButton
                                        ctaApi={async () => {
                                            const res = await warehouseFormApi.exportInspectionForm(Number(query.data?.inspectionForm?.id));
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
                            </>,
                        ]}
                        fields={[
                            {
                                key: 'id',
                                title: 'Id',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'poCode',
                                title: 'PO Code',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'inspectorName',
                                title: 'Inspector Name',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'inspectLocation',
                                title: 'Inspect Location',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'managerName',
                                title: 'Manager Name',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                            {
                                key: 'resultCode',
                                title: 'Result Code',
                                type: FieldType.TEXT,
                                span: 2,
                            },
                        ]}
                        record={query.data?.inspectionForm}
                        title="Inspection Form"
                    />
                    <div className="flex flex-col gap-4 bg-white p-8">
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-bold text-black">Inspect Form Materials</div>
                            <div>
                                {!query.data?.inspectionForm?.materialInspectResults.some(
                                    (item) => item.inspectStatus !== InspectionRequestApproveStatus.PENDING,
                                ) && (
                                    <>
                                        <DrawerBuilder
                                            width="50%"
                                            drawerTitle="Add form information"
                                            btnLabel="Add form information"
                                            btnProps={{
                                                type: 'primary',
                                                icon: <EditOutlined />,
                                                size: 'small',
                                            }}
                                        >
                                            {(close) => (
                                                <div>
                                                    <FormBuilder<IUpdateInspectionFormStatusDto>
                                                        apiAction={(data) => {
                                                            return inspectionFormApi.updateInspectionFormStatus({
                                                                id: data.id,
                                                                resultCode: data.resultCode,
                                                                inspectLocation: data.inspectLocation,
                                                                materialInspectResults: data.materialInspectResults.map((item) => {
                                                                    return {
                                                                        id: item.id,
                                                                        inspectionPassQuantity: item.inspectionPassQuantity,

                                                                        note: item.note,
                                                                        inspectionFailQuantity: item.inspectionFailQuantity,
                                                                    };
                                                                }),
                                                            });
                                                        }}
                                                        onExtraSuccessAction={() => {
                                                            toast.success('Update inspection form materials successfully');
                                                            query.refetch();
                                                            close();
                                                        }}
                                                        onExtraErrorAction={(error) => {
                                                            toast.error(_.get(error, 'data.message', 'Update inspection form materials failed'));
                                                        }}
                                                        defaultValues={{
                                                            id: query.data?.inspectionForm?.id || 0,
                                                            inspectLocation: query.data?.inspectionForm?.inspectLocation || '',
                                                            resultCode: query.data?.inspectionForm?.resultCode || '',
                                                            materialInspectResults:
                                                                query.data?.inspectionForm?.materialInspectResults.map((item) => {
                                                                    console.log(item);
                                                                    const unit = packageUnit.data.find(
                                                                        (unit) => unit.id === item?.purchaseMaterial?.package,
                                                                    );

                                                                    return {
                                                                        id: item.id,
                                                                        inspectionPassQuantity: item.inspectionPassQuantity || 0,

                                                                        note: item.note || '',
                                                                        requestQuantity: item.requestQuantity,
                                                                        materialName: `${item.materialName} (${unit?.label})`,
                                                                        inspectionFailQuantity: item.inspectionFailQuantity || 0,
                                                                    };
                                                                }) || [],
                                                        }}
                                                        schema={{
                                                            id: Joi.number().required(),
                                                            inspectLocation: Joi.string().required(),
                                                            resultCode: Joi.string().required(),
                                                            materialInspectResults: Joi.array().items(
                                                                Joi.object({
                                                                    id: Joi.number().required(),
                                                                    inspectionPassQuantity: Joi.number().greater(0).required(),

                                                                    note: Joi.string().allow(''),
                                                                    inspectionFailQuantity: Joi.number().min(0).required(),
                                                                }).options({ allowUnknown: true }),
                                                            ),
                                                        }}
                                                        title=""
                                                        fields={[
                                                            {
                                                                name: 'inspectLocation',
                                                                label: 'Inspect Location',
                                                                type: NKFormType.TEXT,
                                                                span: 2,
                                                            },
                                                            {
                                                                name: 'resultCode',
                                                                label: 'Result Code',
                                                                type: NKFormType.TEXT,
                                                                span: 2,
                                                            },
                                                            {
                                                                name: 'materialInspectResults',
                                                                label: 'Material Inspect Results',
                                                                type: NKFormType.ARRAY,
                                                                fieldProps: {
                                                                    defaultValues: {
                                                                        inspectionPassQuantity: 0,
                                                                        receiveQuantity: 0,
                                                                        note: '',
                                                                        id: 0,
                                                                    },
                                                                    isAllowAddField: () => false,
                                                                    isAllowDeleteField: () => false,
                                                                    fields: [
                                                                        {
                                                                            name: 'materialName',
                                                                            label: 'Material Name',
                                                                            type: NKFormType.TEXT,
                                                                            span: 2,
                                                                            fieldProps: {
                                                                                readOnly: true,
                                                                            },
                                                                        },

                                                                        {
                                                                            name: 'requestQuantity',
                                                                            label: 'Quantity',
                                                                            type: NKFormType.TEXT,
                                                                            span: 2,
                                                                            fieldProps: {
                                                                                readOnly: true,
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'inspectionPassQuantity',
                                                                            label: 'Inspection Pass Quantity',
                                                                            type: NKFormType.NUMBER,
                                                                            span: 2,
                                                                        },
                                                                        {
                                                                            name: 'inspectionFailQuantity',
                                                                            label: 'Inspection Fail Quantity',
                                                                            type: NKFormType.NUMBER,
                                                                            span: 2,
                                                                        },

                                                                        {
                                                                            name: 'note',
                                                                            label: 'Note',
                                                                            type: NKFormType.TEXTAREA,
                                                                            span: 4,
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            )}
                                        </DrawerBuilder>
                                    </>
                                )}
                            </div>
                        </div>
                        <Table
                            scroll={{ x: 1400 }}
                            size="small"
                            pagination={false}
                            dataSource={query.data?.inspectionForm?.materialInspectResults || []}
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
                                    title: 'Request Package Quantity',
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
                                    title: 'Inspection Pass Quantity',
                                    key: 'inspectionPassQuantity',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.inspectionPassQuantity} type={FieldType.NUMBER} />;
                                    },
                                },
                                {
                                    title: 'Inspection Fail Quantity',
                                    key: 'inspectionFailQuantity',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.inspectionFailQuantity} type={FieldType.NUMBER} />;
                                    },
                                },
                                {
                                    title: 'Status',
                                    key: 'inspectStatus',
                                    render: (record: any) => {
                                        return (
                                            <FieldDisplay
                                                value={record.inspectStatus}
                                                type={FieldType.BADGE_API}
                                                apiAction={warehouseFormApi.getEnumStatus}
                                            />
                                        );
                                    },
                                },
                                {
                                    title: 'Note',
                                    key: 'note',
                                    render: (record: any) => {
                                        return <FieldDisplay value={record.note} type={FieldType.MULTILINE_TEXT} />;
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

export const Route = createFileRoute('/_admin-layout/dashboard/inspection-request/$id/')({
    component: Page,
});
