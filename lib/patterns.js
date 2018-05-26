const singlePatterns = {
	center: ['5'],
	sides: ['2', '4', '6', '8'],
	corners: ['1', '3', '7', '9']
}

const doublePatterns = {
	horizontals: ['1,2', '1,3', '2,3', '4,5', '4,6', '5,6', '7,8', '7,9', '8,9'],
	verticals: ['1,4', '1,7', '4,7', '2,5', '2,8', '5,8', '3,6', '3,9', '6,9'],
	diagonals: ['1,9', '1,5', '5,9', '3,7', '3,5', '5,7']
}

/**
 * Patterns used for determining win conditions.
 */
const triplePatterns = {
	horizontal: ['1,2,3', '4,5,6', '7,8,9'],
	vertical: ['1,4,7', '2,5,8', '3,6,9'],
	diagonal: ['1,5,9', '3,5,7']
}

module.exports = {
	singlePatterns,
	doublePatterns,
	triplePatterns,
}