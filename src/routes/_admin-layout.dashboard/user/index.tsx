import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { User } from '@/core/models/user';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    useDocumentTitle('User List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="account"
                    title="User List"
                    columns={[
                        {
                            key: 'staffCode',
                            title: 'Staff Code',
                            type: FieldType.TEXT,
                            render: (record: User) => record.staffCode || 'N/A',
                        },
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
                    queryApi={userApi.getAll}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: User) => (
                                <ModalBuilder
                                    btnLabel="View Detail"
                                    btnProps={{
                                        type: 'text',
                                        size: 'small',
                                    }}
                                    title="Account Detail"
                                    width={'800px'}
                                >
                                    <FieldBuilder
                                        title=""
                                        record={record}
                                        fields={[
                                            {
                                                key: 'profilePictureUrl',
                                                title: 'Profile Picture',
                                                type: FieldType.THUMBNAIL,
                                                span: 4,
                                            },
                                            {
                                                key: 'id',
                                                title: 'ID',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },
                                            {
                                                key: 'staffCode',
                                                title: 'Staff Code',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },
                                            {
                                                key: 'email',
                                                title: 'Email',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },
                                            {
                                                key: 'fullName',
                                                title: 'Full Name',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },

                                            {
                                                key: 'phoneNumber',
                                                title: 'Phone Number',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },
                                            {
                                                key: 'dob',
                                                title: 'Date of Birth',
                                                type: FieldType.TIME_DATE,
                                                span: 2,
                                            },
                                            {
                                                key: 'address',
                                                title: 'Address',
                                                type: FieldType.MULTILINE_TEXT,
                                                span: 4,
                                            },
                                            {
                                                key: 'accountStatus',
                                                title: 'Account Status',
                                                type: FieldType.BADGE_API,
                                                apiAction: userApi.getStatus,
                                                span: 2,
                                            },
                                            {
                                                key: 'roleId',
                                                title: 'Role',
                                                type: FieldType.BADGE_API,
                                                apiAction: userApi.getRoles,
                                                span: 2,
                                            },
                                        ]}
                                    />
                                </ModalBuilder>
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

export const Route = createFileRoute('/_admin-layout/dashboard/user/')({
    component: Page,
});
