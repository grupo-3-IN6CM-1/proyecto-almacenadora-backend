import { Router } from "express";
import { check } from "express-validator";
import { createSupplier, updateSupplier, deleteSupplier, listSupplier } from "./supplier.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeProveedorById, existeProductoById, existCategory } from "../helpers/db-validator.js"; 
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get(
    '/',
    listSupplier
)

router.post(
    '/',
    [
        validarJWT, 
        tieneRole("ADMIN", "USER"), 
        check("name", "Supplier name is required").not().isEmpty(), 
        check("products_supplied").custom(existeProductoById), 
        check("contact", "Supplier contact is required").not().isEmpty(), 
        validarCampos, 
    ],
    createSupplier
);

router.put(
    '/:id',
    [
        validarJWT, 
        tieneRole("ADMIN", "USER"), 
        check("id", "Invalid ID").isMongoId(), 
        check("id").custom(existeProveedorById), 
        check("products_supplied").custom(existeProductoById), 
        check("name").optional().not().isEmpty(), 
        check("contact").optional().not().isEmpty(), 
        validarCampos, 
    ],
    updateSupplier
);

router.delete(
    '/:id',
    [
        validarJWT, 
        tieneRole("ADMIN"), 
        check("id", "Invalid ID").isMongoId(),
        check("id").custom(existCategory),
        check("id").custom(existeProveedorById), 
        validarCampos, 
    ],
    deleteSupplier
);

export default router;
