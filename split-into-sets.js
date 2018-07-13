#!/usr/bin/env node
'use strict'

const mri = require('mri')
const {isatty} = require('tty')
const fs = require('fs')
const lineStream = require('byline').createStream

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    split-delays-into-sets <training-file> <auditing-ratio> <auditing-file>
Examples:
    cat delays.ndjson | split-delays-into-sets training.ndjson .8 auditing.ndjson
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`split-delays-into-sets v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err.message || (err + ''))
	process.exit(1)
}

const trainingFile = argv._[0]
if (!trainingFile) showError('invalid or missing training-file param')
const ratio = parseFloat(argv._[1])
if (Number.isNaN(ratio)) showError('invalid or missing auditing-ratio param')
const auditingFile = argv._[2]
if (!auditingFile) showError('invalid or missing auditing-file param')

if (isatty(process.stdin.fd)) showError('stdin must be a pipe')

const src = process.stdin
.on('error', showError)
.pipe(lineStream())
.on('error', showError)

const auditing = fs.createWriteStream(auditingFile)
.on('error', showError)
const training = fs.createWriteStream(trainingFile)
.on('error', showError)

src.on('data', (dep) => {
	(Math.random() <= ratio ? auditing : training).write(dep + '\n')
})
src.once('end', () => {
	auditing.end()
	training.end()
})
