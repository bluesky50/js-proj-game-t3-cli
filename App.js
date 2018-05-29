const View = require('./classes/View.js');
const Game = require('./classes/Game.js');
const readline = require('readline');

const { colors } = require('./lib/colors.js');
const { messageStates } = require('./utils/viewUtils.js');
const { appName, P_1, P_2, DEFAULT_AI_SKILL, MARKER_1, MARKER_2 } = require('./lib/constants.js');
const { appCommands, appMessages, appStates } = require('./utils/appUtils.js');

// Handles user input
r1 = readline.createInterface(process.stdin, process.stdout);

/**
 * The App class that holds main application logic.
 */
class App {
	constructor(name, view = null, game = null) {
		this.appName = name || appName;
		this.appCommands = appCommands;
		this.appMessages = appMessages;
		this.state = 'app';
		this.playerCount = 1;
		this.aiSkill = DEFAULT_AI_SKILL;
		this.players = { '1': P_1, '1_MARKER': 'default', '2': P_2, '2_MARKER': 'default' };
		this.firstMover = null;
		this.view = view || new View();
		this.game = game || new Game(this);
		this.gameHistory = new Array();
	}

	// Intializes the callback for 'line' event listener.
	init() {
		r1.on('line', (line) => {
			let userInput = line.trim();
			if (userInput) {
				this.clearPrompt();
				if (this.state !== 'game' && Object.keys(this.appCommands).includes(userInput)) {					
					this.view.log(this.appName, `Command '${userInput}' accepted`, messageStates.success);
					this.appCommands[userInput](this);
					this._resetPrompt();
				} else if (this.state === appStates.app) {
					this._appStateInputHandler(userInput);
					this._resetPrompt();
				} else if (this.state === appStates.options) {
					this._optionsStateInputHandler(userInput);
				} else if (this.state === appStates.o1) {
					this._option1StateInputHandler(userInput);
				} else if (this.state === appStates.o2) {
					this._option2StateInputHandler(userInput);
				} else if (this.state === appStates.o3) {
					this._option3StateInputHandler(userInput);
				} else if (this.state === appStates.history) {
					this._historyStateInputHandler(userInput);
				} else if (this.state === appStates.game) {
					this._gameStateInputHandler(userInput);
				}
			} else {
				// Alternative ways to handle no line input values.
				
				// this.show(this.appName, 'Please select a valid option or type "help" for a list of commands.', messageStates.warning);
				// this.appCommands['menu'](this);
				// this._resetPrompt();
			}
		});
	}

	run() {
		this.clearPrompt();
		this.show('', appMessages.welcome, messageStates.info);
		this.appCommands['menu'](this);
	}

	close() {
		this.state = 'shutdown';
		r1.close();
		process.stdin.destroy();
		process.exit();
	}

	setState(state) {
		this.state = state;
	}

	setGame(game) {
		this.game = game;
	}

	getGame() {
		return this.game;
	}

	getPlayers() {
		return this.players;
	}

	getPlayerCount() {
		return this.playerCount;
	}

	getGameHistory() {
		return this.gameHistory;
	}

	addGameToHistory(gameInfo) {
		this.gameHistory.push(gameInfo);
	}
	
	setUserInfo(player, name, marker) {
		if (player === '1' || player === '2') {
			this.players[player] = name;

			const otherPlayerNum = player === '1' ? '2' : '1';
			const pMarkerInd = player + '_MARKER';
			const oppositeMarkerInd = otherPlayerNum + '_MARKER';

			if (marker === MARKER_1 || marker === MARKER_2 || marker === 'default') {
				if (marker === 'default') {
					this.players[player+'_MARKER'] = marker;
					this.show(this.appName, `Setting player ${player} marker to '${marker}'`, messageStates.success);
			const oppositeMarkerInd = otherPlayerNum + '_MARKER';
				} else if (marker !== this.players[oppositeMarkerInd]) {
					this.players[player+'_MARKER'] = marker;
					this.show(this.appName, `Setting player ${player} marker to '${marker}'`, messageStates.success);
				} else {
					this.show(this.appName, `${marker} is taken.`, messageStates.warning);
				}
			} else {
				this.show(this.appName, `${marker} is invalid (Use: ${MARKER_1} or ${MARKER_2}).`, messageStates.warning);
			}

			this.show(this.appName, `Setting player ${player} name to '${name}'`, messageStates.success);
		} 
	}

