import { Button, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React, { ChangeEventHandler, FC, memo, useEffect, useState } from 'react';

import { getVerifyCode } from '@apis/rest';
import useStyles from '@styles/verify';

interface Props {
    code: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const Verify: FC<Props> = memo(({ onChange, code }) => {
    const classes = useStyles();
    const [time, setTime] = useState(0);
    const [handle, setHandle] = useState(NaN);

    useEffect(
        () => () => {
            window.clearInterval(handle);
        },
        [handle],
    );

    const tick = () => {
        setTime((prevTime) => {
            if (prevTime === 0) {
                window.clearInterval(handle);
                setHandle(NaN);
                return 0;
            }
            return prevTime - 1;
        });
    };

    const getCode = () => {
        void getVerifyCode();
        setTime(60);
        setHandle(window.setInterval(tick, 1000));
    };
    return (
        <div className={clsx(classes.content, classes.item)}>
            <Button color='primary' onClick={getCode} disabled={time > 0}>
                {time > 0 ? `${time}秒后重新获取` : '获取验证码'}
            </Button>
            <TextField
                label='输入验证码'
                className={clsx(classes.item, classes.input)}
                onChange={onChange}
                value={code}
            />
        </div>
    );
});

export default Verify;
