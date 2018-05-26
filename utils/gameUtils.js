const { triplePatterns } = require('../lib/patterns.js');

/**
 * Helpers and utilities for the Game class.
 */

/**
 * The text used in the game state.
 */
const gameMessages = {
	intro: 'A new tic tac toe game has started.',
	description: 'Description: The first player to connect 3 marks \neither vertically, horizontally, or diagnally wins.',
	instructions: `Instructions: Select a position to place your mark. \nPositions are designated from 1 to 9 \nwith 1 being in the top left and proceeding \nfrom left to rignt.`,
	help: 'Type "help" for additional commands',
	turn: "It is {player}'s ({marker}) turn", // * requires {player} and {marker}
	winner: '{player} has won.', // * requires {player}
	startPhrase: 'Type "ready" when ready to begin...',
	endPhrase: 'Type "end" to complete the game...\nType "new" to play again...',
	firstMove: 'First move goes to [ {player} = {marker} ]', // * requires {player} and {marker}
	choice: '{player} ({marker}) chose position {position}', // * requires {player}, {marker}, {position}
	players: '+ Players:  [ {player1} = {p1marker} ] , [ {player2} = {p2marker} ]', // * requires {player1}, {p1marker}, {player2}, {p2marker}
}

/**
 * Game state commands.
 */
const gameCommands = {
	'help': function(game) { // Displays game commands.
		const commands = Object.keys(gameCommands).join('\n');
		game.app.show('Game', `Available Game Commands\n${commands}\n`, 'debug');
	},
	'undo': function(game) { // Reverts game moves.
		game.state = gameStates.started;
		game.winnerInfo = null;
		
		if (game.app.playerCount === 0 && game.gameEvents.length > 0) {
			game.gameEvents.forEach((event) => {
				game.app.show('Game', `Reverting ${game.players[event.player].name}'s move at position ${event.position}`, 'success');
				game.board.removeMark(event.position);	
			});
		}

		if (game.app.playerCount === 1 && game.gameEvents.length >= 2) {
			let prev = game.gameEvents.pop();
			game.board.removeMark(prev.position);
			game.app.show('Game', `Reverting ${game.players[prev.player].name}'s move at position ${prev.position}`, 'success');
			prev = game.gameEvents.pop();
			game.board.removeMark(prev.position);
			game.app.show('Game', `Reverting ${game.players[prev.player].name}'s move at position ${prev.position}`, 'success');
		} 
		
		if (game.app.playerCount === 2 && game.gameEvents.length > 0) {
			let prev = game.gameEvents.pop();
			game.board.removeMark(prev.position);
			game.app.show('Game', `Reverting ${game.players[prev.player].name}'s move at position ${prev.position}`, 'success');
			game.setActivePlayer(prev.player);
		}
	},
	'home': function(game) { // Pauses game and takes user to main menu.
		game.paused = true;
		game.app.state = 'app';
		game.app.run();
	},
	'reset': function(game) { // Resets game state.
		game.reset();
	},
	'end': function(game) { // Ends the current game.
		game.state = gameStates.end;
	},
	'game': function(game) { // Displays basic game info by default.
		
	},
	'resume': function(game) { // Takes game out of paused state.	
		game.paused = false;
	},
	'debug': function(game) { // Diplays game state info.
		game.app.show('Game', `\nGame state: ${game.state}\nPlayers: ${game.players.length}\nCurrent: ${game.players[game.activePlayer].name}\nWinner Info: ${game.winnerInfo}`, 'debug');
	}
}

/**
 * Game states.
 */
const gameStates = {
	init: 'init',
	started: 'started',
	end: 'end'
}

/**
 * This function checks if there is a winning pattern.
 * @param {Board} board 
 * @param {String} marker 
 * @returns {Obj | null} - Returns winning info or null.
 */
function isWinner(board, marker) {
	const positions = board.getMarkerPositions(marker);

	if (positions.length >= 3) {
		for (let key in triplePatterns) {
			for (const [index, value] of triplePatterns[key].entries()) {

				let result = value.split(',').filter((position) => {
					return !positions.includes(parseInt(position));
				});
				
				if (result.length === 0) {
					return { index, key, pattern: value.split(','), marker };
				}
			};
		}
	}
	
	return null;
}

module.exports = {
	gameMessages,
	gameCommands,
	gameStates,
	isWinner,
}