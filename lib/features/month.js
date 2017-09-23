'use strict'

const monthFeatures = (dep, stations, db, cb) => {
	const w = new Date(dep.when)
	const dayOfWeek = w.getMonth()

	cb(null, {
		january: +(dayOfWeek === 0),
		february: +(dayOfWeek === 1),
		march: +(dayOfWeek === 2),
		april: +(dayOfWeek === 3),
		may: +(dayOfWeek === 4),
		june: +(dayOfWeek === 5),
		july: +(dayOfWeek === 6),
		august: +(dayOfWeek === 7),
		september: +(dayOfWeek === 8),
		october: +(dayOfWeek === 9),
		november: +(dayOfWeek === 10),
		december: +(dayOfWeek === 11)
	})
}

module.exports = monthFeatures
