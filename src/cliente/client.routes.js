import { Router } from "express";
import { check } from "express-validator";
import { listClients, createClient, updateClient, deleteClient } from "./client.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeClienteById } from "../helpers/db-validator.js"; 
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", listClients);

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("name", "Client name is required").not().isEmpty(),
    check("contact", "Client contact is required").not().isEmpty(),
    validarCampos,
  ],
  createClient
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(existeClienteById),
    check("name").optional().not().isEmpty(),
    check("contact").optional().not().isEmpty(),
    validarCampos,
  ],
  updateClient
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(existeClienteById),
    validarCampos,
  ],
  deleteClient
);

export default router;
