import User from '../user/user.model.js';
import Category from '../category/category.model.js';
import Supplier from "../supplier/supplier.model.js";
import Product from "../product/product.model.js"
import { Types } from "mongoose";

export const existenteEmail = async (email = '') =>{
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`The email ${email} already exists in the database ⚠️`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`The ID ${id} does not exist ❌`);
    }
}

export const existCategory = async (id = '') => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error(`The ID ${id} is not a valid ObjectId`);
    }

    const category = await Category.findById(id);
    if (!category) {
        throw new Error(`Category with ID ${id} does not exist`);
    }
};

export const existeProveedorById = async (id) => {
    const supplierExists = await Supplier.findById(id);
    if (!supplierExists) {
        throw new Error(`No supplier found with ID: ${id} 🔍❌`);
    }
};

export const existeProductoById = async (id) => {
    const productExists = await Product.findById(id);
    if (!productExists) {
        throw new Error(`No product found with ID: ${id} 🔍❌`);
    }
};
