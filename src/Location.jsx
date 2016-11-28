export default class Location {
    constructor(top, left) {
        this._top = top;
        this._left = left;
    }

    get top() {
        return this._top;
    }

    get left() {
        return this._left;
    }

    sendUp() {
        return new Location(this._top - 1, this._left);
    }
    sendDown() {
        return new Location(this._top + 1, this._left);
    }
    sendLeft() {
        return new Location(this._top, this._left - 1);
    }
    sendRight() {
        return new Location(this._top, this._left + 1);
    }
}