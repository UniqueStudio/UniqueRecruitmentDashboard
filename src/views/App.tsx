import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';

import PageFrame from '@components/Frame';
import Login from '@components/Login';
import Notifier from '@components/Notifier';
import Progress from '@components/Progress';
import Snackbar from '@components/Snackbar';
import useStyles from '@styles/global';
import withRoot from '@styles/withRoot';
import { logger } from '@utils/console';

const Candidates = lazy(() => import('./Candidates'));
const Dashboard = lazy(() => import('./Dashboard'));
const Data = lazy(() => import('./Data'));
const My = lazy(() => import('./My'));
const NoMatch = lazy(() => import('./NoMatch'));

logger();

const App: FC = () => {
    useStyles();
    const routeRender = (Component: JSX.Element) => (props: RouteComponentProps) => (
        <PageFrame {...props}>
            <Suspense fallback={<Progress />}>{Component}</Suspense>
        </PageFrame>
    );
    return (
        <BrowserRouter>
            <Snackbar>
                <Notifier />
            </Snackbar>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/' exact render={routeRender(<Dashboard />)} />
                <Route path='/data' render={routeRender(<Data />)} />
                <Route path='/candidates' render={routeRender(<Candidates />)} />
                <Route path='/my' render={routeRender(<My />)} />
                <Route render={routeRender(<NoMatch />)} />
            </Switch>
        </BrowserRouter>
    );
};

export default withRoot(App);