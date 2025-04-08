import mongoose from "mongoose";

// Subschema for Projected items
const projectedItemSchema = new mongoose.Schema({
  units: { type: Number, required: true },
  hours: { type: Number, required: true },
  uph: {
    type: Number,
    required: true,
    default: function () {
      return this.hours > 0 ? this.units / this.hours : 0;
    },
  },
});

// Subschema for Actual items
const actualItemSchema = new mongoose.Schema({
  units: { type: Number, required: true },
  hours: { type: Number, required: true },
  uph: {
    type: Number,
    default: null,
  },
});

// Main Shipment schema
const shipmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  storeNumber: { type: String, required: true },
  dc: {
    type: String,
    required: true,
    enum: ["DC01", "DC03"], // ✅ Enum constraint
  },
  Projected: projectedItemSchema,
  Actual: {
    type: actualItemSchema,
    required: false,
    default: undefined,
  },
});

// Pre-save hook: calculate/round UPH
shipmentSchema.pre("save", function (next) {
  if (
    this.Actual &&
    (this.Actual.uph == null || this.Actual.uph === undefined)
  ) {
    const projected = this.Projected;

    if (projected && projected.uph != null) {
      this.Actual.uph = projected.uph;
    } else {
      this.Actual.uph =
        this.Actual.hours > 0 ? this.Actual.units / this.Actual.hours : 0;
    }
  }

  // ✅ Round UPH to 1 decimal place
  if (this.Projected && typeof this.Projected.uph === "number") {
    this.Projected.uph = parseFloat(this.Projected.uph.toFixed(1));
  }

  if (this.Actual && typeof this.Actual.uph === "number") {
    this.Actual.uph = parseFloat(this.Actual.uph.toFixed(1));
  }

  next();
});

const Shipment = mongoose.model("Shipment", shipmentSchema);
export default Shipment;
