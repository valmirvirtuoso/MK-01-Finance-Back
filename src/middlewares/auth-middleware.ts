import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // O padrão é "Bearer token"
    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload; 

        // Injetamos o ID do usuário na requisição para uso nos próximos controllers
        req.userId = decoded.id;

        return next();
        
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}