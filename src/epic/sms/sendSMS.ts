import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { Action, customError, Dependencies, errHandler, SMS } from '../index';

import { SEND_SMS, SendSMS, toggleSnackbarOn } from '../../action';
import { StoreState } from '../../reducer';

import { URL } from '../../lib/const';

export const sendSMSEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(SEND_SMS),
        mergeMap((action: SendSMS) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, SMS);
            }
            return ajax.post(`${URL}/sms`, JSON.stringify(action.content), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap((response: AjaxResponse) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        return of(
                            toggleSnackbarOn('已成功发送短信', 'success'),
                            { type: SMS.SUCCESS },
                        );
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: SMS.START },
                ),
                catchError((err) => errHandler(err, SMS)),
            );
        }),
    );