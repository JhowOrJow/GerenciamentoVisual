// Arrays para controlar o estado de cada botão
let formularioAberto = Array(31).fill(false); // Para saber se o formulário está aberto para cada botão
let formularioEditado = Array(31).fill(false); // Para saber se o formulário foi editado para cada botão
let textoFormulario = Array(31).fill(''); // Para armazenar o texto de cada dia
let corSelecionada = Array(31).fill(false); // Para saber se a cor foi selecionada para cada botão

function mostrarFormulario() {
    const formulario = document.getElementById("formulario");
    const campoTexto = document.getElementById("campoTexto");

    // Obter a data atual
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDate(); // Pega o dia do mês (1 a 31)

    // Loop para adicionar evento de clique a cada botão (dia1, dia2, ..., dia31)
    for (let i = 1; i <= 31; i++) {
        const diaButton = document.getElementById(`dia${i}`);

        // Verifica se o dia é o atual ou até 2 dias atrás
        const diaDisponivel = i >= diaAtual - 2 && i <= diaAtual;

        // Se o dia não estiver disponível para edição, desabilita o botão (não faz nada ao clicar)
        if (!diaDisponivel) {
            diaButton.disabled = true;
            diaButton.style.backgroundColor = '#e7e5e563';
        } else {
            diaButton.disabled = false;

            if (i === diaAtual) {
                diaButton.style.border = '2px solid white'; // Cor da borda (exemplo: laranja)
            }

            // Evento de clique para abrir o formulário, apenas se a cor foi selecionada
            diaButton.addEventListener('click', () => {
                if (diaButton.style.backgroundColor === 'rgb(39, 226, 86)') {
                    return; // Não faz nada se a cor do fundo for verde
                }
                if (corSelecionada[i - 1] ) { // Verifica se a cor foi selecionada
                    if (!formularioAberto[i - 1]) {
                        // Abre o formulário e permite edição apenas se o formulário não foi editado
                        formulario.style.display = 'block';
                        campoTexto.disabled = formularioEditado[i - 1]; // Se já foi editado, o campo será desabilitado
                        campoTexto.value = textoFormulario[i - 1]; // Preenche o campo de texto com o texto salvo, se houver
                        formularioAberto[i - 1] = true; // Marca o formulário como aberto
                    } else {
                        // Fecha o formulário
                        formulario.style.display = 'none';
                        formularioAberto[i - 1] = false; // Marca o formulário como fechado
                    }
                } 
            });
        }
    }
}

// Função para salvar o texto do formulário
function salvarFormulario() {
    const campoTexto = document.getElementById('campoTexto');
    const index = getCurrentButtonIndex(); // Identifica qual botão está aberto

    if (campoTexto.value !== "") {
        // Salva o texto no array de textos
        textoFormulario[index] = campoTexto.value;
        formularioEditado[index] = true; // Marca como editado para o botão
        fecharFormulario(); // Fecha o formulário
    } else {
        alert("Por favor preencha esse campo!");
    }
}

// Função para fechar o formulário
function fecharFormulario() {
    const formulario = document.getElementById('formulario');
    formulario.style.display = 'none';
    formularioAberto.fill(false); // Fecha todos os formulários
}

// Função para obter o índice do botão atual com o formulário aberto
function getCurrentButtonIndex() {
    for (let i = 0; i < 31; i++) {
        if (formularioAberto[i]) {
            return i; // Retorna o índice do botão que está com o formulário aberto
        }
    }
    return -1; // Caso nenhum formulário esteja aberto
}

// Função para alternar o seletor de cores
function toggleColorSelector(buttonIndex) {
    currentButtonIndex = buttonIndex; // Armazena o índice do botão que foi clicado
    if (!corSelecionada[buttonIndex]) {
        colorSelector.classList.toggle('hidden'); // Mostra ou esconde o seletor de cores
    }
}

// Evento para alterar a cor do botão e marcar a seleção
colorSelector.addEventListener('click', (event) => {
    if (event.target.classList.contains('color-option')) {
        const selectedColor = event.target.getAttribute('data-color');
        const button = document.getElementById(`dia${currentButtonIndex + 1}`);
        button.style.backgroundColor = selectedColor; // Altera a cor do botão
        corSelecionada[currentButtonIndex] = true; // Marca como cor selecionada
        colorSelector.classList.add('hidden'); // Fecha o seletor de cores
    }
});

// Inicializa os formulários ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarFormulario();
});

