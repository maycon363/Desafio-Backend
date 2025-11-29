const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota OBRIGATÓRIA: Criar novo pedido (POST http://localhost:3000/order)
router.post('/', orderController.createOrder); // Criação de um novo pedido

// Rota: Listar todos os pedidos (GET http://localhost:3000/order/list)
router.get('/list', orderController.listOrders); // Listagem de todos os pedidos

// Rota OBRIGATÓRIA: Obter pedido por ID (GET http://localhost:3000/order/orderId)
router.get('/:orderId', orderController.getOrderById); // Obtenção de um pedido por ID

// Rota: Atualizar pedido por ID (PUT http://localhost:3000/order/orderId)
router.put('/:orderId', orderController.updateOrder); // Atualização de um pedido por ID

// Rota: Deletar pedido por ID (DELETE http://localhost:3000/order/orderId)
router.delete('/:orderId', orderController.deleteOrder); // Deleção de um pedido por ID

module.exports = router;