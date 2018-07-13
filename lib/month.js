'use strict'

const {DateTime} = require('luxon')

const month = (dep) => {
	const w = DateTime.fromISO(dep.when, {
		setZone: 'Europe/Berlin'
	})
	return w.toFormat('LLL')
}

module.exports = month
