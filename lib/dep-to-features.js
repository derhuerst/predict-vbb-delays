'use strict'

const applyEach = require('async/applyEach')

const position = require('./features/position')
const dayOfWeek = require('./features/day-of-week')
const time = require('./features/time')

const clampDelay = delay => Math.min(1, delay / 3600)

const depToFeatures = (dep, stations, cb) => {
	const output = {
		delay: clampDelay(dep.delay)
	}

	applyEach([
		position,
		dayOfWeek,
		time
	], dep, stations, (_, featureSets) => {
		const input = Object.assign({}, ...featureSets)

		cb(null, {input, output})
	})
}

module.exports = depToFeatures
