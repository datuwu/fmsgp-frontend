import * as React from 'react';

import { Outlet, createFileRoute } from '@tanstack/react-router';

import DashboardLayout from '@/core/components/layout/DashboardLayout';
import { MenuDashboardProvider } from '@/core/contexts/MenuDashboardContext';

interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = () => {
    return (
        <>
            <MenuDashboardProvider>
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </MenuDashboardProvider>
        </>
    );
};

export const Route = createFileRoute('/_admin-layout')({
    component: Layout,
});
