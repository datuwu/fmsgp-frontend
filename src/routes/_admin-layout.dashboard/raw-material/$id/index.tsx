import React from 'react';

import { PageHeader } from '@ant-design/pro-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Descriptions } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { materialCategoryApi } from '@/core/api/material-category.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const { isPurchasingManager, isAdmin, isManager } = useSelector<RootState, UserState>((state) => state.user);
    const query = useQuery({
        queryKey: ['rawMaterial', id],
        queryFn: async () => {
            return await rawMaterialApi.getById(Number(id));
        },
    });

    const deleteRawMaterialMutation = useMutation({
        mutationFn: (id: number) => rawMaterialApi.delete(id),
        onSuccess: () => {
            toast.success('Delete Raw Material successfully');
            router.push(NKRouter.rawMaterial.list());
        },
        onError: () => {
            toast.error('Delete  Raw Material failed');
        },
    });

    useDocumentTitle(query.data?.name || 'Raw Material Detail');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <PageHeader title={query.data?.name} />
            <Descriptions
                bordered
                className="rounded-lg bg-white p-4"
                title="Raw Material Detail"
                extra={
                    <div className="flex gap-2">
                        {(isAdmin || isManager) && (
                            <>
                                <NKLink href={NKRouter.rawMaterial.edit(Number(id))}>
                                    <Button className="w-full">Edit</Button>
                                </NKLink>
                                <CTAButton
                                    confirmMessage="Are you sure you want to delete this Raw Material?"
                                    isConfirm
                                    ctaApi={() => deleteRawMaterialMutation.mutate(Number(id))}
                                >
                                    <Button type="primary" danger className="w-full">
                                        Delete
                                    </Button>
                                </CTAButton>
                            </>
                        )}
                    </div>
                }
            >
                <Descriptions.Item label="Name">
                    <FieldDisplay value={query.data?.name} type={FieldType.TEXT} />
                </Descriptions.Item>
                <Descriptions.Item label="Code" span={2}>
                    <FieldDisplay value={query.data?.code} type={FieldType.TEXT} />
                </Descriptions.Item>
                <Descriptions.Item label="Color">
                    <FieldDisplay value={query.data?.color} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumColor} />
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                    <FieldDisplay
                        value={query.data?.materialCategoryId}
                        type={FieldType.LINK}
                        apiAction={async (id) => {
                            const category = await materialCategoryApi.getById(id);
                            return {
                                label: category.name,
                            };
                        }}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Shape">
                    <FieldDisplay value={query.data?.shape} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumShape} />
                </Descriptions.Item>
                <Descriptions.Item label="Image" span={3}>
                    <img className="h-40 w-64 object-cover" src={query.data?.imageUrl} alt={query.data?.name} />
                </Descriptions.Item>
                <Descriptions.Item label="Unit" span={2}>
                    <FieldDisplay value={query.data?.unit} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumUnit} />
                </Descriptions.Item>
                <Descriptions.Item label="Package" span={1}>
                    <FieldDisplay value={query.data?.package} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumPackageUnit} />
                </Descriptions.Item>
                <Descriptions.Item label="Estimate Price (VND)" span={3}>
                    <FieldDisplay value={query.data?.estimatePrice} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Description">
                    {query.data?.description}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Diameter Unit">
                    <FieldDisplay value={query.data?.diameterUnit} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getDiameterUnit} />
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Diameter">
                    <FieldDisplay value={query.data?.diameter} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Size Unit">
                    <FieldDisplay value={query.data?.sizeUnitEnum} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getSizeUnit} />
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Length">
                    <FieldDisplay value={query.data?.length} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Width">
                    <FieldDisplay value={query.data?.width} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Height">
                    <FieldDisplay value={query.data?.height} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Weight Unit">
                    <FieldDisplay value={query.data?.weightUnit} type={FieldType.BADGE_API} apiAction={rawMaterialApi.getEnumSize} />
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Weight">
                    <FieldDisplay value={query.data?.weight} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Min Tolerance Weight">
                    <FieldDisplay value={query.data?.minToleranceWeight} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={1} label="Max Tolerance Weight">
                    <FieldDisplay value={query.data?.maxToleranceWeight} type={FieldType.NUMBER} />
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Main Ingredient">
                    <FieldDisplay value={query.data?.mainIngredient} type={FieldType.TEXT} />
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/raw-material/$id/')({
    component: Page,
});
