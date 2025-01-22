const express = require('express');
const app = express();
const mysql = require('mysql2');
var dados = null;

const banco = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mat-2004',
    database: 'mercado'
});

banco.connect(function(err){
    if(err) console.log(err);
    else console.log("connected!");
});

function getData(){
    
    
        let sql = 'SELECT * FROM tabela';
        banco.query(sql, (err, result) => {
        if (err) 
            console.log("deu erro na tabela");
        else
            dados = JSON.parse(JSON.stringify(result));
        });
    
}

module.exports = getData;

app.get('/', function(req,res){
    
        
        res.sendFile("C:/Users/INSS/Desktop/site inss/main-files/matoxi/vertical-menu/charts-chartjs.html");
    
});



app.listen(8080, function(){
    console.log("teste");
});