export function pesquisando(query) {
    
 


    const gerencias = {
        "07001": "vitoria",
        "11001": "bh",
        "11021": "barbacena",
        "11022": "contagem",
        "11023": "divinopolis",
        "11024": "GV",
        "11025": "juizFora",
        "11026": "montesClaros",
        "11027": "ouroPreto",
        "11028": "pocos",
        "11029": "uberaba",
        "11030": "uberlandia",
        "11031": "varginha",
        "11032": "diamantina",
        "11033": "teofilo"
    };

    for (const prefix in gerencias) {
        
        if (query.startsWith(prefix)) {
            return gerencias[prefix];
        }

        if(query.startsWith('7001')) return 'vitoria';
    }

        if (!query) return null;
        alert("Gerência não encontrada"); 
    
        return null;
     
}
