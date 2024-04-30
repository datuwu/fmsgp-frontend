import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _ from 'lodash';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { materialCategoryApi } from '@/core/api/material-category.api';
import { IUpdateRawMaterialDto, rawMaterialApi } from '@/core/api/raw-material.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();

    const query = useQuery({
        queryKey: ['rawMaterial', id],
        queryFn: async () => {
            return await rawMaterialApi.getById(Number(id));
        },
    });

    useDocumentTitle('Edit Raw Material');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<IUpdateRawMaterialDto>
                    title="Edit Raw Material"
                    apiAction={rawMaterialApi.update}
                    onExtraSuccessAction={() => {
                        toast.success('Update raw material success');
                        router.push(NKRouter.rawMaterial.detail(Number(id)));
                    }}
                    onExtraErrorAction={(error) => {
                        toast.error(_.get(error, 'data.message', 'Create raw material failed'));
                    }}
                    isDebug={true}
                    defaultValues={{
                        color: Number(query.data?.color || ''),
                        estimatePrice: query.data?.estimatePrice || 0,
                        imageUrl: query.data?.imageUrl || '',
                        materialCategoryId: query.data?.materialCategoryId || 0,
                        name: query.data?.name || '',
                        shape: Number(query.data?.shape || ''),

                        description: query.data?.description || '',
                        unit: Number(query.data?.unit || ''),
                        id: query.data?.id || 0,

                        package: Number(query.data?.package || ''),
                        diameter: Number(query.data?.diameter || ''),
                        length: Number(query.data?.length || ''),
                        width: Number(query.data?.width || ''),
                        height: Number(query.data?.height || ''),
                        diameterUnit: Number(query.data?.diameterUnit || ''),
                        mainIngredient: query.data?.mainIngredient || '',
                        maxToleranceWeight: Number(query.data?.maxToleranceWeight || ''),
                        minToleranceWeight: Number(query.data?.minToleranceWeight || ''),
                        weightUnit: Number(query.data?.weightUnit || ''),
                        sizeUnitEnum: Number(query.data?.sizeUnitEnum || ''),
                        threadRatio: Number(query.data?.threadRatio || ''),
                        weight: Number(query.data?.weight || ''),
                    }}
                    fields={[
                        { label: 'Name', name: 'name', type: NKFormType.TEXT, span: 4 },

                        {
                            label: 'Image',
                            name: 'imageUrl',
                            type: NKFormType.UPLOAD_IMAGE,
                            span: 4,
                        },
                        {
                            label: 'Description',
                            name: 'description',
                            type: NKFormType.TEXTAREA,
                            span: 4,
                        },

                        {
                            label: 'Estimate Price',
                            name: 'estimatePrice',
                            type: NKFormType.NUMBER,
                            span: 2,
                        },
                        {
                            label: 'Material Category',
                            name: 'materialCategoryId',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: materialCategoryApi.getEnumSelectOption,
                            },
                            span: 2,
                        },
                        {
                            label: 'Unit',
                            name: 'unit',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumUnit,
                            },
                            span: 2,
                        },
                        {
                            label: 'Color',
                            name: 'color',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumColor,
                            },
                            span: 2,
                        },
                        {
                            label: 'Shape',
                            name: 'shape',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumShape,
                            },
                            span: 2,
                        },

                        {
                            label: 'Package',
                            name: 'package',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumPackageUnit,
                            },
                            span: 2,
                        },
                        {
                            label: 'Thread Ratio',
                            name: 'threadRatio',
                            type: NKFormType.SELECT_API_OPTION,
                            span: 4,
                            fieldProps: {
                                apiAction: rawMaterialApi.getThreadRatio,
                            },
                        },
                        {
                            label: 'Diameter Unit',
                            name: 'diameterUnit',
                            type: NKFormType.SELECT_API_OPTION,
                            span: 2,
                            fieldProps: {
                                apiAction: rawMaterialApi.getDiameterUnit,
                            },
                        },
                        {
                            label: 'Diameter',
                            name: 'diameter',
                            type: NKFormType.NUMBER,
                            span: 2,
                            fieldProps: {},
                        },

                        {
                            label: 'Size Unit',
                            name: 'sizeUnitEnum',
                            type: NKFormType.SELECT_API_OPTION,
                            span: 2,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumSize,
                            },
                        },

                        {
                            label: 'Height',
                            name: 'height',
                            type: NKFormType.NUMBER,
                            span: 2,
                            fieldProps: {},
                        },
                        {
                            label: 'Length',
                            name: 'length',
                            type: NKFormType.NUMBER,
                            span: 2,
                            fieldProps: {},
                        },
                        {
                            label: 'Width',
                            name: 'width',
                            type: NKFormType.NUMBER,
                            span: 2,
                            fieldProps: {},
                        },
                        {
                            label: 'Weight Unit',
                            name: 'weightUnit',
                            type: NKFormType.SELECT_API_OPTION,
                            span: 2,
                            fieldProps: {
                                apiAction: rawMaterialApi.getWeightUnit,
                            },
                        },

                        {
                            label: 'Weight',
                            name: 'weight',
                            type: NKFormType.NUMBER,
                            span: 2,
                        },
                        {
                            label: 'Min Tolerance Weight',
                            name: 'minToleranceWeight',
                            type: NKFormType.NUMBER,
                            span: 2,
                        },
                        {
                            label: 'Max Tolerance Weight',
                            name: 'maxToleranceWeight',
                            type: NKFormType.NUMBER,
                            span: 2,
                        },
                        {
                            label: 'Main Ingredient',
                            name: 'mainIngredient',
                            type: NKFormType.TEXT,
                            span: 4,
                        },
                    ]}
                    schema={{
                        color: joi.number().required(),
                        description: joi.string().required(),
                        estimatePrice: joi.number().min(1).required(),
                        imageUrl: joi.string().required(),
                        name: joi.string().required(),
                        shape: joi.number().required(),
                        materialCategoryId: joi.number().required(),
                        id: joi.number().required(),
                        unit: joi.number().required(),
                        package: joi.number().required(),
                        diameter: joi.number().required(),
                        length: joi.number().required(),
                        diameterUnit: joi.number().required(),
                        mainIngredient: joi.string().allow('').required(),
                        height: joi.number().required(),
                        maxToleranceWeight: joi.number().required(),
                        minToleranceWeight: joi.number().required(),
                        sizeUnitEnum: joi.number().required(),
                        threadRatio: joi.number().required(),
                        weightUnit: joi.number().required(),
                        width: joi.number().required(),
                        weight: joi.number().required(),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/raw-material/$id/edit')({
    component: Page,
});
