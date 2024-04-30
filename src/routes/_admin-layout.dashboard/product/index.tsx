import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import joi from 'joi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { productCategoryApi } from '@/core/api/product-category.api';
import { ICreateProductDto, productApi } from '@/core/api/product.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import CTAButton from '@/core/components/cta/CTABtn';
import DrawerBuilder from '@/core/components/drawer/DrawerBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { PurchasingPlan } from '@/core/models/purchasingPlan';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
//
interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { id, isPurchasingManager, isPurchasingStaff, isManager, isAdmin } = useSelector<RootState, UserState>((state: RootState) => state.user);

    const deleteProductCategoryMutation = useMutation({
        mutationFn: (id: number) => productApi.delete(id),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['product'],
            });
            toast.success('Delete product successfully');
        },
        onError: () => {
            toast.error('Delete product failed');
        },
    });

    useDocumentTitle('Product List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="product"
                    title="Product List"
                    extraButtons={
                        <>
                            {(isManager || isAdmin) && (
                                <>
                                    <DrawerBuilder
                                        btnLabel="Create product"
                                        btnProps={{
                                            icon: <PlusOutlined />,
                                            type: 'primary',
                                        }}
                                        width="50%"
                                    >
                                        {(close) => {
                                            return (
                                                <FormBuilder<ICreateProductDto>
                                                    title="Create Product"
                                                    apiAction={productApi.create}
                                                    onExtraSuccessAction={() => {
                                                        toast.success('Create product successfully');
                                                        close();
                                                        queryClient.refetchQueries({
                                                            queryKey: ['product'],
                                                        });
                                                    }}
                                                    isDebug
                                                    defaultValues={{
                                                        name: '',
                                                        unit: 0,
                                                        description: '',
                                                        note: '',
                                                        productCategoryId: 0,
                                                        productMaterials: [],
                                                        productSize: 0,
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
                                                            name: 'productSize',
                                                            label: 'Product Size',
                                                            span: 2,
                                                            type: NKFormType.SELECT_API_OPTION,
                                                            fieldProps: {
                                                                apiAction: productApi.getProductSize,
                                                            },
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
                                                                        label: 'Material Category',
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
                                                        name: joi.string().required(),
                                                        unit: joi.number().required(),
                                                        description: joi.string().allow('').required(),
                                                        note: joi.string().allow('').required(),
                                                        productSize: joi.number().required(),
                                                        productCategoryId: joi.number().required(),
                                                        productMaterials: joi
                                                            .array()
                                                            .items(
                                                                joi.object({
                                                                    rawMaterialId: joi.number().required(),
                                                                    quantity: joi.number().greater(0).required(),
                                                                }),
                                                            )
                                                            .min(1),
                                                    }}
                                                />
                                            );
                                        }}
                                    </DrawerBuilder>
                                </>
                            )}
                        </>
                    }
                    columns={[
                        {
                            key: 'code',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'productCategory.name',
                            title: 'Category',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'unit',
                            title: 'Unit',
                            type: FieldType.BADGE_API,
                            apiAction: productApi.getProductUnit,
                        },
                        {
                            key: 'createdDate',
                            title: 'Created Date',
                            type: FieldType.TIME_DATE,
                        },
                    ]}
                    queryApi={productApi.getAll}
                    defaultOrderBy="createdDate"
                    actionColumns={[
                        {
                            label: (record: PurchasingPlan) => (
                                <div>
                                    <NKLink href={NKRouter.product.detail(record.id)}>
                                        <Button type="link">View Detail</Button>
                                    </NKLink>
                                </div>
                            ),
                        },
                        ...(isManager || isAdmin
                            ? [
                                  {
                                      label: (record: PurchasingPlan) => (
                                          <CTAButton
                                              ctaApi={() => {
                                                  return deleteProductCategoryMutation.mutate(Number(record.id));
                                              }}
                                              isConfirm
                                              confirmMessage="Are you sure you want to delete this product? This action cannot be undone."
                                          >
                                              <Button type="link" danger>
                                                  Delete
                                              </Button>
                                          </CTAButton>
                                      ),
                                  },
                              ]
                            : []),
                    ]}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'name',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Code',
                            comparator: FilterComparator.LIKE,
                            name: 'code',
                            type: NKFormType.TEXT,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/product/')({
    component: Page,
});
