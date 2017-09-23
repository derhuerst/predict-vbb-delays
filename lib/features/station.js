'use strict'

const floor = require('floordate')

const secondsPerDay = 86400

const stationFeatures = (dep, stations, db, cb) => {
	const f = {}
	for (let s of stations) f[s] = +(dep.station.id === s)

	cb(null, f)
}

module.exports = stationFeatures
