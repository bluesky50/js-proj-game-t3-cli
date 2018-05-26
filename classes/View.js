const readline = require('readline');
const { generateLogEvent, messageStates } = require('../utils/viewUtils');
const { colors } = require('../lib/colors.js');

/**
 * Class that handles rendering for application and game classes.
 */
class View {
	constructor(logger = console, maxHistorySize = 100) {
		this.input = null;
		this.logger = logger;
		this.logHistory = new Array();
		this.maxHistorySize = maxHistorySize;
	}

	log(agent, message, status) {
		let result;

		if (status && agent) {
			result = `${agent} (${status}): ${message}`;
		} else {
			result = `${message}`;
		}

		this.logger.log(colors.reset, '');

		if (status === messageStates.warning) {
			this.logger.log(`${colors.yellow}${result}`, colors.reset);
		} else if (status === messageStates.info) {
			this.logger.log(`${colors.cyan}${result}`, colors.reset);	
		} else if (status === messageStates.default) {
			this.logger.log(result);
		} else if (status === messageStates.success) {
			this.logger.log(`${colors.green}${result}`, colors.reset);	
		} else if (status === messageStates.special) {
			this.logger.log(`${colors.magenta}${result}`, colors.reset);
		} else if (status === messageStates.debug) {
			this.logger.log(`${colors.blue}${result}`, colors.reset);
		} else {
			this.logger.log(result);
		}
		
		this._addToLogHistory(generateLogEvent(agent, message, status));
		this._trimLogHistory();
	}

	logMulti(arr) {
		arr.forEach((log) => {
			this.log(log.agent, log.message, log.status);
		});
	}

	getLogHistory() {
		return this.history;
	}

	_addToLogHistory(logEvent) {
		this.logHistory.push(logEvent);
	}

	_trimLogHistory() {
		const diff = this.maxHistorySize - this.logHistory.length;
		const trimLength = (diff < 0) ? diff * -1 : 0;
		if (trimLength > 0) {
			this.logHistory = this.logHistory.slice(trimLength);
		}
	}
}

module.exports = View;