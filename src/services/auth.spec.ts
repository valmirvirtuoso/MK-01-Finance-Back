import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { AuthService } from './auth-service.js';
import User from '../models/User.js';

describe('Auth Service', () => {
    const authService = new AuthService();

    // Antes de testar, conectamos a um banco de testes (ou usamos memória)
    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URL_TEST || 'mongodb://localhost:27017/mk01_tests');
    });

    // Limpa o banco após os testes
    afterAll(async () => {
        await mongoose.connection.db!.dropDatabase();
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('Deve criptografar a senha ao registrar um usuário', async () => {
        const rawPassword = 'password123';
        await authService.register({
            name: 'Test User',
            email: 'test@test.com',
            password: rawPassword
        });

        const user = await User.findOne({ email: 'test@test.com' });

        // A senha no banco não pode ser igual à senha pura
        expect(user?.password).not.toBe(rawPassword);
        expect(user?.password?.length).toBeGreaterThan(20); // Hash do bcrypt é longo
    })

    it('Deve lançar erro ao tentar login com email inexistente', async () => {
        await expect(
            authService.login('naoexiste@test.com', '123456')
        )
        .rejects.toThrow('E-mail ou senha inválidos');
    });
})