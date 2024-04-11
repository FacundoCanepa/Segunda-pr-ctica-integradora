import cartsModel from '../model/carts.model.js';

export default class CartDAO {
    static async getAllCarts() {
        try {
            return await cartsModel.find({}).populate({ path: 'productos' });
        } catch (error) {
            throw error;
        }
    }

    static async addCart() {
        try {
            return await cartsModel.create({ productos: [] });
        } catch (error) {
            throw error;
        }
    }

    static async getCartById(id) {
        try {
            return await cartsModel.findOne({ _id: id });
        } catch (error) {
            throw error;
        }
    }

    static async addProductCart(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findOne({ _id: cartId });
            if (!cart) {
                throw new Error(`No se encontró el carrito con ID ${cartId}`);
            }

            const productIndex = cart.productos.findIndex(item => item.productoid === productId);
            if (productIndex !== -1) {
                cart.productos[productIndex].quantity += quantity;
            } else {
                cart.productos.push({ productoid: productId, quantity: quantity });
            }

            await cart.save();
            
            return cart;
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart || !cart.productos || cart.productos.length === 0) {
                throw new Error('El carrito no existe o no tiene productos');
            }
    
            const deletedProductIndex = cart.productos.findIndex(item => item.productoid.toString() === productId);
    
            if (deletedProductIndex === -1) {
                throw new Error(`El producto con ID ${productId} no se encontró en el carrito con ID ${cartId}`);
            }
    
            cart.productos.splice(deletedProductIndex, 1);
    
            await cart.save();
    
            return productId; 
        } catch (error) {
            throw error;
        }
    }

    static async updateCart(cartId, products) {
        try {
            const cart = await this.getCartById(cartId);
            if (!Array.isArray(products)) {
                throw new Error('La lista de productos proporcionada no es válida');
            }
            cart.productos = products;
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findOne({ _id: cartId });
            if (!cart) {
                throw new Error(`No se encontró el carrito con ID ${cartId}`);
            }

            const product = cart.productos.find(product => product.productoid === productId);
            if (!product) {
                throw new Error(`No se encontró el producto con ID ${productId} en el carrito`);
            }

            product.quantity = quantity;
            await cart.save();

            return cart;
        } catch (error) {
            throw error;
        }
    }

    static async deleteAllProducts(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            cart.productos = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }
}
