const express = require('express');
require ('dotenv').config({path: 'C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/.env'});
const path = require('path')
const app = express();
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY)



const sessao = {
    usuario: null,
    logado: false
}


async function enviarEmail(destinatario, assunto, mensagem) {
    const message = {
        to: destinatario,
        from: 'matheush.oliveira@inss.gov.br',
        subject: assunto,
        html: mensagem
    }

    sgMail.send(message).then(() =>{
        console.log('deu bom')
    }).catch((error) => {
        console.log(error)
    })
    
}



const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB,
    ssl: {
        rejectUnauthorized: false
    },
}

const banco = new Client(config)


banco.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco:', err);
    } else {
      console.log('Conectado ao banco com sucesso!');
    }
  });
  

app.use(cors({
    origin: ['http://localhost:3000', 'https://dataviewinss.onrender.com'],
}));

app.use(express.json());

app.use(bodyParser.json());



app.get('/tabela', async function(req,res){
    try{
        const { rows: [vitoria]} = await banco.query(`select * from pactuacao where Gerencia = 'Vitória'`);
        const { rows: [bh]} = await banco.query(`select * from pactuacao where Gerencia = 'Belo Horizonte'`);
        const { rows: [barbacena]} = await banco.query(`select * from pactuacao where Gerencia = 'Barbacena'`);
        const { rows: [contagem]} = await banco.query(`select * from pactuacao where Gerencia = 'Contagem'`);
        const { rows: [divinopolis]} = await banco.query(`select * from pactuacao where Gerencia = 'Divinópolis'`);
        const { rows: [GV] }= await banco.query(`select * from pactuacao where Gerencia = 'Governador Valadares'`);
        const { rows: [juizFora]} = await banco.query(`select * from pactuacao where Gerencia = 'Juíz de Fora'`);
        const { rows: [montesClaros]} = await banco.query(`select * from pactuacao where Gerencia = 'Montes Claros'`);
        const { rows: [ouroPreto]} = await banco.query(`select * from pactuacao where Gerencia = 'Ouro Preto'`);
        const { rows: [pocos]} = await banco.query(`select * from pactuacao where Gerencia = 'Poços de Caldas'`);
        const { rows: [uberaba]} = await banco.query(`select * from pactuacao where Gerencia = 'Uberaba'`);
        const { rows: [uberlandia]} = await banco.query(`select * from pactuacao where Gerencia = 'Uberlandia'`);
        const { rows: [varginha]} = await banco.query(`select * from pactuacao where Gerencia = 'Varginha'`);
        const { rows: [diamantina]} = await banco.query(`select * from pactuacao where Gerencia = 'Diamantina'`);
        const { rows: [teofilo]} = await banco.query(`select * from pactuacao where Gerencia = 'Teófilo Otoni'`);
        res.setHeader('Content-Type', 'application/json');
        res.json({vitoria, bh, barbacena, contagem, divinopolis, GV, juizFora, montesClaros, ouroPreto, pocos, uberaba, uberlandia, varginha
            , diamantina, teofilo
        });
    } catch (error){
        console.error(error);
    }
})

app.post('/confereSenha', async function (req, res){
    const {email, senha} = req.body;
    const { rows: [resultado]} = await banco.query(`select senha, adm, emailConfirmado, contaHabilitada from usuarios where email = '${email}'`);
    if(resultado.length == 0){
        res.status(500).json({ 
            correto: false,
            message: "Usuario não encontrado."
        })
    } 
    else{
        if(await bcrypt.compare(senha, resultado[0].senha)) res.status(200).json({ 
            correto: true,
            message: "senha valida",
            adm: resultado[0].adm,
            contaHabilitada: resultado[0].contaHabilitada,
            emailConfirmado: resultado[0].emailConfirmado
        })
        else res.status(500).json({ 
            correto: false,
            message: "Usuário e/ou senha inválidos."})
    } 
})

app.post('/insertUser', async function (req, res) {
    try {
        
        const {usuario, email, senha, adm, contaHabilitada} = req.body;
        const pass = await bcrypt.hash(senha, 10);
        
        await banco.query(`insert into usuarios(usuario, email, senha, adm, contaHabilitada) values (?, ?, ?, ?, ?)`, 
            [usuario, email, pass, adm, contaHabilitada])
        
            const mensagem = `
                    <h1>Confirme seu e-mail</h1>
                    <p>Clique no botão abaixo para confirmar seu e-mail:</p>
                    <a href= "http://localhost:3000/confirmar-email?email=${email}">
                        <button  type="button" class="btn btn-success px-5">Clique aqui</button>
                    </a>
                `
            await enviarEmail(email, 'Confirmação', mensagem)
        res.status(200).json({criado: true,
            message: 'Conta criada com sucesso! Favor confirmar o seu email na caixa de mensagens. Redirecionando para Login!',
            redirect: 'auth-basic-login.html'
        })    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ criado: false,
            message: "Erro ao inserir usuário"})
    }
    
})

