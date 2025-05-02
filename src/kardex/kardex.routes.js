import { Router } from "express";
import { listKardex, exitProduct } from "./kardex.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { stockProduct, existeProductoById } from "../helpers/db-validator.js";
import { check } from "express-validator";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", validarJWT, listKardex);

router.post(
    "/salida",
    [
      validarJWT,
      tieneRole("ADMIN"),
      check("productId", "Invalid product ID").isMongoId().bail().custom(existeProductoById),
      check("quantity", "Quantity must be an integer ≥ 1").isInt({ min: 1 }).bail().custom((_, { req }) => stockProduct(req.body.productId, req.body.quantity)),
      check("reason", "Reason is required").not().isEmpty(),
      check("destination", "Destination is required").not().isEmpty(),
      validarCampos
    ],
    exitProduct
);

export default router;
