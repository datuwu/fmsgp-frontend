import * as React from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { DragVerticalFill } from 'akar-icons';
import { Button, Dropdown } from 'antd';
import { MenuIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { roleApi } from '@/core/api/role.api';
import NKLink from '@/core/routing/components/NKLink';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState, store } from '@/core/store';
import { UserState, userActions } from '@/core/store/user';

interface DashboardHeaderProps {
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setCollapsed }) => {
    const router = useNKRouter();

    const userStore = useSelector<RootState, UserState>((state) => state.user);

    const userRole = useQuery({
        queryKey: ['user-role'],
        queryFn: async () => {
            return await roleApi.getAll();
        },

        enabled: userStore.isAuth,
        initialData: [],
    });

    const logoutMutation = useMutation({
        mutationFn: () => {
            const cookies = new Cookies();
            cookies.remove(NKConstant.TOKEN_COOKIE_KEY, { path: '/' });

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 500);
            });
        },

        onSuccess: () => {
            store.dispatch(userActions.resetState());

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
    });

    return (
        <div className="z-10 flex h-16 items-center justify-between gap-2 border border-black bg-white p-4 shadow-md">
            <div className="flex  items-center gap-2 ">
                <NKLink href={NKRouter.dashboard()}>
                    <div className="flex h-6 items-center gap-2">
                        <div className="h-full shrink-0 ">
                            <img src="/assets/images/logo.png" alt={NKConstant.APP_NAME} className=" h-6 w-6 " />
                        </div>
                        <div className="font-semibold text-black">{NKConstant.APP_NAME}</div>
                    </div>
                </NKLink>

                <>
                    <div className="ml-8 flex items-center gap-4">
                        <Button
                            type="primary"
                            onClick={() => {
                                setCollapsed((pre) => !pre);
                            }}
                            size="small"
                            icon={<MenuIcon className="h-5 w-5" />}
                        />
                    </div>
                </>
            </div>
            <div>
                <Dropdown
                    menu={{
                        items: [
                            // {
                            //     type: 'item',
                            //     label: 'Profile',
                            //     key: 'profile',
                            //     onClick: () => {
                            //         router.push(NKRouter.account.profile());
                            //     },
                            // },
                            // {
                            //     type: 'item',
                            //     label: 'Update Profile',
                            //     key: 'update-profile',
                            //     onClick: () => {
                            //         router.push(NKRouter.account.updateProfile());
                            //     },
                            // },
                            // {
                            //     type: 'item',
                            //     label: 'Change Password',
                            //     key: 'change-password',
                            //     onClick: () => {
                            //         router.push(NKRouter.account.changePassword());
                            //     },
                            // },

                            {
                                type: 'item',
                                label: 'Logout',
                                key: 'logout',
                                onClick: () => {
                                    logoutMutation.mutate();
                                },
                            },
                        ] as any,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-solid border-tango-500">
                            <img src={userStore.profilePictureUrl} alt="avatar" className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="flex flex-col items-center justify-start gap-1">
                            <span className="font-semibold">{userStore.name}</span>
                            <div className="text-xs">({userRole.data.find((item) => item.id === userStore.roleId)?.name || 'Role'})</div>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default DashboardHeader;
