async function obterDadosTempo(id) {
    const url = 'http://10.109.132.159:20620/NewOEE';
    const headers = {
        'accept': '*/*',
        'ids': id,
        'from': '2024/01/01',
        'to': '2100/12/31',
        'includeNameField': 'true',
        'expandBy': 'Shift',
        'groupBy': 'Machine'
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
    return meses[nomeMes] || '01';
}


// Definir ano, mês e dia com base na data atual
const datapadrao = new Date();  // Data atual
const anoSelecionado = datapadrao.getFullYear();  // Ano atual (ex: 2024)
const mesSelecionado = String(datapadrao.getMonth() + 1).padStart(2, '0');  // Mês atual (formato "01", "02", ...)
const defaultMesID = mesSelecionado; // Definir o mês atual como o valor padrão
const defaultDiaID = String(datapadrao.getDate()).padStart(2, '0');  // Dia atual (formato "01", "02", ...)

// Função para carregar e atualizar a página com os dados mais recentes
async function carregarDadosEAtualizarPagina(id, shiftID, diaSelecionado = defaultDiaID, mesSelecionado = defaultMesID) {
    try {
        // Recarregar dados e atualizar o front-end com os novos valores
        const { oeeTotalMes, oeeTurnoAtual } = await obterOEECombinado(id, shiftID, anoSelecionado, mesSelecionado, diaSelecionado);

        // Atualize a interface com os dados de OEE
        console.log(`OEE Total do Mês: ${oeeTotalMes}`);
        console.log(`OEE Turno Atual: ${oeeTurnoAtual}`);
        
        // Atualiza a interface para o OEE do mês
        const divRowtem = document.querySelector('.row-tem');
        if (divRowtem) {
            divRowtem.style.border = oeeTotalMes < 85 ? '1px solid rgb(255, 0, 0)' : '1px solid rgb(0, 255, 0)';
        }
        const tem1 = document.getElementById('tem1');
        if (tem1) {
            tem1.innerHTML = `<section class="tem1-card"><p class="legenda-card">Mês: </p> ${oeeTotalMes !== null ? oeeTotalMes.toFixed(2) : '0.00'}%</section>`;
            // Verificar se o OEE do mês é menor que 85% e adicionar a classe 'tem1-card-ruim' ou 'tem1-card-bom'
            const tem1Card = tem1.querySelector('.tem1-card');
            if (tem1Card) {
                if (oeeTotalMes < 85) {
                    tem1Card.classList.add('tem1-card-ruim');
                    tem1Card.classList.remove('tem1-card-bom');
                    tem1Card.classList.remove('tem1-card');
                } else {
                    tem1Card.classList.add('tem1-card-bom');
                    tem1Card.classList.remove('tem1-card-ruim');
                    tem1Card.classList.remove('tem1-card');
                    
                }
            }
        }

        // Atualiza a interface para o OEE do turno atual
        const tem2 = document.getElementById('tem2');
        if (tem2) {
            tem2.innerHTML = `<section class="tem1-card"><p class="legenda-card">Turno Atual: </p> ${oeeTurnoAtual !== 0 ? oeeTurnoAtual.toFixed(2) : '0.00'}%</section>`;
            // Verificar se o OEE do turno atual é menor que 85% e adicionar a classe 'tem1-card-ruim' ou 'tem1-card-bom'
            const tem2Card = tem2.querySelector('.tem1-card');
            if (tem2Card) {
                if (oeeTurnoAtual < 85) {
                    tem2Card.classList.add('tem1-card-ruim');
                    tem2Card.classList.remove('tem1-card-bom');
                    tem2Card.classList.remove('tem1-card');
                } else {
                    tem2Card.classList.add('tem1-card-bom');
                    tem2Card.classList.remove('tem1-card-ruim');
                    tem2Card.classList.remove('tem1-card');
                }
            }
        }

    } catch (error) {
        console.error('Erro ao carregar e atualizar os dados:', error);
    }
}



// Função para obter OEE combinado (mês e turno atual)
async function obterOEECombinado(id, shiftID, anoSelecionado, mesSelecionado, diaSelecionado) {
    try {
        const dadosTempo = await obterDadosTempo(id);
        console.log('Dados do OEE:', dadosTempo);

        if (!dadosTempo || !dadosTempo.items || dadosTempo.items.length === 0) {
            throw new Error('Dados de tempo inválidos ou não disponíveis.');
        }

        let oeeTotalMes = null;
        let oeeTurnoAtual = null;

        for (const item of dadosTempo.items) {
            if (item.id === parseInt(id)) {
                const years = item.years.find(y => y.year === anoSelecionado);
                if (years && years.months) {
                    const month = years.months.find(m => m.month === parseInt(mesSelecionado));
                    if (month && month.total && month.total.oee) {
                        oeeTotalMes = month.total.oee;
                    }
                    if (month && month.dates) {
                        const oeeDiaAtual = month.dates.find(d => d.date.startsWith(`${anoSelecionado}-${mesSelecionado}-${diaSelecionado}`));
                        if (oeeDiaAtual && oeeDiaAtual.shifts) {
                            const turnoSelecionado = oeeDiaAtual.shifts.find(s => s.shiftID === parseInt(shiftID));
                            if (turnoSelecionado) {
                                oeeTurnoAtual = turnoSelecionado.oee;
                            }
                        }
                    }
                }
            }
        }

        return { oeeTotalMes, oeeTurnoAtual };

    } catch (error) {
        console.error('Erro ao obter OEE combinado:', error);
        return { oeeTotalMes: 0, oeeTurnoAtual: 0 };
    }
}

// Eventos para os botões e seleção
document.querySelectorAll('#turno-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const shiftID = button.getAttribute('data-shift');
        const linhaSelect = document.getElementById('linha-select');
        const id = linhaSelect.value;
        const diaSelecionado = document.querySelector('.select-dia.selected')?.id || defaultDiaID;
        const mesSelecionado = document.querySelector('.select-mes.selected')?.id || defaultMesID;

        // Atualizar a página ao selecionar um turno
        carregarDadosEAtualizarPagina(id, shiftID, diaSelecionado, mesSelecionado);
        setButtonSelected(document.querySelectorAll('#turno-buttons button'), shiftID, 'data-shift');
    });
});

