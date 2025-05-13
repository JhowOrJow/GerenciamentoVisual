// Função para mostrar a seção selecionada e ocultar as outras
function showSection(sectionId) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('resetSection').style.display = 'none';
  document.getElementById(sectionId).style.display = 'block';
}

// Função para formatar CPF
function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length <= 11) {
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return cpf;
}

// Função para aplicar a formatação do CPF no input
function applyCPFFormatting(event) {
  const input = event.target;
  input.value = formatCPF(input.value);
}

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const response = await fetch('http://10.109.133.117:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();

    const loginStatus = document.getElementById('loginStatus');
    if (response.ok) {
      loginStatus.textContent = result.message || 'Login bem-sucedido!';
      loginStatus.className = 'status-message success';
      window.location.href = '/teste/html/Tela1.html';
    } else {
      loginStatus.textContent = result.error || 'Erro desconhecido';
      loginStatus.className = 'status-message error';
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    const loginStatus = document.getElementById('loginStatus');
    loginStatus.textContent = 'Erro ao fazer login.';
    loginStatus.className = 'status-message error';
  }
});

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nome = event.target.nome.value;
  const sobrenome = event.target.sobrenome.value;
  const cpf = formatCPF(event.target.cpf.value);
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const response = await fetch('http://10.109.133.117:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, sobrenome, cpf, email, password })
    });
    const result = await response.json();

    const registerStatus = document.getElementById('registerStatus');
    if (response.ok) {
      registerStatus.textContent = result.message || 'Cadastro realizado com sucesso!';
      registerStatus.className = 'status-message success';
      showSection('loginSection');
    } else {
      registerStatus.textContent = result.error || 'Erro desconhecido';
      registerStatus.className = 'status-message error';
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    const registerStatus = document.getElementById('registerStatus');
    registerStatus.textContent = 'Erro ao registrar.';
    registerStatus.className = 'status-message error';
  }
});


//REC

document.getElementById('resetPasswordForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const cpf = event.target.cpf.value;
  const newPassword = event.target.password.value;

  try {
      const response = await fetch('http://10.109.133.117:3000/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, cpf, newPassword })
      });

      // Verifique se a resposta é JSON
      const contentType = response.headers.get('content-type');
      console.log(contentType);
      let result;
      if (contentType && contentType.includes('application/json')) {
          const jsonText = await response.json(); // Obtenha a resposta JSON diretamente
          result = jsonText;
      } else {
          const text = await response.text(); // Caso contrário, obtenha o texto da resposta
          console.error('Resposta inesperada do servidor:', text);
          throw new Error('Resposta inesperada do servidor');
      }

      const resetStatus = document.getElementById('resetStatus');
      if (response.ok) {
          resetStatus.textContent = result.message || 'Senha atualizada com sucesso!';
          resetStatus.className = 'status-message success';
      } else {
          resetStatus.textContent = result.error || 'Erro desconhecido';
          resetStatus.className = 'status-message error';
      }
  } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      const resetStatus = document.getElementById('resetStatus');
      resetStatus.textContent = 'Erro ao recuperar senha.';
      resetStatus.className = 'status-message error';
  }
});



// Aplicar formatação do CPF enquanto o usuário digita
document.getElementById('registerCpf')?.addEventListener('input', applyCPFFormatting);
document.getElementById('resetCpf')?.addEventListener('input', applyCPFFormatting);

// Mostrar a seção de login por padrão
document.addEventListener('DOMContentLoaded', () => {
  showSection('loginSection');
});
