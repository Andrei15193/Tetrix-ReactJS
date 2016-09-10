require('./tetrix.css');

import React from 'react';

class Location {
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

class Shape {
    static get i() {
        return new Shape(
            'i',
            [
                [
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(0, 3)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 1),
                    new Location(1, 1),
                    new Location(2, 1)
                ]
            ]
        )
    }

    static get j() {
        return new Shape(
            'j',
            [
                [
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 2)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 1),
                    new Location(1, 1),
                    new Location(1, 0)
                ],
                [
                    new Location(-1, 0),
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2)
                ],
                [
                    new Location(-1, 1),
                    new Location(-1, 2),
                    new Location(0, 1),
                    new Location(1, 1)
                ]
            ]
        )
    }

    static get l() {
        return new Shape(
            'l',
            [
                [
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 0)
                ],
                [
                    new Location(-1, 0),
                    new Location(-1, 1),
                    new Location(0, 1),
                    new Location(1, 1)
                ],
                [
                    new Location(-1, 2),
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 1),
                    new Location(1, 1),
                    new Location(1, 2)
                ]
            ]
        )
    }

    static get o() {
        return new Shape(
            'o',
            [
                [
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 1),
                    new Location(1, 2)
                ]
            ]);
    }

    static get s() {
        return new Shape(
            's',
            [
                [
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 0),
                    new Location(1, 1)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 2)
                ]
            ]);
    }

    static get t() {
        return new Shape(
            't',
            [
                [
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 1)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(1, 1)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(0, 2)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 1),
                    new Location(0, 2),
                    new Location(1, 1)
                ]
            ]);
    }

    static get z() {
        return new Shape(
            'z',
            [
                [
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(1, 1),
                    new Location(1, 2)
                ],
                [
                    new Location(-1, 1),
                    new Location(0, 0),
                    new Location(0, 1),
                    new Location(1, 0)
                ]
            ]);
    }

    static getRandomShape() {
        var availableShapes = [
            Shape.i,
            Shape.j,
            Shape.l,
            Shape.o,
            Shape.s,
            Shape.t,
            Shape.z
        ];
        var shape = availableShapes[Math.floor((Math.random() * 100)) % availableShapes.length];
        return shape;
    }

    constructor(name, itemsLocations) {
        this._name = name;
        this._itemsLocations = itemsLocations;
        this._position = 0;
    }

    get name() {
        return this._name;
    }

    get itemLocations() {
        return this._itemsLocations[this._position];
    }

    rotate() {
        this._position = ((this._position + 1) % this._itemsLocations.length);
    }

    rotateBack() {
        if (this._position == 0)
            this._position = (this._itemsLocations.length - 1);
        else
            this._position = (this._position - 1);
    }
}

class Tetrix {
    constructor(height, width) {
        this._height = height;
        this._width = width;
        this._gameOver = false;
        this._score = 0;
        this._level = 1;
        this._timeout = null;

        this._shape = Shape.getRandomShape();
        this._nextShape = Shape.getRandomShape();
        this._shapeLocation = this._initialShapeLocation;

        var fixedMap = [];
        for (var rowIndex = 0; rowIndex < this._height; rowIndex++) {
            var row = [];
            for (var columnIndex = 0; columnIndex < this._width; columnIndex++)
                row.push(null);
            fixedMap.push(row);
        }

        this._fixedMap = fixedMap;
    }

    get isStarted() {
        return (this._timeout != null);
    }

    start(callback) {
        this._gameOver = false;
        this._score = 0;
        this._level = 1;
        this._tickCallback = callback;
        this._totalRemovedLines = 0;
        this._milestoneCount = 1;
        this._milestone = 5;
        this._timeout = setTimeout(this._timerTick.bind(this), this._timeoutInterval);
    }

    pause() {
        clearTimeout(this._timeout);
        this._timeout = null;
    }

    resume() {
        this._timeout = setTimeout(this._timerTick.bind(this), this._timeoutInterval);
    }

    get score() {
        return this._score;
    }

    get level() {
        return this._level;
    }

    get nextShape() {
        return this._nextShape;
    }

    get map() {
        var map = [];
        this._fixedMap.forEach(function (row) {
            map.push(row.slice());
        });

        this._shape.itemLocations.forEach(function (itemLocation) {
            map[this._shapeLocation.top + itemLocation.top][this._shapeLocation.left + itemLocation.left] = this._shape.name;
        }, this);

        return map;
    }

    get gameOver() {
        return this._gameOver;
    }

    rotateShape() {
        this._shape.rotate();
        if (!this._isValid())
            this._shape.rotateBack();
    }

