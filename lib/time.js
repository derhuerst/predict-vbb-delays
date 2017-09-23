'use strict'

const floor = require('floordate')

const time = (dep) => {
	const w = new Date(dep.when)
	return (w - floor(w, 'day')) / 1000
}

module.exports = time
