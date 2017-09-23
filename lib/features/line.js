'use strict'

const getAllLinesAt = require('../util/get-all-lines-at')

const create = () => {
	let getLinesAt = null

	const lineFeatures = (dep, stations, db, cb) => {
		if (!getLinesAt) {
			getLinesAt = new Promise((resolve, reject) => {
				getAllLinesAt(db, stations, (err, linesAt) => {
					if (err) reject(err)
					else resolve(linesAt)
				})
			})
		}

		getLinesAt
		.then((linesAt) => {
			const f = {}
			for (let l of linesAt) f['line-' + l] = +(l === dep.line.name)

			cb(null, f)
		})
		.catch(cb)
	}

	return lineFeatures
}

module.exports = create
