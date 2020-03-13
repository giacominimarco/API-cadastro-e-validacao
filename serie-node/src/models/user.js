const mongoose = require('../database');
const bcrypt = require('bcryptjs');


/*
 *Campos que iremos ter dentro do banco de dados que serão
 *armazenadas as informações do usuário;
 */
const UserSchrema = new mongoose.Schema({ 
    nome: {                               
        type: String,
        require: true, // define que é obrigatório; 

    },
    email: {
        type: String,
        unique: true, // Vai ser como se fosse a chave primária - Unico
        required: true, // define que é obrigatório; 
        lowercase: true, // converção para caixa baicha;
    },
    password: {
        type: String,
        required: true, // define que é obrigatório;
        select: false, // pra quando for buscar o usuário, não vir com a informação da senha; 
    },
    creatdAt: { //Data de criação do usuário;
        type: Date,
        default: Date.now, // cria a data que o usuário foi criado;
    },
})

/*
 * Define alguma coisa antes de salvar o usuário
 * Fução que esta sendo usada para criptografar a senha
 */
UserSchrema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10); // o n10 é a quantidade de vezes que o hash vai ser gerado para deixar a criptografia mais forte
    this.password = hash; // this -> se refere ao objeto que está sendo salvado.
    
    next();
});

const User = mongoose.model('User', UserSchrema); 
module.exports = User; // exportar as informações do usuário