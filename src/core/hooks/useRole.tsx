import React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from '../store';
import { UserState } from '../store/user';

export const useRole = (isOnlyRole: boolean = false) => {
    const { role, isAuth } = useSelector<RootState, UserState>((state) => state.user);
    const [isAllowed, setIsAllowed] = React.useState(true);

    return [isAllowed];
};
