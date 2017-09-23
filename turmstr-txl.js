'use strict'

const allStations = require('vbb-stations')
const path = require('path')
const level = require('level')
const pump = require('pump')
const through = require('through2')
const {stringify} = require('ndjson')

const time = require('./lib/time')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const argv = process.argv.slice(2)
if (argv[0] === '-h' || argv[0] === '--help') {
	process.stdout.write(`
node foo.js <station> <line>\n`)
}

const stationId = argv[0]
if (!stationId) showError('Invalid or missing station param.')
const [station] = allStations(stationId)
if (!station) showError('Station does not exist.')

const line = argv[1]
if (!line) showError('Invalid or missing line param.')

const db = level(path.join(__dirname, 'vbb-delays.ldb'), {
	valueEncoding: 'json'
})

pump(
	db.createValueStream(),
	through.obj((dep, _, cb) => {
		if (stationId !== dep.station.id) return cb()
		if (!dep.line || dep.line.name.toLowerCase() !== line.toLowerCase()) return cb()
		if (dep.delay === null) return cb()

		cb(null, {
			delay: dep.delay,
			time: time(dep)
		})
	}),
	stringify(),
	process.stdout,
	(err) => {
		if (!err) return
		console.error(err)
		process.exitCode = 1
	}
)
