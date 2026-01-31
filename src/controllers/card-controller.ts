import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware.js";
import { CardService } from "../services/Card-service.js";

const cardService = new CardService();

export async function create(req: AuthRequest, res: Response) {
    try {
        const card = await cardService.create(req.body, req.userId!);
        res.status(201).json(card);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }    
}


export async function list(req: AuthRequest, res: Response) {
    try {
        const cards = await cardService.getAll(req.userId!);
        res.status(200).json(cards);
    } catch (error) {
        return res.status(400).json({ message: "Error ao buscar os cartões" });
    }
}