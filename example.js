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
node example.js <network-file> <station> <when> <line>\n`)
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

const runSample = (id, when, line) => {
	const [station] = allStations(id)
	if (!station) return

	depToFeatures({
		station, when, line: {name: line}
	}, stations, db, (err, {input}) => {
		console.log(input)
		console.log(transformResult(network.run(input)))
	})
}

const station = argv[1]
if (!station) showError('Invalid or missing station param.')

const when = argv[2]
if (!when || Number.isNaN(+new Date(when))) {
	showError('Invalid or missing when param.')
}

const line = argv[3]
if (!line) showError('Invalid or missing line param.')

runSample(station, when, line)
