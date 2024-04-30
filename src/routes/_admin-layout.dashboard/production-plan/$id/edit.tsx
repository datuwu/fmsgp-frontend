import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { IUpdateProductionPlanDto, productionPlanApi } from '@/core/api/production-plan.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

const Page = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const userState = useSelector<RootState, UserState>((state: RootState) => state.user);

    const query = useQuery({
        queryKey: ['production-plan', id],
        queryFn: async () => {
            return await productionPlanApi.getById(Number(id));
        },
    });

    useDocumentTitle('Edit Production Plan');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<IUpdateProductionPlanDto>
                    title="Edit Production Plan"
                    apiAction={productionPlanApi.update}
                    onExtraSuccessAction={() => {
                        toast.success('Edit production plan successfully');

                        router.push(NKRouter.productionPlan.detail(Number(id)));
                    }}
                    defaultValues={{
                        name: _get(query.data, 'name', ''),
                        planStartDate: _get(query.data, 'planStartDate', ''),
                        planEndDate: _get(query.data, 'planEndDate', ''),
                        fileUrl: _get(query.data, 'fileUrl', ''),
                        note: _get(query.data, 'note', ''),
                        id: _get(query.data, 'id', 0),
                        managerId: userState.id || 0,
                    }}
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
                        },
                        {
                            name: 'planEndDate',
                            label: 'Plan End Date',
                            type: NKFormType.DATE,
                        },
                        {
                            name: 'fileUrl',
                            label: 'File',
                            type: NKFormType.UPLOAD_FILE,
                            fieldProps: {
                                accept: '.pdf',
                            },
                        },
                        {
                            name: 'note',
                            label: 'Note',
                            type: NKFormType.TEXTAREA,
                        },
                    ]}
                    schema={{
                        name: joi.string().required(),
                        planStartDate: joi.date().required(),
                        planEndDate: joi.date().min(joi.ref('planStartDate')).required(),
                        fileUrl: joi.string().required(),
                        note: joi.string().allow('').required(),
                        id: joi.number().required(),
                        managerId: joi.number().required(),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/production-plan/$id/edit')({
    component: Page,
});
