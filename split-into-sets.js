'use strict'

const {isatty} = require('tty')
const path = require('path')
const fs = require('fs')
const lineStream = require('byline').createStream

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const argv = process.argv.slice(2)

if (argv[0] === '-h' || argv[0] === '--help') {
	process.stdout.write(`
node split-into-sets.js <training-file> <auditing-ratio> <auditing-file>\n`)
}

const trainingFile = argv[0]
if (!trainingFile) showError('invalid or missing training-file param')
const ratio = parseFloat(argv[1])
if (Number.isNaN(ratio)) showError('invalid or missing auditing-ratio param')
const auditingFile = argv[2]
if (!auditingFile) showError('invalid or missing auditing-file param')

if (isatty(process.stdin.fd)) showError('stdin must be a pipe')

const src = process.stdin
.on('error', showError)
.pipe(lineStream())
.on('error', showError)

const auditing = fs.createWriteStream(path.join(__dirname, auditingFile))
.on('error', showError)
const training = fs.createWriteStream(path.join(__dirname, trainingFile))
.on('error', showError)

src.on('data', (dep) => {
	(Math.random() <= ratio ? auditing : training).write(dep + '\n')
})
src.once('end', () => {
	auditing.end()
	training.end()
})
