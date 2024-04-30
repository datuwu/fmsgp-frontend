import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _get from 'lodash/get';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { IUpdatePurchasingPlanDto, purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { rawMaterialApi } from '@/core/api/raw-material.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();

    const query = useQuery({
        queryKey: ['purchasing-plan', id],
        queryFn: async () => {
            return await purchasingPlanApi.getById(Number(id));
        },
    });

    useDocumentTitle('Edit Purchasing Plan');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<IUpdatePurchasingPlanDto>
                    title="Update Purchasing Plan"
                    apiAction={purchasingPlanApi.update}
                    onExtraSuccessAction={() => {
                        toast.success('Update purchasing plan successfully');
                        router.push(NKRouter.purchasingPlan.detail(Number(id)));
                    }}
                    onExtraErrorAction={(error: any) => {
                        const message = _get(error, 'data.message') || 'Update purchasing plan failed';
                        toast.error(message);
                    }}
                    defaultValues={{
                        endDate: _get(query, 'data.endDate', '') || moment().add(1, 'month').format('YYYY-MM-DD'),
                        note: _get(query, 'data.note', ''),
                        id: _get(query, 'data.id', 0),
                        lastModifiedDate: moment().format('YYYY-MM-DD'),
                        startDate: _get(query, 'data.startDate', '') || moment().format('YYYY-MM-DD'),
                        title: _get(query, 'data.title', ''),
                        purchaseTasks: _get(query, 'data.purchaseTasks', []),
                    }}
                    fields={[
                        {
                            type: NKFormType.TEXT,
                            name: 'title',
                            label: 'Title',
                        },

                        {
                            type: NKFormType.DATE,
                            name: 'startDate',
                            label: 'Start Date',
                        },
                        {
                            type: NKFormType.DATE,
                            name: 'endDate',
                            label: 'End Date',
                        },
                        {
                            type: NKFormType.TEXTAREA,
                            name: 'note',
                            label: 'Note',
                        },
                        {
                            type: NKFormType.ARRAY,
                            name: 'purchaseTasks',
                            label: 'Purchase Tasks',
                            fieldProps: {
                                defaultValues: {
                                    rawMaterialId: null,
                                    quantity: 1,
                                },
                                fields: [
                                    {
                                        type: NKFormType.SELECT_API_OPTION,
                                        name: 'rawMaterialId',
                                        label: 'Raw Material',
                                        span: 2,

                                        fieldProps: {
                                            apiAction: async (data, formMethods: any, isDefault) => {
                                                const currentValues = formMethods.getValues() as IUpdatePurchasingPlanDto;
                                                const options = await rawMaterialApi.getEnumSelectOption();

                                                if (!isDefault) {
                                                    return options;
                                                }

                                                return options.filter((option) => {
                                                    return !currentValues.purchaseTasks.some((task) => task.rawMaterialId === option.value);
                                                });
                                            },
                                        },
                                    },
                                    {
                                        type: NKFormType.NUMBER,
                                        name: 'quantity',
                                        label: 'Quantity',
                                        span: 2,
                                    },
                                ],
                            },
                        },
                    ]}
                    schema={{
                        title: joi.string().required(),
                        startDate: joi.date().required(),
                        endDate: joi.date().required(),
                        note: joi.string().allow('').required(),
                        id: joi.number().required(),
                        lastModifiedDate: joi.date().required(),
                        purchaseTasks: joi
                            .array()
                            .items(
                                joi
                                    .object({
                                        rawMaterialId: joi.number().required(),
                                        quantity: joi.number().min(1).required(),
                                    })
                                    .options({ allowUnknown: true }),
                            )
                            .required(),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-plan/$id/edit')({
    component: Page,
});
