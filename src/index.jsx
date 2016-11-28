require('./Index.html');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import Styles from './Index.css';

document.body.className = Styles.body;
ReactDOM.render(<App />, document.getElementById('app'));