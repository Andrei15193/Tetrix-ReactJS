import EventEmitter from 'events';
import Keys from './Keys.jsx';
import Location from './Location.jsx';
import Shapes from './Shapes.jsx';

export default class TetrixGame extends EventEmitter {
    constructor() {
        super();
        this._rank = new Rank();
        this._shapeEnumerator = new ShapeEnumerator();
        this._map = new Map(10, 20);
        this._map.setCurrentShape(this._shapeEnumerator.current);
        this._timeout = null;
    }

    get state() {
        if (this._timeout == null)
            if (!this._map.isValid())
                return "GameOver";
            else
                return "NotStarted";
        else
            return "InProgress";
    }

    start() {
        if (this._timeout != null)
            throw new Error("Game in progress.");
        if (!this._map.isValid())
            throw new Error("The game is over.");

        this._timeout = setTimeout(this._timerTick.bind(this), this._timeoutInterval);
        this.emit("stateChanged");
    }

    pause() {
        if (this._timeout == null)
            throw new Error("Game not in progress.");

        clearTimeout(this._timeout);
        this._timeout = null;
        this.emit("stateChanged");
    }

    get _timeoutInterval() {
        const factor = Math.min(this._rank._level, 10);
        return (1200 - (factor * 100));
    }

    _timerTick() {
        this._moveShapeDown();

        if (this._map.isValid())
            this._timeout = setTimeout(this._timerTick.bind(this), this._timeoutInterval);
        else {
            this._timeout = null;
            this.emit("stateChanged");
        }
    }

    get map() {
        return this._map;
    }

    get rank() {
        return this._rank;
    }

    get nextShape() {
        return this._shapeEnumerator.next;
    }

    _getShapeEmptyRows() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < 4; rowIndex++) {
            var row = [];
            for (var cellIndex = 0; cellIndex < 6; cellIndex++) {
                row.push(null);
            }
            rows.push(row);
        }
        return rows;
    }

    handle(action) {
        if (this.state == "InProgress") {
            var dropShape = false;
            switch (action.key) {
                case Keys.Left:
                    this._map.moveShapeLeft();
                    break;

                case Keys.Right:
                    this._map.moveShapeRight();
                    break;

                case Keys.Up:
                    this._map.rotateShape();
                    break;

                case Keys.Down:
                    this._moveShapeDown();
                    break;

                case Keys.Space:
                    this._dropShape();
                    break;
            }
        }
    }

    _moveShapeDown() {
        if (this._map.canMoveShapeDown())
            this._map.moveShapeDown();
        else
            this._dropShape();
    }

    _dropShape() {
        var filledCells = this._map.filledCells;
        var clearedLines = this._map.dropShape();
        this._rank.add(filledCells, clearedLines);
        this.emit("rankChanged");

        this._shapeEnumerator.moveNext();
        this._map.setCurrentShape(this._shapeEnumerator.current);
        this.emit("nextShapeChanged");
    }
}

class Map extends EventEmitter {
    constructor(width, height) {
        super();
        this._width = width;
        this._height = height;
        this._rows = this._getEmptyMap();
        this._shapeLocation = this._initialShapeLocation;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get rows() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this._height; rowIndex++) {
            var cells = [];
            for (var cellIndex = 0; cellIndex < this._width; cellIndex++)
                cells.push(this._rows[rowIndex][cellIndex]);
            rows.push(cells);
        }

        if (this.isValid())
            this._currentShape.squareLocations.forEach(function (itemLocation) {
                var rowIndex = (this._shapeLocation.top + itemLocation.top);
                var cellIndex = (this._shapeLocation.left + itemLocation.left);
                rows[rowIndex][cellIndex] = this._currentShape.name;
            }, this);

