

async function opcoes(){
    
    const { pesquisando } = await import('./search.js'); 
    const gerenciaSelecionada = pesquisando(document.getElementById('pesquisa').value.trim());
    const { fetchData } = await import('./extrairData.js');
    fetchData().then((gerencias) =>{
        const agenciaDropdown = document.getElementById("agenciaSelect");
        if(gerenciaSelecionada === null) return;
    
        var inner = `<option selected="">${gerenciaSelecionada}</option>\n`;

            gerencias[gerenciaSelecionada].forEach(agencia =>{
                inner += `<option value = "${agencia.codigoAgencia}"> ${agencia.nomeAgencia} </option>`;
            });
        inner += `<option value="1">Voltar</option>`;    
        agenciaDropdown.innerHTML = inner;
        document.getElementById('titulo').innerText = `${gerencias[gerenciaSelecionada][0].nome}`;
    });

    

    document.getElementById("pesquisa").value = "";
    return gerenciaSelecionada;
}

async function contas(){
    const agenciaDropdown = document.getElementById("totalUsuario");
    const { fetchData2 } = await import('./extrairData.js');
    fetchData2().then((dados) =>{
        
        
    
        var inner = "";

            dados.forEach(user =>{
                inner += `<option value = "${user.usuario}"> ${user.email} </option>`;
            });

        agenciaDropdown.innerHTML = inner;
    });

    const username = agenciaDropdown.value
    document.getElementById("nomeUsuario").value = `${username}`;
}

async function preencherTabela() {

    var cont = null;
    
    const table = document.getElementById("pactuacao");
    const { fetchData4 } = await import('./extrairData.js');
    document.getElementById('gerenciaSelect').addEventListener('change', (event)=> {
        event.preventDefault();
        const gerenciaSelecionada = event.target.value
        fetchData4().then((dados) => {
            
            const vetor = dados[gerenciaSelecionada]
            const nomes = Object.keys(dados[gerenciaSelecionada][0])
            let inner = `<thead>
                            <tr>`;
            nomes.forEach(nome => {
                if (nome !== 'id'){
                    if(nome !== 'Gerencia'){
                        inner += `<th>${nome}</th>\n`;
                    }
                } 
            });
    
            inner += `</tr>
                      </thead>
                      <tbody>`;

            if(gerenciaSelecionada != null){

                    
                    
                    vetor.forEach((vetor2) => {
                        inner += `<tr>`;
                        const keys = ['Indicador', 'Tipo', 'SRS2', 'Inicial', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 
                            'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                        const vetor3 = keys.map(key => vetor2[key])
                        Object.values(vetor3).forEach(valor =>{

                                    
                                    if(valor.toString().startsWith('%')){
                                        cont = 0;
                                        inner += `<td>${valor}</td>`;
                                       
                                    } else if (cont > 1){
                                        valor = parseInt(valor*100)

                                            inner += `<td>${valor}%</td>`;
                                    } else inner += `<td>${valor}</td>`;

                            if (cont != null) cont++
                            if(cont == 14) cont = null;
                        });
                        inner += `</tr>`;
                        })

                
        
                inner += `</tbody>`;
            }
            
            table.innerHTML = inner;

        });
            
            const tabela = document.getElementById('pactuacao');
            const observerCallback = () => {
                
                    mesclaCelula();
                    colorirTabela();
                    observer.disconnect();

            };
        
            const observer = new MutationObserver(observerCallback);
            observer.observe(tabela, { childList: true, subtree: true });
        
            
        

    })
    
}

function colorirTabela(){

   
    const tabela = document.getElementById('pactuacao');

    for (let i = 1; i < tabela.rows.length - 1; i++) {
        const linhaMeta = tabela.rows[i]; 
        const linhaResultado = tabela.rows[i + 1]; 


        if (!linhaResultado) break;



        for (let j = 1; j < linhaMeta.cells.length - 3; j++) {
            if(linhaResultado.cells[j].innerText != '-'){     
                const meta = parseFloat(linhaMeta.cells[j+3].innerText);
                const resultado = parseFloat(linhaResultado.cells[j].innerText);
            
                
                if (resultado < meta){
                    linhaResultado.cells[j].style.color = 'black';
                    linhaResultado.cells[j].style.backgroundColor = '#ba2727'
                } 
                else if (resultado == meta) linhaResultado.cells[j].style.backgroundColor = 'yellow'
                else{
                    linhaResultado.cells[j].style.color = 'black';
                    linhaResultado.cells[j].style.backgroundColor = '#2f822f'
                } 
            }
        }

        i++;
    }
    
} 

function mesclaCelula(){
    const tabela = document.getElementById('pactuacao');
    
    
    
        for (let i = 1; i < tabela.rows.length; i++) {
            const linhaAtual = tabela.rows[i];
            const linhaSeguinte = tabela.rows[i + 1];
            
            if(linhaSeguinte != undefined){
                if (linhaAtual.cells[0].innerText === linhaSeguinte.cells[0].innerText ||
                    linhaSeguinte.cells[2].innerText == 0
                ) {
                    linhaAtual.cells[0].rowSpan = 2;
                    linhaSeguinte.deleteCell(0); 
                }
        
                if (linhaAtual.cells[1].textContent.trim() === "Meta" && 
                    linhaSeguinte.cells[0].textContent.trim() === "Resultado"){
                        linhaAtual.cells[2].rowSpan = 2;
                        linhaAtual.cells[3].rowSpan = 2;

                        linhaSeguinte.deleteCell(1); 
                        linhaSeguinte.deleteCell(2);
                    }
            }

                
                if(linhaAtual.cells[0].textContent.trim() === "Resultado" ){
                    
                    
                    for(let j = 1; j < tabela.rows[0].cells.length - 3; j++){
                        if(tabela.rows[i].cells[j].innerText == 0 || tabela.rows[i].cells[j].textContent.trim() == '0%') 
                        tabela.rows[i].cells[j].innerText = '-'
                    }
                }

    }
        
    

}

