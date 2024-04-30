import React, { useEffect } from 'react';

import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Table } from 'antd';
import joi from 'joi';
import _ from 'lodash';
import _get from 'lodash/get';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { productApi } from '@/core/api/product.api';
import { ICreateProductionPlanDto, IUploadProductionPlanDto, productionPlanApi } from '@/core/api/production-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import { userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import DrawerBuilder from '@/core/components/drawer/DrawerBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { User } from '@/core/models/user';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

//interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { id, isAdmin, isManager } = useSelector<RootState, UserState>((state: RootState) => state.user);
    const [importRecord, setImportRecord] = React.useState<any>(null);
    const [expectedMaterials, setExpectedMaterials] = React.useState<any>([]);
    const productList = useQuery({
        queryKey: ['product'],
        queryFn: () => {
            return productApi.getAll();
        },
        initialData: [],
    });

    useEffect(() => {
        if (productList.data.length && importRecord) {
            const expectedMaterials = importRecord.productInPlans
                .filter((item: any) => Boolean(item.productId))
                .map((item: any) => {
                    const product = productList.data.find((product: any) => Number(product.id) === Number(item.productId));

                    const rawMaterials = product?.productMaterials.map((rawMaterial: any) => {
                        return {
                            rawMaterialId: rawMaterial.rawMaterialId,
                            requireQuantity: rawMaterial.quantity * item.quantity,
                        };
                    });

                    return rawMaterials;
                })

                .flat()
                // group by rawMaterialId
                .reduce((acc: any, item: any) => {
                    const existing = acc.find((accItem: any) => accItem.rawMaterialId === item.rawMaterialId);
                    if (existing) {
                        existing.requireQuantity += item.requireQuantity;
                    } else {
                        acc.push(item);
                    }
                    return acc;
                }, []);

            setExpectedMaterials(expectedMaterials);
        }
    }, [productList.data, importRecord]);

    useDocumentTitle('Production Plan List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="production-plan"
                    title="Production Plan List"
                    extraButtons={
                        <>
                            {(isAdmin || isManager) && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <DrawerBuilder
                                            btnLabel="Create production plan"
                                            btnProps={{
                                                icon: <PlusOutlined />,
                                                type: 'primary',
                                            }}
                                            drawerTitle="Create Production Plan"
                                            width="50%"
                                        >
                                            {(close) => {
                                                return (
                                                    <div className="flex flex-col">
                                                        {Boolean(importRecord) && Boolean(expectedMaterials.length) ? (
                                                            <div>
                                                                <div>
                                                                    <Button
                                                                        onClick={() => {
                                                                            setImportRecord(null);
                                                                            setExpectedMaterials([]);
                                                                        }}
                                                                    >
                                                                        Back
                                                                    </Button>
                                                                </div>
                                                                <FormBuilder<ICreateProductionPlanDto>
                                                                    apiAction={(data) => {
                                                                        return productionPlanApi.create({
                                                                            ...data,
                                                                            expectedMaterials: expectedMaterials,
                                                                        });
                                                                    }}
                                                                    onExtraSuccessAction={() => {
                                                                        toast.success('Create production plan successfully');
                                                                        queryClient.refetchQueries({
                                                                            queryKey: ['production-plan'],
                                                                        });
                                                                        close();
                                                                    }}
                                                                    onExtraErrorAction={(error) => {
                                                                        toast.error(_.get(error, 'data.message', 'Create production plan failed'));
                                                                    }}
                                                                    defaultValues={{
                                                                        expectedMaterials: expectedMaterials,
                                                                        name: _get(importRecord, 'name', ''),
                                                                        note: _get(importRecord, 'note', ''),
                                                                        planEndDate: _get(importRecord, 'planEndDate', moment().toString()),
                                                                        planStartDate: _get(importRecord, 'planStartDate', moment().toString()),
                                                                        productInPlans: _get(importRecord, 'productInPlans', []).map((item: any) => ({
                                                                            productId: item.productId,
                                                                            quantity: item.quantity,
                                                                        })),
                                                                    }}
                                                                    schema={{
                                                                        note: joi.string().allow(''),
                                                                        name: joi.string().required(),
                                                                        planStartDate: joi.date().required(),
                                                                        planEndDate: joi.date().required(),
                                                                        productInPlans: joi
                                                                            .array()
                                                                            .items(
                                                                                joi.object({
                                                                                    productId: joi.number().required(),
                                                                                    quantity: joi.number().greater(0).required(),
                                                                                }),
                                                                            )
                                                                            .min(1)
                                                                            .required(),
                                                                        expectedMaterials: joi
                                                                            .array()
                                                                            .items(
                                                                                joi.object({
                                                                                    rawMaterialId: joi.number().required(),
                                                                                    requireQuantity: joi.number().greater(0).required(),
                                                                                }),
                                                                            )
                                                                            .min(1)
                                                                            .required(),
                                                                    }}
                                                                    title=""
                                                                    fields={[
                                                                        {
                                                                            name: 'name',
                                                                            label: 'Name',
                                                                            type: NKFormType.TEXT,
                                                                        },
                                                                        {
                                                                            name: 'planStartDate',
                                                                            label: 'Plan Start Date',
                                                                            type: NKFormType.DATE,
                                                                            span: 2,
                                                                        },
                                                                        {
                                                                            name: 'planEndDate',
                                                                            label: 'Plan End Date',
                                                                            type: NKFormType.DATE,
                                                                            span: 2,
                                                                        },
                                                                        {
                                                                            name: 'note',
                                                                            label: 'Note',
                                                                            type: NKFormType.TEXTAREA,
                                                                        },
                                                                        {
                                                                            name: 'productInPlans',
                                                                            label: 'Product In Plans',
                                                                            type: NKFormType.ARRAY,

                                                                            fieldProps: {
                                                                                onExtraOnRemoveField: (
                                                                                    value: any,
                                                                                    formMethods: any,
                                                                                    name: string,
                                                                                ) => {
                                                                                    const formValues = formMethods.getValues();
                                                                                    setImportRecord(formValues);
                                                                                },
                                                                                onExtraOnAddField: (value: any, formMethods: any, name: string) => {
                                                                                    const formValues = formMethods.getValues();
                                                                                    setImportRecord(formValues);
                                                                                },
                                                                                defaultValues: {
                                                                                    productId: 0,
                                                                                    quantity: 1,
                                                                                },
                                                                                fields: [
                                                                                    {
                                                                                        name: 'productId',
                                                                                        label: 'Product',
                                                                                        type: NKFormType.SELECT_API_OPTION,
                                                                                        fieldProps: {
                                                                                            apiAction: productApi.getEnumSelectOptionWithCodeAndUnit,
                                                                                        },
                                                                                        span: 2,
                                                                                        onChangeExtra: (value: any, path, formMethods) => {
                                                                                            const formValues = formMethods.getValues();
                                                                                            setImportRecord(formValues);
                                                                                        },
                                                                                    },
                                                                                    {
                                                                                        name: 'quantity',
                                                                                        label: 'Quantity',
                                                                                        type: NKFormType.NUMBER,
                                                                                        span: 2,
                                                                                        onChangeExtra: (value: any, path, formMethods) => {
                                                                                            const formValues = formMethods.getValues();
                                                                                            setImportRecord(formValues);
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        },
                                                                    ]}
                                                                />
                                                                <div className="flex flex-col gap-4 px-4">
                                                                    <div className="flex items-center justify-between font-semibold  text-black">
                                                                        Expected Materials
                                                                    </div>
                                                                    <Table
                                                                        bordered
                                                                        size="small"
                                                                        columns={[
                                                                            {
                                                                                title: 'Code',
                                                                                key: 'code',
                                                                                render: (record: any) => {
                                                                                    return (
                                                                                        <FieldDisplay
                                                                                            type={FieldType.BADGE_API}
                                                                                            apiAction={rawMaterialApi.getEnumCodeSelectOption}
                                                                                            value={record.rawMaterialId}
                                                                                        />
                                                                                    );
                                                                                },
                                                                            },
                                                                            {
                                                                                title: 'Raw Material',
                                                                                key: 'rawMaterialId',
                                                                                render: (record: any) => {
                                                                                    return (
                                                                                        <FieldDisplay
                                                                                            type={FieldType.BADGE_API}
                                                                                            apiAction={rawMaterialApi.getEnumSelectOptionWithoutUnit}
                                                                                            value={record.rawMaterialId}
                                                                                        />
                                                                                    );
                                                                                },
                                                                            },
                                                                            {
                                                                                title: 'Require Quantity',
                                                                                key: 'requireQuantity',
                                                                                render: (record: any) => {
                                                                                    return (
                                                                                        <FieldDisplay
                                                                                            type={FieldType.NUMBER}
                                                                                            value={record.requireQuantity}
                                                                                        />
                                                                                    );
                                                                                },
                                                                            },
                                                                            {
                                                                                title: 'Unit',
                                                                                key: 'rawMaterialId',
                                                                                render: (record: any) => (
                                                                                    <FieldDisplay
                                                                                        value={record.rawMaterialId}
                                                                                        type={FieldType.BADGE_API}
                                                                                        apiAction={rawMaterialApi.getEnumUnitWithMaterialId}
                                                                                    />
                                                                                ),
                                                                            },
                                                                        ]}
                                                                        dataSource={expectedMaterials}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <FormBuilder<IUploadProductionPlanDto>
                                                                    title=""
                                                                    apiAction={productionPlanApi.upload}
                                                                    onExtraSuccessAction={(data) => {
                                                                        setImportRecord(data);

                                                                        // toast.success('Create production plan successfully');

                                                                        // queryClient.refetchQueries({
                                                                        //     queryKey: ['production-plan'],
                                                                        // });
                                                                    }}
                                                                    onExtraErrorAction={(error) => {
                                                                        toast.error(_.get(error, 'data.message', 'Create production plan failed'));
                                                                    }}
                                                                    defaultValues={{
                                                                        formFile: null,
                                                                    }}
                                                                    fields={[
                                                                        {
                                                                            name: 'formFile',
                                                                            label: '',
                                                                            type: NKFormType.CUSTOM,
                                                                            fieldProps: {
                                                                                apiAction: () => {
                                                                                    return (
                                                                                        <div className="flex flex-col gap-2">
                                                                                            <div>Sample File</div>
                                                                                            <div>
                                                                                                <NKLink
                                                                                                    href="https://docs.google.com/spreadsheets/d/1vQmMzFnoXo-SKlwMeKy9drJ4QvwbvV2GKIB00vXw36w/edit#gid=1554656618"
                                                                                                    target="_blank"
                                                                                                >
                                                                                                    <Button
                                                                                                        icon={<DownloadOutlined />}
                                                                                                        size="small"
                                                                                                        type="primary"
                                                                                                    >
                                                                                                        Download
                                                                                                    </Button>
                                                                                                </NKLink>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            name: 'formFile',
                                                                            label: 'File',
                                                                            type: NKFormType.UPLOAD_FILE_DIRECT,
                                                                            fieldProps: {
                                                                                accept: '.xlsx',
                                                                            },
                                                                        },
                                                                    ]}
                                                                    schema={{
                                                                        formFile: joi.any().required(),
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            }}
                                        </DrawerBuilder>
                                    </div>
                                </>
                            )}
                        </>
                    }
                    columns={[
                        {
                            key: 'productionPlanCode',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'managerId',
                            title: 'Manager',
                            type: FieldType.LINK,
                            apiAction: async (value: number) => {
                                const data = await userApi.getById(value);
                                return {
                                    link: '',
                                    label: data.fullName,
                                };
                            },
                        },

                        {
                            key: 'planStartDate',
                            title: 'Plan Start Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'planEndDate',
                            title: 'Plan End Date',
                            type: FieldType.TIME_DATE,
                        },
                    ]}
                    queryApi={productionPlanApi.getAll}
                    defaultOrderBy="createdDate"
                    actionColumns={[
                        {
                            label: (record: User) => (
                                <div className="flex flex-col">
                                    <Button type="link" onClick={() => router.push(NKRouter.productionPlan.detail(record.id))}>
                                        Detail
                                    </Button>

                                    {(isAdmin || isManager) && (
                                        <>
                                            <CTAButton
                                                ctaApi={() => {
                                                    return productionPlanApi.delete(record.id);
                                                }}
                                                extraOnSuccess={() => {
                                                    toast.success('Delete production plan successfully');
                                                    queryClient.refetchQueries({
                                                        queryKey: ['production-plan'],
                                                    });
                                                }}
                                                isConfirm
                                                confirmMessage='Are you sure you want to delete this "Production Plan"?'
                                            >
                                                <Button type="link" danger>
                                                    Delete
                                                </Button>
                                            </CTAButton>
                                        </>
                                    )}
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
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/production-plan/')({
    component: Page,
});
