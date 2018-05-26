/**
 * Helpers and utilities for the View class.
 */

/**
 * A function that creates a log history event used in the View class.
 * @param {String} agent 
 * @param {String} message 
 * @param {String} status 
 */
const generateLogEvent = (agent, message, status) => {
	return {
		agent,
		message,
		status,
		date: new Date()
	}
}

const messageStates = {
	warning: 'warning',
	info: 'info',
	special: 'special',
	success: 'success',
	debug: 'debug',
	default: 'default'
}

module.exports = {
	generateLogEvent,
	messageStates
}