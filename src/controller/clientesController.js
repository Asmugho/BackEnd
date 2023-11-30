const db = require('../../config/db');

// Listar Clientes
function list(req, res) {
  db.query('SELECT * FROM clientes ORDER BY id', (err, result) => {
    if (err) {
      console.error('Erro na consulta:', err);
      res.status(500).send('Erro interno no servidor');
    } else {
      let response = result.rows
      let clienteFormatado
      let formattedResponse = []

      response.forEach((cliente) => {
        clienteFormatado = {
          id: cliente.id,
          nome: cliente.nome,
          logradouro: cliente.logradouro,
          apt: cliente.apt,
          torre: cliente.torre,
          descricao: `${cliente.id} - ${cliente.nome}`
        };
        formattedResponse.push(clienteFormatado)
      });

      res.json(formattedResponse);
    }
  });
}

// Criar Cliente
async function newCliente(req, res) {
  let { id, nome, logradouro, apt, torre } = req;

  const result = await db.query(
    `
    INSERT INTO clientes (nome, logradouro, apt, torre)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
    `,
    [nome, logradouro, apt, torre]
  );
  res.status(200).send('Transação Completa');
}

// Atualizar Cliente
async function updateCliente(req, res) {
  try {
    let { id, nome, logradouro, apt, torre } = req;

    // Atualiza os dados do cliente
    await db.query(
      `
      UPDATE clientes
      SET nome = $1, logradouro = $2, apt = $3, torre = $4
      WHERE id = $5;
      `,
      [nome, logradouro, apt, torre, id]
    );

  } catch (error) {
    console.error('Erro na atualização do cliente:', error);
    res.status(500).send('Erro interno no servidor');
  }
  res.status(200).send('Transação Completa');
}

// Deletar Cliente
async function delCliente(req, res) {
  try {
    await db.query(
      `
      DELETE FROM clientes
      WHERE id = $1;
      `,
      [req.id]
    );

    // Você pode adicionar mais lógica aqui conforme necessário

  } catch (error) {
    console.error('Erro na exclusão do cliente:', error);
    res.status(500).send('Erro interno no servidor');
  }
  res.status(200).send('Transação Completa');
}

module.exports = {
  list,
  newCliente,
  updateCliente,
  delCliente,
};
