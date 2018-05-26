const Board = require('./Board.js');
const { isWinner } = require('../utils/gameUtils');
const { triplePatterns } = require('../lib/constants.js');
const { MARKER_1, MARKER_2, DEFAULT_AI_SKILL } = require('../lib/constants.js');

const firstMoves = {
	center: '5', // Optimal
	corners: '1,3,7,9' // Secondary, still winnable.
}

/**
 * Class that contains Ai bot information and methods.
 */
class Ai {
	constructor(name, marker, skill = DEFAULT_AI_SKILL, moveSpeed = 1000) {
		this.name = name;
		this.marker = marker;
		this.moveSpeed = moveSpeed; 
		this.skill = skill;
	}

	getName () {
		return this.name;
	}

	getMarker() {
		return this.marker;
	}

	getMove(board) {
		const moveType = Math.random() <= this.skill ? 'skilled' : 'random';
		const variance = this._createMoveSpeedVariance();
		const totalTime = this.moveSpeed + variance;
		console.log('\nThinking time is', totalTime, 'ms.', 'Move type is', `[${moveType}].`);
		console.log(`<move-speed: ${this.moveSpeed}> \n<variance: ${variance}>\n`);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let position;
				if (moveType === 'skilled') {
					position = this.skilledMove(board);
				} else if (moveType === 'random') {
					position = this.randomMove(board);
				} else {
					position = this.randomMove(board);
				}
				resolve(position);
			}, totalTime);
		});
	}

	skilledMove(board) {
		const emptyPositions = board.getEmptyPositions();
		
		if (emptyPositions.length === 9) {
			return firstMoves.center;
		} else {
			const newBoard = new Board(board.getData());
			const bestMoveOptions = this._minmax(newBoard, 0, this.marker);
			const index = Math.floor(Math.random() * bestMoveOptions.length);
			return bestMoveOptions[index].move;
		}
	}

	randomMove(board) {
		const emptyPositions = board.getEmptyPositions();
		const index = Math.floor(Math.random() * emptyPositions.length);
		const choice = emptyPositions[index];
		return choice;
	}

	_createMoveSpeedVariance() {
		const sign = Math.random() > 0.5 ? 1 : -1;
		const variance = Math.floor(Math.random() * Math.floor(this.moveSpeed / 2));
		return variance * sign;
	}

	// Used for the calculation of skilled moves
	_minmax(board, depth, marker) {
		const oppMarker = (marker === MARKER_1) ? MARKER_2 : MARKER_1; 
		const winnerInfo = isWinner(board, oppMarker);

		if (winnerInfo === null && board.getEmptyPositions().length !== 0) {
			const values = [];
			const emptyPositions = board.getEmptyPositions();
			for (let pos of emptyPositions) {
				const newBoard = new Board(board.getData());
				newBoard.setMark(pos, marker);
				const value = this._minmax(newBoard, depth + 1, oppMarker);
				values.push({
					value,
					move: pos
				});
			}

			if (this.marker === marker) {
				const maxMove = values.reduce((a, b) => {
					if (a.value >= b.value) {
						return a;
					} else {
						return b;
					}
				}, { value: -Infinity});
				
				if (depth === 0) {
					return values.filter((p) => {
						return p.value === maxMove.value;
					});
				} else {
					return maxMove.value;
				}
			} else {
				const minMove = values.reduce((a, b) => {
					if (a.value <= b.value) {
						return a;
					} else {
						return b;
					}
				}, { value: Infinity });
				
				if (depth === 0) {
					return values.filter((p) => {
						return minMove.value === p.value;
					});
				} else {
					return minMove.value;
				}
			}
		} else if (winnerInfo === null && board.getEmptyPositions().length === 0) {
			return 0;
		} else if (winnerInfo.marker === this.marker) {
			return 20 - depth;
		} else if (winnerInfo.marker !== this.marker) {
			return depth - 20;
		}
	}
}

module.exports = Ai;