app.post('/recovery', async function (req, res) {
    
    const {destinatario} = req.body;
    try {
        const { rows: [compare]} = await banco.query(`select usuario from usuarios where email = '${destinatario}'`)
        if(compare.length == 0){
            res.status(404).json({ message: "Erro ao achar usuário",
                enviado: false
            })
        } else{

            const mensagem = `
            <h1>Resetar Senha</h1>
            <p>Clique no botão abaixo para ser redirecionado para resetar sua senha</p>
            <a href= "http://localhost:3000/auth-basic-reset-password.html?usuario=${compare[0].usuario}">
                <button  type="button" class="btn btn-success px-5">Clique aqui</button>
            </a>
        `
            await enviarEmail(destinatario, 'Reset de Senha', mensagem);
            res.status(200).json({ message: "email enviado",
                enviado: true
            })

        }

        
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor",
            enviado: false
        })
        console.log(error)
    }


        
    
    
})


app.put('/reset', async function (req, res){
    const {usuario, senha} = req.body;
    
    try {
        const { rows: [compare]} = await banco.query(`select senha from usuarios where usuario = '${usuario}'`)
        if(compare.length == 0){
            res.status(500).json({ message: "Erro ao achar usuário",
                reset: false
            })
        } else{

            if(await bcrypt.compare(senha, compare[0].senha)) 
                res.status(500).json({ 
                    message: "Não pode colocar a mesma senha que a anterior.",
                    reset: false
                })
            else{
                const pass = await bcrypt.hash(senha, 10)
                await banco.query(`update usuarios set senha = '${pass}' where usuario = '${usuario}'`)
                res.status(200).json({ 
                    message: 'Senha resetada! Redirecionando pra login',
                    reset: true
                })
            }
        }

        
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor",
            reset: false
        })
        console.log(error)
    }
    

})

app.get('/sessao', async function (req,res) {
    res.setHeader('Content-Type', 'application/json');

    res.json(sessao.usuario);
})

app.get('/confirmar-email', async function (req, res) {
    const { email } = req.query;
    try {
        await banco.query(`update usuarios set emailConfirmado = true where email = '${email}'`)
        res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
    } catch (error) {
        console.log(error)
    }

})

app.post('/login', async function (req, res) {
    
    const{email, adm} = req.body;
    try {
        
        if(email.endsWith('@inss.gov.br')){

            const { rows: [result]} = await banco.query(`select usuario from usuarios where email = ?`,
                [email]
            );
            
            if(result != null) {
                
                sessao.logado = true
                sessao.usuario = result[0].usuario;               

                   
                res.json({user: result, message: 'Logado!'})
                
            }
            
                 
                
            else res.status(401).json({ message: 'Usuário ou senha incorretos' });
            
        } else {
            res.status(500).json({ message: 'Senha incorreta' });
        }
        
        
    } catch (error) {
        console.error(error)
    }
})

app.post('/logout', async function (req, res) { 
    try{
        sessao.logado = false;
        sessao.usuario = null;
        res.status(200).json({ deslogado: true, message: 'Logout realizado com sucesso' });
    }catch(erro){
        res.status(500).json({message: erro})
    }
})

app.put('/atualiza', async function(req,res) {
    try {
        const {usuario, contaHabilitada} = req.body;
        banco.query(`update usuarios set contaHabilitada = ${contaHabilitada} where usuario = '${usuario}'`, (err) =>{
            if (err) res.status(500).setHeader('Content-Type', 'application/json').send({ message: 'Erro ao atualizar' });
            else res.status(201).setHeader('Content-Type', 'application/json').send({ message: 'Conta atualizada com sucesso' });
        });
    } catch (error) {
        console.error(error)
    }
})

app.delete('/exclui', async function(req,res) {
    try {
        const {usuario} = req.body
        banco.query(`delete from usuarios where usuario = '${usuario}'`, (err) =>{
            if (err) res.status(500).setHeader('Content-Type', 'application/json').send({ message: 'Erro ao deletar' });
            else res.status(201).setHeader('Content-Type', 'application/json').send({ message: 'Conta excluída com sucesso' });
        });
    } catch (error) {
        console.error(error)
    }
})

app.get('/users', async function(req,res){
    try{
        const { rows: [users]} = await banco.query(`select * from usuarios`);
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    } catch (error){
        console.error(error);
    }
})

app.get('/', (req,res) =>{
    if(sessao.logado) res.sendFile(path.join(__dirname, 'matoxi/vertical-menu//index.html'))
    else res.sendFile(path.join(__dirname, 'matoxi/vertical-menu//auth-basic-login.html'))
})

app.get('/index.html', (req,res) =>{
    if(sessao.logado) res.sendFile(path.join(__dirname, 'matoxi/vertical-menu//index.html'))
        else res.sendFile(path.join(__dirname, 'matoxi/vertical-menu//auth-basic-login.html'))
})

app.get('/adm.html', (req,res) =>{
    if(sessao.logado) res.sendFile(path.join(__dirname, 'matoxi/vertical-menu//adm.html.html'))
    else res.sendFile(path.join(__dirname, 'matoxi/vertical-menu//auth-basic-login.html'))
})

app.use(express.static(path.join(__dirname, 'matoxi/vertical-menu//adm.html.html')));



app.listen(process.env.API_PORT_SITE, '0.0.0.0', function(){
    console.log("conectado pai");
});