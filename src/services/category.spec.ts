import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { CategoryService } from './category-service.js';
import mongoose from 'mongoose';

describe('Category Service', () => {
    const service = new CategoryService();
    const mockUserId = new mongoose.Types.ObjectId().toString();

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URL_TEST || 'mongodb://localhost:27017/mk01_tests');
    });

    afterAll(async () => {
        await mongoose.connection.db!.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await mongoose.model('Category').deleteMany({});
    });

    it('Deve criar uma categoria com sucesso', async () => {
        const categoryData = { name: 'Alimentação', color: '#FF0000', icon: 'food-icon' };
        const category = await service.create(categoryData, mockUserId);

        expect(category).toHaveProperty('_id');
        expect(category.name).toBe('Alimentação');
    })

    it('Não deve criar uma categoria com o mesmo nome para o mesmo usuário', async () => {
        const categoryData = { name: 'Alimentação', color: '#FF0000', icon: 'food-icon' };
        const category = await service.create(categoryData, mockUserId);

        await expect(
            service.create(categoryData, mockUserId)
        ).rejects.toThrow('Já existe uma categoria com este nome');
    })

    it('Deve atualizar uma categoria com sucesso', async () => {
        const categoryData = { name: 'Alimentação', color: '#FF0000', icon: 'food-icon' };
        const category = await service.create(categoryData, mockUserId);

        const updatedCategory = await service.update(category._id.toString(), { color: '#00FF00' }, mockUserId);

        expect(updatedCategory.color).toBe('#00FF00');
    })

    it('Não deve atualizar uma categoria que não existe', async () => {
        const categoryData = { name: 'Alimentação', color: '#FF0000', icon: 'food-icon' };
        await service.create(categoryData, mockUserId);

        await expect(
             service.update(mockUserId, { color: '#00FF00' }, mockUserId)
        ).rejects.toThrow('Categoria não encontrada ou acesso negado');
    })
    
    it('Deve deletar uma categoria com sucesso', async () => {
        const categoryData = { name: 'Alimentação', color: '#FF0000', icon: 'food-icon' };
        const category = await service.create(categoryData, mockUserId);

        const deletedCategory = await service.delete(category._id.toString(), mockUserId);
        expect(deletedCategory._id.toString()).toBe(category._id.toString());
    })

    
    it('Não deve deletar uma categoria que não existe', async () => {
        const categoryData = { name: 'Alimentação', color: '#FF0000', icon: 'food-icon' };
        await service.create(categoryData, mockUserId);

        await expect(
             service.delete(mockUserId, mockUserId)
        ).rejects.toThrow('Categoria não encontrada ou acesso negado');
    })
});