// Variáveis globais do seletor de cores para o segundo calendário
const colorSelectorQua = document.getElementById('ColorSelectorQua');
let currentButtonIndexQua = -1; // Índice do botão atualmente selecionado
let isLockedQua = Array(31).fill(false); // Estado de travamento após seleção de cor
let colorCountsQua = {
    '#ff4d4d': 0,  // Vermelho
    '#e2b100': 0,  // Amarelo
    '#27e256': 0,  // Verde
};

// Função para atualizar o contador de cores no segundo calendário
function updateColorCountQua(color) {
    colorCountsQua[color]++;
    const countElement = document.getElementById(`contadorQua-${color.slice(1)}`);
    if (countElement) {
        countElement.textContent = colorCountsQua[color];
    }
}

// Função para alternar o seletor de cores no segundo calendário
function toggleColorSelectorQua(buttonIndex) {
    if (!isLockedQua[buttonIndex]) {
        if (currentButtonIndexQua !== buttonIndex) {
            colorSelectorQua.classList.remove('hidden');
            currentButtonIndexQua = buttonIndex;
        } else {
            colorSelectorQua.classList.toggle('hidden');
        }
    } else {
        // Se o botão estiver travado, abre o formulário
        toggleFormularioQua(buttonIndex);
    }
}

// Selecionar uma cor no seletor de cores no segundo calendário
colorSelectorQua.addEventListener('click', (event) => {
    if (event.target.classList.contains('color-option')) {
        const selectedColor = event.target.getAttribute('data-color');
        const button = document.getElementById(`diaQua${currentButtonIndexQua + 1}`);
        button.style.backgroundColor = selectedColor;
        isLockedQua[currentButtonIndexQua] = true; // Trava o botão após seleção de cor
        updateColorCountQua(selectedColor);
        colorSelectorQua.classList.add('hidden');
    }
});

// Configurar eventos nos botões de dia do segundo calendário
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 31; i++) {
        const diaButtonQua = document.getElementById(`diaQua${i}`);
        diaButtonQua.addEventListener('click', () => toggleColorSelectorQua(i - 1));
    }
});
