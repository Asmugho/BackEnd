const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/router'); // Certifique-se de que o caminho está correto
const cors = require('cors');

// Configuração do CORS
app.use(cors());

// Middleware para processar dados JSON nas requisições
app.use(express.json());

// Rota padrão
app.get('/', (req, res) => {
  res.send('Bem-vindo ao seu servidor Node.js!');
});

// Rotas de dados
app.use('/', routes);

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});