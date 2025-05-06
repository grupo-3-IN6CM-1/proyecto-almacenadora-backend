import { response } from "express";
import Product from "../product/product.model.js";
import Kardex from "../kardex/kardex.model.js";
import exceljs from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

export const generateAndOpenProductsReport = async (req, res = response) => {
  try {
    const products = await Product.find().populate("category", "name").lean();
    if (!products.length) {
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
    products.forEach(product => {
      worksheet.getCell(`A${rowIndex}`).value = product._id;
      worksheet.getCell(`B${rowIndex}`).value = product.name;
      worksheet.getCell(`C${rowIndex}`).value = product.description;
      worksheet.getCell(`D${rowIndex}`).value = product.price;
      worksheet.getCell(`E${rowIndex}`).value = product.stock;
      worksheet.getCell(`F${rowIndex}`).value = product.category?.name ?? "N/A";
      worksheet.getCell(`G${rowIndex}`).value = product.supplier;
      worksheet.getCell(`H${rowIndex}`).value = product.entry_date;
      worksheet.getCell(`I${rowIndex}`).value = product.expiration_date;
      rowIndex++;
    });

    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const filePath = path.join(reportsDir, "Products_Report.xlsx");
    await workbook.xlsx.writeFile(filePath);
    await open(filePath);

    res.status(200).json({
      success: true,
      message: "Report generated successfully and opened in Excel",
      filePath
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

export const generateKardexReport = async (req, res = response) => {
  try {
    const kardexEntries = await Kardex.find()
      .populate("product", "name")
      .lean();

    if (kardexEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Kardex entries found",
      });
    }

    const templatePath = path.join(__dirname, "../templates/Kardex_Report.xlsx");
    const workbook     = new exceljs.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    let rowIndex = 6;
    kardexEntries.forEach((entry) => {
      const productName = entry.product?.name ?? "Producto no disponible";
      const quantity    = Number.isFinite(entry.quantity)
        ? entry.quantity
        : parseInt(entry.quantity, 10) || 0;

      const dateFormatted = entry.date
        ? entry.date instanceof Date
          ? entry.date
          : new Date(entry.date)
        : new Date();

      const employeeName = entry.employee
        ? `${entry.employee.name || ""} ${entry.employee.surname || ""}`.trim()
        : "Empleado no disponible";

      worksheet.getCell(`A${rowIndex}`).value = productName;

      const qtyCell = worksheet.getCell(`B${rowIndex}`);
      qtyCell.value = quantity;
      qtyCell.numFmt = "0";

      const dateCell = worksheet.getCell(`C${rowIndex}`);
      dateCell.value = dateFormatted;
      dateCell.numFmt = "mm/dd/yyyy";

      worksheet.getCell(`D${rowIndex}`).value = entry.action || "—";
      worksheet.getCell(`E${rowIndex}`).value = employeeName;
      worksheet.getCell(`F${rowIndex}`).value = entry.reason      || "N/A";
      worksheet.getCell(`G${rowIndex}`).value = entry.destination || "N/A";

      rowIndex++;
    });

    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = "Kardex_Report.xlsx";
    const filePath = path.join(reportsDir, fileName);
    await workbook.xlsx.writeFile(filePath);
    await open(filePath);

    return res.status(200).json({
      success: true,
      message: "Kardex report generated successfully",
      filePath,
    });

  } catch (error) {
    console.error("Error generating Kardex report:", error);
    return res.status(500).json({
      success: false,
      message: "Ups, something went wrong trying to generate the Kardex report",
      error: error.message,
    });
  }
};
