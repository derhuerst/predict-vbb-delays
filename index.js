'use strict'

const path = require('path')
const level = require('level')
const {NeuralNetwork} = require('brain.js')
const floor = require('floordate')
const brandenburg = require('german-states-bbox').BB

const depToFeatures = require('./lib/dep-to-features')
const stations = require('./lib/stations')

const db = level(path.join(__dirname, 'vbb-delays.ldb'), {
	valueEncoding: 'json'
})
const network = new NeuralNetwork({
	hiddenLayers: [(stations.length + 9) * 2 / 3]
})

const clampDelay = delay => Math.min(1, delay / 3600)

db.createValueStream()
.on('error', console.error)
.on('data', (dep) => {
	if (!stations.includes(dep.station.id)) return

	const input = depToFeatures(dep, stations)
	const output = {
		delay: clampDelay(dep.delay)
	}

	const res = network.train([
		{input, output}
	])
	console.error(dep.station.id, '-', res.error)
})
.once('end', () => {
	process.stdout.write(JSON.stringify(network.toJSON()) + '\n')
})
