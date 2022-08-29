import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Routing';
import reportWebVitals from './reportWebVitals';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from './Routing';
import './i18next';
ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={(<div>Loading....</div>)}>
    <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
