// src/kardex/kardex.controller.js
import { response } from "express";
import Kardex from "./kardex.model.js";
import Product from "../product/product.model.js";

export const listKardex = async (req, res = response) => {
  try {
    const records = await Kardex.find()
      .populate("product", "name")  // si el product fue borrado, r.product será null
      .sort({ date: -1 })
      .lean();

    const data = records.map(r => {
      const prod = r.product;
      return {
        id: r._id,
        product: {
          id:   prod?._id  ?? null,
          name: prod?.name ?? "Producto no disponible"
        },
        quantity:    r.quantity,
        action:      r.action,
        date:        r.date,
        employee:    r.employee || { name: "Empleado no disponible", surname: "" },
        reason:      r.reason      ?? null,
        destination: r.destination ?? null
      };
    });

    return res.status(200).json({ success: true, kardex: data });
  } catch (error) {
    console.error("[listKardex] Error al listar kardex:", error);
    return res.status(500).json({
      success: false,
      msg: "Error fetching kardex records ❌",
      error: error.message
    });
  }
};

export const exitProduct = async (req, res = response) => {
  try {
    const { productId, quantity, reason, destination } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found ❌" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, msg: "Insufficient stock ❌" });
    }

    product.stock -= quantity;
    await product.save();

    // asumimos que req.usuario viene inyectado por validarJWT y contiene name/surname
    const { name, surname } = req.usuario;
    const kardexExit = new Kardex({
      product: productId,
      quantity,
      action: "exit",
      employee: { name, surname },
      reason,
      destination
    });

    await kardexExit.save();
    return res.status(200).json({ success: true, msg: "Product exit registered 🎉", kardex: kardexExit });
  } catch (error) {
    console.error("[exitProduct] Error al registrar salida:", error);
    return res.status(500).json({
      success: false,
      msg: "Error registering product exit ❌",
      error: error.message
    });
  }
};
