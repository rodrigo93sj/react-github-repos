import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Home from '../pages/Home';
import Repositories from '../pages/Repositories';

export default props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/repositories/:username' component={Repositories} />
        <Redirect from='*' to='/' />
      </Switch>
    </BrowserRouter>
  );
}
