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
router.post('/updateCliente', (req, res) => { cliente.updateCliente(req.body, res) });
router.post('/newCliente', (req, res) => { cliente.newCliente(req.body, res) });
router.post('/delCliente', (req, res) => { cliente.delCliente(req.body, res) });

// PEDIDOS
router.get('/listPedidos', (req, res)  => { pedido.list(req, res) });
router.post('/updatePedido', (req, res)  => { pedido.updatePedido(req.body, res) });
router.post('/newPedido', (req, res)  => { pedido.newPedido(req.body, res) });
router.post('/delPedido', (req, res)  => { pedido.delPedido(req.body, res) });

// PRODUTOS
router.get('/listProdutos', produto.list);
router.post('/updateProduto', (req, res) => { produto.updateProduto(req.body, res) });
router.post('/newProduto', (req, res) => { produto.newProduto(req.body, res) });
router.post('/delProduto', (req, res) => { produto.delProduto(req.body, res) });

// FORPGTO
router.get('/listForPgtos', forpgto.list);
router.post('/updateForPgto', (req, res) => { forpgto.updateForPgto(req.body, res) });
router.post('/newForPgto', (req, res) => { forpgto.newForPgto(req.body, res) });
router.post('/delForPgto', (req, res) => { forpgto.delForPgto(req.body, res) });

// EXPORTANDO O ROUTER
module.exports = router;