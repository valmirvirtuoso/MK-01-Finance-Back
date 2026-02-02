import Transaction, { ITransaction } from "../models/Transaction.js";
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
    async create(data: Partial<ITransaction>, userId: string) {
        // Se não for parcelado, cria uma transação simples
        if (!data.isInstallment || !data.installmentDetails?.total) {
            return await Transaction.create({ ...data, userId });
        }

        // Parcelamento
        const { total } = data.installmentDetails;
        const groupId = uuidv4();
        const transactions = [];
        const originalDate = new Date(data.date!);

        for (let i = 0; i < total; i++) {
            // Calcula a data da parcela (Somando i meses)
            const installmentDate = new Date(originalDate);
            installmentDate.setMonth(installmentDate.getMonth() + i);

            transactions.push({
                ...data,
                date: installmentDate,
                userId,
                installmentDetails: {
                    current: i + 1,
                    total,
                    groupId
                }
            });
        }

        return await Transaction.insertMany(transactions);
    }

    async getAll(userId: string, filters: any = {}) {
        // TODO: Filtros de data e categoria
        const transactions = await Transaction.find({ userId, ...filters })
            .populate('categoryId', 'name color')
            .populate('cardId', 'name')
            .sort({ date: -1 });

        return transactions;
    }

    async update(transactionId: string, userId: string, data: Partial<ITransaction>) {
        // Tira o dado do userId PARA IMPEDIR DE SOBSCREVER sem querer o usuario dono da transação
        const { userId: _, installmentDetails, ...updateData } = data;

        const transaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId },
            { $set: updateData },
            { new: true }
        ).populate('categoryId', 'name color');

        if (!transaction) throw new Error("Transação não encontrada ou acesso negado");;

        return transaction;
    }

    async delete(transactionId: string, userId: string, deleteAllInstallments: boolean = false) {
        const transaction = await Transaction.findOne({ _id: transactionId, userId });

        if (!transaction) {
            throw new Error('Transação não encontrada');
        }

        // Se o usuário for deletar todas as parcelas
        if (deleteAllInstallments && transaction.installmentDetails?.groupId) {
            return await Transaction.deleteMany({
                'installmentDetails.groupId': transaction.installmentDetails.groupId,
                userId
            });
        }

        return await Transaction.findByIdAndDelete(transactionId);
    }
}