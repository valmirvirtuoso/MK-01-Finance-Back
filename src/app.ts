import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth-routes.js';
import cardRoutes from './routes/card-routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//  Rotas
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);

export { app };