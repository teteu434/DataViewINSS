
import { fetchData2 } from './extrairData.js';

    document.getElementById("telaEntrada").addEventListener('submit', async(event) =>{
            
                var userIgual = false
                const email = document.getElementById('email').value.trim();
                const senha = document.getElementById('senha').value.trim();
                const usuario = document.getElementById('usuario').value.trim();
                const contaHabilitada = 0; //conta começa desabilitada
                const adm = 0; // conta começa só como usuário
                event.preventDefault();
                const dados = await fetchData2();    
                for (const user of dados){
                    if(user.email == email || user.usuario == usuario){
                        userIgual = true;
                        break;
                    } 

                }
                if(userIgual) alert('Usuário já existente')
                else if(usuario.length == 0 || email.length == 0 || senha.length == 0) alert('Preencha todos os campos!')
                //else if(!email.endsWith('@inss.gov.br') && (senha.length < 8 || senha.lentgh > 20)) alert('Email e senha inválidos');
                //else if(!email.endsWith('@inss.gov.br')) alert('Email inválido');
                else if(senha.length < 8 || senha.length > 20) alert('Senha inválida');
                else{
                    
                    
                    try{
                        console.log('teste');
                        
                        
                        const resposta = await fetch('http://localhost:4000/insertUser', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({usuario, email, senha, adm, contaHabilitada})
                        });
                        

                        const resultado = await resposta.json();
                        
                        if(resultado.criado){
                            
                            alert(resultado.message);
                            window.location.href = resultado.redirect;
                        } else {
                            alert(resultado.message);

                            document.getElementById("email").value = "";
                            document.getElementById("senha").value = "";
                            document.getElementById("usuario").value = "";
                        }
                    } catch (error){
                        alert(error)
                        console.log(error)
                    }
                }
            
 
        })

