'use strict'

const floor = require('floordate')

const secondsPerDay = 86400

const timeFeatures = (dep, stations, db, cb) => {
	const w = new Date(dep.when)

	cb(null, {
		time: (w - floor(w, 'day')) / 1000 / secondsPerDay
	})
}

module.exports = timeFeatures
