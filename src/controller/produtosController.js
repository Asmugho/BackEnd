// clientesController.js
const db = require('../../config/db');

// Exemplo de função que busca todos os clientes no banco de dados
function list(req, res) {
  db.query('SELECT * FROM produtos', (err, result) => {
    if (err) {
      console.error('Erro na consulta:', err);
      res.status(500).send('Erro interno no servidor');
    } else {
      let response = result.rows
      let produtoFormatado
      let formattedResponse = []

      response.forEach((produto) => {
        produtoFormatado = {
          id: produto.id,
          nomeproduto: produto.nomeproduto,
          descricao: `${produto.id} - ${produto.nomeproduto}`,
          valor: produto.valor,
          isativo: produto.isativo
        };
        formattedResponse.push(produtoFormatado)
      });

      res.json(formattedResponse);
    }
  });
}

// Outras funções relacionadas ao banco de dados podem ser adicionadas aqui

// Exporte as funções para uso em outros módulos
module.exports = {
  list,
  // Adicione outras funções aqui
};
