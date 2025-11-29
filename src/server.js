require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado com sucesso.'))
    .catch(err => {
        console.error('ERRO de conexão com MongoDB:', err);
        process.exit(1); 
    });

app.use('/order', orderRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Recurso não encontrado. Verifique a URL.' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Endpoints disponíveis em: http://localhost:${PORT}/order/`);
});