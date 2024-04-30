import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';

import { NKRouter } from '@/core/NKRouter';
import { userApi } from '@/core/api/user.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { User } from '@/core/models/user';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    useDocumentTitle('Supplier List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="supplier"
                    title="Supplier List"
                    extraButtons={
                        <NKLink href={NKRouter.supplier.create()}>
                            <Button icon={<PlusOutlined />} type="primary">
                                Create Supplier
                            </Button>
                        </NKLink>
                    }
                    columns={[
                        {
                            key: 'profilePictureUrl',
                            title: 'Image',
                            type: FieldType.THUMBNAIL,
                        },
                        {
                            key: 'fullName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'email',
                            title: 'Email',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'phoneNumber',
                            title: 'Phone',
                            type: FieldType.TEXT,
                        },
                    ]}
                    queryApi={userApi.getSuppliers}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: User) => (
                                <div>
                                    <Button type="text">
                                        <NKLink href={NKRouter.supplier.detail(record.id)}>Detail</NKLink>
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Email',
                            comparator: FilterComparator.LIKE,
                            name: 'email',
                            type: NKFormType.TEXT,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier/')({
    component: Page,
});
