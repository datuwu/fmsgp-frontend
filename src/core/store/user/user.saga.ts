import _get from 'lodash/get';
import { decodeToken, isExpired } from 'react-jwt';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { userApi } from '@/core/api/user.api';

import { UserState, userActions } from './index';

function* getCurrentUser(): any {
    try {
        const state = (yield select((item) => item.user)) as UserState;
        const id = _get(decodeToken(state.token), 'UserId');
        const user = yield call(userApi.getById, id as any);

        yield put(userActions.setUser({ ...user }));
    } catch (error) {
        yield put(userActions.setLoginFailed());
    }
}

export default function* userSaga() {
    yield takeLatest(userActions.setToken, getCurrentUser);
}
