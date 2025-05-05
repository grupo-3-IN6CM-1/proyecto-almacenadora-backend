import Category from "./category.model.js";
import Product from "../product/product.model.js";

export const listCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true })
        res.json({
            success: true,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to get the categories",
            error
        })
    }
}

export const addCategory = async (req, res) => {
    try {

        const { name } = req.body;
        const existCategory = await Category.findOne({ name });

        if (existCategory) {
            return res.status(400).json({
                success: false,
                message: `Category with name ${name} already exists`
            })
        }

        const category = new Category({ name })
        await category.save()

        res.status(200).json({
            success: true,
            message: `Category ${name} created succesfully`,
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to create the category",
            error
        })
    }
}

export const updateCategory = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category not found 🔍❌"
            });
        }

        category.name = name || category.name;
        await category.save();

        res.status(200).json({
            success: true,
            msg: "Category updated successfully ✅",
            category
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating category ❌",
            error
        });
    }
};


export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                message: "Category not found 🔍❌"
            });
        }

        let defaultCategory = await Category.findOne({ name: "Default" });

        if (!defaultCategory) {
            defaultCategory = new Category({ name: "Default" });
            await defaultCategory.save();
        }

        await Category.findByIdAndUpdate(id, { status: false });

        await Product.updateMany({ category: id }, { $set: { category: defaultCategory._id } });

        res.status(200).json({
            success: true,
            message: "Category deactivated successfully and products reassigned to Default",
            category: categoryToDelete
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to deactivate the category",
            error
        });
    }
};

