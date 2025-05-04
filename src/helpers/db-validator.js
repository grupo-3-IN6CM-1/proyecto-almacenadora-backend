import User from '../user/user.model.js';
import Category from '../category/category.model.js';
import Supplier from "../supplier/supplier.model.js";
import Product from "../product/product.model.js"
import Client from '../cliente/client.model.js';
import { Types } from "mongoose";
import mongoose from 'mongoose';

export const existenteEmail = async (email = '') =>{
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`The email ${email} already exists in the database ⚠️`);
    }
}

export const existeUsuarioByUsername = async (username = '') => {
    const existeUsuario = await User.findOne({ username });

    if (existeUsuario) {
        throw new Error(`El nombre de usuario ${username} ya está en uso. ⚠️`);
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

export const existeProductoPorNombre = async (name = "") => {
    const producto = await Product.findOne({ name });
    if (producto) {
      throw new Error(`Ya existe un producto con nombre: ${name}`);
    }
  };

export const existeClienteById = async (id) => {
    const clientExists = await Client.findById(id);
    if (!clientExists) {
      throw new Error(`No client found with ID: ${id} 🔍❌`);
    }
  };

  export const stockProduct = async (id = '', quantity = 1) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`The ID "${id}" is not a valid ObjectId.`);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new Error(`Product with ID "${id}" does not exist.`);
    }

    if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantity}`);
    }
};