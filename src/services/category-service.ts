import Category, { ICategory } from "../models/Category.js";

export class CategoryService {
    async create(data: Partial<ICategory>, userId: string) {
        // Não permitir duas categorias com o mesmo nome para o mesmo usuário
        const exists = await Category.findOne({ name: data.name, userId });
        if (exists) {
            throw new Error("Já existe uma categoria com este nome");
        }

        return await Category.create({ ...data, userId });
    }

    async getAll(userId: string) {
        return await Category.find({ userId }).sort({ name: 1 });
    }

    async update(categoryId: string, data: Partial<ICategory>, userId: string) {
        // Garante que o usuário só atualize AS SUAS categorias
        const category = await Category.findOneAndUpdate(
            { _id: categoryId, userId },
            data,
            { new: true }
        );

        if (!category) {
            throw new Error("Categoria não encontrada ou acesso negado");
        }

        return category;
    }

    async delete(categoryId: string, userId: string) {
        // Garante que o usuário só delete AS SUAS categorias
        const category = await Category.findOneAndDelete({ _id: categoryId, userId });

        if (!category) {
            throw new Error("Categoria não encontrada ou acesso negado");
        }

        return category;
    }
}