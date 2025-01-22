

document.getElementById("atualiza").addEventListener('click', async(event) =>{
        const usuario = document.getElementById("nomeUsuario").value;
        event.preventDefault();
        const habilitar = document.getElementById('habilita').checked;
        const desabilitar = document.getElementById('desabilita').checked;
        const excluir = document.getElementById('exclui').checked;
        const habilitado = 1, desabilitado = 0;
        try{
            if(usuario.length == 0){
                alert("Selecione uma conta");

            }
            else{
                    
                if(habilitar){
                    if(confirm(`Confirma a habilitação da conta ${usuario}?`)){
                        const resposta = await fetch('http://localhost:4000/atualiza', {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ usuario, contaHabilitada: habilitado})
                        });
                        if(resposta.ok){
                            const resultado = await resposta.json();
                            alert(resultado.message);
                        document.getElementById("nomeUsuario").value = "";
                        document.getElementById("totalUsuario").value = "";
                        } else {
                            alert("Erro ao mandar para o banco de dados");
                            document.getElementById("nomeUsuario").value = "";
                            document.getElementById("totalUsuario").value = "";
                        } 
                    }

                } else if(desabilitar){
                    if(confirm(`Confirma a desabilitação da conta ${usuario}?`)){
                    
                        const resposta = await fetch('http://localhost:4000/atualiza', {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({usuario, contaHabilitada: desabilitado})
                        });
                        
                        
                        if(resposta.ok){
                            const resultado = await resposta.json();
                            alert(resultado.message);
                        document.getElementById("nomeUsuario").value = "";
                        document.getElementById("totalUsuario").value = "";
                        } else {
                            alert("Erro ao mandar para o banco de dados");
                            document.getElementById("nomeUsuario").value = "";
                            document.getElementById("totalUsuario").value = "";
                        } 
                    
                    }


                } else if(excluir){
                    if(confirm(`Confirma a exclusão da conta ${usuario}?`)){

                        const resposta = await fetch('http://localhost:4000/exclui', {
                            method: 'DELETE',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({usuario})
                        });
                        
                        
                        if(resposta.ok){
                            const resultado = await resposta.json();
                            alert(resultado.message);
                        document.getElementById("nomeUsuario").value = "";
                        document.getElementById("totalUsuario").value = "";
                        } else {
                            alert("Erro ao mandar para o banco de dados");
                            document.getElementById("nomeUsuario").value = "";
                            document.getElementById("totalUsuario").value = "";
                        } 

                    }

                } else {
                    alert("Selecione uma opção!")
                    document.getElementById("nomeUsuario").value = "";
                    document.getElementById("totalUsuario").value = "";
                }

                
                

            }     
   
            
            
        } catch (error){
            console.log(error)
        }
    
//})

})