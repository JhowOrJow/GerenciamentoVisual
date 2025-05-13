var botao = document.querySelector('.teste');
const menuHamburguer = document.querySelector('.menu-hamburguer');
const hamburguer = document.querySelector('.hamburguer');
const imagemHamburguer = document.getElementById('img-hamburguer');
const linha1 = document.querySelector('.linha');
const linha2 = document.querySelector('.linha2');
const contato = document.querySelector('.contato-link');
const catContatos = document.querySelector('.contato-categorias');

botao.addEventListener('click', function() {
  if (imagemHamburguer.style.display === 'block') { 
    botao.style.color = 'rgb(0, 0, 0)';
    imagemHamburguer.style.display = 'none';
    linha1.style.display ='block'
    linha2.style.display ='block'
    linha1.style.animation = 'rot1 0.5s linear'
    linha2.style.animation ='rot2 0.5s linear'
    menuHamburguer.style.display = 'flex';
    hamburguer.style.animation = 'hamburguer-entrar 0.3s ease-in-out';
    botao.style.border = 'none';
    menuHamburguer.style.animation = 'none';
  } else { 
    /*botao.style.backgroundColor = 'rgba(0, 0, 0, 0)';*/
    imagemHamburguer.style.display = 'block'
    linha2.style.display ='none'
    linha1.style.display ='none'
    linha1.style.animation = 'none'
    linha2.style.animation = 'none'
    menuHamburguer.style.display = 'none';
    hamburguer.style.animation = 'none';
    botao.style.border = 'solid white 2px';
  }

});

contato.addEventListener('click', function(){
if (catContatos.style.display === 'none') {
    catContatos.style.display = 'flex'
}
else {
  catContatos.style.display = 'none';
}
});