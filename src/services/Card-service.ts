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

    async update(cardId: string, cardData: Partial<ICard>, userId: string) {
        // Garante que o usuário só atualize os SEUS cartões
        const updatedCard = await Card.findOneAndUpdate(
            { _id: cardId, userId }, 
            cardData, 
            { new: true }
        );

        if (!updatedCard) {
            throw new Error("Cartão não encontrado ou acesso negado");
        }

        return updatedCard;
    }

    async delete(cardId: string, userId: string) {
        // Garante que o usuário só delete os SEUS cartões
        const card = await Card.findOneAndDelete({ _id: cardId, userId });

        if (!card) {
            throw new Error("Cartão não encontrado ou acesso negado");
        }
        
        return card;
    }
}