export async function fetchData() {
    try {
        const response = await fetch('http://localhost:4000/');
        const dados = await response.json();
        return dados;
        
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return [];
    }
}

export async function fetchData2() {
    try {
        const response = await fetch('http://localhost:4000/users');
        const dados = await response.json();
        return dados;
        
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return [];
    }
}

export async function fetchData3() {
    try {
        const response = await fetch('http://localhost:3000/sessao');
        console.log(response)
        const dados = await response.json();
        return dados;
        
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return [];
    }
}

export async function fetchData4() {
    try {
        const response = await fetch('http://localhost:4000/tabela');
        const dados = await response.json();
        return dados;
        
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return [];
    }
}


