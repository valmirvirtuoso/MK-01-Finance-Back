import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth-routes.js';
import cardRoutes from './routes/card-routes.js';
import categoryRoutes from './routes/category-routes.js';
import transactionRoutes from './routes/transaction-routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//  Rotas
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);

export { app };