const xFiltroBtn = document.querySelector('.x-filtro');
const sidebar = document.querySelector('.sidebar');
const dias = document.querySelectorAll('.select-dia');
const meses = document.querySelectorAll('.select-mes');
const turno = document.querySelectorAll('.select-turno');
const linhaSelect = document.getElementById('linha-select');
const xSidebar = document.querySelector('.escondeu');
const filtroButton = document.querySelector('.filtros');
const recarregarFiltro = document.querySelector('.recarregar-filtro');
const btnRecarregar = document.querySelector('.reset-filtro');

// Função para obter o texto da linha selecionada
function obterTextoLinhaSelecionada() {
    const linhaSelecionada = linhaSelect?.value;
    const optionSelecionada = Array.from(linhaSelect.options).find(option => option.value === linhaSelecionada);
    return optionSelecionada ? optionSelecionada.textContent.trim() : 'Linha 05'; // Valor padrão
}

// Função para atualizar o texto dos filtros aplicados
function atualizarTextoFiltros() {
    const datapadrao = new Date();
    const defaultDiaID = String(datapadrao.getDate()).padStart(2, '0');
    const defaultMesID = String(datapadrao.getMonth() + 1).padStart(2, '0');
    const defaultTurnoID = '1° Turno';
    const diaSelecionado = document.querySelector('.select-dia.selecionado')?.textContent.trim() || defaultDiaID;
    const mesSelecionado = document.querySelector('.select-mes.selecionado')?.textContent.trim() || defaultMesID;
    const mesSelecionadoSeg = document.querySelector('.select-mes.selecionado')?.textContent.trim() || defaultMesID;
    const mesSelecionadoQua = document.querySelector('.select-mes.selecionado')?.textContent.trim() || defaultMesID;
    const turnoSelecionado = document.querySelector('.select-turno.selecionado')?.textContent.trim() || defaultTurnoID;
    const linhaSelecionadaTexto = obterTextoLinhaSelecionada();
    const anoSelecionado = datapadrao.getFullYear(); // Pode ser dinâmico se necessário

    document.querySelector('.linha-rot-filtro .strong-rot-titulo').textContent = linhaSelecionadaTexto;
    document.querySelector('.turno-rot-filtro .strong-rot-titulo').textContent = turnoSelecionado;
    document.querySelector('.dia-rot-filtro .strong-rot-titulo').textContent = diaSelecionado;
    document.querySelector('.mes-rot-filtro .strong-rot-titulo').textContent = mesSelecionado;
    document.querySelector('.mes-rot-titulo-seg').textContent = mesSelecionadoSeg;
    document.querySelector('.mes-rot-titulo-qua').textContent = mesSelecionadoQua;
    document.querySelector('.ano-rot-filtro .strong-rot-titulo').textContent = anoSelecionado;
}

// Adicionar eventos aos botões de dia
dias.forEach(dia => {
    dia.addEventListener('click', () => {
        dias.forEach(btn => btn.classList.remove('selecionado'));
        dia.classList.add('selecionado');
        atualizarTextoFiltros();  // Atualiza os filtros após seleção
    });
});

// Adicionar eventos aos botões de mês
meses.forEach(mes => {
    mes.addEventListener('click', () => {
        meses.forEach(btn => btn.classList.remove('selecionado'));
        mes.classList.add('selecionado');
        atualizarTextoFiltros();  // Atualiza os filtros após seleção
    });
});

// Adicionar eventos aos botões de turno
turno.forEach(turnos => {
    turnos.addEventListener('click', () => {
        turno.forEach(btn => btn.classList.remove('selecionado'));
        turnos.classList.add('selecionado');
        atualizarTextoFiltros();  // Atualiza os filtros após seleção
    });
});

// Adicionar evento de clique ao botão de filtro
filtroButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');

    if (xSidebar.classList.contains('escondeu')) {
        xSidebar.classList.remove('escondeu');
        xSidebar.classList.add('linha-x');
    }
});

// Fechar a sidebar ao clicar fora
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !filtroButton.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Adicionar evento de clique ao botão de filtro x
xFiltroBtn.addEventListener('click', () => {
    if (xSidebar.classList.contains('linha-x')) {
        xSidebar.classList.toggle('escondeu');
    }

    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Evento de clique no botão de recarregar
btnRecarregar.addEventListener('click', () => {
    // Acionar a animação de reset
    recarregarFiltro.classList.add('rodar-recarregar');

    // Após a animação terminar, remover a classe de animação
    recarregarFiltro.addEventListener('animationend', () => {
        recarregarFiltro.classList.remove('rodar-recarregar');
    });

    // Definir valores padrão
    const datapadrao = new Date();
    const defaultDiaID = String(datapadrao.getDate()).padStart(2, '0');
    const defaultMesID = String(datapadrao.getMonth() + 1).padStart(2, '0');
    const defaultTurnoID = '1';
    const defaultLinhaID = '101';

    // Limpar seleções dos filtros
    turno.forEach(btn => btn.classList.remove('selecionado', 'selected'));
    meses.forEach(btn => btn.classList.remove('selecionado', 'selected'));
    dias.forEach(btn => btn.classList.remove('selecionado', 'selected'));

    // Aplicar seleções padrões
    const defaultDiaElement = document.getElementById(defaultDiaID);
    if (defaultDiaElement) {
        defaultDiaElement.classList.add('selecionado');
    }

    const defaultMesElement = document.getElementById(defaultMesID);
    if (defaultMesElement) {
        defaultMesElement.classList.add('selecionado');
    }

    const defaultTurnoElement = document.querySelector(`#turno-buttons button[data-shift="${defaultTurnoID}"]`);
    if (defaultTurnoElement) {
        defaultTurnoElement.classList.add('selected');
    }

    if (linhaSelect) {
        linhaSelect.value = defaultLinhaID;
    }

    atualizarTextoFiltros();  // Atualiza os filtros após reset
    carregarDadosEAtualizarPagina(defaultLinhaID, defaultTurnoID, defaultMesID, defaultDiaID);
});
