#!/usr/bin/env node
const bcrypt = require('bcrypt')

if (process.argv.length < 4) {
  console.log('not enough argument')
  process.exit()
}

const hash = process.argv[2]
const raw = process.argv[3]

console.log(bcrypt.compareSync(raw, hash))