    rotateShapeBack() {
        this._shape.rotateBack();
        if (!this._isValid())
            this._shape.rotate();
    }

    moveShapeLeft() {
        var previousShapeLocation = this._shapeLocation;
        this._shapeLocation = this._shapeLocation.sendLeft();
        if (!this._isValid())
            this._shapeLocation = previousShapeLocation;
    }

    moveShapeRight() {
        var previousShapeLocation = this._shapeLocation;
        this._shapeLocation = this._shapeLocation.sendRight();
        if (!this._isValid())
            this._shapeLocation = previousShapeLocation;
    }

    moveShapeDown() {
        var previousShapeLocation = this._shapeLocation;
        this._shapeLocation = this._shapeLocation.sendDown();
        if (!this._isValid()) {
            this._shapeLocation = previousShapeLocation;
            this._placeShape();
        }
    }

    dropShape() {
        do {
            var previousShapeLocation = this._shapeLocation;
            this._shapeLocation = this._shapeLocation.sendDown();
        } while (this._isValid());

        this._shapeLocation = previousShapeLocation;
        this._placeShape();
    }

    _isValid() {
        var isValid = true;
        var locationIndex = 0;

        while (isValid && locationIndex < this._shape.itemLocations.length) {
            var shapeItemRelativeLocation = this._shape.itemLocations[locationIndex];
            var shapeItemAbsoluteLocation = new Location(this._shapeLocation.top + shapeItemRelativeLocation.top, this._shapeLocation.left + shapeItemRelativeLocation.left);

            isValid = (
                (shapeItemAbsoluteLocation.top < this._height)
                && (shapeItemAbsoluteLocation.top >= 0)
                && (shapeItemAbsoluteLocation.left < this._width)
                && (shapeItemAbsoluteLocation.left >= 0
                    && this._fixedMap[shapeItemAbsoluteLocation.top][shapeItemAbsoluteLocation.left] == null)
            );
            locationIndex++;
        }

        return isValid;
    }

    get _timeoutInterval() {
        const factor = Math.min(this._level, 17);
        return (1050 - (factor * 50));
    }

    _timerTick() {
        this.moveShapeDown();
        if (this._isValid())
            this._timeout = setTimeout(this._timerTick.bind(this), this._timeoutInterval);
        if (this._tickCallback)
            this._tickCallback();
    }

    _placeShape() {
        clearTimeout(this._timeout);

        this._placeShapeOnFixedMap();
        this._clearFullLines();
        this._goToNextShape();
        this._resetShapeLocation();

        this._gameOver = !this._isValid();

        if (!this._gameOver)
            this._timeout = setTimeout(this._timerTick.bind(this), this._timeoutInterval);
    }

    _placeShapeOnFixedMap() {
        this._shape.itemLocations.forEach(function (itemLocation) {
            this._fixedMap[itemLocation.top + this._shapeLocation.top][itemLocation.left + this._shapeLocation.left] = this._shape.name;
        }, this);
    }

    _clearFullLines() {
        var filledCells = this._getFilledCellsCount();
        var removedLines = 0;

        var linesWithChanges = this._linesWithChanges.sort(function (left, right) {
            return (left - right);
        });

        linesWithChanges.forEach(function (lineWithChanges) {
            if (this._fixedMap[lineWithChanges].filter(function (cell) {
                return (cell !== null);
            }).length == this._width) {
                this._removeLine(lineWithChanges);
                removedLines++;
            }
        }, this);

        if (removedLines > 0) {
            this._totalRemovedLines += removedLines;
            this._score += Math.round(filledCells * removedLines * (1 + (this._level / 10)));
            while (this._totalRemovedLines >= this._milestone) {
                this._level++;
                this._milestoneCount++;
                this._milestone += (this._milestoneCount * 3);
            }
        }
    }

    _getFilledCellsCount() {
        var filledCellsCount = 0;
        this._fixedMap.forEach(function (row) {
            return row.forEach(function (cell) {
                if (cell !== null)
                    filledCellsCount++;
            });
        });
        return filledCellsCount;
    }

    get _linesWithChanges() {
        return this
            ._shape
            .itemLocations
            .map(function (itemLocation) {
                return (itemLocation.top + this._shapeLocation.top);
            }, this)
            .filter(function onlyUnique(itemLocation, index, self) {
                return self.indexOf(itemLocation) === index;
            });
    }

    _removeLine(lineIndex) {
        while (lineIndex > 0) {
            for (var cellIndex = 0; cellIndex < this._width; cellIndex++)
                this._fixedMap[lineIndex][cellIndex] = this._fixedMap[lineIndex - 1][cellIndex];
            lineIndex--;
        }

        for (var cellIndex = 0; cellIndex < this._width; cellIndex++)
            this._fixedMap[lineIndex][cellIndex] = null;
    }

