import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        maxLength: [50, "Can't exceed 50 characters"]
    },
    description: {
        type: String,
        required: true,
        maxLength: [500, "Can't exceed 500 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    supplier: {
        type: String,
        required: [true, "Supplier is required"]
    },
    entry_date: {
        type: Date,
        required: [true, "Entry date is required"]
    },
    expiration_date: {
        type: Date 
    },
    status: {
        type: Boolean,
        default: true 
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Product', ProductSchema);
