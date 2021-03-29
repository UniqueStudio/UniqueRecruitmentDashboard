import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        marginTop: spacing(8),
        height: 'calc(100vh - 64px)',
        overflowX: 'auto',
        [breakpoints.down('xs')]: {
            marginTop: spacing(7),
            height: 'calc(100vh - 56px)',
        },
    },
}));

export default useStyles;
