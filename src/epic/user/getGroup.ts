import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';

import { Action, customError, Dependencies, errHandler, USER } from '../index';

import { GET_GROUP_INFO_START, getGroupInfoFulfilled, GetGroupInfoStart } from '../../action';
import { StoreState } from '../../reducer';

import { URL, User } from '../../lib/const';

export const getGroupEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, localStorage }) =>
    action$.pipe(
        ofType(GET_GROUP_INFO_START),
        mergeMap((action: GetGroupInfoStart) => {
            const token = localStorage.getItem('token');
            const { group } = action;
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, USER);
            }
            if (!group) {
                return errHandler({ message: '请先完善个人信息', type: 'danger' }, USER);
            }
            const groupInfo = sessionStorage.getItem('groupInfo');
            if (groupInfo && !state$.value.user.shouldUpdateGroup) {
                return of(
                    getGroupInfoFulfilled(JSON.parse(groupInfo)),
                );
            }
            return ajax.getJSON(`${URL}/user/group/${group}`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                map((res: { type: string, data: User[] }) => {
                    if (res.type === 'success') {
                        return res.data;
                    }
                    throw customError(res);
                }),
                tap((data) => sessionStorage.setItem('groupInfo', JSON.stringify(data))),
                map((data) => getGroupInfoFulfilled(data)),
                startWith(
                    { type: USER.START },
                ),
                endWith(
                    { type: USER.SUCCESS },
                ),
                catchError((err) => errHandler(err, USER)));
        }),
    );