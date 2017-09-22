'use strict'

const floor = require('floordate')

const timeFeatures = (dep, stations, cb) => {
	const w = new Date(dep.when)

	cb(null, {
		time: Math.round((w - floor(w, 'day')) / 1000)
	})
}

module.exports = timeFeatures
