import * as React from 'react';

import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import { useQuery } from '@tanstack/react-query';
import { Button, Dropdown, Table } from 'antd';
import { AnyObject } from 'antd/lib/_util/type';
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content } from 'antd/lib/layout/layout';
import { ColumnType } from 'antd/lib/table';
import { ExpandableConfig } from 'antd/lib/table/interface';
import clsx from 'clsx';
import { flatten } from 'flat';
import _get from 'lodash/get';
import { FormProvider, useForm } from 'react-hook-form';
import { HiOutlineDotsVertical } from 'react-icons/hi';

import { FilterComparator, SortOrder } from '@/core/models/common';

import FieldDisplay, { FieldType } from '../field/FieldDisplay';
import NKForm, { NKFormType } from '../form/NKForm';

export interface TableBuilderColumn extends ColumnType<AnyObject> {
    type: FieldType;
    key: string;
    apiAction?: (value: any) => any;
    formatter?: (value: any) => any;
}

export interface IFilterItem {
    name: string;
    filterName?: string;
    type: NKFormType;
    label: string;
    comparator: FilterComparator;
    defaultValue?: any;
    apiAction?: (value: any) => Promise<any>;
}

export interface IActionColum {
    label: (record: any) => string | React.ReactNode;
    onClick?: (record: any) => void;
    isShow?: (record: any) => boolean;
}

interface TableBuilderProps {
    title: string;
    extraFilter?: string[];
    sourceKey: string;
    queryApi: () => Promise<Array<any>>;
    columns: TableBuilderColumn[];
    onBack?: () => void;
    filters?: IFilterItem[];
    pageSizes?: number[];
    tableSize?: 'small' | 'middle' | 'large';
    extraButtons?: React.ReactNode;
    defaultOrderBy?: string;
    extraBulkActions?: (selectRows: any[], setSelectRows: React.Dispatch<React.SetStateAction<any[]>>) => React.ReactNode;
    expandable?: ExpandableConfig<any>;
    actionColumns?: Array<IActionColum>;
    scroll?: { x?: number; y?: number };
}

