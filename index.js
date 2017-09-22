'use strict'

const path = require('path')
const level = require('level')
const {NeuralNetwork} = require('brain.js')
const floor = require('floordate')
const brandenburg = require('german-states-bbox').BB

const db = level(path.join(__dirname, 'vbb-delays.ldb'), {
	valueEncoding: 'json'
})
const network = new NeuralNetwork()

const clampLat = lat => (lat - brandenburg[2]) / (brandenburg[0] - brandenburg[2])
const clampLon = lon => (lon - brandenburg[1]) / (brandenburg[3] - brandenburg[1])

db.createValueStream()
.on('error', console.error)
.on('data', (dep) => {
	const w = new Date(dep.when)
	const dayOfWeek = w.getDay()

	const input = [
		clampLat(dep.station.coordinates.latitude),
		clampLon(dep.station.coordinates.longitude),
		// dep.line.productCode,
		dayOfWeek === 0,
		dayOfWeek === 1,
		dayOfWeek === 2,
		dayOfWeek === 3,
		dayOfWeek === 4,
		dayOfWeek === 5,
		dayOfWeek === 6,
		// Math.round((w - floor(w, 'day')) / 1000)
	]

	const output = [
		dep.delay
	]

	const res = network.train([
		{input, output}
	])
	console.error('-', res.error)
})
