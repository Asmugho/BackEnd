const db = require('../../config/db');

// ############################################### LIST PEDIDO ################################################################
function list(req, res) {
  db.query(
    `
      SELECT
      p.id,
      p.pedhora,
      p.reshora,
      p.enthora,
      p.fk_cliente,
      p.valortotal,
      p.fk_forpgto,
      p.isentregue,
      p.ispago,
      c.nome AS cliente_nome,
      c.logradouro AS cliente_logradouro,
      c.apt AS cliente_apt,
      c.torre AS cliente_torre
      FROM pedidos p
      JOIN clientes c ON p.fk_cliente = c.id
      JOIN pedidoItens pi ON p.id = pi.fk_pedido
      GROUP BY p.id, c.nome, c.logradouro, c.apt, c.torre;
    `, (err, result) => {
      
    if (err) {
      console.error('Erro na consulta:', err);
      res.status(500).send('Erro interno no servidor');

    } else {
      let response = result.rows
      let pedidoFormatado
      let formattedResponse = []

      response.forEach((pedido) => {
        pedidoFormatado = {
          id: pedido.id,
          pedhora: pedido.pedhora,
          reshora: pedido.reshora,
          enthora: pedido.enthora,
          fk_cliente: pedido.fk_cliente,
          valortotal: pedido.valortotal,
          fk_forpgto: pedido.fk_forpgto,
          isentregue: pedido.isentregue,
          ispago: pedido.ispago,
          cliente: {
            nome: pedido.cliente_nome,
            logradouro: pedido.cliente_logradouro,
            apt: pedido.cliente_apt,
            torre: pedido.cliente_torre,
            descricao: `${pedido.fk_cliente} - ${pedido.cliente_nome}`
          },
          pedidoItens: []
        };
        
        db.query(
          `
            SELECT
              pi.fk_produto,
              pi.obs,
              pr.nomeproduto,
              pr.valor
            FROM pedidoItens pi
            JOIN produtos pr ON pi.fk_produto = pr.id
            WHERE pi.fk_pedido = $1;
          `,
          [pedido.id],
          (err, result) => {
            if (err) {}
            else {
              result.rows.forEach((item) => {
                item.descricao = `${item.fk_produto} - ${item.nomeproduto}`
                pedidoFormatado.pedidoItens.push(item)
              })
            }
            formattedResponse.push(pedidoFormatado)
            res.json(formattedResponse);
          }
        );
          
      });

    }
  });
}


// ############################################### CRIAR PEDIDO ################################################################
async function newPedido(req, res) {
  let { id, pedhora, reshora, enthora, fk_cliente, fk_forpgto, isentregue, ispago, pedidoItens } = req;

  const valtot = await calcularValorTotalPedido(pedidoItens)

  pedhora = pedhora != '' ? pedhora : null
  reshora = reshora != '' ? reshora : null
  enthora = enthora != '' ? enthora : null

  const resultPedido = await db.query(
    `
    INSERT INTO pedidos (pedhora, reshora, enthora, fk_cliente, valortotal, fk_forpgto, isentregue, ispago)
    VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
    `,
    [reshora, enthora, fk_cliente, valtot, fk_forpgto, isentregue, ispago]
  );

  const pedidoId = resultPedido.rows[0].id

  pedidoItens.forEach((item) => {
    db.query(
      `
      INSERT INTO pedidoitens (fk_produto, fk_pedido, obs)
      VALUES ($1, $2, $3);
      `,
      [item.fk_produto, pedidoId, item.obs]
    );
  })
}

 
// ############################################### UPDATE PEDIDO ################################################################
async function updatePedido(req, res) {
  try {
    let { id, pedhora, reshora, enthora, fk_cliente, fk_forpgto, isentregue, ispago, pedidoItens } = req;

    const valtot = await calcularValorTotalPedido(pedidoItens)

    pedhora = pedhora !== '' ? pedhora : null;
    reshora = reshora !== '' ? reshora : null;
    enthora = enthora !== '' ? enthora : null;

    // Atualiza os dados do pedido
    await db.query(
      `
      UPDATE pedidos
      SET pedhora = $1, reshora = $2, enthora = $3, fk_cliente = $4, valortotal = $5, fk_forpgto = $6, isentregue = $7, ispago = $8
      WHERE id = $9;
      `,
      [pedhora, reshora, enthora, fk_cliente, valtot, fk_forpgto, isentregue, ispago, id]
    );

    // Exclui os itens antigos associados ao pedido
    await db.query(
      `
      DELETE FROM pedidoitens
      WHERE fk_pedido = $1;
      `,
      [id]
    );

    // Insere os novos itens associados ao pedido
    for (const item of pedidoItens) {
      await db.query(
        `
        INSERT INTO pedidoitens (fk_produto, fk_pedido, obs)
        VALUES ($1, $2, $3);
        `,
        [item.fk_produto, id, item.obs]
      );
    }
  } catch (error) {}
}


async function delPedido(req, res){
  await db.query(
    `
    DELETE FROM pedidoItens
    WHERE fk_pedido = $1;
    `,
    [req.id]
  )

  db.query(
    `
    DELETE FROM pedidos
    WHERE id = $1;
    `,
    [req.id]
  )
}

async function calcularValorTotalPedido(pedidoItens) {
  try {
    // Mapeia os IDs dos produtos no pedidoItens
    const produtosIds = pedidoItens.map((item) => item.fk_produto);

    // Consulta os preços dos produtos no banco de dados
    const query = `
      SELECT id, valor FROM produtos
      WHERE id IN (${produtosIds.join(',')});
    `;
    const { rows: produtos } = await db.query(query);

    // Mapeia os preços dos produtos em um objeto com ID como chave
    const precosProdutos = produtos.reduce((acc, produto) => {
      acc[produto.id] = produto.valor;
      return acc;
    }, {});

    // Calcula o valor total do pedido com base nos preços dos produtos
    const valorTotal = pedidoItens.reduce((total, item) => {
      const precoProduto = precosProdutos[item.fk_produto] || 0;
      return total + precoProduto;
    }, 0);

    return valorTotal;
  }catch{}
}

// Exporte as funções para uso em outros módulos
module.exports = {
  list,
  newPedido,
  updatePedido,
  delPedido,
  // Adicione outras funções aqui
};
