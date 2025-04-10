import express from "express";
import {
  createShipment,
  getShipments,
  getShipmentByDate,
  deleteShipmentByDate,
  createManyShipments,
} from "../controllers/shipmentController.js";

const router = express.Router();

// GET /shipments - fetch all
router.get("/", getShipments);

// GET shipment by date (YYYY-MM-DD)
router.get("/:date", getShipmentByDate);

// POST /shipments - create new
router.post("/", createShipment);

// DELETE shipment by date (YYYY-MM-DD)
router.delete("/:date", deleteShipmentByDate);

router.post("/batch", createManyShipments);

export default router;
