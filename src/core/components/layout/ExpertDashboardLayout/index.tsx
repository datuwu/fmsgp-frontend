'use client';

import React from 'react';

import { Layout, Menu } from 'antd';

import { useMenuDashboard } from '@/core/contexts/MenuDashboardContext';

import DashboardHeader from '../../header/DashboardHeader';

const { Content, Sider } = Layout;

interface ExpertDashboardLayoutProps extends React.PropsWithChildren {}

const ExpertDashboardLayout: React.FunctionComponent<ExpertDashboardLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const { menu } = useMenuDashboard();

    return (
        <Layout className="fade-in !min-h-screen min-w-[900px] overflow-auto">
            <DashboardHeader setCollapsed={setCollapsed} />
            <Layout className="">
                <Sider collapsed={collapsed} onCollapse={setCollapsed} className="relative min-h-[calc(100vh-64px)]">
                    <Menu mode="inline" className="h-full border-r-0" items={menu} />
                </Sider>
                <Layout className="">
                    <Content className="m-0 min-h-[280px] p-4">{children}</Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ExpertDashboardLayout;
