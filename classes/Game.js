const Ai = require('./Ai.js');
const Board = require('./Board.js');
const Player = require('./Player.js');
const { colors } = require('../lib/colors.js');
const { messageStates } = require('../utils/viewUtils.js');
const { MARKER_1, MARKER_2, DEFAULT_AI_BASE_MS } = require('../lib/constants.js');
const { gameMessages, gameCommands, gameStates, isWinner } = require('../utils/gameUtils.js');

/**
 * Game class that handles game state and game logic.
 */
class Game {
	constructor(app) {
		this.app = app;
		this.board = new Board();
		this.gameEvents = new Array();
		this.players = [];
		this.gameCommands = gameCommands;
		this.gameMessages = gameMessages;
		this.paused = false;
		this.state = gameStates.init;
		this.activePlayer = null;
		this.winnerInfo = null;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
	}

	setActivePlayer(activePlayer) {
		this.activePlayer = activePlayer;
	}

	inputHandler(userInput) {
		if (userInput) {
			this.app._clearPrompt();
			// console.log('inside game', this.app.state, this.state);
			if (Object.keys(this.gameCommands).includes(userInput)) {
				this.app.show('Game', `Game Command '${userInput}' Accepted`, messageStates.success);
				this.gameCommands[userInput](this);
			} 
				
			if (!this.paused) {
				if (this.state === gameStates.init) {
					this._initStateHandler(userInput);
				} else if (this.state === gameStates.started) {
					this._startedStateHandler(userInput);
				} else if (this.state === gameStates.end) {
					this._endStateHandler(userInput);
				} else {
					
				}
			} else {
				console.log('Game paused.');
			}
		}
	}
	
	_initStateHandler(userInput) {
		if (userInput === 'ready') {
			this.state = gameStates.started;
			this._displayGameInfo();
		} else {
			this.app.show('', `${gameMessages.startPhrase}`, '');
			this.app.setPrompt(`${this.app.players['1']}: `);
		}
	}

	_startedStateHandler(userInput) {
		if (this.players[this.activePlayer] instanceof Player) {	
			// Show current user action.

			if (userInput === '1' || userInput === '2' || userInput === '3' ||
				userInput === '4' || userInput === '5' || userInput === '6' ||
				userInput === '7' || userInput === '8' || userInput === '9' ) {

				const position = parseInt(userInput);
				this._makeMove(this.activePlayer, position);

			} else {
				this.app.show('Game', `User input '${userInput}' is not valid position`, messageStates.warning);
			}		
		}
		
		this._displayGameInfo();
	}

	_endStateHandler(userInput) {
		if (userInput === 'end') {
			this._logGame(); // Log the game results	
			this.reset(); // reset game state. 

			this.app.show('', 'Game completed', '');
			this.gameCommands['home'](this); // take user back to home.

			this.app.setPrompt(`${this.app.players['1']}: `); // reset the prompt
		} else if (userInput === 'new') {
			this._logGame(); // Log the game results	

			this.gameCommands['reset'](this); // reset game state. 
			this.app.setPrompt(`${this.app.players['1']}: `); // reset the prompt
		} else if (userInput === 'home') {
			this.gameCommands['home'](this);
		} else {
			this._showEndInfo();
			this.app.show('', 'What would you like to do? Type "new" or "end".', '');
			this.app.setPrompt(`${this.app.players['1']}: `); // reset the prompt
		}
	}

	reset() {
		this.winnerInfo = null;
		this.paused = false;
		this.board.resetBoard();
		this.players = [];
		this.gameEvents = [];
		this.state = gameStates.init;
		this._showGameWelcome();
		this._initialize();
	}

	_initialize() {
		this.app.show('', 'Initializing players...', '');
		const playerCount = this.app.getPlayerCount();
		const moveSpeed = Math.floor(Math.random() * 1000) + DEFAULT_AI_BASE_MS; 

		if (playerCount == 0) {
			this.players.push(new Ai('ai-bot-1', MARKER_1, this.app.aiSkill, moveSpeed));
			this.players.push(new Ai('ai-bot-2', MARKER_2, this.app.aiSkill, moveSpeed));
		} 
		
		if (playerCount == 1) {
			this.players.push(new Player(this.app.players['1'], MARKER_1));
			this.players.push(new Ai('ai-bot-1', MARKER_2, this.app.aiSkill, moveSpeed));
		} 
		
		if (playerCount == 2) {
			this.players.push(new Player(this.app.players['1'], MARKER_1));
			this.players.push(new Player(this.app.players['2'], MARKER_2));
		}

		this.app.show('', this.gameMessages.players.replace('{player1}', this.players[0].name)
			.replace('{p1marker}', this.players[0].marker)
			.replace('{player2}', this.players[1].name)
			.replace('{p2marker}', this.players[1].marker), '');

		// Randomly select starting player.
		this.activePlayer = Math.floor(Math.random() * this.players.length);
		
		this.app.show('', '+ Randomly selecting starting player...', '');
		this.app.show('', gameMessages.firstMove.replace('{player}', this.players[this.activePlayer].name).replace('{marker}', this.players[this.activePlayer].marker), '');
		this.app.show('', `${ gameMessages.startPhrase}`, '');

		// this.app.setPrompt(`${this.app.players['1']}: `);a
	}

