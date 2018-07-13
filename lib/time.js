'use strict'

const {DateTime} = require('luxon')

const time = (dep) => {
	const w = DateTime.fromISO(dep.when, {
		setZone: 'Europe/Berlin'
	})
	return (
		1000 * w.second +
		1000 * 60 * w.minute +
		1000 * 60 * 60 * w.hour
	)
}

module.exports = time
