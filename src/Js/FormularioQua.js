// Variáveis globais do formulário para o segundo calendário
const formularioQua = document.getElementById('formularioQua');
const campoTextoQua = document.getElementById('campoTextoQua');
let formularioAbertoQua = Array(31).fill(false); // Controla se o formulário foi aberto para o dia específico
let formularioEditadoQua = Array(31).fill(false); // Controla se o formulário foi editado para o dia específico
let textoFormularioQua = Array(31).fill(''); // Armazena o texto de cada dia do segundo calendário
let corSelecionadaQua = Array(31).fill(false); // Controla se a cor foi selecionada para o dia específico

// Função para desabilitar os dias e habilitar os dias disponíveis ao carregar a página
function mostrarDisponibilidadeDias() {
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDate(); // Pega o dia do mês (1 a 31)

    // Loop para configurar cada botão de dia
    for (let i = 1; i <= 31; i++) {
        const diaButton = document.getElementById(`diaQua${i}`);

        // Verifica se o dia é o atual ou até 2 dias atrás
        const diaDisponivel = i >= diaAtual - 2 && i <= diaAtual;

        if (!diaDisponivel) {
            diaButton.disabled = true;
            diaButton.style.backgroundColor = '#e7e5e563'; // Aplica uma cor cinza para os dias não disponíveis
        } else {
            diaButton.disabled = false;

            if (i === diaAtual) {
                diaButton.style.border = '2px solid white'; // Destaca o botão do dia atual
            }

            diaButton.addEventListener('click', () => {
                if (diaButton.style.backgroundColor === 'rgb(39, 226, 86)') {
                    return; // Não faz nada se a cor do fundo for verde
                }
                if (corSelecionadaQua[i - 1]) { // Verifica se a cor foi selecionada
                    if (!formularioAbertoQua[i - 1]) {
                        // Abre o formulário e permite edição apenas se o formulário não foi editado
                        formularioQua.style.display = 'block';
                        campoTextoQua.disabled = formularioEditadoQua[i - 1]; // Se já foi editado, o campo será desabilitado
                        campoTextoQua.value = textoFormularioQua[i - 1]; // Preenche o campo de texto com o texto salvo, se houver
                        formularioAbertoQua[i - 1] = true; // Marca o formulário como aberto
                    } else {
                        // Fecha o formulário
                        formularioQua.style.display = 'none';
                        formularioAbertoQua[i - 1] = false; // Marca o formulário como fechado
                    }
                } 
            });
        }
    }
}


// Função para salvar o texto no formulário do segundo calendário
function salvarFormularioQua(buttonIndex) {
    const campoTexto = document.getElementById('campoTextoQua');
    if (campoTexto.value !== '') {
        // Salva o texto no array de textos
        textoFormularioQua[buttonIndex] = campoTexto.value;
        formularioEditadoQua[buttonIndex] = true; // Marca o formulário como editado
        formularioQua.style.display = 'none'; // Fecha o formulário
    } else {
        alert("Por favor, preencha o campo!");
    }
}

// Função para alternar o seletor de cores
function toggleColorSelectorQua(buttonIndex) {
    console.log('Abrindo seletor de cores para o dia: ' + (buttonIndex + 1)); // Log para saber se o seletor foi acionado
    currentButtonIndexQua = buttonIndex; // Armazena o índice do botão que foi clicado
    if (!corSelecionadaQua[buttonIndex]) {
        colorSelectorQua.classList.toggle('hidden'); // Mostra ou esconde o seletor de cores
    }
}

// Evento para alterar a cor do botão e marcar a seleção
colorSelectorQua.addEventListener('click', (event) => {
    if (event.target.classList.contains('color-option')) {
        const selectedColor = event.target.getAttribute('data-color');
        const button = document.getElementById(`diaQua${currentButtonIndexQua + 1}`);
        button.style.backgroundColor = selectedColor; // Altera a cor do botão
        corSelecionadaQua[currentButtonIndexQua] = true; // Marca como cor selecionada
        colorSelectorQua.classList.add('hidden'); // Fecha o seletor de cores
    }
});

// Inicializa os formulários e disponibilidades dos dias ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarDisponibilidadeDias(); // Chama essa função para garantir que os dias sejam configurados corretamente
});
