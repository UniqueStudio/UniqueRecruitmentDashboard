import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PieChartIcon from '@material-ui/icons/PieChart';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/drawer';
import Anchor from '../Anchor';

const listItems = [
    { to: '/', text: 'Dashboard', icon: <HomeIcon /> },
    { to: '/data', text: '招新数据', icon: <PieChartIcon /> },
    { to: '/candidates', text: '选手信息', icon: <DashboardIcon /> },
    { to: '/my', text: '组员信息', icon: <PeopleIcon /> },
];

const Menu: FC = observer(() => {
    const { $component } = useStores();
    const classes = useStyles();

    return (
        <Drawer
            variant='permanent'
            classes={{ paper: clsx(classes.drawerPaper, !$component.drawerOpen && classes.drawerPaperClose) }}
            open={$component.drawerOpen}>
            <div className={classes.toolbar}>
                <IconButton onClick={() => $component.toggleDrawer()}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                {listItems.map(({ to, text, icon }, index) => (
                    <Anchor to={to} key={index}>
                        <ListItem button onClick={$component.drawerOpen ? () => $component.toggleDrawer() : undefined}>
                            <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </Anchor>
                ))}
            </List>
        </Drawer>
    );
});

export default Menu;
