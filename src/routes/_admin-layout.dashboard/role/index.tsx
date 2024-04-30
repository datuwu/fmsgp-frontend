import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Joi from 'joi';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { ICreateRoleDto, IUpdateRoleDto, roleApi } from '@/core/api/role.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { MaterialCategory } from '@/core/models/materialCategory';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    //useDocumentTitle('User Role List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="role"
                    title="User Role List"
                    extraButtons={[
                        <ModalBuilder
                            btnLabel="Create User Role"
                            btnProps={{
                                icon: <PlusOutlined />,
                                type: 'primary',
                            }}
                        >
                            {(close) => (
                                <FormBuilder<ICreateRoleDto>
                                    fields={[
                                        {
                                            label: 'Name',
                                            name: 'name',
                                            type: NKFormType.TEXT,
                                        },
                                        {
                                            label: 'Description',
                                            name: 'description',
                                            type: NKFormType.TEXTAREA,
                                        },
                                    ]}
                                    apiAction={roleApi.create}
                                    onExtraSuccessAction={() => {
                                        queryClient.refetchQueries({
                                            queryKey: ['role'],
                                        });
                                        toast.success('Create User Role successfully');
                                        close();
                                    }}
                                    defaultValues={{
                                        name: '',
                                        description: '',
                                    }}
                                    title="Create Role"
                                    schema={{
                                        name: Joi.string().required(),
                                        description: Joi.string().required(),
                                    }}
                                />
                            )}
                        </ModalBuilder>,
                    ]}
                    columns={[
                        {
                            key: 'id',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.TEXT,
                        },
                    ]}
                    queryApi={roleApi.getAll}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: MaterialCategory) => (
                                <ModalBuilder
                                    btnLabel="View Detail"
                                    btnProps={{
                                        type: 'text',
                                    }}
                                    title="Material Category Detail"
                                >
                                    <FieldBuilder
                                        title=""
                                        record={record}
                                        fields={[
                                            {
                                                key: 'id',
                                                title: 'ID',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },
                                            {
                                                key: 'name',
                                                title: 'Name',
                                                type: FieldType.TEXT,
                                                span: 2,
                                            },
                                        ]}
                                    />
                                </ModalBuilder>
                            ),
                        },
                        {
                            label: (record: MaterialCategory) => (
                                <ModalBuilder
                                    btnLabel="Edit"
                                    btnProps={{
                                        type: 'text',

                                        className: 'w-full',
                                    }}
                                    title="Edit Role"
                                >
                                    {(close) => (
                                        <FormBuilder<IUpdateRoleDto>
                                            fields={[
                                                {
                                                    label: 'Name',
                                                    name: 'name',
                                                    type: NKFormType.TEXT,
                                                },
                                                {
                                                    label: 'Description',
                                                    name: 'description',
                                                    type: NKFormType.TEXTAREA,
                                                },
                                            ]}
                                            apiAction={roleApi.update}
                                            onExtraSuccessAction={() => {
                                                queryClient.refetchQueries({
                                                    queryKey: ['role'],
                                                });
                                                toast.success('Update Role successfully');
                                                close();
                                            }}
                                            defaultValues={{
                                                name: _get(record, 'name', ''),
                                                id: _get(record, 'id', 0),
                                                description: _get(record, 'description', ''),
                                            }}
                                            title=""
                                            schema={{
                                                name: Joi.string().required(),
                                                id: Joi.number().required(),
                                                description: Joi.string().required(),
                                            }}
                                        />
                                    )}
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
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/role/')({
    component: Page,
});
