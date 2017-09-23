'use strict'

const getAllProductCodes = require('../util/get-all-product-codes')

const create = () => {
	let getProductCodes = null

	const productCodeFeatures = (dep, stations, db, cb) => {
		if (!getProductCodes) {
			getProductCodes = new Promise((resolve, reject) => {
				getAllProductCodes(db, (err, productCodes) => {
					if (err) reject(err)
					else resolve(productCodes)
				})
			})
		}

		getProductCodes
		.then((productCodes) => {
			const f = {}
			for (let l of productCodes) {
				f['product-code-' + l] = +(l === dep.line.productCode)
			}

			cb(null, f)
		})
		.catch(cb)
	}

	return productCodeFeatures
}

module.exports = create
