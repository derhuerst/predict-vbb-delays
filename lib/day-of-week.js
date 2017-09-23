'use strict'

const daysOfWeek = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
]

const dayOfWeek = (dep) => {
	const w = new Date(dep.when)
	return daysOfWeek[w.getDay()]
}

module.exports = dayOfWeek
