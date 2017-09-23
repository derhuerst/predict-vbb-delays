'use strict'

const path = require('path')
const level = require('level')
const fs = require('fs')
const {NeuralNetwork} = require('brain.js')
const allStations = require('vbb-stations')

const depToFeatures = require('./lib/dep-to-features')
const stations = require('./lib/stations')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const argv = process.argv.slice(2)

if (argv[0] === '-h' || argv[0] === '--help') {
	process.stdout.write(`
node train.js <network-file>\n`)
}

let networkFile = argv[0]
if (!networkFile) showError('Invalid or missing network-file param.')
networkFile = path.join(__dirname, networkFile)

const networkData = JSON.parse(fs.readFileSync(networkFile, {encoding: 'utf8'}))
const network = new NeuralNetwork()
network.fromJSON(networkData)

const db = level(path.join(__dirname, 'vbb-delays.ldb'), {
	valueEncoding: 'json'
})

const transformResult = (result) => {
	result.delay *= 3600
	return result
}

const runSample = (id, when) => {
	const [station] = allStations(id)
	if (!station) return

	depToFeatures({station, when}, stations, db, (err, {input}) => {
		console.log(input)
		console.log(transformResult(network.run(input)))
	})
}

runSample('900000012151', '2017-09-22T09:20:30')
// runSample('900000100513', '2017-09-22T13:20:30')
// runSample('900000077106', '2017-09-22T13:20:30')
