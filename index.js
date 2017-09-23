'use strict'

const path = require('path')
const level = require('level')
const pump = require('pump')
const brandenburg = require('german-states-bbox').BB
const through = require('through2')
const {stringify} = require('ndjson')

const depToFeatures = require('./lib/dep-to-features')
const stations = require('./lib/stations')

const db = level(path.join(__dirname, 'vbb-delays.ldb'), {
	valueEncoding: 'json'
})

const clampDelay = delay => Math.min(1, delay / 3600)

pump(
	db.createValueStream(),
	through.obj((dep, _, cb) => {
		if (!stations.includes(dep.station.id)) return cb()

		depToFeatures(dep, stations, db, cb)
	}),
	stringify(),
	process.stdout,
	(err) => {
		if (!err) return
		console.error(err)
		process.exitCode = 1
	}
)
