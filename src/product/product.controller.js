import { response } from "express";
import Product from "./product.model.js";
import Kardex from "../kardex/kardex.model.js";

export const listProducts = async (req, res = response) => {
    try {
        const products = await Product.find({ status: true })  // Filtra los productos activos
            .populate("category", "name")  // Poblamos la categoría del producto
            .lean();  // Convertimos el documento de Mongoose a un objeto plano

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching products ❌",
            error: error.message,
        });
    }
};

export const createProduct = async (req, res = response) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category,
            supplier,
            entry_date,
            expiration_date
        } = req.body;

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

        const { name: empName, surname: empSurname } = req.usuario;  
        const kardexEntry = new Kardex({
            product:  product._id,
            quantity: stock,
            action:   'entry',
            employee: { name: empName, surname: empSurname },
            date:     entry_date  
        });
        await kardexEntry.save();

        res.status(201).json({
            success: true,
            msg: 'Product created and Kardex entry generated 🎉',
            product,
            kardex: kardexEntry
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

export const searchProducts = async (req, res = response) => {
  try {
    const { name, category, entry_date } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; 
    }
    if (category) {
      filter.category = category;
    }
    if (entry_date) {
      filter.entry_date = { $gte: new Date(entry_date) };
    }

    const products = await Product.find(filter)
        .populate("category", "name")
        .lean()

        products.forEach((product) => {
            if (product.category) {
              product.category = {
                _id: product.category._id,
                name: product.category.name,
              };
            }
          });

          res.status(200).json({
            success: true,
            products
          });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error searching products ❌",
      error: error.message
    });
  }
};