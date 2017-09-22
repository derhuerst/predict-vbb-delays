'use strict'

const {NeuralNetwork} = require('brain.js')
const allStations = require('vbb-stations')

const depToFeatures = require('./lib/dep-to-features')
const stations = require('./lib/stations')
const data = require('./network.json')

const network = new NeuralNetwork()
network.fromJSON(data)

const transformResult = (result) => {
	result.delay *= 3600
	return result
}

const runSample = (id, when) => {
	const [station] = allStations(id)
	if (!station) return

	depToFeatures({station, when}, stations, (err, {input}) => {
		console.log(input)
		console.log(transformResult(network.run(input)))
	})
}

runSample('900000012151', '2017-09-22T09:20:30')
// runSample('900000100513', '2017-09-22T13:20:30')
// runSample('900000077106', '2017-09-22T13:20:30')
