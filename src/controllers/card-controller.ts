import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware.js";
import { CardService } from "../services/Card-service.js";

const cardService = new CardService();

export async function create(req: AuthRequest, res: Response) {
    try {
        const card = await cardService.create(req.body, req.userId!);
        res.status(201).json(card);
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }    
}


export async function list(req: AuthRequest, res: Response) {
    try {
        const cards = await cardService.getAll(req.userId!);
        res.status(200).json(cards);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error ao buscar os cartões" });
    }
}

export async function update(req: AuthRequest, res: Response) {
    try {
        const cardId = req.params.cardId as string;

        if (!cardId) {
            return res.status(400).json({ message: "ID do cartão é obrigatório" });
        }

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        const card = await cardService.update(cardId, req.body, userId);
        res.status(200).json(card);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

export async function remove(req: AuthRequest, res: Response) {
    try {
        const cardId = req.params.cardId as string;

        if (!cardId) {
            return res.status(400).json({ message: "ID do cartão é obrigatório" });
        }

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        await cardService.delete(cardId, userId);
        res.status(200).json({ message: "Cartão deletado com sucesso" });
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}
