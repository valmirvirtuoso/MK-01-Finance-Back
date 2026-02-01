import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { CardService } from './Card-service.js';
import mongoose from 'mongoose';


describe('Card Service', () => {
    const service = new CardService();
    const mockUserId = new mongoose.Types.ObjectId().toString();

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URL_TEST || 'mongodb://localhost:27017/mk01_tests');
    });

    afterAll(async () => {
        await mongoose.connection.db!.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await mongoose.model('Card').deleteMany({});
    });

    it('Deve criar um cartão com sucesso', async () => {
        const cardData = { name: 'Nubank', limit: 1000, closingDay: 5, dueDay: 12 };
        const card = await service.create(cardData, mockUserId);

        expect(card).toHaveProperty('_id');
        expect(card.name).toBe('Nubank');
    });

    it('Não deve permitir criar dois cartões com o mesmo nome para o mesmo usuário', async () => {
        const cardData = { name: 'Inter', limit: 1000, closingDay: 5, dueDay: 12 };
        await service.create(cardData, mockUserId);
        
        // Cria o mesmo cartão
        await expect(
            service.create(cardData, mockUserId)
        ).rejects.toThrow('Você já possui um cartão com este nome');
    });

    it('Deve atualizar um cartão com sucesso', async () => {
        const cardData = { name: 'Inter', limit: 1000, closingDay: 5, dueDay: 12 };
        const card = await service.create(cardData, mockUserId);

        const updatedCard = await service.update(card._id.toString(), { name: 'Nubank' }, mockUserId);

        expect(updatedCard.name).toBe('Nubank');
    })

    it('Não deve atualizar um cartão que não existe', async () => {
        const cardData = { name: 'Inter', limit: 1000, closingDay: 5, dueDay: 12 };
        await service.create(cardData, mockUserId);

        await expect(
                service.update(mockUserId, {  name: 'Nubank' }, mockUserId)
        ).rejects.toThrow('Cartão não encontrado ou acesso negado');
    })

     it('Deve deletar um cartão com sucesso', async () => {
        const cardData = { name: 'Inter', limit: 1000, closingDay: 5, dueDay: 12 };
        const card = await service.create(cardData, mockUserId);

        const deletedCard = await service.delete(card._id.toString(), mockUserId);
        expect(deletedCard._id.toString()).toBe(card._id.toString());
    })

    
    it('Não deve deletar um cartão que não existe', async () => {
        const cardData = { name: 'Inter', limit: 1000, closingDay: 5, dueDay: 12 };
        await service.create(cardData, mockUserId);

        await expect(
             service.delete(mockUserId, mockUserId)
        ).rejects.toThrow('Cartão não encontrado ou acesso negado');
    })


});