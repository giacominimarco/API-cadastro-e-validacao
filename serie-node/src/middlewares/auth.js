const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

// O "next" será chamado apenas se o usuário estiver pronto para ir para o próximo passo = (Controller).
module.exports = (req, res, next) => { 

    const authHeader = req.headers.authorization;

    // Retorna a msg caso o token não foi informado.
    if (!authHeader) 
        return res.status(401).send({ error: 'No token provided' });

    const parts = authHeader.split(' '); // Separando em duas partes.

    // Caso vetor "parts" não tenha duas partes, retorne o erro.
    if (!parts.length === 2 )
        return res.status(401).send({ error: 'Token error' });


    // A parabra "scheme" deve conter a palavra > Bearer;
    // A parabra "token" deve conter o token;
    const [ scheme, token ] = parts;

    /**
     *  "!" = Invertendo o resultado;
     *  "/" = Começando a regex;
     *  "^" = Indica o inicio da verificação;
     *  "Bearer" = Palavra que estou buscando;
     *  "$" = Indica o final da verificação;
     *  "/" = Terminando a regex;
     *  "i" = para dizer que é case sensitive = maiúsculas e minúsculas;
     */
    if (!/^Bearer$/i.test(scheme)) // O "scheme" tem que ter a palavra Bearer escrita, senão retorna a msg.
        return res.status(401).send({ error: 'Token malFormartted' });
    
    jwt.verify(token, authConfig.secret, (err, decoded) =>{
        // Caso o Token não bater com o "secret" vai retornar erro.
        if (err) return res.status(401).send({ error: 'Token invalid' });

        req.userId = decoded.id; // Que é referencia dos parametros passados no authController.js
        return next();

    });
    

}