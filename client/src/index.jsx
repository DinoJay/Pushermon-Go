import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { makeRoutes } from './Routes';

const Routes = makeRoutes;

// import './globalStyles/index.scss';

render(<AppContainer><Routes /></AppContainer>, document.querySelector('#app'));

if (module && module.hot) {
  module.hot.accept('./Routes.jsx', () => {
    const Routes = require('./Routes.jsx').makeRoutes;
    render(
      <AppContainer>
        <Routes />
      </AppContainer>,
      document.querySelector('#app')
    );
  });
}
