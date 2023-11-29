// clientesController.js
const db = require('../../config/db');

// FUNÇÃO LIST PARA TRAZER TODOS OS CLIENTES
function list(req, res) {
    db.query('SELECT * FROM clientes ORDER BY id ASC', (err, result) => {
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

// FUNÇÃO SAVE PARA SALVAR UM NOVO CLIENTE NO BANCO DE DADOS
function save(req) {
    console.log(req)
//   db.query('SELECT * FROM clientes', (err, result) => {
//     if (err) {
//       console.error('Erro na consulta:', err);
//       res.status(500).send('Erro interno no servidor');
//     } else {
//       res.json(result.rows);
//         // return res.json(result.rows);
//     }
//   });
}

// FUNÇÃO UPDATE PARA EDITAR UM CLIENTE NO BANCO DE DADOS
function update(req, res) {
    console.log(req)
//   db.query('SELECT * FROM clientes', (err, result) => {
//     if (err) {
//       console.error('Erro na consulta:', err);
//       res.status(500).send('Erro interno no servidor');
//     } else {
//       res.json(result.rows);
//         // return res.json(result.rows);
//     }
//   });
}

// Outras funções relacionadas ao banco de dados podem ser adicionadas aqui

// Exporte as funções para uso em outros módulos
module.exports = {
  list,
  save,
  update,
};
