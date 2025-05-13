async function obterDadosTempo() {
    const url = 'http://10.109.132.159:20620/Records/1';
    const headers = {
        'accept': '*/*',
        'cell': '1',
        'excludeFields': 'none',
        'fields': '*',
        'from': '2024/06/01',
        'to': '2024/12/01',
        'groupBy': 'Machine',
        'includeTotalRecord': 'true',
        'isPaged': 'true',
        'machine': '*',
        'machineOperator': '*',
        'mold': '*',
        'operation': '*',
        'pageSize': '20',
        'part': '*',
        'productionOrder': '*',
        'scrap': '*',
        'scrapsIncludeNameField': 'true',
        'scrapsMaxElements': '50',
        'scrapsOrder': 'Desc',
        'scrapsOrderBy': 'Quantity',
        'shift': '*',
        'stop': '1-1102,1500-1000000',
        'stopsIncludeDurationField': 'true',
        'stopsIncludeNameField': 'true',
        'stopsMaxElements': '100',
        'stopsDurationFormat': 'HHMMSS',
        'stopsOrder': 'Desc',
        'stopsOrderBy': 'Duration',
        'subGroupingLevel': 'Shift'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error('Erro ao obter dados do servidor.');
        const data = await response.json();
        console.log('Dados da API:', data);
        return data;
    } catch (error) {
        console.error('Erro ao obter dados de tempo:', error);
        return null;
    }
}

// Função para carregar os dados da API e atualizar a tabela
async function carregarDadosEAtualizar() {
    const dados = await obterDadosTempo(); // Corrigido aqui

    if (dados) {
        const tabela = document.getElementById('api-result').getElementsByTagName('tbody')[0];
        dados.forEach(item => {
            const row = tabela.insertRow();

            const maquina = row.insertCell(0);
            maquina.textContent = item.groupName;

            const tempoTotal = row.insertCell(1);
            tempoTotal.textContent = item.totalTime;

            const tempoParada = row.insertCell(2);
            tempoParada.textContent = item.totalStopTime;

            const porcentagemParada = row.insertCell(3);
            const porcentagem = ((item.totalStopTime / item.totalTime) * 100).toFixed(2);
            porcentagemParada.textContent = `${porcentagem}%`;

            const barraProgresso = row.insertCell(4);
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            const progress = document.createElement('div');
            progress.classList.add('progress');
            progress.style.width = `${porcentagem}%`;
            progress.classList.add('red');
            progressBar.appendChild(progress);

            const greenProgress = document.createElement('div');
            greenProgress.classList.add('progress');
            greenProgress.style.width = `${100 - porcentagem}%`;
            greenProgress.classList.add('green');
            progressBar.appendChild(greenProgress);

            barraProgresso.appendChild(progressBar);
        });
    }
}

// Chama a função para carregar os dados assim que a página for carregada
document.addEventListener('DOMContentLoaded', carregarDadosEAtualizar);
