import React from 'react';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { supplierAccountRequestApi } from '@/core/api/supplier-account-request.api';
import { userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { SupplierAccountRequest, SupplierAccountRequestApproveStatus } from '@/core/models/supplierAccountRequest';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const { isManager } = useSelector<RootState, UserState>((state) => state.user);

    const query = useQuery({
        queryKey: ['supplier-account-request', id],
        queryFn: async () => {
            return await supplierAccountRequestApi.getById(Number(id));
        },
    });

    useDocumentTitle('Supplier Account Request Detail');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <FieldBuilder
                extra={[
                    <div className="flex items-center gap-2">
                        {query.data?.approveStatus === SupplierAccountRequestApproveStatus.PENDING && (
                            <>
                                {isManager && (
                                    <>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return supplierAccountRequestApi.approve(Number(id), SupplierAccountRequestApproveStatus.APPROVED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to approve this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Approve supplier account request successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button icon={<CheckOutlined />} type="primary" className="w-full">
                                                Approve
                                            </Button>
                                        </CTAButton>
                                        <CTAButton
                                            ctaApi={async () => {
                                                return supplierAccountRequestApi.approve(Number(id), SupplierAccountRequestApproveStatus.REJECTED);
                                            }}
                                            isConfirm
                                            confirmMessage="Are you sure to reject this request?"
                                            extraOnSuccess={() => {
                                                toast.success('Approve supplier account request successfully');
                                                query.refetch();
                                            }}
                                        >
                                            <Button type="primary" icon={<CloseOutlined />} danger className="w-full">
                                                Reject
                                            </Button>
                                        </CTAButton>
                                    </>
                                )}

                                <NKLink href={NKRouter.supplierAccountRequest.edit(Number(id))}>
                                    <Button icon={<EditOutlined />} className="w-full">
                                        Edit
                                    </Button>
                                </NKLink>

                                <CTAButton
                                    ctaApi={async () => {
                                        return supplierAccountRequestApi.delete(Number(id));
                                    }}
                                    isConfirm
                                    confirmMessage="Are you sure to delete this request?"
                                    extraOnSuccess={() => {
                                        toast.success('Approve supplier account request successfully');
                                        query.refetch();
                                        router.push(NKRouter.supplierAccountRequest.list());
                                    }}
                                >
                                    <Button icon={<DeleteOutlined />} danger className="w-full">
                                        Delete
                                    </Button>
                                </CTAButton>
                            </>
                        )}
                    </div>,
                ]}
                fields={[
                    {
                        key: 'profilePictureUrl',
                        title: 'Profile Picture',
                        type: FieldType.THUMBNAIL,
                    },
                    {
                        key: 'id',
                        title: 'ID',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'requestDate',
                        title: 'Request Date',
                        type: FieldType.TIME_DATE,
                        span: 2,
                    },
                    {
                        key: 'approveStatus',
                        title: 'Approve Status',
                        type: FieldType.BADGE_API,
                        apiAction: supplierAccountRequestApi.getEnumStatus,
                        span: 1,
                    },
                    {
                        key: 'approveDate',
                        title: 'Approve Date',
                        type: FieldType.TIME_DATE,
                        span: 1,
                    },
                    {
                        key: 'email',
                        title: 'Email',
                        type: FieldType.TEXT,
                    },

                    {
                        key: 'fullName',
                        title: 'Full Name',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'phoneNumber',
                        title: 'Phone Number',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'dob',
                        title: 'Date of Birth',
                        type: FieldType.TIME_DATE,
                        span: 1,
                    },
                    {
                        key: 'address',
                        title: 'Address',
                        type: FieldType.TEXT,
                    },

                    {
                        key: '',
                        title: 'Request Staff',
                        type: FieldType.LINK,
                        span: 1,
                        apiAction: async (record: SupplierAccountRequest) => {
                            const user = await userApi.getById(record.requestStaffId);

                            return {
                                label: user?.fullName || 'N/A',
                                link: '',
                            };
                        },
                    },
                    {
                        key: 'approveManagerId',
                        title: 'Approve Manager',
                        type: FieldType.LINK,
                        span: 2,
                        apiAction: async (record: SupplierAccountRequest) => {
                            const user = await userApi.getById(record.approveManagerId);

                            return {
                                label: user?.fullName || 'N/A',
                                link: '',
                            };
                        },
                    },
                ]}
                title="Supplier Account Request"
                record={query.data}
            />
            <FieldBuilder
                fields={[
                    {
                        key: 'companyName',
                        title: 'Company Name',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'companyEmail',
                        title: 'Company Email',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'companyPhone',
                        title: 'Company Phone',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'companyAddress',
                        title: 'Company Address',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'companyTaxCode',
                        title: 'Company Tax Code',
                        type: FieldType.TEXT,
                    },
                ]}
                record={query.data}
                title="Company Information"
            />
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier-account-request/$id/')({
    component: Page,
});
