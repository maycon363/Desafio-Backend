require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Porta padrão 3000


app.use(express.json()); // Middleware para parsear JSON


mongoose.connect(process.env.MONGO_URI) // Conexão com MongoDB
    .then(() => console.log('MongoDB conectado com sucesso.'))
    .catch(err => {
        console.error('ERRO de conexão com MongoDB:', err);
        process.exit(1); 
    });

app.use('/order', orderRoutes); // Rotas de pedidos

// Middleware para lidar com rotas não encontradas


app.use((req, res) => {
    res.status(404).json({ message: 'Recurso não encontrado. Verifique a URL.' });
});


const API_BASE_URL = `http://localhost:${PORT}`; // URL base da API

app.listen(PORT, () => { // Inicia o servidor
    console.log(`Servidor rodando na porta ${PORT}`); // Log de inicialização
    console.log(`API de Pedidos disponível em: ${API_BASE_URL}/order/`); // Log da URL base
});