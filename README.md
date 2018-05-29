## Description 
This project is an implementation of Tic Tac Toe in Javascript for the command line.

Command to start:
``` 
node main.js
```

## Work Flow

### Planning
Feature Planning
Classes Planning
User Flow Planning

### Features
1. Customizable game options: player names, number of players, and ai skill level.
2. Ai fills empty player spots when there are less than 2 players. Ai can play against itself when there are 0 players.
3. Application command system to view information.
4. Game commands to pause, undo move, restart, etc.
5. Tracking game history and view win conditions for games in history log.
6. Ai uses skill level to determine whether to make a skilled move or a random move.
7. Variable move time for Ai to present the user with the perception of thinking.
8. Ability to pause and resume a game.
9. View rendering for app state and game state using color prioritization.
10. Application and game have "help" commands to inform users of available options.

### Development

#### Application
1. Application user input handling for menu, options, start, and exit selections.
2. Application rendering using View class and NodeJS readline.
3. Application commands handlers: menu, status, exit, etc.
4. Game history menu option and rendering.

#### Game
1. Game state user input handling for initial, started, and end states.
2. Game initialization, game flow, and game rendering.
3. Game state user input handling for commands: home, end, reset, debug.
4. Game end condition checks.
5. Game end info creation and logging.
6. Game ai move logic, skilled and random.

