'use strict'

const {NeuralNetwork} = require('brain.js')

const depToFeatures = require('./lib/dep-to-features')
const data = require('./network.json')

const network = new NeuralNetwork()
network.fromJSON(data)

const sample = depToFeatures({
	station: {
		id: '900000012151',
		coordinates: {latitude: 52.500413, longitude: 13.38744}
	},
	when: '2017-09-22T14:20:30'
})
console.log(network.run(sample))
