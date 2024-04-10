import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { generateToken } from '../config/auth.config.js';
import { login } from '../controller/user.controller.js';

const router = express.Router();

router.post("/register", passport.authenticate('local-register' , {
    successRedirect: '/profile' ,
    failureRedirect: '/register',
    passReqToCallback: true
}), async (req , res) => {
    const token = await generateToken(req.user)
    res.json({ token });
})


router.post("/login", passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    passReqToCallback: true
}), login);

router.get('/current', (req, res) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'Secreto12');
        const tokenValue = decodedToken ? decodedToken : null;
        res.render('current', { token: tokenValue });
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
});



export default router;