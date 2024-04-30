import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import joi from 'joi';
import _get from 'lodash/get';
import moment from 'moment';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { IUpdateSupplierDto, userApi } from '@/core/api/user.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { SystemRole } from '@/core/models/user';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

const Page = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();

    const query = useQuery({
        queryKey: ['supplier', id],
        queryFn: async () => {
            return await userApi.getById(Number(id));
        },
    });

    useDocumentTitle('Edit Supplier');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in w-full">
            <div className=" flex max-w-4xl flex-col gap-2">
                <FormBuilder<IUpdateSupplierDto>
                    isDebug
                    title="Create Supplier"
                    apiAction={userApi.updateSupplier}
                    onExtraSuccessAction={() => {
                        toast.success('Update supplier success');
                        router.push(NKRouter.supplier.detail(Number(id)));
                    }}
                    defaultValues={{
                        address: _get(query, 'data.address', ''),
                        dob: moment().format('YYYY-MM-DD'),
                        staffCode: _get(query, 'data.staffCode', ''),
                        email: _get(query, 'data.email', ''),
                        fullName: _get(query, 'data.fullName', ''),
                        phoneNumber: _get(query, 'data.phoneNumber', ''),
                        id: Number(id),
                        roleId: SystemRole.Supplier,
                        supplier: {
                            id: _get(query, 'data.supplier.id', 0),
                            lastModifiedDate: moment().toISOString(),
                            companyAddress: _get(query, 'data.supplier.companyAddress', ''),
                            companyEmail: _get(query, 'data.supplier.companyEmail', ''),
                            companyName: _get(query, 'data.supplier.companyName', ''),
                            companyPhone: _get(query, 'data.supplier.companyPhone', ''),
                            companyTaxCode: _get(query, 'data.supplier.companyTaxCode', ''),
                        },
                    }}
                    fields={[
                        {
                            label: 'Full Name',
                            name: 'fullName',
                            type: NKFormType.TEXT,
                        },
                        {
                            label: 'Staff Code',
                            name: 'staffCode',
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
                        phoneNumber: joi.string().required(),
                        id: joi.number().required(),
                        roleId: joi.number().required(),
                        staffCode: joi.string().required(),
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
                            id: joi.number().required(),
                            lastModifiedDate: joi.string().required(),
                        }),
                    }}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier/$id/edit')({
    component: Page,
});
