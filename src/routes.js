import React from 'react';
import { Route } from 'react-router';
import App from './components/App/App';

import Home from './pages/Home';
import Member from './components/MembershipToggle/MembershipToggle';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/login' component={Member} />
  </Route>

);
