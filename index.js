'use strict'

const path = require('path')
const level = require('level')
const {NeuralNetwork} = require('brain.js')
const floor = require('floordate')
const brandenburg = require('german-states-bbox').BB

const depToFeatures = require('./lib/dep-to-features')

const db = level(path.join(__dirname, 'vbb-delays.ldb'), {
	valueEncoding: 'json'
})
const network = new NeuralNetwork({
	hiddenLayers: [2]
})

const clampDelay = delay => Math.min(1, delay / 3600)

const stations = [
	// '900000009102', // leo
	// '900000100513', // unter den linden
	'900000012151', // willy-brandt-haus
	// '900000110015', // stahlheimer/wisbyer
	// '900000160004', // lichtenberch
	// '900000049241' // zehle
]

db.createValueStream()
.on('error', console.error)
.on('data', (dep) => {
	if (!stations.includes(dep.station.id)) return

	const input = depToFeatures(dep)
	console.error(input)
	const output = {
		delay: clampDelay(dep.delay)
	}

	const res = network.train([
		{input, output}
	])
	// console.error('-', res.error)
})
.once('end', () => {
	process.stdout.write(JSON.stringify(network.toJSON()) + '\n')
})
