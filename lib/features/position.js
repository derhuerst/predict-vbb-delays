'use strict'

const brandenburg = require('german-states-bbox').BB

const clampLat = lat => (lat - brandenburg[2]) / (brandenburg[0] - brandenburg[2])
const clampLon = lon => (lon - brandenburg[1]) / (brandenburg[3] - brandenburg[1])

const positionFeatures = (dep, stations, cb) => {
	cb(null, {
		lat: clampLat(dep.station.coordinates.latitude),
		lon: clampLon(dep.station.coordinates.longitude)
	})
}

module.exports = positionFeatures
