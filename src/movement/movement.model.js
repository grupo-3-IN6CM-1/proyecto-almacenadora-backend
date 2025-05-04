// models/Movement.js
import { Schema, model } from 'mongoose';

const movementSchema = new Schema(
  {
    // Fecha del movimiento (si no envías, se toma Date.now)
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Cantidad que entró
    quantityIn: {
      type: Number,
      required: true,
      default: 0,
    },
    // Cantidad que salió
    quantityOut: {
      type: Number,
      required: true,
      default: 0,
    },
    // Referencia al producto afectado
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // (Opcional) quién registró el movimiento
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default model('Movement', movementSchema);
