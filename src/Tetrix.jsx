import React from 'react';
import { Dispatcher } from 'flux';

import TetrixGame from './TetrixGame.jsx';
import KeyboardActions from './KeyboardActions.jsx';
import TetrixView from './TetrixView.jsx';
import Styles from './Tetrix.css';

export default class Tetrix extends React.Component {
    constructor(props) {
        super(props);
        const dispatcher = new Dispatcher();
        this._store = new TetrixGame(this.props.width, this.props.height);
        this._actions = new KeyboardActions(dispatcher);

        dispatcher.register(this._store.handle.bind(this._store));
    }

    componentWillMount() {
        document.title = "Tetrix - ALPHA";
    }

    render() {
        return (<TetrixView store={this._store} keyboardActions={this._actions} styles={Styles} />);
    }
}