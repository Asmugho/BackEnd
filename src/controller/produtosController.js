const db = require('../../config/db');

// ############################################### LIST PRODUTO ################################################################
function list(req, res) {
  db.query('SELECT * FROM produtos ORDER BY id', (err, result) => {
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


// ############################################### CRIAR PRODUTO ################################################################
async function newProduto(req, res) {
  let { id, nomeproduto, valor, isativo } = req;

  const resultPedido = await db.query(
    `
    INSERT INTO produtos (nomeproduto, valor, isativo)
    VALUES ($1, $2, $3)
    RETURNING id;
    `,
    [nomeproduto, valor, isativo]
  );
  res.status(200).send('Transação Completa');
}


// ############################################### UPDATE PRODUTO ################################################################
async function updateProduto(req, res) {
  try {
    let { id, nomeproduto, valor, isativo } = req;
    console.log('aaaaa')

    // Atualiza os dados do pedido
    await db.query(
      `
      UPDATE produtos
      SET nomeproduto = $1, valor = $2, isativo = $3
      WHERE id = $4;
      `,
      [ nomeproduto, valor, isativo, id ]
    );

  } catch (error) {}
  res.status(200).send('Transação Completa');
}


// ############################################### DELETAR PRODUTO ################################################################
async function delProduto(req, res){
  await db.query(
    `
    DELETE FROM produtos
    WHERE id = $1;
    `,
    [req.id]
  )
  res.status(200).send('Transação Completa');
}

// Outras funções relacionadas ao banco de dados podem ser adicionadas aqui

// Exporte as funções para uso em outros módulos
module.exports = {
  list,
  newProduto,
  updateProduto,
  delProduto,
  // Adicione outras funções aqui
};
