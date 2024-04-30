import { call, put, takeLatest } from 'redux-saga/effects';

import { roleApi } from '@/core/api/role.api';

import { apiActions } from '.';

function* getAllUserRole(): any {
    const userRoles = yield call(roleApi.getAll);

    yield put(apiActions.setRoles(userRoles));
}

export default function* apiSaga() {
    yield takeLatest(apiActions.getRoles, getAllUserRole);
}
