import express from "express";
import {
  createShipment,
  getShipments,
  getShipmentByDate,
} from "../controllers/shipmentController.js";

const router = express.Router();

// GET /shipments - fetch all
router.get("/", getShipments);

// GET shipment by date (YYYY-MM-DD)
router.get("/:date", getShipmentByDate);

// POST /shipments - create new
router.post("/", createShipment);

export default router;
