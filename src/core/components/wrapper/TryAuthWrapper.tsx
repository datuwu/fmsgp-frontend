import * as React from 'react';

import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { store } from '@/core/store';
import { userActions } from '@/core/store/user';

interface TryAuthWrapperProps {
    children: React.ReactNode;
}

const TryAuthWrapper: React.FC<TryAuthWrapperProps> = ({ children }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        if (isMounted) {
            const cookies = new Cookies();

            const currentToken = cookies.get(NKConstant.TOKEN_COOKIE_KEY) || '';

            store.dispatch(userActions.setToken(currentToken));
        } else {
            setIsMounted(true);
        }
    }, [isMounted]);

    return <>{children}</>;
};

export default TryAuthWrapper;
