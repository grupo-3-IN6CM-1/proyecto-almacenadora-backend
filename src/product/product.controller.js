import { response } from "express";
import Product from "./product.model.js"; 

export const createProduct = async (req, res = response) => {
    try {
        const { name, description, price, stock, category, supplier, entry_date, expiration_date } = req.body;

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                msg: 'Product already exists ❌'
            });
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            supplier,
            entry_date,
            expiration_date
        });

        await product.save();

        res.status(201).json({
            success: true,
            msg: 'Product created successfully 🎉',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error creating product ❌',
            error: error.message
        });
    }
};

export const updateProduct = async (req, res = response) => {
    try {
        const productId = req.params.id; 
        const { name, description, price, stock, category, supplier, entry_date, expiration_date } = req.body;

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found 🔍❌'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
            stock,
            category,
            supplier,
            entry_date,
            expiration_date
        }, { new: true }); 

        res.status(200).json({
            success: true,
            msg: 'Product updated successfully ✅',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error updating product ❌',
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res = response) => {
    try {
        const productId = req.params.id;

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found 🔍❌'
            });
        }

        existingProduct.status = false; 
        await existingProduct.save();

        res.status(200).json({
            success: true,
            msg: 'Product deactivated successfully ✅',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error deactivating product ❌',
            error: error.message
        });
    }
};
