const mongoose = require('mongoose'); // Importa o Mongoose

const itemSchema = new mongoose.Schema({ // Subdocumento para itens do pedido
    productId: { type: Number, required: true }, 
    quantity: { type: Number, required: true }, 
    price: { type: Number, required: true } 
});

const orderSchema = new mongoose.Schema({ // Esquema principal do pedido
    orderId: { type: String, required: true, unique: true }, 
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [itemSchema]
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema); // Exporta o modelo de Pedido