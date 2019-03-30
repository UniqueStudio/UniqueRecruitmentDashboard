import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

import { drawerWidth } from './index';

const styles = ({ zIndex, palette, transitions, spacing: { unit }, breakpoints }: Theme) => createStyles({
    appBar: {
        zIndex: zIndex.drawer + 1,
        background: `linear-gradient(60deg, ${palette.primary.main}, ${palette.primary.dark})`,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
        }),
    },
    appBarGutters: {
        paddingRight: 0,
    },
    regular: {
        minHeight: unit * 8,
        [breakpoints.down('xs')]: {
            minHeight: unit * 6,
        },
    },
    menuButton: {
        marginLeft: unit * 2,
        marginRight: unit * 4,
        [breakpoints.down('xs')]: {
            marginLeft: 0,
            marginRight: 0,
            padding: unit
        },
    },
    rightButtons: {
        marginLeft: 'auto',
        display: 'flex',
        '& button': {
            [breakpoints.down('xs')]: {
                padding: unit
            },
        }
    },
    hide: {
        display: 'none',
    },
    suggestion: {
        padding: unit * 2,
        overflowY: 'auto'
    },
    collapse: {
        zIndex: zIndex.drawer + 1,
        position: 'fixed',
        top: unit * 8,
        [breakpoints.down('xs')]: {
            top: unit * 6,
        },
        right: 0,
    }
});

export default styles;
