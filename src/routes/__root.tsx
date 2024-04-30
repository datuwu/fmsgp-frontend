import * as React from 'react';

import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import ThemeProvider from '@/core/components/common/ThemeProvider';
import TryAuthWrapper from '@/core/components/wrapper/TryAuthWrapper';
import { GlobalDataProvider } from '@/core/contexts/GlobalDataContext';
import { Providers } from '@/core/store/provider';

import '../index.css';
import 'react-toastify/dist/ReactToastify.css';

interface RootLayoutProps {}

const RootLayout: React.FunctionComponent<RootLayoutProps> = () => {
    return (
        <Providers>
            <TryAuthWrapper>
                <ThemeProvider locale={''}>
                    <GlobalDataProvider>
                        {/* <DynamicLayout> */}
                        <Outlet />
                        {/* <TanStackRouterDevtools position="bottom-right" /> */}
                        {/* </DynamicLayout> */}
                    </GlobalDataProvider>
                </ThemeProvider>
            </TryAuthWrapper>
        </Providers>
    );
};

export const Route = createRootRoute({
    component: RootLayout,
});
