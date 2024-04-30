import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserRole } from '@/core/models/userRole';

import { User } from '../../models/user';

export interface UserState {
    id: number | null;
    name: string;
    isAuth: boolean;
    isLogin: boolean;
    token: string;
    role: UserRole | null;
    isManager: boolean;
    purchasingStaffId: number | null;
    purchasingManagerId: number | null;
    supplierId: number | null;
    isPurchasingManager: boolean;
    isPurchasingStaff: boolean;
    isWarehouseStaff: boolean;
    isInspector: boolean;
    isSupplier: boolean;
    isAdmin: boolean;

    profilePictureUrl: string;
    roleId: number | null;
}

const initialState: UserState = {
    id: null,
    name: '',
    token: '',
    isAuth: false,
    isLogin: false,
    isManager: false,
    purchasingStaffId: null,
    purchasingManagerId: null,
    supplierId: null,
    isPurchasingStaff: false,
    isAdmin: false,
    isWarehouseStaff: false,
    isInspector: false,
    isPurchasingManager: false,
    isSupplier: false,
    role: null,
    profilePictureUrl: '',
    roleId: null,
};

const reducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetState: () => ({ ...initialState }),
        setToken: (state, action) => {
            const newState = { ...state };
            newState.token = action.payload;

            return newState;
        },
        setUser: (state, action: PayloadAction<User>) => {
            const newState = { ...state };

            newState.id = action.payload.id;
            newState.name = action.payload.fullName;
            newState.roleId = action.payload.roleId;
            newState.profilePictureUrl = action.payload.profilePictureUrl;
            newState.purchasingStaffId = action.payload.purchasingStaffId;
            newState.supplierId = action.payload.supplierId;
            newState.purchasingManagerId = action.payload.purchasingManagerId;

            newState.isManager = action.payload.roleId === 1;
            newState.isPurchasingManager = action.payload.roleId === 2;
            newState.isPurchasingStaff = action.payload.roleId === 3;

            newState.isWarehouseStaff = action.payload.roleId === 4;
            newState.isInspector = action.payload.roleId === 5;
            newState.isSupplier = action.payload.roleId === 6;
            newState.isAdmin = action.payload.roleId === 7;

            newState.isAuth = true;
            newState.isLogin = true;

            return newState;
        },

        setLoginFailed: (state) => {
            const newState = { ...state };
            newState.isAuth = false;
            newState.isLogin = true;
            return newState;
        },
    },
});

export const userActions = {
    ...reducer.actions,
};
export const userReducer = reducer.reducer;
