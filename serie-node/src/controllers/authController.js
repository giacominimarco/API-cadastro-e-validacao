//Controle de autenticação;

const express = require('express'); //Rotas.
const User = require('../models/User'); //Informações do usuário.
const authConfig = require('../config/auth'); //Vai pegar a configuração passada da pasta "auth.json"

const bcrypt = require('bcryptjs'); //Chama a biblioteca de criptografia para ser utilizado na senha.
const jwt = require('jsonwebtoken'); //Chama a biblioteca de criação do tokem.

const router = express.Router(); //Classe Roouter, para definir rotas.

// Criação do tokem.
function generateToken( params = {}) {
    return jwt.sign( params, authConfig.secret, {
        expiresIn: 86400, // Definido para expirar em um dia - 86400 segundos.
    }); 
}

router.post('/register', async (req, res) => {

    const { email } = req.body; // Instanciando o email para validação no "try"

    try{

        if(await User.findOne({ email })) 
             return res.status(400).send({ error: 'User already exists' }); // Retorna a mensagem que o usuário já existe.
            
        const user = await User.create(req.body); //Criar um novo usuário quando esta rota for acessada;

        user.password = undefined; // para não retornar a senha quando o usuário se cadastrar

        //passado as informações pro usuário para efetuar o login.
        return res.send({ 
            user,
            tokem: generateToken({  id: user.id }),
        });

    } catch (err){ // Retorna este erro caso aconteça uma falha no registro;
        return res.status(400).send({ error: 'Registration failed' });  
    }
});

router.post('/authenticate', async (req, res) =>{
    const { email, password } = req.body;
    const user = await User.findOne( {email} ).select('+password'); // Vai verificar se o usuário já esta cadastrado

    if (!user)
        return res.status(400).send({ error: 'User not found' })

    // Vai comparar as senhas e retornar a mesagem caso não sejão iguais.
    if (!await bcrypt.compare(password, user.password)) 
        return res.status(400).send({ error: 'Invalid password' }) 

    user.password = undefined; // para não retornar a senha quando o usuário se cadastrar.
    
    res.send({ 
        user, 
        tokem: generateToken({  id: user.id }), 
    }); // Passando o usuário e o tokem 
});


module.exports = app => app.use('/auth', router); // Vai ter uma rota que ira chamar o "/auth/register" .