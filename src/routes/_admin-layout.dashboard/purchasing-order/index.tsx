import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { PurchasingPlan } from '@/core/models/purchasingPlan';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}


const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { id, isPurchasingManager, isPurchasingStaff, purchasingStaffId, isSupplier, supplierId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Purchasing Order List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey={isPurchasingStaff ? `purchasing-order-${purchasingStaffId}` : `purchasing-order`}
                    title="Purchasing Order List"
                    extraButtons={
                        <>
                            {isPurchasingStaff && (
                                <NKLink href={NKRouter.purchasingOrder.create()}>
                                    <Button type="primary" icon={<PlusOutlined />}>
                                        Create Purchasing Order
                                    </Button>
                                </NKLink>
                            )}
                        </>
                    }
                    columns={[
                        {
                            key: 'name',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'poCode',
                            title: 'PO Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'orderStatus',
                            title: 'Order Status',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingOrderApi.getEnumOrderStatus,
                        },

                        {
                            key: 'totalPrice',
                            title: 'Total Price (VND)',
                            type: FieldType.NUMBER,
                        },

                        {
                            key: 'supplierApproveStatus',
                            title: 'Supplier Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingOrderApi.getEnumSupplierApproveStatus,
                        },
                        {
                            key: 'managerApproveStatus',
                            title: 'Manager Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: purchasingOrderApi.getEnumManagerApproveStatus,
                        },
                    ]}
                    queryApi={async () => {
                        const res = await purchasingOrderApi.getAll();

                        if (isPurchasingStaff) {
                            return res.filter((item) => item.purchasingStaffId === purchasingStaffId);
                        }

                        if (isSupplier) {
                            return res.filter((item) => item.supplierId === supplierId);
                        }

                        return res;
                    }}
                    defaultOrderBy="createdDate"
                    actionColumns={[
                        {
                            label: (record: PurchasingPlan) => (
                                <div>
                                    <NKLink href={NKRouter.purchasingOrder.detail(record.id)}>
                                        <Button type="link">View Detail</Button>
                                    </NKLink>
                                </div>
                            ),
                        },
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

export const Route = createFileRoute('/_admin-layout/dashboard/purchasing-order/')({
    component: Page,
});
