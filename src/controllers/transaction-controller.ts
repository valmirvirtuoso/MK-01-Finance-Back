import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware.js";
import { TransactionService } from "../services/transaction-service.js";

const transactionService = new TransactionService();

export async function create(req: AuthRequest, res: Response) {
    try {
        const transaction = await transactionService.create(req.body, req.userId!);
        res.status(201).json(transaction);
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
} 

export async function list(req: AuthRequest, res: Response) {
    try {
        const userId = req.userId!;
        const { startDate, endDate, categoryId, description } = req.query;

        const filters: any = {};

        // Filtro por Período
        if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.$gte = new Date(startDate as string);
        if (endDate) filters.date.$lte = new Date(endDate as string);
        }

        // Filtro por Categoria
        if (categoryId) {
        filters.categoryId = categoryId;
        }

        // Filtro por Descrição (Busca "contém" e Case Insensitive)
        if (description) {
        filters.description = { $regex: description, $options: 'i' };
        }

        const transactions = await transactionService.getAll(userId, filters);
        res.status(200).json(transactions);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
} 

export async function update(req: AuthRequest, res: Response) {
    try {
        const transaction = await transactionService.update(req.params.transactionId.toString(), req.userId!, req.body);
        res.status(200).json(transaction);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

export async function remove(req: AuthRequest, res: Response) {
    try {
        const { transactionId } = req.params;

        // query param para decidir se deleta todas as parcelas ou só uma
        const { all } = req.query;

        await transactionService.delete(transactionId.toString(), req.userId!, all === 'true');
        res.status(200).json({ message: 'Transação removida com sucesso' });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}