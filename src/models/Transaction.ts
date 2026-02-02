import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  description: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  categoryId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  // Campos para Cartão e Parcelamento
  cardId?: Types.ObjectId; 
  isInstallment: boolean;
  installmentDetails?: {
    current: number; // Ex: 1
    total: number;   // Ex: 12
    groupId: string; // Para identificar todas as parcelas de uma mesma compra
  };
  status: 'paid' | 'pending';
}

const TransactionSchema = new Schema<ITransaction>({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cardId: { type: Schema.Types.ObjectId, ref: 'Card', default: null },
    isInstallment: { type: Boolean, default: false },
    installmentDetails: {
        current: { type: Number },
        total: { type: Number },
        groupId: { type: String } // Um UUID ou string única para agrupar as 12 parcelas
    },
    status: { type: String, enum: ['paid', 'pending'], default: 'pending' }
}, { timestamps: true });

TransactionSchema.index({ date: 1, userId: 1 });

export default model<ITransaction>('Transaction', TransactionSchema);