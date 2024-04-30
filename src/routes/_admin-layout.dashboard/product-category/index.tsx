import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ICreateProductCategoryDto, IUpdateProductCategoryDto, productCategoryApi } from '@/core/api/product-category.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { MaterialCategory } from '@/core/models/materialCategory';
import { ProductCategory } from '@/core/models/productCategory';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}
//
const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isAdmin, isManager } = useSelector<RootState, UserState>((state) => state.user);
    const deleteMaterialCategoryMutation = useMutation({
        mutationFn: (id: number) => productCategoryApi.delete(id),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['productCategory'],
            });
            toast.success('Delete product category successfully');
        },
        onError: () => {
            toast.error('Delete product category failed');
        },
    });

    useDocumentTitle('Product Category');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="productCategory"
                    title="Product Category List"
                    extraButtons={[
                        <>
                            {(isManager || isAdmin) && (
                                <ModalBuilder
                                    btnLabel="Create Product Category"
                                    btnProps={{
                                        icon: <PlusOutlined />,
                                        type: 'primary',
                                    }}
                                >
                                    {(close) => (
                                        <FormBuilder<ICreateProductCategoryDto>
                                            fields={[
                                                {
                                                    label: 'Name',
                                                    name: 'name',
                                                    type: NKFormType.TEXT,
                                                },
                                            ]}
                                            apiAction={productCategoryApi.create}
                                            onExtraSuccessAction={() => {
                                                queryClient.refetchQueries({
                                                    queryKey: ['productCategory'],
                                                });
                                                toast.success('Create product category successfully');
                                                close();
                                            }}
                                            defaultValues={{
                                                name: '',
                                            }}
                                            title="Create Product Category"
                                            schema={{
                                                name: Joi.string().required(),
                                            }}
                                        />
                                    )}
                                </ModalBuilder>
                            )}
                        </>,
                    ]}
                    columns={[
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                    ]}
                    queryApi={productCategoryApi.getAll}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: MaterialCategory) => (
                                <ModalBuilder
                                    btnLabel="View Detail"
                                    btnProps={{
                                        type: 'text',
                                    }}
                                    title="Product Category Detail"
                                >
                                    <FieldBuilder
                                        title=""
                                        record={record}
                                        fields={[
                                            {
                                                key: 'id',
                                                title: 'ID',
                                                type: FieldType.TEXT,
                                                span: 4,
                                            },
                                            {
                                                key: 'name',
                                                title: 'Name',
                                                type: FieldType.TEXT,
                                                span: 4,
                                            },
                                        ]}
                                    />
                                </ModalBuilder>
                            ),
                        },

                        ...(isManager || isAdmin
                            ? [
                                  {
                                      label: (record: ProductCategory) => (
                                          <ModalBuilder
                                              btnLabel="Edit"
                                              btnProps={{
                                                  type: 'text',

                                                  className: 'w-full',
                                              }}
                                              title="Edit Product Category"
                                          >
                                              {(close) => (
                                                  <FormBuilder<IUpdateProductCategoryDto>
                                                      fields={[
                                                          {
                                                              label: 'Name',
                                                              name: 'name',
                                                              type: NKFormType.TEXT,
                                                          },
                                                      ]}
                                                      apiAction={productCategoryApi.update}
                                                      onExtraSuccessAction={() => {
                                                          queryClient.refetchQueries({
                                                              queryKey: ['productCategory'],
                                                          });
                                                          toast.success('Update product category successfully');
                                                          close();
                                                      }}
                                                      defaultValues={{
                                                          name: _get(record, 'name', ''),
                                                          id: _get(record, 'id', 0),
                                                      }}
                                                      title=""
                                                      schema={{
                                                          name: Joi.string().required(),
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
                                              confirmMessage="Are you sure you want to delete this Product Category?"
                                              isConfirm
                                              ctaApi={() => deleteMaterialCategoryMutation.mutate(record.id)}
                                          >
                                              <Button type="text" danger className="w-full">
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
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/product-category/')({
    component: Page,
});
