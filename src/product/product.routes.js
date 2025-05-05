import { Router } from "express";
import { check } from "express-validator";
import { listProducts, createProduct, updateProduct, deleteProduct, searchProducts } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeProductoById, existCategory, existeProductoPorNombre } from "../helpers/db-validator.js"; 
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get( "/", listProducts);

router.post(
    '/',
    [
        validarJWT, 
        tieneRole("ADMIN", "USER"), 
        check("name").custom(existeProductoPorNombre),
        check("name", "Product name is required").not().isEmpty(), 
        check("price", "Product price is required").isNumeric(), 
        check("category", "Category ID is required").not().isEmpty(),
        check("category").custom(existCategory),
        check("stock", "Product stock is required").isInt({ min: 0 }), 
        validarCampos, 
    ],
    createProduct
);

router.put(
    '/:id',
    [
        validarJWT, 
        tieneRole("ADMIN", "USER"), 
        check("id", "Invalid ID").isMongoId(), 
        check("id").custom(existeProductoById), 
        check("name").optional().not().isEmpty(), 
        check("price").optional().isNumeric(), 
        check("category", "Category ID is required").not().isEmpty(),
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

export default router;
