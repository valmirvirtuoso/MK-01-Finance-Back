import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/mko1-finance';

mongoose.connect(DB_URI)
    .then(() => {
        console.log('✅ Conectado ao Banco de dados');
        app.listen(PORT, () => console.log(`🚀 Servidor lançado na porta ${PORT}`));
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    })