    _goToNextShape() {
        this._shape = this._nextShape;
        this._nextShape = Shape.getRandomShape();
    }

    _resetShapeLocation() {
        this._shapeLocation = this._initialShapeLocation;
    }

    get _initialShapeLocation() {
        return new Location(0, this._width / 2 - 2);
    }
}

export class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.clear();
    }

    clear() {
        var grid = {};
        for (var rowIndex = 0; rowIndex < this.props.height; rowIndex++)
            for (var columnIndex = 0; columnIndex < this.props.width; columnIndex++)
                grid[(rowIndex.toString() + ',' + columnIndex.toString())] = 'none';
        this.setState(grid);
    }

    update(value, locations) {
        var matrix = {};
        locations.forEach(function (location) {
            matrix[location.top.toString() + ',' + location.left.toString()] = (value || 'none');
        });

        this.setState(matrix);
    }

    render() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this.props.height; rowIndex++) {
            var rowKey = ("row " + rowIndex.toString());
            var cells = [];
            for (var columnIndex = 0; columnIndex < this.props.width; columnIndex++) {
                var cellKey = (rowIndex.toString() + ',' + columnIndex.toString());
                cells.push((
                    <div className="cell" key={cellKey}>
                        <div className={"shape-" + this.state[cellKey]}></div>
                    </div>));
            }
            rows.push(<div className="row" key={rowKey}>{cells}</div>);
        }

        return (
            <div className="map">{rows}</div>
        );
    }
}

export default class TetrixMap extends React.Component {
    static get defaultProps() {
        return {
            height: 20,
            width: 10
        }
    }

    static _getStateFrom(tetrix) {
        var map = {};
        tetrix.map.forEach(function (row, rowIndex) {
            row.forEach(function (cell, cellIndex) {
                map[rowIndex.toString() + ',' + cellIndex.toString()] = (cell || 'none');
            }, this);
        }, this);

        map.isGameOver = tetrix.gameOver;
        map.score = tetrix.score;
        map.level = tetrix.level;

        return map;
    }

    constructor(props) {
        super(props);

        this._tetrix = new Tetrix(props.height, props.width);
        this.state = TetrixMap._getStateFrom(this._tetrix);

        this._tetrix.start(this.updateMap.bind(this));
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyPressed.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyPressed.bind(this));
    }

    keyPressed(e) {
        const upKeyCode = 38;
        const downKeyCode = 40;
        const leftKeyCode = 37;
        const rightKeyCode = 39;
        const spaceKeyCode = 32;

        switch (e.keyCode) {
            case upKeyCode:
                this._tetrix.rotateShape();
                this.updateMap();
                break;

            case leftKeyCode:
                this._tetrix.moveShapeLeft();
                this.updateMap();
                break;

            case rightKeyCode:
                this._tetrix.moveShapeRight();
                this.updateMap();
                break;

            case downKeyCode:
                this._tetrix.moveShapeDown();
                this.updateMap();
                break;

            case spaceKeyCode:
                this._tetrix.dropShape();
                this.updateMap();
                break;
        }
    }

    updateMap() {
        this.setState(TetrixMap._getStateFrom(this._tetrix));
    }

    render() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this.props.height; rowIndex++) {
            var rowKey = ("row " + rowIndex.toString());
            var cells = [];
            for (var columnIndex = 0; columnIndex < this.props.width; columnIndex++) {
                var cellKey = (rowIndex.toString() + ',' + columnIndex.toString());
                cells.push((
                    <div className="cell" key={cellKey}>
                        <div className={"shape-" + this.state[cellKey]}></div>
                    </div>));
            }
            rows.push(<div className="row" key={rowKey}>{cells}</div>);
        }

        return (
            <div className="tetrix">
                <div className="tableRow gameTitle">
                    <div className="tableCell">
                        {this.state.isGameOver ?
                            (<span>Game Over</span>) :
                            (<span>Tetrix<sub>ALPHA</sub></span>) }
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell">
                        <div className="map">{rows}</div>
                    </div>
                    <div className="tableCell">
                        <div className="info">
                            <div>Next: </div>
                            <Grid ref={this._gridMounted.bind(this) } height={4} width={6} />
                            <div>Score: {this.state.score.toString() }</div>
                            <div>Level: {this.state.level.toString() }</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _gridMounted(grid) {
        if (grid != null) {
            this._grid = grid;
            this._grid.clear();
            this._grid.update(
                this._tetrix.nextShape.name,
                this._tetrix.nextShape.itemLocations.map(function (location) {
                    return location.sendRight().sendDown();
                }));
        }
    }
}