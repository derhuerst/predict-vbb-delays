'use strict'

const getAllProductCodesAt = require('../util/get-all-product-codes-at')

const create = () => {
	let getProductCodesAt = null

	const productCodeFeatures = (dep, stations, db, cb) => {
		if (!getProductCodesAt) {
			getProductCodesAt = new Promise((resolve, reject) => {
				getAllProductCodesAt(db, stations, (err, productCodesAt) => {
					if (err) reject(err)
					else resolve(productCodesAt)
				})
			})
		}

		getProductCodesAt
		.then((productCodesAt) => {
			const f = {}
			for (let l of productCodesAt) {
				f['product-code-' + l] = +(dep.line && l === dep.line.productCode || false)
			}

			cb(null, f)
		})
		.catch(cb)
	}

	return productCodeFeatures
}

module.exports = create
