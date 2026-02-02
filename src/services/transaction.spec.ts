import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { TransactionService } from './transaction-service.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import Card from '../models/Card.js';

describe('Transaction Service', () => {
    const service = new TransactionService();
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockCategoryId = new mongoose.Types.ObjectId().toString();

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URL_TEST || 'mongodb://localhost:27017/mk01_tests');
    });

    afterAll(async () => {
        await mongoose.connection.db!.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Transaction.deleteMany({})
    });

    it('Deve criar uma transação com 12 parcelas mensais para uma compra parcelada', async () => {
        
        const transactionData = {
            description: 'GPU Gamer',
            amount: 100, // valor por parcela
            date: new Date('2026-01-15'),
            type: 'expense' as const,
            categoryId: mockCategoryId,
            isInstallment: true,
            installmentDetails: {
                total: 12,
                current: 1, // o service vai sobrescrever isso no loop
                groupId: '' // o service vai gerar um uuid
            }
        };

        const results = await service.create(transactionData, mockUserId);

        if (!Array.isArray(results)) {
            throw new Error('O resultado deveria ser um array de transações');
        }

        expect(results).toHaveLength(12);
        expect(results[0].installmentDetails?.current).toBe(1);
        expect(results[11].installmentDetails?.current).toBe(12);

        // Verifica se o groupId é igual para todas
        const groupId = results[0].installmentDetails?.groupId;

        results.forEach(transaction => expect(transaction.installmentDetails?.groupId).toBe(groupId));


        // Verifica a progressão das datas
        expect(results[0].date.getMonth()).toBe(0); // Janeiro
        expect(results[1].date.getMonth()).toBe(1); // Fevereiro
        expect(results[11].date.getMonth()).toBe(11);
        expect(results[11].date.getFullYear()).toBe(2026);
    });

    it('deve criar uma transação simples (sem parcelamento)', async () => {
        const transactionData = {
            description: 'Café',
            amount: 15.50,
            date: new Date(),
            type: 'expense' as const,
            categoryId: mockCategoryId,
            status: 'paid' as const
        };

        const result = await service.create(transactionData, mockUserId);

        if (Array.isArray(result)) {
            throw new Error('Deveria retornar um objeto único, mas retornou um array');
        }
        
        // Como não é parcelado, o insertMany não foi usado, o Mongoose retorna o objeto único
        expect(result).toHaveProperty('_id');
        expect(result.description).toBe('Café');
    });

    it('deve listar transações filtrando por descrição', async () => {
        await service.create({ description: 'Almoço', amount: 30, date: new Date(), type: 'expense', categoryId: mockCategoryId }, mockUserId);
        await service.create({ description: 'Gasolina', amount: 200, date: new Date(), type: 'expense', categoryId: mockCategoryId }, mockUserId);

        // Filtro "contém"
        const filters = { description: { $regex: 'gas', $options: 'i' } };
        const results = await service.getAll(mockUserId, filters);

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Gasolina');
    });

    it('deve deletar TODAS as parcelas de um grupo quando solicitado', async () => {
        const installmentData = {
            description: 'Curso Angular',
            amount: 50,
            date: new Date(),
            type: 'expense' as const,
            categoryId: mockCategoryId,
            isInstallment: true,
            installmentDetails: { total: 3, current: 1, groupId: '' }
        };

        const created = await service.create(installmentData, mockUserId) as any[];
        const firstId = created[0]._id.toString();

        // Deletar com a flag true
        await service.delete(firstId, mockUserId, true);

        const remaining = await Transaction.find({ userId: mockUserId });
        
        expect(remaining).toHaveLength(0); // Limpou as 3 parcelas
    });
});