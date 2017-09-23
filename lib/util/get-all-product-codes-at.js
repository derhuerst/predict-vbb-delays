'use strict'

// todo: DRY with util/get-all-lines-at
const getAllProductCodesAt = (db, stations, cb) => {
	const productCodesAt = new Set()
	const onData = (dep) => {
		if (stations.includes(dep.station.id) && dep.line.productCode) {
			productCodesAt.add(dep.line.productCode)
		}
	}
	const onEnd = () => cb(null, productCodesAt)

	const deps = db.createValueStream()
	deps.on('data', onData)
	deps.on('end', onEnd)
	deps.once('error', () => {
		deps.removeListener('data', onData)
		deps.removeListener('end', onEnd)
		cb(err)
	})
}

module.exports = getAllProductCodesAt
