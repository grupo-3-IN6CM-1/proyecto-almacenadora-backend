import { response } from "express";
import Supplier from "./supplier.model.js"; 

export const listSupplier = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ status: true })
        res.json({
            success: true,
            suppliers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to get the suppliers",
            error
        })
    }
}

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
        const supplierId = req.params.id;
        const { name, contact, products_supplied } = req.body;

        const existingSupplier = await Supplier.findById(supplierId);
        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                msg: 'Proveedor no encontrado 🔍❌'
            });
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            supplierId,
            { name, contact, products_supplied },
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: 'Proveedor actualizado ✅',
            supplier: updatedSupplier
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar proveedor ❌',
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