        return rows;
    }

    _getEmptyMap() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this._height; rowIndex++) {
            var row = [];
            for (var columnIndex = 0; columnIndex < this._width; columnIndex++)
                row.push(null);
            rows.push(row);
        }
        return rows;
    }

    get _initialShapeLocation() {
        return new Location(0, this._width / 2 - 2);
    }

    _getShapeEmptyRows() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < 4; rowIndex++) {
            var row = [];
            for (var cellIndex = 0; cellIndex < 6; cellIndex++) {
                row.push(null);
            }
            rows.push(row);
        }
        return rows;
    }

    setCurrentShape(shape) {
        this._currentShape = shape;
        this._shapeLocation = this._initialShapeLocation;
        this.emit("mapChanged");
    }

    moveShapeLeft() {
        var previousShapeLocation = this._shapeLocation;
        this._shapeLocation = this._shapeLocation.sendLeft();
        if (!this.isValid())
            this._shapeLocation = previousShapeLocation;
        else
            this.emit("mapChanged");
    }

    moveShapeRight() {
        var previousShapeLocation = this._shapeLocation;
        this._shapeLocation = this._shapeLocation.sendRight();
        if (!this.isValid())
            this._shapeLocation = previousShapeLocation;
        else
            this.emit("mapChanged");
    }

    canMoveShapeDown() {
        var previousShapeLocation = this._shapeLocation;
        try {
            this._shapeLocation = this._shapeLocation.sendDown();
            return this.isValid();
        }
        finally {
            this._shapeLocation = previousShapeLocation;
        }
    }

    moveShapeDown() {
        if (this.canMoveShapeDown())
            this._shapeLocation = this._shapeLocation.sendDown();
        else
            this._placeShape();

        this.emit("mapChanged");
    }

    rotateShape() {
        var previousShape = this._currentShape;
        this._currentShape = this._currentShape.rotate();
        if (!this.isValid())
            this._currentShape = previousShape;
        else
            this.emit("mapChanged");
    }

    dropShape() {
        do {
            var previousShapeLocation = this._shapeLocation;
            this._shapeLocation = this._shapeLocation.sendDown();
        } while (this.isValid());

        this._shapeLocation = previousShapeLocation;
        this._placeShape();
        var clearedLines = this._clearFullLines();

        this.emit("mapChanged");

        return clearedLines;
    }

    isValid() {
        var isValid = true;
        var locationIndex = 0;

        while (isValid && locationIndex < this._currentShape.squareLocations.length) {
            var shapeSquareRelativeLocation = this._currentShape.squareLocations[locationIndex];
            var shapeSquareAbsoluteLocation = new Location(this._shapeLocation.top + shapeSquareRelativeLocation.top, this._shapeLocation.left + shapeSquareRelativeLocation.left);

            isValid = (
                (shapeSquareAbsoluteLocation.top < this._height)
                && (shapeSquareAbsoluteLocation.top >= 0)
                && (shapeSquareAbsoluteLocation.left < this._width)
                && (shapeSquareAbsoluteLocation.left >= 0)
                && (this._rows[shapeSquareAbsoluteLocation.top][shapeSquareAbsoluteLocation.left] == null)
            );
            locationIndex++;
        }

        return isValid;
    }

    _placeShape() {
        this._currentShape.squareLocations.forEach(function (squareLocation) {
            const rowIndex = (squareLocation.top + this._shapeLocation.top);
            const cellIndex = (squareLocation.left + this._shapeLocation.left);
            this._rows[rowIndex][cellIndex] = this._currentShape.name;
        }, this);
    }

    get filledCells() {
        var filledCellsCount = 0;
        this._rows.forEach(function (row) {
            return row.forEach(function (cell) {
                if (cell !== null)
                    filledCellsCount++;
            });
        });
        return filledCellsCount;
    }

    _clearFullLines() {
        var removedLines = 0;

        var linesWithChanges = this._linesWithChanges.sort(function (left, right) {
            return (left - right);
        });

        linesWithChanges.forEach(function (lineWithChanges) {
            if (this._rows[lineWithChanges].filter(function (cell) {
                return (cell !== null);
            }).length == this._width) {
                this._removeLine(lineWithChanges);
                removedLines++;
            }
        }, this);

        return removedLines;
    }

    get _linesWithChanges() {
        return this
            ._currentShape
            .squareLocations
            .map(function (squareLocation) {
                return (squareLocation.top + this._shapeLocation.top);
            }, this)
            .filter(function onlyUnique(squareLocation, index, self) {
                return self.indexOf(squareLocation) === index;
            });
    }

    _removeLine(lineIndex) {
        while (lineIndex > 0) {
            for (var cellIndex = 0; cellIndex < this._width; cellIndex++)
                this._rows[lineIndex][cellIndex] = this._rows[lineIndex - 1][cellIndex];
            lineIndex--;
        }

        for (var cellIndex = 0; cellIndex < this._width; cellIndex++)
            this._rows[lineIndex][cellIndex] = null;
    }
}

class ShapeEnumerator {
    constructor() {
        this._allShapes = [
            Shapes.I,
            Shapes.J,
            Shapes.L,
            Shapes.O,
            Shapes.S,
            Shapes.T,
            Shapes.Z
        ];
        this._lastThreeShapes = [];

        this._current = this._getNextShape();
        this._next = this._getNextShape();
    }

    get current() {
        return this._current;
    }

    get next() {
        return this._next;
    }

    moveNext() {
        this._current = this._next;
        this._next = this._getNextShape();
    }

    _getNextShape() {
        var availableShapes = this._allShapes.filter(shape => (this._lastThreeShapes.indexOf(shape) == -1));
        var nextShape = availableShapes[Math.floor(((Math.random() + Date.now()) * 100)) % availableShapes.length];

        if (this._lastThreeShapes.length == 3)
            this._lastThreeShapes.splice(0, 1);
        this._lastThreeShapes.push(nextShape);

        return nextShape;
    }
}

class Rank extends EventEmitter {
    constructor() {
        super();
        this.reset();
    }

    get score() {
        return this._score;
    }

    get level() {
        return this._level;
    }

    add(filledCells, clearedLines) {
        if (clearedLines > 0) {
            this._totalRemovedLines += clearedLines;
            this._score += Math.round(filledCells * clearedLines * (1 + (this._level / 10)));
            while (this._totalRemovedLines >= this._milestone) {
                this._level++;
                this._milestoneCount++;
                this._milestone += (this._milestoneCount * 3);
            }
        }
        this.emit("rankChanged");
    }

    reset() {
        this._score = 0;
        this._level = 1;
        this._totalRemovedLines = 0;
        this._milestoneCount = 1;
        this._milestone = 5;
    }
}