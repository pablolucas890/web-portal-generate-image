
const fs = require('fs')
const conf = require('nconf')
const path = require('path')

conf.file({ file: path.resolve(__dirname, './cfg.json') })
conf.defaults({
  error: "erro"
})
module.exports = { conf }
