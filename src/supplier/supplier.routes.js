import { Router } from "express";
import { check } from "express-validator";
import { createSupplier, updateSupplier, deleteSupplier } from "./supplier.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeProveedorById } from "../helpers/db-validator.js"; 
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    '/proveedores',
    [
        validarJWT, 
        check("name", "Supplier name is required").not().isEmpty(), 
        check("contact", "Supplier contact is required").not().isEmpty(), 
        validarCampos, 
    ],
    createSupplier
);

router.put(
    '/proveedores/:id',
    [
        validarJWT, 
        tieneRole("ADMIN"), 
        check("id", "Invalid ID").isMongoId(), 
        check("id").custom(existeProveedorById), 
        check("name").optional().not().isEmpty(), 
        check("contact").optional().not().isEmpty(), 
        validarCampos, 
    ],
    updateSupplier
);

router.delete(
    '/proveedores/:id',
    [
        validarJWT, 
        tieneRole("ADMIN"), 
        check("id", "Invalid ID").isMongoId(),
        check("id").custom(existeProveedorById), 
        validarCampos, 
    ],
    deleteSupplier
);

export default router;