	show(agent, text, type) {
		this.view.log(agent, text, type);
	}

	setPrompt(prompt) {
		r1.setPrompt(`${colors.cyan}${prompt}${colors.reset}`, );
		r1.prompt();
	}

	clearPrompt() {
		readline.cursorTo(process.stdout, 0, 0);
		readline.clearScreenDown(process.stdout);
		this.show('', `${colors.under}Tic Tac Toe: ${this.state}${colors.reset}`, messageStates.info);
	}

	_resetPrompt() {
		r1.setPrompt(`\n${colors.cyan}${this.players['1']}: ${colors.reset}`);
		r1.prompt();
	}

	_appStateInputHandler(userInput) {
		if(userInput === '1' || userInput === '2' || userInput === '3' || userInput === '4') {
			switch(userInput) {
				case '1':
					this.appCommands['start'](this);
					break;
				case '2':
					this.appCommands['options'](this);
					break;
				case '3':
					this.appCommands['history'](this);
					break;
				case '4':
					this.appCommands['quit'](this);
					break;
				default:
					
			}
		} else {
			this.show(this.appName, 'Please select a valid option or type "help" for a list of commands.', messageStates.warning);
			this.appCommands['menu'](this);
		}
	}

	_historyStateInputHandler(userInput) {
		const index = parseInt(userInput);
		if (index >= 0 && index < this.gameHistory.length) {
			this.show('', this.gameHistory[index].players, '');
			this.show('', this.gameHistory[index].endBoard, '');
			this.show('', `Type "back" to return to game history list.`, '');
		} else {
			this.show(this.appName, `No game history at ${userInput} index`, messageStates.warning);
			this.appCommands['history'](this);
			this.show('', `Type "menu" to return to main menu.`, '');
		}
		this._resetPrompt();
	}

	_optionsStateInputHandler(userInput) {
		switch (userInput) {
			case '0':
				this.appCommands['menu'](this);
				break;
			case '1':
				this.appCommands['options-1'](this);
				r1.setPrompt(`\nSelect number of players: (0-2)\n${colors.cyan}Players: ${colors.reset}`);
				r1.prompt();
				break;
			case '2':
				this.appCommands['options-2'](this);
				r1.setPrompt(`\nChoose player name & marker (example: 1 username X)\n${colors.cyan}Player & Name: ${colors.reset}`);
				r1.prompt();
				break;
			case '3':
				this.appCommands['options-3'](this);
				r1.setPrompt(`\nSet Ai skill level 0-1 (example: 0.5)\n${colors.cyan}Skill level: ${colors.reset}`);
				r1.prompt();
				break;
			default:
				this.view.log(this.appName, 'No valid option was selected.', messageStates.warning);
				this.appCommands['options'](this);
				this._resetPrompt();
		}
	}

	_option1StateInputHandler(userInput) {
		if (userInput === '0' || userInput === '1' || userInput === '2') {
			this.state = 'app';
			this.playerCount = parseInt(userInput);
			this.view.log(this.appName, `Setting player count to ${this.playerCount}`, messageStates.success);
			this.appCommands['menu'](this);
		} else {
			this.view.log(this.appName, 'Please enter a valid user count.', messageStates.warning);
			this.appCommands['options-1'](this);
			r1.setPrompt(`\nSelect number of players: (0-2)\n${colors.cyan}Players: ${colors.reset}`);
			r1.prompt();
		}
	}

	_option2StateInputHandler(userInput) {
		const result = userInput.split(' ');
		this.setUserInfo(result[0], result[1], result[2]);
		this.appCommands['menu'](this);
	}

	_option3StateInputHandler(userInput) {
		const input = parseFloat(userInput);
		if (input >= 0 && input <=1 ) {
			this.aiSkill = input;
			this.show(this.appName, `Setting Ai skill to '${input.toString()}'`, messageStates.success);
			this.appCommands['menu'](this);
		} else {
			this.show(this.appName, 'Please enter a skill level.', messageStates.warning);
			this.appCommands['options-3'](this);
		}
	}

	_gameStateInputHandler(userInput) {
		if (this.game) {
			this.game.inputHandler(userInput);
		}
	}
}

module.exports = App;