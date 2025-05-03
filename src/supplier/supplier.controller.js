import { response } from "express";
import Supplier from "./supplier.model.js"; 

export const createSupplier = async (req, res = response) => {
    try {
        const { name, contact, products_supplied } = req.body;

        const existingSupplier = await Supplier.findOne({ name });
        if (existingSupplier) {
            return res.status(400).json({
                success: false,
                msg: 'Supplier already exists ❌'
            });
        }

        const supplier = new Supplier({
            name,
            contact,
            products_supplied
        });

        await supplier.save();

        res.status(201).json({
            success: true,
            msg: 'Supplier created successfully 🎉',
            supplier
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error creating supplier ❌',
            error: error.message
        });
    }
};

export const updateSupplier = async (req, res = response) => {
    try {

        if (req.usuario.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                msg: 'You do not have permission to perform this action ❌'
            });
        }

        const supplierId = req.params.id; 
        const { name, contact, products_supplied } = req.body;

        const existingSupplier = await Supplier.findById(supplierId);
        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                msg: 'Supplier not found 🔍❌'
            });
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(supplierId, {
            name,
            contact,
            products_supplied
        }, { new: true }); 

        res.status(200).json({
            success: true,
            msg: 'Supplier updated successfully ✅',
            supplier: updatedSupplier
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error updating supplier ❌',
            error: error.message
        });
    }
};

export const deleteSupplier = async (req, res = response) => {
    try {

        const supplierId = req.params.id;

        const existingSupplier = await Supplier.findById(supplierId);
        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                msg: 'Supplier not found 🔍❌'
            });
        }
        
        existingSupplier.status = false; 
        await existingSupplier.save();

        res.status(200).json({
            success: true,
            msg: 'Supplier deactivated successfully ✅',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error deactivating supplier ❌',
            error: error.message
        });
    }
};
