import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _get from 'lodash/get';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { IUpdateSupplierAccountRequestDto, supplierAccountRequestApi } from '@/core/api/supplier-account-request.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();

    const query = useQuery({
        queryKey: ['supplier-account-request', id],
        queryFn: async () => {
            return await supplierAccountRequestApi.getById(Number(id));
        },
    });

    useDocumentTitle('Edit Supplier Account Request');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<IUpdateSupplierAccountRequestDto>
                    isDebug
                    title="Update Supplier Account Request"
                    apiAction={supplierAccountRequestApi.update}
                    onExtraSuccessAction={() => {
                        toast.success('Update supplier account request successfully');
                        router.push(NKRouter.supplierAccountRequest.detail(Number(id)));
                    }}
                    defaultValues={{
                        email: _get(query, 'data.email', ''),
                        hashedPassword: '',
                        fullName: _get(query, 'data.fullName', ''),
                        address: _get(query, 'data.address', ''),
                        phoneNumber: _get(query, 'data.phoneNumber', ''),
                        dob: moment(_get(query, 'data.dob', '')).format('YYYY-MM-DD'),
                        companyAddress: _get(query, 'data.companyAddress', ''),
                        companyEmail: _get(query, 'data.companyEmail', ''),
                        companyName: _get(query, 'data.companyName', ''),
                        companyPhone: _get(query, 'data.companyPhone', ''),
                        companyTaxCode: _get(query, 'data.companyTaxCode', ''),
                        id: _get(query, 'data.id', 0),
                        profilePictureUrl: _get(query, 'data.profilePictureUrl', ''),
                    }}
                    fields={[
                        {
                            name: 'profilePictureUrl',
                            label: 'Profile Picture',
                            type: NKFormType.UPLOAD_IMAGE,
                        },
                        {
                            name: 'fullName',
                            label: 'Full Name',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                        {
                            name: 'email',
                            label: 'Email',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                        {
                            name: 'phoneNumber',
                            label: 'Phone Number',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                        {
                            name: 'dob',
                            label: 'Date of Birth',
                            type: NKFormType.DATE,
                            span: 2,
                        },
                        {
                            name: 'hashedPassword',
                            label: 'Password',
                            type: NKFormType.PASSWORD,
                        },
                        {
                            name: 'address',
                            label: 'Address',
                            type: NKFormType.TEXT,
                        },

                        {
                            name: 'companyName',
                            label: 'Company Name',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                        {
                            name: 'companyEmail',
                            label: 'Company Email',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                        {
                            name: 'companyAddress',
                            label: 'Company Address',
                            type: NKFormType.TEXT,
                            span: 4,
                        },
                        {
                            name: 'companyPhone',
                            label: 'Company Phone',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                        {
                            name: 'companyTaxCode',
                            label: 'Company Tax Code',
                            type: NKFormType.TEXT,
                            span: 2,
                        },
                    ]}
                    schema={{
                        fullName: joi.string().required(),
                        email: joi
                            .string()
                            .email({
                                tlds: { allow: false },
                            })
                            .required(),
                        phoneNumber: joi.string().required(),
                        address: joi.string().required(),
                        dob: joi.string().required(),
                        profilePictureUrl: joi.string().required(),
                        hashedPassword: joi.string().required(),
                        companyAddress: joi.string().required(),
                        companyEmail: joi.string().required(),
                        companyName: joi.string().required(),
                        companyPhone: joi.string().required(),
                        companyTaxCode: joi.string().required(),
                        id: joi.number().required(),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier-account-request/$id/edit')({
    component: Page,
});
