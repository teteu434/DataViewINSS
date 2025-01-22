

document.getElementById("enviar").addEventListener('click', async() =>{

    const destinatario = document.getElementById('email').value.trim();
    /*if(!emailUser.endsWith('@inss.gov.br')){
        alert("Email inválido");
        
    } else{ */
                
        try{
                
            const resposta = await fetch('http://localhost:4000/recovery', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({destinatario})
            });
            const resultado = await resposta.json();    


                
                if(resultado.enviado){
                    alert(resultado.message)
                    window.location.href = 'auth-basic-login.html'

                }else{
                    alert(resultado.message)
                } 

    
        } catch(error){

            console.log(error)
        }


    //}
    document.getElementById("email").value = "";
})