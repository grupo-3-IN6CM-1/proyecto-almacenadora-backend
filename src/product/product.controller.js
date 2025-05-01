import { response } from "express";
import Product from "./product.model.js";
import exceljs from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import open from "open";

export const createProduct = async (req, res = response) => {
    try {
        const { name, description, price, stock, category, supplier, entry_date, expiration_date } = req.body;

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                msg: 'Product already exists ❌'
            });
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            supplier,
            entry_date,
            expiration_date
        });

        await product.save();

        res.status(201).json({
            success: true,
            msg: 'Product created successfully 🎉',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error creating product ❌',
            error: error.message
        });
    }
};

export const updateProduct = async (req, res = response) => {
    try {
        const productId = req.params.id; 
        const { name, description, price, stock, category, supplier, entry_date, expiration_date } = req.body;

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found 🔍❌'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
            stock,
            category,
            supplier,
            entry_date,
            expiration_date
        }, { new: true }); 

        res.status(200).json({
            success: true,
            msg: 'Product updated successfully ✅',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error updating product ❌',
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res = response) => {
    try {
        const productId = req.params.id;

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found 🔍❌'
            });
        }

        existingProduct.status = false; 
        await existingProduct.save();

        res.status(200).json({
            success: true,
            msg: 'Product deactivated successfully ✅',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error deactivating product ❌',
            error: error.message
        });
    }
};

export const searchProducts = async (req, res = response) => {
  try {
    const { name, category, entry_date } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; 
    }
    if (category) {
      filter.category = category;
    }
    if (entry_date) {
      filter.entry_date = { $gte: new Date(entry_date) };
    }

    const products = await Product.find(filter)
        .populate("category", "name")
        .lean()

        products.forEach((product) => {
            if (product.category) {
              product.category = {
                _id: product.category._id,
                name: product.category.name,
              };
            }
          });

          res.status(200).json({
            success: true,
            products
          });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error searching products ❌",
      error: error.message
    });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateAndOpenProductsReport = async (req, res = response) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products were found",
            });
        }

        const templatePath = path.join(__dirname, "../templates/Report_Products.xlsx");

        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet(1);

        let rowIndex = 5;

        products.forEach((product) => {
            worksheet.getCell(`A${rowIndex}`).value = product._id;
            worksheet.getCell(`B${rowIndex}`).value = product.name;
            worksheet.getCell(`C${rowIndex}`).value = product.description;
            worksheet.getCell(`D${rowIndex}`).value = product.price;
            worksheet.getCell(`E${rowIndex}`).value = product.stock;
            worksheet.getCell(`F${rowIndex}`).value = product.category.name;
            worksheet.getCell(`G${rowIndex}`).value = product.supplier;
            worksheet.getCell(`H${rowIndex}`).value = product.entry_date;
            worksheet.getCell(`I${rowIndex}`).value = product.expiration_date;

            rowIndex++;
        });

        const reportsDir = path.join(__dirname, "../reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const fileName = "Products_Report.xlsx"; 
        const filePath = path.join(reportsDir, fileName);

        await workbook.xlsx.writeFile(filePath);

        await open(filePath);

        res.status(200).json({
            success: true,
            message: "Report generated successfully and opened in Excel",
            filePath: filePath,
        });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to generate the report",
            error: error.message,
        });
    }
};