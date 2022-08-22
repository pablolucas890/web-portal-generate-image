const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs')
const { exec } = require('child_process');
const path = require("path");
const multer = require('multer');

const { conf } = require('./utils.js')

app.use(cors()); //permite que qualquer frontend que tenha acesso a rota possa se comunicar com o backend
app.use(express.json()); //antes das rotas

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

function logRequest(request, response, next) {
    return next(); //proximo middleware
}

app.use(logRequest);

app.get('/list-base-images', logRequest, async (request, response) => {

    const filenames = fs.readdirSync('./public/base-images')
    return response.json(filenames);
});
app.get('/list-generated-images', logRequest, async (request, response) => {
    const filenames = fs.readdirSync('./public/generated-images')
    return response.json(filenames);
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/temp/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
});
const upload = multer({ storage, limits: { fileSize: 1000000 } });
app.post('/upload', upload.array('files', 3), (request, response) => {
    return response.json({
        message: "Recebido com sucesso"
    })
});
function criaImagem(imgName, imgFullName) {
    let offset = 4194304;
    if(imgName.includes('orange')){
        offset = 4194304;
    }else{
        offset = 250001;
    }
    exec(`sudo ./exec.sh ${imgName} ${imgFullName} ${offset}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Erro: ${error.message}`);
            exec(`sudo ./clean-errors.sh ${imgFullName}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Erro: ${error.message}`);
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
                console.log('Stdout:', stdout)
                return;
            });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            exec(`sudo ./clean-errors.sh ${imgFullName}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Erro: ${error.message}`);
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
                console.log('Stdout:', stdout)
                return;
            });
        }
        console.log('Stdout:', stdout)
        return;
    });
}
app.get('/create-image', logRequest, (request, response) => {
    const imgFullName = request.query.image_name;
    const imgName = imgFullName.split(']')[2]
    criaImagem(imgName, imgFullName);

    message = "ok"
    return response.json({
        message,
    });
});
app.get('/download', logRequest, async (request, response) => {
    const imgName = request.query.imgName;
    const file = `./public/generated-images/${imgName}.gz`;
    response.download(file); // Set disposition and send it.
    return response;
});
app.get('/delete', logRequest, async (request, response) => {
    const filenames = fs.unlinkSync(`./public/generated-images/${request.query.imgName}.gz`, "")
    return response.redirect('/');
});
app.listen({ host: conf.get('bind'), port: conf.get('port'), exclusive: true })