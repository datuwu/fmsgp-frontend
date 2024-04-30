import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IUpdatePurchasingStaffPOReportDto, IUpdateStaffPOReportDto, poReportApi } from '@/core/api/po-report.api';
import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { POReport, POReportResolveStatus, POReportResolveSupplierStatus } from '@/core/models/poReport';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';


interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { id, isPurchasingManager, isPurchasingStaff, isSupplier } = useSelector<RootState, UserState>((state: RootState) => state.user);

    const userMe = useQuery({
        queryKey: ['user-me', id],
        queryFn: async () => {
            return await userApi.getById(Number(id));
        },
    });
    useDocumentTitle('PO Report List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="po-report"
                    title="PO Report List"
                    columns={[
                        {
                            key: 'id',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'purchasingOrderId',
                            title: 'Purchasing Order',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingOrderApi.getSelect,
                        },
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
                        },
                        {
                            key: 'supplierId',
                            title: 'Supplier',
                            type: FieldType.LINK,
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
                            key: 'supplierApprovingStatus',
                            title: 'Supplier Status',
                            type: FieldType.BADGE_API,
                            apiAction: poReportApi.getSupplierStatusEnum,
                        },
                        {
                            key: 'resolveStatus',
                            title: 'Status',
                            type: FieldType.BADGE_API,
                            apiAction: poReportApi.getEnumStatus,
                        },

                        {
                            key: 'lastModifiedDate',
                            title: 'Last Modified Date',
                            type: FieldType.TIME_DATE,
                        },
                    ]}
                    queryApi={poReportApi.getAll}
                    defaultOrderBy="createdDate"
                    actionColumns={[
                        {
                            label: (record: POReport) => (
                                <div>
                                    <ModalBuilder btnLabel="View" btnProps={{}} width="80%" title="">
                                        {(parentClose) => (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xl font-bold text-black">PO Report</div>
                                                    {record?.resolveStatus === POReportResolveStatus.PENDING && isSupplier && (
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
                                                                            id: record?.id || 0,
                                                                            reportContent: record?.reportContent || '',
                                                                            reportTitle: record?.reportTitle || '',
                                                                        }}
                                                                        apiAction={async (data) => {
                                                                            return poReportApi.update(data);
                                                                        }}
                                                                        onExtraSuccessAction={() => {
                                                                            toast.success('Update report successfully');
                                                                            queryClient.refetchQueries({
                                                                                queryKey: ['po-report'],
                                                                            });

                                                                            close();
                                                                            parentClose();
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
                                                    {record?.resolveStatus === POReportResolveStatus.PENDING &&
                                                        isPurchasingStaff &&
                                                        userMe.isFetched && (
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
                                                                                id: record?.id || 0,
                                                                                reportAnswer: record?.reportAnswer || '',
                                                                                purchasingStaffId: userMe.data?.purchasingStaffId || 0,
                                                                            }}
                                                                            apiAction={async (data) => {
                                                                                return poReportApi.updatePurchasingStaff(data);
                                                                            }}
                                                                            onExtraSuccessAction={() => {
                                                                                toast.success('Update report successfully');
                                                                                queryClient.refetchQueries({
                                                                                    queryKey: ['po-report'],
                                                                                });
                                                                                close();
                                                                                parentClose();
                                                                            }}
                                                                            onExtraErrorAction={(error: any) => {
                                                                                toast.error(
                                                                                    _get(error, 'response.data.message', 'Update report failed'),
                                                                                );
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
                                                    {record?.resolveStatus === POReportResolveStatus.RESOLVED &&
                                                        record?.supplierApprovingStatus === POReportResolveSupplierStatus.PENDING &&
                                                        isSupplier &&
                                                        userMe.isFetched && (
                                                            <>
                                                                <CTAButton
                                                                    ctaApi={async () => {
                                                                        return poReportApi.updateResolve(
                                                                            record?.id || 0,
                                                                            POReportResolveSupplierStatus.APPROVED,
                                                                        );
                                                                    }}
                                                                    isConfirm
                                                                    confirmMessage="Are you sure to approve this report?"
                                                                    extraOnSuccess={() => {
                                                                        toast.success('Approve report successfully');
                                                                        queryClient.refetchQueries({
                                                                            queryKey: ['po-report'],
                                                                        });
                                                                        parentClose();
                                                                    }}
                                                                >
                                                                    <Button icon={<CheckOutlined />} type="primary">
                                                                        Approved
                                                                    </Button>
                                                                </CTAButton>
                                                                <CTAButton
                                                                    ctaApi={async () => {
                                                                        return poReportApi.updateResolve(
                                                                            record?.id || 0,
                                                                            POReportResolveSupplierStatus.REJECTED,
                                                                        );
                                                                    }}
                                                                    isConfirm
                                                                    confirmMessage="Are you sure to reject this report?"
                                                                    extraOnSuccess={() => {
                                                                        toast.success('Reject report successfully');
                                                                        queryClient.refetchQueries({
                                                                            queryKey: ['po-report'],
                                                                        });
                                                                        parentClose();
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
                                                            record={record}
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
                                                            record={record}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </ModalBuilder>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/po-report/')({
    component: Page,
});
