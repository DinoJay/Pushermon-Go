import React from 'react';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
// import debug from 'debug';

import MainLayout from './layouts/MainLayout';
import App from './App';
import Challenge from './components/cards/Card';
import JournalStore from './ChallengeCRUD';
// import NotFound from './containers/NotFound/NotFound';

// debug('lego:routes');
const siteTitle = 'MappCards';

export const routes = {
  App: {
    path: '/',
    label: 'Map',
    title: `${siteTitle} - About`,
    component: App
  },
  Challenge: {
    path: '/challenge/',
    label: 'challenge',

    title: `${siteTitle} - Challenge`,
    component: Challenge
  },
  Journal: {
    path: '/journal/',
    label: 'Journal',
    title: `${siteTitle} - Todo`,
    component: JournalStore
  }
};

const indexRoute = route => Object.assign({}, route, { path: null });

export const LinkHelper = ({ to, ...props }) => {
  if (!routes[to]) throw new Error(`Route to '${to}' not found`);
  return (
    <Link to={routes[to].path} {...props}>
      { props.children || routes[to].label }
    </Link>
  );
};


export function makeRoutes() {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={MainLayout}>
        <IndexRoute {...indexRoute(routes.App)} />
        <Route {...routes.Journal} />
        <Route {...routes.Challenge} />
      </Route>
    </Router>
  );
}