const TableBuilder: React.FC<TableBuilderProps> = ({
    sourceKey,
    title,
    queryApi,
    columns,
    extraFilter = [],
    onBack,
    pageSizes = [10],
    tableSize = 'middle',
    filters = [],
    extraBulkActions,
    extraButtons,
    actionColumns,
    expandable,
    defaultOrderBy = 'createdAt',
    scroll,
}) => {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(pageSizes[0]);
    const [order, setOrder] = React.useState<SortOrder>(SortOrder.DESC);
    const [orderBy, setOrderBy] = React.useState<string>(defaultOrderBy);
    const [isShowFilter, setIsShowFilter] = React.useState(false);
    const [selectedRowGroup, setSelectedRowGroup] = React.useState<any[]>([]);
    const defaultValues = React.useMemo(() => {
        const defaultValues: Record<any, any> = filters.reduce((acc: any, item: any) => {
            acc[item.name] = item.defaultValue;

            return acc;
        }, {});

        return defaultValues;
    }, []);

    const formMethods = useForm({ defaultValues });

    React.useEffect(() => {
        if (extraFilter.length !== 0) {
            setPage(1);
        }
    }, [extraFilter]);

    const pagingQuery = useQuery({
        queryKey: [sourceKey, 'paging', page, pageSize, order, orderBy, extraFilter, formMethods.getValues()],
        queryFn: async () => {
            let res = await queryApi();
            const filterValues = flatten(formMethods.getValues()) as Record<string, any>;

            // filter

            Object.keys(filterValues).forEach((key) => {
                const filter = filters.find((item) => item.name === key);

                const filterValue = _get(filterValues, key, '');
                if (!filterValue) {
                    return;
                }
                res = res.filter((item: any) => {
                    if (filter?.comparator === FilterComparator.EQUAL) {
                        return _get(item, key, '') === filterValue;
                    }

                    if (filter?.comparator === FilterComparator.LIKE) {
                        return _get(item, key, '').includes(filterValue);
                    }

                    if (filter?.comparator === FilterComparator.GREATER_THAN) {
                        return _get(item, key, '') > filterValue;
                    }

                    if (filter?.comparator === FilterComparator.LESS_THAN) {
                        return _get(item, key, '') < filterValue;
                    }

                    if (filter?.comparator === FilterComparator.GREATER_THAN_OR_EQUAL) {
                        return _get(item, key, '') >= filterValue;
                    }

                    if (filter?.comparator === FilterComparator.LESS_THAN_OR_EQUAL) {
                        return _get(item, key, '') <= filterValue;
                    }

                    if (filter?.comparator === FilterComparator.NOT_EQUAL) {
                        return _get(item, key, '') !== filterValue;
                    }

                    if (filter?.comparator === FilterComparator.IN) {
                        return filterValue.includes(_get(item, key, ''));
                    }

                    return true;
                });
            });

            // order
            res = res.sort((a: any, b: any) => {
                if (order === SortOrder.ASC) {
                    return _get(a, orderBy, '') > _get(b, orderBy, '') ? 1 : -1;
                }

                return _get(a, orderBy, '') < _get(b, orderBy, '') ? 1 : -1;
            });

            return res as Array<any>;
        },
        initialData: [],
    });

    return (
        <div className="fade-in flex gap-4">
            <Layout className="bg-inherit">
                {isShowFilter && (
                    <Sider collapsed={!isShowFilter} theme="light" className="fade-in mt-[53px] p-4" width={250}>
                        <FormProvider {...formMethods}>
                            <div className="flex flex-col gap-2">
                                {filters.map((item) => {
                                    return (
                                        <NKForm
                                            key={item.name}
                                            name={item.name}
                                            label={item.label}
                                            type={item.type as any}
                                            fieldProps={{
                                                apiAction: item.apiAction,
                                                isAllOption: true,
                                            }}
                                        />
                                    );
                                })}

                                <div className="flex gap-4">
                                    <Button
                                        className="w-full"
                                        size="small"
                                        type="primary"
                                        onClick={() => {
                                            pagingQuery.refetch();
                                        }}
                                    >
                                        Filter
                                    </Button>
                                    <Button
                                        className="w-full"
                                        size="small"
                                        onClick={() => {
                                            formMethods.reset();
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </FormProvider>
                    </Sider>
                )}
                <Content
                    className={clsx('', {
                        'ml-4': isShowFilter,
                    })}
                >
                    <div>
                        <PageHeader
                            title={title}
                            onBack={onBack}
                            className="!px-0"
                            extra={[
                                selectedRowGroup.length === 0 ? null : (
                                    <React.Fragment key="3">{extraBulkActions?.(selectedRowGroup, setSelectedRowGroup)}</React.Fragment>
                                ),
                                extraButtons,
                                <Button
                                    key="2"
                                    type="default"
                                    icon={<ReloadOutlined rev="" />}
                                    onClick={() => {
                                        pagingQuery.refetch();
                                    }}
                                >
                                    Reload
                                </Button>,
                                filters.length === 0 ? null : (
                                    <Button
                                        onClick={() => {
                                            setIsShowFilter(!isShowFilter);
                                        }}
                                        type="primary"
                                        key="1"
                                        icon={<FilterOutlined rev="" />}
                                    >
                                        Filter
                                    </Button>
                                ),
                            ]}
                        />

                        <Table
                            scroll={scroll}
                            bordered
                            sticky
                            rowSelection={
                                Boolean(extraBulkActions)
                                    ? {
                                          type: 'checkbox',
                                          onChange(selectedRowKeys, selectedRows, info) {
                                              setSelectedRowGroup(selectedRows);
                                          },
                                          selectedRowKeys: selectedRowGroup.map((item) => item.id),
                                      }
                                    : undefined
                            }
                            sortDirections={['ascend', 'descend']}
                            rowKey={(record) => _get(record, 'id', '')}
                            size={tableSize}
                            dataSource={pagingQuery.data}
                            columns={[
                                // number column
                                {
                                    key: 'number',
                                    title: 'No',
                                    width: 60,
                                    render: (value: any, record: any, index: number) => {
                                        return (page - 1) * pageSize + index + 1;
                                    },
                                },

                                ...columns.map((item, index) => ({
                                    ...item,
                                    key: item.key,
                                    title: item.title,

                                    render: (value: any, record: any) => {
                                        const formatValue = Boolean(item.key) ? _get(record, item.key, '') : record;

                                        return (
                                            <FieldDisplay
                                                key={item.key}
                                                type={item.type}
                                                formatter={item.formatter}
                                                value={formatValue}
                                                apiAction={item.apiAction}
                                            />
                                        );
                                    },

                                    sorter: true,
                                })),
                                {
                                    key: 'action',
                                    title: '',
                                    sorter: false,
                                    width: 50,
                                    render: (value: any, record: any) => {
                                        if (!actionColumns) {
                                            return null;
                                        }

                                        const filteredActionColumns = actionColumns.filter((item) => {
                                            if (item.isShow) {
                                                return item.isShow(record);
                                            }

                                            return true;
                                        });

                                        return (
                                            <div className="">
                                                <Dropdown
                                                    className=""
                                                    menu={{
                                                        items: (filteredActionColumns || []).map((item) => ({
                                                            type: 'item',
                                                            label: item.label(record),
                                                            onClick: () => {
                                                                item.onClick?.(record);
                                                            },
                                                        })) as any,
                                                    }}
                                                    placement="bottomRight"
                                                >
                                                    <Button
                                                        icon={
                                                            <div className="text-xl">
                                                                <HiOutlineDotsVertical />
                                                            </div>
                                                        }
                                                    ></Button>
                                                </Dropdown>
                                            </div>
                                        );
                                    },
                                },
                            ]}
                            pagination={{
                                current: page,
                                pageSize,
                                total: pagingQuery.data.length,
                            }}
                            expandable={expandable}
                            loading={pagingQuery.isFetching}
                            onChange={(pagination, filters, sorter, extra) => {
                                if (sorter) {
                                    const sortKey = _get(sorter, 'columnKey', '');
                                    const sortOrder = _get(sorter, 'order', undefined);

                                    if (sortOrder) {
                                        setOrderBy(sortKey);
                                        setOrder(sortOrder === 'ascend' ? SortOrder.ASC : SortOrder.DESC);
                                    } else {
                                        setOrderBy(defaultOrderBy);
                                        setOrder(SortOrder.ASC);
                                    }
                                }

                                setPage(pagination.current || 0);
                                if (pagination.pageSize !== pageSize) {
                                    setPage(1);
                                    setPageSize(pagination.pageSize || pageSizes[0]);
                                }
                            }}
                        />
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default TableBuilder;
