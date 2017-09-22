'use strict'

const floor = require('floordate')
const brandenburg = require('german-states-bbox').BB

const clampLat = lat => (lat - brandenburg[2]) / (brandenburg[0] - brandenburg[2])
const clampLon = lon => (lon - brandenburg[1]) / (brandenburg[3] - brandenburg[1])

const clampDelay = delay => Math.min(1, delay / 3600)

const depToFeatures = (dep, stations, cb) => {
	const w = new Date(dep.when)
	const dayOfWeek = w.getDay()

	const input = {
		lat: clampLat(dep.station.coordinates.latitude),
		lon: clampLon(dep.station.coordinates.longitude),
		// dep.line.productCode,
		sunday: +(dayOfWeek === 0),
		monday: +(dayOfWeek === 1),
		tuesday: +(dayOfWeek === 2),
		wednesday: +(dayOfWeek === 3),
		thursday: +(dayOfWeek === 4),
		friday: +(dayOfWeek === 5),
		saturday: +(dayOfWeek === 6),
		// time: Math.round((w - floor(w, 'day')) / 1000)
	}
	for (let s of stations) input[s] = +(dep.station.id === s)

	const output = {
		delay: clampDelay(dep.delay)
	}

	cb(null, {input, output})
}

module.exports = depToFeatures
