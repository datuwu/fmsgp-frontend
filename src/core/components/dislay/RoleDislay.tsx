import * as React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface RoleDisplayProps {
    children: React.ReactNode;
}

const RoleDisplay: React.FC<RoleDisplayProps> = ({ children }) => {
    const userStoreState = useSelector<RootState, UserState>((state) => state.user);
    const [isDisplay, setIsDisplay] = React.useState(false);

    React.useEffect(() => {
        if (!userStoreState.isAuth) {
            setIsDisplay(true);
        }
    }, [userStoreState.isAuth, userStoreState.isLogin]);

    return <>{isDisplay ? children : <></>}</>;
};

export default RoleDisplay;
