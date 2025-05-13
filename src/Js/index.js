// Função para expandir o iframe
function expandirIframe(id) {
    var iframe = document.getElementById(id);
    var botaoExpandir = iframe.nextElementSibling; // Botão expandir próximo ao iframe
    var botaoVoltar = botaoExpandir.nextElementSibling; // Botão voltar próximo ao botão expandir

    // Exibe o iframe em tela cheia
    iframe.style.display = 'block';

    // Adiciona classe para tornar o iframe fullscreen
    iframe.classList.add('fullscreen');

    // Esconde o botão de expandir
    botaoExpandir.style.display = 'none';

    // Exibe o botão de voltar
    botaoVoltar.style.display = 'inline-flex';
}

// Função para voltar ao tamanho original
function voltarTelaCheia(id) {
    var iframe = document.getElementById(id);
    var botaoExpandir = iframe.nextElementSibling; // Botão expandir próximo ao iframe
    var botaoVoltar = botaoExpandir.nextElementSibling; // Botão voltar próximo ao botão expandir

    // Esconde o iframe
    iframe.style.display = 'none';

    // Remove a classe fullscreen do iframe
    iframe.classList.remove('fullscreen');

    // Exibe o botão de expandir
    botaoExpandir.style.display = 'block';

    // Esconde o botão de voltar
    botaoVoltar.style.display = 'none';
}

// Função para esconder outros iframes em tela cheia
function esconderOutrosIframes(idAtual) {
    var iframes = document.querySelectorAll('.tamanho-iframe');

    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        var iframeId = iframe.id;

        if (iframeId !== idAtual && iframe.classList.contains('fullscreen')) {
            // Esconde o iframe que não é o atual
            iframe.style.display = 'none';

            // Remove a classe fullscreen dos iframes que não são o atual
            iframe.classList.remove('fullscreen');

            // Esconde o botão de voltar
            var botaoExpandir = iframe.nextElementSibling;
            var botaoVoltar = botaoExpandir.nextElementSibling;
            botaoVoltar.style.display = 'none';

            // Exibe o botão de expandir
            botaoExpandir.style.display = 'block';
        }
    }
}
