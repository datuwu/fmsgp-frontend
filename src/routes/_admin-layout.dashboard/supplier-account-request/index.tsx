import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { supplierAccountRequestApi } from '@/core/api/supplier-account-request.api';
import { userApi } from '@/core/api/user.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { SupplierAccountRequest } from '@/core/models/supplierAccountRequest';
import { User } from '@/core/models/user';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isManager, isPurchasingStaff } = useSelector<RootState, UserState>((state) => state.user);

    useDocumentTitle('Supplier Account Request List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="supplier-account-request"
                    title="Supplier Account Request List"
                    extraButtons={
                        <>
                            {isPurchasingStaff && (
                                <NKLink href={NKRouter.supplierAccountRequest.create()}>
                                    <Button icon={<PlusOutlined />} type="primary">
                                        Create new request
                                    </Button>
                                </NKLink>
                            )}
                        </>
                    }
                    columns={[
                        {
                            key: 'companyName',
                            title: 'Company Name',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'companyEmail',
                            title: 'Company Email',
                            type: FieldType.TEXT,
                        },
                        {
                            key: '',
                            title: 'Request Staff',
                            type: FieldType.LINK,
                            apiAction: async (record: SupplierAccountRequest) => {
                                const user = await userApi.getById(record.requestStaffId);

                                return {
                                    label: user.fullName,
                                    link: '',
                                };
                            },
                        },

                        {
                            key: 'approveStatus',
                            title: 'Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: supplierAccountRequestApi.getEnumStatus,
                        },
                    ]}
                    queryApi={supplierAccountRequestApi.getAll}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: User) => (
                                <div>
                                    <Button type="text">
                                        <NKLink href={NKRouter.supplierAccountRequest.detail(record.id)}>Detail</NKLink>
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    filters={[
                        {
                            label: 'Company Name',
                            comparator: FilterComparator.LIKE,
                            name: 'companyName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Company Email',
                            comparator: FilterComparator.LIKE,
                            name: 'companyEmail',
                            type: NKFormType.TEXT,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier-account-request/')({
    component: Page,
});
