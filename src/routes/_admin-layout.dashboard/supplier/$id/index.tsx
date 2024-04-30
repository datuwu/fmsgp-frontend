import React from 'react';

import { PageHeader } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Descriptions } from 'antd';
import moment from 'moment';

import { NKRouter } from '@/core/NKRouter';
import { userApi } from '@/core/api/user.api';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();
    const router = useNKRouter();

    const query = useQuery({
        queryKey: ['supplier', id],
        queryFn: async () => {
            return await userApi.getById(Number(id));
        },
    });

    useDocumentTitle(query.data?.fullName || 'Supplier Detail');

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fade-in flex w-full flex-col gap-4">
            <PageHeader title={query.data?.fullName} />
            <Descriptions
                bordered
                className="rounded-lg bg-white p-4"
                title="Supplier Detail"
                extra={
                    <div className="flex gap-2">
                        <NKLink href={NKRouter.supplier.edit(Number(id))}>
                            <Button className="w-full">Edit</Button>
                        </NKLink>
                    </div>
                }
            >
                <Descriptions.Item label="Id">{query.data?.id}</Descriptions.Item>
                <Descriptions.Item label="Full Name">{query.data?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{query.data?.email}</Descriptions.Item>
                <Descriptions.Item label="Profile Picture">
                    <img src={query.data?.profilePictureUrl} alt="profile picture" className="h-24 w-24" />
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">{query.data?.phoneNumber}</Descriptions.Item>

                <Descriptions.Item label="Date of Birth">{moment(query.data?.dob).format('YYYY-MM-DD')}</Descriptions.Item>

                <Descriptions.Item label="Address">{query.data?.address}</Descriptions.Item>
            </Descriptions>
            <Descriptions bordered className="rounded-lg bg-white p-4" title="Company Detail">
                <Descriptions.Item span={2} label="Company Name">
                    {query.data?.supplier?.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="Company Email">{query.data?.supplier?.companyEmail}</Descriptions.Item>
                <Descriptions.Item label="Company Phone">{query.data?.supplier?.companyPhone}</Descriptions.Item>
                <Descriptions.Item label="Company Address">{query.data?.supplier?.companyAddress}</Descriptions.Item>
                <Descriptions.Item label="Company Tax Code">{query.data?.supplier?.companyTaxCode}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/supplier/$id/')({
    component: Page,
});
