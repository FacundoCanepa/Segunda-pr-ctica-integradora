import express from 'express';
import { Socket } from 'socket.io';
import productModel from '../model/products.model.js';
import cartsModel from '../model/carts.model.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', async (req, res) => {
    try {
        res.render("Login");
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/profile',isAuthenticated, (req, res) => {
    const user = req.user;
    res.render('profile', { user });
});

router.get('/home', async (req, res) => {
    try {
        const sort = { price: 'asc' };
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const productManager = await productModel.paginate({}, { limit, page, sort });

        res.render("home", { productManager });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/realTimeProducts',isAuthenticated, async (req, res) => {
    res.render("realTimeProducts", Socket.id)
});

router.get('/products',isAuthenticated, async (req, res) => {
    const sort = { price: 'asc' };
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const productManager = await productModel.paginate({}, { limit, page, sort });
    res.render("products", { productManager })
});

router.get('/carts',isAuthenticated, async (req, res) => {
    try {

        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
        const cartId = req.user.cart;
        if (!cartId) {
            return res.status(404).json({ error: 'El usuario no tiene un carrito asociado.' });
        }
        const cart = await cartsModel.findById(cartId).populate('productos.productoid');

        if (!cart) {
            return res.status(404).json({ error: 'No se encontró el carrito.' });
        }

        res.render('Carts', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el carrito.' });
    }
});

router.get('/register', async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/login', async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err); 
        }
        res.redirect('/'); 
    });
});


function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/')
  }

export default router;
