const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

const { log, conf, loadIPdatabase } = require('./utils.js')

app.use(cors()); //permite que qualquer frontend que tenha acesso a rota possa se comunicar com o backend
app.use(express.json()); //antes das rotas

const data = [
    {
        message: "hello word"
    },
    {
        value: "teste word"
    }
]; //simular banco de dados

// HTTP authentication
if (conf.get('username') && conf.get('username').length)
    app.use((req, res, next) => {
        // Parse login and password from headers
        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        console.log(req.a)
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
        // Verify login and password are set and correct
        if (!login || !password || login !== conf.get('username') || password !== conf.get('password')) {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send('Authentication required.')
        } else
            next()
    })
app.get('/', (_, res) => res.sendFile(`${__dirname}/dist/index.html`))
app.get('/cfg', (_, res) => res.json(conf.get('web')))
app.use('/', express.static(`${__dirname}/dist`))
app.use(bodyParser.json())

app.listen(3333, () => {
    // localhost:3333
    console.log('BackEnd Started');
});