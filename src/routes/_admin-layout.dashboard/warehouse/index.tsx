import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { ICreateWarehouseDto, IUpdateWarehouseDto, warehouseApi } from '@/core/api/warehouse.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { MaterialCategory } from '@/core/models/materialCategory';
import { WarehouseType } from '@/core/models/warehouse';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { id, isPurchasingManager, isPurchasingStaff, isManager, isAdmin } = useSelector<RootState, UserState>((state: RootState) => state.user);

    // const deleteWarehouseMutation = useMutation({
    //     mutationFn: (id: number) => warehouseApi.delete(id),
    //     onSuccess: () => {
    //         queryClient.refetchQueries({
    //             queryKey: ['warehouse'],
    //         });
    //         toast.success('Delete Warehouse successfully');
    //     },
    //     onError: () => {
    //         toast.error('Delete Warehouse failed');
    //     },
    // });

    useDocumentTitle('Warehouse List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="warehouse"
                    title="Warehouse List"
                    extraButtons={[
                        <>
                            {isAdmin && (
                                <>
                                    <ModalBuilder
                                        btnLabel="Create Warehouse"
                                        btnProps={{
                                            icon: <PlusOutlined />,
                                            type: 'primary',
                                        }}
                                    >
                                        {(close) => (
                                            <FormBuilder<ICreateWarehouseDto>
                                                fields={[
                                                    {
                                                        label: 'Location',
                                                        name: 'location',
                                                        type: NKFormType.TEXT,
                                                        span: 4,
                                                    },
                                                    {
                                                        label: 'Warehouse Type',
                                                        name: 'warehouseType',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: warehouseApi.getEnumTypes,
                                                        },
                                                        span: 4,
                                                    },
                                                ]}
                                                apiAction={warehouseApi.create}
                                                onExtraSuccessAction={() => {
                                                    queryClient.refetchQueries({
                                                        queryKey: ['warehouse'],
                                                    });
                                                    toast.success('Create Material Category successfully');
                                                    close();
                                                }}
                                                defaultValues={{
                                                    location: '',
                                                    warehouseType: WarehouseType.MainWarehouse,
                                                }}
                                                title="Create Warehouse"
                                                schema={{
                                                    location: Joi.string().required(),
                                                    warehouseType: Joi.number().required(),
                                                }}
                                            />
                                        )}
                                    </ModalBuilder>
                                </>
                            )}
                        </>,
                    ]}
                    columns={[
                        {
                            key: 'location',
                            title: 'Location',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'warehouseType',
                            title: 'Warehouse Type',
                            type: FieldType.BADGE_API,
                            apiAction: warehouseApi.getEnumTypes,
                        },
                    ]}
                    queryApi={warehouseApi.getAll}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: MaterialCategory) => (
                                <NKLink href={NKRouter.warehouse.detail(record.id)}>
                                    <Button type="text" className="w-full">
                                        Detail
                                    </Button>
                                </NKLink>
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
                                    title="Edit Warehouse"
                                >
                                    {(close) => (
                                        <FormBuilder<IUpdateWarehouseDto>
                                            fields={[
                                                {
                                                    label: 'Location',
                                                    name: 'location',
                                                    type: NKFormType.TEXT,
                                                    span: 4,
                                                },
                                                {
                                                    label: 'Warehouse Type',
                                                    name: 'warehouseType',
                                                    type: NKFormType.SELECT_API_OPTION,
                                                    fieldProps: {
                                                        apiAction: warehouseApi.getEnumTypes,
                                                    },
                                                    span: 4,
                                                },
                                            ]}
                                            apiAction={warehouseApi.update}
                                            onExtraSuccessAction={() => {
                                                queryClient.refetchQueries({
                                                    queryKey: ['warehouse'],
                                                });
                                                toast.success('Update Warehouse successfully');
                                                close();
                                            }}
                                            defaultValues={{
                                                location: _get(record, 'location', ''),
                                                warehouseType: _get(record, 'warehouseType', WarehouseType.MainWarehouse),
                                                id: _get(record, 'id', 0),
                                            }}
                                            title=""
                                            schema={{
                                                location: Joi.string().required(),
                                                warehouseType: Joi.number().required(),
                                                id: Joi.number().required(),
                                            }}
                                        />
                                    )}
                                </ModalBuilder>
                            ),
                        },
                        {
                            label: (record: MaterialCategory) => (
                                <CTAButton
                                    confirmMessage="Are you sure you want to delete this Warehouse?"
                                    isConfirm
                                    ctaApi={() => deleteWarehouseMutation.mutate(record.id)}
                                >
                                    <Button type="text" danger className="w-full">
                                        Delete
                                    </Button>
                                </CTAButton>
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

export const Route = createFileRoute('/_admin-layout/dashboard/warehouse/')({
    component: Page,
});
