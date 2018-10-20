import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

import { drawerWidth } from './index';

const styles: StyleRulesCallback = (theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: `linear-gradient(60deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarGutters: {
        paddingRight: 0,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    rightButtons: {
        marginLeft: 'auto',
        display: 'flex',
    },
    options: {
        zIndex: 5000,
    },
    hide: {
        display: 'none',
    },
    select: {
        'marginLeft': theme.spacing.unit * 4,
        '& *': {
            color: 'white !important',
        },
        '&:before, &:after': {
            display: 'none',
        },
        '& *:focus': {
            background: 'none',
        },
    },
    suggestion: {
        padding: theme.spacing.unit * 2,
    },
});

export default styles;
