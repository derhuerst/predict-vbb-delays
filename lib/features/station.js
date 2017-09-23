'use strict'

const floor = require('floordate')

const secondsPerDay = 86400

const stationFeatures = (dep, stations, db, cb) => {
	const f = {}
	for (let s of stations) {
		f['station-' + s] = +(dep.station && dep.station.id === s || false)
	}

	cb(null, f)
}

module.exports = stationFeatures
