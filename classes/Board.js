const { OPEN_POS } = require('../lib/constants.js');
const { colors } = require('../lib/colors.js');

/**
 * Class that holds user marks during a game.
 */
class Board {
	constructor(data = null) {
		this.data = data || new Array(9).fill(OPEN_POS);
	}
	
	resetBoard() {
		this.data = new Array(9).fill(OPEN_POS);
	}

	getData() {
		return this.data.slice(0);
	}

	setMark(position, value) {
		this.data[position-1] = value;
	}

	removeMark(position) {
		this.data[position-1] = OPEN_POS;
	}

	getPosition(position) {
		return this.data[position-1];
	}

	isEmpty(position) {
		return this.data[position-1] === OPEN_POS;
	}

	getEmptyPositions() {
		const emptyPositions = [];

		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i] === OPEN_POS) {
				emptyPositions.push(i + 1);
			}
		}

		return emptyPositions;
	}

	getMarkerPositions(marker) {
		const results = [];

		this.data.forEach((item, index) => {
			if (item === marker) {
				results.push(index + 1);
			}
		});

		return results;
	}

	getOpponentPositions(marker) {
		const results = [];

		this.data.forEach((item, index) => {
			if (item !== marker || item !== OPEN_POS) {
				results.push(index + 1);
			}
		});

		return results;
	}

	getRenderString() {
		const result = [];
		const top = `    ${this.data[0]}    |    ${this.data[1]}    |    ${this.data[2]}    \n`;
		const middle = `    ${this.data[3]}    |    ${this.data[4]}    |    ${this.data[5]}    \n`;
		const bottom = `    ${this.data[6]}    |    ${this.data[7]}    |    ${this.data[8]}    \n`;

		result.push(this._addFill(1));
		result.push(top);
		result.push(this._addFill(1));
		result.push(this._addRow());
		result.push(this._addFill(1));
		result.push(middle);
		result.push(this._addFill(1));
		result.push(this._addRow());
		result.push(this._addFill(1));
		result.push(bottom);
		result.push(this._addFill(1));
		
		return result.join('');
	}

	renderHighlightedBoard(highlightPositions, color) {
		const highlights = this.data.map((p, index) => {
			if (highlightPositions.includes((index+1).toString())) {
				return `${color}${p}${colors.reset}`;
			} else {
				return p;
			}
		});

		const result = [];
		const top = `    ${highlights[0]}    |    ${highlights[1]}    |    ${highlights[2]}    \n`;
		const middle = `    ${highlights[3]}    |    ${highlights[4]}    |    ${highlights[5]}    \n`;
		const bottom = `    ${highlights[6]}    |    ${highlights[7]}    |    ${highlights[8]}    \n`;

		result.push(this._addFill(1));
		result.push(top);
		result.push(this._addFill(1));
		result.push(this._addRow());
		result.push(this._addFill(1));
		result.push(middle);
		result.push(this._addFill(1));
		result.push(this._addRow());
		result.push(this._addFill(1));
		result.push(bottom);
		result.push(this._addFill(1));
		
		return result.join('');
	}

	_addRow() {
		const row = '-----------------------------\n';
		return row;
	}

	_addFill(count) {
		let result = '';
		const fill = '         |         |         \n';
		for (let i = 0; i < count; i++) {
			result += fill;
		}
		return result;
	}
}

module.exports = Board;