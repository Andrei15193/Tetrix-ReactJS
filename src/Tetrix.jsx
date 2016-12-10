import React from 'react';
import KeyboardDispatcher from './KeyboardDispatcher.jsx';

import TetrixGame from './TetrixGame.jsx';
import TetrixView from './TetrixView.jsx';
import Styles from './Tetrix.css';

export default class Tetrix extends React.Component {
    constructor(props) {
        super(props);
        this._store = new TetrixGame(this.props.width, this.props.height);
    }

    componentWillMount() {
        document.title = "Tetrix - ALPHA";
        this._handleId = KeyboardDispatcher.register(this._store.handle.bind(this._store));
    }

    componentWillUnmount() {
        KeyboardDispatcher.unregister(this._handleId);
    }

    render() {
        return (<TetrixView store={this._store} styles={Styles} />);
    }
}