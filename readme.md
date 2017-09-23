# predict-vbb-delays

**Predict delays of Berlin public transport vehicles.** Work in progress, made during [Hamburg Mobility Hackathon 2017](http://mobility-hackathon.de). We generate predictions in multiple stages:

1. **Record departures** with realtime delays, e.g. using [record-vbb-delays](https://github.com/derhuerst/record-vbb-delays#record-vbb-delays).
2. **Transform the data into a training data set**, which is just a list of individual data points. Each data point consists of the input data (a value for each feature to be recognized) and an expected output value. `node index.js` will generate an [ndjson](http://ndjson.org) training set.
3. **Train a neural network**. *More details to be added by @juliuste.*
4. **Generate predictions by applying the trained network** to current realtime departures or future scheduled departures. *Not done yet.*

[![npm version](https://img.shields.io/npm/v/predict-vbb-delays.svg)](https://www.npmjs.com/package/predict-vbb-delays)
[![build status](https://img.shields.io/travis/derhuerst/predict-vbb-delays.svg)](https://travis-ci.org/derhuerst/predict-vbb-delays)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/predict-vbb-delays.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
git clone https://github.com/derhuerst/predict-vbb-delays.git
cd predict-vbb-delays
npm i
```

You should now be able to run the scripts in this repo.


## Usage

```js
todo
```


## Contributing

If you have a question or have difficulties using `predict-vbb-delays`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/predict-vbb-delays/issues).
