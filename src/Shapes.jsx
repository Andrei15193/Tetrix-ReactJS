import ShapeNames from './ShapeNames.jsx';
import Location from './Location.jsx';

class Shape {
    constructor(name, squaresLocations, position) {
        this._name = name;
        this._squaresLocations = squaresLocations;
        this._position = (position || 0);
    }

    get name() {
        return this._name;
    }

    get squareLocations() {
        return this._squaresLocations[this._position];
    }

    rotate() {
        var newPosition;
        if (this._position == (this._squaresLocations.length - 1))
            newPosition = 0;
        else
            newPosition = (this._position + 1);

        return new Shape(this._name, this._squaresLocations, newPosition);
    }

    rotateBack() {
        var newPosition;
        if (this._position == 0)
            newPosition = (this._squaresLocations.length - 1);
        else
            newPosition = (this._position - 1);

        return new Shape(this._name, this._squaresLocations, newPosition);
    }
}

const I = new Shape(
    ShapeNames.I,
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
);

const J = new Shape(
    ShapeNames.J,
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
);

const L = new Shape(
    ShapeNames.L,
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
);

const O = new Shape(
    ShapeNames.O,
    [
        [
            new Location(0, 1),
            new Location(0, 2),
            new Location(1, 1),
            new Location(1, 2)
        ]
    ]
);

const S = new Shape(
    ShapeNames.S,
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
    ]
);

const T = new Shape(
    ShapeNames.T,
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
    ]
);

const Z = new Shape(
    ShapeNames.Z,
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
    ]
);

export default { I, J, L, O, S, T, Z };