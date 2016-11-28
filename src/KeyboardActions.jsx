import Keys from './Keys.jsx';

export default class KeyboardActions {
    constructor(dispatcher) {
        this._dispather = dispatcher;
    }

    up() {
        this._dispather.dispatch({
            key: Keys.Up
        });
    }

    down() {
        this._dispather.dispatch({
            key: Keys.Down
        });
    }

    left() {
        this._dispather.dispatch({
            key: Keys.Left
        });
    }

    right() {
        this._dispather.dispatch({
            key: Keys.Right
        });
    }

    space() {
        this._dispather.dispatch({
            key: Keys.Space
        });
    }
}