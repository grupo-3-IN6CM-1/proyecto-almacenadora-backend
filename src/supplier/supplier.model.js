import { Schema, model } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      maxLength: [100, "Supplier name can't exceed 100 characters"]
    },
    contact: {
      type: String,
      required: [true, "Supplier contact is required"],
    },
    products_supplied: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    status: {
      type: Boolean,
      default: true, 
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model('Supplier', SupplierSchema);
