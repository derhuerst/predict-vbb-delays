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

const training = []

db.createValueStream()
.on('error', console.error)
.on('data', (dep) => {
	if (!stations.includes(dep.station.id)) return

	const input = depToFeatures(dep, stations)
	const output = {
		delay: (dep.station.id === "900000012151") ? 0 : clampDelay(dep.delay)
	}

	training.push({input, output})
	console.error(dep.station.id)
})
.once('end', () => {
	const res = network.train(training)

	process.stdout.write(JSON.stringify(network.toJSON()) + '\n')
})
