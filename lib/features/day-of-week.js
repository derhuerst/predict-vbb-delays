'use strict'

const dayOfWeekFeatrues = (dep, stations, db, cb) => {
	const w = new Date(dep.when)
	const dayOfWeek = w.getDay()

	cb(null, {
		sunday: +(dayOfWeek === 0),
		monday: +(dayOfWeek === 1),
		tuesday: +(dayOfWeek === 2),
		wednesday: +(dayOfWeek === 3),
		thursday: +(dayOfWeek === 4),
		friday: +(dayOfWeek === 5),
		saturday: +(dayOfWeek === 6)
	})
}

module.exports = dayOfWeekFeatrues
