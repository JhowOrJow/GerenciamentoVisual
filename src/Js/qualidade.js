// Função para obter dados de qualidade do backend e ordenar por data decrescente
async function obterDadosQualidade() {
    try {
        const response = await fetch('http://10.109.133.117:3000/dadosTrianguloQualidade');
        if (!response.ok) {
            throw new Error('Erro ao obter dados do servidor.');
        }
        let data = await response.json();

        // Formata cada valor_da_celula para o formato de data brasileiro (DD-Mes Abreviado-YY)
        data.forEach(item => {
            const dataISO = item.valor_da_celula;
            const dataObj = new Date(dataISO);
            item.dataObj = dataObj; // Armazena o objeto Date para uso na ordenação
        });

        // Ordena os dados por data decrescente
        data.sort((a, b) => b.dataObj.getTime() - a.dataObj.getTime());

        return data;

    } catch (error) {
        console.error('Erro ao obter dados de qualidade:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

// Função para contar registros de cores específicas
function contarRegistrosPorCorQualidade(dados) {
    const contagemCores = {
        vermelho: 0,
        amarelo: 0
    };

    dados.forEach(item => {
        const cor = item.nome_da_cor.toLowerCase();
        if (contagemCores.hasOwnProperty(cor)) {
            contagemCores[cor]++;
        }
    });

    return contagemCores;
}

// Função para atualizar a quantidade de registros de cores no HTML
function atualizarContagemCoresQualidade(contagemCores) {
    const vermelho = document.getElementById('resultado-valor-vermelho-qua');
    const amarelo = document.getElementById('resultado-valor-amarelo-qua');

    // Verifica se os elementos existem
    if (vermelho && amarelo) {
        vermelho.textContent = contagemCores.vermelho;
        amarelo.textContent = contagemCores.amarelo;
    } else {
        console.error('Um ou mais elementos não foram encontrados.');
    }
}

// Função para atualizar as informações na página com base nos dados de qualidade
async function atualizarInformacoesQualidade(dados) {
    try {
        const qua1 = document.querySelector('.qua1');
        const qua2 = document.querySelector('.qua2');
        const rowQua = document.querySelector('.row-qua');
        const resultadoQua = document.getElementById('resultado-qua');
        const corvermelho = document.querySelector('.cor-vermelho');
        const coramarelo = document.querySelector('.cor-amarelo');

        const dataAtual = new Date();
        const mesAtual = dataAtual.getFullYear() + '-' + (dataAtual.getMonth() + 1).toString().padStart(2, '0');

        const registrosMesAtual = dados.filter(item => {
            const dataItem = item.valor_da_celula.substr(0, 7);
            return dataItem === mesAtual;
        });

        const contagemCores = contarRegistrosPorCorQualidade(registrosMesAtual);
        atualizarContagemCoresQualidade(contagemCores);
        console.log(contagemCores);
        // Lógica para definir a cor de fundo da div resultado-qua
        if (contagemCores.vermelho > 0) {
            resultadoQua.style.color = 'var(--cor-bom)';
            corvermelho.style.color = contagemCores.vermelho > 0 
            ? 'var(--cor-ruim)' 
            : 'green'; // Sem gradiente se o valor for 0
        } else if (contagemCores.amarelo > 0) {
            resultadoQua.style.color = 'var(--cor-bom)';
            coramarelo.style.color = contagemCores.amarelo > 0 
            ? 'var(--cor-bom)' 
            : 'green'; // Sem gradiente se o valor for 0
        } else {
           // resultadoQua.style.backgroundImage = 'linear-gradient(#00FF7F, #98FB98, #90EE90)';
        }


        // Resto da lógica existente para qua1 e qua2
        if (registrosMesAtual.length > 0) {
            const registrosVermelhosMesAtual = registrosMesAtual.filter(item => item.nome_da_cor.toLowerCase() === 'vermelho');

            if (registrosVermelhosMesAtual.length === 0) {
                qua1.textContent = `Data de ontem: ${formatarData(new Date(Date.now() - 86400000))}`;
                qua1.classList.remove('ruim', 'qua1');
                qua1.classList.add('bom');
                rowQua.style.border = '2px solid rgb(0, 255, 0)';
                resultadoQua.style.border = '2px solid rgb(0, 255, 0)';
            } else {
                qua1.textContent = `Registro vermelho mais recente: ${formatarData(new Date(registrosVermelhosMesAtual[0].valor_da_celula))} / ${registrosVermelhosMesAtual.length} registros`;
                qua1.classList.remove('bom', 'qua1');
                qua1.classList.add(
                    registrosVermelhosMesAtual.length === 1 ? 'alerta' :
                    registrosVermelhosMesAtual.length > 2 ? 'ruim' : 
                    'critico'
                );
                rowQua.style.border = `2px solid ${registrosVermelhosMesAtual.length === 1 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`;
                resultadoQua.style.border = `2px solid ${registrosVermelhosMesAtual.length === 1 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}`;
            }

            const primeiroRegistro = dados[0];
            const dataRegistro = new Date(primeiroRegistro.valor_da_celula);
            if (dataRegistro.toLocaleDateString() === dataAtual.toLocaleDateString()) {
                qua2.textContent = `Dia atual: ${formatarData(dataAtual)}`;
                qua2.classList.remove('neutro', 'qua2');
                qua2.classList.add('bom');
            } else {
                qua2.textContent = 'Falta de preenchimento do dia atual';
                qua2.classList.remove('bom', 'qua2');
                qua2.classList.add('neutro');
            }

        } else {
            qua1.textContent = 'Falta de preenchimento';
            qua1.classList.remove('bom', 'qua1', 'ruim');
            qua1.classList.add('neutro');
            rowQua.style.border = '2px solid rgb(0, 0, 0)';
            qua2.textContent = 'Falta de preenchimento';
            qua2.classList.remove('bom');
            qua2.classList.add('neutro');
        }

    } catch (error) {
        console.error('Erro ao atualizar informações de qualidade:', error);
    }
}

// Função para formatar a data
function formatarData(data) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mesAbreviado = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"][data.getMonth()];
    const ano = data.getFullYear().toString().slice(-2);
    return `${dia}-${mesAbreviado}-${ano}`;
}

// Função para carregar dados e atualizar a página
async function carregarDadosEAtualizarPagina() {
    try {
        const dados = await obterDadosQualidade();
        await atualizarInformacoesQualidade(dados);
    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
}

// Chamada da função para carregar dados e atualizar a página ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDadosEAtualizarPagina);
