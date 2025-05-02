// src/kardex/kardex.controller.js
import { response } from "express";
import Kardex from "./kardex.model.js";
import Product from "../product/product.model.js";

export const listKardex = async (req, res = response) => {
  try {
    // obtener todos los registros de kardex, populando nombre del producto
    const records = await Kardex.find()
      .populate("product", "name")
      .sort({ date: -1 })  // opcional: los más recientes primero
      .lean();

    res.status(200).json({
      success: true,
      kardex: records.map(r => ({
        id:          r._id,
        product:     { id: r.product._id, name: r.product.name },
        quantity:    r.quantity,
        action:      r.action,
        date:        r.date,
        employee:    r.employee,
        reason:      r.reason || null,
        destination: r.destination || null
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
    if (!product) return res.status(404).json({ success: false, msg: "Product not found ❌" });
    if (product.stock < quantity) return res.status(400).json({ success: false, msg: "Insufficient stock ❌" });
    product.stock -= quantity;
    await product.save();
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
    res.status(200).json({ success: true, msg: "Product exit registered 🎉", kardex: kardexExit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Error registering product exit ❌", error: error.message });
  }
};

