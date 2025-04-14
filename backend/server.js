// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

import storeRoutes from "./routes/storeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/employees", employeeRoutes);
app.use("/stores", storeRoutes);
app.use("/", shipmentRoutes);
app.use("/employees", employeeRoutes);
app.use("/", storeRoutes);

// Sample route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
