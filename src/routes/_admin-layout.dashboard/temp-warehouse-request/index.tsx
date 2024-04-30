import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { IUpdateTempWarehouseRequestDto, temWareHouseRequestApi } from '@/core/api/temp-warehouse-request.api';
import { userApi } from '@/core/api/user.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { TempWarehouseRequest } from '@/core/models/tempWarehouseRequest';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { id, isPurchasingManager, isPurchasingStaff, isManager, isInspector, isAdmin, purchasingStaffId, isAuth } = useSelector<
        RootState,
        UserState
    >((state: RootState) => state.user);

    useDocumentTitle('Temp Warehouse Request List');

    if (!isAuth) {
        return null;
    }

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="tempWarehouseRequest"
                    title="Temp Warehouse Request List"
                    extraButtons={
                        <>
                            {(isPurchasingStaff || isInspector) && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            router.push(NKRouter.tempWarehouseRequest.create());
                                        }}
                                    >
                                        Add Temp Warehouse Request
                                    </Button>
                                </>
                            )}
                        </>
                    }
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
                            title: 'Request Execution Date',
                            key: 'requestExecutionDate',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            title: 'Request Inspector',
                            key: 'requestInspectorId',
                            type: FieldType.BADGE_API,
                            apiAction: userApi.getInspectorStaffEnum,
                        },
                        {
                            title: 'Request Staff',
                            key: 'requestStaffId',
                            type: FieldType.BADGE_API,
                            apiAction: userApi.getPurchasingStaffEnum,
                        },
                        {
                            title: 'Approve Status',
                            key: 'approveStatus',
                            type: FieldType.BADGE_API,
                            apiAction: temWareHouseRequestApi.getEnumStatus,
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
                        {
                            title: 'Request Type',
                            key: 'requestType',
                            type: FieldType.BADGE_API,
                            apiAction: temWareHouseRequestApi.getEnumType,
                        },
                    ]}
                    queryApi={async () => {
                        let data = await temWareHouseRequestApi.getAll();

                        if (isPurchasingStaff) {
                            data = data.filter((item) => item.requestStaffId === purchasingStaffId);
                        }

                        return data;
                    }}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: TempWarehouseRequest) => (
                                <div>
                                    <NKLink href={NKRouter.tempWarehouseRequest.detail(record.id)}>
                                        <Button type="link">View Detail</Button>
                                    </NKLink>
                                </div>
                            ),
                        },

                        // {
                        //     label: (record: TempWarehouseRequest) => {
                        //         if (record.approveStatus !== 0) return null;

                        //         return (
                        //             <ModalBuilder
                        //                 btnLabel="Edit"
                        //                 btnProps={{
                        //                     type: 'link',
                        //                 }}
                        //             >
                        //                 {(close) => {
                        //                     return (
                        //                         <FormBuilder<IUpdateTempWarehouseRequestDto>
                        //                             apiAction={temWareHouseRequestApi.update}
                        //                             defaultValues={{
                        //                                 id: _get(record, 'id', 0),
                        //                                 requestDate: _get(record, 'requestDate', ''),
                        //                                 requestTitle: _get(record, 'requestTitle', ''),
                        //                                 requestReasonContent: _get(record, 'requestReasonContent', ''),
                        //                                 requestType: _get(record, 'requestType', 0),
                        //                                 requestExecutionDate: _get(record, 'requestExecutionDate', ''),
                        //                                 deliveryStageId: _get(record, 'deliveryStageId', 0),
                        //                             }}
                        //                             fields={[
                        //                                 {
                        //                                     label: 'Request Date',
                        //                                     name: 'requestDate',
                        //                                     type: NKFormType.DATE,
                        //                                 },
                        //                                 {
                        //                                     label: 'Request Title',
                        //                                     name: 'requestTitle',
                        //                                     type: NKFormType.TEXT,
                        //                                 },
                        //                                 {
                        //                                     label: 'Request Reason Content',
                        //                                     name: 'requestReasonContent',
                        //                                     type: NKFormType.TEXTAREA,
                        //                                 },
                        //                                 {
                        //                                     label: 'Request Type',
                        //                                     name: 'requestType',
                        //                                     type: NKFormType.SELECT_API_OPTION,
                        //                                     fieldProps: {
                        //                                         apiAction: isInspector
                        //                                             ? temWareHouseRequestApi.getEnumInspectType
                        //                                             : temWareHouseRequestApi.getEnumType,
                        //                                     },
                        //                                 },
                        //                                 {
                        //                                     label: 'Request Execution Date',
                        //                                     name: 'requestExecutionDate',
                        //                                     type: NKFormType.DATE,
                        //                                 },
                        //                             ]}
                        //                             onExtraSuccessAction={() => {
                        //                                 toast.success('Add temp warehouse request successfully');
                        //                                 queryClient.refetchQueries({
                        //                                     queryKey: ['tempWarehouseRequest'],
                        //                                 });
                        //                                 close();
                        //                             }}
                        //                             onExtraErrorAction={(error) => {
                        //                                 toast.error(_get(error, 'data.message', 'Error'));
                        //                             }}
                        //                             schema={{
                        //                                 requestDate: Joi.string().required(),
                        //                                 requestTitle: Joi.string().required(),
                        //                                 requestReasonContent: Joi.string().required(),
                        //                                 requestType: Joi.number().required(),
                        //                                 requestExecutionDate: Joi.string().required(),
                        //                                 deliveryStageId: Joi.number().required(),
                        //                                 id: Joi.number().required(),
                        //                             }}
                        //                             title="Edit Temp Warehouse Request"
                        //                         />
                        //                     );
                        //                 }}
                        //             </ModalBuilder>
                        //         );
                        //     },
                        // },
                    ]}
                    filters={[
                        {
                            label: 'Request Title',
                            comparator: FilterComparator.LIKE,
                            name: 'requestTitle',
                            type: NKFormType.TEXT,
                        },
                        // {
                        //     label: 'Approve Status',
                        //     comparator: FilterComparator.EQUAL,
                        //     name: 'approveStatus',
                        //     type: NKFormType.SELECT_API_OPTION,
                        //     apiAction: purchasingOrderApi.getEnumSupplierApproveStatus,
                        // },
                        // {
                        //     label: 'Request Type',
                        //     comparator: FilterComparator.EQUAL,
                        //     name: 'requestType',
                        //     type: NKFormType.SELECT_API_OPTION,
                        //     apiAction: temWareHouseRequestApi.getEnumType,
                        // },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/temp-warehouse-request/')({
    component: Page,
});
