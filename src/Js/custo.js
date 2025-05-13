// Função para obter os dados da API de custo
async function obterDadosCusto(machineId, shift, diaSelecionado, mesSelecionado) {
    const ano = new Date().getFullYear();
    const mes = mesSelecionado || (new Date().getMonth() + 1).toString().padStart(2, '0');
    const dia = diaSelecionado.padStart(2, '0');
    
    // Definindo a data inicial como o primeiro dia do mês e a data final como o dia selecionado
    const dataInicial = `${ano}-${mes}-01`; // Primeiro dia do mês
    const dataFinal = `${ano}-${mes}-${dia}`; // Dia selecionado

    const url = 'http://10.109.132.159:20620/Records/1';
    const headers = {
        'accept': '*/*',
        'from': dataInicial, // Data inicial com base no filtro
        'to': dataFinal,     // Data final com base no filtro
        'groupBy': 'Date',
        'machine': machineId,
        'scrap': '*',
        'scrapsIncludeNameField': 'true',
        'scrapsMaxElements': '100',
        'scrapsOrder': 'Desc',
        'scrapsOrderBy': 'Quantity',
        'shift': shift,
        'subGroupingLevel': 'Shift'
    };

    try {
        const response = await fetch(url, { headers: headers });
        if (!response.ok) throw new Error('Erro ao obter dados do servidor.');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Erro ao obter dados de custo:', error);
        return null;
    }
}

// Função para converter o nome do mês em número
function converterNomeParaNumeroMes(nomeMes) {
    const meses = {
        Janeiro: '01',
        Fevereiro: '02',
        Março: '03',
        Abril: '04',
        Maio: '05',
        Junho: '06',
        Julho: '07',
        Agosto: '08',
        Setembro: '09',
        Outubro: '10',
        Novembro: '11',
        Dezembro: '12'
    };
    return meses[nomeMes] || meses['Janeiro']; // Default para Janeiro
}

// Função para carregar dados de custo e atualizar a página
async function carregarDadosCustoEAtualizarPagina(machineId, shift, diaSelecionado, mesSelecionado) {
    try {
        const ano = new Date().getFullYear();
        const mes = mesSelecionado || (new Date().getMonth() + 1).toString().padStart(2, '0');
        const diaFormatado = diaSelecionado.padStart(2, '0');
        const dataReferencia = `${ano}-${mes}-${diaFormatado}`;

        const dadosCusto = await obterDadosCusto(machineId, shift, diaSelecionado, mesSelecionado);
        if (!dadosCusto || dadosCusto.length === 0) {
            throw new Error('Dados de custo inválidos ou não disponíveis.');
        }

        let somaScrapsTurno = 0;
        let somaRefugoMes = 0;
        let totalPrdMes = 0;
        const totalPrdDiario = {};
        let somaScrapsMes = 0;

        dadosCusto.forEach(item => {
            const itemGroupName = item.groupName;
            if (dataReferencia === itemGroupName) {
                somaScrapsTurno += item.totalScrap;
            }

            const itemMes = itemGroupName.substring(5, 7);
            if (itemMes === mes) {
                totalPrdDiario[itemGroupName] = (totalPrdDiario[itemGroupName] || 0) + parseFloat(item.totalPrd) || 0;
                somaScrapsMes += item.totalScrap;
                const totalPrd = parseFloat(item.totalPrd) || 0;
                if (totalPrd > 0) {
                    totalPrdMes += totalPrd;
                    const percentualRefugo = (item.totalScrap * 100) / totalPrd;
                    somaRefugoMes += percentualRefugo;
                }
            }
        });

        const percentualRefugoMes = totalPrdMes > 0 ? somaRefugoMes / (totalPrdMes / somaScrapsMes) : 0;

        const divRowCus = document.querySelector('.row-cus');
        if (divRowCus) {
            divRowCus.style.border = percentualRefugoMes > 1.5 ? '1px solid rgb(255, 0, 0)' : '1px solid rgb(0, 255, 0)';
        }

        const scrapHojeDiv = document.querySelector('.cus2');
        if (scrapHojeDiv) {
            scrapHojeDiv.innerHTML = `<p class="scrap-turno"> <strong class="scrap-turno-dia"> ${shift}</strong>º Turno - <strong class="scrap-turno-dia"> ${diaSelecionado}/${mesSelecionado}</strong><br> <strong class="scrap-turno-res"> ${somaScrapsTurno}</strong></p>`;
        }

        const scrapMesDiv = document.querySelector('.cus1');
        if (scrapMesDiv) {
            scrapMesDiv.innerHTML = `<p class="scrap-mes"> Scraps do mês ${mesSelecionado} <br> <strong class="scrap-mes-res">${somaScrapsMes}</strong></p>`;
        }

    } catch (error) {
        console.error('Erro ao carregar página de custo:', error);
    }
}

// Função para garantir um atraso de 1 segundo antes de realizar a requisição de dados
let timeoutId;
function debounceUpdate(fn, delay = 1000) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
}

