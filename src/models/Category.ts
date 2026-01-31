import { Schema, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  icon?: string;
  userId: Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  color: { type: String, default: '#cccccc' },
  icon: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// impede o mesmo nome de categoria para o mesmo usuário
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

export default model<ICategory>('Category', CategorySchema);