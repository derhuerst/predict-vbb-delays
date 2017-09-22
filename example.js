'use strict'

const {NeuralNetwork} = require('brain.js')

const depToFeatures = require('./lib/dep-to-features')
const stations = require('./lib/stations')
const data = require('./network.json')

const network = new NeuralNetwork()
network.fromJSON(data)

const transformResult = (result) => {
	result.delay *= 3600
	return result
}

const sample1 = depToFeatures({
	station: {
		id: '900000012151',
		coordinates: {latitude: 52.500413, longitude: 13.38744}
	},
	when: '2017-09-22T13:20:30'
}, stations)
console.log(sample1)
console.log(transformResult(network.run(sample1)))

const sample2 = depToFeatures({
	station: {
		id: '900000100513',
		coordinates: {latitude: 52.516996, longitude: 13.388876}
	},
	when: '2017-09-22T13:20:30'
}, stations)
console.log(sample2)
console.log(transformResult(network.run(sample2)))

const sample3 = depToFeatures({
	station: {
		id: '900000077106',
		coordinates: {latitude: 52.473822, longitude: 13.455998}
	},
	when: '2017-09-22T13:20:30'
}, stations)
console.log(sample3)
console.log(transformResult(network.run(sample3)))
