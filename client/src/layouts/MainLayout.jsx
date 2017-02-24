import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';
import { routes, LinkHelper } from '../Routes';


import userPic from './user.png';
import './MainLayout.scss';

export default class MainLayout extends Component {

  static propTypes() {
    return {
      location: PropTypes.object,
      children: PropTypes.Array
    };
  }


  render() {
    // $('.navbar-nav').on('click', () => {
    //   $('.navbar-collapse').collapse('hide');
    // });
    const { children, location } = this.props;
    // const cfg = findRoute(location.pathname);
    // const route = cfg || routes.homepage;
    const route = routes.App;
    const navLinkProps = {
      className: 'layout__nav-link',
      activeClassName: 'layout__nav-link--selected'
      // 'data-toggle': 'collapse'
      // 'data-target': '.navbar-collapse.show'
    };


    return (
      <div className="layout layout--main">
        <DocumentMeta title={route.title} />
        <div className={location.pathname === '/' ? 'tickle-navbar-overlay' : ''}>
          <nav className="navbar navbar-light">
            <img
              className="tickle-thumbnail" type="button" data-toggle="collapse"
              data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01"
              aria-expanded="false" aria-label="Toggle navigation" src={userPic}
            />
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <a className="navbar-brand" href="#">Jan Maushagen</a>
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <LinkHelper to="Journal" {...navLinkProps} />
                </li>
                <li className="nav-item active">
                  <LinkHelper to="App" {...navLinkProps} />
                </li>
                <li className="nav-item active">
                  <LinkHelper to="Challenge" {...navLinkProps} />
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="layout__content">
          {children}
        </div>
        <footer className="layout__footer">
          Hosted at <a href="http://github.com/DinoJay">github.com/DinoJay</a>
        </footer>
      </div>
    );
  }
}
