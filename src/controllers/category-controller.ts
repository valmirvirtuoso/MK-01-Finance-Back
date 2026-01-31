import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware.js";
import { CategoryService } from "../services/category-service.js";

const categoryService = new CategoryService()

export async function create(req: AuthRequest, res: Response) {
    try {
        const category = await categoryService.create(req.body, req.userId!);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function list(req: AuthRequest, res: Response) {
    try {
        const categories = await categoryService.getAll(req.userId!);
        res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({ message: "Erro ao buscar as categorias" });
    }
}

export async function update(req: AuthRequest, res: Response) {
    try {
        const categoryId = req.params.categoryId as string;

        if (!categoryId) {
            return res.status(400).json({ message: "ID da categoria é obrigatório" });
        }

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        const category = await categoryService.update(categoryId, req.body, userId);
        res.status(200).json(category);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function remove(req: AuthRequest, res: Response) {
    try {
        const categoryId = req.params.categoryId as string;

        if (!categoryId) {
            return res.status(400).json({ message: "ID da categoria é obrigatório" });
        }

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        await categoryService.delete(categoryId, userId);
        res.status(200).json({ message: "Categoria deletada com sucesso" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
