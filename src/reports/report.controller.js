import exceljs from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import open from "open";
import Product from "../product/product.model.js";
import Kardex from "../kardex/kardex.model.js";

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
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(templatePath);
        const worksheet = workbook.getWorksheet(1);

        let rowIndex = 6;
        kardexEntries.forEach((entry) => {
            worksheet.getCell(`A${rowIndex}`).value = entry.product.name;

            // Asegurarse de que la quantity sea un número entero
            const quantity = parseInt(entry.quantity, 10);
            worksheet.getCell(`B${rowIndex}`).value = quantity;

            // Asegurarse de que Excel lo lea como un número y no como fecha
            const quantityCell = worksheet.getCell(`B${rowIndex}`);
            quantityCell.numFmt = '0'; // Forzar formato de número (sin decimales)

            // Asegurarse de que la fecha sea interpretada correctamente
            const dateFormatted = entry.date instanceof Date ? entry.date : new Date(entry.date);
            const dateCell = worksheet.getCell(`C${rowIndex}`);
            dateCell.value = dateFormatted;
            dateCell.numFmt = 'mm/dd/yyyy'; // Forzar formato de fecha (MM/DD/YYYY)

            worksheet.getCell(`D${rowIndex}`).value = entry.action;
            worksheet.getCell(`E${rowIndex}`).value = `${entry.employee.name} ${entry.employee.surname}`;
            worksheet.getCell(`F${rowIndex}`).value = entry.reason || "N/A";
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

        res.status(200).json({
            success: true,
            message: "Kardex report generated successfully",
            filePath: filePath,
        });

    } catch (error) {
        console.error("Error generating Kardex report:", error);
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to generate the Kardex report",
            error: error.message,
        });
    }
};
