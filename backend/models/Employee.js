import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    position: { type: String, required: true },

    homeStore: { type: String, ref: "Store", required: true },
    activeStores: [{ type: String, ref: "Store" }], // optional list of stores they can work at
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
