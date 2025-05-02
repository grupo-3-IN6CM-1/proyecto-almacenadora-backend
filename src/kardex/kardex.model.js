// src/kardex/kardex.model.js
import { Schema, model } from "mongoose";

const kardexSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      enum: ['entry', 'exit'],
      required: true
    },
    employee: {
      name: {
        type: String,
        required: true
      },
      surname: {
        type: String,
        required: true
      }
    },
    reason: {
      type: String,
    },
    destination: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model("Kardex", kardexSchema);
