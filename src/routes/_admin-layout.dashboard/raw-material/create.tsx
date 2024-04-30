import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _ from 'lodash';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { materialCategoryApi } from '@/core/api/material-category.api';
import { ICreateRawMaterialDto, rawMaterialApi } from '@/core/api/raw-material.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    const router = useNKRouter();

    useDocumentTitle('Create Raw Material');

    // | 'minToleranceWeight'
    //     | 'maxToleranceWeight'
    //     | 'weightUnit'
    //     | 'length'
    //     | 'width'
    //     | 'height'
    //     | 'sizeUnitEnum'
    //     | 'diameter'
    //     | 'diameterUnit'
    //     | 'mainIngredient'
    //     | 'threadRatio'
    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<ICreateRawMaterialDto>
                    title="Create Raw Material"
                    apiAction={rawMaterialApi.create}
                    onExtraSuccessAction={() => {
                        toast.success('Create raw material success');
                        router.push(NKRouter.rawMaterial.list());
                    }}
                    onExtraErrorAction={(error) => {
                        toast.error(_.get(error, 'data.message', 'Create raw material failed'));
                    }}
                    defaultValues={{
                        color: 0,
                        description: '',
                        estimatePrice: 0,
                        imageUrl: '',
                        materialCategoryId: 0,
                        name: '',
                        shape: 0,
                        unit: 0,
                        package: 0,
                        diameter: 0,
                        diameterUnit: 0,
                        height: 0,
                        length: 0,
                        mainIngredient: '',
                        maxToleranceWeight: 0,
                        minToleranceWeight: 0,
                        sizeUnitEnum: 0,
                        weightUnit: 0,
                        width: 0,
                        threadRatio: 0,
                        weight: 0,
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
                            label: 'Package',
                            name: 'package',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumPackageUnit,
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
                            label: 'Color',
                            name: 'color',
                            type: NKFormType.SELECT_API_OPTION,
                            fieldProps: {
                                apiAction: rawMaterialApi.getEnumColor,
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
                            label: 'Weight Unit',
                            name: 'weightUnit',
                            type: NKFormType.SELECT_API_OPTION,
                            span: 2,
                            fieldProps: {
                                apiAction: rawMaterialApi.getWeightUnit,
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
                            label: 'Weight',
                            name: 'weight',
                            type: NKFormType.NUMBER,
                            span: 2,
                        },
                        {
                            label: 'Size Unit',
                            name: 'sizeUnitEnum',
                            type: NKFormType.SELECT_API_OPTION,
                            span: 2,
                            fieldProps: {
                                apiAction: rawMaterialApi.getSizeUnit,
                            },
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
                    isDebug
                    schema={{
                        color: joi.number().required(),
                        description: joi.string().allow('').required(),
                        estimatePrice: joi.number().min(1).required(),
                        imageUrl: joi.string().required(),
                        materialCategoryId: joi.number().required(),
                        name: joi.string().required(),
                        shape: joi.number().required(),
                        unit: joi.number().required(),
                        package: joi.number().required(),
                        diameter: joi.number().required(),
                        diameterUnit: joi.number().required(),
                        height: joi.number().required(),
                        length: joi.number().required(),
                        mainIngredient: joi.string().allow('').required(),
                        maxToleranceWeight: joi.number().required(),
                        minToleranceWeight: joi.number().required(),
                        sizeUnitEnum: joi.number().required(),
                        weightUnit: joi.number().required(),
                        width: joi.number().required(),
                        threadRatio: joi.number().required(),
                        weight: joi.number().required(),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/raw-material/create')({
    component: Page,
});
