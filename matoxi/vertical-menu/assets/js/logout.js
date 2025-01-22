import { fetchData3 } from "./extrairData.js";

async function logOut(){
    const deslogar = 'deslogado';
    
        if(confirm("deseja realmente fazer logout?")){
          try {
              const response = await fetch('http://localhost:4000/logout', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({deslogar})
          });
          const resultado = await response.json();
          console.log("teste")
          if (resultado.deslogado) {
              alert(resultado.message);
              window.location.href = 'auth-basic-login.html'; // Redireciona para a tela de login
          } else {
            alert(resultado.message);
          }
          } catch (error) {
            alert("Erro interno do servidor");
          }
        }
    
}

async function usuario() {
  const sessao = await fetchData3();
  document.getElementById('user').innerHTML = `Olá, ${sessao.usuario}!`
}

export {logOut, usuario}