const express = require('express');
const router = express.Router();

const cliente = require('./controller/clientesController');
const pedido = require('./controller/pedidosController');
const produto = require('./controller/produtosController');
const forpgto = require('./controller/forpgtosController');

// MIDLEWARE
router.use(express.json());

// CLIENTES
router.get('/listClientes', cliente.list);
router.post('/saveCliente', req => { cliente.save(req.body) });
router.post('/updateCliente', req => { cliente.update(req.body) });

// PEDIDOS
router.get('/listPedidos', pedido.list);
router.post('/updatePedido', req => { pedido.updatePedido(req.body) });
router.post('/newPedido', req => { pedido.newPedido(req.body) });
router.post('/delPedido', req => { pedido.delPedido(req.body) });

// PRODUTOS
router.get('/listProdutos', produto.list);
router.post('/updateProduto', req => { produto.updateProduto(req.body) });
router.post('/newProduto', req => { produto.newProduto(req.body) });
router.post('/delProduto', req => { produto.delProduto(req.body) });

// FORPGTO
router.get('/listForPgtos', forpgto.list);

// EXPORTANDO O ROUTER
module.exports = router;