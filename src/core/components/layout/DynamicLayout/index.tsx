import * as React from 'react';

import { Outlet, useRouter } from '@tanstack/react-router';

import { useNKPathname } from '@/core/routing/hooks/NKPathname';

import DashboardLayout from '../DashboardLayout';

interface DynamicLayoutProps {}

const DynamicLayout: React.FunctionComponent<DynamicLayoutProps & React.PropsWithChildren> = ({ children }) => {
    const pathname = useNKPathname();

    console.log(pathname);

    // if (pathname.startsWith('/dashboard')) {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
    // }

    // return <>{children}</>;
};

export default DynamicLayout;
