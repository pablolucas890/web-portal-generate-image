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
    const method = request.method;
    const url = request.url;

    console.log(method + '  --  ' + url);

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
    }
});
const upload = multer({ storage });
app.post('/upload', upload.single('foto'), async (request, response) => {
    return response.json({
        message: "recebido com sucesso"
    })
});
app.get('/create-image', logRequest, async (request, response) => {
    const imgFullName = request.query.image_name;
    const db3FileName = imgFullName.split(']')[3]
    const ovpnFileName = imgFullName.split(']')[4]
    const appdb3FileName = imgFullName.split(']')[5] == '.img' ? '' : imgFullName.split(']')[5]

    //Chamar rota de loalizacao de arquivo passando o nome
    try {
        /*
        //Criar imagem
        //Procurar Dinamicamente
        //Fazer Ofsset dinamico
        exec("sudo mount -t ext4 -o rw,sync,offset=1999872 public/base-images/image-orangepi-debian.img public/mounted-imgs", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            //executar cp
        });
        // Desmonstando Imagem
        exec("sudo umount public/mounted-imgs", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
        });
        //Fim Criar Imagem
        */
        const filenames = fs.writeFileSync(`./public/generated-images/${imgFullName}`, "")
        message = "ok"
    } catch (error) {
        message = "erro"
    }
    //Deletar todos os arquivos temporarios
    return response.json({
        message,
    });
});
app.get('/download', logRequest, async (request, response) => {
    const imgName = request.query.imgName;
    const file = `./public/generated-images/${imgName}`;
    response.download(file); // Set disposition and send it.
    return response;
});
app.get('/delete', logRequest, async (request, response) => {
    console.log(request)
    const filenames = fs.unlinkSync(`./public/generated-images/${request.query.imgName}`, "")
    return response.redirect('/');
});
app.listen({ host: conf.get('bind'), port: conf.get('port'), exclusive: true })