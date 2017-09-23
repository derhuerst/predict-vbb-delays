'use strict'

// todo: DRY with util/get-all-lines
const getAllProductCodes = (db, cb) => {
	const productCodes = new Set()
	const onData = (dep) => {
		if (dep.line.productCode) productCodes.add(dep.line.productCode)
	}
	const onEnd = () => cb(null, productCodes)

	const deps = db.createValueStream()
	deps.on('data', onData)
	deps.on('end', onEnd)
	deps.once('error', () => {
		deps.removeListener('data', onData)
		deps.removeListener('end', onEnd)
		cb(err)
	})
}

module.exports = getAllProductCodes
