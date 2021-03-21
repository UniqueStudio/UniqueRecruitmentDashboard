import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, SetGroupAdmin, SET_GROUP_ADMIN, toggleProgress, updateGroupAdmin } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const setGroupAdminEpic: Epic<SetGroupAdmin> = (action$) =>
    action$.pipe(
        ofType(SET_GROUP_ADMIN),
        mergeMap((action) => {
            const token = checkToken();
            const { data } = action;
            return ajax
                .put(`${API}/user/admin`, JSON.stringify(data), {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                })
                .pipe(
                    mergeMap(({ response: res }) => {
                        const { type, newAdmins = [] } = res;
                        if (type === 'success') {
                            return of(
                                updateGroupAdmin({ newAdmins }),
                                toggleProgress(),
                                enqueueSnackbar('已成功修改管理员！', { variant: 'success' }),
                            );
                        }
                        throw customError(res);
                    }),
                    startWith(toggleProgress(true)),
                    catchError((err) => errHandler(err)),
                );
        }),
        catchError((err) => errHandler(err)),
    );
