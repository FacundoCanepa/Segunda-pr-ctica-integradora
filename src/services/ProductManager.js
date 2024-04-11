import ProductDAO from '../dao/products.dao.js';

export class ProductManager {
    static _instance;

    constructor() {}

    static getInstance() {
        if (!ProductManager._instance) {
            ProductManager._instance = new ProductManager();
        }
        return ProductManager._instance;
    }

    async getProducts(limit) {
        try {
            return await ProductDAO.getAllProducts(limit);
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await ProductDAO.getProductById(id);
        } catch (error) {
            throw error;
        }
    }

    async addProduct(newProduct) {
        try {
            return await ProductDAO.addProduct(newProduct);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            return await ProductDAO.updateProduct(id, updatedFields);
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await ProductDAO.deleteProduct(id);
        } catch (error) {
            throw error;
        }
    }
}
