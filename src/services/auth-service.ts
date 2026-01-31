import User, { IUser } from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export class AuthService {
    async register(userData: Partial<IUser>) {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email: userData.email });
        if (userExists) {
            throw new Error('Usuário já existe');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(userData.password!, 10);

        const user = await User.create({ 
            ...userData, 
            password: hashedPassword
        });

        return this.generateToken(user._id.toString() as string);

    }

    async login(email: string, password: string) {
        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) throw new Error('E-mail ou senha inválidos');

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) throw new Error('E-mail ou senha inválidos');

        const token = this.generateToken(user._id.toString() as string);

        return {
            token,
            user: { id: user._id, name: user.name, email: user.email }
        };
    }   

    private generateToken(userId: string): string {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1d'
        });
    }
}