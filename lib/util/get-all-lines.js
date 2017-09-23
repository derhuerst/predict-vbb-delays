'use strict'

// todo: DRY with util/get-all-product-codes
const getAllLines = (db, cb) => {
	const lines = new Set()
	const onData = (dep) => {
		if (dep.line.name) lines.add(dep.line.name)
	}
	const onEnd = () => cb(null, lines)

	const deps = db.createValueStream()
	deps.on('data', onData)
	deps.on('end', onEnd)
	deps.once('error', () => {
		deps.removeListener('data', onData)
		deps.removeListener('end', onEnd)
		cb(err)
	})
}

module.exports = getAllLines
