import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { importMainWarehouseRequestApi } from '@/core/api/import-main-warehouse-request.api';
import { userApi } from '@/core/api/user.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { ImportMainWarehouseRequest } from '@/core/models/importMainWarehouseRequest';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const queryClient = useQueryClient();
    const { id, isAuth, isPurchasingManager, isPurchasingStaff, isManager, isAdmin, purchasingStaffId, isInspector } = useSelector<
        RootState,
        UserState
    >((state: RootState) => state.user);

    const router = useNKRouter();

    useDocumentTitle('Main Warehouse Request');

    if (!isAuth) {
        return null;
    }

    return (
        <div>
            <div className="">
                <TableBuilder
                    extraButtons={
                        <>
                            {isInspector && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            router.push(NKRouter.importMainWarehouseRequest.create());
                                        }}
                                    >
                                        Add Main Warehouse Request
                                    </Button>
                                </>
                            )}
                        </>
                    }
                    sourceKey="importMainWarehouseRequest"
                    title="Import Main Warehouse Request"
                    columns={[
                        {
                            key: 'poCode',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'requestTitle',
                            title: 'Request Title',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'requestDate',
                            title: 'Request Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'requestExecutionDate',
                            title: 'Request Execution Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'inspectorId',
                            title: 'Inspector',
                            type: FieldType.BADGE_API,
                            apiAction: userApi.getInspectorStaffEnum,
                        },
                        {
                            key: 'approveStatus',
                            title: 'Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: importMainWarehouseRequestApi.getEnumSupplierApproveStatus,
                        },
                        {
                            key: 'warehouseForm.formCode',
                            title: 'Warehouse Form Code',
                            type: FieldType.LINK,
                            apiAction: (value) => {
                                return {
                                    label: value || 'N/A',
                                };
                            },
                        },
                    ]}
                    actionColumns={[
                        {
                            label: (record: ImportMainWarehouseRequest) => (
                                <div className="flex flex-col">
                                    <Button type="link" onClick={() => router.push(NKRouter.importMainWarehouseRequest.detail(record.id))}>
                                        Detail
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    queryApi={async () => {
                        let data = await importMainWarehouseRequestApi.getAll();
                        if (isPurchasingStaff) {
                            data = data.filter((item) => item.requestStaffId === purchasingStaffId);
                        }

                        return data;
                    }}
                    defaultOrderBy="UserId"
                    filters={[
                        {
                            label: 'Title',
                            comparator: FilterComparator.LIKE,
                            name: 'title',
                            type: NKFormType.TEXT,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/import-main-warehouse-request/')({
    component: Page,
});
