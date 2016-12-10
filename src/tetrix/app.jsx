import React from "react";
import KeyboardDispatcher from "common/keyboardDispatcher";
import board from "./board";
import View from "./view";
import Styles from './style.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this._store = new board(this.props.width, this.props.height);
    }

    componentWillMount() {
        document.title = "Tetrix - ALPHA";
        this._handleId = KeyboardDispatcher.register(this._store.handle.bind(this._store));
    }

    componentWillUnmount() {
        KeyboardDispatcher.unregister(this._handleId);
    }

    render() {
        return (<View store={this._store} styles={Styles} />);
    }
}