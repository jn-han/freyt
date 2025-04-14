import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    position: {
      type: String,
      enum: ["Management", "Senior Associate", "Associate", "Seasonal"],
      required: true,
    },
    homeStore: { type: String, ref: "Store", required: true },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
