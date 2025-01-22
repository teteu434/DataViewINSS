import { fetchData, } from './extrairData.js';
//import { pesquisando } from './../../../js/search.js';


$(async function () {
        const query = document.getElementById('pesquisa').value.trim();
        const { pesquisando } = await import('./../../../js/search.js'); 
        const ctx1 = document.getElementById('chart1').getContext('2d');
        let ultimaPesquisa = "";

        fetchData().then((dados) => {
            
            
            const nomes = Object.keys(dados);

            const mediaTmea = {}; 
            const mediaForcaPerdida = {}; 
            const mediaQtdOI = {};
            const mediaPontoTarefa = {};

    
            nomes.forEach(gerencia => {
                const somaTMEA = dados[gerencia].reduce((soma, agencia) => soma + agencia.tmea, 0);
                const somaForca = dados[gerencia].reduce((soma, agencia) => soma + agencia.potencialForcaPerdidaMes, 0);
                const somaOI = dados[gerencia].reduce((soma, agencia) => soma + agencia.qtdOIMes, 0);
                const somaPonto = dados[gerencia].reduce((soma, agencia) => soma + agencia.pontoTarefaMes, 0);
                const mediatmea = somaTMEA / dados[gerencia].length;
                const mediaforca = somaForca / dados[gerencia].length;
                const mediaoi = somaOI / dados[gerencia].length;
                const mediaponto = somaPonto / dados[gerencia].length;
                mediaTmea[gerencia] = mediatmea.toFixed(2);
                mediaQtdOI[gerencia] = mediaoi.toFixed(2);
                mediaForcaPerdida[gerencia] = mediaforca.toFixed(2);
                mediaPontoTarefa[gerencia] = mediaponto.toFixed(2);
            });
        
            console.log(mediaTmea);

            var chart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: nomes,
                datasets: [{
                    label: 'TMEA',
                    data: mediaTmea,
                    backgroundColor: '#008cff',
                    lineTension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderColor: '#008cff',
                    borderWidth: 4,
                    fill: {
                        target: 'origin',
                        above: 'rgba(13, 110, 253, 0.15)'
                    }
                },
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        const gerencias = {
            "7001": "vitoria",
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
        
        document.getElementById('butao').addEventListener('click', ()=>{
            const query = document.getElementById('pesquisa').value.trim();
            ultimaPesquisa = query;
            const gerencia = pesquisando(query);
            console.log(gerencia);
            const nomes = dados[gerencia].map(item => item.nomeAgencia);
            const tmea = dados[gerencia].map(item => item.tmea);
            chart1.data.labels = nomes;
            chart1.data.datasets[0].data = tmea;
            chart1.update();
        })

        document.getElementById('agenciaSelect').addEventListener('change', (event)=> {
            const gerencia = pesquisando(ultimaPesquisa);
            const agencia = parseInt(event.target.value);
            if(agencia < 6){
                if(agencia == 1){
                    chart1.data.datasets[0].data = mediaTmea;
                    chart1.data.datasets[0].label = 'TMEA';
                    document.getElementById('titulo').innerText = 'Gerências';
                    document.getElementById("agenciaSelect").innerHTML = '<option selected="">Selecione uma opcao</option>\n <option value="2">Pontuação de Tarefa Mensal</option>\n<option value="3">Força Perdida Mensal</option>\n<option value="4">Quantidade de OI Mensal</option>\n<option value="5">TMEA</option>';
                    chart1.data.labels = nomes;
                chart1.update();
                }else if (agencia == 2){
                    chart1.data.datasets[0].data = mediaPontoTarefa;
                    chart1.data.datasets[0].label = 'Média de Pontuação de tarefa';
                    chart1.data.labels = nomes;
                chart1.update();
                } else if (agencia == 3){
                    chart1.data.datasets[0].data = mediaForcaPerdida;
                    chart1.data.datasets[0].label = 'Média de Força Perdida';
                    chart1.data.labels = nomes;
                chart1.update();
                }else if (agencia == 4){
                    chart1.data.datasets[0].data = mediaQtdOI;
                    chart1.data.datasets[0].label = 'Média de Quantide de OI mensal';
                    chart1.data.labels = nomes;
                chart1.update();
                }else if (agencia == 5){
                    chart1.data.datasets[0].data = mediaTmea;
                    chart1.data.datasets[0].label = 'Média de TMEA';
                    chart1.data.labels = nomes;
                chart1.update();
                }
                
            }
                else{
                const dadosAgencia = dados[gerencia].find(item => item.codigoAgencia === agencia);
                const teste = [
                    dadosAgencia.qtdServidor,
                    dadosAgencia.qtdServidorNecessario,
                    dadosAgencia.qtdEstagiario,
                    dadosAgencia.OIestagiario
                ];
                
                chart1.data.datasets[0].data = teste;
                chart1.data.datasets[0].label = 'Dados';
                chart1.data.labels = ['Qtd Servidor', 'Qtd Servidor Necessario', 'Qtd Estagiario', 'OI Estagiário'];
                chart1.update();
            }

        });
        
        
        
            
            /*document.getElementById('teste2').addEventListener('click', ()=> {
                
                chart1.data.datasets[0].data = qtdTabela2;
                chart1.data.datasets[0].borderColor = '#0d2f55';
                chart1.data.datasets[0].backgroundColor = '#0d2f55';
                chart1.data.labels = produtoTabela2;
                chart1.update();
            });
            
        

        
            
            document.getElementById('teste3').addEventListener('click', ()=> {
                chart1.data.datasets[0].data = qtdTabela3;
                chart1.data.datasets[0].borderColor = '#ff5517';
                chart1.data.datasets[0].backgroundColor = '#ff5517';
                chart1.data.labels = produtoTabela3;
                chart1.update();
            });*/
    
    
    
        // chart2
        const ctx2 = document.getElementById('chart2').getContext('2d');
        const chart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                datasets: [{
                    label: 'Google',
                    data: [18, 25, 14, 12, 17, 8, 10],
                    backgroundColor: '#0d6efd',
                    lineTension: 0,
                    borderColor: '#0d6efd',
                    borderWidth: 0
                },
                {
                    label: 'Facebook',
                    data: [12, 30, 16, 23, 8, 14, 11],
                    backgroundColor: '#02c27a',
                    tension: 0,
                    borderColor: '#02c27a',
                    borderWidth: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        // chart3 - pie
        const ctx3 = document.getElementById('chart3').getContext('2d');
        const chart3 = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#15ca20', '#0dcaf0'],
                    borderWidth: 1.5
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
            }
        });
    
        // chart4
        
        
            var ctx = document.getElementById('chart4').getContext('2d');
            
            var chart4 = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['teste', 'de', 'grafico'],
                    datasets: [{
                        data: [0,23,6],
                        backgroundColor: [
                            '#0d6efd',
                            '#6f42c1',
                            '#03ed45'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            display: true,
                        }
                    },
        
                }
            });

            
            /*document.getElementById('teste5').addEventListener('click', () =>{
                
                    chart4.data.labels = origemAlface;
                    chart4.data.datasets[0].data = qtdAlface;
                    chart4.data.datasets[0].backgroundColor = ['#ff5517', '#008000', '#0d2f55'];
                    chart4.update();
                })
            

            document.getElementById('teste6').addEventListener('click', () =>{
            
                chart4.data.labels = origemPera;
                chart4.data.datasets[0].data = qtdPera;
                chart4.data.datasets[0].backgroundColor = [
                    '#0d6efd',
                    '#6f42c1',
                    '#03ed45'
                ];
                chart4.update();
            })*/
        

        
        
    

        
    
        // chart5
        var ctx = document.getElementById('chart5').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Eating',
                    'Drinking',
                    'Sleeping',
                    'Designing',
                    'Coding',
                    'Cycling',
                    'Running'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [5, 59, 900, 81, 56, 55, 40],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: 'My Second Dataset',
                    data: [28, 48, 40, 19, 96, 27, 100],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            },
        });
    
        // chart6
        var ctx = document.getElementById('chart6').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: [
                    'Red',
                    'Purple',
                    'Yellow',
                    'Grey',
                    'Green'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                        '#0d6efd',
                        '#6f42c1',
                        '#d63384',
                        '#fd7e14',
                        '#15ca20',
                        '#0dcaf0'
                    ],
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            },
        });
    
        // chart7
        var ctx = document.getElementById('chart7').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                datasets: [{
                    label: 'Google',
                    data: [18, 25, 14, 12, 17, 8, 10],
                    backgroundColor: [
                        '#fd3550'
                    ],
                    lineTension: 0,
                    borderColor: [
                        '#fd3550'
                    ],
                    borderWidth: 0
                }
                ]
            },
            options: {
                maintainAspectRatio: false,
                barPercentage: 0.5,
                categoryPercentage: 0.7,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        // chart8
        var ctx = document.getElementById('chart8').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                datasets: [{
                    type: 'bar',
                    label: 'Google',
                    data: [6, 20, 14, 12, 17, 8, 10],
                    backgroundColor: [
                        '#008cff'
                    ],
                    lineTension: 0.4,
                    borderColor: [
                        '#008cff'
                    ],
                    borderWidth: 1
                },
                {
                    type: 'line',
                    label: 'Facebook',
                    data: [5, 30, 16, 23, 8, 14, 11],
                    backgroundColor: [
                        '#fd3550'
                    ],
                    tension: 0.4,
                    borderColor: [
                        '#fd3550'
                    ],
                    borderWidth: 4
                }]
            },
            options: {
                maintainAspectRatio: false,
                barPercentage: 0.5,
                categoryPercentage: 0.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        // chart9
        var ctx = document.getElementById('chart9').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                datasets: [{
                    label: 'Facebook',
                    data: [5, 30, 16, 23, 8, 14, 2],
                    backgroundColor: [
                        '#15ca20'
                    ],
                    fill: {
                        target: 'origin',
                        above: 'rgb(21 202 32 / 20%)',   // Area will be red above the origin
                        //below: 'rgb(21 202 32 / 100%)'   // And blue below the origin
                    },
                    tension: 0.4,
                    borderColor: [
                        '#15ca20'
                    ],
                    borderWidth: 4
                }]
            },
            options: {
                maintainAspectRatio: false,
                barPercentage: 0.5,
                categoryPercentage: 0.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        display: true,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
    
    });
});




