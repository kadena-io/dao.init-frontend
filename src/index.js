import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import NoSsr from '@material-ui/core/NoSsr';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
      <NoSsr>
        <CssBaseline/>
        <Router basename={process.env.PUBLIC_URL}>
          <App />
        </Router>
      </NoSsr>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
