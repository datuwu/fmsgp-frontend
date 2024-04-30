import React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { inspectionRequestApi } from '@/core/api/inspection-request.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { InspectionRequest } from '@/core/models/inspectionRequest';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { isPurchasingManager, isAdmin, isManager, isInspector, isPurchasingStaff, isAuth, purchasingStaffId } = useSelector<RootState, UserState>(
        (state) => state.user,
    );

    useDocumentTitle('Inspection Request');

    if (!isAuth) {
        return null;
    }

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="inspectionRequest"
                    title="Inspection Request"
                    // extraButtons={
                    //     <>
                    //         {isPurchasingStaff && (
                    //             <>
                    //                 <ModalBuilder
                    //                     btnLabel="Add Inspection Request"
                    //                     btnProps={{
                    //                         icon: <PlusOutlined />,
                    //                         type: 'primary',
                    //                     }}
                    //                 >
                    //                     {(close) => {
                    //                         return (
                    //                             <FormBuilder
                    //                                 apiAction={inspectionRequestApi.create}
                    //                                 defaultValues={{
                    //                                     deliveryStageId: 0,
                    //                                     title: '',
                    //                                     content: '',
                    //                                     purchasingOrderId: 0,
                    //                                 }}
                    //                                 title="Add Inspection Request"
                    //                                 onExtraSuccessAction={() => {
                    //                                     toast.success('Add Inspection Request successfully');
                    //                                     // queryClient.refetchQueries({
                    //                                     //     queryKey: ['tempWarehouseRequest'],
                    //                                     // });
                    //                                     close();
                    //                                 }}
                    //                                 onExtraErrorAction={(error: any) => {
                    //                                     toast.error(_.get(error, 'data.message', 'Error'));
                    //                                 }}
                    //                                 schema={{
                    //                                     content: Joi.string().allow('').required(),
                    //                                     title: Joi.string().required(),
                    //                                     deliveryStageId: Joi.number().required(),
                    //                                     purchasingOrderId: Joi.number().required(),
                    //                                 }}
                    //                                 fields={[
                    //                                     {
                    //                                         label: 'Purchase Order',
                    //                                         name: 'purchasingOrderId',
                    //                                         type: NKFormType.SELECT_API_OPTION,
                    //                                         fieldProps: {
                    //                                             apiAction: purchasingOrderApi.getSelectWithCodeAndApprove,
                    //                                         },
                    //                                     },
                    //                                     {
                    //                                         label: 'Delivery Stage',
                    //                                         name: 'deliveryStageId',
                    //                                         isShowField: (form: ICreateInspectionRequestDto) => form.purchasingOrderId !== 0,
                    //                                         type: NKFormType.SELECT_API_OPTION,
                    //                                         fieldProps: {
                    //                                             apiAction: async (value, formMethods) => {
                    //                                                 const form = formMethods.getValues() as ICreateInspectionRequestDto;

                    //                                                 const res = await deliveryStageApi.getEnumSelectOption(
                    //                                                     value,
                    //                                                     form.purchasingOrderId,
                    //                                                 );

                    //                                                 return res;
                    //                                             },
                    //                                         },
                    //                                     },
                    //                                     {
                    //                                         label: 'Title',
                    //                                         name: 'title',
                    //                                         type: NKFormType.TEXT,
                    //                                     },
                    //                                     {
                    //                                         label: 'Content',
                    //                                         name: 'content',
                    //                                         type: NKFormType.TEXTAREA,
                    //                                     },
                    //                                 ]}
                    //                             />
                    //                         );
                    //                     }}
                    //                 </ModalBuilder>
                    //             </>
                    //         )}
                    //     </>
                    // }
                    extraButtons={
                        isPurchasingStaff ? (
                            <Button
                                type="primary"
                                onClick={() => {
                                    router.push(NKRouter.inspectionRequest.create());
                                }}
                                icon={<PlusOutlined />}
                            >
                                Add Inspection Request
                            </Button>
                        ) : null
                    }
                    columns={[
                        {
                            key: 'poCode',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'title',
                            title: 'Title',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'poCode',
                            title: 'PO Code',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'requestInspectDate',
                            title: 'Request Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'approvedDate',
                            title: 'Approved Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'requestInspectDate',
                            title: 'Request Inspect Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'approveStatus',
                            title: 'Approve Status',
                            type: FieldType.BADGE_API,
                            apiAction: inspectionRequestApi.getEnumStatus,
                        },
                        {
                            key: 'inspectionForm.resultCode',
                            title: 'Inspection Form Code',
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
                            label: (record: InspectionRequest) => (
                                <div className="flex flex-col">
                                    <Button type="link" onClick={() => router.push(NKRouter.inspectionRequest.detail(record.id))}>
                                        Detail
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    queryApi={async () => {
                        let data = await inspectionRequestApi.getAll();

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

export const Route = createFileRoute('/_admin-layout/dashboard/inspection-request/')({
    component: Page,
});
