// Função para obter dados do backend e ordenar por data decrescente
async function obterDadosSeguranca() {
    try {
        const response = await fetch('http://10.109.133.117:3000/dadosCruzSeguranca');
        if (!response.ok) {
            throw new Error('Erro ao obter dados do servidor.');
        }
        let data = await response.json();

        // Formatar a data e adicionar uma nova propriedade
        data.forEach(item => {
            const dataISO = item.valor_da_celula;
            const dataObj = new Date(dataISO);
            item.valor_da_celula_formatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }).toLowerCase();
        });

        // Ordenar os dados por data decrescente
        data.sort((a, b) => new Date(b.valor_da_celula) - new Date(a.valor_da_celula) || (b.turno - a.turno));

        console.log(data);
        return data;
    } catch (error) {
        console.error('Erro ao obter dados de segurança:', error);
        return [];
    }
}

// Função para verificar se há registros com nome_da_cor "Vermelho" e atualizar a borda
async function atualizarDadosSeguranca(dados) {
    const divRowSeg = document.querySelector('.row-seg');
    const resultadoSeg = document.getElementById('resultado-seg');
    const temVermelho = dados.some(item => item.nome_da_cor.toLowerCase() === 'vermelho');
    divRowSeg.style.border = temVermelho ? '1px solid rgb(255, 0, 0)' : '1px solid rgb(0, 255, 0)';
    resultadoSeg.style.border = temVermelho ? '1px solid rgb(255, 0, 0)' : '1px solid rgb(0, 255, 0)';
}

// Função para contar registros de cores específicas
function contarRegistrosPorCor(dados) {
    const contagemCores = {
        vermelho: 0,
        amarelo: 0,
        azul: 0,
        preto: 0,
    };

    dados.forEach(item => {
        const cor = item.nome_da_cor.toLowerCase();
        if (contagemCores.hasOwnProperty(cor)) {
            contagemCores[cor]++;
        }
    });

    // Console log para mostrar a contagem por cor
    console.log('Quantidade de apontamentos por cor:', contagemCores);
    return contagemCores;
}

// Função para atualizar a quantidade de registros de cores no HTML
function atualizarContagemCores(contagemCores) {
    document.getElementById('resultado-valor-vermelho').textContent = contagemCores.vermelho;
    document.getElementById('resultado-valor-amarelo').textContent = contagemCores.amarelo;
    document.getElementById('resultado-valor-azul').textContent = contagemCores.azul;
    document.getElementById('resultado-valor-preto').textContent = contagemCores.preto;
}

