const Order = require('../models/Order'); 

function mapOrderData(originalData) { // Função para mapear os dados do pedido
    if (!originalData.numeroPedido || !originalData.valorTotal || !originalData.dataCriacao || !originalData.items) {
        throw new Error("Dados de pedido incompletos para mapeamento.");// Validação básica
    }
    
    const orderId = originalData.numeroPedido.split('-')[0];// Extração do orderId antes do hífen

    const mappedItems = originalData.items.map(item => ({
        productId: parseInt(item.idItem), // Conversão para Number
        quantity: item.quantidadeItem,
        price: item.valorItem // Conversão para Number
    }));

    return {
        orderId: orderId, // Usando o orderId extraído
        value: originalData.valorTotal, 
        creationDate: new Date(originalData.dataCriacao),// Conversão para Date
        items: mappedItems // Itens mapeados
    };
}

exports.createOrder = async (req, res) => {// Criação de um novo pedido
    try {
        const mappedData = mapOrderData(req.body);

        const newOrder = new Order(mappedData);
        await newOrder.save();

        res.status(201).json(newOrder);

    } catch (error) {// Tratamento de erro aprimorado
        if (error.code === 11000) { 
             return res.status(409).json({ message: "Erro: O número de pedido já existe." });
        }
        res.status(400).json({ message: "Erro ao criar pedido.", details: error.message });
    }
};

exports.getOrderById = async (req, res) => {// Obtenção de um pedido por ID
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }); // Busca pelo orderId

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado." });// Resposta se o pedido não for encontrado
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar pedido.", details: error.message });// Tratamento de erro aprimorado
    }
};

exports.listOrders = async (req, res) => { // Listagem de todos os pedidos
    try {
        const orders = await Order.find().limit(50); // Limite de 50 pedidos para evitar sobrecarga
        res.status(200).json(orders); // Resposta com a lista de pedidos
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar pedidos.", details: error.message }); // Tratamento de erro aprimorado
    }
};

exports.updateOrder = async (req, res) => { // Atualização de um pedido por ID
    try {
        const updatedOrder = await Order.findOneAndUpdate( // Busca pelo orderId
            { orderId: req.params.orderId }, // Filtro de busca
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Pedido não encontrado para atualização." });
        }

        res.status(200).json(updatedOrder); // Resposta com o pedido atualizado
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar pedido.", details: error.message });
    }
};

exports.deleteOrder = async (req, res) => { // Deleção de um pedido por ID
    try {
        const result = await Order.deleteOne({ orderId: req.params.orderId }); // Busca pelo orderId

        if (result.deletedCount === 0) { // Nenhum pedido deletado
            return res.status(404).json({ message: "Pedido não encontrado para exclusão." });
        }
        
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar pedido.", details: error.message });
    }
};