	showGameInfo() {
		this.app._clearPrompt();

		if (this.state === gameStates.init) {
			this.paused = false;
			this.reset();
		} else if (this.state === gameStates.started) {
			if (this.paused) {
				this.app.show('Game', 'Game paused. Type "resume" to continue...', messageStates.info);
			} else {
				this._displayGameInfo();
			}
		} else if (this.state === gameStates.end) {
			if (this.paused) {
				this.app.show('Game', 'Game paused. Type "resume" to continue...', messageStates.info);
			} else {
				this._showEndInfo();
			}
		} else {
			this.app.show('Game', 'Unexpected game state error', messageStates.warning);
			this.app.setState('app');
			this.app.run();
		}
	}

	_cycleActivePlayer() {
		if (this.activePlayer === 0) {
			this.activePlayer = 1;
		} else {
			this.activePlayer = 0;
		}
	}

	_makeMove(currentPlayer, position) {
		if (this.board.isEmpty(position)) {
			// Add move to game events.
			this.gameEvents.push({ player: currentPlayer, position });
			// Update board.
			this.board.setMark(position, this.players[currentPlayer].marker);
			// Get winner information.
			let info = isWinner(this.board, this.players[currentPlayer].marker);
			
			this.app._clearPrompt();
			
			if (info) {
				this.state = gameStates.end;
				this.winnerInfo = { ...info, player: this.players[currentPlayer].name, draw: false };
				this._showEndInfo();
				this.app.setPrompt(`${this.app.players['1']}: `);
			} else if (this.board.getEmptyPositions().length === 0) {
				this.state = gameStates.end;
				this.winnerInfo = { draw: true, index: null, key: null, pattern: '', marker: null, player: null };
				this._showEndInfo();
				this.app.setPrompt(`${this.app.players['1']}: `);
			} else {
				// this.app._clearPrompt();
				this._cycleActivePlayer();
			}
		} else {
			this.app.show('Game', 'Position is not empty', messageStates.warning);
			// this._cycleActivePlayer();
		}
	}

	async _displayGameInfo() {
		// AI player move loop.
		while(this.players[this.activePlayer] instanceof Ai && this.winnerInfo === null) {
			this.app.show('', this.gameMessages.help, '');
			this.app._clearPrompt();
			this._showPrevMove();
			this._showBoard();
			
			try {
				this.app.show('', this.gameMessages.turn.replace('{player}', this.players[this.activePlayer].name).replace('{marker}', this.players[this.activePlayer].marker), '');
				this.app.show('', `${this.players[this.activePlayer].name} (${this.players[this.activePlayer].marker}) is choosing...`, '');
				
				const aiChoice = await this.players[this.activePlayer].getMove(this.board);
				this._makeMove(this.activePlayer, aiChoice);
			} catch (e) {
				this.app.show('Game', e.message, messageStates.warning);
			}
		}
		
		if (this.players[this.activePlayer] instanceof Player && this.winnerInfo === null) {
			this.app.show('', this.gameMessages.help, '');
			this._showPrevMove();
			this._showBoard();

			this.app.show('', this.gameMessages.turn.replace('{player}', this.players[this.activePlayer].name).replace('{marker}', this.players[this.activePlayer].marker), '');
			this.app.show('', 'Select a position (1-9)', '');
			this.app.setPrompt(`${this.players[this.activePlayer].name}: `);
		}
	}

	_showGameWelcome() {
		this.app.show('', gameMessages.description, '');
		this.app.show('', gameMessages.instructions, '');
	}

	_showInitInfo() {
		this.app.show('', this.gameMessages.players.replace('{player1}', this.players[0].name)
			.replace('{p1marker}', this.players[0].marker)
			.replace('{player2}', this.players[1].name)
			.replace('{p2marker}', this.players[1].marker), '');
		this.app.show('', this.gameMessages.firstMove.replace('{player}', this.players[this.activePlayer].name).replace('{marker}', this.players[this.activePlayer].marker), '');
		this.app.show('', `${gameMessages.startPhrase}`, '');
		this.app.setPrompt(`${this.app.players['1']}: `);
	}

	_showBoard(positions = undefined) {
		if (positions === undefined) {
			this.app.show('', this.board.getRenderString(), '');
		} else {
			this.app.show('', this.board.renderHighlightedBoard(positions, colors.magenta), '');
		}
	}
	
	_showPrevMove() {
		const leng = this.gameEvents.length;
		if (leng > 0) {
			const {player, position} = this.gameEvents[this.gameEvents.length-1];
			this.app.show('Game', gameMessages.choice.replace('{player}', this.players[player].name).replace('{marker}',this.players[player].marker).replace('{position}', `${position}`), messageStates.special);
		}
	}

	_logGame() {
		if (this.winnerInfo) {
			this.app.addGameToHistory({ 
				date: new Date(), 
				players: `[ ${this.players[0].name} - ${this.players[0].marker} ] , [ ${this.players[1].name} - ${this.players[1].marker} ]`,
				winnerInfo: this.winnerInfo,
				endBoard: this.board.renderHighlightedBoard(this.winnerInfo.pattern, colors.magenta)
			});
		}
	}

	_showEndInfo() {
		if (this.winnerInfo) {
			if (this.winnerInfo.draw) {
				this.app.show('Game', `The game is a draw.`, 'special');
				this._showBoard();
				this.app.show('', gameMessages.endPhrase, '');
				// this.app.setPrompt(`${this.app.players['1']}: `);
			} else {
				this.app.show('Game', `${this.winnerInfo.player} is the winner`, 'special');
				this._showBoard(this.winnerInfo.pattern);
				this.app.show('', gameMessages.endPhrase, '');
				// this.app.setPrompt(`${this.app.players['1']}: `);
			}
		} else {
			this.app.show('Game', 'User ended the game prematurely', messageStates.warning);
		}
	}
}

module.exports = Game;