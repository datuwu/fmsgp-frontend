import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useSelector } from 'react-redux';

import { purchasingOrderApi } from '@/core/api/purchasing-order.api';
import { purchasingPlanApi } from '@/core/api/purchasing-plan.api';
import { purchasingTaskApi } from '@/core/api/purchasing-task.api';
import ChartBasicArea from '@/core/components/chart/ChartBasicArea';
import {
    PurchasingOrder,
    PurchasingOrderManagerApproveStatus,
    PurchasingOrderStatus,
    PurchasingOrderSupplierApproveStatus,
} from '@/core/models/purchasingOrder';
import { PurchasingPlanApproveStatus, PurchasingPlanProgressEnum } from '@/core/models/purchasingPlan';
import { PurchasingTask, PurchasingTaskProgressEnum, PurchasingTaskStatusEnum } from '@/core/models/purchasingTask';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { groupCountValueByMonth } from '@/core/utils/report.helper';

const Dashboard = () => {
    const userStore = useSelector<RootState, UserState>((state) => state.user);

    const purchasingPlanLine = useQuery({
        queryKey: ['purchasingPlanLine'],
        queryFn: async () => {
            const res = await purchasingPlanApi.getAll();
            const totalApproved = res.filter((x: any) => x.approveStatus === PurchasingPlanApproveStatus.APPROVED);
            const totalFinished = totalApproved.filter((x: any) => x.processStatus === PurchasingPlanProgressEnum.FINISHED);
            return {
                totalApproved: totalApproved.length,
                totalFinished: totalFinished.length,
            };
        },
        initialData: {
            totalApproved: 0,
            totalFinished: 0,
        },
    });

    const purchasingOrderLine = useQuery({
        queryKey: ['purchasingOrderLine'],
        queryFn: async () => {
            const res = await purchasingOrderApi.getAll();
            const totalApproved = res.filter(
                (x: PurchasingOrder) =>
                    x.managerApproveStatus === PurchasingOrderSupplierApproveStatus.APPROVED &&
                    x.supplierApproveStatus === PurchasingOrderManagerApproveStatus.APPROVED,
            );
            const totalFinished = totalApproved.filter((x: PurchasingOrder) => x.orderStatus === PurchasingOrderStatus.FINISHED);
            return {
                totalApproved: totalApproved.length,
                totalFinished: totalFinished.length,
            };
        },
        initialData: {
            totalApproved: 0,
            totalFinished: 0,
        },
    });

    const purchasingOrderChart = useQuery({
        queryKey: ['purchasingOrderChart'],
        queryFn: async () => {
            const res = await purchasingOrderApi.getAll();
            return groupCountValueByMonth(res.map((item) => ({ time: item.createdDate, value: 1 })));
        },
        initialData: {},
    });

    const purchasingPlanChart = useQuery({
        queryKey: ['purchasingPlanChart'],
        queryFn: async () => {
            const res = await purchasingPlanApi.getAll();

            return groupCountValueByMonth(res.map((item) => ({ time: item.createdDate, value: 1 })));
        },
        initialData: {},
    });

    const taskLine = useQuery({
        queryKey: ['taskLine'],
        queryFn: async () => {
            const res = await purchasingTaskApi.getAll();
            const totalApproved = res.filter((x: PurchasingTask) => x.taskStatus !== PurchasingTaskStatusEnum.OVERDUE);
            const totalFinished = totalApproved.filter((x: PurchasingTask) => x.taskStatus === PurchasingPlanProgressEnum.FINISHED);
            console.log(totalFinished);
            return {
                totalApproved: totalApproved.length,
                totalFinished: totalFinished.length,
            };
        },
        initialData: {
            totalApproved: 0,
            totalFinished: 0,
        },
    });

    const taskChart = useQuery({
        queryKey: ['taskChart'],
        queryFn: async () => {
            const res = await purchasingTaskApi.getAll();
            return groupCountValueByMonth(res.map((item) => ({ time: item.createdDate, value: 1 })));
        },
        initialData: {},
    });

    return (
        <div className="grid grid-cols-2 gap-10">
            {userStore.isPurchasingManager ||
                (userStore.isManager && (
                    <>
                        <div className="flex flex-col gap-2">
                            <div className="ml-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                    <span>Finished Purchasing Plans</span>
                                    <span>
                                        {purchasingPlanLine.data.totalFinished} / {purchasingPlanLine.data.totalApproved} plans
                                    </span>
                                </div>
                                <div className="relative h-4 w-96 rounded-lg bg-gray-300">
                                    <div
                                        className="absolute h-4 rounded-lg "
                                        style={{
                                            width: `${(purchasingPlanLine.data.totalFinished / purchasingPlanLine.data.totalApproved) * 100}%`,
                                            backgroundColor: '#008FFB',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <ChartBasicArea
                                    colors={['#008FFB']}
                                    title="Purchasing Plan by month"
                                    unit="Plans"
                                    values={Object.keys(purchasingPlanChart.data).map((key) => ({
                                        name: key,
                                        data: purchasingPlanChart.data[key],
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="ml-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                    <span>Finished Purchasing Orders</span>
                                    <span>
                                        {purchasingOrderLine.data.totalFinished} / {purchasingOrderLine.data.totalApproved} orders
                                    </span>
                                </div>
                                <div className="relative h-4 w-96 rounded-lg bg-gray-300">
                                    <div
                                        className="absolute h-4 rounded-lg "
                                        style={{
                                            width: `${(purchasingOrderLine.data.totalFinished / purchasingOrderLine.data.totalApproved) * 100}%`,
                                            backgroundColor: '#00d68f',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <ChartBasicArea
                                    colors={['#00d68f']}
                                    title="Purchasing Order by month"
                                    unit="Orders"
                                    values={Object.keys(purchasingOrderChart.data).map((key) => ({
                                        name: key,
                                        data: purchasingOrderChart.data[key],
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="ml-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                    <span>Finished purchasing tasks</span>
                                    <span>
                                        {taskLine.data.totalFinished} / {taskLine.data.totalApproved} tasks
                                    </span>
                                </div>
                                <div className="relative h-4 w-96 rounded-lg bg-gray-300">
                                    <div
                                        className="absolute h-4 rounded-lg "
                                        style={{
                                            width: `${(taskLine.data.totalFinished / taskLine.data.totalApproved) * 100}%`,
                                            backgroundColor: '#ffbb44',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <ChartBasicArea
                                    colors={['#ffbb44']}
                                    title="Task by month"
                                    unit="Tasks"
                                    values={Object.keys(taskChart.data).map((key) => ({
                                        name: key,
                                        data: taskChart.data[key],
                                    }))}
                                />
                            </div>
                        </div>
                    </>
                ))}
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/')({
    component: Dashboard,
});
