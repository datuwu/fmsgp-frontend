import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { ICreateSupplierDto, userApi } from '@/core/api/user.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    //const router = useNKRouter();

    useDocumentTitle('Create Supplier');

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<ICreateSupplierDto>
                    title="Create Supplier"
                    apiAction={userApi.createSupplier}
                    onExtraSuccessAction={() => {
                        toast.success('Create supplier success');
                        router.push(NKRouter.supplier.list());
                    }}
                    defaultValues={{
                        address: '',
                        dob: moment().format('YYYY-MM-DD'),
                        email: '',
                        fullName: '',
                        hashedPassword: '',
                        phoneNumber: '',
                        profilePictureUrl: '',
                        supplier: {
                            companyAddress: '',
                            companyEmail: '',
                            companyName: '',
                            companyPhone: '',
                            companyTaxCode: '',
                        },
                    }}
                    fields={[
                        {
                            label: 'Full Name',
                            name: 'fullName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Email',
                            name: 'email',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Phone Number',
                            name: 'phoneNumber',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Address',
                            name: 'address',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Date of Birth',
                            name: 'dob',
                            type: NKFormType.DATE,
                        },
                        {
                            label: 'Profile Picture',
                            name: 'profilePictureUrl',
                            type: NKFormType.UPLOAD_IMAGE,
                        },
                        {
                            label: 'Password',
                            name: 'hashedPassword',
                            type: NKFormType.PASSWORD,
                        },
                        {
                            label: 'Company Name',
                            name: 'supplier.companyName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Company Email',
                            name: 'supplier.companyEmail',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Company Phone',
                            name: 'supplier.companyPhone',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Company Address',
                            name: 'supplier.companyAddress',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Company Tax Code',
                            name: 'supplier.companyTaxCode',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    schema={{
                        address: joi.string().required(),
                        dob: joi.date().required(),
                        email: joi
                            .string()
                            .email({
                                tlds: { allow: false },
                            })
                            .required(),
                        fullName: joi.string().required(),
                        hashedPassword: joi.string().required(),
                        phoneNumber: joi.string().required(),
                        profilePictureUrl: joi.string().required(),
                        supplier: joi.object({
                            companyAddress: joi.string().required(),
                            companyEmail: joi
                                .string()
                                .email({
                                    tlds: { allow: false },
                                })
                                .required(),
                            companyName: joi.string().required(),
                            companyPhone: joi.string().required(),
                            companyTaxCode: joi.string().required(),
                        }),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier/create')({
    component: Page,
});
