# predicting delays in Berlin public transport

**During [*Hochbahn* mobility hackathon](http://mobility-hackathon.de), @juliuste, another person and me set out to use recorded data to predict delays of future departures.** Later, @dirkschumacher joined us remotely.

## the available data

Previously, using [record-vbb-delays](https://github.com/derhuerst/record-vbb-delays) we had recorded departures at stations in the center of Berlin. The data contained the *last* prognosed departure of each *trip* at each station, queried every 30 seconds. The recording had only been running for 3 days, so it was a fine-grained, but small data set. At departure in this data looks like this:

```js
{
	ref: '1|15331|0|86|21092017',
	station: {
		type: 'station',
		name: 'Neues Ufer',
		coordinates: {latitude: 52.529104, longitude: 13.315973},
		id: '900000001152',
		products: {
			suburban: false,
			subway: false,
			tram: false,
			bus: true,
			ferry: false,
			express: false,
			regional: false
		}
	},
	when: '2017-09-21T17:52:00+02:00',
	direction: 'S+U Pankow',
	line: {
		type: 'line',
		name: 'M27',
		class: 8,
		productCode: 3,
		productName: 'B',
		product: 'bus',
		mode: 'bus',
		id: 'm27',
		symbol: 'M',
		nr: 27,
		metro: true,
		express: false,
		night: false
	},
	trip: 15331, // trip ID
	delay: 1800 // in seconds
}
```

Because starting to record a Hamburg data set only at the hackathon would have yielded an even smaller data set, we proceeded with Berlin data. Applicability to other cities will be discussed below.

## identifying factors for delays

Before we could start to build a prediction model, we had to identify factors that cause delays in Berlin public transport. After some discussion, we came up with these:

factor | discrete/continuous | features | comments
-------|---------------------|----------|---------
position | continuous | `lat`, `lon` | the traffic situation a one station indirectly affects another station
mode of transp. | discrete | `product` | heavily affects the reliability and behavior in traffic jam
time | continuous | `time` | commuting & nightlife hours
day of week | discrete | `mon` - `sun` | traffic behaves differently on workdays than on weekends
month | could be both | `jan` - `dec` | winter causes accidents, summer causes increased mobility
station | discrete | station IDs | stations have unique effects, e.g. a single bus lane
line | discrete | line IDs | lines have unique effects, e.g. tourism
delays at previous stations | discrete | e.g. `prevDelay` | considering that a vehicle can only catch up to a certain extent
fine dust | continuous | `pm10`, `pm25` | as an indicator for traffic jam
precipitation | continuous | `precep` | increases ridership as well as the chance of an accident

- We supposed that the station features/covariates indirectly expresse the position, and the line expresses the mode of transport. We concluded that it would be better to leave out the "confound" features and keep only the "basic", rather independent ones.
- Fetching fine dust data would have been possible using the [luftdaten.info](http://luftdaten.info) data, but given our limited time we ignored it.
- We also couldn't find a free-to-use weather API providing historical precipitation data.
- To provide the delays at previous stations, we would have to change the format of the [record-vbb-delays](https://github.com/derhuerst/record-vbb-delays) data, so we set it aside as well.

## trying to use neural networks

Being inexperienced with machine learning, we had never used the popular neural network libraries before. We managed to train a very basic [brain.js](https://github.com/BrainJS/brain.js) network, but the predictions from it seemed to be inaccurate or even random. This may be due to the small training set or improper configuration. Also, we were not satisfied with the performance, as it only uses the CPU (vs. the GPU) from plain JavaScript (vs. C).

@juliuste also tried multiple well-known libraries like [TensorFlow](https://www.tensorflow.org), [Keras](https://keras.io), [Caffe2](https://caffe2.ai) and [DSSTNE](https://github.com/amzn/amazon-dsstne), but ultimately gave up because either insufficient knowledge on technical terms or half-broken setups (e.g. AWS DSSTNE images).

We also speculated that a neural network, without fine-tuned parameters, would pick up noise or correlations we don't intuitively see and don't want to focus on.

## one GAM per station/line pair

So, after quickly trying [a JS regression module](https://www.npmjs.com/package/regression), thanks to @dirkschumacher we ended up using a [Generalized additive model](https://en.wikipedia.org/wiki/Generalized_additive_model) (GAM). Thus, we weighted the features so that we could later predict the delay based on values of a future scheduled departures.

[The code for generating the training data](https://github.com/derhuerst/predict-vbb-delays) is written in JavaScript, [the code for the model generation](https://gist.github.com/dirkschumacher/512eee1416a19f04dd71f6cba8d16f41) is written in R. Right now, it runs on a server, supplying predictions via an API.

## goals for future development

- Create models for every station/line pair in an automatic process, publish them somewhere.
- Embed predictions into [the `2.vbb.transport.rest` API](https://github.com/derhuerst/vbb-rest/blob/2/docs/index.md).
- Apply this prediction mechanism to other cities & regions.
- See also [`public-transport/ideas#3`](https://github.com/public-transport/ideas/issues/3).
