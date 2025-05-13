const express = require('express');

const cors = require('cors');

const mysql = require('mysql2');

const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs'); // Para hashing de senhas
 
const app = express();
 
// Configurações do middleware

app.use(cors({

  origin: '*', // Permite requisições de qualquer origem. Ajuste conforme necessário.

}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
 
// Middleware para definir o cabeçalho Referrer-Policy

app.use((req, res, next) => {

  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();

});
 
// Configuração do banco de dados MySQL

const connection = mysql.createConnection({

  host: '10.109.133.99',

  user: 'root',

  password: '@Magna@2025',

  database: 'webtool',

  port: 3306,

});
 
// Função para conectar ao banco de dados

function connectToDatabase() {

  return new Promise((resolve, reject) => {

    connection.connect((err) => {

      if (err) {

        console.error('Erro ao conectar ao banco de dados:', err.stack);

        reject(err);

      } else {

        console.log('Conexão bem-sucedida ao banco de dados MySQL.');

        resolve();

      }

    });

  });

}
 
// Rota para dados da tabela `cruz_seguranca`

app.get('/dadosCruzSeguranca', (req, res) => {

  connection.query('SELECT * FROM cruz_seguranca', (err, results) => {

    if (err) {

      console.error('Erro ao buscar dados da tabela cruz_seguranca:', err);

      res.status(500).send('Erro ao buscar dados');

    } else {

      res.json(results);

    }

  });

});

app.get('/dadosQualidade', (req, res) => {

  connection.query('SELECT * FROM qualidade', (err, results) => {

    if (err) {

      console.error('Erro ao buscar dados da tabela seguranca:', err);

      res.status(500).send('Erro ao buscar dados');

    } else {

      res.json(results);

    }

  });

});
 

app.get('/dadosSeguranca', (req, res) => {

  connection.query('SELECT * FROM seguranca', (err, results) => {

    if (err) {

      console.error('Erro ao buscar dados da tabela seguranca:', err);

      res.status(500).send('Erro ao buscar dados');

    } else {

      res.json(results);

    }

  });

});
 
// Rota para dados da tabela `triangulo_da_qualidade`

app.get('/dadosTrianguloQualidade', (req, res) => {

  connection.query('SELECT * FROM triangulo_da_qualidade', (err, results) => {

    if (err) {

      console.error('Erro ao buscar dados da tabela triangulo_da_qualidade:', err);

      res.status(500).send('Erro ao buscar dados');

    } else {

      res.json(results);

    }

  });

});
 
// Rota para dados da tabela `usuarios`

app.get('/usuarios', (req, res) => {

  connection.query('SELECT * FROM usuarios', (err, results) => {

    if (err) {

      console.error('Erro ao buscar dados da tabela usuarios:', err);

      res.status(500).send('Erro ao buscar dados');

    } else {

      res.json(results);

    }

  });

});
 
// Rota para logar usuários

app.post('/login', (req, res) => {

  const { email, password } = req.body;

  connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {

    if (err) {

      console.error('Erro ao buscar usuário:', err);

      return res.status(500).json({ error: 'Erro ao buscar usuário' });

    }

    if (results.length === 0) {

      return res.status(401).json({ error: 'Usuário não encontrado' });

    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {

      if (err) {

        console.error('Erro ao comparar senha:', err);

        return res.status(500).json({ error: 'Erro ao autenticar' });

      }

      if (isMatch) {

        return res.json({ message: 'Login bem-sucedido' });

      } else {

        return res.status(401).json({ error: 'Senha incorreta' });

      }

    });

  });

});
 
// Rota para registrar novos usuários

app.post('/register', (req, res) => {

  const { nome, sobrenome, cpf, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {

    if (err) {

      console.error('Erro ao hashear senha:', err);

      return res.status(500).json({ error: 'Erro ao registrar usuário' });

    }

    const dataCadastro = new Date();

    const query = 'INSERT INTO usuarios (nome, sobrenome, cpf, email, password_hash, data_cadastro, data_modificação) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const values = [nome, sobrenome, cpf, email, hashedPassword, dataCadastro, dataCadastro];
 
    // Log da consulta para verificar

    console.log('Executando query:', query);

    console.log('Com valores:', values);
 
    connection.query(query, values, (err, results) => {

      if (err) {

        console.error('Erro ao registrar usuário:', err);

        return res.status(500).json({ error: 'Erro ao registrar usuário' });

      }

      return res.json({ message: 'Usuário registrado com sucesso' });

    });

  });

});
 
// Rota para recuperação de senha

app.post('/reset-password', (req, res) => {

  const { email, cpf, newPassword } = req.body;
 
  // Verifique se todos os dados foram fornecidos

  if (!email || !cpf || !newPassword) {

    return res.status(400).json({ error: 'Dados incompletos' });

  }
 
  // Hasheie a nova senha

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {

    if (err) {

      console.error('Erro ao hashear nova senha:', err);

      return res.status(500).json({ error: 'Erro ao processar nova senha' });

    }
 
    // Verifique se o usuário existe

    connection.query('SELECT * FROM usuarios WHERE email = ? AND cpf = ?', [email, cpf], (err, results) => {

      if (err) {

        console.error('Erro ao buscar usuário:', err);

        return res.status(500).json({ error: 'Erro ao buscar usuário' });

      }

      if (results.length === 0) {

        return res.status(404).json({ error: 'Usuário não encontrado' });

      }
 
      const user = results[0];

      const oldPasswordHash = user.password_hash; // Guardar a senha antiga em hash

      const dataModificacao = new Date(); // Nova data de modificação
 
      // Atualize a senha no banco de dados

      connection.query(

        'UPDATE usuarios SET password_hash = ?, data_modificação = ? WHERE email = ? AND cpf = ?',

        [hashedPassword, dataModificacao, email, cpf],

        (err, results) => {

          if (err) {

            console.error('Erro ao atualizar senha:', err);

            return res.status(500).json({ error: 'Erro ao atualizar senha' });

          }

          return res.json({ message: 'Senha atualizada com sucesso' });

        }

      );

    });

  });

});
 
// Configura a porta e inicializa o servidor

const port = 3000;

connectToDatabase()

  .then(() => {

    // Inicializa o servidor para ouvir em todas as interfaces de rede

    app.listen(port, '0.0.0.0', () => {

      console.log(`Servidor iniciado na porta ${port}`);

    });

  })

  .catch(err => {

    console.error('Erro ao iniciar o servidor:', err);

  });

 