import React from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Switch, Table } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import { X } from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { IDeliveryStageQuantityDto, IStartDeliveringSupplementalDto, deliveryStageApi } from '@/core/api/delivery-stage.api';
import { IUpdatePurchasingStaffPOReportDto, IUpdateStaffPOReportDto, poReportApi } from '@/core/api/po-report.api';
import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import DrawerBuilder from '@/core/components/drawer/DrawerBuilder';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { DeliveryStage, DeliveryStageStatusEnum } from '@/core/models/deliveryStage';
import { POReportResolveStatus, POReportResolveSupplierStatus } from '@/core/models/poReport';
import { PurchaseMaterial } from '@/core/models/purchaseMaterial';
import { PurchaseTask } from '@/core/models/purchaseTask';
import { PurchasingOrderManagerApproveStatus, PurchasingOrderSupplierApproveStatus } from '@/core/models/purchasingOrder';
import { PurchasingPlanApproveStatus } from '@/core/models/purchasingPlan';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const [stageDeliveryId, setStageDeliveryId] = React.useState<number>();
    const [isShowIncludeSupplemental, setIsShowIncludeSupplemental] = React.useState<boolean>(false);
    const router = useNKRouter();
    const { isManager, isPurchasingManager, id: userId, isSupplier, isPurchasingStaff } = useSelector<RootState, UserState>((state) => state.user);

    const userMe = useQuery({
        queryKey: ['user-me', userId],
        queryFn: async () => {
            return await userApi.getById(Number(userId));
        },
    });

    const poReport = useQuery({
        queryKey: ['po-report', id],
        queryFn: async () => {
            const res = await poReportApi.getPurchasingOrderId(Number(id));
            return res[0];
        },
    });

    const query = useQuery({
        queryKey: ['purchasing-order', id],
        queryFn: async () => {
            return await purchasingOrderApi.getById(Number(id));
        },
    });

    const packagesQuery = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            return rawMaterialApi.getEnumPackageUnit();
        },
        initialData: [],
    });

    const purchasingStaffQuery = useQuery({
        queryKey: ['purchasing-staff', query.data?.purchasingStaffId],
        queryFn: () => {
            return userApi.getPurchasingStaff(query.data?.purchasingStaffId as number);
        },
        enabled: Boolean(query.data?.purchasingStaffId),
    });

    useDocumentTitle(query.data?.name || 'Purchasing Order Detail');

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
                                            <NKLink href={NKRouter.purchasingOrder.edit(Number(id))}>
                                                <Button icon={<EditOutlined />} type="primary" className="w-full">
                                                    Edit
                                                </Button>
                                            </NKLink>

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
                                                toast.success('Approve purchasing order successfully');
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
                                                toast.success('Reject purchasing order successfully');
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
                                                {/* <ModalBuilder
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
                                                                poReport.refetch();
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
                                                </ModalBuilder> */}
                                                <CTAButton
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
                                                </CTAButton>
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
                        key: 'poCode',
                        title: 'PO Code',
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
                        key: 'createdBy',
                        title: 'Created By',
                        type: FieldType.TEXT,
                        span: 1,
                        formatter: (record) => {
                            return purchasingStaffQuery.data?.fullName;
                        },
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
                        span: 1,
                    },
                    {
                        key: 'orderStatus',
                        title: 'Order Status',
                        type: FieldType.BADGE_API,
                        apiAction: purchasingOrderApi.getEnumOrderStatus,
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
            {Boolean(poReport.data) && (
                <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4  ">
                    <div className="flex items-center gap-2">
                        <div className="text-xl font-bold text-black">PO Report</div>
                        {poReport.data?.resolveStatus === POReportResolveStatus.PENDING && isSupplier && (
                            <>
                                <ModalBuilder
                                    btnLabel="Edit Report"
                                    btnProps={{
                                        type: 'primary',
                                        icon: <EditOutlined />,
                                        className: 'w-full',
                                    }}
                                >
                                    {(close) => (
                                        <FormBuilder<IUpdateStaffPOReportDto>
                                            defaultValues={{
                                                id: poReport.data?.id || 0,
                                                reportContent: poReport.data?.reportContent || '',
                                                reportTitle: poReport.data?.reportTitle || '',
                                            }}
                                            apiAction={async (data) => {
                                                return poReportApi.update(data);
                                            }}
                                            onExtraSuccessAction={() => {
                                                toast.success('“Update delivery stage quantity success');
                                                poReport.refetch();
                                                close();
                                            }}
                                            onExtraErrorAction={(error: any) => {
                                                toast.error(_get(error, 'response.data.message', 'Update report failed'));
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
                                            schema={{
                                                id: Joi.number().required(),
                                                reportContent: Joi.string().required(),
                                                reportTitle: Joi.string().required(),
                                            }}
                                            title="Edit Report"
                                        />
                                    )}
                                </ModalBuilder>
                            </>
                        )}
                        {poReport.data?.resolveStatus === POReportResolveStatus.PENDING && isPurchasingStaff && userMe.isFetched && (
                            <>
                                <ModalBuilder
                                    btnLabel="Answer Report"
                                    btnProps={{
                                        type: 'primary',
                                        icon: <EditOutlined />,
                                        className: 'w-full',
                                    }}
                                >
                                    {(close) => (
                                        <FormBuilder<IUpdatePurchasingStaffPOReportDto>
                                            defaultValues={{
                                                id: poReport.data?.id || 0,
                                                reportAnswer: poReport.data?.reportAnswer || '',
                                                purchasingStaffId: userMe.data?.purchasingStaffId || 0,
                                            }}
                                            apiAction={async (data) => {
                                                return poReportApi.updatePurchasingStaff(data);
                                            }}
                                            onExtraSuccessAction={() => {
                                                toast.success('Update report successfully');
                                                poReport.refetch();
                                                close();
                                            }}
                                            onExtraErrorAction={(error: any) => {
                                                toast.error(_get(error, 'response.data.message', 'Update report failed'));
                                            }}
                                            fields={[
                                                {
                                                    label: 'Report Answer',
                                                    name: 'reportAnswer',
                                                    type: NKFormType.TEXTAREA,
                                                    span: 4,
                                                },
                                            ]}
                                            schema={{
                                                id: Joi.number().required(),
                                                purchasingStaffId: Joi.number().required(),
                                                reportAnswer: Joi.string().required(),
                                            }}
                                            title="Edit Report"
                                        />
                                    )}
                                </ModalBuilder>
                            </>
                        )}
                        {poReport.data?.resolveStatus === POReportResolveStatus.RESOLVED &&
                            poReport.data?.supplierApprovingStatus === POReportResolveSupplierStatus.PENDING &&
                            isSupplier &&
                            userMe.isFetched && (
                                <>
                                    <CTAButton
                                        ctaApi={async () => {
                                            return poReportApi.updateResolve(poReport.data?.id || 0, POReportResolveSupplierStatus.APPROVED);
                                        }}
                                        isConfirm
                                        confirmMessage="Are you sure to approve this report?"
                                        extraOnSuccess={() => {
                                            toast.success('Approve report successfully');
                                            poReport.refetch();
                                        }}
                                    >
                                        <Button icon={<CheckOutlined />} type="primary">
                                            Approved
                                        </Button>
                                    </CTAButton>
                                    <CTAButton
                                        ctaApi={async () => {
                                            return poReportApi.updateResolve(poReport.data?.id || 0, POReportResolveSupplierStatus.REJECTED);
                                        }}
                                        isConfirm
                                        confirmMessage="Are you sure to reject this report?"
                                        extraOnSuccess={() => {
                                            toast.success('Reject report successfully');
                                            poReport.refetch();
                                        }}
                                    >
                                        <Button icon={<DeleteOutlined />} type="primary" danger>
                                            Rejected
                                        </Button>
                                    </CTAButton>
                                </>
                            )}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 ">
                            <FieldBuilder
                                isPadding={false}
                                title=""
                                fields={[
                                    {
                                        key: 'id',
                                        title: 'ID',
                                        type: FieldType.TEXT,
                                        span: 1,
                                    },

                                    {
                                        key: 'supplierId',
                                        title: 'Supplier',
                                        type: FieldType.LINK,
                                        span: 2,
                                        apiAction: async (id) => {
                                            const suppliers = await userApi.getSuppliers();
                                            const supplier = suppliers.find((supplier) => supplier?.supplierId === id);

                                            return {
                                                label: supplier?.email,
                                                href: '#',
                                            };
                                        },
                                    },

                                    {
                                        key: 'purchasingOrderId',
                                        title: 'Purchasing Order',
                                        type: FieldType.BADGE_API,
                                        apiAction: purchasingOrderApi.getSelect,
                                        span: 2,
                                    },

                                    {
                                        key: 'reportTitle',
                                        title: 'Report Title',
                                        type: FieldType.TEXT,
                                    },
                                    {
                                        key: 'reportContent',
                                        title: 'Report Content',
                                        type: FieldType.MULTILINE_TEXT,
                                    },
                                    {
                                        key: 'supplierApprovingStatus',
                                        title: 'Status',
                                        type: FieldType.BADGE_API,
                                        apiAction: poReportApi.getSupplierStatusEnum,
                                    },
                                    {
                                        key: 'lastModifiedDate',
                                        title: 'Last Modified Date',
                                        type: FieldType.TIME_DATE,
                                    },
                                ]}
                                record={poReport.data}
                            />
                        </div>
                        <div className="flex-1 ">
                            <FieldBuilder
                                isPadding={false}
                                title=""
                                fields={[
                                    {
                                        key: 'purchasingStaffId',
                                        title: 'Purchasing Staff',
                                        type: FieldType.LINK,
                                        apiAction: async (id) => {
                                            const purchasingStaff = await userApi.getPurchasingStaff(id);

                                            return {
                                                label: purchasingStaff?.email,
                                            };
                                        },
                                        span: 2,
                                    },
                                    {
                                        key: 'resolveStatus',
                                        title: 'Status',
                                        type: FieldType.BADGE_API,
                                        apiAction: poReportApi.getEnumStatus,
                                        span: 1,
                                    },
                                    {
                                        key: 'reportAnswer',
                                        title: 'Report Answer',
                                        type: FieldType.MULTILINE_TEXT,
                                    },
                                ]}
                                record={poReport.data}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4  ">
                <div className="text-xl font-bold text-black">Order Detail</div>

                <Table
                    dataSource={query.data?.orderMaterials || []}
                    size="small"
                    columns={[
                        {
                            title: 'Code',
                            key: 'code',
                            render: (record: any) => {
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
                            title: 'Package Quantity',
                            key: 'packageQuantity',
                            render: (record: any) => {
                                return <FieldDisplay value={record.packageQuantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Package Unit',
                            key: 'rawMaterial',
                            render: (record: any) => {
                                return (
                                    <FieldDisplay
                                        value={record.rawMaterialId}
                                        type={FieldType.BADGE_API}
                                        apiAction={rawMaterialApi.getEnumPackageWithMaterialId}
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
                            title: 'Total Quantity',
                            key: 'totalQuantity',
                            render: (record: any) => {
                                const totalQuantity = record.packageQuantity * record.materialPerPackage;

                                return (
                                    <div className="flex items-center gap-1">
                                        <FieldDisplay value={totalQuantity} type={FieldType.NUMBER} />
                                        <FieldDisplay
                                            value={record.rawMaterialId}
                                            type={FieldType.BADGE_API}
                                            apiAction={rawMaterialApi.getEnumUnitWithMaterialId}
                                        />
                                    </div>
                                );
                            },
                        },
                        {
                            title: 'Total Price (VND)',
                            key: 'materialTotalPrice',
                            render: (record: any) => {
                                const totalPrice = record.packagePrice * record.packageQuantity;

                                return <FieldDisplay value={totalPrice} type={FieldType.NUMBER} />;
                            },
                        },
                    ]}
                    pagination={false}
                />
            </div>
            <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4 ">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-black">Delivery Stage</div>
                    <div className="flex items-center gap-1 font-semibold "></div>
                </div>
                <Table
                    scroll={{ x: 1024 }}
                    dataSource={(query.data?.deliveryStages || [])

                        .filter((stage: any) => {
                            if (stage.isSupplemental && stage.deliveryStatus === DeliveryStageStatusEnum.SupInactive) {
                                return false;
                            }

                            return true;
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
                                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={3} colSpan={1}>
                                                        <FieldDisplay value={quantity} type={FieldType.NUMBER} />
                                                    </Table.Summary.Cell>
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
                                        dataSource={record.purchaseMaterials || []}
                                        size="small"
                                        pagination={false}
                                        columns={[
                                            {
                                                title: 'Material Code',
                                                key: 'code',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.code} type={FieldType.TEXT} />;
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
                                                title: 'Package Quantity',
                                                key: 'totalQuantity',
                                                render: (record: any) => {
                                                    return <FieldDisplay value={record.totalQuantity} type={FieldType.NUMBER} />;
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
                                                title: 'Delivery Quantity',
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
                            );
                        },
                    }}
                    rowClassName={(record, index) => {
                        console.log(record);
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
                            title: 'Supplemental',
                            key: 'deliveryStatus',
                            render: (record: any) => {
                                return <FieldDisplay value={record.isSupplemental} type={FieldType.BOOLEAN} />;
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
                        {
                            title: '',
                            key: 'action',
                            render: (record: DeliveryStage) => {
                                if (!isPurchasingStaff || isSupplier || isManager) return null;

                                return (
                                    <div className="flex gap-2 pr-16">
                                        {record.deliveryStatus === DeliveryStageStatusEnum.APPROVED && (
                                            <>
                                                {record.isSupplemental ? (
                                                    <>
                                                        <ModalBuilder
                                                            btnLabel="Perform delivering"
                                                            btnProps={{
                                                                type: 'primary',
                                                                icon: <CheckOutlined />,
                                                                className: 'w-full',
                                                                size: 'small',
                                                            }}
                                                        >
                                                            <FormBuilder<IStartDeliveringSupplementalDto>
                                                                apiAction={deliveryStageApi.startDeliveringSupplemental}
                                                                defaultValues={{
                                                                    deliveryDate: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                                                                    deliveryStageId: record.id,
                                                                }}
                                                                title="Start Delivering Supplemental"
                                                                schema={{
                                                                    deliveryDate: Joi.date().min('now').required(),
                                                                    deliveryStageId: Joi.number().required(),
                                                                }}
                                                                onExtraErrorAction={(error: any) => {
                                                                    toast.error(_get(error, 'data.message', 'Update report failed'));
                                                                }}
                                                                onExtraSuccessAction={() => {
                                                                    toast.success('Update report successfully');
                                                                    query.refetch();
                                                                }}
                                                                fields={[
                                                                    {
                                                                        label: 'Delivery Date',
                                                                        name: 'deliveryDate',
                                                                        type: NKFormType.DATE,
                                                                    },
                                                                ]}
                                                            />
                                                        </ModalBuilder>
                                                    </>
                                                ) : (
                                                    <CTAButton
                                                        ctaApi={async () => {
                                                            return deliveryStageApi.updateStatus(record.id, DeliveryStageStatusEnum.DELIVERING);
                                                        }}
                                                        isConfirm
                                                        confirmMessage="Are you sure to deliver this stage?"
                                                        extraOnSuccess={() => {
                                                            toast.success('Deliver stage successfully');
                                                            query.refetch();
                                                        }}
                                                    >
                                                        <Button size="small" icon={<CheckOutlined />} type="primary">
                                                            Perform delivering
                                                        </Button>
                                                    </CTAButton>
                                                )}
                                                {!record.isSupplemental && (
                                                    <>
                                                        <CTAButton
                                                            ctaApi={async () => {
                                                                return deliveryStageApi.cancel(record.id);
                                                            }}
                                                            isConfirm
                                                            confirmMessage="Are you sure to cancel this stage"
                                                            extraOnSuccess={() => {
                                                                toast.success('Cancel stage successfully');
                                                                query.refetch();
                                                            }}
                                                        >
                                                            <Button
                                                                size="small"
                                                                icon={<X className="h-4 w-4" />}
                                                                type="primary"
                                                                className="flex items-center "
                                                                danger
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </CTAButton>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {record.deliveryStatus === DeliveryStageStatusEnum.DELIVERING && (
                                            // <CTAButton
                                            //     ctaApi={async () => {
                                            //         return deliveryStageApi.updateStatus(record.id, DeliveryStageStatusEnum.DELIVERED);
                                            //     }}
                                            //     isConfirm
                                            //     confirmMessage="Are you sure to deliver this stage?"
                                            //     extraOnSuccess={() => {
                                            //         toast.success('Deliver stage successfully');
                                            //         query.refetch();
                                            //     }}
                                            // >
                                            //     <Button size="small" icon={<CheckOutlined />} type="primary">
                                            //         Perform Delivered
                                            //     </Button>
                                            // </CTAButton>
                                            <>
                                                <DrawerBuilder
                                                    btnLabel="Perform Delivered"
                                                    drawerTitle="Perform Delivered"
                                                    btnProps={{
                                                        size: 'small',
                                                        type: 'primary',
                                                        icon: <CheckOutlined />,
                                                        className: 'w-full',
                                                    }}
                                                    width="30%"
                                                >
                                                    {(close) => {
                                                        return (
                                                            <FormBuilder<IDeliveryStageQuantityDto>
                                                                defaultValues={{
                                                                    id: record.id,
                                                                    purchaseMaterials: record.purchaseMaterials.map((purchaseMaterial) => {
                                                                        const _package = packagesQuery.data.find(
                                                                            (p) => p.id === purchaseMaterial.package,
                                                                        );
                                                                        return {
                                                                            id: purchaseMaterial.id,
                                                                            name: `${purchaseMaterial.materialName} - ${_package?.name}`,
                                                                            deliveredQuantity: purchaseMaterial.totalQuantity,
                                                                            // deliveryDate: new Date(), TODO: change when have api
                                                                        };
                                                                    }),
                                                                }}
                                                                onExtraErrorAction={(error: any) => {
                                                                    toast.error(_get(error, 'data.message', 'Update report failed'));
                                                                }}
                                                                onExtraSuccessAction={() => {
                                                                    toast.success('Update report successfully');
                                                                    query.refetch();
                                                                    close();
                                                                }}
                                                                apiAction={deliveryStageApi.updateQuantity}
                                                                fields={[
                                                                    {
                                                                        label: 'Purchase Materials',
                                                                        name: 'purchaseMaterials',
                                                                        type: NKFormType.ARRAY,

                                                                        fieldProps: {
                                                                            isAllowAddField: () => false,
                                                                            isAllowDeleteField: () => false,
                                                                            defaultValues: {
                                                                                id: 0,
                                                                                deliveredQuantity: 0,
                                                                            },
                                                                            fields: [
                                                                                {
                                                                                    label: 'Material Name',
                                                                                    name: 'name',
                                                                                    type: NKFormType.TEXT,
                                                                                    fieldProps: {
                                                                                        readOnly: true,
                                                                                    },
                                                                                },
                                                                                {
                                                                                    label: 'Delivered Quantity',
                                                                                    name: 'deliveredQuantity',
                                                                                    type: NKFormType.NUMBER,
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ]}
                                                                schema={{
                                                                    id: Joi.number().required(),
                                                                    purchaseMaterials: Joi.array().items(
                                                                        Joi.object({
                                                                            id: Joi.number().required(),
                                                                            deliveredQuantity: Joi.number().required(),
                                                                        }).options({ allowUnknown: true }),
                                                                    ),
                                                                }}
                                                                title=""
                                                            />
                                                        );
                                                    }}
                                                </DrawerBuilder>
                                                <CTAButton
                                                    ctaApi={async () => {
                                                        return deliveryStageApi.cancel(record.id);
                                                    }}
                                                    isConfirm
                                                    confirmMessage="Are you sure to cancel this stage"
                                                    extraOnSuccess={() => {
                                                        toast.success('Cancel stage successfully');
                                                        query.refetch();
                                                    }}
                                                    extraOnError={(error) => {
                                                        toast.error(_get(error, 'data.message', 'Cancel stage failed'));
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        icon={<X className="h-4 w-4" />}
                                                        type="primary"
                                                        className="flex items-center "
                                                        danger
                                                    >
                                                        Cancel
                                                    </Button>
                                                </CTAButton>
                                            </>
                                        )}
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

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-order/$id/')({
    component: Page,
});
