const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota OBRIGATÓRIA: Criar novo pedido (POST http://localhost:3000/order)
router.post('/', orderController.createOrder);

// Rota: Listar todos os pedidos (GET http://localhost:3000/order/list)
router.get('/list', orderController.listOrders); 

// Rota OBRIGATÓRIA: Obter pedido por ID (GET http://localhost:3000/order/orderId)
router.get('/:orderId', orderController.getOrderById); 

// Rota: Atualizar pedido por ID (PUT http://localhost:3000/order/orderId)
router.put('/:orderId', orderController.updateOrder);

// Rota: Deletar pedido por ID (DELETE http://localhost:3000/order/orderId)
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;