'use client';

import React from 'react';

import { Layout, Menu } from 'antd';
import { useSelector } from 'react-redux';

import { useMenuDashboard } from '@/core/contexts/MenuDashboardContext';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

import DashboardHeader from '../../header/DashboardHeader';
import AuthWrapper from '../../wrapper/AuthWrapper';
import RoleWrapper from '../../wrapper/RoleWrapper';

const { Content, Sider } = Layout;

interface DashboardLayoutProps extends React.PropsWithChildren {}

const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const { menu } = useMenuDashboard();

    return (
        <AuthWrapper>
            <RoleWrapper>
                <Layout className="fade-in !min-h-screen min-w-[900px] overflow-auto">
                    <DashboardHeader setCollapsed={setCollapsed} />
                    <Layout className="">
                        <Sider collapsed={collapsed} onCollapse={setCollapsed} width={250} className="relative  !bg-white  ">
                            <div className="flex h-full flex-col justify-between">
                                <div className="">
                                    <Menu mode="inline" className="h-fit border-r-0" items={menu} />
                                </div>
                            </div>
                        </Sider>
                        <Layout className="">
                            <Content className="m-0 min-h-[280px] p-4">{children}</Content>
                        </Layout>
                    </Layout>
                </Layout>
            </RoleWrapper>
        </AuthWrapper>
    );
};

export default DashboardLayout;
