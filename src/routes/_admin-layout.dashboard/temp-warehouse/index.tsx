import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Joi from 'joi';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IUpdateWarehouseMaterialDto, warehouseMaterialApi } from '@/core/api/warehouse-material.api';
import { warehouseApi } from '@/core/api/warehouse.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { WarehouseMaterial } from '@/core/models/warehouseMaterial';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}


const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();
    const { id, isPurchasingManager, isPurchasingStaff, isManager, isAdmin, isWarehouseStaff } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    useDocumentTitle('Temp Warehouse Material List');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="temp-warehouse-material"
                    title="Temp Warehouse Material List"
                    extraButtons={[<></>]}
                    columns={[
                        {
                            key: 'rawMaterial.code',
                            title: 'Code',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'rawMaterial.name',
                            title: 'Raw Material Name',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'rawMaterial.imageUrl',
                            title: 'Image',
                            type: FieldType.THUMBNAIL,
                        },
                        {
                            key: 'quantity',
                            title: 'Quantity',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'returnQuantity',
                            title: 'Return Quantity',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'totalPrice',
                            title: 'Total Price (VND)',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'warehouseId',
                            title: 'Warehouse',
                            type: FieldType.BADGE_API,
                            apiAction: warehouseApi.getEnum,
                        },
                    ]}
                    queryApi={warehouseMaterialApi.getAllTempWarehouse}
                    defaultOrderBy="UserId"
                    actionColumns={[
                        {
                            label: (record: WarehouseMaterial) => (
                                <ModalBuilder
                                    btnLabel="View Detail"
                                    btnProps={{
                                        type: 'text',
                                        className: 'w-full',
                                    }}
                                    title="View warehouse detail"
                                >
                                    {(close) => (
                                        <FieldBuilder
                                            record={record}
                                            fields={[
                                                {
                                                    key: 'id',
                                                    title: 'ID',
                                                    type: FieldType.TEXT,
                                                },
                                                {
                                                    key: 'rawMaterial.imageUrl',
                                                    title: 'Image',
                                                    type: FieldType.THUMBNAIL,
                                                },
                                                {
                                                    key: 'rawMaterial.name',
                                                    title: 'Raw Material Name',
                                                    type: FieldType.TEXT,
                                                },
                                                {
                                                    key: 'quantity',
                                                    title: 'Quantity',
                                                    type: FieldType.NUMBER,
                                                },
                                                {
                                                    key: 'returnQuantity',
                                                    title: 'Return Quantity',
                                                    type: FieldType.NUMBER,
                                                },
                                                {
                                                    key: 'totalPrice',
                                                    title: 'Total Price (VND)',
                                                    type: FieldType.NUMBER,
                                                },
                                                {
                                                    key: 'warehouseId',
                                                    title: 'Warehouse',
                                                    type: FieldType.BADGE_API,
                                                    apiAction: warehouseApi.getEnum,
                                                },
                                            ]}
                                            title=""
                                        />
                                    )}
                                </ModalBuilder>
                            ),
                        },

                        ...(isWarehouseStaff
                            ? [
                                  {
                                      label: (record: WarehouseMaterial) => (
                                          <ModalBuilder
                                              btnLabel="Edit"
                                              btnProps={{
                                                  type: 'text',
                                                  className: 'w-full',
                                              }}
                                              title="Edit Warehouse Material"
                                          >
                                              {(close) => (
                                                  <FormBuilder<IUpdateWarehouseMaterialDto>
                                                      fields={[
                                                          {
                                                              label: 'Quantity',
                                                              type: NKFormType.NUMBER,
                                                              name: 'quantity',
                                                          },
                                                      ]}
                                                      defaultValues={{
                                                          quantity: record.quantity,
                                                          id: record.id,
                                                      }}
                                                      schema={{
                                                          quantity: Joi.number().min(1).required(),
                                                          id: Joi.number().required(),
                                                      }}
                                                      onExtraErrorAction={(error) => {
                                                          toast.error(_.get(error, 'data.message', 'Edit Warehouse Material failed'));
                                                      }}
                                                      onExtraSuccessAction={() => {
                                                          queryClient.refetchQueries({
                                                              queryKey: ['warehouse-material'],
                                                          });
                                                          toast.success('Edit Warehouse Material successfully');
                                                          close();
                                                      }}
                                                      apiAction={warehouseMaterialApi.update}
                                                      title=""
                                                  />
                                              )}
                                          </ModalBuilder>
                                      ),
                                  },
                              ]
                            : []),
                    ]}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'rawMaterial.name',
                            type: NKFormType.TEXT,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/temp-warehouse/')({
    component: Page,
});
