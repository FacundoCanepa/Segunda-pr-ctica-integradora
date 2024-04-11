import { generateToken } from '../middlewares/auth.middlewares.js';

const login = async (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el token JWT' });
    }
};

export { login };
