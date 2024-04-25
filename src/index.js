import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

window.onerror = function (message, source, lineno, colno, error) {
  console.log('message: ', message);
  console.log('source: ', source);
  console.log('lineno: ', lineno);
  console.log('colno: ', colno);
  console.log('error: ', error);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
