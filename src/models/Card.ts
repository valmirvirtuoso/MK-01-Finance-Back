import { Schema, model, Document, Types } from 'mongoose';

export interface ICard extends Document {
    name: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    color: string;
    userId: Types.ObjectId;
}

const CardSchema = new Schema<ICard>({
    name: { type: String, required: true },
    limit: { type: Number, required: true },
    closingDay: { type: Number, required: true, min: 1, max: 31 },
    dueDay: { type: Number, required: true, min: 1, max: 31 },
    color: { type: String, required: true, default: '#7B2CBF' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

export default model<ICard>('Card', CardSchema);