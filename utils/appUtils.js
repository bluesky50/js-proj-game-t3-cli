const { appName } = require('../lib/constants.js');
const { messageStates } = require('./viewUtils.js');

/**
 * Helpers and utilities for the App class.
 */

/**
 * The text used in the App class.
 */
const appMessages = {
	welcome: "Welcome to T3\nChoose an option from the menu or type 'help' to see a list of other commands.",
	menu: 'Menu:\n\n1. {state}\n2. Options\n3. History\n4. Exit',
	about: 'This game is a Tic Tac Toe game implemented in Javascript by jchiang',
	exit: 'Exiting application',
	options: 'Options:\n\n0. Main Menu\n1. Set number of players (0-2)\n2. Set player names & marker (example: 1 player1 X)\n3. Set Ai skill level (0-1)'
}

/**
 * Commands used in the application.
 */
const appCommands = {
	'start': function(app) {
		app.setState(appStates.game);
		app.game.showGameInfo();
	},
	'menu': function(app) {
		app.setState(appStates.app);
		app.show('', appMessages.menu.replace('{state}', (app.game.paused === true && app.game.state !== 'init') ? 'Resume (game: paused)' : 'Start'), '');
		app._resetPrompt();
	},
	'status': function(app) {
		app.setState(appStates.app);
		const result = `Application State\nApp State: ${app.state}\nPlayer count: ${app.playerCount}\nPlayer 1: ${app.players['1']} ${app.players['1_MARKER']}\nPlayer 2: ${app.players['2']} ${app.players['2_MARKER']}\nAi skill: ${app.aiSkill}`;
		app.show(app.appName, result, 'debug');
	},
	'history': function(app) {
		app.setState(appStates.history);
	},
	'options': function(app) {
		app.setState(appStates.options);
		app.show('', app.appMessages.options, '');
	},
	'options-1': function(app) {
		app.setState(appStates.o1);
	},
	'options-2': function(app) {
		app.setState(appStates.o2);
	},
	'options-3': function(app) {
		app.setState(appStates.o3);
	},
	'about': function(app) {
		app.setState(appStates.app);
		app.show(app.appName, appMessages.about, messageStates.special);
	},
	'history': function(app) {
		app.setState(appStates.history);
		const history = app.gameHistory.map((g, index) => {
			let winner = '';
			if (g.winnerInfo.draw) {
				winner = 'draw';
			} else {
				winner = g.winnerInfo.player
			}
			return `${index}. Date: ${g.date.toLocaleDateString()} Players: ${g.players} Winner: ${winner} - ${g.winnerInfo.marker} Pattern: ${g.winnerInfo.pattern}`
		});
		app.show('', 'Select game history by index to see details', '');
		app.show(app.appName, `\nGame History: \n${history.join('\n')}`);
	},
	'help': function(app) {
		app.setState(appStates.app);
		app.show(app.appName, `Available commands \n${Object.keys(appCommands).join('\n')}`, messageStates.debug);
	},
	'quit': function(app) {
		app.setState(appStates.app);
		app.show(app.appName, 'Exiting application...', messageStates.info);
		app.close();
	}
}

/**
 * App states
 */
const appStates = {
	app: 'app',
	history: 'history',
	game: 'game',
	options: 'options',
	o1: 'options-1',
	o2: 'options-2',
	o3: 'options-3',
}

module.exports = {
	appCommands,
	appMessages,
	appStates
}

