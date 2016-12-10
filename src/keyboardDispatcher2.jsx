import { Dispatcher } from "flux";
import Keys from "./keys";

const dispatcher = new Dispatcher();
export default dispatcher;

document.addEventListener("keydown", keyPressed);

const KeyCodes = {
    Up: 38,
    Down: 40,
    Left: 37,
    Right: 39,
    Space: 32
};

function keyPressed(e) {
    var action = getActionFor(e.keyCode);

    if (action != null)
        dispatcher.dispatch(action);
}

function getActionFor(keyCode) {
    switch (keyCode) {
        case KeyCodes.Up:
            return {
                key: Keys.Up
            };

        case KeyCodes.Left:
            return {
                key: Keys.Left
            };

        case KeyCodes.Right:
            return {
                key: Keys.Right
            };

        case KeyCodes.Down:
            return {
                key: Keys.Down
            };

        case KeyCodes.Space:
            return {
                key: Keys.Space
            };

        default:
            return null;
    }
}