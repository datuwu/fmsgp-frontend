import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Table } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { productCategoryApi } from '@/core/api/product-category.api';
import { IUpdateProductDto, productApi } from '@/core/api/product.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import CTAButton from '@/core/components/cta/CTABtn';
import DrawerBuilder from '@/core/components/drawer/DrawerBuilder';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { ProductMaterial } from '@/core/models/productMaterial';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';


interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const { isManager, isPurchasingManager, isSupplier, isAdmin } = useSelector<RootState, UserState>((state) => state.user);

    const deleteProductCategoryMutation = useMutation({
        mutationFn: (id: number) => productApi.delete(id),
        onSuccess: () => {
            router.push(NKRouter.product.list());
            toast.success('Delete product successfully');
        },
        onError: () => {
            toast.error('Delete product failed');
        },
    });

    const query = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            return await productApi.getById(Number(id));
        },
    });

    useDocumentTitle(`Product ${query.data?.code}`);

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <FieldBuilder
                record={query.data}
                title="Product Detail"
                extra={[
                    <div className="flex items-center gap-2">
                        {(isManager || isAdmin) && (
                            <>
                                <DrawerBuilder
                                    btnLabel="Update product"
                                    btnProps={{
                                        icon: <EditOutlined />,
                                        type: 'primary',
                                    }}
                                    width="50%"
                                >
                                    {(close) => {
                                        return (
                                            <FormBuilder<IUpdateProductDto>
                                                title="Update Product"
                                                apiAction={productApi.update}
                                                onExtraSuccessAction={() => {
                                                    toast.success('Update product successfully');
                                                    close();
                                                    query.refetch();
                                                }}
                                                defaultValues={{
                                                    id: _get(query.data, 'id', 0),
                                                    name: _get(query.data, 'name', ''),
                                                    unit: _get(query.data, 'unit', 0),
                                                    description: _get(query.data, 'description', ''),
                                                    note: _get(query.data, 'note', ''),
                                                    productCategoryId: _get(query.data, 'productCategoryId', 0),
                                                    productMaterials: _get(query.data, 'productMaterials', []),
                                                    productSize: _get(query.data, 'productSize', 0),
                                                }}
                                                fields={[
                                                    {
                                                        name: 'name',
                                                        label: 'Name',
                                                        type: NKFormType.TEXT,
                                                        span: 2,
                                                    },
                                                    {
                                                        name: 'unit',
                                                        label: 'Unit',
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        span: 2,
                                                        fieldProps: {
                                                            apiAction: productApi.getProductUnit,
                                                        },
                                                    },

                                                    {
                                                        name: 'description',
                                                        label: 'Description',
                                                        type: NKFormType.TEXTAREA,
                                                    },
                                                    {
                                                        name: 'note',
                                                        label: 'Note',
                                                        type: NKFormType.TEXTAREA,
                                                    },
                                                    {
                                                        name: 'productCategoryId',
                                                        label: 'Category',
                                                        span: 2,
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: productCategoryApi.getEnumSelectOption,
                                                        },
                                                    },
                                                    {
                                                        name: 'productSize',
                                                        label: 'Product Size',
                                                        span: 2,
                                                        type: NKFormType.SELECT_API_OPTION,
                                                        fieldProps: {
                                                            apiAction: productApi.getProductSize,
                                                        },
                                                    },
                                                    {
                                                        name: 'productMaterials',
                                                        label: 'Materials',
                                                        type: NKFormType.ARRAY,
                                                        fieldProps: {
                                                            defaultValues: {
                                                                rawMaterialId: 0,
                                                                quantity: 0,
                                                            },
                                                            fields: [
                                                                {
                                                                    label: 'Raw Material',
                                                                    name: 'rawMaterialId',
                                                                    type: NKFormType.SELECT_API_OPTION,
                                                                    fieldProps: {
                                                                        apiAction: rawMaterialApi.getEnumSelectOption,
                                                                    },
                                                                    span: 2,
                                                                },
                                                                {
                                                                    label: 'Quantity',
                                                                    name: 'quantity',
                                                                    type: NKFormType.NUMBER,
                                                                    span: 2,
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ]}
                                                schema={{
                                                    id: joi.number().required(),
                                                    name: joi.string().required(),
                                                    unit: joi.number().required(),
                                                    description: joi.string().required(),
                                                    note: joi.string().allow('').required(),
                                                    productSize: joi.number().required(),
                                                    productCategoryId: joi.number().required(),
                                                    productMaterials: joi
                                                        .array()
                                                        .items(
                                                            joi
                                                                .object({
                                                                    rawMaterialId: joi.number().required(),
                                                                    quantity: joi.number().greater(0).required(),
                                                                })
                                                                .options({
                                                                    allowUnknown: true,
                                                                }),
                                                        )
                                                        .min(1),
                                                }}
                                            />
                                        );
                                    }}
                                </DrawerBuilder>
                                <CTAButton
                                    ctaApi={() => {
                                        return deleteProductCategoryMutation.mutate(Number(id));
                                    }}
                                    isConfirm
                                    confirmMessage="Are you sure you want to delete this product? This action cannot be undone."
                                >
                                    <Button type="primary" danger icon={<DeleteOutlined />}>
                                        Delete
                                    </Button>
                                </CTAButton>
                            </>
                        )}
                    </div>,
                ]}
                fields={[
                    {
                        key: 'id',
                        title: 'Id',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'name',
                        title: 'Name',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'code',
                        title: 'Code',
                        type: FieldType.TEXT,
                        span: 3,
                    },

                    {
                        key: 'productCategory.name',
                        title: 'Category',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'unit',
                        title: 'Unit',
                        type: FieldType.BADGE_API,
                        span: 1,
                        apiAction: productApi.getProductUnit,
                    },
                    {
                        key: 'productSize',
                        title: 'Product Size',
                        type: FieldType.BADGE_API,
                        span: 1,
                        apiAction: productApi.getProductSize,
                    },

                    {
                        key: 'createdDate',
                        title: 'Created Date',
                        type: FieldType.TIME_DATE,
                        span: 1,
                    },
                    {
                        key: 'createdBy',
                        title: 'Created By',
                        type: FieldType.TEXT,
                        span: 1,
                    },
                    {
                        key: 'description',
                        title: 'Description',
                        type: FieldType.TEXT,
                        span: 3,
                    },
                    {
                        key: 'note',
                        title: 'Note',
                        type: FieldType.TEXT,
                        span: 3,
                    },
                ]}
            />
            <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-4 ">
                <div className="text-xl font-bold text-black">Product Materials</div>
                <Table
                    pagination={false}
                    size="small"
                    columns={[
                        {
                            title: 'Code',
                            key: 'id',
                            render: (record: ProductMaterial) => (
                                <FieldDisplay
                                    value={record.rawMaterialId}
                                    type={FieldType.BADGE_API}
                                    apiAction={rawMaterialApi.getEnumCodeSelectOption}
                                />
                            ),
                        },
                        {
                            title: 'Raw Material',
                            key: 'rawMaterialId',
                            render: (record: ProductMaterial) => (
                                <FieldDisplay
                                    value={record.rawMaterialId}
                                    type={FieldType.LINK}
                                    apiAction={async (value) => {
                                        const rawMaterial = await rawMaterialApi.getById(value);
                                        return {
                                            label: rawMaterial.name,
                                        };
                                    }}
                                />
                            ),
                        },
                        {
                            title: 'Quantity',
                            key: 'quantity',
                            render: (record: ProductMaterial) => <FieldDisplay value={record.quantity} type={FieldType.NUMBER} />,
                        },
                        {
                            title: 'Unit',
                            key: 'unit',
                            render: (record: ProductMaterial) => (
                                <FieldDisplay
                                    value={record.rawMaterialId}
                                    type={FieldType.BADGE_API}
                                    apiAction={rawMaterialApi.getEnumUnitWithMaterialId}
                                />
                            ),
                        },
                    ]}
                    dataSource={query.data?.productMaterials}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/product/$id/')({
    component: Page,
});
