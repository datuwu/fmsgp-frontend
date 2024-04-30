import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { materialCategoryApi } from '@/core/api/material-category.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { RawMaterial } from '@/core/models/rawMaterial';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isPurchasingManager, isAdmin, isManager } = useSelector<RootState, UserState>((state) => state.user);

    const deleteRawMaterialMutation = useMutation({
        mutationFn: (id: number) => rawMaterialApi.delete(id),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['rawMaterial'],
            });
            toast.success('Delete Raw Material successfully');
        },
        onError: () => {
            toast.error('Delete  Raw Material failed');
        },
    });

    useDocumentTitle('Raw Material List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="rawMaterial"
                    title="Raw Material List"
                    extraButtons={[
                        <>
                            {(isAdmin || isManager) && (
                                <>
                                    <NKLink href={NKRouter.rawMaterial.create()}>
                                        <Button type="primary">Create Raw Material</Button>
                                    </NKLink>
                                </>
                            )}
                        </>,
                    ]}
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
                            key: 'imageUrl',
                            title: 'Image',
                            type: FieldType.THUMBNAIL,
                        },

                        {
                            key: 'description',
                            title: 'Description',
                            type: FieldType.MULTILINE_TEXT,
                        },
                        {
                            key: 'package',
                            title: 'Package',
                            type: FieldType.BADGE_API,
                            apiAction: rawMaterialApi.getEnumPackageUnit,
                        },
                        {
                            key: 'unit',
                            title: 'Unit',
                            type: FieldType.BADGE_API,
                            apiAction: rawMaterialApi.getEnumUnit,
                        },
                        {
                            key: 'materialCategoryId',
                            title: 'Category',
                            type: FieldType.LINK,
                            apiAction: async (id) => {
                                const category = await materialCategoryApi.getById(id);
                                return {
                                    label: category.name,
                                };
                            },
                        },
                        {
                            key: 'shape',
                            title: 'Shape',
                            type: FieldType.BADGE_API,
                            apiAction: rawMaterialApi.getEnumShape,
                        },
                        {
                            key: 'color',
                            title: 'Color',
                            type: FieldType.BADGE_API,
                            apiAction: rawMaterialApi.getEnumColor,
                        },
                    ]}
                    queryApi={rawMaterialApi.getAll}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: RawMaterial) => (
                                <NKLink href={NKRouter.rawMaterial.detail(record.id)}>
                                    <Button type="text" className="w-full">
                                        View Detail
                                    </Button>
                                </NKLink>
                            ),
                        },

                        ...(isAdmin || isManager
                            ? [
                                  {
                                      label: (record: RawMaterial) => (
                                          <NKLink href={NKRouter.rawMaterial.edit(record.id)}>
                                              <Button type="text" className="w-full">
                                                  Edit Raw Material
                                              </Button>
                                          </NKLink>
                                      ),
                                  },
                                  {
                                      label: (record: RawMaterial) => (
                                          <CTAButton
                                              confirmMessage="Are you sure you want to delete this Raw Material?"
                                              isConfirm
                                              ctaApi={() => deleteRawMaterialMutation.mutate(record.id)}
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

export const Route = createFileRoute('/_admin-layout/dashboard/raw-material/')({
    component: Page,
});
