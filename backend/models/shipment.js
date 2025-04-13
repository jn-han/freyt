import mongoose from "mongoose";

// Subschema for Projected items
const projectedSchema = new mongoose.Schema({
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
const actualSchema = new mongoose.Schema({
  units: { type: Number, required: true },
  hours: { type: Number, required: true },
  uph: {
    type: Number,
    default: null,
  },
  allocation: { type: Number, required: true },
  replenishment: { type: Number, required: true },
  ct: { type: Number, required: true },
  psa: { type: Number, required: true },
});

const updateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    in_box: { type: Number, required: true },
    on_mws: { type: Number, required: true },
    to_steam: { type: Number, required: true },
    allo: { type: Number, required: true },
    rep: { type: Number, required: true },
    hours_used: { type: Number, required: true },
    distributed_running: { type: Number, required: true },
    end_time: { type: Date, required: true },
  },
  { timestamps: true }
);

// Main Shipment schema
export const shipmentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    storeNumber: { type: String, required: true },
    dc: {
      type: String,
      required: true,
      enum: ["DC01", "DC03"],
    },
    Projected: projectedSchema,
    Actual: {
      type: actualSchema,
      required: false,
      default: undefined,
    },
    updates: [updateSchema],
    steamBuffer: { type: Number, required: true },
    roster: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  {
    timestamps: true,
  }
);

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