// Código para configurar os eventos da página
document.addEventListener('DOMContentLoaded', () => {
    const turnoButtons = document.querySelectorAll('#turno-buttons button');
    const linhaSelect = document.getElementById('linha-select');
    const diaButtons = document.querySelectorAll('.date-dias .select-dia');
    const mesButtons = document.querySelectorAll('.date-mes .select-mes');
    const btnRecarregar = document.querySelector('.reset-filtro');

    const defaultLinhaID = '101';
    const defaultTurnoID = '1';
    const defaultDia = new Date().getDate().toString().padStart(2, '0');
    const defaultMes = new Date().toLocaleString('pt-BR', { month: 'long' });

    const setButtonSelected = (buttons, value, attribute = 'textContent') => {
        buttons.forEach(button => {
            if (button[attribute]) {
                button.classList.toggle('selected', button[attribute].trim() === value);
            }
        });
    };

    const resetFilters = () => {
        if (linhaSelect) {
            linhaSelect.value = defaultLinhaID;
        }
        setButtonSelected(turnoButtons, defaultTurnoID, 'data-shift');
        setButtonSelected(mesButtons, defaultMes);
        setButtonSelected(diaButtons, defaultDia);
        debounceUpdate(() => carregarDadosCustoEAtualizarPagina(defaultLinhaID, defaultTurnoID, defaultDia, converterNomeParaNumeroMes(defaultMes)));
    };

    if (linhaSelect) {
        linhaSelect.value = defaultLinhaID;
    }
    if (turnoButtons.length > 0) {
        setButtonSelected(turnoButtons, defaultTurnoID, 'data-shift');
    }
    if (mesButtons.length > 0) {
        setButtonSelected(mesButtons, defaultMes);
    }
    if (diaButtons.length > 0) {
        setButtonSelected(diaButtons, defaultDia);
    }

    debounceUpdate(() => carregarDadosCustoEAtualizarPagina(defaultLinhaID, defaultTurnoID, defaultDia, converterNomeParaNumeroMes(defaultMes)));

    turnoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const turnoID = button.getAttribute('data-shift');
            const linhaID = linhaSelect.value;
            const diaSelecionado = document.querySelector('.date-dias .select-dia.selected')?.textContent.padStart(2, '0') || defaultDia;
            const mesSelecionado = document.querySelector('.date-mes .select-mes.selected')?.textContent || defaultMes;
            debounceUpdate(() => carregarDadosCustoEAtualizarPagina(linhaID, turnoID, diaSelecionado, converterNomeParaNumeroMes(mesSelecionado)));
        });
    });

    linhaSelect.addEventListener('change', () => {
        const turnoID = document.querySelector('#turno-buttons .selected')?.getAttribute('data-shift') || defaultTurnoID;
        const linhaID = linhaSelect.value;
        const diaSelecionado = document.querySelector('.date-dias .select-dia.selected')?.textContent.padStart(2, '0') || defaultDia;
        const mesSelecionado = document.querySelector('.date-mes .select-mes.selected')?.textContent || defaultMes;
        debounceUpdate(() => carregarDadosCustoEAtualizarPagina(linhaID, turnoID, diaSelecionado, converterNomeParaNumeroMes(mesSelecionado)));
    });

    diaButtons.forEach(button => {
        button.addEventListener('click', () => {
            diaButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            const turnoID = document.querySelector('#turno-buttons .selected')?.getAttribute('data-shift') || defaultTurnoID;
            const linhaID = linhaSelect.value;
            const diaSelecionado = button.textContent.padStart(2, '0');
            const mesSelecionado = document.querySelector('.date-mes .select-mes.selected')?.textContent || defaultMes;
            debounceUpdate(() => carregarDadosCustoEAtualizarPagina(linhaID, turnoID, diaSelecionado, converterNomeParaNumeroMes(mesSelecionado)));
        });
    });

    mesButtons.forEach(button => {
        button.addEventListener('click', () => {
            mesButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            const turnoID = document.querySelector('#turno-buttons .selected')?.getAttribute('data-shift') || defaultTurnoID;
            const linhaID = linhaSelect.value;
            const diaSelecionado = document.querySelector('.date-dias .select-dia.selected')?.textContent.padStart(2, '0') || defaultDia;
            const mesSelecionado = button.textContent;
            debounceUpdate(() => carregarDadosCustoEAtualizarPagina(linhaID, turnoID, diaSelecionado, converterNomeParaNumeroMes(mesSelecionado)));
        });
    });

    if (btnRecarregar) {
        btnRecarregar.addEventListener('click', resetFilters);
    }
});

// Variável para controlar se a atualização está em andamento
let isUpdating = false;

// Função para atualizar os dados periodicamente
async function atualizarDadosPeriodicamente(machineId, shift, diaSelecionado, mesSelecionado) {
    await carregarDadosCustoEAtualizarPagina(machineId, shift, diaSelecionado, mesSelecionado);
    
    setInterval(async () => {
        if (!isUpdating) {
            isUpdating = true;
            try {
                // Carregar dados e atualizar a página
                await carregarDadosCustoEAtualizarPagina(machineId, shift, diaSelecionado, mesSelecionado);
            } catch (error) {
                console.error('Erro ao atualizar os dados:', error);
            } finally {
                isUpdating = false; // Garantir que a atualização terminou
            }
        }
    }, 500000); 
}
