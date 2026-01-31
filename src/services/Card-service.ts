import Card, { ICard } from "../models/Card.js";

export class CardService {
    async create(cardData: Partial<ICard>, userId: string) {
        // Não permitir dois cartões com o mesmo nome para o mesmo usuário
        const exists = await Card.findOne({ name: cardData.name, userId });
        if (exists) {
            throw new Error('Você já possui um cartão com este nome');
        }

        return await Card.create({ ...cardData, userId });
    }

    async getAll(userId: string) {
        return await Card.find({ userId }).sort({ name: 1 });
    }

    async delete(cardId: string, userId: string) {
        // Garante que o usuário só delete os SEUS cartões
        return await Card.findOneAndDelete({ _id: cardId, userId });
    }
}