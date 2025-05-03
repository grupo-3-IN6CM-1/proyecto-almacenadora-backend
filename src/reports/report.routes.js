import { Router } from "express";
import { generateAndOpenProductsReport, generateKardexReport } from "./report.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js"; 

const router = Router();

router.get(
  "/products-report",
  [
    validarJWT,
    tieneRole("ADMIN") 
  ],
  generateAndOpenProductsReport 
);

router.get(
    "/kardex-report",
    [
        validarJWT, 
        tieneRole("ADMIN"),
    ],
    generateKardexReport
);

export default router;
