import productModel from "../model/products.model.js";
import { CartManager } from "../services/CartManager.js";
import { ProductManager } from "../services/ProductManager.js";


const socketProduct = async (socketServer) => {

    socketServer.on("connection", async (socket) => {

        const productManager = ProductManager.getInstance();
        
        const carrito =  CartManager.getInstance() ;

        const listaProduct = await productModel.find();

        console.log("Usuario conectado", socket.id);

        socket.emit("enviosdeproductos", listaProduct);
        
        socket.on("addProduct", async (newProduct) => {
            try {
                const producto = {
                    ...newProduct 
                };
                await productManager.addProduct(producto);
                
                const listaProductActualizada = await productManager.getProducts();
                socketServer.emit("enviosdeproductos", listaProductActualizada);
            } catch (error) {
                console.error(error);
            }
        });

        socket.on("deleteProduct", async (id) => {
            try {
                await productManager.deleteProduct(id);
                const listaProduct = await productManager.getProducts(); 
                socketServer.emit("enviosdeproductos", listaProduct); 
            } catch (error) {
                socket.emit("deleteProductError", error.message); 
            }
        });

        socket.on("updateProduct", async (updatedProductData) => {
            try {
                const { id, updatedFields } = updatedProductData;
                await productManager.updateProduct(id, updatedFields);
                const listaProduct = await productManager.getProducts(); 
                socketServer.emit("enviosdeproductos", listaProduct); 
            } catch (error) {
                console.error(error);
            }
        });

        socket.on("addProductCart", async (userId, productId, quantityValue) => {
            try {
                // Buscar al usuario en la base de datos utilizando el userId
                const user = await userModel.findById(userId);
                if (!user || !user.cart) {
                    throw new Error("No se encontró el usuario o el carrito asociado.");
                }
                const cartId = user.cart;
                const quantity = quantityValue;
        
                const cart = await carrito.addProductCart(cartId, productId, quantity);
        
                console.log(`Producto agregado al carrito. ID del carrito: ${cart._id}`);
            } catch (error) {
                console.error("Error al agregar el producto al carrito:", error.message);
            }
        });
        
        
        
    
    });
};

export default socketProduct;
