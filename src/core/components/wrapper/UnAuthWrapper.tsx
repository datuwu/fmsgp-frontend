'use client';

import * as React from 'react';

import { useSelector } from 'react-redux';

import { NKConstant } from '@/core/NKConstant';
import { useNKPathname } from '@/core/routing/hooks/NKPathname';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface UnAuthWrapperProps {
    children: React.ReactNode;
}

const UnAuthWrapper: React.FC<UnAuthWrapperProps> = ({ children }) => {
    const { isAuth, id, isLogin } = useSelector<RootState, UserState>((state) => state.user);
    const router = useNKRouter();
    const pathName = useNKPathname();

    React.useEffect(() => {
        if (isLogin && isAuth && id && pathName === NKConstant.AUTH_FAILED_FALLBACK_ROUTE) {
            router.push(NKConstant.AUTH_SUCCESS_FALLBACK_ROUTE);
        }
    }, [isAuth, id, isLogin]);

    return <>{children}</>;
};

export default UnAuthWrapper;
