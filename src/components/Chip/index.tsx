import { Chip as MuiChip, Paper, Popover } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, memo, MouseEventHandler, useState } from 'react';

import { Comment } from '@config/types';
import useStyles from '@styles/chip';

interface Props {
    comment: Comment;
    onRemove?: () => void;
    onCopy?: () => void;
}

export const Chip: FC<Props> = memo(({ comment: { content, evaluation, user }, onCopy, onRemove }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleOpen: MouseEventHandler = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const text = `${user.name}： ${content}`;
    const color = ['danger', 'warning', 'success'][evaluation];
    return (
        <>
            <MuiChip
                label={text}
                className={classes.chip}
                classes={{
                    root: clsx(classes[color], classes[`root-${color}`]),
                }}
                onMouseOver={handleOpen}
                onMouseOut={handleClose}
                onClick={onCopy}
                onDelete={onRemove}
            />
            <Popover
                className={classes.popover}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleClose}
                disableRestoreFocus
                disableEnforceFocus>
                <Paper className={clsx(classes.content, classes[color])}>{content}</Paper>
            </Popover>
        </>
    );
});
