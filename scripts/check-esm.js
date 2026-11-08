// Fails the build if the ES module output still contains CommonJS module syntax.
const fs = require('fs')
const path = require('path')

const entry = path.join(__dirname, '..', 'dist', 'esm', 'index.js')
const source = fs.readFileSync(entry, 'utf8')

if (!source.includes('export')) {
  throw new Error(`${entry} has no export statement`)
}
for (const token of ['require(', 'exports.']) {
  if (source.includes(token)) {
    throw new Error(`${entry} contains CommonJS syntax: ${token}`)
  }
}
console.log(`esm ok: ${entry}`)
