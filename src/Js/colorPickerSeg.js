// Variáveis globais do seletor de cores
const colorSelector = document.getElementById('colorSelector');
let currentButtonIndex = -1; // Índice do botão atualmente selecionado
let isLocked = Array(31).fill(false); // Estado de travamento após seleção de cor
let colorCounts = {
    '#ff4d4d': 0,  // Vermelho
    '#e2b100': 0,  // Amarelo
    '#343a40': 0,  // Cinza
    '#4e73df': 0,  // Azul
    '#27e256': 0   // Verde
};

// Função para atualizar o contador de cores no frontend
function updateColorCount(color) {
    colorCounts[color]++;
    const countElement = document.getElementById(`contador-${color.slice(1)}`);
    countElement.textContent = colorCounts[color];
}

// Função para alternar o seletor de cores
function toggleColorSelector(buttonIndex) {
    if (!isLocked[buttonIndex]) {
        if (currentButtonIndex !== buttonIndex) {
            colorSelector.classList.remove('hidden');
            currentButtonIndex = buttonIndex;
        } else {
            colorSelector.classList.toggle('hidden');
        }
    } else {
        toggleFormulario(buttonIndex); // Se o botão estiver travado, abre o formulário
    }
}

// Selecionar uma cor no seletor
colorSelector.addEventListener('click', (event) => {
    if (event.target.classList.contains('color-option')) {
        const selectedColor = event.target.getAttribute('data-color');
        const button = document.getElementById(`dia${currentButtonIndex + 1}`);
        button.style.backgroundColor = selectedColor;
        isLocked[currentButtonIndex] = true; // Trava o botão após seleção de cor
        updateColorCount(selectedColor);
        colorSelector.classList.add('hidden');
    }
});

// Configurar eventos nos botões de dia
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 31; i++) {
        const diaButton = document.getElementById(`dia${i}`);
        diaButton.addEventListener('click', () => toggleColorSelector(i - 1));
    }
});
