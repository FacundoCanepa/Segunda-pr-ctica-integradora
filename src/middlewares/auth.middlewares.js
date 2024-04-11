import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        cartId: user.cart 
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); 
};

export { generateToken };
