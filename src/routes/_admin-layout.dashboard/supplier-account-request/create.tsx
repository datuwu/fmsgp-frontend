import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { ICreateSupplierAccountRequestDto, supplierAccountRequestApi } from '@/core/api/supplier-account-request.api';
import { userApi } from '@/core/api/user.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

const Page = () => {
    const router = useNKRouter();
    const user = useSelector<RootState, UserState>((state) => state.user);

    const userMe = useQuery({
        queryKey: ['user-me', user.id],
        queryFn: async () => {
            return await userApi.getById(Number(user.id));
        },
    });

    useDocumentTitle('Create Supplier Account Request');

    // if (userMe.isLoading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<ICreateSupplierAccountRequestDto>
                    title="Create Supplier Account Request"
                    apiAction={supplierAccountRequestApi.create}
                    onExtraSuccessAction={() => {
                        toast.success('Create supplier account request successfully');
                        router.push(NKRouter.supplierAccountRequest.list());
                    }}
                    defaultValues={{
                        email: '',
                        hashedPassword: '',
                        fullName: '',
                        address: '',
                        phoneNumber: '',
                        dob: moment().format('YYYY-MM-DD'),
                        profilePictureUrl: '',
                        companyName: '',
                        companyEmail: '',
                        companyAddress: '',
                        companyPhone: '',
                        companyTaxCode: '',
                        requestStaffId: userMe.data?.purchasingStaffId || 0,
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
                        {
                            name: 'companyAddress',
                            label: 'Company Address',
                            type: NKFormType.TEXTAREA,
                            span: 4,
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
                        requestStaffId: joi.number().required(),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier-account-request/create')({
    component: Page,
});
