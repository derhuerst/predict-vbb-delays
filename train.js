'use strict'

const {parse} = require('ndjson')
const {NeuralNetwork} = require('brain.js')

const stations = require('./lib/stations')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const network = new NeuralNetwork({
	hiddenLayers: [302 * 2/3] // todo: peek stream, count nr of keys
})

const training = []

process.stdin
.once('error', showError)
.pipe(parse())
.once('error', showError)
.on('data', data => training.push(data))
.once('end', () => {
	network.train(training)
	process.stdout.write(JSON.stringify(network.toJSON()) + '\n')
})
