import { Router } from "express";
import { check } from "express-validator";
import { createProduct, updateProduct, deleteProduct, searchProducts, generateAndOpenProductsReport } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeProductoById, stockProduct } from "../helpers/db-validator.js"; 
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    '/',
    [
        validarJWT, 
        tieneRole("ADMIN"), 
        check("name", "Product name is required").not().isEmpty(), 
        check("price", "Product price is required").isNumeric(), 
        check("stock", "Product stock is required").isInt({ min: 0 }), 
        validarCampos, 
    ],
    createProduct
);

router.put(
    '/:id',
    [
        validarJWT, 
        tieneRole("ADMIN"), 
        check("id", "Invalid ID").isMongoId(), 
        check("id").custom(existeProductoById), 
        check("name").optional().not().isEmpty(), 
        check("price").optional().isNumeric(), 
        check("stock").optional().isInt({ min: 0 }), 
        validarCampos, 
    ],
    updateProduct
);

router.delete(
    '/:id',
    [
        validarJWT, 
        tieneRole("ADMIN"), 
        check("id", "Invalid ID").isMongoId(), 
        check("id").custom(existeProductoById), 
        validarCampos, 
    ],
    deleteProduct
);

router.get(
    "/buscar",
    searchProducts
);

router.get(
    "/products-report",
    [
        validarJWT, // Verifica que el usuario esté autenticado
        check("id").custom(stockProduct),
        tieneRole("ADMIN"), // Solo los administradores pueden acceder a esta ruta
    ],
    generateAndOpenProductsReport
);

export default router;
