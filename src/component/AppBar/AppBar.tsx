import React, { PureComponent } from "react";
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import RefreshIcon from '@material-ui/icons/Refresh';
import styles from '../../style/appBar'
import withRoot from '../../style/withRoot';
import Select from '../../container/AppBar/AppBarSelect';
import Anchor from '../Anchor';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Header } from './Header';

interface Props extends WithStyles {
    open: boolean;
    loggedIn: boolean;
    toggleOpen: () => void;
    logout: () => void;
}

class Bar extends PureComponent<Props & RouteComponentProps<{}>> {
    state = {
        anchorEl: undefined,
    };

    handleClick = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => {
        this.handleClose();
        this.props.logout();
    };

    refresh = () => {
        sessionStorage.clear();
        this.handleClose();
        window.location.reload();
    };

    render() {
        const { classes, open, loggedIn, toggleOpen, location } = this.props;
        const { pathname } = location;
        const pathToTitle = {
            '/': '联创团队招新管理系统',
            '/commonInterview': '2018年秋季招新',
            '/data': '历年数据展示',
            '/finalInterview': '2018秋招・群面',
            '/myInfo': '个人信息管理',
            '/myGroup': '组员信息管理',
        };
        return (
            <AppBar
                position="absolute"
                className={classNames(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar disableGutters={!open} classes={{
                    gutters: classes.appBarGutters
                }}>
                    <IconButton
                        color="inherit"
                        onClick={toggleOpen}
                        className={classNames(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Header title={pathToTitle[pathname]}>
                        {pathname === '/commonInterview' && <Select />}
                    </Header>
                    {loggedIn ?
                        <>
                            <div className={classes.rightButtons}>
                                <IconButton
                                    color="inherit"
                                    onClick={this.refresh}
                                >
                                    <RefreshIcon />
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    className={classNames(open && classes.hide)}
                                    onClick={this.handleClick}
                                >
                                    <PersonIcon />
                                </IconButton>
                            </div>
                            <Menu
                                anchorEl={this.state.anchorEl}
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.handleClose}
                                className={classes.options}
                            >
                                <Anchor to='/myInfo'><MenuItem onClick={this.handleClose}>个人信息</MenuItem></Anchor>
                                <Anchor to='/myGroup'><MenuItem onClick={this.handleClose}>组员信息</MenuItem></Anchor>
                                <MenuItem onClick={this.handleLogout}>退出</MenuItem>
                            </Menu>
                        </> : location.pathname !== '/' && <Redirect to='/' />}
                </Toolbar>
            </AppBar>
        );
    }
}

export default withRoot(withStyles(styles)(Bar));
