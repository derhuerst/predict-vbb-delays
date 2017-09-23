'use strict'

const getAllLines = require('../util/get-all-lines')

const create = () => {
	let getLines = null

	const lineFeatures = (dep, stations, db, cb) => {
		if (!getLines) {
			getLines = new Promise((resolve, reject) => {
				getAllLines(db, (err, lines) => {
					if (err) reject(err)
					else resolve(lines)
				})
			})
		}

		getLines
		.then((lines) => {
			const f = {}
			for (let l of lines) f[l] = +(l === dep.line.name)

			cb(null, f)
		})
		.catch(cb)
	}

	return lineFeatures
}

module.exports = create
