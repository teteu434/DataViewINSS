const express = require('express');
require ('dotenv').config({path: 'C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/env/.env'});
const app = express();
const app2 = express();
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY)

const sessao = {
    usuario: null,
    logado: false
}

const confirmacao = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: 'confirmacaodeemailsrs2@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
})


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



const banco = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});



app.set('trust proxy', 1)



banco.connect(function(err){
    if(err) console.log(err);
    else console.log("connected!");
    
});

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json());

app.use(bodyParser.json());

app.get('/', async function(req,res){
    
    try{

        const [vitoria] = await banco.promise().query(`select * from dados where numero = 7001`);
        const [bh] = await banco.promise().query(`select * from dados where numero = 11001`);
        const [barbacena] = await banco.promise().query(`select * from dados where numero = 11021`);
        const [contagem] = await banco.promise().query(`select * from dados where numero = 11022`);
        const [divinopolis] = await banco.promise().query(`select * from dados where numero = 11023`);
        const [GV] = await banco.promise().query(`select * from dados where numero = 11024`);
        const [juizFora] = await banco.promise().query(`select * from dados where numero = 11025`);
        const [montesClaros] = await banco.promise().query(`select * from dados where numero = 11026`);
        const [ouroPreto] = await banco.promise().query(`select * from dados where numero = 11027`);
        const [pocos] = await banco.promise().query(`select * from dados where numero = 11028`);
        const [uberaba] = await banco.promise().query(`select * from dados where numero = 11029`);
        const [uberlandia] = await banco.promise().query(`select * from dados where numero = 11030`);
        const [varginha] = await banco.promise().query(`select * from dados where numero = 11031`);
        const [diamantina] = await banco.promise().query(`select * from dados where numero = 11032`);
        const [teofilo] = await banco.promise().query(`select * from dados where numero = 11033`);
        
        res.json({vitoria, bh, barbacena, contagem, divinopolis, GV, juizFora, montesClaros, ouroPreto, pocos, uberaba, uberlandia, varginha
            , diamantina, teofilo
        });
    } catch (error){
        console.log(error);
    }
});

app.get('/tabela', async function(req,res){
    try{
        const [vitoria] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Vitória'`);
        const [bh] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Belo Horizonte'`);
        const [barbacena] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Barbacena'`);
        const [contagem] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Contagem'`);
        const [divinopolis] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Divinópolis'`);
        const [GV] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Governador Valadares'`);
        const [juizFora] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Juíz de Fora'`);
        const [montesClaros] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Montes Claros'`);
        const [ouroPreto] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Ouro Preto'`);
        const [pocos] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Poços de Caldas'`);
        const [uberaba] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Uberaba'`);
        const [uberlandia] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Uberlandia'`);
        const [varginha] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Varginha'`);
        const [diamantina] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Diamantina'`);
        const [teofilo] = await banco.promise().query(`select * from pactuacao where Gerencia = 'Teófilo Otoni'`);
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
    const [resultado] = await banco.promise().query(`select senha, adm, emailConfirmado, contaHabilitada from usuarios where email = '${email}'`);
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
        
        await banco.promise().query(`insert into usuarios(usuario, email, senha, adm, contaHabilitada) values (?, ?, ?, ?, ?)`, 
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
        const [compare] = await banco.promise().query(`select usuario from usuarios where email = '${destinatario}'`)
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
        const [compare] = await banco.promise().query(`select senha from usuarios where usuario = '${usuario}'`)
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
                await banco.promise().query(`update usuarios set senha = '${pass}' where usuario = '${usuario}'`)
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

app2.get('/confirmar-email', async function (req, res) {
    const { email } = req.query;
    try {
        await banco.promise().query(`update usuarios set emailConfirmado = true where email = '${email}'`)
        res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
    } catch (error) {
        console.log(error)
    }

})

app.post('/login', async function (req, res) {
    
    const{email, adm} = req.body;
    try {
        
        if(email.endsWith('@inss.gov.br')){

            const [result] = await banco.promise().query(`select usuario from usuarios where email = ?`,
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
        const [users] = await banco.promise().query(`select * from usuarios`);
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    } catch (error){
        console.error(error);
    }
})

app2.get('/', (req,res) =>{
    if(!req.session) res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
    else 
        if(!req.session.authenticated) res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
    
        else res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/index.html')
})

app2.get('/index.html', (req,res) =>{
    //if(!req.session) res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
        //else 
            //if(!req.session.authenticated) res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
        
             res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/index.html')
})

app2.get('/adm.html', (req,res) =>{
    if(!req.session) res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
        else 
            if(!req.session.authenticated) res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/auth-basic-login.html')
        
            else res.sendFile('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/adm.html')
})

app2.use(express.static('C:/Users/MATHEUSHENRIQUECOSTA/Desktop/site inss/main-files/matoxi/vertical-menu/'));





app2.listen(process.env.API_PORT_SITE, '0.0.0.0', function(){
    console.log("conectou o site");
});

app.listen(process.env.API_PORT_BACK, '0.0.0.0', function(){
    console.log("conectou o banco");
});