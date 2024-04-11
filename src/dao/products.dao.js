import productModel from '../model/products.model.js';

export default class ProductDAO {
    static async getAllProducts(limit) {
        try {
            return await productModel.find().limit(limit ? parseInt(limit) : undefined);
        } catch (error) {
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            return await productModel.findOne({ _id: id });
        } catch (error) {
            throw error;
        }
    }

    static async addProduct(newProduct) {
        try {
            newProduct.code = await generateUniqueCode();
            newProduct.status = true;
            
            return await productModel.create(newProduct);
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(id, updatedFields) {
        try {
            return await productModel.findOneAndUpdate(
                { _id: id }, 
                { $set: updatedFields }, 
                { new: true } 
            );
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            return await productModel.findOneAndDelete({ _id: id });
        } catch (error) {
            throw error;
        }
    }
}

function generateUniqueCode() {
    let code = '';
    while (code.length < 9) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}
