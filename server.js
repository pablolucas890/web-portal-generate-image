const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs')
const { exec } = require('child_process');
const path = require("path");
var stream = require('stream');
const multer = require('multer');
const { conf } = require('./utils.js')
let processo = null;
app.use(cors()); //permite que qualquer frontend que tenha acesso a rota possa se comunicar com o backend

app.use(express.json()); //antes das rotas

// HTTP authentication
if (conf.get('username') && conf.get('username').length) {
    app.use((req, res, next) => {
        // Parse login and password from headers
        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
        // Verify login and password are set and correct
        if (!login || !password || login !== conf.get('username') || password !== conf.get('password')) {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send('Authentication required.')
        } else
            next()
    })
}

app.get('/', (_, res) => res.sendFile(`${__dirname}/dist/index.html`))

app.get('/cfg', (_, res) => res.json(conf.get('web')))

app.use('/', express.static(`${__dirname}/dist`))

app.use(bodyParser.json())

app.get('/list-base-images', async (request, response) => {

    const filenames = fs.readdirSync('./public/base-images')
    let newFiles = []
    filenames.forEach(file => {
        if (path.extname(file) == ".img")
            newFiles.push(file)
    })
    return response.json(newFiles);
});

app.get('/list-generated-images', async (request, response) => {

    const filenames = fs.readdirSync('./public/generated-images')
    let newFiles = []
    filenames.forEach(file => {
        if (path.extname(file) == ".gz")
            newFiles.push(file)
    })
    return response.json(newFiles);
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
    if (imgName.includes('orange')) {
        offset = conf.get("offset_orangepi");
    } else {
        offset = conf.get("offset_raspberrypi");
    }
    exec(`echo ${conf.get("root_password")} | sudo -S ./clean-first.sh`, (error, stdout, stderr) => {
        if (error) {
            console.log(`\t\tErro clean-first.sh:\n${error.message} - ${stderr}`);
        }
        console.log('\t\tStdout clean-first.sh:\n', stdout)
        processo = exec(`echo ${conf.get("root_password")} | sudo -S ./exec.sh ${imgName} ${imgFullName} ${offset}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`\t\tErro exec.sh:\n${error.message} - ${stderr}`);
            }
            console.log('\t\tStdout exec.sh\n', stdout)
            exec(`echo ${conf.get("root_password")} | sudo -S ./clean-finish.sh ${imgFullName}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`\t\tErro clean-finish.sh:\n${error.message} - ${stderr}`);
                }
                console.log('\t\tStdout clean-finish.sh:\n', stdout)
                return;
            });
            return;
        });
        return;
    });
    process.stdin = '1973'
}

app.get('/create-image', (request, response) => {
    const imgFullName = request.query.image_name;
    const imgName = imgFullName.split('_')[2]
    criaImagem(imgName, imgFullName);

    message = "ok"
    return response.json({
        message,
    });
});
app.get('/download', async (request, response) => {
    console.log(processo)
    const imgName = request.query.imgName;
    const file = `./public/generated-images/${imgName}.gz`;
    response.download(file); // Set disposition and send it.
    return response;
});

app.get('/delete', async (request, response) => {
    const filenames = fs.unlinkSync(`./public/generated-images/${request.query.imgName}.gz`, "")
    return response.redirect('/');
});

app.get('/cancel', async (request, response) => {
    let imgFullName = request.query.imgName;
    let kill = false
    if (processo != null)
        if (processo.pid != null)
            if (processo.pid != undefined)
                kill = true;
    if (kill) {
        exec(`./kill-process.sh ${processo.pid}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`\t\tErro kill-process:\n${error.message} - ${stderr}`);
            }
            console.log('\t\tStdout kill-process:\n', stdout)
            return;
        });
    } else {
        exec(`echo ${conf.get("root_password")} | sudo -S ./clean-finish.sh ${imgFullName}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`\t\tErro clean-finish.sh:\n${error.message} - ${stderr}`);
            }
            console.log('\t\tStdout clean-finish.sh:\n', stdout)
            return;
        });
    }

    return response.redirect('/');
});


app.listen({ host: conf.get('bind'), port: conf.get('port'), exclusive: true }, () => {
    console.log(`Servidor Iniciado em ${conf.get('protocol')}://${conf.get('bind')}:${conf.get('port')}/`)
})