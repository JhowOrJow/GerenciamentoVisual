// Variável para armazenar o tipo de situação (acidente, quase-acidente, etc.)
let tipoSituacao = '';

// Selecione todos os dias do calendário e a legenda
const dias = document.querySelectorAll('.calendario .dias button');
const legendaItems = document.querySelectorAll('.calendario .legenda button');

// Adiciona evento de clique para cada dia do calendário
dias.forEach(dia => {
    dia.addEventListener('click', () => {
        // Remove a classe "selecionado" de todos os dias
        dias.forEach(d => d.classList.remove('selecionado'));
        
        // Marca o dia clicado como selecionado
        dia.classList.add('selecionado');
        console.log(`Dia ${dia.textContent} selecionado.`); // Log do dia selecionado
    });
});

// Adiciona evento de clique para cada item da legenda
legendaItems.forEach(item => {
    item.addEventListener('click', () => {
        // Verifica se há um dia selecionado
        const diaSelecionado = document.querySelector('.calendario .dias button.selecionado');
        
        // Se um dia estiver selecionado, aplica a cor da situação
        if (diaSelecionado) {
            console.log(`Situação selecionada: ${item.classList[0]}`); // Log da situação selecionada
            
            // Remove qualquer cor anterior
            diaSelecionado.classList.remove('acidente', 'quase-acidente', 'incidente', 'situacao-risco');
            
            // Adiciona a classe da situação selecionada
            tipoSituacao = item.classList[0];
            diaSelecionado.classList.add(tipoSituacao);
            console.log(`Cor "${tipoSituacao}" aplicada ao dia ${diaSelecionado.textContent}.`); // Log da cor aplicada
        } else {
            console.log('Nenhum dia selecionado.'); // Log caso nenhum dia seja selecionado
        }
    });
});

// Função para enviar os dados (se necessário, conforme seu fluxo posterior)
document.getElementById('enviar-button').addEventListener('click', () => {
    const diaSelecionado = document.querySelector('.calendario .dias button.selecionado');
    const situacaoSelecionada = tipoSituacao;
    
    if (diaSelecionado && situacaoSelecionada) {
        console.log(`Enviando dados: Dia ${diaSelecionado.textContent}, Situação: "${situacaoSelecionada}".`); // Log do envio
        alert(`Dia ${diaSelecionado.textContent} marcado como "${situacaoSelecionada}".`);
    } else {
        console.log('Erro: Nenhum dia ou situação selecionada.'); // Log de erro
        alert('Selecione um dia e uma situação.');
    }
});
