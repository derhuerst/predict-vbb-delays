#!/usr/bin/env node
'use strict'

const mri = require('mri')
const allStations = require('vbb-stations')
const path = require('path')
const level = require('level')
const pump = require('pump')
const through = require('through2')
const {stringify} = require('ndjson')

const pkg = require('./package.json')
const time = require('./lib/time')
const month = require('./lib/month')
const dayOfWeek = require('./lib/day-of-week')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'db'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    delays-at-station <station-id> [--db <path-to-leveldb>]
Options:
	--db  Path to the LevelDB in \`record-vbb-delays\` format.
	      Default: vbb-delays.ldb
Examples:
    delays-at-station 900000100002 >hackescher-markt.ndjson
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`delays-at-station v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err && err.message || (err + ''))
	process.exit(1)
}

const stationId = argv._[0]
if (!stationId) showError('Invalid or missing station param.')
const [station] = allStations(stationId)
if (!station) showError('Station does not exist.')

const db = level(argv.db || 'vbb-delays.ldb', {
	valueEncoding: 'json'
})

pump(
	db.createValueStream(),
	through.obj((dep, _, cb) => {
		if (stationId !== dep.station.id) return cb()
		if (dep.delay === null) return cb()

		cb(null, {
			delay: dep.delay,
			time: time(dep),
			month: month(dep),
			line: dep.line && dep.line.name || null,
			dayOfWeek: dayOfWeek(dep),
			product: dep.line && dep.line.product || null
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
