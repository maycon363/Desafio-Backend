const Order = require('../models/Order');

function mapOrderData(originalData) {
    if (!originalData.numeroPedido || !originalData.valorTotal || !originalData.dataCriacao || !originalData.items) {
        throw new Error("Dados de pedido incompletos para mapeamento.");
    }
    
    const orderId = originalData.numeroPedido.split('-')[0];

    const mappedItems = originalData.items.map(item => ({
        productId: parseInt(item.idItem), 
        quantity: item.quantidadeItem,
        price: item.valorItem
    }));

    return {
        orderId: orderId,
        value: originalData.valorTotal,
        creationDate: new Date(originalData.dataCriacao),
        items: mappedItems
    };
}

exports.createOrder = async (req, res) => {
    try {
        const mappedData = mapOrderData(req.body);

        const newOrder = new Order(mappedData);
        await newOrder.save();

        res.status(201).json(newOrder);

    } catch (error) {
        if (error.code === 11000) { 
             return res.status(409).json({ message: "Erro: O número de pedido já existe." });
        }
        res.status(400).json({ message: "Erro ao criar pedido.", details: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar pedido.", details: error.message });
    }
};

exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.find().limit(50); 
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar pedidos.", details: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Pedido não encontrado para atualização." });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar pedido.", details: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const result = await Order.deleteOne({ orderId: req.params.orderId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Pedido não encontrado para exclusão." });
        }
        
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar pedido.", details: error.message });
    }
};