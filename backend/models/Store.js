import mongoose from "mongoose";
import { shipmentSchema } from "./Shipment.js";

const storeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    shipments: [shipmentSchema],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
