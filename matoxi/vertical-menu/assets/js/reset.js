const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
document.getElementById("enviar").addEventListener('click', async() =>{
    const pass = document.getElementById('senha').value.trim();
    const confirmar = document.getElementById('confirmar').value.trim();

    if(pass === confirmar){
        try{
            
            const user = JSON.stringify({
                usuario: token,
                senha: pass
            })
            
            if(confirm('Deseja realmente mudar sua senha?')){
                const resposta = await fetch('http://localhost:4000/reset', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: user
                });
                const resultado = await resposta.json();

                
                    
                    if(resultado.reset){
                        alert(resultado.message);
                        window.location.href = resultado.redirect;
                    } else{
                        alert(resultado.message)
                    }

                
            }

        } catch (error){
            console.log(error)
        }
    } else {
        alert('As senhas estão diferentes')

    }
    
    document.getElementById("senha").value = "";
    document.getElementById("confirmar").value = "";
    
})