'use strict'

// todo: DRY with util/get-all-product-codes-at
const getAllLinesAt = (db, stations, cb) => {
	const linesAt = new Set()
	const onData = (dep) => {
		if (stations.includes(dep.station.id) && dep.line.name) {
			linesAt.add(dep.line.name)
		}
	}
	const onEnd = () => cb(null, linesAt)

	const deps = db.createValueStream()
	deps.on('data', onData)
	deps.on('end', onEnd)
	deps.once('error', () => {
		deps.removeListener('data', onData)
		deps.removeListener('end', onEnd)
		cb(err)
	})
}

module.exports = getAllLinesAt
