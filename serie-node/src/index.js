/*
 * Este indes.js vai ser a rais de todo o nosso backend.
**/
const express = require('express'); // inporter
const bodyParser = require('body-parser'); //inporter

const app = express();

app.use(bodyParser.json()); // indicação para que ele entenda quando for enviado requisiçoes em json
app.use(bodyParser.urlencoded({ extended: true })); // Alguma coisa referente a não conseguir peruisar rotas que não estão disponiveis ou que não existe

require('./controllers/authController')(app); // Chama o authController.
require('./controllers/projectController')(app); // Chama o projectController.
require('./frontend/Form')(app);
/*
 * Exibe um OK na raiz do programa como forma de verificar se esta

app.get('/', (req, res) => { 
    res.send('OK');
});

*/

app.listen(3000); // Esta indicando a porta da nossa localhost.
