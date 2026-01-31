import { Request, Response } from "express";
import { AuthService } from "../services/auth-service.js";

const authService = new AuthService();

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        const result = await authService.register({ name, email, password });
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
}