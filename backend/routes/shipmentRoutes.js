import express from "express";
import {
  createShipment,
  getShipments,
  getShipmentByDate,
  deleteShipmentByDate,
  createManyShipments,
  createManyShipmentsForStore,
} from "../controllers/shipmentController.js";

const router = express.Router();

//-----STORE SPECIFIC-----
router.post("/shipments/bulk", createManyShipments);

router.post("/stores/:storeId/shipments/bulk", createManyShipmentsForStore);

//-----GLOBAL-----

// GET /shipments - fetch all
router.get("/", getShipments);

// GET shipment by date (YYYY-MM-DD)
router.get("/:date", getShipmentByDate);

// POST /shipments - create new
router.post("/", createShipment);

// DELETE shipment by date (YYYY-MM-DD)
router.delete("/:date", deleteShipmentByDate);

export default router;
