import { Schema, model } from "mongoose";

const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      maxLength: [100, "Client name can't exceed 100 characters"]
    },
    contact: {
      type: String,
      required: [true, "Client contact is required"],
      maxLength: [100, "Contact info can't exceed 100 characters"]
    },
    products_acquired: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    status: {
      type: Boolean,
      default: true // El cliente estará activo por defecto
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model("Client", ClientSchema);
