const db = require('../../config/db');

// Listar Formas de Pagamento
function list(req, res) {
  db.query('SELECT * FROM forpgto ORDER BY id', (err, result) => {
    if (err) {
      console.error('Erro na consulta:', err);
      res.status(500).send('Erro interno no servidor');
    } else {
      let response = result.rows
      let formaPagamentoFormatada
      let formattedResponse = []

      response.forEach((formaPagamento) => {
        formaPagamentoFormatada = {
          id: formaPagamento.id,
          nome: formaPagamento.nome,
          descricao: `${formaPagamento.id} - ${formaPagamento.nome}`
        };
        formattedResponse.push(formaPagamentoFormatada)
      });

      res.json(formattedResponse);
    }
  });
}

// Criar Forma de Pagamento
async function newForPgto(req, res) {
  let { id, nome } = req;

  const result = await db.query(
    `
    INSERT INTO forpgto (nome)
    VALUES ($1)
    RETURNING id;
    `,
    [nome]
  );
  res.status(200).send('Transação Completa');
}

// Atualizar Forma de Pagamento
async function updateForPgto(req, res) {
  try {
    let { id, nome } = req;

    // Atualiza os dados da forma de pagamento
    await db.query(
      `
      UPDATE forpgto
      SET nome = $1
      WHERE id = $2;
      `,
      [nome, id]
    );

    // Você pode adicionar mais lógica aqui conforme necessário

  } catch (error) {
    console.error('Erro na atualização da forma de pagamento:', error);
    res.status(500).send('Erro interno no servidor');
  }
  res.status(200).send('Transação Completa');
}

// Deletar Forma de Pagamento
async function delForPgto(req, res) {
  try {
    await db.query(
      `
      DELETE FROM forpgto
      WHERE id = $1;
      `,
      [req.id]
    );

    // Você pode adicionar mais lógica aqui conforme necessário

  } catch (error) {
    console.error('Erro na exclusão da forma de pagamento:', error);
    res.status(500).send('Erro interno no servidor');
  }
  res.status(200).send('Transação Completa');
}

module.exports = {
  list,
  newForPgto,
  updateForPgto,
  delForPgto,
};
