import { PropsWithChildren, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import { ToastContainer } from 'react-toastify';

export type ProviderProps = PropsWithChildren<{
    locale: string;
}>;

export function AntdConfigProvider({ children, locale }: ProviderProps) {
    return (
        <ConfigProvider
            theme={{
                algorithm:
                    // nowTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    theme.defaultAlgorithm,
                token: {
                    borderRadius: 4,
                    colorPrimary: '#EA6D22',
                    colorInfo: '#EA6D22',
                },
            }}
        >
            {children}
            <ToastContainer autoClose={2000} theme="colored" />
        </ConfigProvider>
    );
}

export default function ThemeProvider(props: ProviderProps) {
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // use your loading page
        return <div className="hidden">{props.children}</div>;
    }

    return <AntdConfigProvider {...props} />;
}
