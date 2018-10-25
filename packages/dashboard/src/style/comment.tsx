import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

import mergeKV from '../lib/mergeKV';

import { colorToAlpha, colorToShadow, dangerColor, infoColor, successColor, warningColor } from './index';

export const colorStyles = mergeKV(['info', 'success', 'warning', 'danger'],
    [infoColor, successColor, warningColor, dangerColor].map((color) => ({
        background: color,
        color: 'white',
        boxShadow: colorToShadow(color),
    })));

const rootColorStyles = mergeKV(['root-info', 'root-success', 'root-warning', 'root-danger'],
    [infoColor, successColor, warningColor, dangerColor].map((color) => ({
        '& span': {
            pointerEvents: 'none',
        },
        '&:hover': {
            background: colorToAlpha(color, 0.6),
        },
        '&:focus, &:active': {
            background: color,
        },
    }))
);

const styles: StyleRulesCallback = (theme: Theme) => ({
    chip: {
        margin: theme.spacing.unit,
        cursor: 'pointer',
    },
    popover: {
        pointerEvents: 'none',
    },
    content: {
        maxWidth: 400,
        padding: theme.spacing.unit * 2,
        wordWrap: 'break-word',
    },
    ...colorStyles,
    ...rootColorStyles,
});

export default styles;
