
const fs = require('fs')
const conf = require('nconf')
const path = require('path')

conf.file({ file: path.resolve(__dirname, './cfg.json') })
conf.defaults({
  error: "erro"
})

const servers = fs.readdirSync(path.resolve(__dirname, './servers'))
  .filter((fname) => fname.endsWith('.json'))
  .map((fname) => JSON.parse(fs.readFileSync(path.resolve(__dirname, `./servers/${fname}`), 'utf8')))
conf.set('servers', [...conf.get('servers'), ...servers])

module.exports = { conf }
