// routers/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'chave-secreta-segura';

export function authMiddleware(req, res, next) {
 
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader) {
        return res.status(403).json({ erro: 'Token não enviado' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; // agora você acessa via req.userId
        next();
    } catch (err) {
        return res.status(403).json({ erro: 'Token inválido' });
    }
}
