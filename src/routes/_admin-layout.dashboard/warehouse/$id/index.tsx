import React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Descriptions, Popover, Table } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { ICreateWarehouseMaterialDto, IUpdateWarehouseMaterialDto, warehouseMaterialApi } from '@/core/api/warehouse-material.api';
import { IUpdateWarehouseDto, warehouseApi } from '@/core/api/warehouse.api';
import { queryClient } from '@/core/common/configGlobal';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBadgeApi from '@/core/components/field/FieldBadgeApi';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { RawMaterial } from '@/core/models/rawMaterial';
import { WarehouseType } from '@/core/models/warehouse';
import { WarehouseMaterial } from '@/core/models/warehouseMaterial';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();

    const query = useQuery({
        queryKey: ['warehouse', id],
        queryFn: async () => {
            return await warehouseApi.getById(Number(id));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => warehouseApi.delete(id),
        onSuccess: () => {
            toast.success('Delete Warehouse successfully');
            router.push(NKRouter.warehouse.list());
        },
        onError: () => {
            toast.error('Delete warehouse failed');
        },
    });

    const deleteWarehouseMaterialMutation = useMutation({
        mutationFn: (id: number) => warehouseMaterialApi.delete(id),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['warehouse'],
            });
            toast.success('Delete Warehouse Material successfully');
        },
        onError: () => {
            toast.error('Delete Warehouse Material failed');
        },
    });

    useDocumentTitle('Warehouse Detail');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <PageHeader title={query.data?.location} />
            <Descriptions
                bordered
                className="rounded-lg bg-white p-4"
                title="Warehouse Detail"
                extra={
                    <div className="flex gap-2">
                        <ModalBuilder
                            btnLabel="Edit"
                            btnProps={{
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
                                        location: _get(query.data, 'location', ''),
                                        warehouseType: _get(query.data, 'warehouseType', WarehouseType.MainWarehouse),
                                        id: Number(id),
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

                        <CTAButton
                            confirmMessage="Are you sure you want to delete this Raw Material?"
                            isConfirm
                            ctaApi={() => deleteMutation.mutate(Number(id))}
                        >
                            <Button type="primary" danger className="w-full">
                                Delete
                            </Button>
                        </CTAButton>
                    </div>
                }
            >
                <Descriptions.Item label="ID">{query.data?.id}</Descriptions.Item>
                <Descriptions.Item label="Location">{query.data?.location}</Descriptions.Item>
                <Descriptions.Item label="Warehouse Type">
                    <FieldBadgeApi value={query.data?.warehouseType} apiAction={warehouseApi.getEnumTypes} />
                </Descriptions.Item>
            </Descriptions>
            <Card
                title="Warehouse Materials"
                extra={
                    <div className="flex gap-2">
                        <ModalBuilder
                            btnLabel="Add Warehouse Material"
                            btnProps={{
                                icon: <PlusOutlined />,
                                type: 'primary',
                            }}
                        >
                            {(close) => (
                                <FormBuilder<ICreateWarehouseMaterialDto>
                                    fields={[
                                        {
                                            label: 'Raw Material',
                                            name: 'rawMaterialId',
                                            type: NKFormType.SELECT_API_OPTION,
                                            span: 4,
                                            fieldProps: {
                                                apiAction: rawMaterialApi.getEnumSelectOption,
                                            },
                                        },
                                        {
                                            label: 'Quantity',
                                            name: 'quantity',
                                            type: NKFormType.NUMBER,
                                            span: 4,
                                        },
                                    ]}
                                    apiAction={warehouseMaterialApi.create}
                                    onExtraSuccessAction={() => {
                                        queryClient.refetchQueries({
                                            queryKey: ['warehouse'],
                                        });
                                        toast.success('Add Warehouse Material successfully');
                                        close();
                                    }}
                                    defaultValues={{
                                        quantity: 0,
                                        rawMaterialId: 0,
                                        warehouseId: Number(id),
                                    }}
                                    title="Add Warehouse Material"
                                    schema={{
                                        quantity: Joi.number().greater(0).required(),
                                        rawMaterialId: Joi.number().min(1).required(),
                                        warehouseId: Joi.number().min(1).required(),
                                    }}
                                />
                            )}
                        </ModalBuilder>
                    </div>
                }
            >
                <Table
                    bordered
                    columns={[
                        {
                            title: 'ID',
                            dataIndex: 'id',
                            key: 'id',
                        },
                        {
                            title: 'Raw Material',
                            dataIndex: 'rawMaterial',
                            key: 'rawMaterial',
                            render: (props: RawMaterial) => {
                                return <div>{props.name}</div>;
                            },
                        },
                        {
                            title: 'Quantity',

                            key: 'quantity',
                            render: (props: WarehouseMaterial) => {
                                return <FieldDisplay value={props.quantity} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: 'Total Price (VND)',
                            key: 'totalPrice',
                            render: (props: WarehouseMaterial) => {
                                return <FieldDisplay value={props.totalPrice} type={FieldType.NUMBER} />;
                            },
                        },
                        {
                            title: '',
                            key: 'action',
                            render: (props: WarehouseMaterial) => {
                                return (
                                    <Popover
                                        content={
                                            <div className="flex flex-col gap-2">
                                                <ModalBuilder
                                                    btnLabel="Edit"
                                                    btnProps={{
                                                        className: 'w-full',
                                                    }}
                                                >
                                                    {(close) => (
                                                        <FormBuilder<IUpdateWarehouseMaterialDto>
                                                            fields={[
                                                                {
                                                                    label: 'Quantity',
                                                                    name: 'quantity',
                                                                    type: NKFormType.NUMBER,
                                                                    span: 4,
                                                                },
                                                            ]}
                                                            apiAction={warehouseMaterialApi.update}
                                                            onExtraSuccessAction={() => {
                                                                queryClient.refetchQueries({
                                                                    queryKey: ['warehouse'],
                                                                });
                                                                toast.success('Add Warehouse Material successfully');
                                                                close();
                                                            }}
                                                            defaultValues={{
                                                                quantity: _get(props, 'quantity', 0),
                                                                id: _get(props, 'id', 0),
                                                            }}
                                                            title="Update Warehouse Material"
                                                            schema={{
                                                                quantity: Joi.number().greater(0).required(),
                                                                id: Joi.number().min(1).required(),
                                                            }}
                                                        />
                                                    )}
                                                </ModalBuilder>
                                                <CTAButton
                                                    confirmMessage="Are you sure you want to delete this Warehouse Material?"
                                                    isConfirm
                                                    ctaApi={() => deleteWarehouseMaterialMutation.mutate(props.id)}
                                                >
                                                    <Button type="primary" danger className="w-full">
                                                        Delete
                                                    </Button>
                                                </CTAButton>
                                            </div>
                                        }
                                    >
                                        <Button
                                            icon={
                                                <div className="text-xl">
                                                    <HiOutlineDotsVertical />
                                                </div>
                                            }
                                        ></Button>
                                    </Popover>
                                );
                            },
                        },
                    ]}
                    dataSource={query.data?.warehouseMaterials}
                    rowKey={(record) => record.id}
                    loading={query.isLoading}
                />
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/warehouse/$id/')({
    component: Page,
});