// Função para atualizar as informações na página
async function atualizarInformacoes(dados) {
    const seg1 = document.querySelector('.seg1');
    const seg2 = document.querySelector('.seg2');
    const resultadoSeg = document.getElementById('resultado-seg');
    const corvermelho = document.querySelector('.cor-vermelho');
    const coramarelo = document.querySelector('.cor-amarelo');
    const corazul = document.querySelector('.cor-azul');
    const corpreto = document.querySelector('.cor-preto');

    const dataAtual = new Date();
    const dataOntem = new Date(dataAtual);
    dataOntem.setDate(dataAtual.getDate() - 1);

    const mesesAbreviados = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    const registroVermelhoEncontrado = dados.find(item => item.nome_da_cor.toLowerCase() === 'vermelho');
    const diaOntemPreenchido = dados.some(item => new Date(item.valor_da_celula).toLocaleDateString('pt-BR') === dataOntem.toLocaleDateString('pt-BR'));

    // Contar registros por cor
    const contagemCores = contarRegistrosPorCor(dados);
    atualizarContagemCores(contagemCores);

    // Definir o background da div resultado-seg
    if (contagemCores.vermelho > 0) {
        resultadoSeg.style.backgroundImage = 'linear-gradient(#ff0404, #ff3737, #ff7676)'; // Acidente
    } else if (contagemCores.amarelo > 0) {
        resultadoSeg.style.backgroundImage = 'linear-gradient(#ffff04, #f7ff02, #e3fc00)'; // Quase Acidente
    } else if (contagemCores.azul > 0) {
        resultadoSeg.style.backgroundImage = 'linear-gradient(#1c1c1c, #3535cc, #2b3aae, #262c80, #353cc3, #5265ff, #3f63fa)'; // Incidente
    } else if (contagemCores.preto > 0) {
        resultadoSeg.style.backgroundImage = 'linear-gradient(#ff8000, #ffa202, #fcb000)'; // Situação de Risco
    } else {
        resultadoSeg.style.backgroundImage = 'linear-gradient(#00FF7F, #98FB98, #90EE90)'; // Sem registros
    }

    // Atualizar a cor das divs de cores com base na contagem
    corvermelho.style.backgroundImage = contagemCores.vermelho > 0 
        ? 'linear-gradient(#ff0404, #ff3737, #ff7676)' // Acidente
        : 'linear-gradient(#00FF7F, #98FB98, #90EE90)'; // Verde

    coramarelo.style.backgroundImage = contagemCores.amarelo > 0 
        ? 'linear-gradient(#ffff04, #f7ff02, #e3fc00)' // Quase Acidente
        : 'linear-gradient(#00FF7F, #98FB98, #90EE90)'; // Verde

    corazul.style.backgroundImage = contagemCores.azul > 0 
        ? 'linear-gradient(#5265ff, #3535cc, #2b3aae, #262c80, #353cc3, #5265ff, #3f63fa)' // Incidente
        : 'linear-gradient(#00FF7F, #98FB98, #90EE90)'; // Verde

    corpreto.style.backgroundImage = contagemCores.preto > 0 
        ? 'linear-gradient(#ff8000, #ffa202, #fcb000)' // Situação de Risco
        : 'linear-gradient(#00FF7F, #98FB98, #90EE90)'; // Verde

    // Atualizar seg1
    if (registroVermelhoEncontrado) {
        const dataRegistroFormatada = new Date(registroVermelhoEncontrado.valor_da_celula);
        const dia = String(dataRegistroFormatada.getDate()).padStart(2, '0');
        const mesAbreviado = mesesAbreviados[dataRegistroFormatada.getMonth()];
        const ano = String(dataRegistroFormatada.getFullYear()).slice(-2);

        seg1.innerHTML = `<p class="acidente-text">Acidente ocorreu: </p> Dia ${dia}/${mesAbreviado}/${ano} <p class="acidente-text">Turno: </p>${registroVermelhoEncontrado.turno}`;
        seg1.classList.remove('tem1-card-bom', 'seg1');
        seg1.classList.add('tem1-card-ruim');
    } else if (dados.length > 0) {
        const primeiroRegistro = dados[0];
        const dataPrimeiroRegistroFormatada = new Date(primeiroRegistro.valor_da_celula);
        const diaPrimeiroRegistro = String(dataPrimeiroRegistroFormatada.getDate()).padStart(2, '0');
        const mesAbreviadoPrimeiroRegistro = mesesAbreviados[dataPrimeiroRegistroFormatada.getMonth()];
        const anoPrimeiroRegistro = String(dataPrimeiroRegistroFormatada.getFullYear()).slice(-2);

        seg1.textContent = `Último Dia Preenchido na planilha: ${diaPrimeiroRegistro}-${mesAbreviadoPrimeiroRegistro}-${anoPrimeiroRegistro} / Turno: ${primeiroRegistro.turno}`;
        seg1.classList.remove('tem1-card-ruim', 'seg1', 'seg2');
        seg1.classList.add('tem1-card-bom');
    }

    // Atualizar seg2
    if (diaOntemPreenchido) {
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mesAbreviado = mesesAbreviados[dataAtual.getMonth()];
        const ano = String(dataAtual.getFullYear()).slice(-2);
        const turno = dados[0]?.turno || 'Desconhecido';

        seg2.textContent = `Dia atual: ${dia}-${mesAbreviado}-${ano} / Turno: ${turno}`;
    } else {
        seg2.textContent = "Falta de preenchimento do dia atual";
        seg2.classList.add('neutro');
        seg2.classList.remove('tem1-card-bom');
    }
}

// Função para atualizar as divs com base nos valores
function updateDivs() {
    // Seleciona todas as divs que contêm as informações
    const divs = [
        { element: document.querySelector('.cor-vermelho'), value: parseInt(document.getElementById('resultado-valor-vermelho').innerText) },
        { element: document.querySelector('.cor-amarelo'), value: parseInt(document.getElementById('resultado-valor-amarelo').innerText) },
        { element: document.querySelector('.cor-azul'), value: parseInt(document.getElementById('resultado-valor-azul').innerText) },
        { element: document.querySelector('.cor-preto'), value: parseInt(document.getElementById('resultado-valor-preto').innerText) },
    ];

    // Exibe os valores no console
    divs.forEach(div => {
        console.log(`Valor de ${div.element.className}: ${div.value}`);
    });

    // Inicializa a contagem de divs visíveis
    let totalDivs = 0;

    // Verifica quais divs devem ser exibidas e conta
    divs.forEach(div => {
        if (div.value > 0) {
            div.element.style.display = 'grid';
            totalDivs++;
        } else {
            div.element.style.display = 'none';
        }
    });

    // Se houver divs visíveis, aplica a configuração de grid
    if (totalDivs > 0) {
        // Define a quantidade de colunas do grid
        document.querySelector('.resultado-seg').style.gridTemplateColumns = `repeat(${totalDivs}, 1fr)`;
    } else {
        // Caso não haja divs visíveis, redefine o grid
        document.querySelector('.resultado-seg').style.gridTemplateColumns = 'none';
    }
}



// Função para atualizar a interface
async function carregarDadosEAtualizar() {
    const dados = await obterDadosSeguranca();
    await atualizarDadosSeguranca(dados);
    await atualizarInformacoes(dados);
    updateDivs();
}

// Chamada da função para carregar dados ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarDadosEAtualizar);