document.getElementById('linha-select').addEventListener('change', () => {
    const turnoSelecionado = document.querySelector('#turno-buttons button.selected');
    const shiftID = turnoSelecionado ? turnoSelecionado.getAttribute('data-shift') : '1';
    const id = document.getElementById('linha-select').value;
    const diaSelecionado = document.querySelector('.select-dia.selected')?.id || defaultDiaID;
    const mesSelecionado = document.querySelector('.select-mes.selected')?.id || defaultMesID;
    carregarDadosEAtualizarPagina(id, shiftID, diaSelecionado, mesSelecionado);
});

document.querySelectorAll('.select-mes').forEach(button => {
    button.addEventListener('click', () => {
        const mesSelecionado = button.id;
        setButtonSelected(document.querySelectorAll('.select-mes'), mesSelecionado, 'id');
        const diaSelecionado = document.querySelector('.select-dia.selected')?.id || defaultDiaID;
        const shiftID = document.querySelector('#turno-buttons .selected')?.getAttribute('data-shift') || '1';
        const id = document.getElementById('linha-select').value;
        carregarDadosEAtualizarPagina(id, shiftID, diaSelecionado, mesSelecionado);
    });
});

document.querySelectorAll('.select-dia').forEach(button => {
    button.addEventListener('click', () => {
        const diaSelecionado = button.id;
        setButtonSelected(document.querySelectorAll('.select-dia'), diaSelecionado, 'id');
        const mesSelecionado = document.querySelector('.select-mes.selected')?.id || defaultMesID;
        const shiftID = document.querySelector('#turno-buttons .selected')?.getAttribute('data-shift') || '1';
        const id = document.getElementById('linha-select').value;
        carregarDadosEAtualizarPagina(id, shiftID, diaSelecionado, mesSelecionado);
    });
});

// Função para definir o botão selecionado
const setButtonSelected = (buttons, id, attribute = 'id') => {
    buttons.forEach(button => {
        button.classList.toggle('selected', button.getAttribute(attribute) === id);
    });
};

// Função de reset dos filtros
const resetFilters = () => {
    document.getElementById('linha-select').value = defaultLinhaID;
    setButtonSelected(document.querySelectorAll('#turno-buttons button'), defaultTurnoID, 'data-shift');
    setButtonSelected(document.querySelectorAll('.select-mes'), defaultMesID, 'id');
    setButtonSelected(document.querySelectorAll('.select-dia'), defaultDiaID, 'id');
    carregarDadosEAtualizarPagina(defaultLinhaID, defaultTurnoID, defaultDiaID, defaultMesID);
};

// Evento de reset
document.querySelector('.reset-filtro')?.addEventListener('click', resetFilters);

// Chamada inicial ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const linhaSelect = document.getElementById('linha-select');
    const id = linhaSelect.value;
    const turnoSelecionado = document.querySelector('#turno-buttons button.selected');
    const shiftID = turnoSelecionado ? turnoSelecionado.getAttribute('data-shift') : '1';
    const diaSelecionado = document.querySelector('.select-dia.selected')?.id || defaultDiaID;
    const mesSelecionado = document.querySelector('.select-mes.selected')?.id || defaultMesID;
    carregarDadosEAtualizarPagina(id, shiftID, diaSelecionado, mesSelecionado);
});
