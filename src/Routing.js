import React from 'react';
import App from './App';
// import App from './App2';
import Explore from './Explore';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";




export default function Routing() {
  return (
    <Router>
      <Switch>

        <Route path="/explore">
          <Explore />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>

    </Router>
  );
}

