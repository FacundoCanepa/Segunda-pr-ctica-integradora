import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from "../model/user.model.js";

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
    const user = await userModel.findById(id);
    done (null, user);
});

passport.use('local-register', new LocalStrategy({
    usernameField: 'email' ,
    passwordField: 'password', 
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { first_name, last_name, age } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if(user) {
            return done(null, false, req.flash('registerFail', 'El email ya está en uso.'));
        } else {
            const newUser = new userModel({
                first_name,
                last_name,
                email,
                age,
                password: newUser.encryptPassword(password),
            });
            await newUser.save();
            done(null, newUser);
        }
    } catch (error) {
        done(error);
    }
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return done(null, false, req.flash('loginFailEmail', 'El email no es válido.'));
        }
        if (!user.comparePassword(password)) {
            return done(null, false, req.flash('loginFaildPassword', 'La contraseña es incorrecta.'));
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
}));

export default passport;
