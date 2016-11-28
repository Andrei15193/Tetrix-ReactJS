import React from 'react';
import KeyCodes from './KeyCodes.jsx';
import ShapeNames from './ShapeNames.jsx';

export default class TetrixView extends React.Component {
    constructor(props) {
        super(props);
        this._keyPressed = this._keyPressed.bind(this);
        this.state = { gameState: this.props.store.state };
        this.props.store.on("stateChanged", () => this.setState({ gameState: this.props.store.state }));
    }

    componentDidMount() {
        document.addEventListener("keydown", this._keyPressed);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._keyPressed);
        if (this, props.store.state == "InProgress")
            this.props.store.pause();
    }

    _keyPressed(e) {
        if (this.props.store.state == "NotStarted")
            this.props.store.start();

        switch (e.keyCode) {
            case KeyCodes.Up:
                this.props.keyboardActions.up();
                break;

            case KeyCodes.Left:
                this.props.keyboardActions.left();
                break;

            case KeyCodes.Right:
                this.props.keyboardActions.right();
                break;

            case KeyCodes.Down:
                this.props.keyboardActions.down();
                break;

            case KeyCodes.Space:
                this.props.keyboardActions.space();
                break;
        }
    }

    render() {
        var title;
        if (this.props.store.state == "GameOver")
            title = (<h1>Game Over</h1>);
        else
            title = (<h1>Tetrix<sub>ALPHA</sub></h1>);

        return (
            <div className={this.props.styles.tetrix}>
                {title}
                <div className={this.props.styles.container}>
                    <MapView map={this.props.store.map} styles={this.props.styles} />
                    <ScoreView rank={this.props.store.rank} styles={this.props.styles} />
                    <ShapeView store={this.props.store} styles={this.props.styles} />
                </div>
                <div className={this.props.styles.controls}>
                    <h3>Controls</h3>
                    <p>Use the <em>up</em> key to rotate the shape, the other <em>arrow keys</em> to move and <em>space</em> key to drop.</p>
                    <p>Press any key to start the game.</p>
                    <p>Good luck!</p>
                </div>
            </div>
        );
    }
}

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = this._storeState;
        this.props.map.on("mapChanged", () => this.setState(this._storeState));
    }

    get _storeState() {
        return getMapFrom(this.props.map.rows, this.props.styles);
    }

    render() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this.props.map.height; rowIndex++) {
            var cells = [];
            for (var cellIndex = 0; cellIndex < this.props.map.width; cellIndex++) {
                var cellKey = getCellKey(rowIndex, cellIndex);
                cells.push(
                    <div key={cellKey} className={this.props.styles.cell}>
                        <div className={this.state[cellKey]} />
                    </div>
                );
            }
            var rowKey = getRowKey(rowIndex);
            rows.push(
                <div key={rowKey} className={this.props.styles.row}>
                    {cells}
                </div>
            );
        }

        return (
            <div className={this.props.styles.map}>
                <div className={this.props.styles.grid}>
                    {rows}
                </div>
            </div>
        );
    }
}

class ScoreView extends React.Component {
    constructor(props) {
        super(props);
        this.state = this._storeState;
        this.props.rank.on("rankChanged", () => this.setState(this._storeState));
    }

    get _storeState() {
        const state = {
            score: this.props.rank.score,
            level: this.props.rank.level
        };
        return state;
    }

    render() {
        return (
            <div className={this.props.styles.rank}>
                <div title="score/level">
                    <span className={this.props.styles.score}>{this.state.score}</span>
                    /
                    <span className={this.props.styles.level}>{this.state.level}</span>
                </div>
            </div>
        );
    }
}

const ShapeTopOffset = 1;
const ShapeLeftOffset = 1;

class ShapeView extends React.Component {
    constructor(props) {
        super(props);
        this._width = 5;
        this._height = 4;

        this.state = this._storeState;
        this.props.store.on("nextShapeChanged", () => this.setState(this._storeState));
    }

    get _storeState() {
        var rows = this._storeStateGrid;
        return getMapFrom(rows, this.props.styles)
    }

    get _storeStateGrid() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this._height; rowIndex++) {
            var row = [];
            for (var cellIndex = 0; cellIndex < this._width; cellIndex++)
                row.push(null);
            rows.push(row);
        }

        this.props.store.nextShape.squareLocations.forEach(function (squareLocation) {
            var rowIndex = (squareLocation.top + ShapeTopOffset);
            var cellIndex = (squareLocation.left + ShapeLeftOffset);
            var cellStyle = getCellStyle(row[cellIndex], this.props.styles);
            rows[rowIndex][cellIndex] = this.props.store.nextShape.name;
        }, this);

        return rows;
    }

    render() {
        var rows = [];
        for (var rowIndex = 0; rowIndex < this._height; rowIndex++) {
            var cells = [];
            for (var cellIndex = 0; cellIndex < this._width; cellIndex++) {
                var cellKey = getCellKey(rowIndex, cellIndex);
                cells.push(
                    <div key={cellKey} className={this.props.styles.cell}>
                        <div className={this.state[cellKey]} />
                    </div>
                );
            }
            var rowKey = getRowKey(rowIndex);
            rows.push(
                <div key={rowKey} className={this.props.styles.row}>
                    {cells}
                </div>
            );
        }

        return (
            <div className={this.props.styles.nextShape}>
                <div className={this.props.styles.grid}>
                    {rows}
                </div>
            </div>
        );
    }
}

function getMapFrom(rows, styles) {
    var map = {};
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        for (var cellIndex = 0; cellIndex < row.length; cellIndex++) {
            var cellStyle = getCellStyle(row[cellIndex], styles);
            var cellKey = getCellKey(rowIndex, cellIndex);
            map[cellKey] = cellStyle;
        }
    }
    return map;
}

function getCellStyle(cellValue, styles) {
    var cellStyle;
    switch (cellValue) {
        case ShapeNames.I:
            cellStyle = styles.shapeI;
            break;

        case ShapeNames.J:
            cellStyle = styles.shapeJ;
            break;

        case ShapeNames.L:
            cellStyle = styles.shapeL;
            break;

        case ShapeNames.O:
            cellStyle = styles.shapeO;
            break;

        case ShapeNames.S:
            cellStyle = styles.shapeS;
            break;

        case ShapeNames.T:
            cellStyle = styles.shapeT;
            break;

        case ShapeNames.Z:
            cellStyle = styles.shapeZ;
            break;

        case null:
            cellStyle = styles.shapeNone;
            break;
    }
    return cellStyle;
}

function getRowKey(rowIndex) {
    return rowIndex.toString();
}

function getCellKey(rowIndex, cellIndex) {
    return (rowIndex.toString() + '.' + cellIndex.toString());
}